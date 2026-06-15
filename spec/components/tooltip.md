## Tooltip

A small floating label that surfaces a short hint about a focused or
hovered trigger. Anchored to the trigger, dismissed when the pointer or
focus leaves. Inverse-surface chip (dark on light in light theme, light
on dark in dark theme) so it reads as a transient annotation rather than
a card.

This file is the cross-implementation contract. It describes what a
tooltip is and what it must do; the positioning library, focus / hover
wiring, event mechanism, and prop names belong to each implementation.
See `SPEC.md` §2.

---

## 1. Anatomy

```
.tooltip                                 root, owns runtime state
  .tooltip__arrow                        caret pinned to the anchored edge
  .tooltip__inner                        the visible chip — padding, bg, text
```

**Required parts:** root, inner.

**Optional parts:** arrow. A tooltip with no arrow is valid — the chip
floats free at the resolved offset. The arrow is the default since it
strengthens the anchor cue.

**Trigger.** The trigger is whatever element the tooltip describes
(button, icon, link, form control). It is not part of the tooltip
subtree — the tooltip root is appended elsewhere in the DOM (typically
near `<body>`) so that an ancestor with `overflow: hidden` cannot crop
it. While the tooltip is open the trigger references the tooltip via
`aria-describedby`.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.tooltip[data-state="open"]              visible, anchored, mounted in the DOM
.tooltip[data-state="closed"]            hidden (default)
.tooltip[data-placement="top|right|bottom|left|…"]   resolved side after flip
```

**Rules.**

- `data-state` lives on the root and reflects open / closed.
- `data-placement` tracks the *resolved* placement after any flip /
  shift. It may differ from the requested placement when there is not
  enough viewport room on the requested side. CSS keys per-side
  transforms and arrow positioning off this attribute so the entrance
  motion always reads as moving away from the anchored edge.
- The trigger carries `aria-describedby` while the tooltip is open and
  drops it on close.

## 3. Modifiers

There are no static modifier classes. Size and placement are runtime
concerns expressed through tokens and `data-placement`, not through
`--variant` classes. A consumer who needs a wider or narrower chip
overrides `--tooltip-max-width` in scope.

## 4. Behaviour

A tooltip has three lifecycle phases. Show and hide may both be delayed.

**Show.**
1. After the show delay elapses, mount the tooltip element (first show
   only; the element is created up front and reused across opens).
2. Make the tooltip measurable (block-level, off-screen offset).
3. Compute the resolved position relative to the trigger using the
   requested placement plus a flip / shift policy that keeps the chip
   inside the viewport. Write the resolved `data-placement` on the
   root and position the arrow along the cross-axis of the anchored
   edge.
4. Start watching the trigger and the tooltip for layout changes so the
   position stays anchored while the tooltip is open (scroll, resize,
   ancestor transforms).
5. Set `aria-describedby` on the trigger pointing at the tooltip id.
6. Flip `data-state` to `open`. CSS transitions opacity and the
   placement-direction translate.

**Hide.**
1. After the hide delay elapses, flip `data-state` to `closed`.
2. Remove `aria-describedby` from the trigger.
3. After the close transition completes, stop the position watcher.

**Scheduling.**
- A pending show is cancelled if the trigger is left before the show
  delay elapses.
- A pending hide is cancelled if the trigger is re-entered before the
  hide delay elapses.
- Show and hide delays are independent options. Show defaults to a
  perceptible delay (avoids flashing on incidental hover); hide defaults
  to zero.

## 5. Options

The knobs every implementation must expose. Default values are
normative. Implementations name and shape them idiomatically — the
contract is the behaviour, not the key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Anchor side | `'top' \| 'right' \| 'bottom' \| 'left'` (with optional `-start` / `-end`) | `'top'` | Requested side. May flip at runtime if the side has insufficient room. |
| Offset | `number` (px) | `8` | Gap between trigger and chip along the placement axis. |
| Show delay | `number` (ms) | `600` | Wait between trigger enter and show. Damps incidental hover. |
| Hide delay | `number` (ms) | `0` | Wait between trigger leave and hide. |
| Trigger source | `'hover'`, `'focus'`, `'manual'` (composable) | `'hover focus'` | Which input modes show / hide the tooltip. `'manual'` wires nothing — the consumer drives it. |
| HTML content | `boolean` | `false` | Render the title as markup instead of text. Off by default — use a popover for rich content. |
| Title | `string \| null` | `null` | Imperative content override. When unset, the title is read from the trigger. |

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and
when each one is observable relative to §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the show. |
| Opened | no | After the open transition completes and the position watcher is active. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the hide. |
| Closed | no | After the close transition completes and the position watcher is detached. |

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Tab | Focus moves to the trigger | Show (if trigger source includes focus) |
| Tab | Focus leaves the trigger | Hide (if trigger source includes focus) |
| Escape | Tooltip open | Hide |

A tooltip is not focusable and does not steal focus. Keyboard
operability lives entirely on the trigger.

## 8. A11y

**Roles + ARIA.**

- The root carries `role="tooltip"`.
- While open, the trigger references the tooltip via
  `aria-describedby="<tooltip id>"`. The attribute is removed on close
  so assistive technology does not announce a tooltip that is no longer
  visible.
- The trigger's native `[title]` is taken over by the tooltip on
  initialisation and restored on teardown. Otherwise the browser's
  native tooltip would double up next to the spec'd one.

**Focus.** The tooltip never receives focus. The trigger keeps focus
throughout.

**Non-blocking.** The chip is rendered above other content but does not
trap interaction. It does not block clicks on what is underneath
(`pointer-events: none` on the root).

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, the
opacity and translate transitions are suppressed. The tooltip still
opens and closes; only the motion is removed.

**Forced colours.** The chip's inverse surface treatment is left to the
user agent under `forced-colors: active`. Borders and the arrow remain
visible.

## 9. Tokens

The customisation knobs the tooltip exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects.

**Component-scoped (set on `.tooltip`, override per tooltip or globally).**

| Variable | Affects |
| --- | --- |
| `--tooltip-max-width` | Maximum chip width before content wraps. |
| `--tooltip-padding-y` | Vertical padding inside the chip. |
| `--tooltip-padding-x` | Horizontal padding inside the chip. |
| `--tooltip-radius` | Corner radius of `.tooltip__inner`. |
| `--tooltip-z-index` | Stack order. |
| `--tooltip-font-size` | Text size. |
| `--tooltip-line-height` | Text line height. |
| `--tooltip-bg` | Chip background. |
| `--tooltip-color` | Chip text colour. |
| `--tooltip-shadow` | Drop shadow under the chip. |
| `--tooltip-arrow-size` | Square size of the caret before rotation. |
| `--tooltip-transition-duration` | Fade and slide-in duration. |

**Global tokens consumed.**

`--st-foreground` (chip background — inverse treatment),
`--st-background` (chip text — inverse treatment),
`--st-radius-sm` (default `--tooltip-radius`).

**Dark-mode flips.** None per-component. The inverse-surface treatment
follows the root token swap automatically — `--st-foreground` flips
light in dark mode, `--st-background` flips dark, and the chip reads
correctly in both themes with no override block.

## 10. Out of scope for this contract

- Rich-content surfaces — use the popover spec
- Click-to-open hint surfaces — popover, not tooltip
- Tooltip groups with shared delay budgets — implementation detail, not
  a spec commitment
- Custom anchor strategies (anchor to a virtual reference rect rather
  than a DOM element) — convenience an implementation may add, but not
  required by the spec
