import { useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Code } from "~/demo/Code";
import { useTheme } from "~/theme";

export const Route = createFileRoute("/3")({
  component: WhatsNew,
});

/* Live proof — one token, read everywhere. Clicking a swatch sets the primary
 * token on the wrapper and every component inside retints at once. We set two
 * tokens, not one: `--color-primary` is the theme-independent fill, and
 * `--color-primary-emphasis` is the readable text shade that soft chips and
 * links wear. Emphasis is the fill shifted in lightness, darker in light mode
 * and lighter in dark, so we derive it from the same L/C/H per theme rather than
 * hard-coding a second color. This all also follows the top-bar light/dark
 * toggle, since the tokens are what the theme swaps. */
type Swatch = { name: string; l: number; c: number; h: number };
const SWATCHES: Swatch[] = [
  { name: "Violet", l: 0.55, c: 0.21, h: 277 },
  { name: "Blue", l: 0.58, c: 0.17, h: 245 },
  { name: "Emerald", l: 0.6, c: 0.15, h: 162 },
  { name: "Amber", l: 0.72, c: 0.16, h: 65 },
  { name: "Rose", l: 0.62, c: 0.22, h: 12 },
];

const fill = (s: Swatch) => `oklch(${s.l} ${s.c} ${s.h})`;
/* Emphasis tracks the fill's chroma and hue, shifting only lightness: darker on
 * light surfaces, lighter on dark, mirroring how the theme defines it. */
const emphasis = (s: Swatch, dark: boolean) =>
  `oklch(${(s.l + (dark ? 0.05 : -0.05)).toFixed(3)} ${s.c} ${s.h})`;

function ThemeDemo() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [active, setActive] = useState<Swatch>(SWATCHES[0]);

  return (
    <div
      className="not-prose my-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      style={
        {
          "--color-primary": fill(active),
          "--color-primary-emphasis": emphasis(active, dark),
        } as CSSProperties
      }
    >
      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        {SWATCHES.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setActive(s)}
            aria-label={s.name}
            aria-pressed={active.name === s.name}
            className="grid size-8 place-items-center cursor-pointer rounded-full outline-2 outline-offset-2 outline-transparent transition data-[on=true]:outline-foreground"
            data-on={active.name === s.name}
            style={{ background: fill(s) }}
          >
            {active.name === s.name && (
              <Check className="size-4 fill-white" strokeWidth={3} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="button button--primary">
            Primary action
          </button>
          <button type="button" className="button button--primary button--soft">
            Soft
          </button>
          <span className="badge badge--primary">New</span>
          <span className="badge badge--soft badge--primary">8 updates</span>
          <a href="#" className="link">
            View report
          </a>
        </div>

        <div className="flex flex-col gap-2">
          {[
            ["Storage", "82%"],
            ["Bandwidth", "54%"],
          ].map(([label, w]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
                {label}
              </span>
              <div className="lp-bar flex-1">
                <span style={{ width: w }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Live proof — the knob story without the Sass rebuild. Each control writes a
 * `--button-*` variable straight onto the instance, so the button repaints in
 * the browser with nothing recompiled. */
function TuneDemo() {
  const [radius, setRadius] = useState(12);
  const [hue, setHue] = useState(257);
  const [pad, setPad] = useState(28);

  const tone = `oklch(0.64 0.18 ${hue})`;
  const style = {
    "--button-radius": `${radius}px`,
    "--button-padding-inline": `${pad}px`,
    "--button-tone": tone,
    "--button-bg": tone,
    "--button-color": "white",
  } as CSSProperties;

  const controls: [string, number, number, number, number, (v: number) => void, string][] =
    [
      ["radius", radius, 0, 28, 1, setRadius, "px"],
      ["padding", pad, 12, 48, 2, setPad, "px"],
      ["hue", hue, 0, 360, 1, setHue, "°"],
    ];

  return (
    <div className="not-prose my-8 grid gap-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
      <div className="grid min-h-40 place-items-center rounded-xl bg-muted/40 p-8">
        <button type="button" className="button" style={style}>
          Deploy changes
        </button>
      </div>
      <div className="flex flex-col gap-5">
        {controls.map(([label, value, min, max, step, onChange, unit]) => (
          <label key={label} className="flex items-center gap-4">
            <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="min-w-0 flex-1"
              style={{ accentColor: tone } as CSSProperties}
              aria-label={label}
            />
            <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-foreground">
              {value}
              {unit}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function WhatsNew() {
  return (
    <main className="max-w-(--shell-max) mx-auto px-6 sm:px-10">
      <article className="main-container prose dark:prose-invert prose-sm">
        <h1>Stisla 3</h1>
        <p className="lead">
          Stisla started life as a Bootstrap admin theme. Stisla 3 is a full
          rewrite. We dropped Bootstrap, rebuilt every component from scratch, and
          put the whole system on Tailwind tokens. Here is what changed, and why
          we think it was worth it.
        </p>

        <p>The short version of what is new:</p>
        <ul>
          <li>
            <a href="#bootstrap" className="link">
              We dropped Bootstrap
            </a>{" "}
            and rebuilt every component from scratch.
          </li>
          <li>
            <a href="#tokens" className="link">
              One set of tokens
            </a>{" "}
            that every component reads, so themes change in one place.
          </li>
          <li>
            <a href="#knobs" className="link">
              Knobs you turn at runtime
            </a>{" "}
            instead of Sass you edit and rebuild.
          </li>
          <li>
            <a href="#tailwind" className="link">
              Built on Tailwind v4
            </a>
            , using the layer most projects skip.
          </li>
          <li>
            <a href="#utilities" className="link">
              Utilities that still win
            </a>{" "}
            when you need to override at the call site.
          </li>
          <li>
            <a href="#no-build" className="link">
              No build step
            </a>{" "}
            for the vanilla release.
          </li>
          <li>
            <a href="#meridian" className="link">
              Meridian
            </a>
            , a full dashboard template, and{" "}
            <a href="#illustrations" className="link">
              recolorable illustrations
            </a>
            .
          </li>
        </ul>

        <section id="bootstrap">
          <h2>We dropped Bootstrap</h2>
          <p>
            Stisla started on Bootstrap, and when the rewrite began the plan was
            to move to the next Bootstrap. So we ported the components onto it to
            see how it would feel. The thing we kept running into was the variable
            and color system. Bootstrap spans two worlds at once. Some values live
            in Sass and resolve at build time, others live in custom properties
            and resolve in the browser. Following a single color from its Sass
            source all the way to the variable a component reads is more involved
            than it looks.
          </p>
          <p>
            By the time the components were done, theming still never came down to
            turning a single knob, because the two systems stayed mixed. None of
            this is a knock on Bootstrap. It is a complete design system, and that
            is the point of it. We just wanted something different, so we rebuilt
            the foundation.
          </p>
          <p>
            We landed on Tailwind because it already solves the hard part. Tailwind
            v4 ships a considered scale for color, spacing, and type, a{" "}
            <code>@theme</code> block where those tokens live as plain custom
            properties, and a build that resolves everything at once instead of
            splitting values across Sass and the browser. It gives us one place to
            put a value and one way to read it, which is exactly what Bootstrap
            made hard. We build the component layer on top.{" "}
            <Link to="/docs/why-stisla" className="link">
              Why Stisla
            </Link>{" "}
            covers the reasoning in full.
          </p>
        </section>

        <section id="tokens">
          <h2>One theme, read everywhere</h2>
          <p>
            Around thirty semantic tokens name the system&rsquo;s color, type,
            radius, and spacing. Every component draws from that set and nothing
            else, so there is one place to change and nothing drifts out of
            agreement. Change the primary color below and watch every component
            repaint at once. Flip the theme from the top bar and they follow that
            too.
          </p>

          <ThemeDemo />

          <p>
            The tokens are plain custom properties on the root. That is the whole
            trick. There is no palette to regenerate and no build to wait on. Set
            a token and the components that read it update.
          </p>
        </section>

        <section id="knobs">
          <h2>Knobs you turn at runtime</h2>
          <p>
            On top of the shared tokens, each component exposes its own variables,
            like <code>--button-radius</code> and <code>--button-tone</code>, and
            every one falls back to a token. Set a variable and only that instance
            changes, while everything else stays on the theme.
          </p>
          <p>
            In the Bootstrap version, reshaping a button meant editing Sass and
            waiting on a build. Now you set a variable, in the browser. Drag these
            and the button follows right away.
          </p>

          <TuneDemo />

          <p>
            A knob is also a boundary. A component takes only the knobs it was
            built for, so you can retint a button or round its corners and it stays
            a button. When you find yourself reaching past what it offers, that is
            the signal to name a new modifier and define it once.
          </p>
        </section>

        <section id="tailwind">
          <h2>Built on Tailwind</h2>
          <p>
            Tailwind v4 is the scale engine underneath Stisla. Spacing, type,
            color, and the build that tree-shakes what you do not use all come from
            it. We adopt its <code>@theme</code> for tokens and its{" "}
            <code>@layer</code> system for everything on top.
          </p>
          <p>
            Tailwind has two layers, <code>@layer components</code> and{" "}
            <code>@layer utilities</code>, and most projects use only the second.
            Tailwind&rsquo;s own guidance is to extract a component class when you
            see repetition, but the extracting is left to you. Stisla commits to
            the component layer, so your team does not assemble it by hand on every
            screen.
          </p>
          <Code
            lang="css"
            code={`
@layer components {
  .button {
    border-radius: var(--button-radius, var(--radius));
    background: var(--button-bg, var(--button-tone));
  }
}
`}
          />
        </section>

        <section id="utilities">
          <h2>Utilities still win</h2>
          <p>
            Committing to components does not take the escape hatch away. Our
            components sit in <code>@layer components</code> and any utilities you
            add sit in <code>@layer utilities</code>, which comes later in the
            cascade. Utilities win by layer precedence, so a one-off override at
            the call site just works, with no <code>!important</code> and nothing
            to merge.
          </p>

          <div className="not-prose my-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <button type="button" className="button button--primary">
              Default button
            </button>
            <button
              type="button"
              className="button button--primary rounded-none"
            >
              With rounded-none
            </button>
          </div>

          <Code
            lang="html"
            code={`
<!-- the utility wins over the component's radius, deterministically -->
<button class="button button--primary rounded-none">Save</button>
`}
          />
        </section>

        <section id="no-build">
          <h2>No build step</h2>
          <p>
            The vanilla release ships precompiled CSS. A component displays with no
            Tailwind and no Sass present, which is what lets it work in plain HTML,
            Rails templates, Django pages, and Laravel views. Link the stylesheet
            and write the markup.
          </p>
          <Code
            lang="html"
            code={`
<link rel="stylesheet" href="stisla.css" />

<button class="button button--primary">Save</button>
`}
          />
          <p>
            Because the tokens are custom properties on the root, you can still
            retheme this at runtime. Override <code>--color-primary</code> in a
            style block or from JavaScript and every component repaints, with no
            recompile.
          </p>
        </section>

        <section id="meridian">
          <h2>A dashboard to start from</h2>
          <p>
            Stisla 3 ships with Meridian, a full e-commerce admin template built on
            the new components. It is seventeen pages of real screens, from orders
            and products to reports, ready to fork rather than assemble from
            scratch.
          </p>
          <p>
            <Link to="/templates/$name" params={{ name: "meridian" }} className="link">
              See the Meridian template
            </Link>
            .
          </p>
        </section>

        <section id="illustrations">
          <h2>Recolorable illustrations</h2>
          <p>
            Empty states need art, and art usually ignores your theme. Stisla 3
            ships a set of recolorable empty-state illustrations that read your
            tokens, so they match your brand color instead of fighting it. Export
            any of them as SVG or PNG.
          </p>
          <p>
            <Link to="/illustrations" className="link">
              Browse the illustration gallery
            </Link>
            .
          </p>
        </section>

        <section id="roadmap">
          <h2>One spec, many frameworks</h2>
          <p>
            Underneath all of this, Stisla is a design specification. Every
            implementation follows the same contract over the same tokens. The
            vanilla implementation is complete and stable, and it is what exists
            today. React on a headless behavior layer is next, with Vue and Svelte
            on the roadmap.
          </p>
        </section>

        <section>
          <h2>Try it</h2>
          <p>
            That is Stisla 3. Install it in a new project, or read the docs to see
            how the tokens, knobs, and layers fit together.
          </p>
          <div className="not-prose mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/docs/vanilla/installation"
              className="button button--primary button--lg rounded-full"
            >
              Get started
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              to="/docs/why-stisla"
              className="button button--ghost button--neutral button--lg rounded-full"
            >
              Read Why Stisla
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
