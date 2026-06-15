## Toggle

A two-state press button. Distinct from a button (one-shot action) and
from a switch (form-data on / off). A toggle holds its pressed state
between activations and reads as a chip — outline rest, accent hover,
highlight fill when pressed.

This file is the cross-implementation contract. It describes what a
toggle is and what it must do; the state mechanism, event mechanism,
and prop names belong to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.toggle                                  the visible chip — root
  .toggle__icon                          optional leading icon (or raw <svg> / <i>)
```

**Required parts:** root.

**Optional parts:** icon. Icons may be raw `<svg>` / `<i>` elements or
carry the `.toggle__icon` class; both are sized to the chip's font
size so a sized toggle keeps its icon in proportion.

**Three markup shapes, one paint.** A toggle's pressed state can be
sourced three ways, all of which paint identically:

```
.toggle-input                            visually-hidden input sibling
                                         (for the form-data path)
```

- **JS-driven press button.** A button element with `.toggle` and
  `aria-pressed` reflecting state. No form data; the consumer reads
  state from JS or events.
- **JS-driven single-select group member.** A button element with
  `.toggle`, `role="radio"`, and `data-state="active|inactive"`. Paired
  with siblings in a single-select group (see toggle-group spec).
- **Form-data toggle.** A visually-hidden `<input type="checkbox">` or
  `<input type="radio">` with `.toggle-input`, paired with an adjacent
  `<label class="toggle">`. The browser owns checkbox / radio state;
  the sibling combinator forwards the pressed paint to the label.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.toggle[aria-pressed="true"]             pressed — JS press-button path
.toggle[data-state="active"]             pressed — JS group-member path
.toggle-input:checked + .toggle          pressed — form-data path
.toggle:hover                            hover — accent fill, native pseudo
.toggle:focus-visible                    keyboard focus — ring
.toggle:disabled                         disabled (native button only)
.toggle[aria-disabled="true"]            disabled (non-native or
                                         single-select group member)
```

**Rules.**

- All three pressed sources select to the same paint block. Source
  selection is wiring; the visual is one.
- Native pseudos win where they apply: `:hover`, `:focus-visible`, and
  `:disabled` on the form-data path forward to the adjacent label via
  the sibling combinator.
- The form-data path keeps the `.toggle-input` visually hidden but
  reachable by screen readers and keyboard focus. Focus on the input
  forwards a ring to the visible label.

## 3. Modifiers

```
.toggle--sm                              compact height — 28px under default density
.toggle--lg                              comfortable height — 44px under default density
.toggle--icon-only                       square — width matches height, no horizontal padding
.toggle--icon-round                      pill — opts out of --st-radius for a circular silhouette
```

Default (no size modifier) is 36px under default density — matches the
button baseline so a toggle and a button sit on the same rhythm side by
side.

Size modifiers retune height, padding, font size, and radius. Shape
modifiers (`--icon-only`, `--icon-round`) compose with size modifiers.

## 4. Behaviour

The JS press-button path has one lifecycle event around state changes.
The form-data path has no JS — the browser owns the state, the sibling
combinator owns the paint, and consumers observe via standard
`change` / `input` events on the input element.

**Press / unpress (JS press-button path).**
1. On activation (click, Enter, Space on the focused button), compute
   the next pressed value as the inverse of the current value.
2. Emit the pre-change phase. Cancelling aborts.
3. Flip `aria-pressed` to the next value.
4. Emit the post-change phase.

**Disabled.** When the toggle is disabled (`disabled` attribute on a
button, or `aria-disabled="true"` on any host), activations are
ignored. Disabled state is also reflected visually (reduced opacity,
`not-allowed` cursor, pointer events suppressed).

## 5. Options

The knobs every implementation must expose for the JS press-button
path. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Initial pressed | `boolean \| null` | `null` | `null` reads the initial state from markup. An explicit boolean writes it on init. |

The form-data path has no JS options — initial state is the `checked`
attribute on the input.

## 6. Lifecycle events

Two lifecycle phases must be observable by consumers on the JS press-
button path. The mechanism is the implementation's choice.

| Phase | Cancelable | When |
| --- | --- | --- |
| Changing | yes | Before flipping `aria-pressed`. Detail carries the proposed next pressed value. |
| Changed | no | After flipping `aria-pressed`. Detail carries the new pressed value. |

The form-data path exposes state through the input's native `change`
event; no spec-level wrapper is required.

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Enter / Space | Focus on the toggle | Activate — flip the pressed state |
| Tab | Always | Move focus to / from the toggle in DOM order |

For the form-data path, native button / label / input keyboard
semantics apply unchanged — Space activates a focused checkbox, Space
activates a focused radio, arrow keys move within a radio group.

## 8. A11y

**Roles + ARIA.**

- The JS press-button path uses a `<button>` element with
  `aria-pressed="true|false"`. Required.
- The JS group-member path uses a `<button>` element with `role="radio"`
  and `aria-checked="true|false"`. The spec's CSS additionally reads
  `data-state="active"` so the same paint block covers all three
  pressed sources without duplicating selectors.
- The form-data path uses native `<input type="checkbox">` or
  `<input type="radio">` paired with `<label class="toggle">`. No ARIA
  is required; the browser owns the semantics.

**Focus visibility.** Focus rings appear via `:focus-visible` only —
clicking the toggle does not paint a ring. On the form-data path the
hidden input owns focus and the visible label inherits the ring via
the sibling combinator.

**Disabled semantics.** A disabled native button cannot be activated by
mouse, touch, or keyboard. `aria-disabled="true"` on a non-disabled
host is the alternative for cases where the host needs to remain
focusable but inactive (e.g. group members that should still appear in
the tab order while disabled).

**Reduced motion.** The toggle's colour transition (rest → hover →
pressed) is suppressed when `prefers-reduced-motion: reduce` is set.
State still updates; only the cross-fade is removed.

**Forced colours.** Borders and the focus ring remain visible under
`forced-colors: active`. The pressed paint relies on system colours.

## 9. Tokens

The customisation knobs the toggle exposes. Defaults live in the SCSS
partial.

**Geometry — set on `.toggle`.**

| Variable | Affects |
| --- | --- |
| `--toggle-radius` | Corner radius. Opts in to `--st-radius` via component-scoped fallback. |
| `--toggle-height` | Hard height. Multiplied by `--st-density`. |
| `--toggle-padding-x` | Horizontal padding. Multiplied by `--st-density`. |
| `--toggle-font-size` | Label size. |
| `--toggle-font-weight` | Label weight. |
| `--toggle-gap` | Spacing between icon and label. |

**Rest surface — set on `.toggle`.**

| Variable | Affects |
| --- | --- |
| `--toggle-bg` | Rest background. |
| `--toggle-color` | Rest text colour. |
| `--toggle-border-color` | Rest border colour. |

**Hover surface — set on `.toggle`.**

| Variable | Affects |
| --- | --- |
| `--toggle-hover-bg` | Hover background. |
| `--toggle-hover-color` | Hover text colour. |

**Pressed surface — set on `.toggle`.**

| Variable | Affects |
| --- | --- |
| `--toggle-active-bg` | Pressed background. |
| `--toggle-active-color` | Pressed text colour. |
| `--toggle-active-border-color` | Pressed border colour. Defaults to match the bg so the chip reads as a solid fill. |

**Focus — set on `.toggle`.**

| Variable | Affects |
| --- | --- |
| `--toggle-ring` | Focus ring colour. |

**Global tokens consumed.**

`--st-foreground` (rest text), `--st-border` (rest border),
`--st-accent`, `--st-accent-foreground` (hover surface),
`--st-highlight`, `--st-highlight-foreground` (pressed surface),
`--st-ring` (default focus ring), `--st-density` (height and padding
multiplier), `--st-radius` / `--st-radius-sm` / `--st-radius-lg`
(default radius per size).

**Dark-mode flips.** None per-component. All surfaces ride the root
token swap automatically.

## 10. Out of scope for this contract

- Groups of toggles inside a single pill container — see the
  toggle-group spec
- Switch / form on-off control with track + thumb — see the switch
  spec
- Loading state — toggles are immediate; long-running side effects
  should be wired by the consumer
- Indeterminate state (`aria-pressed="mixed"`) — not required by the
  spec at 3.0
