import type { TemplateMeta } from "./types";
import { meridian } from "./meridian";

/* The template registry. Keyed by slug so the `/templates/$name` route can look a
 * template up from the URL param. Adding a template = import it and add one line. */
export const TEMPLATES: Record<string, TemplateMeta> = {
  [meridian.slug]: meridian,
};

export function getTemplate(slug: string): TemplateMeta | undefined {
  return TEMPLATES[slug];
}

export type { TemplateMeta, Shot } from "./types";
