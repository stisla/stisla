import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
  ArrowRight,
  BarChart3,
  CheckCheck,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const SWEEP = 270;
const START = -135;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  unit,
  accent,
  onChange,
  size = 76,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  accent: string;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ y: number; v: number } | null>(null);
  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
    [min, max, step],
  );

  const t = (value - min) / (max - min);
  const angle = START + t * SWEEP;
  const c = 50;
  const ringR = 40;
  const capR = 34;
  const R = (Math.PI * 2 * ringR * SWEEP) / 360;
  const ringCore = `color-mix(in oklch, ${accent} 72%, white)`;
  const glow = `color-mix(in oklch, ${accent} 55%, transparent)`;

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = drag.current.y - e.clientY;
    onChange(clamp(drag.current.v + (dy / 150) * (max - min)));
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setDragging(false);
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onChange(clamp(value + (e.deltaY < 0 ? step : -step)));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const big = (max - min) / 10;
    const map: Record<string, number> = {
      ArrowUp: step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowLeft: -step,
      PageUp: big,
      PageDown: -big,
    };
    if (e.key === "Home") return (onChange(min), e.preventDefault());
    if (e.key === "End") return (onChange(max), e.preventDefault());
    if (map[e.key] !== undefined) {
      onChange(clamp(value + map[e.key]));
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className="lp-knob relative aspect-square w-full"
        style={{ maxWidth: size, "--lp-accent": accent } as CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="lp-bezel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="42%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </linearGradient>
            <radialGradient id="lp-dial" cx="50%" cy="32%" r="80%">
              <stop offset="0%" stopColor="oklch(0.27 0 0)" />
              <stop offset="62%" stopColor="oklch(0.19 0 0)" />
              <stop offset="100%" stopColor="oklch(0.14 0 0)" />
            </radialGradient>
            <radialGradient id="lp-spec" cx="50%" cy="26%" r="46%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="lp-cast" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3.5"
                floodColor="#000"
                floodOpacity="0.55"
              />
            </filter>
          </defs>

          <circle cx={c} cy={c} r={44} fill="oklch(0.15 0 0)" />

          <path
            d={arcPath(c, c, ringR, START, START + SWEEP)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <path
            className="lp-knob__arc"
            d={arcPath(c, c, ringR, START, START + SWEEP)}
            fill="none"
            stroke={ringCore}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={`${R} 999`}
            strokeDashoffset={R * (1 - t)}
            style={{
              filter: `drop-shadow(0 0 1.5px ${accent}) drop-shadow(0 0 4px ${accent}) drop-shadow(0 0 9px ${glow})`,
            }}
          />

          <g className="lp-knob__cap" filter="url(#lp-cast)">
            <circle cx={c} cy={c} r={capR} fill="url(#lp-bezel)" />
            <circle cx={c} cy={c} r={capR - 1.5} fill="url(#lp-dial)" />
            <ellipse
              cx={c}
              cy={c - 5}
              rx={capR - 10}
              ry={capR - 14}
              fill="url(#lp-spec)"
            />
          </g>

          <g
            className="lp-knob__anim"
            style={{
              transformOrigin: "50px 50px",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <line
              x1={c}
              y1={c - capR + 5}
              x2={c}
              y2={c - capR + 13}
              stroke="rgba(255,255,255,0.72)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-overlay-foreground/50">
          {label}
        </div>
        <div className="font-mono text-xs font-medium tabular-nums text-overlay-foreground">
          {value}
          {unit}
        </div>
      </div>
    </div>
  );
}

type Patch = { radius: number; height: number; pad: number; hue: number };
const PRESETS: { name: string; patch: Patch }[] = [
  { name: "Pill", patch: { radius: 28, height: 56, pad: 44, hue: 257 } },
  { name: "Boxy", patch: { radius: 4, height: 52, pad: 34, hue: 27 } },
  { name: "Compact", patch: { radius: 8, height: 40, pad: 22, hue: 150 } },
];

function HeroInstrument() {
  const [p, setP] = useState<Patch>({
    radius: 14,
    height: 56,
    pad: 44,
    hue: 257,
  });
  const set =
    <K extends keyof Patch>(k: K) =>
    (v: number) =>
      setP((prev) => ({ ...prev, [k]: v }));

  const accent = `oklch(0.64 0.18 ${p.hue})`;
  const label = `oklch(0.72 0.16 ${p.hue})`;
  const btnStyle = {
    "--button-radius": `${p.radius}px`,
    "--button-height": `${p.height}px`,
    "--button-padding-inline": `${p.pad}px`,
    "--button-tone": accent,
    "--button-bg": accent,
    "--button-color": "white",
    "--transition-duration-fast": "0ms",
  } as CSSProperties;

  return (
    <div className="relative min-w-0">
      <div className="lp-unit max-w-lg flex flex-col rounded-2xl p-3.5 text-overlay-foreground select-none">
        <div className="lp-display grid min-h-50 place-items-center rounded-xl px-6 py-10">
          <button
            type="button"
            className="button pointer-events-none"
            style={btnStyle}
          >
            Deploy changes
          </button>
        </div>

        <div className="relative mt-3.5 rounded-2xl px-4 py-5">
          <div className="grid grid-cols-4 gap-2">
            <Knob
              label="radius"
              unit="px"
              value={p.radius}
              min={0}
              max={28}
              step={1}
              accent={accent}
              onChange={set("radius")}
            />
            <Knob
              label="height"
              unit="px"
              value={p.height}
              min={32}
              max={64}
              step={2}
              accent={accent}
              onChange={set("height")}
            />
            <Knob
              label="pad-x"
              unit="px"
              value={p.pad}
              min={12}
              max={56}
              step={2}
              accent={accent}
              onChange={set("pad")}
            />
            <Knob
              label="hue"
              unit="°"
              value={p.hue}
              min={0}
              max={360}
              step={1}
              accent={accent}
              onChange={set("hue")}
            />
          </div>
        </div>

        <pre className="lp-panel mt-3.5 min-w-0 overflow-x-auto rounded-2xl px-4 py-4 font-mono text-xs leading-relaxed">
          <span className="text-overlay-foreground/35">&lt;</span>
          <span className="text-overlay-foreground/80">button</span>{" "}
          <span style={{ color: label }}>class</span>
          <span className="text-overlay-foreground/35">=</span>
          <span className="text-overlay-foreground/55">"button"</span>{" "}
          <span style={{ color: label }}>style</span>
          <span className="text-overlay-foreground/35">=</span>
          <span className="text-overlay-foreground/55">"</span>
          {"\n  --button-radius: "}
          <span style={{ color: accent }}>{p.radius}px</span>;
          {"\n  --button-height: "}
          <span style={{ color: accent }}>{p.height}px</span>;
          {"\n  --button-padding-inline: "}
          <span style={{ color: accent }}>{p.pad}px</span>;
          {"\n  --button-tone: "}
          <span style={{ color: accent }}>oklch(.64 .18 {p.hue})</span>;{"\n"}
          <span className="text-overlay-foreground/55">"</span>
          <span className="text-overlay-foreground/35">&gt;</span>
          {"\n  Deploy changes\n"}
          <span className="text-overlay-foreground/35">&lt;/</span>
          <span className="text-overlay-foreground/80">button</span>
          <span className="text-overlay-foreground/35">&gt;</span>
        </pre>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="lp-eyebrow">{children}</span>;
}

function StaticDial({ t, label }: { t: number; label: string }) {
  const c = 50;
  const r = 34;
  const len = (Math.PI * 2 * r * SWEEP) / 360;
  const angle = START + t * SWEEP;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" className="w-full max-w-16">
        <path
          d={arcPath(c, c, r, START, START + SWEEP)}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          className="lp-dial__arc"
          d={arcPath(c, c, r, START, START + SWEEP)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${len} 999`}
          strokeDashoffset={len * (1 - t)}
        />
        <circle
          cx={c}
          cy={c}
          r={20}
          fill="oklch(0.24 0 0)"
          stroke="rgba(255,255,255,0.06)"
        />
        <g
          style={{
            transformOrigin: "50px 50px",
            transform: `rotate(${angle}deg)`,
          }}
        >
          <line
            x1={c}
            y1={c - 18}
            x2={c}
            y2={c - 11}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-overlay-foreground/45">
        {label}
      </span>
    </div>
  );
}

function Feature({
  title,
  flush,
  children,
}: {
  title: string;
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="lp-feature lp-slab">
      <div
        className={`lp-feature__stage${flush ? " lp-feature__stage--flush" : ""}`}
        {...({ inert: "" } as Record<string, string>)}
      >
        {children}
      </div>
      <div className="lp-feature__foot">
        <span className="lp-feature__name">{title}</span>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <main className="overflow-x-clip max-w-(--shell-max) mx-auto px-6 pb-28 sm:px-10 lg:px-20">
        <section className="pt-14 md:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div>
              <Link
                to="/templates/$name"
                params={{ name: "meridian" }}
                className="badge badge--primary badge--soft py-1 pl-1 pr-4"
              >
                <span className="badge badge--primary mr-1">New</span>
                Meridian dashbaord template is live!
              </Link>
              <h1 className="lp-h1 mt-6">
                Interfaces Built on Constraint,{" "}
                <span className="text-muted-foreground">Meant to Compose</span>
              </h1>
              <p className="lp-lead mt-6 w-10/12">
                Stisla is a set of components that all draw from the same
                tokens. Meant to compose, with little left to configure.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/docs/introduction"
                  className="button button--primary button--lg rounded-full"
                >
                  Get started
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link
                  to="/docs/theming"
                  className="button button--ghost button--neutral button--lg rounded-full"
                >
                  Read the docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <HeroInstrument />
          </div>
        </section>

        <section className="py-20 lg:py-40">
          <div className="max-w-2xl">
            <h2 className="lp-h2 mt-5">Three places to set a value.</h2>
            <p className="lp-lead mt-5">
              A value can live in the theme, on a single component, or inline as
              a utility. All three read the same tokens, so they stay in
              agreement.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <article className="lp-card flex flex-col p-6">
              <header className="flex items-start justify-between">
                <Eyebrow>Tokens</Eyebrow>
              </header>
              <div className="mt-8 flex flex-col gap-5">
                <div className="flex items-center justify-center gap-4">
                  <span className="lp-type__glyph">Aa</span>
                  <div className="flex min-w-0 flex-col gap-[0.2rem]">
                    <span className="lp-type__name">Inter</span>
                    <span className="lp-type__role">Body &amp; interface</span>
                    <span className="lp-type__weights">
                      300 · 400 · 500 · 600
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      {[
                        "var(--color-primary)",
                        "var(--color-success)",
                        "var(--color-warning)",
                        "var(--color-danger)",
                        "var(--color-info)",
                      ].map((bg) => (
                        <span
                          key={bg}
                          className="lp-token"
                          style={{ background: bg }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-8">
                <h3 className="lp-card__title">
                  A fixed set, read everywhere.
                </h3>
                <p className="lp-card__body mt-2">
                  Around thirty semantic tokens name the system&rsquo;s color,
                  type, and shape. A component draws only from that set, so
                  nothing drifts out of agreement.
                </p>
              </div>
            </article>

            <article className="lp-slab flex flex-col p-6">
              <header className="flex items-start justify-between">
                <Eyebrow>Knobs</Eyebrow>
              </header>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <StaticDial t={0.68} label="radius" />
                <StaticDial t={0.4} label="height" />
                <StaticDial t={0.82} label="padding" />
              </div>
              <div className="mt-auto pt-8">
                <h3 className="lp-card__title">Tune one instance.</h3>
                <p className="lp-card__body mt-2">
                  Each component reads named variables like --button-radius and
                  --button-height, and every one falls back to a token. Set a
                  variable to change just that instance.
                </p>
              </div>
            </article>

            <article className="lp-card flex flex-col p-6">
              <header className="flex items-start justify-between">
                <Eyebrow>Scale</Eyebrow>
              </header>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  ["spacing 2", "28%"],
                  ["spacing 4", "44%"],
                  ["spacing 6", "62%"],
                  ["spacing 9", "82%"],
                  ["spacing 12", "100%"],
                ].map(([l, w]) => (
                  <div key={l} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground">
                      {l}
                    </span>
                    <div className="lp-bar flex-1">
                      <span style={{ width: w }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-8">
                <h3 className="lp-card__title">Runs on the Tailwind scale.</h3>
                <p className="lp-card__body mt-2">
                  Spacing, type, radius, and shadow come from Tailwind.
                  Components sit in their own layer, so a utility at the call
                  site still applies.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="py-20 lg:py-40">
          <div className="max-w-2xl">
            <h2 className="lp-h2 mt-6">They all read the same theme.</h2>
            <p className="lp-lead mt-5">
              Everything below is live. Change the primary color or flip to dark
              from the nav and it all updates. Nothing here is styled by hand.
            </p>
          </div>
          <Link
            to="/docs/vanilla/accordion"
            className="button button--neutral button--ghost button--lg button--flush-start mt-4"
          >
            More Components
            <ArrowRight />
          </Link>

          <div className="lp-bento mt-12">
            <Feature title="Card">
              <div className="card w-full">
                <div className="card__header">
                  <span className="card__title">Monthly revenue</span>
                  <div className="card__action">
                    <span className="badge badge--soft badge--success">
                      +12.5%
                    </span>
                  </div>
                </div>
                <div className="card__body">
                  <div className="text-3xl font-semibold tracking-tight">
                    $48,290
                  </div>
                  <p className="card__text text-muted-foreground">
                    8,142 orders across web and retail.
                  </p>
                </div>
              </div>
            </Feature>

            <Feature title="Media">
              <div className="card w-full">
                {[
                  {
                    initials: "SR",
                    bg: "var(--color-primary)",
                    name: "Sonya Ryan",
                    action: "assigned you to Q3 roadmap",
                    time: "12 minutes ago",
                  },
                  {
                    initials: "GB",
                    bg: "var(--color-info)",
                    name: "Gilberto Botsford",
                    action: "left 3 comments on Checkout redesign",
                    time: "1 hour ago",
                  },
                  {
                    initials: "MC",
                    bg: "var(--color-success)",
                    name: "Marcus Chen",
                    action: "merged pull request #248",
                    time: "Yesterday",
                  },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="media media--seamless items-start"
                  >
                    <div className="media__figure mt-0.5">
                      <span className="avatar avatar--sm avatar--circle">
                        <span
                          className="avatar__fallback"
                          style={{ background: r.bg, color: "white" }}
                        >
                          {r.initials}
                        </span>
                      </span>
                    </div>
                    <div className="media__content">
                      <div className="media__title">
                        {r.name}{" "}
                        <span className="font-normal text-muted-foreground">
                          {r.action}
                        </span>
                      </div>
                      <div className="media__meta mt-1">{r.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Feature>

            <Feature title="Menu">
              <div
                className="menu__popup w-56"
                role="menu"
                data-state="open"
                style={{ position: "relative", top: "auto", left: "auto" }}
              >
                <div
                  className="menu__group"
                  role="group"
                  aria-labelledby="lp-menu-head"
                >
                  <h3 className="menu__group-label" id="lp-menu-head">
                    Notifications
                  </h3>
                  <button type="button" className="menu__item" role="menuitem">
                    <CheckCheck />
                    Mark all as read
                  </button>
                  <button type="button" className="menu__item" role="menuitem">
                    <Archive />
                    Archive read
                  </button>
                  <button type="button" className="menu__item" role="menuitem">
                    <Settings />
                    Notification settings
                  </button>
                </div>
                <hr className="menu__separator" role="separator" />
                <button
                  type="button"
                  className="menu__item menu__item--danger"
                  role="menuitem"
                >
                  <Trash2 />
                  Clear inbox
                </button>
              </div>
            </Feature>

            <Feature flush title="Sidebar">
              <div className="card w-full lg:w-8/12 mx-auto">
                <aside className="sidebar">
                  <header className="sidebar__header">
                    <a className="sidebar__brand" href="#">
                      <span>Meridian</span>
                    </a>
                  </header>
                  <div className="sidebar__content">
                    <nav className="sidebar__menu">
                      <div className="sidebar__group">
                        <span className="sidebar__group-title">Store</span>
                        <ul className="sidebar__list">
                          <li className="sidebar__item">
                            <a
                              className="sidebar__button"
                              href="#"
                              aria-current="page"
                            >
                              <LayoutDashboard />
                              <span>Dashboard</span>
                            </a>
                          </li>
                          <li className="sidebar__item">
                            <a className="sidebar__button" href="#">
                              <ShoppingBag />
                              <span>Orders</span>
                            </a>
                            <span className="sidebar__item-action">
                              <span className="badge badge--primary">8</span>
                            </span>
                          </li>
                          <li className="sidebar__item">
                            <a className="sidebar__button" href="#">
                              <Package />
                              <span>Products</span>
                            </a>
                          </li>
                          <li className="sidebar__item">
                            <a className="sidebar__button" href="#">
                              <Users />
                              <span>Customers</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="sidebar__group">
                        <span className="sidebar__group-title">Insights</span>
                        <ul className="sidebar__list">
                          <li className="sidebar__item">
                            <a className="sidebar__button" href="#">
                              <BarChart3 />
                              <span>Reports</span>
                            </a>
                          </li>
                          <li className="sidebar__item">
                            <a className="sidebar__button" href="#">
                              <Settings />
                              <span>Settings</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </aside>
              </div>
            </Feature>

            <Feature flush title="Table">
              <div className="card w-full">
                <div className="table-responsive">
                  <table className="table table--hover table--align-middle">
                    <thead className="table__head--alt">
                      <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Customer</th>
                        <th scope="col" className="text-end">
                          Total
                        </th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "#10428",
                          initials: "AC",
                          bg: "var(--color-primary)",
                          name: "Acme Corp",
                          email: "billing@acme.co",
                          total: "$1,490.00",
                          status: "Processing",
                          tone: "badge--primary",
                        },
                        {
                          id: "#10427",
                          initials: "SR",
                          bg: "var(--color-info)",
                          name: "Sonya Ryan",
                          email: "sonya@ryanco.io",
                          total: "$312.50",
                          status: "Shipped",
                          tone: "badge--info",
                        },
                        {
                          id: "#10425",
                          initials: "MC",
                          bg: "var(--color-success)",
                          name: "Marcus Chen",
                          email: "m.chen@northwind.co",
                          total: "$2,780.00",
                          status: "Completed",
                          tone: "badge--success",
                        },
                        {
                          id: "#10422",
                          initials: "GB",
                          bg: "var(--color-danger)",
                          name: "Gilberto Botsford",
                          email: "g.b@botsford.dev",
                          total: "$86.00",
                          status: "Refunded",
                          tone: "badge--danger",
                        },
                      ].map((o) => (
                        <tr key={o.id}>
                          <th scope="row">
                            <a href="#" className="link">
                              <code>{o.id}</code>
                            </a>
                          </th>
                          <td>
                            <div className="flex items-center gap-3">
                              <span className="avatar avatar--sm avatar--circle">
                                <span
                                  className="avatar__fallback"
                                  style={{ background: o.bg, color: "white" }}
                                >
                                  {o.initials}
                                </span>
                              </span>
                              <div>
                                <div className="font-medium">{o.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {o.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-end font-semibold">{o.total}</td>
                          <td>
                            <span className={`badge badge--soft ${o.tone}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Feature>
          </div>
        </section>
      </main>
    </>
  );
}
