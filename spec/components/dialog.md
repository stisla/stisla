# Dialog

A modal surface that interrupts the page to require user attention or
action. Centered by default, scaled in over a dim backdrop, and dismissable
via Escape, backdrop click, or an explicit close control.

This file is the cross-implementation contract. It describes what a
dialog is and what it must do; the choice of focus-management mechanism,
API surface, event mechanism, primitive library, and prop names belongs
to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.dialog                                  root, owns runtime state
  .dialog__backdrop                      translucent dim, dismiss target
  .dialog__panel                         centered wrapper, height-bounded
    .dialog__content                     the visible card surface
      .dialog__close                     floating dismiss control (optional)
      .dialog__header                    header row (optional)
        .dialog__title                   heading-agnostic title
      .dialog__body                      main content
      .dialog__footer                    action row (optional)
```

**Required parts:** root, backdrop, panel, content.

**Optional parts:** close, header, title, body, footer. A dialog with
no body / header / footer renders as an empty content surface — valid for
fully-custom inner markup, but the BEM classes still apply where present
so the visual identity follows the spec.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

```
.dialog[data-state="open"]               visible, focus trapped, scroll locked
.dialog[data-state="closed"]             hidden (default)
.dialog__panel.is-shaking                visual nudge after a static-backdrop dismiss
html.is-dialog-open                      page scroll lock while any dialog is open
```

**Rules.**

- `data-state` lives on the root and reflects open/closed. The convention
  matches what mainstream JS primitive libraries emit, so the same CSS
  works without a glue layer.
- `aria-hidden` mirrors `data-state`: `false` when open, `true` when
  closed. Both are set atomically.
- `.is-dialog-open` is set on `<html>` while at least one dialog is open.
  Removed when the last open dialog closes. Stacked opens use a refcount.
- `.is-shaking` is one allowed hook for the static-backdrop feedback (§4);
  another visual hook (e.g. a separate animation trigger) is acceptable
  as long as a click on a static backdrop produces an observable nudge.

## 3. Modifiers

```
.dialog--compact                              width: 20rem
.dialog--roomy                              width: 40rem
.dialog--spacious                              width: 60rem
.dialog--fullscreen                      covers the viewport, no border / radius
.dialog--almost-fullscreen               2.5rem breathing margin around the dialog
.dialog__panel--top                      pin to top of viewport
.dialog__panel--bottom                   pin to bottom of viewport
.dialog__panel--scrollable               body overflows; panel stays fixed-height
```

Default (no size modifier) is `width: 28rem`, centered. Size modifiers
retune `--dialog-width` only; vertical position modifiers retune the
margin tokens and panel positioning.

`--fullscreen` and `--almost-fullscreen` are exclusive — applying both is
undefined. Pick one.

## 4. Behaviour

A dialog has four lifecycle phases. Implementations satisfy all four
even if some are no-ops in the chosen primitive library.

**Open.**
1. Capture currently-focused element (for return on close).
2. Apply scroll lock to `<html>` (`.is-dialog-open`).
3. Mark sibling content `inert` so AT skips the page behind.
4. Flip `data-state` to `open` and `aria-hidden` to `false`. Transition
   the backdrop opacity + panel scale per the CSS.
5. After transition end, move focus into the dialog. Initial focus order:
   - Element with `autofocus` inside `.dialog__content`
   - First tabbable element inside `.dialog__content`
   - `.dialog__content` itself (with `tabindex="-1"`)
6. Trap focus inside `.dialog__content` (Tab and Shift+Tab cycle within
   the content; focus does not escape to the page).

**Close.**
1. Release the focus trap.
2. Flip `data-state` to `closed` and `aria-hidden` to `true`. Transition
   the backdrop opacity + panel scale.
3. After transition end, release `inert` on siblings.
4. Decrement the refcount; if zero, remove `.is-dialog-open` from
   `<html>`.
5. Return focus to the element captured in Open step 1, unless an option
   suppresses this.

**Dismiss.**
1. Three triggers:
   - Click on `.dialog__backdrop`
   - Press Escape while focus is in the dialog
   - Click on an explicit dismiss element (`.dialog__close` or any
     implementation-marked dismiss control)
2. The first two honour the `backdrop` / `keyboard` options. The third
   always dismisses.
3. If `backdrop: 'static'` and the dismiss came from a backdrop click,
   shake the panel and **do not** close. Explicit dismiss controls still
   close even on static.

**Stacking.**
- Dialogs may stack. Open count is tracked at the document level so the
  scroll lock toggles only when transitioning between zero and non-zero
  open dialogs.
- Each opened dialog stores its own return-focus target so closing them
  in any order restores focus correctly.

## 5. Options

The knobs every implementation must expose. Default values are normative.
Implementations name and shape them idiomatically (DOM data-attributes,
React props, Vue v-bind, etc.) — the contract is the behaviour, not the
key name.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Backdrop dismiss | `true` \| `false` \| `'static'` | `true` | `false` disables backdrop dismiss; `'static'` shakes instead of closing |
| Keyboard dismiss | `boolean` | `true` | `false` disables Escape dismiss |
| Initial focus | `boolean` | `true` | `false` skips moving focus into the dialog on open |
| Return focus | `boolean` | `true` | `false` skips restoring focus to opener on close |

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice (DOM CustomEvent, React prop callback, Vue
emit, signal, etc.) — the contract is which phases exist and when each
one is observable relative to the lifecycle in §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes and focus is trapped. |
| Closing | yes | Before flipping `data-state` to `closed`. Cancelling aborts the close. |
| Closed | no | After the close transition completes and focus is restored. |

## 7. Keyboard

| Key | When | Action |
| --- | --- | --- |
| Escape | Dialog open, `keyboard: true` | Close |
| Tab | Focus in dialog | Move to next focusable element inside `.dialog__content`. Focus cycles back to the first on the last. |
| Shift+Tab | Focus in dialog | Move to previous focusable element. Cycles to the last on the first. |
| Enter / Space | Focus on explicit dismiss control | Activate dismiss |

Implementations must not allow Tab to escape the dialog while open.

## 8. A11y

**Roles + ARIA.**

- The root `.dialog` (or `.dialog__content`, depending on primitive
  library convention) is the modal surface. Implementations apply
  `role="dialog"` and `aria-modal="true"` to the element that owns
  focus. Both are required.
- If `.dialog__title` exists, the dialog references it via
  `aria-labelledby` pointing at the title's `id`. If no title, the
  dialog uses `aria-label` provided by the consumer.
- `aria-describedby` may point at `.dialog__body` (or a specific element
  inside it) when a description is meaningful. Optional.
- `aria-hidden` mirrors `data-state` on the root (open → `false`,
  closed → `true`).

**Focus management.**

- On open, focus moves into the dialog per the initial-focus order in §4.
- Focus is trapped inside `.dialog__content` while open.
- On close, focus returns to the element that was focused immediately
  before open, unless `returnFocus: false`.

**Inert background.** Siblings of the dialog root are marked `inert`
while the dialog is open. AT skips them; mouse / keyboard cannot reach
them. The implementation chooses how (native `inert` attribute, or
applying it via a helper).

**Scroll lock.** The page behind a dialog does not scroll. The
implementation applies `.is-dialog-open` to `<html>`; the CSS handles the
rest (`overflow: hidden`, `scrollbar-gutter: stable`).

**Reduced motion.** When `prefers-reduced-motion: reduce` is set,
backdrop opacity and panel scale transitions are disabled. The
`.is-shaking` animation is also disabled. The dialog still opens / closes
instantly; only the motion is suppressed.

## 9. Tokens

The customisation knobs the dialog exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects. Tuning a default is a non-breaking change as long as the var
name and its surface (background, padding, radius, etc.) stay the same.

**Component-scoped (set on `.dialog`, override per dialog or globally).**

| Variable | Affects |
| --- | --- |
| `--dialog-width` | Max panel width. Retuned by `--compact` / `--roomy` / `--spacious` modifiers. |
| `--dialog-margin-inline` | Horizontal viewport padding around the dialog. |
| `--dialog-margin-block` | Vertical viewport padding around the dialog. |
| `--dialog-padding-inline` | Inline padding on header, body, and footer. |
| `--dialog-padding-block` | Block padding on header and body. |
| `--dialog-radius` | Corner radius of `.dialog__content`. |
| `--dialog-z-index` | Stack order. |
| `--dialog-bg` | Content surface colour. |
| `--dialog-color` | Content text colour. |
| `--dialog-border-width` | Content border width. |
| `--dialog-border-color` | Content border colour. |
| `--dialog-shadow` | Drop shadow under `.dialog__content`. |
| `--dialog-backdrop-bg` | Backdrop fill. |
| `--dialog-backdrop-blur` | Backdrop frosted blur radius. |
| `--dialog-title-font-size` | Title size. |
| `--dialog-title-font-weight` | Title weight. |
| `--dialog-close-size` | Close chip square size. |
| `--dialog-close-bg` | Close chip background (rest). |
| `--dialog-close-bg-hover` | Close chip background (hover). |
| `--dialog-close-color` | Close chip icon (rest). |
| `--dialog-close-color-hover` | Close chip icon (hover). |
| `--dialog-footer-padding-block` | Footer vertical padding. |
| `--dialog-footer-bg` | Footer background. |
| `--dialog-footer-border-color` | Footer top border. |
| `--dialog-transition-duration` | Open / close transition. |

**Global tokens consumed.**

`--st-surface`, `--st-surface-2`, `--st-foreground`, `--st-border`,
`--st-ring` (focus ring on `.dialog__close`). Padding and margins ride
the spacing base `--st-spacing` via the `space()` helper.

**Dark-mode flips.** In dark mode, the close-chip variables
(`--dialog-close-bg`, `--dialog-close-bg-hover`, `--dialog-close-color`,
`--dialog-close-color-hover`) flip luminance so the chip stays readable
against the deep dark surface. The backdrop stays the same in both themes.

## 10. Out of scope for this contract

- Non-modal dialogs (`role="dialog"` without `aria-modal`) — use the
  popover spec instead
- Sheet / drawer presentations from screen edges — use the drawer spec
- Confirm / alert dialog patterns as their own component — those are
  recipe-level compositions of the dialog spec, not separate components
- Programmatic `confirm(text): Promise<boolean>` helpers — implementation
  may add these as conveniences but they are not required by the spec
