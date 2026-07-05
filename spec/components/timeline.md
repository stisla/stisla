## Timeline

An ordered sequence of events laid along a rail. Each event sits beside a
marker on the rail and carries a time, a title, and a short description.
Use it for activity feeds, audit logs, order and shipping status,
changelogs, and release histories.

This file is the cross-implementation contract. It describes what a
timeline is and what it must do; the prop names, element choice, and the
status API belong to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.timeline                                 the rail — root
  .timeline__item                         one event
    .timeline__marker                     the dot / icon on the rail
    .timeline__body                       the event content
      .timeline__time                     time / date label — muted, smaller
      .timeline__title                    heading line
      .timeline__text                     description — muted body
```

**Required parts:** root, item, marker.

**Optional parts:** every part under `.timeline__body`. A minimum
timeline is a list of items, each with a marker and some text inside the
body. The body parts only exist to keep typography and spacing consistent
across consumers.

**Marker content.** Every marker is a circle of `--timeline-marker-size`.
An empty marker paints a small dot inside it; an icon or step number
centres inside it; an avatar or image fills it. Markers stay a uniform
size so they line up however a timeline mixes them, and the connector
meets each one with the same gap. Scale them all by changing
`--timeline-marker-size` on the root.

**Slot order.** The DOM order inside an item is marker then body. Under
RTL the rail moves to the inline end automatically because the CSS uses
logical properties for the gutter and connector offset.

**The connector is not a part.** The line that joins one marker to the
next is drawn as a pseudo-element on `.timeline__item` and runs through
the marker gutter. It is suppressed on the last item so the rail stops at
the final marker. There is no DOM node for it, so authors never have to
remember to drop the line on the last row.

**Class ownership.** Implementations emit these exact class names. The
spec's CSS targets them; deviations break visual conformance.

## 2. States

State lives on the item as `data-state` and is set by the author. The
timeline has no JS, so nothing changes these at runtime; they describe
where each event sits in a process.

```
.timeline__item                           default — neutral marker, solid connector
.timeline__item[data-state="complete"]    filled marker, solid connector
.timeline__item[data-state="current"]      ringed marker, connector turns dashed below it
.timeline__item[data-state="pending"]      hollow muted marker, dashed connector
```

**complete** marks an event that already happened. **current** marks
where the process is now and draws a ring around the marker so it reads as
the active step; the connector leaving it turns dashed to show the rest is
not done yet. **pending** marks a future step with a hollow muted marker.
A timeline with no `data-state` anywhere is a plain history where every
event already happened, which is the common case for activity feeds and
audit logs.

State and colour are independent. A `current` item can still carry an
intent colour from a marker modifier (see §3), so a "payment failed"
event can be both the current step and red.

## 3. Modifiers

```
.timeline--alternate                      centre rail, items alternate sides
.timeline__marker--primary                intent colour on the marker
.timeline__marker--success
.timeline__marker--danger
.timeline__marker--warning
.timeline__marker--info
```

**Alternate.** Moves the rail to the centre and places items on
alternating sides, odd items on the inline start and even items on the
inline end, using `:nth-child`. The marker stays centred on the rail and
the connector runs down the middle. This layout needs width, so below a
breakpoint it collapses back to the standard left-rail layout where every
item sits on one side. Implementations pick the breakpoint; the fallback
is required so the timeline stays readable on a phone.

**Intent colour.** The marker modifiers set `--timeline-marker-color` to a
palette token for a fixed meaning, like green for paid or red for failed.
They are a shorthand for the token override and carry no behaviour. For a
one-off colour, set `--timeline-marker-color` on the item directly instead
of adding a class.

## 4. Behaviour

None. The timeline is pure layout. It owns no JS class and emits no
lifecycle events. If an event body holds a link or a button, that control
brings its own behaviour; the timeline does not wrap or intercept it.

## 5. Options

The knobs every implementation must expose. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Layout | `'standard' \| 'alternate'` | `'standard'` | Picks the modifier class. `alternate` centres the rail and alternates item sides, with a required collapse to standard below a breakpoint. |
| Status | `'complete' \| 'current' \| 'pending' \| none` | `none` | Sets `data-state` on the item. `none` leaves the item neutral. |
| Marker intent | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| none` | `none` | Picks a marker colour modifier, or sets `--timeline-marker-color` for a custom value. |

## 6. Lifecycle events

None.

## 7. Keyboard

None at the timeline level. The rail, markers, and items never receive
focus. When an event body contains an `<a>` or a `<button>`, that element
keeps its native platform keyboard semantics unchanged.

## 8. A11y

**Roles + ARIA.**

- The timeline is an ordered list of events, so prefer `<ol>` for the
  root and `<li>` for each item. The ordering is meaningful and `<ol>`
  carries it to assistive tech without extra ARIA.
- The marker and connector are decorative. An icon placed inside a marker
  must be hidden from assistive tech (`aria-hidden`) so the event reads as
  its text, not its glyph.
- When `data-state` carries meaning that the text alone does not convey,
  expose it to assistive tech. Add visually hidden text inside the item
  (for example "Completed" or "Current step") or label the item, so a
  screen reader hears the status the colour and shape imply.

**Focus visibility.** The timeline holds no focusable parts of its own.
Any interactive control inside an event body paints its own
`:focus-visible` ring from `--st-ring` at the theme layer.

**Reduced motion.** The only motion the spec allows is an optional pulse
on the `current` marker's ring. Suppress it under
`prefers-reduced-motion: reduce` so the marker holds a static ring.

**Forced colours.** The marker and connector stay visible under
`forced-colors: active` because they paint their own colours, which the OS
keeps in the high-contrast palette. The ring on a `current` marker remains
visible for the same reason.

## 9. Tokens

The customisation knobs the timeline exposes. Defaults live in the SCSS
partial.

**Geometry — set on `.timeline`.**

| Variable | Affects |
| --- | --- |
| `--timeline-marker-size` | Marker size. Every marker is a circle of this size: dots and icons centre inside it, avatars and images fill it. One value scales every marker in the timeline together. |
| `--timeline-dot-size` | Diameter of the bare dot shown when a marker is empty. |
| `--timeline-connector-width` | Thickness of the rail line. |
| `--timeline-connector-gap` | Space between a marker and the rail line at both ends of every segment, so the line floats clear of the markers instead of touching them. |
| `--timeline-connector-style` | Rail line style. `solid` by default; the `current` and `pending` states flip it to `dashed`. |
| `--timeline-gutter` | Distance from the rail to the event body. |
| `--timeline-gap` | Vertical space between items. |

**Paint — set on `.timeline`, overridable on `.timeline__item`.**

| Variable | Affects |
| --- | --- |
| `--timeline-marker-color` | Marker fill, dot, icon, and tint. The intent modifiers set this; an item-level override wins for a one-off colour. |
| `--timeline-marker-ring` | Static halo colour on a `current` marker. |
| `--timeline-marker-ring-size` | Static halo thickness on a `current` marker. |
| `--timeline-ping-duration` | Period of the `current` marker's ping. The ping is suppressed under reduced motion; the static halo stays. |
| `--timeline-connector-color` | Rail line colour. |

**Global tokens consumed.**

`--st-border` (default connector and the pending marker outline),
`--st-primary` (default `current` ring and marker), `--st-foreground`
(title), `--st-muted-foreground` (time, description, and pending fill),
`--st-spacing` (gutter and gap rhythm).

**Dark-mode flips.** None per-component. Every default rides the root
token swap automatically because the consumed globals retune for dark mode
at the theme layer.

## 10. Out of scope for this contract

- Horizontal orientation, where events run left to right along a
  horizontal rail. A later revision may add it as a modifier; this
  contract stays vertical.
- A dedicated date column, where times share a fixed gutter on the
  opposite side of the rail. Compose it with the body layout if a project
  needs it.
- Compact roadmap density presets. Retune `--timeline-gap` and
  `--timeline-marker-size` instead.
- Collapsible event bodies. Pair an item with `.collapsible` when an
  event needs to reveal a nested body.
- Skeleton or loading paint. Wrap with `.placeholders` if a feed loads
  asynchronously.
- Selectable or navigable items. The timeline is a presentation of
  history, so list selection patterns belong to `.list-group` or a menu.
