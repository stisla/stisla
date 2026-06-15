# Dropdown

A floating menu surface tethered to a trigger control. Opens beside the
trigger, repositions to stay in the viewport, traps keyboard navigation
to its items, and dismisses on outside click, Escape, Tab, or item
activation.

This file is the cross-implementation contract. It describes what a
dropdown is and what it must do; the choice of positioning engine, API
surface, event mechanism, primitive library, and prop names belongs to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.dropdown                                positioning wrapper around the trigger
  <trigger>                              any focusable control (typically .btn)
  .dropdown-menu                         menu surface (positioned by JS)
    .dropdown-menu__header               section label (optional)
    .dropdown-menu__group                role="group" wrapper for items (optional)
    .dropdown-menu__divider              <hr role="separator">
    .dropdown-menu__item                 one row — button or anchor
      .dropdown-menu__icon               leading icon slot (optional)
      .dropdown-menu__indicator          leading check-mark slot (optional)
      .dropdown-menu__shortcut           trailing keyboard hint (optional)
```

**Required parts:** trigger, menu, at least one item.

**Optional parts:** wrapper, header, group, divider, icon, indicator,
shortcut. The trigger does not own a Stisla class — any focusable control
can drive a menu.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance. The wrapper
`.dropdown` is positional sugar — a menu without a wrapper still works as
long as the trigger can be located.

## 2. States

```
.dropdown-menu[data-state="open"]        visible, positioned, keyboard active
.dropdown-menu[data-state="closed"]      hidden (default)
.dropdown-menu__item[data-highlighted]   keyboard-focused row
.dropdown-menu__item[data-state="checked"]    menuitemcheckbox / menuitemradio checked
.dropdown-menu__item[data-state="unchecked"]  menuitemcheckbox / menuitemradio unchecked
.dropdown-menu__item[aria-current="true"]     persistent selected (alt hook)
.dropdown-menu__item[data-state="active"]     persistent selected (alt hook)
.dropdown-menu__item[aria-disabled="true"]    disabled (anchor)
.dropdown-menu__item:disabled                 disabled (button)
html.is-dropdown-open                    page scroll lock while any menu is open
```

**Rules.**

- `data-state` on `.dropdown-menu` lives on the menu surface and reflects
  open / closed. The convention matches what mainstream JS primitive
  libraries emit.
- `data-highlighted` on `.dropdown-menu__item` is the keyboard navigation
  position. Exactly one item carries it while the menu is open and the
  user has pressed any keyboard nav key. Mouse hover does **not** set
  `data-highlighted` — hover paints `:hover` via CSS without touching the
  attribute. This matches native menu semantics.
- `data-state="checked|unchecked"` on items reflects checkbox / radio
  selection. `aria-checked` mirrors it.
- `aria-current="true"` and `data-state="active"` are alternate hooks for
  persistent selected state (e.g. the current sort order). Both paint
  identically; consumers pick whichever fits their semantics. Hover does
  **not** override active paint — the selected row stays highlighted on
  hover so the persistent state stays visible.
- `:disabled` covers `<button>` items; `[aria-disabled="true"]` covers
  `<a>` items (which have no native disabled attribute).
- `.is-dropdown-open` on `<html>` locks page scroll while at least one
  dropdown is open. Stacked opens use a refcount. The lock prevents the
  menu's fixed position from drifting against scrolling content.

## 3. Modifiers

```
.dropdown-menu__item--danger             destructive variant — danger colour text + soft danger hover bg
```

The menu surface has no size variants — width is content-driven within
`--dropdown-width-min` and `max-content` bounds, and height is capped to
the available viewport space.

## 4. Behaviour

A dropdown has four lifecycle phases. Implementations satisfy all four.

**Open.**
1. Capture currently-focused element (for return on close).
2. If this is the first open dropdown, apply scroll lock to `<html>`
   (`.is-dropdown-open`). Otherwise increment the refcount.
3. Compute initial position beside the trigger and apply it to the menu.
4. Subscribe to scroll / resize so the menu repositions in real time if
   the trigger moves. (Outside of motion, the lock holds the page still.)
5. Flip `data-state` to `open` on the menu and `aria-expanded` to `true`
   on the trigger. Transition the menu opacity + translate per the CSS.
6. Move focus to the menu container (so document-level keydown sees the
   menu in the focus chain). No item is highlighted yet — the first
   keyboard nav keypress seeds `data-highlighted` lazily.

**Close.**
1. Tear down the positioning subscription.
2. Tear down document keydown / pointerdown listeners.
3. Clear typeahead buffer.
4. Flip `data-state` to `closed` on the menu and `aria-expanded` to
   `false` on the trigger. Clear any `data-highlighted` attribute.
5. After transition end, decrement the refcount; if zero, remove
   `.is-dropdown-open` from `<html>`.
6. Return focus to the element captured in Open step 1, unless
   suppressed (e.g. Tab-dismiss).

**Dismiss.**
1. Five triggers:
   - Press Escape while the menu has document focus
   - Press Tab while the menu has document focus (focus then advances
     naturally without return)
   - Click outside the menu and outside the trigger
   - Click an item (when auto-close opt allows)
   - Programmatic close
2. Outside click honours the auto-close option.
3. Item-click honours the auto-close option per item — a per-item opt-out
   may keep the menu open after activation.

**Item selection.**
- Plain `menuitem`: activates and (by default) closes the menu.
- `menuitemcheckbox`: flips its own `data-state` / `aria-checked` between
  checked and unchecked. Does not affect siblings.
- `menuitemradio`: flips its own state to checked and flips every sibling
  radio inside the same `role="group"` (or the menu if no group) to
  unchecked.

**Positioning.**
- The menu is positioned in viewport coordinates so any ancestor with
  `overflow: hidden` (or scroll, clip) can't crop it.
- The menu flips to the opposite side when the preferred placement would
  overflow the viewport.
- The menu shifts along the cross axis to stay on screen when the
  preferred alignment would clip.
- Available height is measured at open time; the menu's max-height is
  capped so it never extends past the viewport, and its content scrolls
  internally if it would otherwise overflow.

## 5. Options

The knobs every implementation must expose. Default values are normative.
Implementations name and shape them idiomatically — the contract is the
behaviour, not the key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Placement | placement keyword | `bottom-start` | Preferred side and alignment of the menu relative to the trigger. |
| Offset | `number` (px) | `8` | Distance between the menu and the trigger. |
| Auto-close | `'both'` \| `'outside'` \| `'inside'` \| `false` | `'both'` | Whether outside clicks (`outside`), inside item clicks (`inside`), both, or neither close the menu. |
| Initial focus | `boolean` | `true` | Whether opening moves focus to the menu container. |

Per-item auto-close opt-out is required: an item may declare that
activating it should not close the menu (e.g. a checkbox row inside a
multi-select menu). The mechanism is the implementation's choice.

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and when
each one is observable relative to the lifecycle in §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes and the menu is positioned. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the close. |
| Closed | no | After the close transition completes and focus is restored. |

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Enter / Space | Focus on trigger | Open the menu |
| Escape | Menu open | Close the menu, return focus to trigger |
| Tab | Menu open | Close the menu, let focus advance naturally (no return) |
| ArrowDown | Menu open | Move highlight to next enabled item. Seeds at first enabled item if none highlighted. |
| ArrowUp | Menu open | Move highlight to previous enabled item. Seeds at last enabled item if none highlighted. |
| Home | Menu open | Move highlight to first enabled item |
| End | Menu open | Move highlight to last enabled item |
| Enter / Space | Item highlighted | Activate the highlighted item |
| Printable character | Menu open | Typeahead — jump highlight to next enabled item whose label starts with the buffered string. Buffer clears after 500ms of inactivity. |

Disabled items are skipped by every navigation key and by typeahead.

## 8. A11y

**Roles + ARIA.**

- The menu surface carries `role="menu"`.
- Items carry one of `role="menuitem"`, `role="menuitemcheckbox"`, or
  `role="menuitemradio"`.
- A group of related items (e.g. a radio cohort) sits inside an element
  with `role="group"`.
- The trigger carries `aria-haspopup="menu"`, `aria-expanded`
  reflecting menu open state, and `aria-controls` pointing at the menu's
  id.
- `aria-checked` on checkbox / radio items mirrors `data-state="checked"`
  / `unchecked`.
- `aria-disabled="true"` on anchor-based items; `:disabled` on
  button-based items.
- `.dropdown-menu__divider` is `<hr role="separator">`.

**Focus management.**

- On open, focus moves to the menu container (with `tabindex="-1"`) so
  document-level keydown can route navigation keys.
- The keyboard navigation position lives on the highlighted item via
  `data-highlighted`. Implementations may also move DOM focus to the
  highlighted item; native `:focus-visible` is suppressed for items so
  two competing indicators don't display at once.
- On close, focus returns to the element that was focused immediately
  before open — unless Tab-dismiss let focus advance, in which case the
  return is skipped.

**Scroll lock.** The page behind a dropdown does not scroll. The
implementation applies `.is-dropdown-open` to `<html>`; the CSS handles
the rest (`overflow: hidden`, `scrollbar-gutter: stable`). This matches
the dialog / drawer convention.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
menu opacity + translate transition is disabled. The menu still opens /
closes; only the motion is suppressed.

**Forced colours.** Item highlight, item active paint, and focus rings
remain visible under `forced-colors: active`.

## 9. Tokens

The customisation knobs the dropdown exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects. Tuning a default is a non-breaking change as long as the var
name and its surface stay the same.

**Component-scoped (set on `.dropdown-menu`, override per menu or globally).**

| Variable | Affects |
| --- | --- |
| `--dropdown-width-min` | Minimum menu width. |
| `--dropdown-padding` | Padding inside the menu surface around the items. |
| `--dropdown-radius` | Outer corner radius of the menu. |
| `--dropdown-item-radius` | Inner item radius — derives from outer radius minus padding so item chips sit cleanly inset. |
| `--dropdown-gap` | Vertical gap between items. |
| `--dropdown-z-index` | Stack order. |
| `--dropdown-font-size` | Menu font size. |
| `--dropdown-bg` | Menu surface background. |
| `--dropdown-color` | Menu surface text colour. |
| `--dropdown-border-color` | Menu surface border colour. |
| `--dropdown-shadow` | Drop shadow under the menu. |
| `--dropdown-item-padding-y` | Vertical padding on each item. Multiplied by `--st-density`. |
| `--dropdown-item-padding-x` | Inline padding on each item. Multiplied by `--st-density`. |
| `--dropdown-item-min-height` | Minimum row height. Multiplied by `--st-density`. |
| `--dropdown-item-gap` | Gap between an item's icon, label, and shortcut. |
| `--dropdown-item-icon-size` | Square size of an item icon, indicator, and shortcut chip. |
| `--dropdown-item-bg-hover` | Item background on hover and keyboard highlight. |
| `--dropdown-item-color-hover` | Item text colour on hover and keyboard highlight. |
| `--dropdown-item-bg-active` | Item background when persistent selected. |
| `--dropdown-item-color-active` | Item text colour when persistent selected. |
| `--dropdown-item-color-disabled` | Item text colour when disabled. |
| `--dropdown-item-color-danger` | Item text colour for the danger variant. |
| `--dropdown-item-bg-danger-hover` | Soft danger tint background on a danger item's hover and keyboard highlight. |
| `--dropdown-header-padding-y` | Header vertical padding. |
| `--dropdown-header-padding-x` | Header inline padding. |
| `--dropdown-header-font-size` | Header text size. |
| `--dropdown-header-font-weight` | Header text weight. |
| `--dropdown-header-color` | Header text colour. |
| `--dropdown-divider-color` | Divider line colour. |
| `--dropdown-divider-margin-y` | Vertical breathing room around the divider. |
| `--dropdown-shortcut-color` | Trailing shortcut chip text colour. |
| `--dropdown-shortcut-font-size` | Trailing shortcut chip text size. |
| `--dropdown-transition-duration` | Open / close transition duration. |

**Global tokens consumed.**

`--st-surface`, `--st-foreground`, `--st-muted-foreground`, `--st-accent`,
`--st-accent-foreground`, `--st-highlight`, `--st-highlight-foreground`,
`--st-border`, `--st-danger`, `--st-radius`, `--st-shadow`, `--st-density`,
`--st-ring` (focus ring on items).

**Dark-mode flips.** None component-local — the dropdown inherits the
theme's surface, accent, and highlight tokens. The danger variant's soft
tint is derived from `--st-danger` at runtime via `color-mix`, so it
follows the theme.

## 10. Out of scope for this contract

- Submenus inside a dropdown (a menu item that opens another menu beside
  it) — not in 3.0
- Context-menu activation patterns (right-click to open) — implementation
  may add but not required
- Searchable / filterable menus — use the combobox or command spec
  instead
- Multi-select via checkbox items as a first-class API — checkbox items
  are spec'd; multi-select coordination logic belongs to the consumer
- Menus rendered into a portal / different DOM subtree — implementation
  choice, not a spec requirement
- Programmatic position presets beyond the placement keyword (offsets per
  side, arrow elements, etc.) — not in 3.0
