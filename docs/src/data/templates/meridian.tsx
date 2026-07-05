import {
  Blocks,
  Code2,
  LayoutDashboard,
  Palette,
  Shapes,
  Table2,
} from "lucide-react";
import { Code } from "~/demo/Code";
import type { TemplateMeta } from "./types";

/* Meridian — the first Stisla template. Structured facts are data; the two rich
 * sections (run, adopt) are JSX so they can carry <Code> blocks and links. Every
 * word here is grounded in templates/meridian/html/README.md. */

const SHOTS: [string, string][] = [
  ["index", "Dashboard"],
  ["orders", "Orders"],
  ["order-detail", "Order detail"],
  ["order-new", "New order"],
  ["products", "Products"],
  ["product-new", "New product"],
  ["customers", "Customers"],
  ["reports", "Reports"],
  ["settings", "Settings"],
  ["profile", "Profile"],
  ["login", "Sign in"],
  ["register", "Register"],
  ["forgot", "Forgot password"],
  ["blank", "Blank starter"],
  ["404", "404"],
  ["403", "403"],
  ["500", "500"],
];

export const meridian: TemplateMeta = {
  slug: "meridian",
  name: "Meridian",
  kind: "Dashboard template",
  tagline:
    "A self-contained admin starter built on Stisla. Plain HTML, one stylesheet, and a little vanilla JS.",

  specs: [
    { label: "Stack", value: "HTML · Tailwind · Vanilla JS" },
    { label: "Pages", value: "17" },
    { label: "Icons", value: "Solar, inline" },
    { label: "License", value: "MIT" },
  ],
  tech: ["HTML", "Tailwind v4", "Vanilla JS"],

  downloadUrl: "https://stisla-templates.pages.dev/meridian/meridian.zip",
  previewUrl: "https://stisla-templates.pages.dev/meridian/",
  repoUrl: "https://github.com/stisla/stisla",

  poster: "/templates/meridian/preview.png",
  posterDark: "/templates/meridian/preview-dark.png",

  shots: SHOTS.map(([name, label]) => ({
    src: `/templates/meridian/shots/${name}-light.png`,
    srcDark: `/templates/meridian/shots/${name}-dark.png`,
    alt: `Meridian ${label} screen`,
    page: label,
  })),

  included: [
    {
      icon: LayoutDashboard,
      title: "17 pages",
      desc: "Dashboard, orders, products, customers, reports, settings, auth, and error screens.",
    },
    {
      icon: Table2,
      title: "Server-rendered tables",
      desc: "Sorting, filtering, pagination, and search expressed as links and a form your backend reads.",
    },
    {
      icon: Shapes,
      title: "Inline Solar icons",
      desc: "Every icon is copy-paste markup. No icon font, no CDN, no runtime to load.",
    },
    {
      icon: Code2,
      title: "No-build JavaScript",
      desc: "Five first-party scripts loaded as plain script tags. Edit them in place and reload.",
    },
    {
      icon: Palette,
      title: "Themeable",
      desc: "Every page reads the same tokens, so one color change repaints the whole template.",
    },
    {
      icon: Blocks,
      title: "Backend-agnostic",
      desc: "Drops into Laravel Blade, Rails, Django, or plain PHP by copying the markup.",
    },
  ],

  run: () => (
    <>
      <p>
        The download is a self-contained <code>meridian/</code> folder. It links{" "}
        <code>@stisla/vanilla</code> and ApexCharts from a CDN, so it runs with
        no install: unzip it and open a page.
      </p>
      <Code
        lang="bash"
        code={`unzip meridian.zip\nopen meridian/index.html`}
      />
      <p>
        The folder is named <code>meridian/</code> because its navigation links
        are absolute (<code>/meridian/orders.html</code>). Drop the folder at
        your web root and every link resolves.
      </p>
      <p>
        To change the styling you recompile one stylesheet. Install pulls{" "}
        <code>@stisla/style</code> and the Tailwind CLI, then the build turns{" "}
        <code>app.css</code> into the <code>style.css</code> every page links.
      </p>
      <Code
        lang="bash"
        code={`npm install        # @stisla/style + Tailwind CLI\nnpm run build:css  # app.css -> assets/css/style.css`}
      />
    </>
  ),

  adopt: () => (
    <>
      <p>
        Adopting Meridian is copying markup. Each page is plain HTML, so a screen
        is a block you paste into a Blade, ERB, or Django view and wire to your
        data.
      </p>
      <p>
        One edit is mandatory when you move the CSS into your own project. The{" "}
        <code>@source</code> lines at the top of <code>app.css</code> tell
        Tailwind which files to scan for class names. Repoint them at wherever
        your views live.
      </p>
      <Code
        lang="css"
        title="assets/css/app.css"
        code={`@source "../../../app/views/**/*.blade.php";`}
      />
      <p>
        Skip that step and the markup renders unstyled, because the utilities it
        uses are never generated.
      </p>
      <p>
        Icons are <a href="https://icon-sets.iconify.design/solar/">Solar</a>,
        baked in as <code>&lt;svg&gt;</code>. To swap one, copy its markup from
        Iconify and paste it inside an <code>.icon-box</code>. Keep{" "}
        <code>fill="currentColor"</code> so it tracks the surrounding text and
        theme.
      </p>
      <p>
        The five scripts under <code>assets/js/</code> are hand-written and load
        as plain script tags, so you edit them directly. The one piece you
        consume rather than edit is <code>@stisla/vanilla</code>, the framework
        behavior layer, loaded precompiled from the CDN.
      </p>
    </>
  ),
};
