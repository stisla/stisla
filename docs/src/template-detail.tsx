import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Download, X } from "lucide-react";
import type { Shot, TemplateMeta } from "./data/templates";
import { useTheme } from "./theme";

/* The presentational shell for a template detail page. Driven entirely by one
 * `TemplateMeta` — it never names a template — so every template renders through
 * this same component. The signature is the hero preview: a browser-chrome frame
 * around a static poster of the real template that links out to the live build
 * (hosted on its own deploy). Everything else stays quiet. */

/* ── Preview ────────────────────────────────────────────────────────────────
 * A static poster inside browser chrome. The whole stage (and the corner icon)
 * links to the live template on its own origin — no iframe, so nothing here is
 * coupled to where the template is hosted. */
function Preview({ meta }: { meta: TemplateMeta }) {
  // The poster follows the docs theme, like the filmstrip; falls back to light.
  const { theme } = useTheme();
  const poster =
    theme === "dark" && meta.posterDark ? meta.posterDark : meta.poster;
  return (
    <div className="tpl-preview">
      <div className="tpl-preview__frame">
        <div className="tpl-preview__bar">
          <span className="tpl-preview__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="tpl-preview__url">{meta.slug} — preview</span>
          <a
            className="tpl-preview__pop"
            href={meta.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live preview in a new tab"
          >
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <a
          className="tpl-preview__stage"
          href={meta.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${meta.name} live preview`}
        >
          <img
            key={poster}
            className="tpl-preview__shot"
            src={poster}
            alt={`${meta.name} preview`}
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
}

/* ── Filmstrip ─────────────────────────────────────────────────────────────
 * A numbered contact sheet of every screen. Placeholder-friendly: each cell
 * falls back to its number + label until a real image lands at `shot.src`. */
type Theme = "light" | "dark";

/* The image for a screen in the chosen theme, falling back to light. */
function shotSrc(shot: Shot, theme: Theme): string {
  return theme === "dark" && shot.srcDark ? shot.srcDark : shot.src;
}

function ShotImage({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="tpl-shot__art" data-empty={broken || undefined}>
      {!broken && (
        // Keyed by src so a theme swap remounts and re-attempts the load.
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
      {broken && (
        <span className="tpl-shot__ph" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </span>
  );
}

function Filmstrip({ meta }: { meta: TemplateMeta }) {
  const [open, setOpen] = useState<number | null>(null);
  // The screenshots follow the docs site's own theme — flip the page to dark and
  // every shot (strip + lightbox) swaps to its dark capture, no separate control.
  const { theme } = useTheme();
  const count = meta.shots.length;

  const move = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  const active = open === null ? null : meta.shots[open];

  return (
    <section className="tpl-section">
      <header className="tpl-section__head">
        <span className="lp-eyebrow">Screens</span>
        <h2 className="lp-h2">All {count}, nothing withheld.</h2>
        <p className="lp-lead">
          Every page ships in the download. Scroll the strip, or open one to
          look closer.
        </p>
      </header>

      <div className="tpl-strip">
        <div className="tpl-strip__inner">
          {meta.shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              className="tpl-shot"
              onClick={() => setOpen(i)}
            >
              <span className="tpl-shot__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ShotImage src={shotSrc(shot, theme)} alt={shot.alt} index={i} />
              <span className="tpl-shot__label">{shot.page}</span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="tpl-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setOpen(null)}
        >
          <div className="tpl-lightbox__bar">
            <span className="tpl-lightbox__count">
              {String((open ?? 0) + 1).padStart(2, "0")} / {count} ·{" "}
              {active.page}
            </span>
            <button
              type="button"
              className="tpl-lightbox__close"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <figure
            className="tpl-lightbox__stage"
            // Clicking the empty area around the image closes; clicking the image
            // itself doesn't (stopPropagation keeps it from reaching the overlay).
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) setOpen(null);
            }}
          >
            <ShotImage
              src={shotSrc(active, theme)}
              alt={active.alt}
              index={open ?? 0}
            />
          </figure>
        </div>
      )}
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export function TemplateDetail({ meta }: { meta: TemplateMeta }) {
  return (
    <main className="tpl">
      {/* Hero: spec rail on the left, the live template on the right. */}
      <section className="tpl-hero">
        <div className="tpl-hero__rail">
          <span className="lp-eyebrow">{meta.kind}</span>
          <h1 className="tpl-title">{meta.name}</h1>
          <p className="lp-lead">{meta.tagline}</p>

          <ul className="tpl-tech" aria-label="Built with">
            {meta.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <dl className="tpl-spec">
            {meta.specs.map((s) => (
              <div className="tpl-spec__row" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="tpl-actions">
            <a
              className="button button--primary button--lg button--pill button--block"
              href={meta.downloadUrl}
              download
            >
              <Download aria-hidden="true" />
              Download
            </a>
            <a
              className="button button--neutral button--ghost button--lg button--pill button--block"
              href={meta.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live preview
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="tpl-hero__preview">
          <Preview meta={meta} />
        </div>
      </section>

      {/* What's included */}
      <section className="tpl-section">
        <header className="tpl-section__head">
          <span className="lp-eyebrow">Included</span>
          <h2 className="lp-h2">What&rsquo;s in the download.</h2>
        </header>
        <div className="tpl-inc-grid">
          {meta.included.map((it) => {
            const Icon = it.icon;
            return (
              <article className="tpl-inc" key={it.title}>
                <span className="tpl-inc__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3 className="tpl-inc__title">{it.title}</h3>
                <p className="tpl-inc__desc">{it.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <Filmstrip meta={meta} />

      {/* Run it / Adopt it — the rich JSX sections, as a numbered sequence. */}
      <section className="tpl-section">
        <header className="tpl-section__head">
          <span className="lp-eyebrow">Get going</span>
          <h2 className="lp-h2">Run it, then make it yours.</h2>
        </header>

        <div className="tpl-guide">
          <div className="tpl-guide__step">
            <span className="tpl-guide__num">01</span>
            <div className="tpl-guide__body">
              <h3 className="tpl-guide__title">Run it</h3>
              <div className="prose dark:prose-invert prose-sm">
                {meta.run()}
              </div>
            </div>
          </div>
          <div className="tpl-guide__step">
            <span className="tpl-guide__num">02</span>
            <div className="tpl-guide__body">
              <h3 className="tpl-guide__title">Adopt it in your project</h3>
              <div className="prose dark:prose-invert prose-sm">
                {meta.adopt()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
