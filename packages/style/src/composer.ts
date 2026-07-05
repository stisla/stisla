// Stisla style composer — pure, framework-agnostic.
//
// Maps variant props → BEM modifier classes, and a `tune` object → inline CSS
// custom properties. No framework deps, no hooks, no side effects → SSR/RSC-safe,
// deterministic, importable from React / Vue / Svelte / vanilla alike.
//
// Litmus (ARCHITECTURE §5): resolves to a class → variant prop; resolves to a CSS
// var → tune. See ARCHITECTURE §5 / §5B.

export type VariantDefs = Record<string, Record<string, string>>;

export interface ComposerConfig<
  V extends VariantDefs = VariantDefs,
  K extends string = string,
> {
  /** Base BEM class, e.g. "button". */
  base: string;
  /** variant name → { value → className }. Empty string = valid value, no class. */
  variants?: V;
  /** Default value per variant (e.g. size: "md" when base already is md). */
  defaultVariants?: { [P in keyof V]?: keyof V[P] & string };
  /** CSS-var namespace for knobs, e.g. "button" → --button-<key>. */
  knobPrefix?: string;
  /** Allowed knob keys (camelCase), for typing / autocomplete. */
  knobs?: readonly K[];
}

export type Tune<K extends string> = Partial<Record<K, string>>;

export type ComposerProps<V extends VariantDefs, K extends string> = {
  [P in keyof V]?: (keyof V[P] & string) | boolean;
} & {
  tune?: Tune<K>;
  className?: string;
};

export interface Composed {
  className: string;
  style: Record<string, string>;
}

const camelToKebab = (s: string): string =>
  s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** "--token" → "var(--token)"; anything else is a literal value. */
const resolveTuneValue = (v: string): string =>
  v.startsWith("--") ? `var(${v})` : v;

export function composer<V extends VariantDefs, K extends string>(
  config: ComposerConfig<V, K>,
): (props?: ComposerProps<V, K>) => Composed {
  const { base, variants = {} as V, defaultVariants = {}, knobPrefix } = config;

  return function compose(props: ComposerProps<V, K> = {}): Composed {
    const classes: string[] = [base];

    for (const name in variants) {
      const raw =
        (props as Record<string, unknown>)[name] ??
        (defaultVariants as Record<string, unknown>)[name];
      if (raw == null || raw === false) continue;
      // boolean true → the "true" key (flag variants like iconOnly)
      const key = raw === true ? "true" : String(raw);
      const cls = variants[name]?.[key];
      if (cls) classes.push(cls); // empty string (e.g. size "md") adds nothing
    }

    const style: Record<string, string> = {};
    if (props.tune && knobPrefix) {
      for (const k in props.tune) {
        const val = props.tune[k as K];
        if (val == null) continue;
        style[`--${knobPrefix}-${camelToKebab(k)}`] = resolveTuneValue(val);
      }
    }

    if (props.className) classes.push(props.className);
    return { className: classes.join(" "), style };
  };
}
