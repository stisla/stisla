# Demo / component coverage audit — legacy `src/site/pages/*.njk` vs v3 `docs/src/routes/docs/vanilla/*.tsx`

Status: **RESTORATION COMPLETE, 2026-06-27.** All gaps below have been restored. Tier 0 (slider,
timeline, avatar JS, custom select) ported as whole components. Tiers 1–3 (36 docs pages) restored via
8 parallel agents, each re-adding the dropped sections/variants to the `.tsx` from the authoritative
`.njk`, re-wiring interactive demos live (`data-stisla-*`), keeping the intentional v3 renames. Verified:
`check-tokens` clean (109 files), `pnpm --filter docs build` clean, semantic spot-check of 15 interactive
pages all wired. Kept below as the record of what was fixed.

Original status: DRAFT findings — source of truth for what the v3 docs port CLIPPED from the
authoritative legacy demo pages.

## Conventions — NOT gaps (intentional v3 changes; do not "fix")
- **Size renames**: `--compact`/`--roomy` → `--sm`/`--lg`; some components added `--xl` (button, avatar).
  Per ROADMAP "size renames". Settled spec.
- **`is-*` → data-attribute hooks**: `.is-loading`→`aria-busy`, `.is-indeterminate`→`[data-indeterminate]`,
  `.is-collapsed`→`[data-collapsed]`, `.is-highlighted`→`[data-highlighted]`, etc. Settled.
- **Class renames**: `.btn`→`.button`, `.visually-hidden`→`.sr-only`, `--st-*` tokens→`--color-*`. Settled.
- **Layout scaffolding**: `.demo-row`/`ui.demo()`/BS utilities → Tailwind utilities + `<Demo>`. Expected.

## Cross-cutting REAL gaps (hit almost every interactive component)
1. **Keyboard sections dropped wholesale** — accordion, autocomplete, collapsible, combobox, dialog,
   drawer, menu, popover, tabs, toggle, toggle-group, tooltip, carousel, scroll-area, select. (Deferred
   during the CSS sweep; the JS is live now, so restore.)
2. **Events sections dropped wholesale** — same set + avatar. The per-component `stisla:<name>:*` event
   contracts are undocumented.
3. **Live/interactive demos flattened to static** or removed (programmatic-control, trigger, position,
   imperative-open, validation-form recipes). JS is live now → re-wire.
4. **"Merged" sections silently lost a variant the heading still names** — e.g. table striped-cols &
   borderless, spinner grow colors, toggle underline/heart. Treat merges as suspect.

---

## TIER 0 — whole components NOT ported (need CSS and/or JS, not just demos)
- **[DONE 2026-06-27] slider** — ported CSS (`style/src/slider/slider.css`, token-converted), JS
  (`vanilla/src/components/slider.js` verbatim), registered, demo.css import, new docs route
  `vanilla/slider.tsx` (10 sections, all live) + nav link. Build + token clean.
- **[DONE 2026-06-27] timeline** — ported CSS (`style/src/timeline/timeline.css`, token-converted; rail
  pseudo-element, [data-state] complete/current/pending, intent modifiers, alternate layout, ping
  keyframe), demo.css import, new docs route `vanilla/timeline.tsx` (6 sections + grouped Customization)
  + nav link. Build + token clean. No JS (pure layout).
- **[DONE 2026-06-27] select (custom popup)** — authored the deferred custom CSS in `select.css` (trigger
  + popup/item/indicator/group-label, menu-surface recipe expanded inline with `--select-*`; highlight
  `[data-highlighted]`, selected `[aria-selected="true"]`). Ported `Stisla.Select` (is-* → data-attr
  recast), registered. Docs rebuilt: restored native Size-attribute/Helper-text/Browser-validation, added
  the custom-popup group (Custom basic, Keyboard, Multiple `+N more`, Option groups, Disabled+invalid,
  Events). Build + token clean.
- **[DONE 2026-06-27] avatar (JS)** — ported `avatar.js` (preload → `data-status`), registered; docs
  restored to 8 live sections (live preload + Broken-source + Loading-state `-delay` + Events). Build clean.
- **illustration gallery** — the 21-metaphor set + interactive export toolchain (accent picker, theme
  toggle, Copy-SVG / download-SVG / download-PNG) is unported. v3 ships ONE generic SVG. (Known separate
  effort per the v3 file's own note.)
- **prose** — legacy `_prose.scss` has no v3 `style/src/prose/` folder; confirm where `.prose` lives in v3
  (docs styles?) since several demos depend on it (link "In running prose", kbd "In running text").

---

## TIER 1 — catastrophic demo clipping (>50% dropped). v3 CSS + JS exist; restore demos.

### carousel — 8 of 10 sections dropped
MISSING: Installation, Keyboard, With controls, With indicators, With captions, Card content (testimonial
cards on `--no-aspect` + retuned chrome tokens), Autoplay (`-autoplay` + pause-on-hover/focus/drag/visibility
+ reduced-motion), Loop (`-loop`), Events (4 events). Basic merged controls+indicators+caption and swapped
real imagery for color blocks. Customization collapsed 5 grouped tables → 1.

### tooltip — 9 of 11 dropped
MISSING: Keyboard, Triggers (`-trigger` hover/focus/manual), Delay (`-delay` 0/600/1200), On a link (in
`.prose`), Icon-only triggers (+`aria-label` pairing), HTML content (`-html="true"` with `<kbd>`), Long
content (wrap at `--tooltip-max-width`), Disabled trigger (focusable wrapper), Events. Placements halved
(8→4: dropped all `-start`/`-end` aligned variants).

### toast — 7+ of 12 dropped
MISSING: Setup (region mount + multi-region naming), Keyboard (hover/focus pause, WCAG 2.2.1), Leading slot
(5-variant: avatar/icon-color/icon-box/spinner/emoji), Trigger (markup `data-stisla-toast-trigger` +
per-instance delay/autohide), Auto-hide and persistent, Position (6-corner grid), Promise (as a section),
Events (5 events). Intents 5→4 (dropped primary) + bodies trimmed + dropped the `role="alert"` danger note.

### menu — 8 of 13 dropped
MISSING: Keyboard, With icons (standalone), Destructive items (dedicated), Item shortcuts (`.menu__shortcut`
+ `<kbd>`), Media rows (`.media.media--seamless` as `role="menuitem"` — the borrow-by-role recipe), Form inside
(`-auto-close="outside"`), Placement (`-placement` 4 variants), Events. Checkbox+Radio merged & trimmed;
group `role="group"`+`aria-labelledby` a11y pairing weakened.

### combobox — 7 of 12 dropped
MISSING: Installation, Keyboard, Tagging (`-create="true"`), Option groups (`<optgroup>`), Disabled,
Browser validation (`required` + submit form), Invalid (`aria-invalid` via `:has()`), Events. (Now LIVE via
Tom Select, so these can be real.) v3 added a useful Baseline (native, no-JS) demo — keep.

### scroll-area — 5 of 6 dropped
MISSING: Installation, Horizontal (`-overflow-y="hidden"`), Both axes (wide table), Always visible
(`-auto-hide="never"`), Tinted (recolor handle via `--scroll-area-handle-*`), Events.

### tabs — 5 of 10 dropped
MISSING: Keyboard, Manual activation (`-activation-mode="manual"`), Programmatic control (`setValue()` +
event log), External triggers (+ "Without a list" subsection), Events.

### autocomplete — 6 of 9 dropped
MISSING: Keyboard, From inline JSON (as a section), Minimum length (`-min-length`), Disabled, Invalid
(`aria-invalid` + `.field__error`), Events. Basic lost the `<datalist>`+`list=` authoring style and the
`.field`/label wrapper.

### popover — 6 of 10 dropped
MISSING: Keyboard, Placements (top/right/bottom/left matrix), Hover trigger (`-trigger-mode="hover focus"`),
Rich content (form-in-popover), Imperative (`.open()` + script), Events. "Panel" degraded — dropped
`.popover--menu`, `.media` rows, `media--unread`, icon-box/avatar slots, footer link.

### collapsible — 4 of 7 dropped + went fully static
MISSING: Keyboard, Inside a card (API-token recipe), Programmatic control (Open/Close/Toggle via
`getOrCreate()`), Events. Basic/Open-by-default flattened to static "Open"/"Closed" — no working toggle.

### toggle-group — 3 of 10 dropped
MISSING: Keyboard, Form data checkbox set (native checkbox multi-select group), Events. Sizes trimmed to 2
members; demos declared static (re-wire to live).

### table — 9 of 22 dropped
MISSING: Vertical alignment (`--align-middle`), Bordered-inside-a-card, Full dashboard capstone. Striped-cols
(`--striped-cols`) and Borderless (`--borderless`) live demos dropped from merged sections (headings still
name them). With-badges/avatars trimmed; Selectable rows lost the bulk-action-header card; live select-all
(`data-demo-select-*`) deferred.

---

## TIER 2 — heavy clips (v3 CSS+JS exist; restore the missing demos/recipes)

- **dialog** — MISSING Keyboard, Events; Basic lost the autofocus form-body demo. (Sizes/Fullscreen just
  relocated — fine.)
- **drawer** — MISSING Keyboard, Body-scroll-allowed (standalone), Events. Placements & Floating thinned:
  rich bodies (list-group, notification feed, what's-new grid, share input-group, invite/help/cookie
  recipes) → placeholders; Floating shows end-only (dropped start + bottom).
- **button** — MISSING "Works on any element" (`<button>`/`<a role=button>`/`<input submit>`); Loading 3→1
  (dropped icon-replacement demo + live `data-demo-loading` click-to-load); Neutral standalone solid+outline
  dropped.
- **field** — MISSING Inline label and value (slider `<output>` live). "Works with every control" dropped
  the `.select` and `.slider` (kept textarea+input). Item-disabled dropped the radio row.
- **input-group** — MISSING Select (select-stands-in-for-input), Labelled select (label addon + globe/lang
  select); "With button" lost the size-paired button demo.
- **list-group** — MISSING Custom content (activity feed), Contacts (chat rows), Payment methods
  (`--block` + per-row switch). Settings→"In a card" dropped the Push switch + Public-handle input rows.
  Basic/Flush/Horizontal/With-badge trimmed a row each (incl. the Drafts `--soft` badge row).
- **media** — MISSING Notification settings (icon-box figure + switch action), Payment methods (brand glyph
  + badge/Default action, incl. no-action row), File list (two icon-buttons in one `.media__action` — the
  only multi-action slot demo). Team→3, Products→2. Basic swapped icon-box figure for bare icon.
- **sidebar** — MISSING standalone Collapse toggle: the big live composition + most collapse API prose
  (`stisla:sidebar:collapse-change`, `aria-controls` external trigger, `toggleCollapsed()/.collapse()/
  .expand()/.isCollapsed()`, localStorage persistence, `closeAllSubmenus()`). Link-parent-submenu dropped
  the closed Billing row; As-a-panel/Recolor content trimmed. NOTE: collapse hook is `[data-collapsed]` in
  v3 vs `.is-collapsed` legacy — verify CSS/JS.
- **page** — 5 demos → 1. MISSING The page wrapper (`.page__body`), Page header standalone (+ "Without
  actions", narrow-wrap), Sections standalone, Content width (full/container/custom + nesting), Putting it
  together.
- **placeholders** — MISSING Colors (6 `--placeholder-bg` tints). Animation trimmed (glow+wave pairs → 1
  each). "Example" real-vs-skeleton card mirror replaced by a different avatar skeleton.
- **pagination** — MISSING Alignment (live `--center`/`--end`). Sizes thinned (3-chip, no prev/next);
  Disabled/ellipsis merged & lost the labeled-with-icon prev/next variant.
- **spinner** — Colors trimmed (grow lost warning/info/muted; ring lost muted). Sizes lost the grow one-off.
  In-buttons lost the grow standalone leading spinner.
- **switch** — MISSING Browser validation (`required` + `:user-invalid`).
- **toggle** — MISSING Keyboard, Events. Icon-only/round merged (dropped underline + heart). Disabled lost
  the disabled form-input row.
- **accordion** — MISSING Keyboard, Single-open (as its own section), With leading icon, Events. Basic
  forced into single-open (multi-open default no longer shown); Flush lost the "inside a card" recipe;
  dropped `id`/`aria-labelledby` heading/body pairing.
- **badge** — MISSING Loading (spinner-in-badge). In-buttons/With-icon variant sets reshuffled & thinned
  (dropped `badge--danger` count, outline button, star "Featured"). (v3 added Flattened, Count — keep.)
- **empty-state** — MISSING With actions (two-action stack), Media (icon-box/spinner slot), With an
  illustration. Tone Retry paint changed.

---

## TIER 3 — minor / near-clean (small trims, mostly content-count)
- **alert** — dropped 2 second-demo blocks (neutral title/desc; neutral Undo action).
- **avatar-group** — Overflow-tail lost the plain (non-retinted) tail; Composition trimmed a member.
- **breadcrumb** — MISSING Embedded SVG divider (`--breadcrumb-divider` data-URL).
- **card** — Basic lost the embedded sign-in `<form>` content.
- **kbd** — MISSING In running text (`.prose` scaling); Combinations lost `⇧ Enter` + the dedicated `+` demo.
- **link** — MISSING In running prose (`--prose-link-color`). (v3 added With icon — keep.)
- **meter** — Intents dropped the `info` bar (5→4).
- **list/others size renames** — confirm only.
- **CLEAN 1:1**: icon-box, input, button-group, checkbox, radio, progress, indicator (pin utilities pending),
  separator, textarea. native-select demos within select.tsx dropped Helper-text, Size-attribute, and the
  Browser-validation form (kept server `aria-invalid`).

---

## Suggested restoration order
1. TIER 0 whole components (slider, timeline, avatar JS, custom select) — they're absent, not clipped.
2. TIER 1 (carousel, tooltip, toast, menu, combobox, scroll-area, tabs, autocomplete, popover, collapsible,
   toggle-group, table) — biggest demo losses; JS already live so demos can be real.
3. TIER 2, then TIER 3.
Per page: re-add dropped sections from the `.njk`, re-wire live demos (JS is live), keep intentional renames.
