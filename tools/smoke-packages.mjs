// Beta-grade smoke test for @stisla/css + @stisla/vanilla.
//
// What it covers:
// - `npm pack` produces a tarball with the expected file shape
// - Every entry in each package's `exports` map resolves to an existing file
//   after installing the tarballs into a fresh consumer project
// - The vanilla bundle's relative chunk imports (./chunks/, ./integrations/)
//   point at real files
//
// What it does NOT cover (deferred to a real DOM-based smoke once we have
// CI infra): actually instantiating a Dialog, asserting the CSS applies,
// measuring computed styles.
//
// Run: `npm run smoke:packages`

import { execSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, resolve as resolvePath } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CSS_DIR = join(ROOT, 'packages', 'css');
const VAN_DIR = join(ROOT, 'packages', 'vanilla');

const EXPECTED_CSS_EXPORTS = [
  '@stisla/css',
  '@stisla/css/full',
  '@stisla/css/integrations/carousel',
  '@stisla/css/dist/stisla.css',
  '@stisla/css/dist/stisla-full.css',
  '@stisla/css/scss/bundles/stisla.scss',
  '@stisla/css/scss/bundles/stisla-full.scss',
  '@stisla/css/scss/components/_btn.scss',
  '@stisla/css/package.json',
];

const EXPECTED_VAN_EXPORTS = [
  '@stisla/vanilla',
  '@stisla/vanilla/full',
  '@stisla/vanilla/integrations/carousel',
  '@stisla/vanilla/dist/stisla.js',
  '@stisla/vanilla/dist/stisla-full.js',
  '@stisla/vanilla/src/index.js',
  '@stisla/vanilla/src/index-full.js',
  '@stisla/vanilla/src/components/dialog.js',
  '@stisla/vanilla/package.json',
];

function step(msg) {
  console.log(`\n→ ${msg}`);
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runCapture(cmd, opts = {}) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'inherit'], ...opts }).toString().trim();
}

function pack(pkgDir, destDir) {
  const json = runCapture('npm pack --json', { cwd: pkgDir });
  const meta = JSON.parse(json)[0];
  const tarball = join(pkgDir, meta.filename);
  const target = join(destDir, meta.filename);
  run(`mv "${tarball}" "${target}"`);
  return target;
}

function checkBundleChunks(distRoot) {
  // The dist JS files use relative imports across chunks/ and integrations/.
  // A quick guard: every `./chunks/X.js` or `./integrations/X.js` referenced
  // from stisla.js / stisla-full.js / integrations/*.js must exist on disk.
  const bundles = [
    join(distRoot, 'stisla.js'),
    join(distRoot, 'stisla-full.js'),
    join(distRoot, 'integrations', 'carousel.js'),
  ];
  const re = /(?:from|import)\s*["']((?:\.\.?\/)+(?:chunks|integrations)\/[^"']+)["']/g;
  let problems = 0;
  for (const b of bundles) {
    if (!existsSync(b)) { console.error(`  MISSING bundle: ${b}`); problems++; continue; }
    const src = readFileSync(b, 'utf8');
    for (const m of src.matchAll(re)) {
      const target = resolvePath(dirname(b), m[1]);
      if (!existsSync(target)) {
        console.error(`  ${b} references missing chunk: ${m[1]}`);
        problems++;
      }
    }
  }
  return problems;
}

function main() {
  step('Build + stage packages');
  run('npm run build:packages', { cwd: ROOT });

  step('Validate dist relative imports resolve');
  const chunkProblems =
    checkBundleChunks(join(VAN_DIR, 'dist'));
  if (chunkProblems > 0) {
    console.error(`\n${chunkProblems} chunk reference(s) missing. Aborting.`);
    process.exit(1);
  }
  console.log('  ok — all relative chunk imports resolve');

  const tmp = mkdtempSync(join(tmpdir(), 'stisla-smoke-'));
  console.log(`  tmp: ${tmp}`);
  let failed = 0;

  try {
    step('npm pack both packages');
    const cssTar = pack(CSS_DIR, tmp);
    const vanTar = pack(VAN_DIR, tmp);
    console.log(`  ${cssTar.split('/').pop()}`);
    console.log(`  ${vanTar.split('/').pop()}`);

    step('Install tarballs into a fresh consumer project');
    const consumer = join(tmp, 'consumer');
    run(`mkdir -p "${consumer}"`);
    writeFileSync(
      join(consumer, 'package.json'),
      JSON.stringify({ name: 'stisla-smoke-consumer', version: '0.0.0', private: true, type: 'module' }, null, 2),
    );
    run(`npm install --no-audit --no-fund --silent "${cssTar}" "${vanTar}"`, { cwd: consumer });

    step('Resolve every declared export subpath');
    const requireFromConsumer = createRequire(join(consumer, 'package.json'));
    const all = [...EXPECTED_CSS_EXPORTS, ...EXPECTED_VAN_EXPORTS];
    for (const id of all) {
      try {
        const resolved = requireFromConsumer.resolve(id);
        const label = id.padEnd(48);
        const rel = resolved.replace(consumer, '<consumer>');
        console.log(`  ✓ ${label} → ${rel}`);
      } catch (err) {
        console.error(`  ✗ ${id.padEnd(48)} — ${err.code ?? err.message}`);
        failed++;
      }
    }

    step('Sanity: installed package versions match');
    const cssPkg = JSON.parse(readFileSync(join(consumer, 'node_modules', '@stisla', 'css', 'package.json'), 'utf8'));
    const vanPkg = JSON.parse(readFileSync(join(consumer, 'node_modules', '@stisla', 'vanilla', 'package.json'), 'utf8'));
    console.log(`  @stisla/css     ${cssPkg.version}`);
    console.log(`  @stisla/vanilla ${vanPkg.version}`);
    if (cssPkg.version !== vanPkg.version) {
      console.error(`  ✗ version drift between packages`);
      failed++;
    }
  } finally {
    step('Cleanup');
    rmSync(tmp, { recursive: true, force: true });
    console.log(`  removed ${tmp}`);
  }

  if (failed > 0) {
    console.error(`\nSMOKE FAILED — ${failed} problem(s).`);
    process.exit(1);
  }
  console.log('\nSMOKE OK.');
}

main();
