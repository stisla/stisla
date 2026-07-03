import type { ComponentType, ReactNode, SVGProps } from "react";

/* The cross-template contract. Every template (Meridian today, more later) is one
 * typed record: the structured, repeatable fields live as data; the two genuinely
 * rich sections — how to run, how to adopt — are authored as JSX render functions
 * in the template's own `.tsx` file, so they can use <Code>, live demos, and links
 * without an MDX pipeline. The presentational shell (`TemplateDetail`) reads this
 * shape and never hardcodes a template. Adding a template = one new file + one
 * registry line, no new layout code. */

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/* One preview image. Placeholder-friendly: the shell renders an aspect-ratio slot
 * with the label/number until a real file lands at `src`, so the page ships before
 * the screenshots do. `page` is the enumerated screen name (drives the mono 01/02
 * numbering in the filmstrip). */
export type Shot = {
  /* The light-scheme image (the default the filmstrip shows). */
  src: string;
  /* The dark-scheme image, if captured. The filmstrip's theme toggle swaps to it;
   * screens without one fall back to `src`. */
  srcDark?: string;
  alt: string;
  page: string;
  /* Optional: some screens are wide (full page), some are focused (a card, a form).
   * Defaults to "wide" (16/10-ish). */
  ratio?: "wide" | "tall";
};

/* A "what's included" cell: an icon, a short title, one sentence. */
export type Included = {
  icon: Icon;
  title: string;
  desc: string;
};

/* One row of the mono spec plate in the hero (Stack · Pages · License · …). */
export type Spec = {
  label: string;
  value: string;
};

export type TemplateMeta = {
  slug: string;
  /* Display name, e.g. "Meridian". */
  name: string;
  /* What kind of template, e.g. "Dashboard". Shown as the eyebrow. */
  kind: string;
  /* One short lead sentence: what it is, nothing more. */
  tagline: string;

  /* Structured facts for the spec plate + meta chips. */
  specs: Spec[];
  tech: string[];

  /* Where the download and the live preview point. The template is hosted on its
   * own deploy, so these are absolute cross-origin URLs. */
  downloadUrl: string;
  previewUrl: string;
  repoUrl?: string;

  /* Static hero poster (a screenshot of the live template), served from docs. */
  poster: string;
  /* Dark-scheme hero poster. The preview swaps to it with the docs theme; falls
   * back to `poster` when absent. */
  posterDark?: string;

  /* Screens for the filmstrip. */
  shots: Shot[];

  /* The "what's included" grid. */
  included: Included[];

  /* The two rich sections — authored as JSX in the template file. */
  run: () => ReactNode;
  adopt: () => ReactNode;
};
