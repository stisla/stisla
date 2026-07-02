import { composer } from "../composer";

// Button style contract — authored ONCE here, consumed by every framework wrapper
// (@stisla/react, /vue, …). Variant values map to BEM modifier classes; knob keys
// map to --button-* CSS vars via the tune={} prop. Base (unmodified) = md size.
// Mirrors src/scss/components/_btn.scss → packages/style/src/button/button.css.
//
// ⚠️ Keep the class strings + knob keys in sync with button.css (ARCHITECTURE §11).
export const button = composer({
  base: "button",
  variants: {
    tone: {
      primary: "button--primary",
      danger: "button--danger",
      neutral: "button--neutral",
      tertiary: "button--tertiary",
    },
    shape: {
      outline: "button--outline",
      ghost: "button--ghost",
      soft: "button--soft",
    },
    size: { sm: "button--sm", md: "", lg: "button--lg", xl: "button--xl" },
    iconOnly: { true: "button--icon-only" },
    pill: { true: "button--pill" },
    block: { true: "button--block" },
    wrap: { true: "button--wrap" },
  },
  defaultVariants: { size: "md" },
  knobPrefix: "button",
  knobs: [
    "gap",
    "height",
    "paddingInline",
    "fontSize",
    "fontWeight",
    "color",
    "bg",
    "tone",
    "bgHover",
    "bgActive",
    "borderWidth",
    "borderColor",
    "rimMix",
    "radius",
    "bevel",
    "iconSize",
  ] as const,
});
