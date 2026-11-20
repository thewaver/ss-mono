# Decisions: playground-look

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The Playground's modals all darken the page the same way

`PageModalOverlay` blurs and desaturates what is behind it; `PageModalScrim` is a flat dark panel that only
fades. The source-code viewer, the drawer and the stress test used the first, and all three demos on the
Modal page used the second, so the control whose own page is supposed to show what a modal looks like was the
one showing something different from everywhere else.

**The three Modal demos take `PageModalOverlay` now**, at the user's word. Nothing else changed: the two
places that deliberately paint their own overlay — `Preview`'s text fade and the `Surface` card's bio fade —
are their examples' own effect rather than a modal backdrop, and the spotlights cut a hole in theirs.

**The library still has no default here and should not grow one.** `renderOverlay` is a slot and
`components/src` paints nothing, so "by default" is a Playground decision about which overlay a modal reaches
for, not a default the `Modal` component could hold.

**`PageModalScrim` is deleted**, at the user's word, along with its two styles: once the Modal page moved off
it nothing used it, and there is one overlay now rather than a choice of two. Its removal took two dead
things with it — the `themeVars` import that only the scrim's background needed, and the `background-color`
in the overlay's transition list, which had never had a background color to move.

### Playground: `progressTip`, the decoration riding the end of a progress bar's fill

**It is the painter's, not a slot on `Progress`** — the user's pick. The library has no track or fill and does not know
which way a bar runs or where in the painter's box the bar sits, so it could not place one; `Range` and `SlideButton`
leave their visible thumbs to the painter for the same reason. **The fill and the tip sit beside the track**, in a
shared unpainted box, as Range's and SlideButton's fills and thumbs do, so a track border cannot put them out of line;
the fill is unclipped, the user's call. Only an indeterminate bar keeps its fill inside the track, which clips the sweep.
A zero-size element takes the position and centers the tip on it, so a Skin's `transform` on `progressTip` cannot
displace it and right to left needs no rule of its own. Its transition has to stay the same as the fill's. No tip while
indeterminate: a sweeping fill has no end to follow. Every Skin's entry starts empty, the user's call; they paint it,
and size it through `progressTipWidth` and `progressTipHeight`.

**`skinVars.startValue` and `skinVars.endValue`**, the user's names, carry a bar's position from 0 to 1 for Skins to
read, written by the Progress, Range and SlideButton painters on their outermost element so every part inherits them.
Start is 0 except on a two-thumb Range, where the two are its thumbs. An indeterminate bar leaves them unset.

### The Playground theme is an example, and carries no rationale on purpose

Settled by the user, when asked whether `App/Theme.css.ts`'s token shape deserved an entry
here. It does not: **every value in it is as arbitrary as any consumer's own.** Four steps per color rather
than a numeric ramp, one animation duration rather than a set, `half` / `full` / `double` / `quad` spacing —
none of it is a recommendation and none of it constrains the library, which paints nothing and reads no
token. A consumer copying its shape is copying an example.

This does **not** license changing it casually. A token edit repaints every page at once; the values being
arbitrary is a statement about their origin, not an invitation to churn them.

**The Playground carries several value sets on that one contract, and the nav settings pick between them.**
`Theme.const.ts` holds Default, Solid, React, Svelte and Vue; `Theme.css.ts` builds each into a class and
lists them in `PLAYGROUND_THEMES`. Each app's entry file applies its own framework's theme at load, and the
_Theme_ select in the nav settings swaps the class on the root element from there. The user asked for it as a
temporary way to compare the sets side by side, then kept it. The pick is not remembered across reloads, and
it is not tied to the framework switch, which still picks the other app's own theme when it lands there.

**Which theme is showing is one shared value, because two controls change it.** `PageComponents/Theme` holds it with
`revealTheme`, which records the pick and reveals it; the nav settings' select and the `ShapeRevealPage`'s _Theme
Cycle_ example both go through it. When the select kept the pick in its own state, a theme changed by the example left
the select showing the old one. The value starts at the app's own framework, which is what the entry file applies.

**_Theme Cycle_: what the user chose, and one floor that comes from WCAG.** The button starts and stops the cycle, and
leaving the page stops it too. Each switch picks a random theme other than the one showing, so every switch is a
visible change. It grows from the button. The pause is counted from the end of the reveal, not its start, so a short
pause never cuts a reveal short. Duration and pause are both knobs. **The pause cannot go below `500`ms** because of
WCAG 2.3.1 _Three Flashes or Below Threshold_: under reduced motion, or at a duration of `0`, every switch repaints the
whole window at once, and a floor of half a second keeps that at two a second at most. It honors reduced motion the way
the select does, with a duration of `0`.

**No reset, though the page moves the theme.** _"A demo a visitor can move must be a demo they can put back"_ is about
state the page owns, and the theme is the app's, with the nav settings' select as its control.

**`secondary` is not set per theme; it is `primary` turned round the hue circle.** `toSecondary` in
`Theme.css.ts` rotates all four steps of `primary` — `contrast` included — by `90`, `180` and `270` degrees, and
keeps whichever rotation gives the highest contrast between its own `main` and its own `contrast`. A theme names
only its primary. The user removed `secondary` outright, then brought it back in this form once removing it left
pairs of things painted the same — the bracket's route against its connectors, a muted satellite badge against a
plain one, and so on.

- **Best of three, not a guarantee.** The user's call, and a deliberate exception to their usual preference for
  future-proofing: secondary is meant almost entirely as decoration, so the pick takes the best candidate without
  promising that any candidate reaches a given ratio.
- **The contrast step rotates too, even at `0%` or `100%` lightness**, where rotating it changes nothing on its own —
  a consumer deriving a mid-tone from it with `hsl(from … h s calc(l * 0.5))` gets the hue back.
- **That is why primaries are written as hue, saturation and lightness numbers rather than CSS strings.** Reading a
  string back through a color parser loses the hue of pure black or white, and a relative CSS color loses it in the
  browser for the same reason, so the rotation is done on the numbers and each step is written out with
  `Color.HSL.toCss` afterwards.
- **Secondary is kept off anything carrying text where the text matters most** — the radial tree's root and the
  data charts went back to primary and the rainbow respectively. Bracket, Satellite, Patch board and Particle
  spawner keep it.
- In the gray Default theme there is no hue to rotate, so there the two are the same color.

**`Theme.const.ts` holds data only, and must not import anything at runtime**, because every app's
`vite.config.ts` imports it to paint the loading screen. The secondary pick and the rainbow, which need `Color` at
runtime, therefore live in `Theme.css.ts`, which vanilla-extract compiles with the full Vite config, so it reaches
`utils/src`. `Theme.const.ts` imports `Color` as a type only.

**Turning a primary into CSS strings is `toCssFamily` in `Theme.utils.ts`, and it is written out by hand rather than
calling `Color.HSL.toCss`.** The landing page's `vite.config.ts` needs each framework's primary as CSS to color its
buttons, so the conversion has to load at config time too, under the same no-runtime-import rule. `Theme.css.ts`
uses the same function, so there is one formatter, not two.

**The multicolor samples draw from `RAINBOW`, a palette that ignores the theme.** Sunburst, Icicle, Cuboid, Mosaic
and the Timeline's blocks used to cycle through `primary`, `secondary`, `info`, `success`, `alert` and `error`. The
user replaced that with eight hues `45` degrees apart, `RAINBOW_HUES`, because six named colors ran out one short
on the Sunburst's six top-level folders, and a chart slice painted `error` reads as a fault.

- **`main` is chosen for text, and is AAA.** For each hue, `Color.getContrastingColor` is asked at `75%` saturation
  for the fill that reaches `7:1` under white text and the one that reaches it under black, and the one whose
  lightness moved less from `50%` wins, since that keeps the color most vivid. `contrast` is the matching white or
  black, carrying the hue.
- **`dark` and `light` are fixed steps of saturation and lightness, the way `primary`'s are**. The user chose fixed steps over deriving them from `main`, then dropped
  them by ten points under white text once the first fixed steps left reds and blues under white text below AA. The
  gradient ends make no AAA promise; only `main` does.
- **The white-or-black pick looks at `main` alone, so a hue near the tie can land on the side whose edges read worse.**
  At full `main` saturation with `50%` edges, hue `292.5` picked black by `0.19` points of lightness and left its
  `dark` end at `4.31:1`, while white would have given `4.87:1`; dropping `main` to `75%` saturation tipped it to
  white. The tie is nudged, not removed: a later change to these numbers can tip a hue back, and weighing the edges
  in the pick is the way to close it for good.
- **`45` degrees rather than `60`**, so a seventh category does not wrap back onto the first color.
- **The hues start at `22.5`, not `0`**, so none of them sits on a pure red or green. The user's call on looks; it
  costs nothing measurable in contrast, since the weakest gradient end only moves from `4.81` to `4.62`.
- **The Timeline takes a family like every other sample, and its blocks no longer carry the theme's state names.**
  Tracks and Trim pick by track number, Meetings takes the first family. The "now" and "playhead" markers keep
  theme colors, because they are markers rather than categories. `SHARED_THEME_VALUES` — `info`, `success`, `alert`,
  `error` — are the manually defined colors and are for states, never for telling categories apart.
- **Mosaic colors a tile by its `index`, not its `readingIndex`**, because reading order changes when the layout
  reflows and a tile's color should not.
- **A family is a hue number, and `0` is one of them**, so a test for "has a family" compares against `undefined`
  rather than testing truthiness, which would draw hue `0` as Icicle's root.

### The Playground's field look is one surface, and every field-shaped control wears it

Extracted, after the user pointed out that `TagInput` did not look like the other inputs — it
had 1px border instead of 2, a theme background instead of black, no shadow, its own padding.

`TextFieldContent.css` now exports **`fieldSurface`**: the border and its 25% currentColor, the radius, the
black fill, the small shadow, the transition, and the `isReadOnly` / `hasError` / `isHovered` / `isDisabled`
selectors. `textFieldContent` is `fieldSurface` plus the fixed 240×40 box and its `isStretched` escape;
`tagInputContent` is `fieldSurface` plus `position: absolute; inset: 0`, since there the tags size the box.
The flag classes are imported from the same file, so hover, error and disabled behave identically rather than
similarly.

The two shapes are why this is a shared **surface** and not a shared component: in `TextField` the painter
declares the size and the input is laid over it; in `TagInput` the content declares the size and the painter
is laid under it. Only the appearance is common. The metrics travel as the existing `FIELD_PADDING` /
`FIELD_GAP` / `FIELD_HEIGHT` constants, which `TagInput`'s page now passes — `FIELD_HEIGHT` through
`getMinHeight`, so an empty tag box is exactly as tall as a text field and grows from there.

**Width is deliberately not matched.** A text field's width is its painter's; a tag box is as
wide as its tags, which is the documented behavior of the control.

**`PageListboxSurface` wears it too**, at the user's request: a standalone `Listbox` is a field-shaped control,
so it takes the black fill and shadow rather than sitting transparent on the card. It never receives the flag
classes, so only the resting appearance applies.

### An example's own controls wear the small control look, not the Button look

The user's call: a button that operates the example — play, pause, replay, zoom, pan, turn, step, and the
one-shot actions beside them (Spin, Roll, Burst, Recall, Tidy up) — is painted by
**`PageControlButtonContent`**, the small translucent square `Carousel` drew for its own controls first.
`PageButtonContent`, the bold gradient, stays for a button that **is** the subject or belongs to the scene: the
Button page, form submits and resets, buttons inside a dialog, popover or tour step, toolbar items, modal and
drawer openers, toast raisers, and the page-level Reset among the knobs.

**A symbol where one is obvious, the word otherwise** — option B of three the user was shown. Words stay
in a pill of the same look rather than inventing a symbol nobody reads without
hovering. Steppers such as SlotText's "add 10" keep their words too: "+10" would have needed a name that does
not contain it, which WCAG 2.5.3 (Label in Name) refuses.

**The symbols are one table, `CONTROL_GLYPHS`, in the shared `playground`**, so every framework draws the
same character for the same act. A symbol is passed as `glyph`, which marks it `aria-hidden`, and the
`Button` carries the name as `ariaLabel` — reactive where the control toggles (`"Pause"` / `"Play"`). A word is
passed as children and is its own name.

**`Carousel` paints through it rather than beside it.** `PageCarouselStep` and `PageCarouselRotation` render
`PageControlButtonContent` with a glyph, and the pick dot is `controlButtonBase` plus its own size, taking the
flag classes from `ControlButtonContent.css` — so the carousel's controls cannot drift from every other
example's. `Flipbook`'s page turns are ‹ › for the same reason; its old captions table is gone.

### Text painted on a surface that moves is not selectable

The user's call: the words on a carousel slide, a cuboid face, a flip card, a dealt card, a flipbook page or a
wheel's wedge and drum card are part of the object, not reading matter, so the painter sets
`userSelect: "none"` and a swipe, drag or double-press never lights them up. The readouts under each example
stay selectable. Controls built on `InteractionWrapper` — `Sortable`, `SortableGrid`, `TileBoard`'s tiles — already
get this from `interactionRoot` and needed nothing.

### Color in the Playground: two rules, both the user's

Stated after a review of the pages built for the `Abstracts`. They are house rules for the Playground's own
paint, not library behavior, and they are recorded because every new page will otherwise re-invent an answer.

**A background always runs from a family's `dark` to its `light`.** `linear-gradient(135deg, X.dark, X.light)`
with both stops from the same family — not two families mixed, and not a `.main` used as a stop. What went in
before the rule: a card gradient from `primary.dark` to `secondary.main`, and a drag pad from `surface.dark` to
`info.dark`, both of which read as arbitrary because they are.

**The page's ground is `color.layers.level0`**, which replaced `color.background.*` at the user's request
once the Themes gained per-level families; `background` and `surface` were then removed from the Themes. What follows was written
about `background` and holds for the page's ground. **The page's ground is the page's, and nothing else may use
it.** Stated by the user after the first pass
painted every example's stage with a `background.dark` to `background.light` gradient: that family names the
page's own ground, so an example borrowing it is claiming to be the page. The shadow-casting demos are the one
exception, and only because a black shadow needs a light ground to read against; they carry a pale stage of
their own, which is still true now that they live on `ShadowCaster`'s page.

**What replaces it depends on what the example is showing, and there are three answers.** The correction came
after a second pass wrapped everything in `PageMeasureBox`, which was as wrong as painting everything.

- **`PageMeasureBox`** — the checkered, dash-bordered wrapper — is for an example whose **outer shell matters**:
  something is measured, something moves inside its bounds, or the point is where the component's box ends.
  Anything whose whole point is a reading taken against a box qualifies, and so does a swipe, which travels a
  fraction of its own width. **A hover state does not** — nothing moves, nothing is measured, and a box around
  it is decoration pretending to be information.
- **The layer's `main`** is for anything that should read as a control's own surface. The virtualizer's lists
  take it, because a scrolling list of rows is what a select's popup is, and the two looking alike is the
  useful signal. Which `color.layers.levelN` that is gets decided by where the control sits; see _"Layers"_.
- **A surface-family card** for everything else.

**Text on a background is that family's `contrast`, and a highlight color has to be checked against the
background it actually lands on.** A highlight is allowed — `primary.main` on a dark surface is fine — but it
travels with the element, and the failure the user caught is what happens when the background moves out from
under it: the virtualizer's row index is `primary.main`, and a pinned row painted itself `secondary.dark`,
leaving teal on warm brown with almost nothing between them. The fix is that the pinned row's own paint claims
the text inside it — a `globalStyle` on the index within a pinned row sets `color: inherit`, so the highlight
gives way to the row's `contrast` rather than surviving into a background it was never checked against.
**The general form: when a container can change its own background, it owns the color of the text inside
it.**

### The focus ring stays above a painter's hover and press filter

A wrapped control's ring is the `:focus-visible` outline of its focusable element, and its painted box is a child of that element. The painters darken that box on hover and press with `filter`, and a filter makes the box a layer of its own, which the browser paints after the element's outline. So with the ring showing, a press draws the box's drop shadow over the ring's bottom edge, and the ring looks thicker on top and thinner below, as if the button sank a pixel. It is a painting order, not a layout shift: nothing moves.

Three ways out were tried or weighed. **Moving the outline to the wrapper** does nothing, since an element's outline is painted before the layers inside it, whichever element carries it (measured: the ring's bottom rows still went dark). **Darkening with an overlay instead of a filter** was refused as a per-painter fix, and **drawing the ring as an element of our own** as too much work and a loss in Windows High Contrast. What worked is the reverse order: while the element has focus-visible it becomes a stacking context (`isolation: isolate`) and its painted box takes `z-index: -1`, and a negative layer paints before the element's own outline, so the ring is on top whatever the box does. Measured in headless Chromium at 125% display scale with Space held: the ring's bottom edge is identical to its resting state.

It is two rules in `Theme.css.ts`, shared by the four Playgrounds, keyed on `:focus-visible` so nothing changes while the ring is not drawn. **The wrapper is recognized by `role='presentation'`**, its default, because the library's own class cannot be imported into a stylesheet (the package has no stylesheet subpath, and importing its index would evaluate the whole library at build time). A wrapper whose `role` was overridden is not matched. **The box is reached as the focused element's only child**, so a leaf holding many children is left alone: the rule forces `position: relative` on what it matches, which would override a stylesheet-set `position: absolute`. It does not help where the focused element sits inside the painter (text fields), since a filter on an ancestor dims the ring itself, which is a different flaw. Which controls it covers has not been surveyed; the user is checking them by hand.

### The in-field adornment painter: a label outside a button, a button's look inside one

Two painters. **`PageTextFieldAdornment`** draws static content in a field's leading or trailing slot (an icon, £,
px): a label at the field's own text size (`FIELD_FONT_SIZE`), with no padding and no hover, still dimming when
disabled. **`PageTextFieldButtonContent`** draws a small button there (Clear, Show) inside a `Button`'s
`renderContent`: padded, small, uppercase, lit on hover. The looks are the user's calls, one at a time, starting from
the TextInput Docs page's username field, whose glyph lit up on hover, sat padded away from the text and looked small
beside the placeholder. The sizing is provisional by the user's word: it is to be revisited once the other input
pages are built.

**The static painter reads no hover because the field hands it the field's state**, and "the field is hovered" is
not "this icon is hovered". It used to be one painter that told the two apart by whether it sat inside a button, with
a skin selector (`isHoveredPressable`) doing the same for hover. The user asked for the fix as low as it could go,
and the library was ruled out: a field's slots receiving the field's hover is true and documented, and a consumer
may want an icon to brighten with the field, so dropping it would take that from every consumer to fix one painter.
The painter is where "field hovered" was misread, so the split is there.

**An icon in a slot is drawn by `PageIcon`** (text such as £ or px stays text), the user's call after the 👤︎ glyph
painted as a color emoji on one machine and as text on another, and `@` hung below the line beside the word it
labeled. `PageIcon` takes an SVG's
URL (`person.svg`, in `playground/src/App`) and uses it as the mask of a one-text-height box filled with
`currentColor`, so the icon takes whatever color the painter around it has — dimmed, red — and is centered by the
slot like any other content. A mask rather than `<img>`, because an image cannot read the page's `currentColor`.

**`TextArea` follows the same template**: Basic is the fixed-height box with the three state knobs, then growing with
what is typed — one example, at the user's request, with a Max rows knob starting at 8, the limit the old capped
example used (knob range in `TextAreaKnobs`) — the tooltip and naming by a Label. Its intro points at TextInput's page rather
than repeating what the two share.

**`NumberInput` and `CurrencyInput` follow it too**, each example's knobs being real props, after the user's TextArea
correction that a limit deserves a knob. NumberInput: Basic with the three state knobs; stepping and limits, with
Min, Max and Step knobs (one example, where the old page had a whole-number and a fractional one); numbers written
the local way, with a Locale knob starting on German; a unit beside the stepper; the tooltip; naming by a Label. A
typed number outside the limits is corrected when the field is left — the code settles on blur only, not on Enter,
and the section says so. CurrencyInput's shared panel of locale, decimals, grouping and sign was split by what each
prop does: Basic with the state knobs; written the local way, with Locale, Decimals and Grouping on the large
amount, so the grouping shows; with a symbol; a limit, with a Max knob; negative amounts, with Signed starting on.
The old "empty" and "many groups" examples each showed one fact, now said in the intro and the locale section.
