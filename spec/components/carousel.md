# Carousel

A horizontally-scrolling slideshow that cycles through a fixed set of
slides. Slides snap into place, can be advanced with prev/next controls,
selected directly via indicators, scrubbed via pointer drag, and stepped
through with the keyboard. Optional autoplay advances slides on a timer.

This file is the cross-implementation contract. It describes what a
carousel is and what it must do; the choice of motion engine, API
surface, event mechanism, primitive library, and prop names belongs to
each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.carousel                                root, positioning anchor
  .carousel__viewport                    clipping window; pointer drag wired here
    .carousel__track                     scrolling container; receives motion transform
      .carousel__slide                   one per slide
        .carousel__caption               optional bottom-edge overlay
  .carousel__control                     navigation control (one or more)
  .carousel__indicators                  per-slide button row
    .carousel__indicator                 one per slide, current slide tagged
```

**Required parts:** root, viewport, track, at least one slide.

**Optional parts:** caption (per slide), prev / next controls,
indicator row, individual indicators. A carousel with no controls and no
indicators is valid; the implementation still supports pointer drag +
keyboard navigation.

Slides may contain any markup (images, cards, video, embeds). The
carousel paints only its chrome.

## 2. States

```
.carousel[data-state="ready"]            initialised, motion engine wired
.carousel__indicator[data-state="active"]  indicator for the current slide
.carousel__control[aria-disabled="true"]   control disabled because no slide exists in that direction
```

**Rules.**

- `data-state="ready"` is set on the root once the motion engine has
  measured the track and the carousel is operable. Until then the root
  has no `data-state`.
- One and only one indicator is `[data-state="active"]` at any time. The
  active indicator also carries `aria-current="true"`. When the active
  slide changes, both attributes move to the new indicator atomically.
- `aria-disabled="true"` is set on prev / next controls when they would
  have no destination (start of track for prev, end for next), unless
  looping is enabled. The attribute removes when the control becomes
  actionable again.

## 3. Modifiers

```
.carousel--no-aspect                     opt out of the fixed viewport aspect ratio
```

Default viewport is `16 / 9`. `--no-aspect` lets the viewport size to
its tallest slide instead — useful for text cards, testimonials, or
mixed-height content where 16:9 wastes vertical space.

Control placement (`--prev`, `--next`) is an element modifier on the
control itself, not the root:

```
.carousel__control--prev                 pinned to the start edge
.carousel__control--next                 pinned to the end edge
```

`prev` / `next` follow `inset-inline-start` / `inset-inline-end` so the
controls flip correctly in RTL implementations.

## 4. Behaviour

A carousel has four ongoing concerns. Implementations satisfy all four.

**Selection + motion.**
1. The carousel tracks a single "selected" slide. When selection changes
   (programmatic call, control click, indicator click, pointer drag,
   keyboard, autoplay tick), the track translates so the selected slide
   sits in the viewport per the configured alignment.
2. Selection emits a "Selected" event (§6) with the new index and the
   previous index.
3. After motion finishes, a "Settled" event fires with the resting index.
4. Selection clamps to `[0, slideCount - 1]` unless looping is enabled,
   in which case selection wraps modulo `slideCount`.

**Pointer drag.**
1. Pointer down on the viewport begins a drag. The track follows the
   pointer.
2. Pointer up snaps the track to the nearest slide based on drag distance
   and velocity, unless free-scroll is enabled (in which case the track
   coasts to a stop without snapping).
3. Pointer down pauses autoplay; pointer up resumes it (unless
   stop-on-interaction is enabled — see autoplay below).

**Keyboard.**
1. The root is focusable (tabindex 0) when keyboard support is on.
2. Keys (§7) intercepted **only** when focus is on the root itself —
   interactive children (links, buttons inside slides) keep their native
   keyboard behaviour.
3. Keyboard navigation may permanently stop autoplay if
   stop-on-interaction is enabled.

**Autoplay.**
1. When enabled, the carousel advances one slide every `delay` ms.
2. At the end of the track, autoplay wraps to slide 0 regardless of the
   loop setting — the autoplay tick is its own scheduler, not bound to
   manual scroll bounds.
3. Autoplay pauses on pointer hover, focus inside the carousel, pointer
   drag, and when the document tab becomes hidden.
4. Autoplay resumes when the cause clears (pointer leave, focus leave,
   pointer up, tab visible).
5. If stop-on-interaction is enabled, the first user-initiated
   selection (drag, click, keyboard) kills autoplay permanently for the
   instance lifetime. Programmatic play re-enables.
6. `prefers-reduced-motion: reduce` disables autoplay entirely; no timer
   starts, no pause/resume events fire.

## 5. Programmatic API

Implementations expose these capabilities; the API shape (methods on an
instance, hook return values, store actions, etc.) is per-impl.

| Capability | Effect |
| --- | --- |
| Scroll to previous | Select the previous slide (or the last, if looping and on slide 0). |
| Scroll to next | Select the next slide (or the first, if looping and at the end). |
| Scroll to index | Select an arbitrary slide by zero-based index. |
| Read selected index | Current selected slide index. |
| Read can-scroll-prev | Whether a previous slide exists from the current position. |
| Read can-scroll-next | Whether a next slide exists from the current position. |
| Play autoplay | Start (or re-start after stop-on-interaction killed it) the autoplay timer. |
| Pause autoplay | Stop the autoplay timer and prevent automatic restart. |
| Reinitialise | Re-measure the track and re-apply options. Required when slides are added, removed, or visually resized. |

## 6. Options

The knobs every implementation must expose. Defaults are normative.
Implementations name and shape them idiomatically.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Loop | `boolean` | `false` | Wrap past first / last slide on manual navigation. |
| Slide alignment | `'start'` \| `'center'` \| `'end'` | `'start'` | Where the selected slide sits inside the viewport. |
| Slides per step | `number` | `1` | How many slides advance per prev / next action. |
| Scroll duration | `number` | engine-defined | Tween duration for motion between slides. Lower is snappier. |
| Free scroll | `boolean` | `false` | Coast on pointer release instead of snapping to a slide. |
| Autoplay | `boolean` \| `{ delay, stopOnInteraction }` | `false` | Off by default; truthy enables with defaults; object overrides per-knob. |
| Autoplay delay | `number` (ms) | `4000` | Inter-slide pause. |
| Autoplay stop on interaction | `boolean` | `false` | If true, the first user-initiated selection kills autoplay permanently. |
| Keyboard navigation | `boolean` | `true` | When true, the root is tabindex 0 and intercepts arrow / Home / End. |

## 7. Lifecycle events

Implementations expose these phases via their environment's event
mechanism. All are non-cancelable — the motion engine has no pre-change
hook, so the contract is observation-only.

| Phase | When | Payload |
| --- | --- | --- |
| Ready | After the track has been measured and the carousel is operable. | Total slide count. |
| Selected | When the selected slide changes, before motion settles. | New index, previous index. |
| Settled | After the post-selection motion finishes. | Resting index. |
| Autoplay paused | When autoplay pauses (hover, focus, drag, tab hidden). | Reason for the pause. |
| Autoplay resumed | When autoplay resumes after a pause. | Reason for the resume. |

## 8. Keyboard

Active only when keyboard navigation is enabled and focus is on the
carousel root itself. Focus on a slide child uses that child's native
keyboard behaviour.

| Key | Action |
| --- | --- |
| ArrowLeft | Scroll to previous slide |
| ArrowRight | Scroll to next slide |
| Home | Scroll to first slide |
| End | Scroll to last slide |

Pointer drag is a pointer concern, not a keyboard one — it works
regardless of the keyboard setting.

## 9. A11y

**Roles + ARIA.**

- The root carries `role="region"` and `aria-roledescription="carousel"`.
  Consumers pass `aria-label` (or `aria-labelledby`) so the region has an
  accessible name.
- Each slide carries `role="group"` and `aria-roledescription="slide"`,
  plus an `aria-label` of the form "N of M" so AT can announce position.
- The indicator row carries `role="tablist"` with its own `aria-label`.
  Each `.carousel__indicator` is a `<button>` with `aria-label` naming
  its slide ("Go to slide N"). The active indicator carries
  `aria-current="true"`.
- Prev / next controls are `<button>` elements with `aria-label`
  describing their action ("Previous slide", "Next slide"). When at a
  boundary and looping is off, the control carries `aria-disabled="true"`
  so AT announces it as unavailable.

**Focus.**

- The root is focusable (tabindex 0) when keyboard navigation is on; off
  otherwise (focus enters via interactive children).
- Focus is never trapped. Tab moves out of the carousel through standard
  tab order.
- The focus ring uses `--st-ring` and is visible at `:focus-visible` on
  the root, on each control, and on each indicator.

**Autoplay + reduced motion.**

- `prefers-reduced-motion: reduce` disables autoplay entirely. The
  carousel is still operable manually.
- The scroll motion itself is the engine's concern; implementations
  should configure the engine to respect reduced motion (instant jumps
  instead of tweens) where the engine supports it.
- Control + indicator chrome transitions also disable under reduced
  motion.

**Forced colours.**

- Control chips and indicators must remain visible under
  `forced-colors: active`. The chip background can drop to `Canvas` and
  border to `CanvasText`; the indicator active pill must read against
  the slide.

## 10. Tokens

The customisation knobs the carousel exposes. Defaults live in the SCSS
partial; the spec only commits to which knobs exist and what each one
affects.

**Component-scoped (set on `.carousel`).**

| Variable | Affects |
| --- | --- |
| `--carousel-radius` | Viewport corner radius. |
| `--carousel-aspect-ratio` | Viewport aspect ratio. Opt out per-instance via `--no-aspect`. |
| `--carousel-slide-gap` | Inline gap between adjacent slides, applied as start-side padding on each slide. |
| `--carousel-control-size` | Prev / next chip square size. |
| `--carousel-control-inset` | Distance from chip to viewport edge. |
| `--carousel-control-bg` | Chip background (rest). |
| `--carousel-control-bg-hover` | Chip background (hover). |
| `--carousel-control-color` | Chip icon colour. |
| `--carousel-control-shadow` | Chip drop shadow. |
| `--carousel-indicators-inset` | Distance from indicator row to viewport bottom. |
| `--carousel-indicator-size` | Inactive indicator dot diameter. |
| `--carousel-indicator-gap` | Space between indicators. |
| `--carousel-indicator-bg` | Inactive indicator fill. |
| `--carousel-indicator-bg-active` | Active indicator fill. |
| `--carousel-indicator-width-active` | Active indicator pill width (animates from dot to pill). |
| `--carousel-caption-padding-block` | Caption vertical padding. |
| `--carousel-caption-padding-inline` | Caption horizontal padding. |
| `--carousel-caption-color` | Caption text colour. |
| `--carousel-caption-bg` | Caption background. Default is a transparent-to-dark gradient so caption text reads over any image. |
| `--carousel-transition-duration` | Chrome (control hover, indicator width) transition duration. Reduced motion zeros this. |

**Global tokens consumed.**

`--st-overlay` and `--st-overlay-foreground` (theme-independent chrome
fills for controls, indicators, and caption gradient), `--st-ring`
(focus ring on the root, controls, indicators).

**Dark mode.** The carousel chrome uses self-contained OKLCH literals
that read against any image regardless of theme. No tokens flip under
dark mode by default. Implementations may override the control or
indicator tokens in dark mode if they want a theme-tracking treatment.

## 11. Out of scope for this contract

- Multiple-slides-visible layouts (gallery / peek). The contract is
  single-slide selection with optional slide gap; multi-slide layouts
  are an implementation extension if needed.
- Vertical orientation. The carousel is horizontal-only; vertical
  scrolling content is a different component pattern.
- Touch-momentum tuning beyond drag / snap / free-scroll. The motion
  engine owns physics; tuning curves and easing are not in the spec.
- Lazy-loading slide content. Consumers load what they want; the
  carousel doesn't observe slide visibility.
- Thumbnail strips (a second linked carousel as navigation). Compose
  two carousels manually; the spec doesn't ship a coordinator.
- Infinite virtual scroll. The carousel operates on a fixed slide set.
