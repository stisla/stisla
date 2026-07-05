## Collapsible

A height-animated show / hide region driven by an external trigger. The
primitive behind accordion, sidebar submenus, navbar mobile menus, and
any consumer that wants the same open / closed contract on an arbitrary
container. Visual identity is intentionally minimal — the collapsible
ships the behaviour; composers paint the surface.

This file is the cross-implementation contract. It describes what a
collapsible is and what it must do; the measurement strategy, scheduling
mechanism, event mechanism, and prop names belong to each
implementation. See `SPEC.md` §2.

---

## 1. Anatomy

```
.collapsible                             root — the animated region
                                         (trigger lives elsewhere)
```

**Required parts:** root.

**Trigger.** The trigger is a separate element, not a child of the
collapsible. It carries `aria-expanded` mirroring the collapsible's
state and `aria-controls` pointing at the collapsible's id. Triggers
may be composed by a parent component (accordion header, sidebar item)
or live anywhere on the page.

**Class ownership.** Implementations emit the `.collapsible` class on
the animated region. The spec's CSS targets it and the state hook
described in §2; deviations break the height-transition behaviour.

## 2. States

```
.collapsible[data-state="open"]          fully expanded — natural height
.collapsible[data-state="closed"]        fully collapsed — display: none
.collapsible.is-collapsing               mid-transition — height being interpolated
```

**Rules.**

- `data-state` lives on the animated region (or on a composer-owned
  parent element when the collapsible is embedded inside a composer
  surface — accordion item, sidebar item — so existing CSS paint hooks
  on that parent keep working).
- `display: none` is applied in the closed state so the region adds no
  layout. The transition class `.is-collapsing` overrides this during
  animation so the height interpolation is visible.
- During an opening transition, `data-state` flips to `open` first so
  the region becomes measurable; the inline height interpolates from
  `0` to the natural target.
- During a closing transition, `data-state` stays `open` until the
  transition completes so the region keeps its display while shrinking.
- `aria-expanded` on the trigger flips synchronously with the
  user-visible intent: at the start of opening, at the start of closing.

## 3. Modifiers

There are no modifiers. A collapsible is a behaviour primitive — the
composer that wraps it (accordion, sidebar, navbar) supplies any visual
variant.

## 4. Behaviour

A collapsible has two lifecycle phases. Both interpolate height; both
are interruptible by the opposite phase.

**Open.**
1. Flip `data-state` to `open` so the region becomes measurable.
2. Mirror `aria-expanded="true"` onto each registered trigger.
3. Pin the inline height to `0` as the transition start.
4. Add the transition class.
5. Measure the natural content height (forces layout; commits the start
   value to the CSSOM).
6. Set the inline height to the measured target.
7. After the transition completes, remove the transition class, clear
   the inline height (so the region resizes naturally afterwards).

**Close.**
1. Mirror `aria-expanded="false"` onto each registered trigger.
2. Pin the inline height to the current natural height as the
   transition start.
3. Add the transition class.
4. Force layout so the start value commits.
5. Set the inline height to `0`.
6. After the transition completes, remove the transition class, clear
   the inline height, and flip `data-state` to `closed`.

**Interruption.** If a phase is invoked while the opposite phase is in
flight, the in-flight phase is settled immediately (its terminal state
is applied) before the new phase begins. The region never strands in a
partially-animated state.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, both
phases skip the transition entirely — the state flips and triggers
update synchronously, no height interpolation runs.

## 5. Options

The knobs every implementation must expose. Default values are
normative.

| Concept | Type | Default | Effect |
| --- | --- | --- | --- |
| Initial state | `boolean` | `false` | Whether the region starts open. Markup-declared state (§2) takes precedence when present. |
| Transition duration | `number` (ms) \| `null` | `null` | Override the CSS-driven duration. When set, the value is mirrored to an inline CSS custom property so CSS and JS agree. |
| External triggers | `Element[]` \| `null` | `null` | Explicit trigger list. When unset, triggers are discovered by id (any element targeting the collapsible's id). |
| State target | `Element` \| `null` | the collapsible itself | Where `data-state` is written. Composers (accordion, sidebar) point this at a parent chip so existing paint hooks on the parent fire. |

## 6. Lifecycle events

Four lifecycle phases must be observable by consumers. The mechanism is
the implementation's choice — the contract is which phases exist and
when each one is observable relative to §4.

| Phase | Cancelable | When |
| --- | --- | --- |
| Opening | yes | Before flipping `data-state` to `open`. Cancelling aborts the open. |
| Opened | no | After the open transition completes (or immediately under reduced motion). |
| Closing | yes | Before mirroring `aria-expanded="false"`. Cancelling aborts the close. |
| Closed | no | After the close transition completes and `data-state` is flipped to `closed`. |

## 7. Keyboard

The collapsible itself has no keyboard handling. Operability lives on
the trigger.

| Key | When | Action |
| --- | --- | --- |
| Enter / Space | Focus on trigger | Toggle |

A composer that embeds the collapsible (accordion, sidebar) may layer
additional keyboard semantics onto its triggers; those live in the
composer's spec.

## 8. A11y

**Roles + ARIA.**

- The animated region is typically given `role="region"` and a label
  via `aria-labelledby` pointing at the trigger, when the collapsed
  content is a discrete landmark. This is a recommendation, not a hard
  requirement — composers that wrap their own landmark semantics around
  the region may omit it.
- The trigger carries `aria-expanded` mirroring the collapsible's state
  and `aria-controls` referencing the collapsible's id.

**Focus.** The collapsible does not manage focus. Tab order through
the region follows DOM order while open; the region is removed from
the tab order when closed (because `display: none` removes its
contents from layout).

**Reduced motion.** The height transition is suppressed when
`prefers-reduced-motion: reduce` is set. The region still opens and
closes; only the interpolation is removed.

## 9. Tokens

The customisation knobs the collapsible exposes. Defaults live in the
SCSS partial.

**Component-scoped (set on `.collapsible`, override per instance or
globally).**

| Variable | Affects |
| --- | --- |
| `--collapsible-duration` | Height transition duration. Mirrored from the duration option when set imperatively. |

**Global tokens consumed.**

None. The collapsible has no visual identity of its own — surface,
border, padding, and typography come from the composer that wraps it.

**Dark-mode flips.** None.

## 10. Out of scope for this contract

- Visual identity (background, border, padding, typography) — supplied
  by the composer (accordion, sidebar, navbar) or by the consumer
  styling `.collapsible` directly
- Horizontal collapse — the spec animates height only; width animation
  is not required
- Multi-step / lazy content rendering — the collapsible measures and
  animates the existing DOM
- Coordinated open / close across siblings — composer responsibility
  (accordion single-open behaviour, sidebar submenu coordination)
