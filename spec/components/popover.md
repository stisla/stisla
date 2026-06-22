# Popover

A small floating surface anchored to a trigger, used to present supporting
content — title, body text, a focused action — without the page interruption
of a dialog. Positioned around its trigger with a pointing arrow, dismissed
on Escape, outside interaction, or an explicit close control.

This file is the cross-implementation contract. It describes what a popover
is and what it must do; the choice of positioning engine, focus-management
mechanism, event mechanism, API surface, and prop names belongs to each
implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.popover                                 root, owns runtime state
  .popover__arrow                        caret that points at the trigger
  .popover__title                        optional heading
  .popover__body                         text or rich content
  .popover__close                        optional ghost-chip dismiss
```

**Required parts:** root, arrow.

**Optional parts:** title, body, close. A popover with only an arrow renders
as an empty framed surface — valid for fully-custom inner markup, but the
BEM classes still apply where present so the visual identity follows the
spec.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

**Trigger.** The element that opens the popover is authored separately and
points at the surface. The trigger is not a part of the popover's BEM tree
— it is whatever element the consumer marks (button, link, icon-box). The
contract is the wiring, not the trigger's class.

## 2. States

```
.popover[data-state="open"]              visible, positioned, focus possibly trapped
.popover[data-state="closed"]            hidden (default)
.popover[data-placement="<side>"]        resolved side after collision handling
```

**Rules.**

- `data-state` lives on the root and reflects open/closed. The convention
  matches what mainstream JS primitive libraries emit, so the same CSS
  works without a glue layer.
- `data-placement` reflects the *resolved* side (`top`, `top-start`,
  `bottom-end`, etc.) after any collision-driven flip. The resting
  transform direction tracks this attribute so the entrance animation
  always reads as moving away from the anchored edge.
- The trigger mirrors open/closed via `aria-expanded` (`true` when open,
  `false` when closed).

## 3. Modifiers

The popover does not ship variant modifiers. Surface, frame, and motion
are tuned via component tokens (§9); size is intrinsic to content within
the min/max width tokens.

## 4. Behaviour

A popover has four lifecycle phases. Implementations satisfy all four
even if some are no-ops in the chosen primitive library.

**Open.**
1. Capture currently-focused element (for return on close).
2. Compute position around the trigger using the configured side and
   offset. Resolve collisions by flipping or shifting; the chosen side
   is written to `data-placement`.
3. Render the popover into the document such that ancestor `overflow:
   hidden` cannot crop it.
4. Flip `data-state` to `open`. Transition opacity + per-placement
   translate per the CSS.
5. Begin position autotracking so scroll, resize, and trigger movement
   keep the surface anchored.
6. If the configured initial-focus behaviour is enabled and the trigger
   mode is click or programmatic, move focus into the popover and trap
   it inside the surface (Tab and Shift+Tab cycle within the popover;
   focus does not escape to the page). Hover/focus-triggered popovers
   skip the trap so cursor and focus can return to the trigger.

**Close.**
1. Release the focus trap if one was activated.
2. Stop position autotracking.
3. Flip `data-state` to `closed`. Transition opacity + translate.
4. After transition end, return focus to the element captured in Open
   step 1, unless an option suppresses this.

**Dismiss.**
1. Triggers depend on the configured trigger mode:
   - Click mode: outside pointerdown, Escape, an explicit dismiss
     control, or a second click on the trigger.
   - Hover/focus mode: pointer leaves both the trigger and the surface,
     or focus leaves the trigger.
   - Manual mode: only programmatic close and explicit dismiss controls.
2. The auto-close option gates which of inside-click, outside-click,
   both, or neither will dismiss the surface; the explicit dismiss
   control always dismisses.

**Trigger modes.** Three modes are required:

- *Click* — toggle open/closed on trigger activation.
- *Hover/focus* — open on pointer enter or trigger focus; close after a
  bridging delay when the cursor and focus leave both the trigger and
  the surface. The bridging delay lets the cursor cross the gap between
  trigger and surface without dismissing.
- *Manual* — only the imperative API opens and closes the surface.

## 5. Options

The knobs every implementation must expose. Default values are normative.
Implementations name and shape them idiomatically — the contract is the
behaviour, not the key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Preferred side | `'top'` \| `'right'` \| `'bottom'` \| `'left'` (with optional `-start` / `-end` alignment) | `'top'` | Side to anchor to first; collision handling may resolve to another. |
| Offset from trigger | `number` (px) | `8` | Gap between trigger edge and popover edge. |
| Auto-close on outside interaction | `'outside'` \| `'inside'` \| `'both'` \| `false` | `'outside'` | Which interactions dismiss the popover. `false` disables auto-dismiss entirely. |
| Initial focus | `boolean` | `true` | When `false`, focus is not moved into the popover on open. |
| Return focus | `boolean` | `true` | When `false`, focus is not restored to the opener on close. |
| Trigger mode | `'click'` \| `'hover focus'` \| `'manual'` | `'click'` | Which interactions on the trigger open the popover. |
| Open delay | `number` (ms) | `0` | Delay before opening in hover mode. |
| Close delay | `number` (ms) | `100` | Delay before closing in hover mode; bridges cursor and focus between trigger and surface. |

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and
when each one is observable relative to the lifecycle in §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes and (if applicable) focus is trapped. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the close. |
| Closed | no | After the close transition completes and focus is restored. |

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Escape | Popover open | Close |
| Tab | Focus inside popover, trap active | Move to next focusable element inside the surface. Focus cycles back to the first on the last. |
| Shift+Tab | Focus inside popover, trap active | Move to previous focusable element. Cycles to the last on the first. |
| Enter / Space | Focus on explicit dismiss control | Activate dismiss |

Hover/focus-triggered popovers do not trap; Tab moves through the
popover's focusable content and out to the next page element naturally.

## 8. A11y

**Roles + ARIA.**

- The popover root carries `role="dialog"`. Implementations apply it on
  init so authored markup does not have to.
- If `.popover__title` exists, the popover references it via
  `aria-labelledby` pointing at the title's `id`. If no title, the
  consumer supplies `aria-label`.
- The trigger declares its relationship with `aria-controls` pointing at
  the popover root and reflects state via `aria-expanded`. For
  dialog-style popovers the trigger also carries `aria-haspopup="dialog"`.

**Focus management.**

- For click and manual triggers, focus moves into the popover on open
  (initial-focus order: first element with `autofocus`, then first
  tabbable element, then the surface itself with `tabindex="-1"`) and
  is trapped while open.
- For hover/focus triggers, focus stays on the trigger; the popover is
  read-only context.
- On close, focus returns to the element that was focused immediately
  before open, unless return focus is disabled.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
opacity and translate transitions are disabled. The popover still opens
and closes; only the motion is suppressed.

**Forced colours.** The frame border and focus ring remain visible
under `forced-colors: active`.

## 9. Tokens

The customisation knobs the popover exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects.

**Component-scoped (set on `.popover`, override per popover or globally).**

| Variable | Affects |
| --- | --- |
| `--popover-max-width` | Maximum surface width. |
| `--popover-min-width` | Minimum surface width. |
| `--popover-padding-inline` | Inner inline padding around title + body + close. |
| `--popover-padding-block` | Inner block padding around title + body + close. |
| `--popover-radius` | Corner radius of the surface. |
| `--popover-z-index` | Stack order. |
| `--popover-bg` | Surface background. |
| `--popover-color` | Surface text colour. |
| `--popover-border-color` | Surface border colour. |
| `--popover-border-width` | Surface border width. |
| `--popover-shadow` | Surface drop shadow. |
| `--popover-title-color` | Title colour. |
| `--popover-title-font-weight` | Title weight. |
| `--popover-title-font-size` | Title size. |
| `--popover-title-margin-block-end` | Gap between title and body. |
| `--popover-body-color` | Body text colour. |
| `--popover-body-font-size` | Body text size. |
| `--popover-body-line-height` | Body text line height. |
| `--popover-close-size` | Close chip square size. |
| `--popover-close-color` | Close chip icon (rest). |
| `--popover-close-color-hover` | Close chip icon (hover). |
| `--popover-close-bg-hover` | Close chip background (hover). |
| `--popover-arrow-size` | Arrow square size before rotation. |
| `--popover-transition-duration` | Open / close transition. |

**Global tokens consumed.**

`--st-surface`, `--st-foreground`, `--st-muted-foreground`, `--st-border`,
`--st-radius-lg`, `--st-shadow`, `--st-accent`, `--st-ring` (focus ring on
`.popover__close`).

**Dark-mode flips.** None. The popover reads surface tokens which the
theme block re-defines; no per-component dark logic is required.

## 10. Out of scope for this contract

- Tooltips — small hover-only annotations on a single string of text use
  the tooltip spec
- Dropdown menus — focusable item lists with menu semantics use the
  menu spec
- Confirm / form-in-popover patterns — these are recipe-level
  compositions on top of the popover, not separate components
- Programmatic content rewrites as a contract requirement — an
  implementation may offer a content-swap convenience, but the spec
  treats popover content as authored markup
