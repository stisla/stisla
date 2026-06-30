import { composer } from "../composer";

// Sidebar style contract — authored ONCE here, consumed by every framework wrapper
// (@stisla/react, /vue, …). Variant values map to BEM modifier classes; knob keys map to
// --sidebar-* CSS vars via the tune={} prop. Base (unmodified) = md size.
// Mirrors src/scss/components/_sidebar.scss → next/packages/style/src/sidebar/sidebar.css.
//
// Compound notes:
//   • This is the ROOT contract (.sidebar). The sub-parts (.sidebar__header / __brand / __menu /
//     __group / __item / __button / …) are static BEM classes with no variants of their own; the
//     React wrappers apply those classes and reuse this same knob namespace so a sub-component's
//     `tune` writes --sidebar-* vars that the cascade distributes (per-instance override, ARCHITECTURE §5).
//   • `collapsed` is a STATE, not a variant — it resolves to the [data-collapsed] ATTRIBUTE
//     (ARCHITECTURE §5 / §11), so the wrapper sets the attribute; it is NOT a class here.
//   • The item-action `--reveal` modifier belongs to the .sidebar__item-action sub-part, handled
//     by that wrapper, not the root.
//
// The full --sidebar-* knob namespace (camelCase, prefix stripped). Exported so the compound
// sub-component wrappers (Sidebar.Header / .Button / …) reuse the SAME typed knob set: a `tune`
// on any sub-part writes --sidebar-* vars that the cascade distributes (per-instance override,
// ARCHITECTURE §5). Single source → the contract can't drift between root and parts.
export const sidebarKnobs = [
  // Shell
  "gap",
  "width",
  "widthCollapsed",
  "bg",
  "color",
  "paddingBlock",
  "paddingInline",
  "transitionDuration",
  // Brand
  "brandColor",
  "brandIconSize",
  "brandGap",
  // Group
  "groupGap",
  "groupTitleColor",
  "groupTitleFontSize",
  "groupTitleFontWeight",
  // Button (item)
  "buttonGap",
  "buttonHeight",
  "buttonPaddingInline",
  "buttonRadius",
  "buttonColor",
  "buttonFontWeight",
  "buttonIconSize",
  "buttonIconColor",
  "buttonBgHover",
  "buttonColorHover",
  "buttonBgActive",
  "buttonColorActive",
  // Item action
  "itemActionSize",
  // Submenu
  "submenuBorderColor",
  "submenuPaddingInlineStart",
  "submenuMarginInlineStart",
] as const;

export type SidebarKnob = (typeof sidebarKnobs)[number];

// ⚠️ Keep the class strings + knob keys in sync with sidebar.css (ARCHITECTURE §11).
export const sidebar = composer({
  base: "sidebar",
  variants: {
    size: { sm: "sidebar--sm", md: "", lg: "sidebar--lg" },
  },
  defaultVariants: { size: "md" },
  knobPrefix: "sidebar",
  knobs: sidebarKnobs,
});
