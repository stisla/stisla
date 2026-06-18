// Stages built bundles + raw sources into the publishable package directories.
//
// Run after `npm run build:assets`. Mirrors what `npm publish` will see:
//
//   packages/css/dist/{stisla,stisla-full,components/carousel}.css
//   packages/css/scss/...                ← raw SCSS source (advanced users)
//   packages/css/LICENSE, LICENSES/
//
//   packages/vanilla/dist/{stisla,stisla-full}.js
//   packages/vanilla/dist/components/carousel.js
//   packages/vanilla/dist/chunks/*.js    ← shared Component class etc.
//   packages/vanilla/src/...             ← raw ESM (tree-shakable)
//   packages/vanilla/LICENSE
//
// Re-runnable. Clears the staged dist/scss/src subtrees on each invocation
// but leaves package.json / README.md untouched.

import { cp, mkdir, rm, access, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ASSETS = join(ROOT, 'site-dist', 'assets');
const PKG_CSS = join(ROOT, 'packages', 'css');
const PKG_VAN = join(ROOT, 'packages', 'vanilla');

// Optional components shipped à la carte under dist/components/<name>.{css,js}.
// Add a new entry here when an à-la-carte optional lands; the staging,
// require-checks, and summary loops below pick it up automatically.
const OPTIONALS = ['carousel', 'combobox', 'scroll-area'];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function requireFile(path) {
  if (!(await exists(path))) {
    throw new Error(
      `Missing build artifact: ${path}\n` +
      `Run \`npm run build:assets\` before staging packages.`
    );
  }
}

async function reset(path) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

async function copyFile(src, dest) {
  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest);
}

async function copyDir(src, dest) {
  await cp(src, dest, { recursive: true });
}

async function stageCss() {
  const dist = join(PKG_CSS, 'dist');
  const scss = join(PKG_CSS, 'scss');
  await reset(dist);
  await reset(scss);

  await copyFile(join(ASSETS, 'stisla.css'), join(dist, 'stisla.css'));
  await copyFile(join(ASSETS, 'stisla-full.css'), join(dist, 'stisla-full.css'));
  for (const name of OPTIONALS) {
    await copyFile(
      join(ASSETS, 'components', `${name}.css`),
      join(dist, 'components', `${name}.css`),
    );
  }

  await copyDir(join(ROOT, 'src', 'scss'), scss);

  await copyFile(join(ROOT, 'LICENSE'), join(PKG_CSS, 'LICENSE'));
  await rm(join(PKG_CSS, 'LICENSES'), { recursive: true, force: true });
  await copyDir(join(ROOT, 'LICENSES'), join(PKG_CSS, 'LICENSES'));
}

async function stageVanilla() {
  const dist = join(PKG_VAN, 'dist');
  const src = join(PKG_VAN, 'src');
  await reset(dist);
  await reset(src);

  await copyFile(join(ASSETS, 'stisla.js'), join(dist, 'stisla.js'));
  await copyFile(join(ASSETS, 'stisla-full.js'), join(dist, 'stisla-full.js'));
  for (const name of OPTIONALS) {
    await copyFile(
      join(ASSETS, 'components', `${name}.js`),
      join(dist, 'components', `${name}.js`),
    );
  }
  await copyDir(join(ASSETS, 'chunks'), join(dist, 'chunks'));

  await copyDir(join(ROOT, 'src', 'js'), src);

  await copyFile(join(ROOT, 'LICENSE'), join(PKG_VAN, 'LICENSE'));
}

async function summarize(label, root) {
  const bytes = async (p) => {
    try { return (await stat(p)).size; } catch { return 0; }
  };
  const fmt = (n) => `${(n / 1024).toFixed(1)} KB`;
  const distFiles = [
    'dist/stisla.css', 'dist/stisla-full.css',
    'dist/stisla.js', 'dist/stisla-full.js',
    ...OPTIONALS.flatMap((name) => [
      `dist/components/${name}.css`,
      `dist/components/${name}.js`,
    ]),
  ];
  console.log(`\n${label}`);
  for (const f of distFiles) {
    const size = await bytes(join(root, f));
    if (size) console.log(`  ${f.padEnd(36)} ${fmt(size)}`);
  }
}

async function main() {
  await requireFile(join(ASSETS, 'stisla.css'));
  await requireFile(join(ASSETS, 'stisla.js'));
  await requireFile(join(ASSETS, 'stisla-full.css'));
  await requireFile(join(ASSETS, 'stisla-full.js'));
  for (const name of OPTIONALS) {
    await requireFile(join(ASSETS, 'components', `${name}.css`));
    await requireFile(join(ASSETS, 'components', `${name}.js`));
  }

  await stageCss();
  await stageVanilla();

  await summarize('@stisla/css', PKG_CSS);
  await summarize('@stisla/vanilla', PKG_VAN);
  console.log('\nStaged. Publish with `cd packages/<name> && npm publish --access public`.');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
