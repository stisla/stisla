## Item

A multipurpose row that pairs media with text and an action. The media
slot holds an avatar, icon, image, or any block-sized leading element;
the content slot holds a title, description, and optional meta line;
the action slot holds one or more controls pinned to the row's
inline end. Use it for user lists, settings rows, notifications,
payment methods, files, products — anywhere a list of similar things
shares a layout.

This file is the cross-implementation contract. It describes what an
item is and what it must do; the prop names and slot binding belong to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.item                                    the row — root
  .item__media                           leading slot — avatar / icon / image
  .item__content                         centre column — title / description / meta
    .item__title                         primary line
    .item__description                   secondary line — muted, regular weight
    .item__meta                          tertiary line — muted, smaller
  .item__action                          trailing slot — buttons / links / form controls
```

**Required parts:** root.

**Optional parts:** every other part. A minimum item is just `.item`
with text inside; the parts only exist to keep typography and spacing
consistent across consumers.

**Slot order.** The DOM order is media → content → action. The visual
order matches under default direction; under RTL the inline-start /
inline-end pins flip automatically because the CSS uses logical
properties (`margin-inline-start: auto` on `.item__action`).

**Action placement.** `.item__action` is a sibling of `.item__content`,
not a child. This is intentional: when the row's interactive surface is
a wrapping `<a>` or `<button>` (e.g. an item that navigates), the
action's own buttons must not be nested inside the wrapping interactive
ancestor. The sibling layout makes this easy to satisfy.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

The item itself has no opt-in state classes. Interactive items derive
their hover and focus paint from the host element:

```
a.item:hover                             hover — when the root is an anchor
button.item:hover                        hover — when the root is a button
.item:focus-visible                      keyboard focus
```

Implementations may add `[data-state="active"]` for selection patterns
(matched rows in a list, current step in a wizard) once the use case
lands. The class is reserved by the spec; do not bind other meanings
to it.

## 3. Modifiers

```
.item--flush                             strip border, background, radius
.item--vertical                          stack media / content / action top-to-bottom
```

**Flush.** Drops `--item-bg`, `--item-border`, and `--item-radius`.
Designed for stacks where a parent owns the frame (a card body, a
sidebar panel, a popover). When a flush item sits as a direct child of
a `.card`, the host implementation retunes `--item-padding` to
`--card-padding` so the row's inline edges align with the card's
header and footer paddings.

**Vertical.** Sets `flex-direction: column` on the root and clears the
action's `margin-inline-start: auto` (the inline pin makes no sense on
a column). Stack reads top to bottom: media, content, action.

## 4. Behaviour

None. The item is pure layout. It owns no JS class and emits no
lifecycle events. Interactive rows source their behaviour from the host
element type (anchor, button, label).

## 5. Options

None. The item has no runtime options.

## 6. Lifecycle events

None.

## 7. Keyboard

The item itself is never focusable. If the root is an `<a>` or
`<button>`, standard platform keyboard semantics apply unchanged
(Enter / Space on a button, Enter on a link). If the action slot holds
form controls or buttons, they own their own keyboard interactions.

## 8. A11y

**Roles + ARIA.**

- Interactive items use the appropriate native host: `<a>` for
  navigation, `<button>` for actions, `<label>` when the row paints a
  hidden input's state.
- Static items use `<div>` (or `<li>` inside a list).
- Implementations must not nest interactive controls inside an
  interactive ancestor. The action slot's sibling placement makes this
  trivial: when the row root is an `<a>`, the action's buttons sit
  outside the link in the DOM tree.

**Focus visibility.** Focus rings appear via `:focus-visible` only,
sourced from `--st-ring` at the theme layer. Clicking the item does
not paint a ring.

**Reduced motion.** The item has no animation; nothing to suppress.

**Forced colours.** Borders, text, and any focus ring remain visible
under `forced-colors: active`. Background fills route through system
colours.

## 9. Tokens

The customisation knobs the item exposes. Defaults live in the SCSS
partial.

**Geometry — set on `.item`.**

| Variable | Affects |
| --- | --- |
| `--item-radius` | Corner radius. Cleared to `0` by `--flush`. |
| `--item-padding` | Padding for the row. Multiplied by `--st-density`. Retuned to `--card-padding` when a flush item lives inside a card. |
| `--item-gap` | Spacing between media, content, and action. |

**Surface — set on `.item`.**

| Variable | Affects |
| --- | --- |
| `--item-bg` | Background fill. Cleared to `transparent` by `--flush`. |
| `--item-color` | Text colour. |
| `--item-border` | Full border shorthand (width, style, colour). Cleared to `0` by `--flush`. |

**Global tokens consumed.**

`--st-surface` (default bg), `--st-foreground` (text), `--st-border`
(rim), `--st-muted-foreground` (description + meta), `--st-radius`
(default corner), `--st-density` (padding multiplier).

**Dark-mode flips.** None per-component. All surfaces ride the root
token swap automatically.

## 10. Out of scope for this contract

- Intent-coloured variants (`--primary`, `--success`, `--danger`,
  `--info`, `--warning`) — use `.alert` for notification banners or
  `.badge` for inline tags
- Checkable item pattern (`role="option"`, `aria-selected`) — list
  patterns belong to `.list-group` or to a future combobox / select
  primitive
- Drag-handle slot for sortable lists — host implementations may add
  one; the spec stays focused on the static row
- Skeleton / loading paint — wrap with `.placeholders` if needed
- Built-in expand / collapse — pair with `.collapsible` if the row
  needs to reveal a nested body
