## Drawer

A modal surface that slides in from a viewport edge. Used for inspector
panels, filter trays, mobile navigation, and side sheets that need
focus and the page's full attention without the centered framing of a
dialog. Anchored to one of four edges, dim backdrop, dismissable via
Escape, backdrop click, or an explicit close control.

This file is the cross-implementation contract. It describes what a
drawer is and what it must do; the focus-management mechanism, API
surface, event mechanism, primitive library, and prop names belong to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.drawer                                  root, owns runtime state
  .drawer__backdrop                      translucent dim, dismiss target
  .drawer__content                       the visible panel — slides from edge
    .drawer__header                      header row (optional)
      .drawer__title                     heading-agnostic title
      .drawer__close                     inline dismiss control (optional)
    .drawer__body                        scrollable region (optional)
    .drawer__footer                      pinned action band (optional)
```

**Required parts:** root, content.

**Optional parts:** backdrop, header, title, close, body, footer. A
drawer with no header / body / footer renders as an empty panel — valid
for fully-custom inner markup, but the BEM classes apply where present
so the visual identity follows the spec. A drawer with no backdrop is
non-blocking (see backdrop option, §5).

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.drawer[data-state="open"]               visible, focus trapped, scroll locked
.drawer[data-state="closed"]             hidden (default)
.drawer__content.is-shaking              visual nudge after a static-backdrop dismiss
html.is-drawer-open                      page scroll lock while any backdrop drawer is open
```

**Rules.**

- `data-state` lives on the root and reflects open / closed.
- `aria-hidden` mirrors `data-state`: `false` when open, `true` when
  closed. Both are set atomically.
- `.is-drawer-open` is set on `<html>` while at least one
  backdrop-bearing drawer is open. Removed when the last one closes.
  Stacked opens use a refcount.
- `.is-shaking` is the visual hook for static-backdrop feedback (§4).
  The shake axis follows the placement axis — horizontal drawers shake
  horizontally, top / bottom drawers shake vertically — so the nudge
  reads as "stuck" along the direction the panel slides.

## 3. Modifiers

```
.drawer--start                           pinned to the inline-start edge
.drawer--end                             pinned to the inline-end edge (default)
.drawer--top                             pinned to the top edge — height-bounded
.drawer--bottom                          pinned to the bottom edge — height-bounded
```

Default (no placement modifier) is `--end` — the dashboard inspector
case. Placement modifiers are exclusive; applying more than one is
undefined.

Start / end drawers use `--drawer-width` and span full viewport
height. Top / bottom drawers use `--drawer-height` and span full
viewport width. Only the inner edge of each placement carries a border;
the outer sides are flush with the viewport.

## 4. Behaviour

A drawer has four lifecycle phases. Implementations satisfy all four
even if some are no-ops in the chosen primitive library.

**Open.**
1. Capture currently-focused element (for return on close).
2. If the drawer is backdrop-bearing, apply scroll lock to `<html>`
   (`.is-drawer-open`). The scroll-lock option may suppress this.
3. Mark sibling content `inert` so AT skips the page behind.
4. Force layout so the closed-state transform commits before flipping
   state — otherwise the slide-in transition starts at the open
   transform and runs as a no-op.
5. Flip `data-state` to `open` and `aria-hidden` to `false`. CSS
   transitions backdrop opacity and panel translate from off-screen
   into place.
6. Move focus into the drawer. Initial focus order:
   - Element with `autofocus` inside `.drawer__content`
   - First tabbable element inside `.drawer__content`
   - `.drawer__content` itself (with `tabindex="-1"`)
7. Trap focus inside `.drawer__content` (Tab and Shift+Tab cycle within
   the content; focus does not escape to the page).

**Close.**
1. Release the focus trap.
2. Flip `data-state` to `closed` and `aria-hidden` to `true`. CSS
   transitions backdrop opacity to zero and panel translate off-screen.
3. After transition end, release `inert` on siblings.
4. Decrement the refcount; if zero, remove `.is-drawer-open` from
   `<html>`.
5. Return focus to the element captured in Open step 1, unless an
   option suppresses this.

**Dismiss.**
1. Three triggers:
   - Click on `.drawer__backdrop`
   - Press Escape while focus is in the drawer
   - Click on an explicit dismiss element (`.drawer__close` or any
     implementation-marked dismiss control)
2. The first two honour the backdrop / keyboard options. The third
   always dismisses.
3. If the backdrop option is set to static and the dismiss came from a
   backdrop click, shake the panel and **do not** close. Explicit
   dismiss controls still close on static.

**Stacking.**
- Drawers and dialogs share the page scroll-lock counter so a drawer
  opened over a dialog (or vice versa) does not double-toggle the lock.
  Each open registers; the lock releases when the count returns to
  zero.
- Each opened drawer stores its own return-focus target so closing them
  in any order restores focus correctly.

## 5. Options

The knobs every implementation must expose. Default values are
normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Backdrop dismiss | `true \| false \| 'static'` | `true` | `false` hides the backdrop and disables backdrop dismiss; `'static'` shakes instead of closing |
| Keyboard dismiss | `boolean` | `true` | `false` disables Escape dismiss |
| Initial focus | `boolean` | `true` | `false` skips moving focus into the drawer on open |
| Return focus | `boolean` | `true` | `false` skips restoring focus to opener on close |
| Page scroll | `boolean` | `false` | `true` keeps the page behind scrollable while the drawer is open (filter panels, inspector strips) |

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and
when each one is observable relative to §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes and focus is trapped. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the close. |
| Closed | no | After the close transition completes and focus is restored. |

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Escape | Drawer open, keyboard dismiss enabled | Close |
| Tab | Focus in drawer | Move to next focusable element inside `.drawer__content`. Focus cycles back to the first on the last. |
| Shift+Tab | Focus in drawer | Move to previous focusable element. Cycles to the last on the first. |
| Enter / Space | Focus on explicit dismiss control | Activate dismiss |

Implementations must not allow Tab to escape the drawer while open.

## 8. A11y

**Root element.**

- A *modal* drawer (default — backdrop, focus trapped, page inert) uses
  a generic root (`<div>`) and carries dialog ARIA. The native
  `<dialog>` element is not used; its built-in lifecycle would collide
  with the drawer's own focus, backdrop, and dismiss handling.
- A *non-modal* drawer (`backdrop: false` and / or page scroll
  allowed — filter panels, inspector strips) uses `<aside>`. It is a
  complementary landmark, not a dialog, so the dialog ARIA below does
  not apply.

**Roles + ARIA.**

- Modal drawers: implementations apply `role="dialog"` and
  `aria-modal="true"` to the element that owns focus (the root or
  `.drawer__content`, depending on primitive library convention). Both
  are required.
- Non-modal drawers: no `role="dialog"`, no `aria-modal`. The `<aside>`
  itself conveys the landmark.
- If `.drawer__title` exists, the drawer references it via
  `aria-labelledby` pointing at the title's `id`. If no title, the
  drawer uses `aria-label` provided by the consumer. Non-modal drawers
  must carry one or the other so the landmark has a name.
- `aria-describedby` may point at `.drawer__body` (or a specific
  element inside it) when a description is meaningful. Optional.
- `aria-hidden` mirrors `data-state` on the root (open → `false`,
  closed → `true`).

**Focus management.**

- On open, focus moves into the drawer per the initial-focus order in §4.
- Focus is trapped inside `.drawer__content` while open.
- On close, focus returns to the element that was focused immediately
  before open, unless the return-focus option is disabled.

**Inert background.** Siblings of the drawer root are marked `inert`
while the drawer is open. AT skips them; mouse / keyboard cannot reach
them. The implementation chooses how (native `inert` attribute, or
applying it via a helper).

**Scroll lock.** Backdrop-bearing drawers lock the page behind via
`.is-drawer-open` on `<html>`. The CSS handles the rest
(`overflow: hidden`, `scrollbar-gutter: stable`). The page-scroll
option suppresses the lock for non-blocking inspector use cases.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set,
backdrop opacity and panel slide transitions are disabled, and the
static-backdrop shake animation is suppressed. The drawer still opens
and closes instantly; only the motion is removed.

## 9. Tokens

The customisation knobs the drawer exposes. Defaults live in the SCSS
partial.

**Component-scoped (set on `.drawer`, override per drawer or globally).**

| Variable | Affects |
| --- | --- |
| `--drawer-width` | Panel width for start / end placements. |
| `--drawer-height` | Panel height for top / bottom placements. |
| `--drawer-padding` | Padding on header and body. |
| `--drawer-z-index` | Stack order. |
| `--drawer-bg` | Panel surface colour. |
| `--drawer-color` | Panel text colour. |
| `--drawer-border-color` | Inner-edge border colour. |
| `--drawer-shadow` | Drop shadow on the panel. |
| `--drawer-backdrop-bg` | Backdrop fill. |
| `--drawer-backdrop-blur` | Backdrop frosted blur radius. |
| `--drawer-title-font-size` | Title size. |
| `--drawer-title-font-weight` | Title weight. |
| `--drawer-close-size` | Close chip square size. |
| `--drawer-close-color` | Close chip icon (rest). |
| `--drawer-close-color-hover` | Close chip icon (hover). |
| `--drawer-close-bg-hover` | Close chip background (hover). |
| `--drawer-footer-padding-y` | Footer vertical padding. |
| `--drawer-footer-bg` | Footer background. |
| `--drawer-footer-border-color` | Footer top border. |
| `--drawer-transition-duration` | Open / close slide duration. |

**Global tokens consumed.**

`--st-surface` (panel bg), `--st-surface-2` (footer band),
`--st-foreground` (panel text), `--st-muted-foreground` (close chip
rest), `--st-border`, `--st-accent` (close chip hover bg),
`--st-density` (padding multiplier), `--st-ring` (focus ring on
`.drawer__close`).

**Dark-mode flips.** None per-component. All surfaces ride the root
token swap automatically. The backdrop fill is intentionally fixed
(dark dim in both themes) so a stacked open with a dialog reads
consistently.

## 10. Out of scope for this contract

- Centered modal surfaces — use the dialog spec
- Edge-anchored non-modal panels (always-visible inspector strips,
  permanent sidebars) — those are layout, not overlay; use the
  app-shell or sidebar specs
- Swipe-to-dismiss gestures — convenience an implementation may add,
  but not required by the spec
- Resizable drawers (draggable inner edge) — out of scope at 3.0
- Snap points / partially-open intermediate states — out of scope at 3.0
