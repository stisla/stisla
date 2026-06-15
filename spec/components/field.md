## Field

A wrapper that groups a label, control, and helper text under one root.
Pairs with any form control (input, select, textarea, checkbox, radio,
switch, slider) and owns the layout contract — label above the control,
helper text below, or label *beside* the control for inline rows. The
field doesn't manage state; consumers wire `for`/`id` and
`aria-describedby` between the parts.

This file is the cross-implementation contract. It describes what a
field is and what it must do; the prop names and composition mechanism
belong to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.field                                   root — vertical stack
  .field__label                          label above the control
  <control>                              any form control (input, select, …)
  .field__description                    optional helper text below the control
  .field__error                          optional error message below the control

.field                                   same root, items inside
  .field__item                           input + label on one row
    <control>                            checkbox / radio / small input / switch
    .field__label                        label beside the control
```

**Required parts:** root. Every other part is optional and may appear
in any order — the spec's CSS lays them out in DOM order.

**Two shapes, one root.** A bare `.field` stacks its parts (label
above, control, helper text below). A `.field` containing `.field__item`
elements treats each item as a row inside the same vertical stack —
useful for checkbox lists, radio groups, settings rows. The same
`.field__label` element class works in both shapes; the spec's CSS
picks up an item context and switches the label to row typography
(regular weight, clickable, unselectable).

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

**Control composition.** The field is a composer: it groups parts but
does not own the control inside it. Implementations may expose the
control slot as a render prop, a child, or an explicit composition pair
(e.g. Base UI's `Field.Root` + `Field.Control`). Either shape satisfies
the contract.

## 2. States

The field has no states of its own. State lives on the control inside.
Two state hooks that field parts respond to:

```
[aria-invalid="true"] on the control     control is invalid — paired
                                         .field__error is the error
                                         surface
.field__item:has(> :is(.checkbox, .radio):disabled) .field__label
                                         input child is disabled — dim
                                         the label and surface
                                         not-allowed
```

`.field__error` is paint-only — its presence in the DOM is the
consumer's responsibility. The spec does not auto-show / hide based on
the control's `aria-invalid` (a future implementation may layer that on
but it is not required at 3.0).

The disabled-label rule above covers `.checkbox` and `.radio`. Other
controls (`.switch`) ship their own disabled-label affordance because
their shape differs.

## 3. Modifiers

```
.field--inline                           flip root to a wrapping
                                         flex row. Use for groups of
                                         .field__item that sit on one
                                         line (radio sets, inline
                                         checkbox lists, toolbar
                                         filters).
.field__item--reverse                    flip child order — label
                                         first, input last (right-edge
                                         affordance, common in
                                         settings rows).
```

`.field--inline` and `.field__item--reverse` are orthogonal; they may
be combined on the same field.

## 4. Behaviour

The field has no JS behaviour. It is a layout-only wrapper. Consumers
own:

- the `for` / `id` association between `.field__label` and the control
- the `aria-describedby` link between the control and any
  `.field__description` / `.field__error`
- the `aria-invalid` toggle on the control

The field reads as static markup at runtime.

## 5. Options

None. The field has no JS options.

## 6. Lifecycle events

None.

## 7. Keyboard

The field has no keyboard handling. The control inside owns focus and
keyboard semantics.

## 8. A11y

**Roles + ARIA.**

- The field root and the item root are plain elements (typically a
  `<div>`). They carry no role.
- `.field__label` is typically a `<label>` element with a `for`
  attribute pointing at the control's `id`. Clicking the label still
  toggles a checkbox / radio via native label semantics. The field
  does not mediate the click.
- Implementations that use a non-`<label>` element (e.g. for a custom
  control) must wire `aria-labelledby` on the control instead.
- `.field__description` and `.field__error` are typically `<p>` or
  `<div>` elements; consumers tie them to the control with
  `aria-describedby` so assistive tech announces them when the control
  receives focus.

**Multiple describedby targets.** When both a description and an error
are present, `aria-describedby` may reference both — space-separated id
list — and screen readers will announce both in DOM order.

**Focus visibility.** The field does not own focus. The control inside
paints its own `:focus-visible` ring.

**Disabled semantics.** Disabled state lives on the control, not on the
field. The item's `:has()` rule reads that state and dims the label
visually; it does not block clicks on the row itself — the disabled
input does that.

**Reduced motion.** No animations.

**Forced colours.** The field has no surfaces; its parts inherit native
text colours under `forced-colors: active`.

## 9. Tokens

The customisation knobs the field exposes. Defaults live in the SCSS
partial.

**Geometry — set on `.field`.**

| Variable | Affects |
| --- | --- |
| `--field-gap` | Vertical gap between parts. |

**Label — set on `.field`.**

| Variable | Affects |
| --- | --- |
| `--field-label-font-size` | Label text size. |
| `--field-label-font-weight` | Label weight when stacked above a control. |
| `--field-label-color` | Label colour. |

**Helper text — set on `.field`.**

| Variable | Affects |
| --- | --- |
| `--field-helper-font-size` | Description and error text size. |
| `--field-helper-color` | Description colour. |
| `--field-error-color` | Error colour. |

**Item — set on `.field__item`.**

| Variable | Affects |
| --- | --- |
| `--field-item-gap` | Horizontal gap between input and label inside an item. |
| `--field-item-padding-y` | Vertical breathing room around the item row. |
| `--field-item-label-font-weight` | Label weight when nested inside an item (overrides the stacked weight). |
| `--field-item-disabled-opacity` | Label dim when the input inside an item is disabled. |

**Inline modifier — set on `.field` (only takes effect with
`.field--inline`).**

`.field--inline` resets `--field-gap` to a wider default so neighbours
don't crowd; consumers may override `--field-gap` per instance.

**Global tokens consumed.**

`--st-foreground` (default label colour),
`--st-muted-foreground` (default description colour),
`--st-danger` (default error colour).

**Dark-mode flips.** None per-component. All surfaces ride the root
token swap automatically.

## 10. Out of scope for this contract

- Validation logic — the field surfaces error tone; whether to render
  `.field__error` and whether to set `aria-invalid="true"` is the
  consumer's choice
- Floating / overlay-style labels — not part of the 3.0 contract
- Required-marker affordance (e.g. a red asterisk) — consumers may
  layer one in `.field__label` directly
- Grouping of multiple fields into a fieldset / legend pair — that's
  a separate composer (not spec'd at 3.0)
- Multi-input items (two inputs sharing one label) — not part of the
  3.0 contract
- Tooltip / popover anchoring on the row — the consumer wires that
  against the input or label directly
