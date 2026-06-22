# Accordion

A stack of collapsible panels inside a framed container. Closed items sit
transparent on the frame; opening an item raises it as a soft chip with a
divider between its header and body, and the chevron rotates. Items expand
and collapse with a height transition.

This file is the cross-implementation contract. It describes what an
accordion is and what it must do; the choice of height-animation
mechanism, ARIA wiring, event mechanism, API surface, and prop names
belongs to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.accordion                               root frame, hosts items
  .accordion__item                       one panel (header + body pair)
    .accordion__header                   the trigger row (rendered as a button)
      .accordion__icon                   chevron; rotates 0 → 180° on open
    .accordion__body                     the collapsible content region
      .accordion__body-inner             the inner padding container
```

**Required parts:** root, item, header, body, body-inner.

**Optional parts:** icon. A header without a chevron is valid; the
header's text is the open-signal in that case.

**Heading wrapper.** Per the WAI-ARIA accordion pattern, each header
button is wrapped in a heading element (`<h2>` / `<h3>` / etc. — level
chosen by the consumer to fit the page outline). The wrapper is a
required part of the markup but does not carry a Stisla class; it is a
semantic landmark, not a styled part.

**Inner body wrapper.** `.accordion__body` is a clip container; the
height transition animates this element. `.accordion__body-inner`
carries the body padding so the inner stays at its natural size while
the outer clips it. Padding on the animating element would cause
content reflow during the transition.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.accordion__item[data-state="open"]              expanded, body visible
.accordion__item[data-state="closed"]            collapsed (default)
.accordion__header[aria-expanded="true|false"]   native button state
.accordion__header:disabled                      unreachable item
```

**Rules.**

- `data-state` lives on the item (not the body), because the chip fill,
  border, header divider, and chevron rotation all branch off it. The
  body inherits open/closed visibility from the item's state.
- `aria-expanded` mirrors `data-state` on the header button.
- A disabled header is unreachable by click and keyboard; the chevron
  still renders to keep the row visually consistent.

## 3. Modifiers

```
.accordion--flush                        drop frame border and shadow
```

The flush modifier strips the outer frame so the accordion fades into
its parent surface (a card body, a page section). Root padding stays —
items still chip out concentrically when opened. Inter-block spacing
is owned by the parent in flush contexts, not the accordion.

## 4. Behaviour

An accordion coordinates one collapsible-panel cycle per item. Two
selection modes are required.

**Mode.**

- *Single* — at most one item is open at a time. Opening a new item
  auto-closes the currently-open one. A nested option controls whether
  the user can collapse the open item to leave none open.
- *Multiple* — any number of items may be open at once. Each item
  toggles independently.

**Single-mode coordination.**
1. User opens item B. The accordion observes the opening signal on item
   B; while still in the cancelable phase, it requests a close on any
   other open item (A).
2. Items A and B animate in parallel: A's body height collapses, B's
   body height expands.
3. The change is reported once both animations settle.

**Non-collapsible single mode.** When the *collapsible* option is
`false` and the type is single, the user cannot close the only open
item. The accordion blocks a close attempt on the last open item by
cancelling the closing signal; only the auto-close from a sibling
opening can transition the item out.

**Item lifecycle.** Each item open/close goes through its own four
phases (mirroring the collapsible primitive it composes):

1. *Opening* (cancelable) — the request to open.
2. *Opened* (post-transition) — body fully expanded.
3. *Closing* (cancelable) — the request to close.
4. *Closed* (post-transition) — body fully collapsed.

**Group-level event.** After every successful item open or close, the
accordion fires a single `value-change` event reflecting the new set of
open items. Cascaded closes in single mode produce one settled event,
not one per item.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
height transition, chip-paint transition, and chevron rotation all snap
instantly between states.

## 5. Options

The knobs every implementation must expose. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Selection type | `'single'` \| `'multiple'` \| `null` | `null` (autodetect from authored markup) | Determines whether one or many items can be open at once. |
| Collapsible | `boolean` | `true` | Single mode only. When `false`, the last open item cannot be closed by user action; only auto-close from opening a sibling can transition it out. |
| Duration | `number` (ms) \| `null` | `null` | Override for the per-item height transition duration. When `null`, items inherit the duration from CSS. |

## 6. Lifecycle events

Lifecycle events fire at two levels.

**Per-item.** Each item open/close cycle emits the four phases listed in
§4 (opening, opened, closing, closed) on the item.

**Group.** After the dust settles on each successful transition, the
accordion emits a single group-level event reflecting the new set of
open items.

| Phase | Cancelable | When |
| --- | --- | --- |
| Item opening | yes | Before the item's `data-state` flips to `open`. Cancelling aborts the open. |
| Item opened | no | After the item's open transition completes. |
| Item closing | yes | Before the item's `data-state` flips to `closed`. Cancelling aborts the close. |
| Item closed | no | After the item's close transition completes. |
| Value change | no | After a successful transition settles, reflecting the new set of open items. Cascaded closes in single mode coalesce into one event. |

## 7. Keyboard

Keys operate while focus is on a header button. The spec follows the
WAI-ARIA accordion pattern.

| Key | Action |
| --- | --- |
| Enter / Space | Toggle the focused item (subject to the non-collapsible rule in single mode). |
| Tab | Move focus to the next focusable element. The spec does not require arrow-key navigation between headers; standard Tab order applies. |
| Shift+Tab | Move focus to the previous focusable element. |

Arrow-key navigation between headers is **not required** by the spec.
Implementations may add it; it is not part of the contract.

## 8. A11y

**Roles + ARIA.**

- Each `.accordion__header` is a native `<button>` element wrapped in a
  heading element. The button carries `aria-expanded` mirroring
  `data-state`, and `aria-controls` pointing at the body's `id`.
- Each `.accordion__body` carries `role="region"` and `aria-labelledby`
  pointing at the header button's `id`. The region role lets screen-
  reader users skim and enter each panel as a landmark.
- A disabled header carries the native `disabled` attribute on the
  button; `aria-disabled` is not required (and is redundant with
  `disabled`).

**Focus management.**

- The accordion does not move focus on open or close — focus stays on
  the header button that was activated.
- Headers participate in the normal Tab order. The spec does not impose
  a roving tabindex; every enabled header is tabbable.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set:
- The body height transition is suppressed; open/close snaps.
- The chip paint transition on the item is suppressed.
- The chevron rotation transition is suppressed (the chevron still
  rotates, but instantly).

**Forced colours.** The frame border, open-item rim, header divider,
and focus ring remain visible under `forced-colors: active`.

## 9. Tokens

**Component-scoped (set on `.accordion`, override per accordion or
globally).**

| Variable | Affects |
| --- | --- |
| `--accordion-radius` | Outer frame corner radius. |
| `--accordion-padding-inline` | Inner inline padding inside the frame (the inset that lets items chip out concentrically). |
| `--accordion-padding-block` | Inner block padding inside the frame. |
| `--accordion-gap` | Vertical gap between items. |
| `--accordion-bg` | Frame background. |
| `--accordion-border-width` | Frame border width. |
| `--accordion-border-color` | Frame border colour. |
| `--accordion-shadow` | Frame drop shadow. |
| `--accordion-item-open-bg` | Background of an item when open. |
| `--accordion-item-open-border-color` | Border colour of an item when open. |
| `--accordion-header-padding-block` | Header vertical padding. |
| `--accordion-header-padding-inline` | Header horizontal padding. |
| `--accordion-header-font-size` | Header text size. |
| `--accordion-header-font-weight` | Header text weight. |
| `--accordion-header-color` | Header text colour (rest and open). |
| `--accordion-header-bg` | Header background (rest). |
| `--accordion-header-bg-hover` | Header background on hover (closed items only). |
| `--accordion-header-divider-color` | Divider between header and body on open items. |
| `--accordion-icon-size` | Chevron size. |
| `--accordion-icon-color` | Chevron colour. |
| `--accordion-icon-transition-duration` | Chevron rotation duration. |
| `--accordion-body-padding-block` | Body inner vertical padding. |
| `--accordion-body-padding-inline` | Body inner horizontal padding. |
| `--accordion-body-color` | Body text colour. |
| `--accordion-body-transition-duration` | Body height transition duration. |
| `--accordion-ring` | Focus ring colour on header. |

**Global tokens consumed.**

`--st-surface`, `--st-surface-2`, `--st-border`, `--st-foreground`,
`--st-muted-foreground` (disabled header), `--st-accent` (header hover),
`--st-ring`. Padding and gaps ride the spacing base `--st-spacing` via
the `space()` helper.

**Dark-mode flips.** None. The frame and open-chip paints read surface
tokens which the theme block re-defines; no per-component dark logic is
required.

## 10. Out of scope for this contract

- The standalone collapsible primitive — opening / closing a single
  region without sibling coordination uses the collapsible spec; the
  accordion composes it
- Nested accordions inside an open item's body — supported by virtue of
  scoped selectors, but the spec does not commit to a specific nesting
  visual treatment; consumers tune the inner accordion's tokens to fit
- Drag-to-reorder items — not an accordion concern
- Lazy body rendering — when an item's contents are constructed is a
  consumer concern; the spec only requires that the open item's body is
  in the accessibility tree
