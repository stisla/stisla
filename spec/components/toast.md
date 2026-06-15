# Toast

A non-blocking status message that appears in a fixed region at one of
six viewport corners, auto-dismisses after a delay, and stacks with other
toasts. No backdrop, no scroll lock, no focus trap — toasts are status
messages, not modal interactions.

This file is the cross-implementation contract. It describes what a toast
is and what it must do; the choice of timer implementation, API surface,
event mechanism, primitive library, and prop names belongs to each
implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.toast-region                            fixed-position stack at a viewport corner
  .toast                                 one toast — 3-col grid
    .toast__icon                         REQUIRED leading visual
    .toast__content                      middle stack
      .toast__header                     title line
        .toast__timestamp                muted timestamp slot (optional)
      .toast__body                       description (optional)
      .toast__action                     row of action buttons (optional)
    .toast__close                        trailing dismiss chip (optional)
```

**Required parts:** region, root, icon. The icon column anchors the
visual rhythm — a toast without an icon collapses the grid and breaks
alignment. Implementations supply a default icon when no consumer icon is
given.

**Optional parts:** content (only required when title, body, or action is
present), header, timestamp, body, action, close.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance. The toast
is a 3-column grid `[icon | content | close]` with row-top alignment; the
middle column is its own vertical flex stack so title, body, and action
gap independently of the grid.

## 2. States

```
.toast[data-state="open"]                visible, on-screen
.toast[data-state="closed"]              hidden (default)
```

**Rules.**

- `data-state` lives on the toast root and reflects open / closed. The
  convention matches what mainstream JS primitive libraries emit, so the
  same CSS works without a glue layer.
- `aria-hidden` mirrors `data-state`: `false` when open, `true` when
  closed. Both are set atomically.
- The closed state uses `display: none` so pending markup-first toasts
  don't push the next-to-open one down the page. A discrete-property
  transition on `display` keeps the grid value through the close fade-out
  so the transition can play before layout collapses.

## 3. Modifiers

**On the region (placement — pick one):**

```
.toast-region--top-start                 top-left corner
.toast-region--top-center                top-center
.toast-region--top-end                   top-right corner (default)
.toast-region--bottom-start              bottom-left corner
.toast-region--bottom-center             bottom-center
.toast-region--bottom-end                bottom-right corner
```

Bottom regions stack column-reverse so the newest toast sits closest to
the viewport corner and older toasts push up. Toast entry direction
flips with placement — top regions slide in from above, bottom regions
from below.

**On the toast (intent — pick one or none):**

```
.toast--primary                          primary intent — icon-color flip
.toast--success                          success intent — icon-color flip
.toast--warning                          warning intent — icon-color flip
.toast--danger                           danger intent — icon-color flip, role=alert
.toast--info                             info intent — icon-color flip
```

Intent modifiers shift **only** the icon colour. The surface stays
neutral — stacked toasts of mixed intent still read as one family. The
danger intent additionally elevates the assertive ARIA live setting (§9).

## 4. Behaviour

A toast has four lifecycle phases plus a content-patch phase.

**Open.**
1. Force layout reflow so the closed → open transition runs.
2. Flip `data-state` to `open` and `aria-hidden` to `false`. Transition
   opacity + translate.
3. Start the autohide timer if autohide is enabled.
4. After transition end, the toast is fully visible.

**Re-trigger.** Activating the same trigger again while a toast is
already open restarts the autohide timer without re-running the open
transition.

**Close.**
1. Clear the autohide timer.
2. Flip `data-state` to `closed` and `aria-hidden` to `true`. Transition
   opacity + translate; `display` switches to `none` after the discrete
   property transition settles.
3. If the toast is owned by the imperative helper (§5), remove it from
   the DOM after close.

**Dismiss.** Three triggers:
- The autohide timer elapses
- The user clicks `.toast__close` or an action button marked as
  dismiss-on-click
- Programmatic close

**Pause / resume.** While the autohide timer is running:
- Pointer enter on the toast pauses the timer (configurable).
- Pointer leave resumes it with the remaining time.
- Focus entering the toast pauses (configurable); focus leaving resumes.
Pause / resume capture elapsed time accurately so a paused-then-resumed
toast still gets its full remaining window.

**Update.** A toast's title, description, variant, icon, autohide flag,
and delay can be patched in place at any time. The autohide timer
restarts with the new delay after a patch. Used by the promise
integration to swap a loading state into a success / error state.

## 5. Programmatic API

The toast component is **load-bearing** as a programmatic surface, not
only as a markup component. Every implementation must expose:

**Queue / show.** A function that, given a content descriptor (title,
description, intent, icon, action, autohide, delay, placement region),
builds the toast node, mounts it into a region, and opens it. The
implementation auto-creates a default region if none exists. The returned
handle exposes the same lifecycle as a markup-defined toast.

**Intent shorthands.** `success`, `error` (mapped to danger),
`warning`, `info` shorthands that bake in the matching intent modifier
and a sensible default icon. Optional but expected.

**Dismiss.** A dismiss call on the returned handle that runs the close
phase and (for queue-shown toasts) removes the node from the DOM after
close.

**Owned-toast lifecycle.** Toasts shown via the queue API are *owned*
by the implementation — their DOM node is removed after close. Toasts
defined in markup are not owned; their node persists for re-trigger.

**Promise integration.** Given a promise plus a content descriptor for
loading, success, and error states, the implementation shows a loading
toast (spinner icon, autohide off), then patches it to the settled state
on resolve / reject with autohide re-enabled. The original promise is
**not** intercepted — the caller still awaits and catches it themselves.

The shape of the API (function vs class, named exports vs methods) is the
implementation's choice; the four capabilities above are required.

## 6. Options

The knobs every implementation must expose. Default values are normative.
Implementations name and shape them idiomatically — the contract is the
behaviour, not the key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Autohide | `boolean` | `true` | Whether the toast auto-dismisses after the delay. |
| Autohide delay | `number` (ms) | `4000` | Time the toast stays open before autohide closes it. |
| Pause on hover | `boolean` | `true` | Whether pointer enter pauses the autohide timer. |
| Pause on focus | `boolean` | `true` | Whether focus entering pauses the autohide timer. |

## 7. Lifecycle events

Five lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and when
each one is observable relative to the lifecycle in §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the close. |
| Closed | no | After the close transition completes. For owned toasts, before the node is removed. |
| Updated | no | After an in-place content patch settles. Detail includes the patch. |

## 8. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Tab | Focus enters the toast | Move between focusable elements inside the toast (close chip, action buttons) |
| Enter / Space | Focus on close chip | Dismiss the toast |
| Enter / Space | Focus on an action button | Activate the action; dismiss unless the action opts out |

The toast does not implement a global keyboard shortcut to dismiss
(Escape) — toasts are non-modal, and the user's keyboard focus may be
elsewhere on the page. The close chip is the keyboard dismiss surface.

## 9. A11y

**Roles + ARIA.**

- The region carries `role="region"` and an `aria-label` (e.g.
  "Notifications") so AT can land on the stack as a labelled landmark.
- A toast carries `role="status"` and `aria-live="polite"` by default —
  AT announces the toast after the user's current speech completes.
- A toast with the danger intent (or any "assertive" intent the
  implementation maps to it) carries `role="alert"` and
  `aria-live="assertive"` — AT interrupts the user to announce it.
- `aria-atomic="true"` so the entire toast content is announced as one
  unit, not piecewise.
- `aria-hidden` mirrors `data-state` on the root (open → `false`,
  closed → `true`).

**Focus management.** No focus trap, no return focus. Toasts do not steal
focus on open. The close chip is reachable via normal tab order while the
toast is open.

**Pointer affordance.** The region is `pointer-events: none` so the page
behind stays interactive in the gaps between toasts. Each toast
re-enables pointer events on itself.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
opacity + translate transition is disabled. The toast still opens /
closes; only the motion is suppressed.

**Forced colours.** Toast borders, close chip border / fill, and action
button focus rings remain visible under `forced-colors: active`.

## 10. Tokens

The customisation knobs the toast exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects. Tuning a default is a non-breaking change as long as the var
name and its surface stay the same.

**Region (component-scoped on `.toast-region`).**

| Variable | Affects |
| --- | --- |
| `--toast-region-inset` | Distance from the viewport edges. |
| `--toast-region-gap` | Vertical gap between stacked toasts. |
| `--toast-region-max-width` | Maximum stack width. |
| `--toast-region-z-index` | Stack order of the region (above dialog so a toast can confirm a dialog action). |

**Toast (component-scoped on `.toast`).**

| Variable | Affects |
| --- | --- |
| `--toast-min-width` | Minimum toast width. |
| `--toast-max-width` | Maximum toast width. |
| `--toast-padding` | Frame padding. |
| `--toast-radius` | Outer corner radius. |
| `--toast-z-index` | Stack order of an individual toast. |
| `--toast-bg` | Surface background. |
| `--toast-color` | Default text colour. |
| `--toast-border-color` | Surface border colour (opaque by design — translucent borders ghost over content beneath). |
| `--toast-shadow` | Drop shadow. |
| `--toast-column-gap` | Gap between the three grid columns (icon / content / close). |
| `--toast-content-gap` | Vertical gap inside the middle content stack. |
| `--toast-header-font-weight` | Header (title) weight. |
| `--toast-header-font-size` | Header (title) size. |
| `--toast-body-color` | Body (description) text colour. |
| `--toast-body-font-size` | Body (description) text size. |
| `--toast-icon-size` | Square size of the icon column. |
| `--toast-icon-color` | Icon colour. Intent modifiers retune **only** this var. |
| `--toast-close-size` | Square size of the close chip. |
| `--toast-close-color` | Close chip icon (rest). |
| `--toast-close-color-hover` | Close chip icon (hover). |
| `--toast-close-bg-hover` | Close chip background (hover). |
| `--toast-action-gap` | Gap between action buttons. |
| `--toast-transition-duration` | Open / close transition. |
| `--toast-enter-transform` | Translate direction the toast slides from on entry. Bottom regions override to flip the direction. |

**Global tokens consumed.**

`--st-surface`, `--st-foreground`, `--st-muted-foreground`, `--st-accent`,
`--st-border`, `--st-shadow`, `--st-radius-lg`, `--st-ring` (focus ring
on `.toast__close`), and one of `--st-primary` / `--st-success` /
`--st-warning` / `--st-danger` / `--st-info` per intent modifier.

**Dark-mode flips.** None component-local — the toast inherits the
theme's surface and intent tokens. Surface stays neutral across intents
by design.

## 11. Out of scope for this contract

- Swipe-to-dismiss gesture — implementation may add as a convenience but
  not required
- Toast grouping / collapsing of repeated messages — not in 3.0
- Persistent toasts that survive route changes — region mount semantics
  are the consumer's responsibility
- Custom entrance / exit animations beyond the slide + fade — implementation
  may extend tokens but the spec only commits to the listed surface
- A separate "snackbar" component for bottom-anchored messages — toast at
  bottom-center placement covers the pattern
- Programmatic queue size limits and dedupe policies — implementation may
  add as a convenience but the spec does not mandate one
