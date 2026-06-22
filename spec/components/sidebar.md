# Sidebar

A layout-agnostic vertical navigation panel for application shells. Stacks
brand, a scrollable menu of groups and items, and an optional footer.
Items may host nested submenus that expand inline; the whole panel may
collapse to an icon-only rail.

This file is the cross-implementation contract. It describes what a
sidebar is and what it must do; the choice of collapse mechanism, API
surface, event mechanism, primitive library, and prop names belongs to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.sidebar                                 outer panel — flex column
  .sidebar__header                       top slot (brand / search)
    .sidebar__brand                      wordmark / logo
  .sidebar__content                      scrollable middle slot
    .sidebar__menu                       vertical stack of groups
      .sidebar__group                    one group — title + list
        .sidebar__group-title            caption above the list
        .sidebar__group-action           right-edge slot on the title row
        .sidebar__list                   <ul> of items
          .sidebar__item                 one row wrapper
            .sidebar__button             primary click target
              .sidebar__caret            opt-in chevron indicator
            .sidebar__item-action        right-edge slot on a row
            .sidebar__submenu            nested list under the row
  .sidebar__footer                       bottom slot, pinned via margin-top
```

**Required parts:** root. Everything else is optional — a sidebar with
only a header and a menu, or only a menu, is valid.

**Optional parts:** header, brand, content, menu, group, group-title,
group-action, list, item, button, caret, item-action, submenu, footer.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance. The padding
budget intentionally lives on the child slots (header / content / footer),
not on the root, so the scrollable content rides flush against the panel
edge.

## 2. States

```
.sidebar.is-collapsed                              rail / mini mode (root)
.sidebar__button[aria-current="page"]              current page (nav links)
.sidebar__button[data-state="active"]              current state (non-link rows)
.sidebar__item[data-state="open"]                  submenu expanded
.sidebar__item[data-state="closed"]                submenu collapsed (default)
.sidebar__button[aria-expanded="true|false"]       submenu trigger reflection
.sidebar__submenu.is-collapsing                    submenu mid-close animation
```

**Rules.**

- `aria-current="page"` marks the link to the current page — semantic
  primary for navigation.
- `[data-state="active"]` marks a non-link row that owns the current view
  (e.g. a button that toggles a panel). Both paint identically.
- `[data-state="open|closed"]` on `.sidebar__item` reflects the visibility
  of its nested `.sidebar__submenu`. The convention matches what mainstream
  JS primitive libraries emit, so the same CSS works without a glue layer.
- `aria-expanded` on the submenu's trigger button mirrors the item's
  `data-state`.
- `.is-collapsed` on the root is the spec hook for rail / mini mode.
  Labels, group titles, chevrons, and item actions fade out; the panel
  width narrows to a single icon column. No primitive-library counterpart
  exists for this — it's Stisla-original.
- `.is-collapsing` on `.sidebar__submenu` keeps the submenu rendered
  through its close animation while the rail width transitions concurrently.
  Cleared after the transition settles.

## 3. Modifiers

```
.sidebar--compact                             button height 2rem, tighter group gap
.sidebar--roomy                             button height 2.5rem, looser group gap
.sidebar__item-action--reveal            action fades in on row hover / focus
```

Size modifiers retune button geometry and the inter-group gap. Outer panel
padding stays constant across sizes by design — gutters read identically
at any size. The rail width derives from button height plus panel padding,
so size modifiers also retune the collapsed-rail width.

## 4. Behaviour

A sidebar coordinates two independent behaviours: submenu open / close and
rail collapse / expand. Implementations satisfy both.

**Submenu open.**
1. Flip the item's `data-state` to `open`.
2. Flip the trigger button's `aria-expanded` to `true`.
3. Animate the submenu's height from zero to its natural height.
4. Rotate the trigger's chevron indicator (if present) via CSS.

**Submenu close.**
1. Flip the item's `data-state` to `closed`.
2. Flip the trigger button's `aria-expanded` to `false`.
3. Animate the submenu's height from its natural height to zero.
4. After the transition settles, the submenu is hidden via `display: none`.

**Rail collapse.**
1. Close every currently-open submenu — their height transitions run
   concurrently with the panel's width transition so the motion reads as
   one coordinated change. Open submenus are kept rendered through their
   close animation via `.is-collapsing`.
2. Flip `.is-collapsed` on the root.
3. Sync `aria-expanded` on every collapse-toggle trigger (inside or
   outside the panel) so trigger state stays coherent across the page.
4. Animate panel width; labels, group titles, chevrons, and trailing
   actions fade out concurrently.

**Rail expand.**
1. Flip `.is-collapsed` off the root.
2. Animate panel width back; labels and chrome fade in.
3. Sync `aria-expanded` on every collapse-toggle trigger.
4. Previously-open submenus are **not** auto-re-opened. The user clicks
   back in to whichever submenu they want.

**Submenu state outside the spec.** Submenu open / close inside a sidebar
is the composition of a sidebar item plus a collapsible region. Visual
identity (chevron rotation, active row paint, guide line) lives on the
sidebar; the height transition itself is the collapsible contract.

## 5. Options

The knobs every implementation must expose. Default values are normative.
Implementations name and shape them idiomatically — the contract is the
behaviour, not the key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Submenu transition duration | `number` (ms) \| `null` | `null` (CSS default) | Override the height-transition duration applied to every submenu in the panel. |
| Initial collapsed state | `boolean` | `false` | Whether the panel mounts in rail mode. |

Submenu initial state is read from the markup — each `.sidebar__item`
already carries `data-state="open"` or `data-state="closed"`, no option
needed.

## 6. Lifecycle events

Two events must be observable by consumers. The mechanism is the
implementation's choice — the contract is which phases exist and when each
one is observable relative to the lifecycle in §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Submenu change | no | After a submenu's open or close transition settles. Detail includes which item changed and the new open state. |
| Collapse change | no | After `.is-collapsed` flips on the root. Detail includes the new collapsed state. |

Both phases are post-hoc — implementations may expose `before*` phases as
conveniences but the spec only commits to these two.

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Tab | Focus on any focusable row | Move to next focusable element in DOM order |
| Shift+Tab | Focus on any focusable row | Move to previous focusable element |
| Enter / Space | Focus on `.sidebar__button` | Activate the row — follow link, toggle submenu, or fire the row's action |
| Enter / Space | Focus on a collapse-toggle trigger | Toggle rail mode |

The sidebar does not implement roving tabindex or arrow-key navigation
between rows. Each row is a normal focusable element; standard tab order
applies.

## 8. A11y

**Roles + ARIA.**

- The root `.sidebar` is the navigation container. Implementations apply
  `<aside>` or `<nav>` semantically; the spec does not mandate one tag.
- `.sidebar__list` is `<ul>` and `.sidebar__item` is `<li>` — list
  semantics are required so AT announces the nav as a list.
- A submenu trigger button carries `aria-expanded` reflecting its item's
  open state, and `aria-controls` pointing at the submenu's id.
- Active rows: `aria-current="page"` for nav links pointing at the
  current URL; `[data-state="active"]` for non-link rows that own the
  current view. Both are required where applicable.
- A collapse-toggle trigger carries `aria-expanded` reflecting the panel's
  expanded state (`true` when expanded, `false` when collapsed). If the
  trigger lives outside the panel, it carries `aria-controls` pointing at
  the panel's id.

**Focus management.** No focus trap. Sidebar focus participates in the
page's normal tab order. Collapsing the panel does not move focus.

**Focus visibility.** `.sidebar__button:focus-visible` paints a ring via
`--st-ring`. Native `:focus` (mouse + keyboard) is not styled.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
coordinated transitions on header padding, label fade, chevron rotation,
item action fade, and group title fade are neutralised. Hover background
transitions stay — they're below the perception threshold.

**Forced colours.** Active-row paint and focus rings remain visible under
`forced-colors: active`.

## 9. Tokens

The customisation knobs the sidebar exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects. Tuning a default is a non-breaking change as long as the var
name and its surface stay the same.

**Component-scoped (set on `.sidebar`, override per panel or globally).**

| Variable | Affects |
| --- | --- |
| `--sidebar-bg` | Panel background fill. |
| `--sidebar-color` | Default text colour inside the panel. |
| `--sidebar-padding-block` | Vertical padding on header and footer. |
| `--sidebar-padding-inline` | Inline padding on header, content, and footer. |
| `--sidebar-gap` | Vertical gap between header, content, and footer. |
| `--sidebar-width` | Opt-in expanded panel width. Unset = panel sizes externally. |
| `--sidebar-width-collapsed` | Opt-in rail width when `.is-collapsed` applies. |
| `--sidebar-brand-color` | Brand text and icon colour. |
| `--sidebar-brand-icon-size` | Square size of the brand icon. |
| `--sidebar-brand-gap` | Gap between brand icon and brand text. |
| `--sidebar-button-height` | Hard height of `.sidebar__button`. |
| `--sidebar-button-padding-inline` | Inline padding on `.sidebar__button`. Load-bearing for rail-mode icon centring. |
| `--sidebar-button-radius` | Corner radius of `.sidebar__button`. |
| `--sidebar-button-gap` | Gap between icon and label inside a row. |
| `--sidebar-button-font-weight` | Row text weight. |
| `--sidebar-button-color` | Row text colour (rest). |
| `--sidebar-button-bg-hover` | Row background on hover. |
| `--sidebar-button-color-hover` | Row text colour on hover. |
| `--sidebar-button-bg-active` | Row background when current / active. |
| `--sidebar-button-color-active` | Row text colour when current / active. |
| `--sidebar-button-icon-size` | Square size of a row icon. |
| `--sidebar-button-icon-color` | Row icon colour (rest). |
| `--sidebar-item-action-size` | Square size of the trailing action slot. |
| `--sidebar-group-gap` | Vertical gap between groups. |
| `--sidebar-group-title-font-size` | Group title size. |
| `--sidebar-group-title-font-weight` | Group title weight. |
| `--sidebar-group-title-color` | Group title and action colour. |
| `--sidebar-submenu-border-color` | Colour of the guide line under a submenu. |
| `--sidebar-submenu-padding-inline-start` | Inline padding inside the submenu. |
| `--sidebar-submenu-margin-inline-start` | Inline margin on the submenu — aligns the guide line on the parent icon column. |
| `--sidebar-transition-duration` | Duration of coordinated rail-mode transitions. |

**Global tokens consumed.**

`--st-foreground`, `--st-muted-foreground`, `--st-accent`,
`--st-accent-foreground`, `--st-highlight`, `--st-highlight-foreground`,
`--st-border`, `--st-border-width`, `--st-radius-sm`, `--st-spacing`
(spacing base behind `space()` paddings, gaps, and button height),
`--st-ring` (focus ring on `.sidebar__button`).

**Dark-mode flips.** None component-local — the sidebar inherits the
theme's surface and accent tokens. Active and hover rows track whichever
luminance the theme defines for `--st-accent` and `--st-highlight`.

## 10. Out of scope for this contract

- Off-canvas / drawer presentations on small screens — use the drawer spec
- Floating popover submenus (rail-mode submenu that opens beside the rail
  instead of inline) — not in 3.0
- Application shell coordination (rail toggle that resizes the page
  alongside the sidebar) — that's the app-shell spec; sidebar only owns
  its own `.is-collapsed` state
- Multi-level submenus (submenu inside a submenu) — items host one level
  of nested list; deeper nesting is undefined
- Search inside the sidebar — composes a separate input component into
  the header slot
