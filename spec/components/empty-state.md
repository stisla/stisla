## Empty state

A centred block shown in place of content that is absent: an empty list, no
search results, a fresh account with nothing in it, a 404, or an error page.
It pairs a piece of media (an icon, an illustration, or an avatar) with a
short title, an optional line of explanatory text, and one or two actions
that move the person forward.

"Empty" here means the region is empty of its expected content, whatever the
reason. An error page is an empty state in this sense, so the intent
modifiers cover error and success outcomes too rather than splitting into a
separate result component.

This file is the cross-implementation contract. It describes what an empty
state is and what it must do; the prop names, element choice, and the media
it carries belong to each implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.empty-state                              the block — root
  .empty-state__media                     icon / illustration / avatar slot
  .empty-state__title                     heading line
  .empty-state__text                      explanatory line — muted body
  .empty-state__action                    one or two actions
```

**Required parts:** root, title. A minimum empty state is a title; everything
else is optional. Most carry media and a line of text; many carry an action.

**Media slot.** By default the media is a fixed tinted circle holding a single
glyph. When the slot instead contains richer art — the `.illustration` spot
art, a raw `<img>`, an `.icon-box`, an `.avatar`, or a `.spinner` (for a
loading-into-empty region) — it sheds its own circle and tint and simply
centres that media, so the art is never double-framed. Spot art and bitmaps
are capped to a maximum width so a tall illustration does not dominate.

**Actions.** Zero, one, or two. The slot centres its controls and wraps them,
so a primary plus a secondary action stack cleanly on a narrow region. The
controls are ordinary buttons or links; the empty state does not ship its
own action chrome.

**Class ownership.** Implementations emit these exact class names. The spec's
CSS targets them; deviations break visual conformance.

## 2. States

None at runtime. The empty state is a static presentation; it owns no JS and
nothing changes once rendered. The intent it carries (neutral, error,
success) is an author choice expressed through a modifier (see §3), not a
runtime state.

## 3. Modifiers

```
.empty-state--primary                     tone the media
.empty-state--success
.empty-state--warning
.empty-state--danger
.empty-state--info
.empty-state--compact                     smaller media + tighter padding
```

**Tone.** A tone modifier sets the media accent — its fill, tint, and glyph
colour all re-resolve from it. Use `danger` for an error state and `success`
for a done state. The title and text stay foreground and muted regardless, so
the message reads as text rather than colour, matching the alert rule. For a
one-off hue, set the tone token directly instead of adding a class.

**Compact.** Shrinks the media and tightens the padding for an empty region
inside a card, a panel, or an empty table body, where a full-size empty state
would dominate. The default (non-compact) size suits a full page or a large
empty region.

## 4. Behaviour

None. The empty state is pure presentation. Any control inside
`.empty-state__action` brings its own behaviour; the empty state does not
wrap or intercept it.

## 5. Options

The knobs every implementation must expose. Default values are normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Tone | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| none` | `none` | Picks a tone modifier, or sets the tone token for a custom value. `none` leaves the media neutral (muted). |
| Density | `'default' \| 'compact'` | `'default'` | Picks the compact modifier. `compact` shrinks the media and padding for a confined region. |

## 6. Lifecycle events

None.

## 7. Keyboard

None at the empty-state level. The block, media, title, and text never
receive focus. A control inside `.empty-state__action` keeps its native
platform keyboard semantics unchanged.

## 8. A11y

**Roles + ARIA.**

- The empty state is a presentational grouping, so the root needs no role. A
  `<div>` is fine; a `<section>` with a label is reasonable when the empty
  state is a region of a larger page.
- The media is decorative. An icon, illustration, or other glyph in the media
  slot must be hidden from assistive tech (`aria-hidden`, or `role="img"` with
  a label only when the art itself carries meaning the title does not), so the
  empty state reads as its title and text, not its art.
- The title carries the message, so render it as a real heading (`<h*>` or
  `role="heading"`) at the level that fits the surrounding page outline.
- When an empty state stands in for failed or live-region content (an error
  after a failed load, an empty result after a search), expose the change to
  assistive tech at the container that swapped it in (for example an
  `aria-live` region around the results area), not on the empty state itself.

**Focus visibility.** The empty state holds no focusable parts of its own.
Any control inside the actions slot paints its own `:focus-visible` ring from
`--st-ring` at the theme layer.

**Reduced motion.** The empty state ships no motion. If an implementation
animates a paired illustration, it suppresses that under
`prefers-reduced-motion: reduce`.

**Forced colours.** The media circle and the text stay
visible under `forced-colors: active` because they paint their own colours,
which the OS maps into the high-contrast palette.

## 9. Tokens

The customisation knobs the empty state exposes. Defaults live in the SCSS
partial.

**Layout — set on `.empty-state`.**

| Variable | Affects |
| --- | --- |
| `--empty-state-max-width` | The text measure. The block centres in its region and wraps text to this width. |
| `--empty-state-padding-block` | Vertical padding around the block. The compact modifier lowers it. |
| `--empty-state-padding-inline` | Horizontal padding around the block. |
| `--empty-state-gap` | Space between the title and the text. |
| `--empty-state-media-gap` | Space below the media, before the title. |
| `--empty-state-action-gap` | Space above the action row. |

**Media — set on `.empty-state`.**

| Variable | Affects |
| --- | --- |
| `--empty-state-media-size` | Diameter of the default media circle. |
| `--empty-state-icon-size` | Size of a bare glyph inside the default media. |
| `--empty-state-art-size` | Maximum width of a paired illustration or `<img>`. |
| `--empty-state-tone` | Media fill, tint, and glyph colour. The tone modifiers set this; an inline value wins for a one-off colour. |

**Global tokens consumed.**

`--st-foreground` (title), `--st-muted-foreground` (text and the neutral
media tone), `--st-surface` (the media tint base), `--st-spacing` (the padding
and gap rhythm), `--st-primary` / `--st-success` / `--st-warning` / `--st-danger` /
`--st-info` (the tone modifiers).

**Dark-mode flips.** None per-component. Every default rides the root token
swap automatically because the consumed globals retune for dark mode at the
theme layer.

## 10. Out of scope for this contract

- The spot art itself. The illustrations are a separate concern an
  implementation may ship; the empty state only provides the slot that hosts
  them.
- A horizontal (media-beside-text) layout. The contract stays centred and
  stacked. Compose a different layout if a project needs the inline form.
- Skeleton or loading paint for the region before it resolves to empty. Use
  `.placeholders` while loading, then swap in the empty state.
- Selectable or navigable content. An empty state presents the absence of
  content; list and menu patterns belong to `.list-group` or a menu.
