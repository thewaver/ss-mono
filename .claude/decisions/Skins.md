# Decisions: `Skins`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Skins

**A Theme is pure colors; a Skin is shape and where those colors go** — the user's split. Shaded paints a
gradient button; another Skin might paint a bordered one with heavily rounded corners, from the same Theme. A
Skin owns everything that paints — color, background, shadow, border, radius, padding, font — while display,
size, position, z-index, transforms and transitions stay in the painter, for now. **A Skin is picked the way a
Theme is**: a class on `<html>`, swapped from the left nav's settings (`PageComponents/Skin`, beside
`PageComponents/Theme`), from `PLAYGROUND_SKINS` in `Skins/Skin.const.ts`. **No Skin reads the theme's shadow
scale**: Shaded and Glass hold their own copies (`SHADOW_SMALL`, `SHADOW_MEDIUM`, `SHADOW_LARGE`), and
`themeVars.shadow` stays only for the custom painters outside the Skins, until the user decides their shadows. **Every Skin lives in
`Skins/Variants/`**, one file each, the user's placement; `Skins/` itself holds only the machinery.

**Fourteen Skins were built, Shaded being the default; `PLAYGROUND_SKINS` holds the ones still kept**, and
the list below describes all fourteen. The user approved the first six from a published
reference each and asked for every further idea to be built for rating, with the warning that a Skin has to
change shape, not just where colors fall; several will be dropped once lived with:

- **Plasma** — flat and bordered: no gradient or shadow anywhere, 2px rims in the layer's `contrast` color,
  pill radius on everything small and a doubled `full` radius on boxes; buttons and tags are "stickers", a flat
  `primary.light` fill rimmed in `primary.dark`.
- **Xenon** — dark panes at 85–95% over a faint grid, one-pixel strokes that glow (`box-shadow` at 6px and
  14px) and text that glows (`text-shadow`) on anything lit — a button, a selected item, a checked switch —
  with the error color glowing the same way.

- **Brutalist** — neobrutalism: square corners, hard unblurred offset shadows in black (the user's call, after
  contrast-colored shadows read as white cut-outs on a dark Theme), and a 3px stroke in the layer's `contrast`
  color **on the inputs only** — fields and the checkbox, radio and toggle boxes; surfaces, buttons, popups and
  tags are shadow and fill alone, also the user's call; uppercase bold buttons; selected means inverted.
- **Glass** — translucent fills over a page gradient with colored glows (so the frost has something to blur),
  `backdrop-filter`, a one-pixel light edge and an inset top highlight, pill buttons. **The `pageBackground`
  entry sits on the app root, not the page column**, so it runs under the left nav and the portalled layers too;
  a frosted nav over the flat body color had nothing to blur and looked solid.
- **Clay** — soft neumorphism: every surface in its own layer color, lifted by a lighter and a darker shadow
  made with relative color syntax (`hsl(from … calc(l ± 8))`), sunk inward when pressed, checked or selected.
- **Terminal** — monospace inside every entry, one-pixel rules, no radius and no shadow, `primary.main` used
  only for text, outlines and a segmented progress fill.
- **Blocky** — early desktop chrome, finished by the user: square everything, and a bevel of two inset shadows in
  see-through white and black (light top-left when raised, swapped when sunk), so it shades whatever color lies
  under it rather than being derived from that color. Fields and switch boxes are sunk; buttons, thumbs, panels and popups
  are raised; surfaces add a hard offset drop shadow; a selected item is a raised `primary.main` block; the
  progress fill is segmented; the range track is thickened through `skinVars`.
- **Pixel** — 4px borders with the corner pixel clipped off (`clip-path` notches), checkerboard dither for
  hover, tracks and the checked toggle, monospace; nothing casts a shadow, since a clip would cut it.
- **Blueprint** — outlines only: transparent surfaces, one-pixel lines in the layer's `contrast` color, dashed
  for panels, hatching for every fill, a two-scale grid behind the page; selected means inverted.
- **Paper** — hand-drawn: the classic uneven `border-radius` pair gives every box a wobble, 2px ink lines,
  ruled-paper lines behind the page, scribble fills, and the Theme's `alert` color as a highlighter for
  selection, hover and tags.
- **HUD** — cut corners (`clip-path` polygons) on panes and small cells, half-strength primary frames, tiny
  spaced uppercase labels, and glow only inward (`inset` shadows) on hover and selection, because an outer glow
  would be clipped.
- **Flat** — the elevation ladder (1, 2, 4, 8dp shadows), filled buttons without borders, text buttons in
  primary, filled inputs with only a bottom line, pill chips, and selection as a 12% primary tint.
- **Aqua** — a glossy cap (a white gradient fading at the midline) over every colored control, pinstriped
  surfaces, sunken wells for inputs and tracks, jelly pills for buttons, tags and the selected item.

**Fourteen more, prefixed `_`, are interpretations of the user's old Protos project** (protos.vercel.app; its
source survives only in the site's published source maps), built for grading at the user's request, all fourteen
of its themes including those whose names overlap a Skin above — the user's point being that the earlier builds
were bad, not the ideas. Each started as a copy of Shaded's file, the user's method, and keeps all of its
entries. Protos styled only a field, two buttons and a checkbox, from a random palette in JavaScript; the
translation onto the Theme is: Protos' two accents → `primary` and `secondary`; its "mix" color (black or white
against the background) → `layerVars.contrast`, and its inverse → that color inverted with relative color syntax;
its shadow color (the background 25 lighter or darker) → `background.dark` darkened, clamped at zero; its
lightness shifts, hue spins and mixes → `hsl(from …)` and `color-mix()`. Every Theme here is dark, so Protos'
dark-background branch is the one taken. Protos painted a checkbox like its primary button; here a checked or mixed
box takes the button's recipe and an unchecked one the field's. Everything Protos never styled (surfaces, tabs,
bars, the accordion, floaters) is extrapolated from the field and button recipes, and is the part most open to
the user's grading.

**The mechanism is the user's option B**: every Skin paints the same set of shared entry classes
(`skinEntries` in `Skins/Skin.css.ts` — `button`, `input`, `surface` and the rest), and a painter adds an entry by
composing it, `style([skinEntries.button, { …layout }])`. A Skin writes its rules once through
`SkinUtils.define(root, entries)`, which scopes each under the Skin's root class — `&` is the entry,
selectors may nest, a top-level comma inside `:is(…)` is not split — and puts them in the `skin` cascade layer.
A variables contract like Theme's was weighed and set aside: it caps every Skin at the properties the first one
planned for.

- **A Skin's rules stop at `skinBoundary`**, so a box can wear a different Skin from the page around it (the Skins
  page's rows). Each rule is emitted as `@scope (.<skin root>) to (.skinBoundary) { :scope <selector> }` inside the
  layer. The lower boundary is what isolates a row, not the nearer root winning: the cascade compares
  specificity before scope proximity, so without the boundary the page's Skin still reaches in with any rule the
  row's Skin does not write — a hover, a gradient. **A nested Skin takes two elements**, the boundary outside and
  the Skin's root class inside it, so no root is also its own limit. `:scope` stands where `.<root>` used to, so
  specificity is unchanged. What a nested box opens in a portal (a list, a tooltip) lands outside it and wears the
  page's Skin.

- **The layer is what lets a painter override a Skin.** Unlayered rules always beat layered ones, so any paint
  still in a painter wins over its entry, whatever the specificity or stylesheet order. Paint left in a painter
  is, by that, paint no entry covers yet.
- **States come from shared classes, not pseudo-classes.** `skinStates` (`isHovered`, `isActive`, `isSelected`,
  `isReadOnly`, `isDisabled`, `hasError`) carry the library's verdict, which `:hover`, `:active` and
  `[aria-selected]` do not: the flags force hover off while disabled, report a keyboard press as active, and
  mark a keyboard-highlighted item that the pointer never touched. A painter composes the shared class into its
  own — `export const isHovered = style([skinStates.isHovered])` — so its markup is unchanged in every
  framework, and its own selectors still name the composition's unique class and cannot match a neighbor's.
- **A Skin writes no selector of its own** — the user's rule. Every state a Skin can paint is a named key in
  `skinSelectors` (`Skins/Skin.css.ts`), joined with `SkinUtils.anyOf` where one rule covers two and
  `SkinUtils.allOf` where a rule needs two at once (it chains each as `:is(…)` on the entry, so it cannot take
  `line`'s pseudo-element or `fieldText`, whose `&` is not the painted element), so a new
  Skin imports the names and writes only the styles. A state a Skin needs that has no key gets one there,
  never a literal in the Skin.
- **A painter's internals are opaque to the Skin writer** — the user's rule. An entry is written in the terms of
  any box (`color`, `backgroundColor`, `borderColor`, …), never in how the painter happens to draw it: the slide
  button's arrow is an SVG line, so its painter sets `stroke: currentColor` and every Skin's `slideButtonThumb`
  sets the `color` the arrow inherits. A painter that draws with `stroke`, `fill` or a gradient's `stopColor` maps `currentColor` onto it.
- **A Skin's rule matches a state on the entry's own element** (`&.isHovered`), so a checkbox row's hover filter
  and its box's paint cannot stack. **The ancestor matches are the switches' row states** (`.hasError &`,
  `.isChecked &`, `.isMixed &`): checkbox, radio and toggle carry their state on the row around the box, and the
  box and its mark each have an entry — `checkboxBox`, `radioBox`, `toggleTrack` beside their marks — so a Skin
  can change either by state. The user's call; Shaded paints the boxes as `input` through one shared
  constant.
- **A field's typed text is painted through its wrapper** — the user's pick. The library's `<input>` sits beside
  the painted box, not inside it, and inherits color and font from the wrapper both share, so `input` paints
  that wrapper with `:has(> &)`: text color, caret color, font size, and a dimmer color while disabled. Painters
  hand the library no `computeTextStyle` for it.
- **Who the entries are for.** `drawer` is every page-edge or full panel — the left nav, drawers, modals and the
  sidebar sample, which paints exactly the left nav (an earlier call of the user's). `tooltip` takes the small
  floating popups — spotlight as well as the tooltip; the hover card is a `dropdown`, the user's move. `itemStatic` — the
  user's — is an item that is only shown, not picked: the rows, chips and tiles inside `EdgeFader` and `Scroller`, and
  `Sortable`'s items. `dropZone` — the user's — is a box things land in or sit on: `FileInput`'s zone, `Sortable`'s
  surface and the `Toolbar` and `Menubar` bars. `surface` is the example and variant boxes,
  toasts and the knobs popup; `pageContainer` — the user's — is the wrapping box of the docs' "Show code" disclosures
  and the API tables, and the frame of the Appearance page's rows; `panel` the boxes of content inside them, code boxes,
  prop rows, the dependency chips, the `Table` frame, the `Sidebar` example's frame and the `Preview` box — the last with its fill overridden to a solid `layerVars.main` and no image, the user's override, since its fade runs into that color. `decoration` — the user's — is the small see-through button inside or beside a
  field (select clear, picker triggers, era and AM/PM toggles, stepper arrows, adornments, the sidebar toggle),
  and it reacts to plain `isHovered`: every painter that hands it hover is a button's, and the static adornment
  never passes hover on (_"The in-field adornment painter"_). `tag` is a tag input's chip; the other chips and badges keep
  their own paint, the user's call. The tabs mirror the list item, the user's design: `tabsItemBase`,
  `tabsItemHoverFloater` and `tabsItemSelectionFloater`, plus `tabsTrack`, which paints the library's
  `renderGutter`, named track by the user to match the other entries' track-thumb-fill parts. Each Skin starts the
  two tab floaters and the tab's without-floater states on its own `ITEM_FLOATER_HOVER` / `ITEM_FLOATER_SELECTED`,
  as written by the user — where that constant is only a text color, the selection floater paints nothing, and the
  user chose that over keeping the tab's own selected color. The track and the floaters keep the boxes the library
  gives them, the whole list and the tab. A vertical list carries `isVertical` on all four. Every other Skin starts on Shaded's tab paint, the user's
  call while they are temporary. The honeycomb tabs are a custom variant and keep their own paint. The segmented radio is painted as tabs, the user's call: `tabsTrack`, `tabsItemBase` and `tabsItemSelectionFloater`. The binary switches' insides — `checkboxMark`, `radioDot`, `toggleThumb` —
  and the standard bars — `progressTrack`, `progressFill` and `progressTip`, `rangeTrack`, `rangeFill` and `rangeThumb`,
  `scrollerTrack` and `scrollerThumb` (painted on `::before`), and the slide button's `slideButtonTrack`,
  `slideButtonFill` and `slideButtonThumb` — have entries, the slide button's added at the user's request with its
  error marked on each part. The user folded its hint and arrow entries into the parts around them: the hint's
  text styling is set on `slideButtonTrack` and the arrow's color on `slideButtonThumb`, both inherited, so a
  Skin colors the hint and the arrow apart. `slideButtonTrack` paints its own element inside an unpainted box and
  holds the hint, with the fill and thumb beside it over the track's border, as Range's are: a border on the box
  itself had pushed the thumb inward, and a fill inside the bordered track missed the thumb's edge by that border's
  width. The fill is unclipped and paints over the border and the hint, the user's call, so the hint is covered as
  the thumb passes; the painter does not fade it, and a Skin that wants a fade reads `skinVars.endValue`. Shaded keeps the slide button's
  earlier paint, every other Skin paints its track, fill and thumb with its range's (`RANGE_TRACK`, `RANGE_FILL`,
  `RANGE_THUMB`), so the two stay in step until a Skin parts them — Flat does: its slide button is a pill and
  its thumb takes the strip's main color with the arrow in the family's `contrast`, because a thumb as tall as its
  strip showed the strip's corners behind it, a second shade beside it, and an arrow at 1.22:1 against WCAG 1.4.11's
  3:1 (the user's pick, B on both); `isChecked` and `isMixed` joined
  the shared states for the toggle's handle, matched on the row around it, as is a progress fill's error.
- **A bar's axis is a state; its text direction is not** — the user's call. `isVertical` is on each part of a
  standing progress bar or range (the progress painter's own `orientation`, since `Progress` has none). The state
  sets `skinVars.barAngle` (`Skins/Skin.css.ts`), and a gradient along a bar takes that angle, so a Skin writes
  each gradient once and needs no vertical rule — the user's call, to be rid of selectors combining two states. A Skin paints the same in a right-to-left box: a gradient
  along the bar keeps its direction there. **A pair's thumbs are one entry with two states**, `isStart` and
  `isEnd` — the user's pick over two entries, since a Skin writes the thumb once and only the difference; a
  single-value range's thumb carries neither.
- **Entries are as few as possible, but a component with an entry for one part gets one for each part** — the
  user's rule. So the accordion body has `accordionPanel` beside `accordionHeader` rather than borrowing
  `panel`. The surface of a section is `accordionWrapper`, the user's design, and the header and panel draw only on top
  of it.
- **A modal's backdrop has one entry, `overlay`, for the see-through kind**; the opaque kind is always solid
  black, the user's call, so its painter paints it and no Skin can change it. The painter otherwise keeps only
  what animates the backdrop open and shut.
- **Only a control's standard layout gets entries; a custom variant keeps its own paint** — the user's rule. The
  progress ring, range knob, scroller arc and color area are left alone, because whoever builds a
  custom tab layout or progress wants full control of the element — a painter of their own, not a
  set of classes to restyle. A radius computed from a painter's own size (a track's thickness) also stays in the
  painter.
- **Hover in a list is the floater's, everywhere a list can have one** — the user's rule. Hover and selection are
  two separate choices, since most lists glide a hover floater but paint their own selected state (the nav, `Tree`,
  `Select`, `Menu`), and only the `Listbox` examples have a selection floater too. So an item is three entries,
  the user's design: `itemBase` paints the item, and `itemHoverFloater` / `itemSelectionFloater` paint the two
  markers. A painter sets the states `hasHoverFloater` and `hasSelectionFloater` from its props, and `itemBase`
  paints the hover and selected backgrounds only without them (`skinSelectors.isHoveredWithoutFloater`,
  `isSelectedWithoutFloater`); hover covers pointer hover, the keyboard highlight and an open submenu, so a keyboard
  walk stays visible. The tab entries follow the same shape. **`Calendar`'s cells and `Clock`'s options are items too**,
  the user's call, with no floater. Today and now are underlined, in the text's own color, so no Skin has anything to
  override. While a range is being picked every day of the preview switches on the hover state, the user's pick over a
  separate in-range state, "simple for samples", so the day under the pointer does not stand out in the preview and it
  is to be revisited if it looks wrong. The held start wears hover and selected together, the user's call; a day cannot
  tell that start from a finished range's end, which is why `CalendarRenderProps` carries `isRangePending`. A finished range is selected on every day, in `aria-selected` as well as in
  paint (WCAG 1.3.1). `Calendar` squares the corners where range days meet, so its
  ends keep the Skin's radius outside. What the painters keep is the dimming outside the month and their font size,
  which disagrees with the other items'.
- **Where a painter disagreed with its entry, the entry won** — the user's call. Padding, radius and font join
  an entry only when every painter using it agrees, and are expected to converge later; until then they stay in
  the painters. **Radius is the one a Skin most needs**, since a Skin decides shape and an unlayered radius in a
  painter beats it: `input`, `checkboxBox`, `radioBox`, `toggleTrack` and `tooltip` carry it (their painters all
  agreed), so Brutalist and Terminal can square them. **A pressed toggle button is painted by the Skin through
  `isPressed`** — before, the painter ignored the flag and only `aria-pressed` told the state, a WCAG 1.3.1 gap;
  each Skin sinks, inverts or hatches it in its own idiom, distinct from hover and the press-down. The Button
  page's own `PressedButtonContent` wrapper, which drew a white inset ring over the painter, went with it.
  `accordionHeader` has its own entry, with `isExpanded` among
  the shared states so a Skin can mark an open header. **Where an open header meets its panel is a Skin state too**,
  the user's call: `isJoinedBlockStart`, `…BlockEnd`, `…InlineStart` and `…InlineEnd` name the edge of a part that
  touches its partner, the painter picks one from the side the panel opens on (`headerJoins` and `panelJoins` in
  `AccordionContent.css.ts`), and the Skin decides what a join looks like — `SkinUtils.joinedCorners(radius)` sets the two corners on the joined edge, `0` by default, which is what Shaded takes.
  A painter's own radius from its Skin cannot inherit the library's squared seam, and ARIA has nothing to read on
  the panel: `aria-expanded` is on the header's button only. **The hover and selection floaters take their radius
  from the Skin**, matched to that Skin's items, since a floater is the shape drawn behind an item. `surface`,
  `panel` and `dropdown` carry it too, since the user
  unified their painters to each entry's majority — `surface` and `dropdown` at `full`, `panel` at `half` — which
  rounded the toast, the modal-free popovers and the select list a little more, and squared the API table box,
  the dependency summary and gave the accordion panel corners it had not had. **A radius computed from a painter's
  own size** (a track's thickness, a pill badge) stays in the painter — except the standard bars': the user moved
  `rangeTrack`'s and `rangeFill`'s to the Skins, as `progressTrack`'s and `progressFill`'s already were, and each
  Skin gives a range part the radius it gives the matching progress part.
- **`Table`'s header and pinned cells keep their solid fill** — the user's call, after weighing a see-through header
  and a new entry. The header stays pinned while rows scroll beneath it and pinned cells do the same sideways, so
  they have to hide what passes behind them, and `panel` on the frame is see-through.
- **`FanMenu`'s items are `itemBase` with `itemHoverFloater`, each also wearing `dropdown`** so it looks like an item
  in a real menu, the user's call. A highlighted item drops its `dropdown` fill, or the floater behind it would be
  hidden. It keeps its small font.
- **A selected `SegmentedInput` cell also wears `itemBase`**, only while selected, so it takes the item's selection
  paint as a calendar range does. The user's call.
- **The `Sidebar` toggle's `border: none` lives in the `skin` layer**: it is a native `<button>` and no Skin sets a
  border on `decoration`, so removing it brings back the browser's own border, while left unlayered it would beat any
  Skin that does.
- **`dropZone` has two drag states, `isCarrying` and `isReceiving`** — the user's design, painted by each Skin on the
  entry and carried by `Sortable`'s surface. `isCarrying` is on every list while anything is carried and `isReceiving`
  only on the list the item is over, so a Skin writes `isReceiving` after `isCarrying`. The entry also takes every input's states through
  `INPUT_STATES`, the user's call: `FileInput`'s zone sends hover, disabled and error, its drag-over is `isReceiving`,
  and `Sortable`'s surface sends disabled, so none of those looks stays in a painter. A carried `Sortable` item writes no
  `border-style`: with no width from its entry the browser draws a 3px border, the card grows as it is picked up,
  and the landing marker ends up on a card.
- **The left nav's settings survive a refresh**, in `localStorage`, at the user's request, through `NavSettingsUtils`.
  Theme and Skin are written only when picked, so a reader who never picks one keeps the default (`DEFAULT_THEME`, `DEFAULT_SKIN`). Every
  value read back is checked against that setting's list of options, since browser storage can be edited; a value no
  longer on the list falls back to the default. ASVS 8.2.2 asks that browser storage hold no sensitive data, and these
  are display preferences only.
- **The page's font and backdrop are constants, not the Skin's** — the user's call. The `body` rule in
  `Theme.css.ts` holds the font family, size, line height and the backdrop behind the app, and sets no text
  color: every painted area sets its own.
- **A Skin reaches SVG paint through a hidden box**: a fill or stroke handed to `Shape` is data, not a class, so the
  tooltip surface (`PageTooltipSurface`, shared by the tooltip painter and the Tooltip page's arrow-bed demos, which
  keep their own outlines and corners) renders an invisible element wearing `skinEntries.tooltip` beside its `Shape` and converts that
  element's computed style with `SVGStyleDefsUtils` — the user's call that the tooltip wears `tooltip`. The Skin's
  radius, shadow and border go onto the body before the arrow is attached, and a fill layer whose edges all move by
  one amount keeps that amount on the arrow's edges. The style is read when the tooltip is drawn, not again when the
  Skin changes while it is open. The text color comes from the same box. **Every Playground tooltip draws the
  triangle arrow** — the user's call — so each passes the aim its `renderContent` is handed; a tooltip that passes
  `arrow` itself (the Tooltip page's knob) keeps its own.
- **The loading screen is plain black** (`vite/loadingScreen.ts`), the user's call, so it belongs to no Theme or
  Skin and the build config needs neither.

- **`e2e/`** — Playwright interaction suite. Imports from neither tree; drives the built Playground in
  a real browser. See _"Verifying interaction"_ in `conventions.md`.
