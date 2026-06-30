/* Plain class-name join (clsx-style). Deliberately NOT tailwind-merge: utilities win by
 * @layer order, so there's nothing to merge (ARCHITECTURE §11). Never swap in tailwind-merge. */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
