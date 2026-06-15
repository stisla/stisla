# Toggle group

A container that hosts a row (or column) of `.toggle` children inside a
padded interior. The container owns the frame; members go ghost at rest
so the cluster reads as one segmented control rather than as a string of
independent chips. The active member fills with the highlight surface.

Two semantic flavours: a *single* group behaves like a radio set (one
selected at a time); a *multiple* group behaves like an independent press
set (any number selected at once).

This file is the cross-implementation contract. It describes what a
toggle group is and what it must do; the choice of focus mechanism,
ARIA wiring, event mechanism, API surface, and prop names belongs to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.toggle-group                            root, owns the frame and the type
  .toggle                                one member (the toggle component is the part)
```

**Required parts:** root, at least one member. Members are `.toggle`
elements — the toggle component is reused verbatim; the group does not
introduce its own member class. The group restyles members to drop their
individual rim and rest-fill so the cluster reads as one control.

**Form-data variant.** A group may host members of the form-data shape
(a hidden input plus a labelled toggle). When the group detects a
form-data member as a direct child, it leaves selection to the native
browser controls and skips its own JS coordination.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.toggle-group                            container (no state attr at this level)
  .toggle[data-state="active"]           active member (single mode)
  .toggle[aria-checked="true|false"]     selection state (single mode, radio)
  .toggle[aria-pressed="true|false"]     selection state (multiple mode, press)
  .toggle[aria-disabled="true"]          unreachable member
```

**Rules.**

- Single-mode members carry radio semantics: `role="radio"`,
  `aria-checked`, and `data-state="active"` on the selected one. At most
  one member is active at a time; zero is also valid.
- Multiple-mode members carry press semantics: `aria-pressed`. Any
  combination of members may be pressed at once.
- The roving-tabindex pattern (§8) sets exactly one member tabbable; the
  others carry `tabindex="-1"`.

## 3. Modifiers

```
.toggle-group--vertical                  stacked column, full-width members
.toggle-group--sm                        compact rail height
.toggle-group--lg                        roomy rail height
```

The vertical modifier stacks members in a column, stretches them to fill
the container width, and aligns labels start-side. The size modifiers
retune the container's height and outer radius; member padding and gap
stay at the same raw values so the inner clickable area scales with the
container.

## 4. Behaviour

A toggle group has two activation modes, picked at init via the type
option (§5). Implementations satisfy both.

**Type autodetect.** When no explicit type is supplied:
- If the root carries `role="radiogroup"`, or any direct-child `.toggle`
  carries `role="radio"`, the type is single.
- Otherwise the type is multiple.

**Orientation autodetect.** When no explicit orientation is supplied:
- If the root carries `.toggle-group--vertical`, the orientation is
  vertical.
- Otherwise the orientation is horizontal.

**Single mode.**
1. Click / activate a non-active member: deactivate the previously
   active member (if any), activate the clicked one, fire the change.
2. Arrow-key navigation moves focus to the previous / next enabled
   member and *also* selects it (WAI-ARIA radio-group auto-selection).
3. Reactivating the already-active member is a no-op.

**Multiple mode.**
1. Click / activate a member: flip its pressed state, fire the change.
2. Arrow-key navigation moves focus only; commit happens on click,
   Enter, or Space.

**Form-data path.** When the group hosts native form controls, the JS
layer detects this and bails — the browser owns selection. The container
still receives its visual treatment; only the JS coordination is
suppressed.

## 5. Options

The knobs every implementation must expose. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Selection type | `'single'` \| `'multiple'` \| `null` | `null` (autodetect) | Determines radio vs press semantics. |
| Orientation | `'horizontal'` \| `'vertical'` \| `null` | `null` (autodetect) | Controls arrow-key axis and roving direction. |
| Loop at ends | `boolean` | `true` | When `true`, arrow nav wraps from the last enabled member to the first (and vice versa). |
| Roving focus | `boolean` | `true` | When `true`, exactly one member is tabbable at a time. When `false`, every enabled member is in the Tab order. |

## 6. Lifecycle events

Two lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice.

| Phase | Cancelable | When |
| --- | --- | --- |
| Changing | yes | Before flipping selection state on members. Cancelling aborts the change; the previous selection stays. |
| Changed | no | After the flip is complete. |

In single mode, the event payload identifies the new and previous
member and value. In multiple mode, it identifies the affected member,
whether it was pressed or unpressed, and the full set of currently-active
values.

## 7. Keyboard

Keys operate while focus is on a member inside the group.

| Key | Orientation | Action |
| --- | --- | --- |
| Arrow Right | Horizontal | Move focus to the next enabled member. Wraps when looping is enabled. Single mode also selects. |
| Arrow Left | Horizontal | Move focus to the previous enabled member. Wraps when looping is enabled. Single mode also selects. |
| Arrow Down | Vertical | Move focus to the next enabled member. Wraps when looping is enabled. Single mode also selects. |
| Arrow Up | Vertical | Move focus to the previous enabled member. Wraps when looping is enabled. Single mode also selects. |
| Home | Both | Move focus to the first enabled member. Single mode also selects. |
| End | Both | Move focus to the last enabled member. Single mode also selects. |
| Enter / Space | Both | Commit the focused member (single: select; multiple: toggle pressed). Native button activation handles this — no preventDefault. |
| Tab | Both | Move focus out of the group to the next page element. |

## 8. A11y

**Roles + ARIA.**

- Single mode: the root carries `role="radiogroup"` and a consumer-
  supplied `aria-label`. Each member carries `role="radio"` and
  `aria-checked`.
- Multiple mode: the root carries `role="group"` and a consumer-supplied
  `aria-label`. Each member carries `aria-pressed`.
- Disabled members carry `aria-disabled="true"` (in addition to any
  native `disabled` attribute).

**Focus management.**

- Roving tabindex (the default): one member is tabbable; arrow keys
  move focus and (in single mode) selection between members. Tab leaves
  the group.
- Single mode picks the active member as the initial tab stop; if none
  is active yet, the first enabled member.
- Multiple mode picks the first enabled member as the initial tab stop
  until the user focuses a specific one.
- When roving focus is disabled, every enabled member is in the Tab
  order — appropriate when the group acts as a flat menu rather than
  a single composite widget.

**Reduced motion.** No motion in the group itself; the spec inherits
the `.toggle` member's reduced-motion behaviour.

**Forced colours.** The container border, active member fill, and focus
ring on each member remain visible under `forced-colors: active`.

## 9. Tokens

**Component-scoped (set on `.toggle-group`, override per group or
globally).**

| Variable | Affects |
| --- | --- |
| `--toggle-group-radius` | Container corner radius. The member's inner radius is derived from this minus the container padding for concentric corners. |
| `--toggle-group-height` | Container height in horizontal mode. |
| `--toggle-group-padding` | Inner padding inside the container. |
| `--toggle-group-gap` | Gap between adjacent members. |
| `--toggle-group-bg` | Container background. |
| `--toggle-group-border-color` | Container border colour. |

**Global tokens consumed.**

`--st-radius`, `--st-radius-sm` (small modifier), `--st-radius-lg`
(large modifier), `--st-border`, `--st-density`.

The group also depends on the `.toggle` component's tokens — member
visuals (background, border, padding, font, active fill) read from the
toggle's `--toggle-*` surface. Customisation of those visuals belongs
to the toggle spec; the group overrides only `--toggle-radius`,
`--toggle-bg`, and `--toggle-border-color` on its direct children to
go ghost-at-rest.

**Dark-mode flips.** None. The group reads tokens which the theme block
re-defines; no per-component dark logic is required.

## 10. Out of scope for this contract

- The `.toggle` member itself — its anatomy, modifiers, and tokens live
  in the toggle spec; the group merely composes it
- Mixed-type groups (some radio members, some press members in the same
  container) — not supported; a group is single or multiple, not both
- Multi-row / wrapped layouts — the spec ships a single rail; multi-row
  arrangements are a consumer layout concern
- Drag-to-reorder — not a toggle-group concern
