## Separator

A hairline that splits content into groups, horizontally or vertically.
Decorative by default; opt in to `role="separator"` when the split
carries meaning to assistive tech.

This file is the cross-implementation contract. It describes what a
separator is and what it must do; the prop names, element choice, and
orientation API belong to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.separator                               the rule — root
```

**Required parts:** root.

**Optional parts:** none.

**Element choice.** Horizontal separators should prefer `<hr>` so the
semantics ride the platform (implicit `role="separator"`, picked up by
screen readers without ARIA). Vertical separators have no semantic
element; use `<div>` (or `<span>` in inline contexts) with
`role="separator"` and `aria-orientation="vertical"` when the split
carries meaning, or no role at all when the rule is purely decorative.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

A separator has no states. It is a static visual artefact.

## 3. Modifiers

```
.separator                               horizontal (default)
.separator--vertical                     vertical
```

The vertical modifier assumes a flex-row parent so `align-self: stretch`
sizes the rule to the row's cross axis. A `min-height` floor keeps the
rule visible when the parent is not a flex container (e.g. inline next
to a short label).

## 4. Behaviour

None. A separator never animates, never collapses, never reacts to
input. Implementations must not attach behaviour to the root.

## 5. Options

The knobs every implementation must expose. Default values are
normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | Picks the modifier class and (where applicable) the ARIA orientation. |
| Decorative | `boolean` | `true` | When `true`, omit `role="separator"` so the rule is invisible to assistive tech. When `false`, emit the role (and `aria-orientation` on vertical). |

## 6. Lifecycle events

None.

## 7. Keyboard

None. A separator is never focusable.

## 8. A11y

**Roles + ARIA.**

- Horizontal: `<hr>` carries an implicit `role="separator"`. Decorative
  horizontal separators on a non-`<hr>` host should not emit any role.
- Vertical: a non-`<hr>` host must emit `role="separator"` and
  `aria-orientation="vertical"` when the separator is informative. A
  decorative vertical separator emits neither.
- The separator must not receive focus. Implementations must not add
  `tabindex`.

**Forced colours.** The rule remains visible under `forced-colors:
active` because it paints its own background colour (`--st-border` by
default), which the OS keeps in the high-contrast palette.

**Reduced motion.** Not applicable — the separator never animates.

## 9. Tokens

The customisation knobs the separator exposes. Defaults live in the
SCSS partial.

**Geometry — set on `.separator`.**

| Variable | Affects |
| --- | --- |
| `--separator-thickness` | Rule weight (height for horizontal, width for vertical). |

**Paint — set on `.separator`.**

| Variable | Affects |
| --- | --- |
| `--separator-color` | Rule colour. Tracks `--st-border` by default so the rule sits at the same weight as other framed surfaces. |

**Global tokens consumed.**

`--st-border` (default rule colour). No density multiplier — the rule
weight is a visual hairline, not part of the spacing rhythm.

**Dark-mode flips.** None per-component. The default colour rides the
root token swap automatically because `--st-border` retunes for dark
mode at the theme layer.

## 10. Out of scope for this contract

- Labelled separators (text-in-rule), e.g. "OR" between two sign-in
  options — compose with a sibling text element if needed
- Patterned or dashed rules — override `--separator-color` to a gradient
  or use a custom rule if a project genuinely needs one
- Animated reveal or progressive draw — separators are static
- Tree-view orientation switching via media queries — implementations
  may add it on top, but the spec stays orientation-explicit
