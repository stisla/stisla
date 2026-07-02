## media

A multipurpose row that pairs media with text and an action. The media
slot holds an avatar, icon, image, or any block-sized leading element;
the content slot holds a title, description, and optional meta line;
the action slot holds one or more controls pinned to the row's
inline end. Use it for user lists, settings rows, notifications,
payment methods, files, products — anywhere a list of similar things
shares a layout.

This file is the cross-implementation contract. It describes what a
media is and what it must do; the prop names and slot binding belong to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.media                                    the row — root
  .media__figure                           leading slot — avatar / icon / image
  .media__content                         centre column — title / description / meta
    .media__title                         primary line
    .media__description                   secondary line — muted, regular weight
    .media__meta                          tertiary line — muted, smaller
  .media__action                          trailing slot — buttons / links / form controls
```

**Required parts:** root.

**Optional parts:** every other part. A minimum media is just `.media`
with text inside; the parts only exist to keep typography and spacing
consistent across consumers.

**Slot order.** The DOM order is media → content → action. The visual
order matches under default direction; under RTL the inline-start /
inline-end pins flip automatically because the CSS uses logical
properties (`margin-inline-start: auto` on `.media__action`).

**Action placement.** `.media__action` is a sibling of `.media__content`,
not a child. This is intentional: when the row's interactive surface is
a wrapping `<a>` or `<button>` (e.g. an item that navigates), the
action's own buttons must not be nested inside the wrapping interactive
ancestor. The sibling layout makes this easy to satisfy.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

A plain media has no opt-in state classes. Interactive rows (a link or
button root) derive their hover and focus paint from the host element:

```
a.media:hover                            hover — when the root is an anchor
button.media:hover                       hover — when the root is a button
.media:focus-visible                      keyboard focus
```

A `.media--selectable` row (see Modifiers) adds selection states, read
from the row's own truth rather than a state class:

```
.media--selectable:has(:checked)          native radio / checkbox inside a label
.media--selectable[aria-pressed="true"]   toggle button
.media--selectable[aria-checked="true"]   custom radio / checkbox role
.media--selectable[aria-selected="true"]  listbox option
```

A selected row fills with `--media-bg-selected` and draws an outline in
`--media-border-color-selected`. The outline rides an inset `box-shadow`,
not the border box, so it does not depend on `--media-border-width` and
survives inside a container that has flattened the row border (a
list-group). A list-group additionally collapses the divider next to a
selected row so adjacent selected rows share one border rather than
stacking two.

Implementations may add `[data-state="active"]` for nav selection
patterns (matched rows in a list, current step in a wizard). The class
is reserved by the spec; do not bind other meanings to it.

## 3. Modifiers

```
.media--seamless                             strip border, background, radius
.media--vertical                          stack media / content / action top-to-bottom
.media--selectable                        turn the row into a form control (radio / checkbox / chip / option)
```

**Seamless.** Drops `--media-bg`, `--media-border-width`, and
`--media-radius`. Designed for stacks where a parent owns the frame (a
card body, a sidebar panel, a popover). When a seamless row sits as a
direct child of a `.card`, the host implementation retunes
`--media-padding-inline` / `--media-padding-block` to the card's
paddings so the row's inline edges align with the card's header and
footer paddings.

**Vertical.** Sets `flex-direction: column` on the root and clears the
action's `margin-inline-start: auto` (the inline pin makes no sense on
a column). Stack reads top to bottom: media, content, action.

**Selectable.** Opts the row into being a form control: card-style radio
or checkbox (a `<label>` wrapping a native input), a toggle chip, or a
listbox option. The modifier turns on the affordances (pointer, hover
wash, focus ring on the row or on a control nested in it, selected and
disabled paint); the selected state itself stays on the row's own truth
(`:checked` or an `aria-*` attribute — see States). The modifier gate is
deliberate: a plain media that merely hosts a switch in its action slot
(a setting toggle) never opts in, so it is not mistaken for a selection.

## 4. Behaviour

None. The media is pure layout. It owns no JS class and emits no
lifecycle events. Interactive rows source their behaviour from the host
element type (anchor, button, label).

## 5. Options

None. The media has no runtime options.

## 6. Lifecycle events

None.

## 7. Keyboard

The media itself is never focusable. If the root is an `<a>` or
`<button>`, standard platform keyboard semantics apply unchanged
(Enter / Space on a button, Enter on a link). If the action slot holds
form controls or buttons, they own their own keyboard interactions.

## 8. A11y

**Roles + ARIA.**

- Interactive rows use the appropriate native host: `<a>` for
  navigation, `<button>` for actions, `<label>` when the row paints a
  hidden input's state.
- Static rows use `<div>` (or `<li>` inside a list).
- Implementations must not nest interactive controls inside an
  interactive ancestor. The action slot's sibling placement makes this
  trivial: when the row root is an `<a>`, the action's buttons sit
  outside the link in the DOM tree.

**Focus visibility.** Focus rings appear via `:focus-visible` only,
sourced from `--st-ring` at the theme layer. Clicking the row does
not paint a ring.

**Reduced motion.** The media has no animation; nothing to suppress.

**Forced colours.** Borders, text, and any focus ring remain visible
under `forced-colors: active`. Background fills route through system
colours.

## 9. Tokens

The customisation knobs the media exposes. Defaults live in the SCSS
partial.

**Geometry — set on `.media`.**

| Variable | Affects |
| --- | --- |
| `--media-radius` | Corner radius. Cleared to `0` by `--seamless`. |
| `--media-padding-inline` | Inline padding for the row. Retuned to the card's inline padding when a flush row lives inside a card. |
| `--media-padding-block` | Block padding for the row. Retuned to the card's block padding when a flush row lives inside a card. |
| `--media-gap` | Spacing between figure, content, and action. |

**Surface — set on `.media`.**

| Variable | Affects |
| --- | --- |
| `--media-bg` | Background fill. Cleared to `transparent` by `--seamless`. |
| `--media-color` | Text colour. |
| `--media-border-width` | Border width. Cleared to `0` by `--seamless`. |
| `--media-border-color` | Border colour. |
| `--media-bg-hover` | Background on hover / keyboard highlight of an interactive or selectable row. |
| `--media-bg-selected` | Fill of a selected `--selectable` row. |
| `--media-border-color-selected` | Outline colour of a selected row (drawn as an inset ring). |
| `--media-disabled-opacity` | Dimming of a disabled selectable row. |

**Global tokens consumed.**

`--st-surface` (default bg), `--st-foreground` (text), `--st-border`
(rim), `--st-border-width` (default rim weight),
`--st-muted-foreground` (description + meta), `--st-spacing` (spacing
base behind `space()` paddings + gap).

**Dark-mode flips.** None per-component. All surfaces ride the root
token swap automatically.

## 10. Out of scope for this contract

- Intent-coloured variants (`--primary`, `--success`, `--danger`,
  `--info`, `--warning`) — use `.alert` for notification banners or
  `.badge` for inline tags
- Multi-row list container chrome (shared frame, dividers between rows) —
  that belongs to `.list-group`, which stacks `.media` rows. A single
  selectable row is in scope (see `--selectable`); the container that
  groups them is not
- Drag-handle slot for sortable lists — host implementations may add
  one; the spec stays focused on the static row
- Skeleton / loading paint — wrap with `.placeholders` if needed
- Built-in expand / collapse — pair with `.collapsible` if the row
  needs to reveal a nested body
