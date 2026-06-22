# Tabs

A content-panel switcher. A muted rail hosts triggers; the active trigger
rises out of the rail as a paper pill and reveals its paired panel below
(or beside, in vertical mode). One panel is visible at a time.

This file is the cross-implementation contract. It describes what tabs
are and what they must do; the choice of focus mechanism, ARIA wiring,
event mechanism, API surface, and prop names belongs to each
implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.tabs                                    root, owns orientation + runtime state
  .tabs__list                            the muted rail, hosts triggers
    .tabs__trigger                       one tab control, active becomes paper pill
  .tabs__panel                           content block, paired to a trigger by value
```

**Required parts:** root, list, trigger, panel. A tabs root with no
triggers (or no panels) is invalid.

**Pairing.** Each trigger is paired to a panel by a shared value. The
value is the contract between trigger and panel; how the pairing is
authored (attribute, slot order, sibling index) is per-implementation,
but every panel resolves to exactly one trigger and vice versa.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.tabs[data-orientation="horizontal|vertical"]            root orientation
.tabs__list[data-orientation="horizontal|vertical"]      list orientation
.tabs__trigger[data-orientation="horizontal|vertical"]   trigger orientation
.tabs__trigger[data-state="active|inactive"]             selected trigger
.tabs__trigger[data-disabled]                            unreachable trigger
.tabs__panel[data-state="active|inactive"]               selected panel
.tabs__panel[data-orientation="horizontal|vertical"]     panel orientation
```

**Rules.**

- `data-state="active"` lives on the currently selected trigger and its
  paired panel. All other triggers and panels carry `data-state="inactive"`.
- `data-orientation` is mirrored on every part so styling can branch on
  either parent or child without DOM-walking selectors.
- `[data-disabled]` on a trigger removes it from keyboard navigation and
  click activation, in addition to any native `disabled` attribute the
  trigger element may carry.
- Inactive panels are hidden (`display: none`); the active panel is the
  only one in the accessibility tree.

## 3. Modifiers

```
.tabs--vertical                          rail on inline-start, panels fill inline-end
```

The vertical modifier flips orientation: list becomes a column on the
inline-start side, panels fill the remaining row. Without the modifier,
the tabs are horizontal — list on top, panel below.

The orientation is otherwise tunable via the orientation option (§5),
which the spec treats as authoritative; the modifier is the styling
mirror.

## 4. Behaviour

A tabs root has two lifecycle phases. Implementations satisfy both.

**Initial selection.** On init, the root selects in this order:
1. The value supplied as an explicit option.
2. The trigger whose pre-authored `data-state` is `active`.
3. The first enabled trigger.

The first match wins; if none of the three resolves, the root has no
active tab (valid only when every trigger is disabled).

**Activation.**
1. Resolve the requested value to a trigger; if disabled or unknown,
   abort silently.
2. Flip `data-state` on every trigger and panel to reflect the new
   active value.
3. Update each trigger's `aria-selected` and `tabindex` so only the
   active trigger is tabbable (roving tabindex).

**Activation mode.** Two modes are required:

- *Automatic* (default) — arrow-key navigation moves focus *and* activates
  the focused trigger in one step. Matches the WAI-ARIA APG auto-activation
  pattern.
- *Manual* — arrow-key navigation moves focus only; activation requires
  click, Enter, or Space.

**Programmatic activation.** The imperative API may set the active value
at any time; setting the currently-active value is a no-op. Setting an
unknown or disabled value is silently ignored.

**External triggers.** Elements outside the root may drive selection by
declaring a relationship to the root (e.g. via `aria-controls`) and the
target value. How that wiring is authored is per-implementation; the
contract is that any element can drive a tabs root without the root's
own list having to host the trigger.

## 5. Options

The knobs every implementation must expose. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Initial value | string \| `null` | `null` | When set, selects the matching trigger on init. Falls back to pre-authored active state, then first enabled. |
| Orientation | `'horizontal'` \| `'vertical'` \| `null` | `null` (autodetect) | When `null`, the root reads `.tabs--vertical` to derive orientation; an explicit value overrides. |
| Activation mode | `'automatic'` \| `'manual'` | `'automatic'` | `'automatic'` activates on focus; `'manual'` activates on click / Enter / Space. |

## 6. Lifecycle events

Two lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice.

| Phase | Cancelable | When |
| --- | --- | --- |
| Changing | yes | Before flipping `data-state` on triggers and panels. Cancelling aborts the change; the previous value stays active. |
| Changed | no | After the flip is complete. |

Initial selection on init does not emit `changing` / `changed` — the
events fire only for transitions from one user-facing state to another.

## 7. Keyboard

Keys operate while focus is on a trigger inside the list.

| Key | Orientation | Action |
| --- | --- | --- |
| Arrow Right | Horizontal | Move focus to the next enabled trigger; wraps to the first on the last. In automatic mode, also activates. |
| Arrow Left | Horizontal | Move focus to the previous enabled trigger; wraps to the last on the first. In automatic mode, also activates. |
| Arrow Down | Vertical | Move focus to the next enabled trigger; wraps. In automatic mode, also activates. |
| Arrow Up | Vertical | Move focus to the previous enabled trigger; wraps. In automatic mode, also activates. |
| Home | Both | Move focus to the first enabled trigger. In automatic mode, also activates. |
| End | Both | Move focus to the last enabled trigger. In automatic mode, also activates. |
| Enter / Space | Both | Activate the focused trigger. |
| Tab | Both | Move focus out of the list to the active panel (or the next page element, depending on focus order). |

## 8. A11y

**Roles + ARIA.**

- `.tabs__list` carries `role="tablist"` and `aria-orientation` matching
  the root's resolved orientation.
- Each `.tabs__trigger` carries `role="tab"`, `aria-selected` mirroring
  `data-state`, and `aria-controls` pointing at its paired panel.
- Each `.tabs__panel` carries `role="tabpanel"` and `aria-labelledby`
  pointing at its paired trigger.
- Disabled triggers carry `aria-disabled="true"`.

**Focus management.**

- Roving tabindex: exactly one trigger inside the list is tabbable at a
  time. Active trigger gets `tabindex="0"`; the others get
  `tabindex="-1"`.
- Panels are focusable (`tabindex="0"`) so keyboard users can move Tab
  from the list into the panel content.
- The class wires the ARIA attributes, ids, roles, and tabindex on init
  so authored markup stays minimal.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
trigger paint transition is disabled. The selection flip is instant.

**Forced colours.** The active-trigger fill and the focus ring remain
visible under `forced-colors: active`.

## 9. Tokens

**Component-scoped (set on `.tabs`, override per root or globally).**

| Variable | Affects |
| --- | --- |
| `--tabs-orientation` | Flex direction of the list (`row` / `column`). |
| `--tabs-gap` | Gap between list and panels. |
| `--tabs-list-radius` | Outer rail corner radius. |
| `--tabs-list-height` | Outer rail height in horizontal mode. |
| `--tabs-list-padding-inline` | Inline padding inside the rail. |
| `--tabs-list-padding-block` | Block padding inside the rail. |
| `--tabs-list-gap` | Gap between adjacent triggers. |
| `--tabs-list-bg` | Rail background. |
| `--tabs-list-color` | Rail text colour (inherited as muted resting colour for triggers). |
| `--tabs-trigger-radius` | Trigger corner radius. Defaults to the rail radius minus rail inline padding for concentric corners. |
| `--tabs-trigger-padding-inline` | Trigger horizontal padding. |
| `--tabs-trigger-gap` | Gap between icon and label inside a trigger. |
| `--tabs-trigger-font-size` | Trigger label size. |
| `--tabs-trigger-font-weight` | Trigger label weight. |
| `--tabs-trigger-color-hover` | Trigger label colour on hover (rest only, not the active pill). |
| `--tabs-trigger-bg-active` | Active trigger fill. |
| `--tabs-trigger-color-active` | Active trigger text colour. |
| `--tabs-trigger-border-color-active` | Active trigger border colour. |
| `--tabs-ring` | Focus ring colour on trigger and panel. |
| `--tabs-transition-duration` | Trigger paint transition. |

**Global tokens consumed.**

`--st-radius`, `--st-surface-2`, `--st-muted-foreground`, `--st-foreground`,
`--st-highlight`, `--st-highlight-foreground`, `--st-ring`,
`--st-border-width` (trigger rim weight), `--st-spacing` (spacing base
behind `space()` rail height, paddings, and gaps), `--st-radius-sm`
(focus-ring radius on the panel).

**Dark-mode flips.** None. The rail and active-pill paints read surface
and intent tokens which the theme block re-defines; no per-component
dark logic is required.

## 10. Out of scope for this contract

- Lazy panel rendering — when a panel's contents are constructed is a
  consumer concern; the spec only requires that the active panel is in
  the accessibility tree
- Scrollable / overflowing tab rails — the spec ships a single rail; an
  overflow / scroll-into-view pattern is recipe-level
- Closeable tabs (an "x" on each trigger) — not part of the spec; recipe-
  level composition with a dismiss control
- Drag-to-reorder — not a tabs concern
