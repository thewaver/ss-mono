# Decisions: playground-examples

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A sample knob is labeled after the prop it sets, not after what the effect does

The Playground is read by people who will write against these props, so a label has to tell them which prop
their hand is on. The labels were descriptions instead — _"How much of a mark's life the color walks"_ for
`ageColorSpan`, _"Rings at once"_ for `rippleCount`, _"Travel between rings"_ for `rippleSpacingRatio` — and
a reader who liked what a knob did could not tell what to type to get it.

**`CellAnimation`'s page set the form, at the user's word.** A label is the prop's own name as a short
readable phrase: `uniqueWeights` is _"Unique weights"_, `originType` is _"Origin"_, `animationDurationMs` is
_"Animation duration (ms)"_. Units and ranges stay in brackets, and a name can shed the part its group
already says. All four sample registries follow it now — both gradient families, the placement layouts and
the scanline effects — sixty-two props, each with one label and no label serving two props.

**It is a matter of taste and not of derivation, which the user said in as many words.** A few do not fold
into a tidy phrase, and those took a readable label rather than a mechanical transliteration: `cycleMs` is
_"Cycle (ms)"_ rather than _"Cycle ms"_, `perRow` stayed _"Cells per row"_ because the bare name says
nothing, and the two exponents keep their bracketed note because the number is otherwise unreadable.

**The pass turned up one knob serving two props.** `hand_1`'s `peakAlpha` was pointed at the core-alpha knob
object, which was invisible while both labels read _"Core opacity"_ and became a lie the moment the label
named a prop. It has its own knob now, with the same range.

**What is deliberately not covered**: labels a page writes for its own props rather than for a sample's, like
the gradient pages' _"Gradient"_ picker or the blur width. Those are the page's controls, not the library's
surface, and no consumer types them.

### The Placement page is prose, and its examples live on the controls that take a layout

The page carried a band knob panel driving two demos, a menu and a wheel, to show one layout reaching two
controls that share nothing else. The user asked for it back to explanation only. A menu entry with no
`component` is already the shape for that, so the entry keeps its description and the page, its two examples
and its own types and styles are gone.

**The description lost its last sentence and gained one.** It pointed at "both wheels on this page", which
would have been a reference to nothing. Ten controls take a layout and every one of them demonstrates it on
its own page, which is what the new sentence says.

**`placement.spec.ts` went with the page**, since both of its tests reached through those two demos. One of
them was not really about the page at all: whether a wedge with no hole closes on the center rather than
drawing a near edge is arithmetic in `getSectorPath`, so it is a unit test now, alongside a band's two arcs
and the large-arc flag that only appears past a half turn. The other test — one knob reaching a menu and a
wheel at once — had the page as its only possible harness and is not covered any more. Rebuilding it would
mean rebuilding the demos it was written against.

### Every props panel resets itself, and no page was edited to get one

The user asked for the reset `Formation` had on every page. Hand-adding a row to each of the fifty-six pages
that carry a panel would have been fifty-six chances to wire one wrong, and every new page would have to
remember.

**A field registers its own starting value with the panel it is in.** `Field.context.ts` holds a registry a
field looks up; on mount each field snapshots the value it was handed and registers a callback that writes
that value back through the setter it already has. `PagePropsPanel` provides the registry, collects the
callbacks, and renders one `Reset` row once anything has registered. A page that has no panel gets nothing,
which is correct — there is nothing to reset.

**The registry lives with the fields**, in `PageComponents/Field`, so the fields and the panel that provides
it sit in the same tree and neither imports across the paint boundary to reach it.

**A sample panel leaves its selector alone, and hides the reset when the selector is all there is.** The
user's, in two passes: resetting the picked sample defeats the point, and a `Reset` beside a lone picker
resets nothing. Both fall out of one fact the panel can rely on — in a sample group the control that chooses
the sample comes first, which is the ordering the user set when they asked for these groups. So the panel
skips the first registration when its scope is `sample`, and shows the row only once something has registered
past it. A `global` panel has no selector and resets all of itself, its own selects included.

`Formation`'s bespoke reset row is gone, along with the store `reconcile` it needed; the generic one does what
it did.

Fields with no value take no part: `PageFileField` has only an `onPick`, so it registers nothing.

### The starting value of a page prop is a named constant

Pages already stated every knob's minimum, maximum and step as constants at the top and then opened with an
inline literal in the `createSignal` call, so half of each knob's definition was in one place and half
somewhere else. The user's, raised as laborious work needing no input.

The starting values are `STARTING_…` constants now, beside their own `MIN_…` and `MAX_…`. What was left
inline is the state that is not a prop — click counters, index signals, progress readouts — where a
`createSignal(0)` says all there is to say and a constant would only add a name to nothing.

### A Playground demo a visitor can move must be a demo they can put back

Stated by the user, after `TagInput` and `Stepper` shipped with no way to restore them.
**If pressing something inside a variant changes state the page owns, the page ships a way back to where it
started.**

The reset lives in the **props panel**, not beside the variant, for the reason every other knob does: one
control governs every instance, so the page returns as a whole. The starting values move to module constants
and the reset writes them back.

**A knob that happens to express the state does not stand in for the button.** Confirmed by the user on
against the opposite guess: `Breadcrumbs` was left without one because its `Depth` field can
put the trail back, and they asked for the button anyway. A knob is somewhere to _set_ a value, and knowing
that setting it to 4 happens to be the starting point is knowledge the page has and the visitor does not. A
reset also resets everything the page moved: pressing a crumb moved the trail _and_ the readout under it.

The exception is a variant whose whole point is a one-way gesture with an owner-held latch, which is why
`SlideButton` keeps its `Reset` inside the card.

### Turning a page's variants into examples, settled on the four `Exotics` pages

`Formation`, `Satellite`, `Staircase` and `Wheel` were the first pages whose demos moved from `PageVariants` to
`PageExamples`, which was the first slice of the Playground rollout `backlog.md` used to carry as its own item.
The question that item left open — where a variant's file lives and what it is given — is answered here, and the answer is the shape
`ShapePage`, `TypewriterPage` and `ScanlineAnimationPage` already had rather than a new one.

**The split is the library call on one side and the Playground's furniture on the other.** The example file
holds the library component and the styled components it paints with, and nothing else. `PageMeasureBox`, any
local props panel and the width the demo is stated at stay on the page, in an `<Name>ExampleWrapper` beside
`getExamples`. That line is the same one the tab rule draws: what a consumer would write becomes a tab, what
the Playground needs for its own sake does not.

**What closed over the page's signals becomes one props type per page**, `<Name>ExampleProps` in
`<Name>Page.types.ts`, built with `AccessorProps` and handed to every example on the page as `commonProps`.
One type per page rather than one per example is what lets a single props panel drive all of them, which is
the rule the panel already worked to.

**A knob whose value has a unit names it in the label, in parentheses.** `Width (px)`, `Turn duration (ms)`,
`Shift (%)`, `Skew (deg)`. Asked for by the user after a page shipped with bare `Width` and `Turn`, and it is
the whole rule: a count has no unit and takes none, so `Slide count`, `Wedges` and `Items` stay as they are.
The field's own `ariaLabel` spells the unit in words instead — "width in pixels" — because the panel's label is
a plain `div` rather than a `<label>`, so the accessible name is whatever the field carries and a screen reader
never hears the visible text. The one place left without a unit on purpose is `Toasts`' duration: its values
are a select whose options print their own `ms`, and one of them is `sticky`, which is not a duration at all.

**A family shares a folder, its constants and its panel, and splits everything else.** `ElementMosaic` and
`ImageMosaic` shared one page for a while and now have one each under `Pages/Mosaics/`, which is the shape the
user settled on for every family: the folder holds the constants, the types and a `create…Controls` factory
paired with a panel component, and each page calls the factory and renders the panel, so ten knobs are not
written out twice. Three knobs mean the same thing to both mosaics — how many items, the gap, and which side is
fixed — and live in that shared panel. **What only one of them has stays in that page's own local panel** — a
target shape means nothing to an element mosaic, so it sits under the image demo rather than in the shared row.
It generalizes: share what can be shared, make the rest local.

**The image mosaic's second demo became a knob on the first**, which is the rule above rather than a new one.
The decorated version differed from the plain one only in whether each image is wrapped in an element of the
consumer's own, so it is a checkbox in that example's local panel now. `imageMosaic.spec.ts` turns it on before
the one test that needs it, and addresses its demo by the example key `images` rather than by the page.

**Two demos differing by one prop are one example and a panel knob, never two files.** Corrected by the user,
four times now, and the fourth went further than the first three, in two steps. A carousel demo turned on its
side was built as its own example on the argument that a column also needs a box with a height around it, so
the two differed by more than the prop; that does not survive, because the box is the page's furniture. The
correction to _that_ was the second step and is the part worth keeping: **a knob that means the same thing to
every demo on the page belongs in the global panel, not in a local one per example.** Direction is one global
select now, and it drives the tracks' `dir` and the drum's `axis` together — a local knob per demo would have
been the same choice asked four times.

**Furniture that only one direction needs is still sized for both, so a card does not resize when a knob
changes.** The user's objection, and it is about the page rather than the component: the box round each
carousel demo was `height: 320` for a column and nothing for a row, so switching direction made every card
jump. It is one fixed height for both now, with the demo centered in it — a row carousel leaves slack under
itself and a column one fills it, and the card stays put either way. The first three corrections: `Formation`'s pair differed only in `getIsStackedInReverse`,
`Satellite`'s first two only in `getIsBehindSubject`, and `Staircase`'s only in `getDir`, and each was first
built as two example files with the value written into each. Every one of them is now a single example with
that prop wired to a control in the global panel — a `PageCheckField` for a boolean, a `PageSelectField` for
an enum. This is the same rule as _"a props-panel control drives every instance"_ read from the other end: a
value the panel could own is not a reason for a second demo, and two demos over one differing literal are two
copies of one example rather than two examples. **A second example has to be a different call**, as
`Wheel`'s three are — `OverheadWheel` against `DrumWheel`, and a drum handed the prize list twice over to prove it
can carry the same prizes round more than once.

**Dropping a demo drops its spec, and that is the trade to state rather than work around.** `Satellite`'s
third demo — the component with no satellite at all — was excluded on the user's instruction, so
`with nothing to attach there is no wrapper either` went with it. The behavior is still covered by unit
tests; what is gone is the browser's confirmation of it.

**Where a sample registry is not split, the key is still the example's to resolve.** `Formation/Layouts` and
`Staircase/Indents` are 80 and 46 lines and stay whole. The example is handed `getLayoutKey` / `getIndentKey`
and does the lookup in its own body, because that is the line the reader came for. `sampleKeys` and the tab it
produced are both gone; see _"Samples live in the library"_.

**The turn count is a panel knob, and a spin style is handed it rather than owning one.** Asked for by the
user: the page exposed how long a spin lasts but not how far it goes in that time, so the only thing the
duration knob could change was the pace. `WheelSpinStyleFn` takes a third argument for it, after the two the
library's own `computeSpinDefs` passes, and the page closes over the signal at the call site rather than each
style reading it — which keeps the styles pure page constants that can be read whole in the source view.

**The two styles read the knob differently and both are right.** `rigid` uses it exactly. `bouncy` picks a
whole number between one and it, because randomness is what that style is for and a knob that fixed the count
would leave it randomizing nothing but the jitter. So the knob is a ceiling for one and a setting for the
other, which is why it is labeled _"Turns per spin"_ rather than named after either reading. At the starting
value of 3 both reproduce the constants they replaced — `PLAIN_TURNS` was 3 and the lively range was 1 to 3 —
so nothing about the page's default behavior moved.

**`WheelExampleProps.computeSpinDefs` is the library's two-argument shape, not `WheelSpinStyleFn`.** An
example spreads its props straight onto a wheel, so what it receives has to be what the wheel accepts; the
three-argument form is the page's catalog signature and stops at the page. The two were the same type until
the knob arrived and the difference was invisible, which is worth knowing before merging them back.

**`Wheel` passes `computeSpinDefs` resolved rather than as a key**, which is the one place this departs from
_"An example is given the key rather than the resolved sample"_. Its two spin styles are page constants and not
a `Samples/` registry, so there is nothing for a key to resolve to; making them one is a separate change and
has not been argued.

**An example carries no readout, for now.** Stated by the user when these four converted. `ExampleDefs.readout`
stays on the type and `PageExamples` still renders one when given it — nothing was removed — but no example on
these pages sets it. Two specs read a readout and had to find the same fact elsewhere: `wheel.spec.ts` now
reads the wedge's name out of the `LiveAnnouncer` region, which is the library's own report rather than the
page's, and `satellite.spec.ts` used the readout only as a way to walk back to the demo and now locates the
wrapper directly.

**The attribute the interaction suite reads changes with the component.** `PageVariants` stamps `data-variant`
and `PageExamples` stamps `data-example`, so a converted page's spec swaps `variant()` for `example()` in
`e2e/helpers.ts`. One assertion had to move with it rather than being renamed: `wheel.spec.ts` counted the
buttons inside the whole card to prove the wheel renders exactly one, and an example card carries the source
button too, so the count is now scoped to the element carrying `aria-roledescription="wheel"`. That is the
honest reading of what the test was always claiming.

### Every Playground page is examples now, and two things had to change to finish it

The rollout `backlog.md` used to carry as its own item is done: all thirty-three pages that still used `PageVariants`
carry the source-code button, and `PageVariants` itself has no consumers left. What the four `Exotics` pages
settled held for the rest; two things they never exercised did not.

**An `Exotics` page lays its examples out with `layout={"flow"}`, so each takes the width it needs.** The user's
rule, given when `RGBAnimationPage`'s SVG headline overflowed its grid cell: an exotic demo has its own size, and a
grid column of a fixed share squeezes it rather than the other way round.

**An example card now marks its demo, because the source button is a button in the card.** `PageExamples`
wraps the demo in a `data-demo` element and `e2e/helpers.ts` gains `demo(key)` beside `example(key)`. Without
a marker a spec asking for "the first button in this card" found the `</>` button and opened the source viewer
instead of the control it meant — which is how a color-dropdown test came to assert against a code listing.

**That marker is `display: contents`, and the first attempt at it broke six pages.** It was given
`PageVariants`' demo box — a centered flex row — which changed how every card lays its own contents out: the
pages that were already on `PageExamples` had always put a demo's children straight into the card's column, so
`CellAnimation` and `ScanlineAnimation` suddenly showed their local props panels **beside** their demos rather
than below. A marker exists to be found by a selector, not to lay anything out, so it generates no box at all.
Nothing inside a card can then move because of it, which is a guarantee rather than something to re-check per
page. The cost is that the element has no box to measure: `stepper.spec.ts` asked its parent how wide it was
and got zero, and now asks the card's content box instead.

**`readout` sits outside that box, and a spec that builds its selector from `demo(key)` finds nothing.** The
card holds the title, the demo and the readout as siblings, so a readout lookup is scoped to `example(key)`
and a control lookup to `demo(key)`. Both spellings are correct and they are not interchangeable.

**A readout is laid out at zero width with a minimum of the full box, so it never decides how wide its
example is.** Asked for by the user, and it is a testing requirement as much as a visual one. A readout is a
line of text about the control, and text is exactly as wide as whatever it happens to say — so a card sized
to fit it is a card that changes width every time the words change. On the wheel page that is several times
a second, because all three wheels report the wedge passing their marker while they idle, and the vertical
drum's card was measured at 376px when the drum inside it is 160px wide. A demo whose box moves under a spec
is a demo whose coordinates cannot be relied on, which is the half that matters beyond the look of it.

`width: 0` is what the browser uses when it works out how wide the card should be, so the readout counts for
nothing there; `min-width: 100%` is what it uses once the card has a width, so the text still renders across
the whole of it. Percentage minimums resolve to nothing during intrinsic sizing and to the real value
afterwards, which is exactly the split needed, and it is why the pair is not a contradiction. Note that this
also stops the readout stretching the demo beside it — `exampleContainer` stretches its children, so a wide
readout used to widen the demo box too, and the drum was being handed 336px of room it did not want.

`e2e/playgroundExamples.spec.ts` guards it without writing down a width for any control: it measures each
card, hides its readout, measures again, and the two have to match. Every card on every page with a readout
answers the same question, so a page added later is covered by adding its route to the list.

**A spec belongs to the route it visits, not to the file it is named after.** `tooltip.spec.ts` exercises
tooltips on the **button** page and `modal.spec.ts` covers both the modal and the drawer — so converting a
page turns specs red that carry another component's name, and converting one half of a two-page spec means
renaming only that half. The check before touching a page is `grep` for the route, never the filename.

**Demos kept their readouts, against what the four `Exotics` pages chose.** Those four set none, and
`ExampleDefs.readout` stays optional — but dropping the readouts here would have taken the fact each spec
reads with them, so every converted page still sets one. Whether they go is a separate pass.

**Every demo was carried across one-to-one, and the deduplication is deliberately not done.** Where two demos
differ by a single prop they now share one example file with two entries — `Accordion`'s two expand modes,
`Select`'s eleven country lists — which is the rule those four pages settled. What has **not** happened is
collapsing two demos into one plus a panel knob, because that removes demos and the specs covering them; the
user holds that as a separate pass.

**One demo needed pinning down rather than converting.** `SplitPane`'s bounded demo stretched until a pane's
floor stopped being reachable — with a wide enough frame the neighbor never reaches it, so the spec
proving the floor is honored had nothing to bump into. `PageSplitPaneFrame` now caps at the width it used
to get. The alternative was to weaken the assertion.

### `PageExamples` lays out on a grid, with the column width per page and a span per example

Asked for by the user after the rollout: the cards went back to `PageVariants`' grid rather than the
wrapping flex row, since a row leaves cards of different heights sitting unevenly and gives a page no way to
say how wide its demos want to be.

**The root has to state `width: 100%`, which the flex row it replaced did not need.** Several page roots are
flex columns with `align-items: start`, which sizes a child to its content — so an auto-filling grid resolved
to a single column and stacked cards that had room to sit side by side. `CellAnimation` showed two rows in a
1280px area with two 630px columns available. A wrapping flex row hid this by sizing itself to max-content.

**The column floor is the page's, because it follows from the demo rather than from the layout.**
`getMinColumnWidth` defaults to the width `PageVariants` used, and a page that states a width for its demo
states a floor of that width plus the card's own padding — `SplitPane`, `Scroller`, `TextArea`. Where a page's demos have no declared width the default stands. It is a prop rather than
something derived because the demo's own width is often inside a styled component the page never names.

**An example may take more than one column, and the grid's floor is divided by the widest span on the page.**
`ExampleDefs.span` is a column count; `Tabs`' two demos that carry a panel and `Select`'s virtualized demo
with its own props panel take two. The floor becomes `min(100% / widest span, floor)` — so a page with a
two-column example never resolves to a single column, and the spanning card therefore never needs a track the
grid has not got.

**Two pages had been getting their sizes from the old row, and both showed it.** A wrapping row sizes a card
to its content, which had been hiding two things. `Shape`'s demo is a fixed, resizable box with a `Shape`
around it tracing its contour — and `Shape`'s own root has no width, so under a card that stretches its
children it grew to the column while the box it traces stayed 320: the contour and the content came apart. The
box is what the demo is about, so the page now wraps it in a `width: fit-content` host and the `Shape` hugs it
again. `ViewportPage` builds its own cards rather than using `PageExamples`, and had capped them at the host's
width; it now uses the same grid, with a floor of the host plus the card's padding, and its fixed-size hosts
center inside a column that can be wider.

**Which is the general lesson: a card stretches its children, so a demo that must match a fixed-size child has
to say so.** The old row let a demo of unstated width agree with a fixed-size sibling by accident, because
both ended up as wide as the card. Nothing about the grid makes that true.

**That division is what keeps a span from overflowing, and it was measured rather than assumed.** With the
plain `min(100%, floor)` a two-column card in a one-column grid lands one gap wider than the row: the grid
allocates a zero-width implicit track and the gap before it is still spent. Halving the floor removes the case
entirely — checked at container widths from 280px up, the row now overflows by nothing at any of them, and the
column count at ordinary widths is unchanged.

### Examples with a non-standard layout come last on their page

The user's rule. An example whose control is drawn in an arrangement other than its ordinary one — a `Tree` drawn
outward or leaning, `Tabs` as a honeycomb, a `Sortable` ring, a `RadioGroup` bent into an arc — sits after every
example of the control in its ordinary shape. A reader learns what the control is from the plain examples first,
and the laid-out ones then read as variations on something already understood. In practice that means any example
handing the control a `computeLayout`; a page whose control is always laid out (`Bracket`, `Formation`) has no
ordinary shape and is outside the rule. The order is the same in all four Playgrounds, like everything else on a
page.

### `PageExamples` takes one layout switch, because the two questions turned out to be one

Settled with the user after the grid had been running for a while. The grid fixed what it was brought in for —
cards of a size, and a long readout no longer stretching one card wider than its neighbors — and broke two
things on the pages whose demos come at a fixed size. `Shape`'s card and its stress-test card were handed the
same track, which is right for two text fields and absurd for a 320px box beside three buttons; and neither
card was flush with what it held, so the page could no longer be read as "this is the room the component asks
for".

**Two dimensions were in play and they collapse into one.** How the demo sits inside its card, and how the
cards sit on the page. Once a card hugs its content there is nothing left to align inside it — the card _is_
the content — so hugging implies a wrapping row, and a wrapping row is only worth having if the cards hug.
`getLayout` is therefore a single prop with `grid` (the default) and `flow`, and no page states both.

**The rule for which is whether the demo owns its width.** A demo the page hands a size to is being shown for
its footprint, so the card has to be flush with it: `Shape`'s `fit-content` host, `Wheel`'s overhead wheel,
every measure box that is given a width. A control that takes whatever width it is given — a field, a tree, a
tab strip — has no size of its own, any width is as arbitrary as any other, and an even column beats a ragged
one. Argued from ownership rather than from how the pages happen to look: a demo with no width cannot be
flush with anything, because there is nothing to be flush with.

**`grid` centers its demo rather than stretching it, and a demo that must fill says so itself.** The card was
a column that stretched its children, which was invisible while cards hugged their content and became a demo
pinned to the left edge once they did not. The demo slot is now a centered row. The alternative — keep
stretching and have the fixed-size demos center themselves — was rejected by the user: it leaves the rule in
each demo's CSS, where a new example forgets it silently. Nothing had to be swept in for the change, because
a demo that has to fill already declares its own width and a declared width still fills a flex line:
`Progress`'s bar, `ColorArea`'s surface and `Tabs`' panels came through untouched. What moved is what should
have — `Tree`, `Breadcrumbs`, `DatePicker` and the link-shaped `Tabs` demos now sit at their natural width in
the middle of the card instead of being pulled to its edges.

**`ScanlineAnimation` uses measure boxes and stays on the grid, which is what sharpens the rule.** Its demo is
an image beside a local props panel, and that pair re-flows: inside a column it stacks, and freed of one it
lays out in a single 657px row, at which point two cards no longer fit a 1320px area and the page becomes one
card per row. So the test is the demo having a fixed size, not the page using a `PageMeasureBox` — a demo that
merely adapts to its container has no footprint to be flush with. `Shape`, `Wheel`, `CellAnimation`,
`ElementMosaic`, `Formation`, `ImageMosaic`, `ImageSwitcher`, `Satellite`, `Staircase` and `Typewriter` flow;
everything else stays on the grid. A flowing page drops `getMinColumnWidth`, since a hugging row has no
columns to put a floor under.

**The known cost of `flow` is that the readout and the title contribute their own width to a hugging card**,
which is precisely the unevenness the grid was brought in to remove. It does not bite in practice: a readout
and a measure box are near-disjoint across the pages — `ImageSwitcher` is the only page with both, and its
readout is narrower than its image. Worth stating because the first flowing page to grow a long readout will
show it, and the fix is to stop the readout contributing rather than to reach back for the grid.

### An example's own knobs open from a button on its card, not from a panel inside it

The user's call, after `Satellite` moved its knobs into its first card's local panel and the card grew to hold
seven rows around a demo a fifth of its size, while `Shape` kept twenty knobs page-wide above two examples that
read none of them. An example with knobs of its own wraps them in `<PageExampleKnobs>` anywhere inside its demo,
and its card draws a ⚙ button after `</>` that opens them in a non-modal `Popover` dialog anchored to the button,
opening out past the card's right edge so the demo stays in view while it is tuned.

**It is a slot, not a field on the example record, and that is what made the sweep cheap.** The first build took
the knobs as `ExampleDefs.renderKnobs`, which works for knobs whose state lives on the page and not for the
common shape, a wrapper component holding its own signals and drawing its demo and its panel side by side —
lifting those would have meant moving every wrapper's state up into its page. `PageExampleKnobs` registers its
children with the card through a context the card provides around the demo, and renders nothing where it stands,
so each local panel became the slot by a change of tag with the state left where it was. Outside a card it falls
back to drawing a local panel in place. Every `scope={"local"}` panel on an example became one, twenty-nine in
all; the one left is `StressTest`'s, whose buttons are the demo rather than settings for one.

**The page-wide panel keeps only what more than one card reads.** `Shape` is the case that decided it: colors
paint every card and the page's own background, and the shape, the corner radii, the Lamé exponent and the
individual-corners switch are also read by Text Wrap, so those five stay page-wide; the stroke and fill patterns
with their knobs, the cell size, clip, pad, edge thickness, blur, duration and iteration are Default's alone and
live in its ⚙. The stress test renders whatever Default is set to. `revealProp` in `e2e/helpers.ts` opens the
popup that holds a props row, so a spec driving a card's knob asks for it first.

**`PopupTrigger` now shows a pointer**, and `not-allowed` while disabled, as `Button` already did; the ⚙ was the
first place it showed, and every picker's trigger shares it. The ⚙ carries a "Settings" tooltip beside `</>`'s
"View source code".

**Three layouts were tried or argued first.** A panel above each group of examples, built and looked at, was
correct and not elegant — the page read as a stack of forms. Knobs beside the demo inside one wide card is the
user's second choice, and remains the fallback. A `HoverCard` was proposed as the popup and rejected: it opens when
the pointer brushes past and closes when it wanders off, which is right for a preview and wrong for a panel somebody
works in, and a dropdown inside it would open its list outside the card and count as leaving it.

**The popover is pressed open, and the button is its anchor.** A press elsewhere, `Escape` or a second press of ⚙
closes it; `Escape` puts focus back on the button. Because the anchor is inside the layer's dismiss roots, pressing
⚙ again toggles rather than closing and re-opening, and a dropdown opened from a knob resolves as inside through
`aria-controls`, so the panel stays open while one is picked. The button is `PopupTrigger`, so `aria-expanded` and
`aria-controls` come with it; its id is `<exampleKey>Knobs`, which is how a spec opens it.

Settled with the user, renaming `ElementHighlight` on the way. A spotlight cuts a hole in an
overlay around one element; what differs between uses is **what the page is still allowed to do**, and that
turned out to be three answers rather than a boolean.

**`SpotlightHint` points, `SpotlightPrompt` insists, `SpotlightGuide` explains.** A hint yields to anything — a
click anywhere dismisses it and so does any key that is not a bare modifier. A prompt makes the highlighted
element the only reachable thing and waits. A guide seals the page entirely, shows the element rather than
offering it, and puts the live controls in a popup beside it.

**They are three presets over an unexported base, and the reason is the user's rather than mine.** My argument
was that `renderPopup` is required on one and meaningless on the other two, which a mode prop cannot say in
types. Theirs subsumes it: **one variant can never become another while it is open**, so the choice is not a
runtime value and has no business being a runtime prop. `Checkbox` / `Toggle` / `Radio` over `BinarySwitch`
again, and `Drawer` over `Modal`.

**Escape stays live in every mode, and that is a conformance requirement rather than a kindness.** WCAG 2.1.2
No Keyboard Trap is Level A: _"If keyboard focus can be moved to a component of the page using a keyboard
interface, then focus can be moved away from that component using only a keyboard interface"_ — trapping is
allowed only _"as long as the user knows how to 'untrap' the focus"_, and Escape is a standard exit. So the
honest description of `SpotlightPrompt` is **"click it, or press Escape"**, and nobody may harden that away.

**`prompt` and `guide` seal the page by opposite mechanisms, because `inert` is inherited.** There is no "seal
everything except this one control": `inert` cannot be lifted off a descendant. So `guide`, whose hole is dead,
sets `inert` and gets hit testing, tab order and the accessibility tree in one attribute; `prompt`, whose hole
must stay live, keeps the overlay segments for the pointer and pulls focus back on `focusin` for the keyboard.
The cost is in `backlog.md`: `prompt` cannot hide the page from a screen reader.

**The seal climbs to the body rather than sitting on a root, because there is no root.** The content a
`Viewport` wraps is not a single node — the portal and the children are siblings inside it — and `Portal` nests
its own container inside the mount, so the page is two levels above anything this component holds. The walk
goes from the portal container up to `document.body`, inerting each ancestor's other children, which is the
same shape with a `Viewport` and without one. Elements already `inert` are skipped, or the cleanup would hand
back something that was never ours.

**Autofocus waits for the placement and then latches, and both halves were bugs first.** The popup is
`visibility: hidden` until `Anchor` has measured it, and a hidden element takes no focus — so autofocusing on
mount silently did nothing and left a sealed page with focus on the body. Then, because the position changes on
every step, an autofocus that kept following it threw focus back to the first control each time: press `Next`,
and the next press lands on `Skip all`. Both are pinned in `spotlight.spec.ts`.

**Every mode scrolls to what it highlights, and the mode makes no difference to that.** The user's call, over
the alternative of leaving `hint` out. The argument for leaving it out was that a hint points at something you
are already looking at, so moving the page under someone who did not ask is worse than not pointing; the
argument that won is that a spotlight aimed at something off-screen is useless in every mode, and that a rule
with one mode-shaped exception is a rule nobody remembers. So the effect reads the element and the visibility
and nothing else — it does not read `getMode`.

**It is `scrollIntoView({ block: "nearest", inline: "nearest" })`, which is what the highlighted-row controls
already use.** `Select`, `Menu` and `Clock` all scroll their highlighted row with `block: "nearest"`, so the
smallest movement that brings the thing into view is the house answer rather than a new one. "Nearest" also
means an element already fully visible is not moved at all, which is what keeps a hint from twitching the page
in the common case. No `behavior: "smooth"`: the rect is re-read every frame while the spotlight is open, so a
smooth scroll would work, but an instant one has no reduced-motion question to answer and matches the three
controls above.

**A step change is announced, and the words are the consumer's.** Focus deliberately stays where the reader
put it when a step changes — moving it is worse, for the reasons above — but that leaves a screen reader
hearing nothing at all as the popup's content is replaced under held focus. `announcement` is a string the
consumer sets per step, spoken politely through `LiveAnnouncer` whenever it changes while the spotlight is
open. The library owns neither the step count nor the title, exactly as it owns no toast's text, so it holds
no wording of its own; and the announcer's region is reserved on mount for the same reason `Toasts` reserves
its two, since a live region created by its first message may be silent for that message.

**It is announced on a change and never on the first show**, because the popup takes focus once it is placed
and a reader is already reading it there. Announcing the first step as well would say it twice, which is the
stutter this mechanism exists to avoid rather than cause.

**The Playground's guide example holds its steps in a strip one step tall, and that is deliberate.** The demo
page is short enough that both tour steps were always on screen, which made the scroll unobservable and the
spec unwritable. The strip is what reproduces a long page inside a card, and `spotlight.spec.ts` reads its
`scrollTop` — the same shape as `viewport.spec.ts` driving `[data-scroll-box]`.

### The hint example's moving buttons are bounded by a `PageMeasureBox`

The user's call, after the sliding buttons walked out of the example card — the vertical one worst, because a
column of two buttons reserves only their own height and the second then traveled a further two of its own
heights past the bottom.

**The travel was a fraction of the button, and it needed to be a fraction of a box.** Each wrapper slid
`translate(200%)`, which is 200% of the moving element, so the distance was set by how wide the words
"Highlight Me" happen to render and the container had no say in it. Both buttons now sit absolutely inside a
`PageMeasureBox` of a stated width and height, and each keyframe travels `calc(<box>px - 100%)` — the box's
size less the element's own — so the far edge of the travel is the far edge of the box exactly, whatever the
button measures. The checkered box is also the honest wrapper for this example under the Playground's own
rule: something moves inside its bounds, which is what `PageMeasureBox` is for.

**The two get separate lanes, because they would otherwise cross.** The horizontal one runs along the top and
the vertical one hangs from the right below it, so the horizontal one reaching the right-hand edge passes
above the vertical one rather than through it. The lane height is what the vertical one's travel is measured
down from, which is why the three numbers live together in `SpotlightPage.css.ts` and the component reads two
of them back for the box's props.

**240 by 200, because the narrowest column the examples grid produces is 320.** The card's own padding takes
40 of that, so anything wider than 280 overflows on a narrow viewport; the button measures 136 by 40, which
leaves a little over 100 pixels of travel on each axis.

**The `border-width` the keyframes used to animate was deleted with them.** Nothing set a `border-style`, so
the used width was zero at every step and the declaration painted nothing on any frame.

### A Playground page returns a fragment, and its demos sit in a `PageMeasureBox`

Both corrected by the user after the four migrated components arrived with neither.

**A page has no root element of its own.** `App.css.ts`'s `tabPanelBody` is a column flex with a gap, and the
things it spaces are the page's own children — the props panel and the variants. A page that wraps them in a
div becomes one child, the gap disappears, and the panel sits flush against the demos. `CarouselPage` is the
shape to copy: `return (<>…</>)`. `ShapePage` gets away with a root because it re-declares the same column and
gap on it, which is the exception rather than the pattern.

**A demo sits in `PageMeasureBox`, not in a box the page invented.** It draws the checkerboard and the dashed
border that say "this is the space the component asked for", which is exactly what a page hand-rolling a
bordered `host` div is trying to say and says less well. Three of the four pages had their own.

**The border paints behind the demo, not over it.** It was at `z-index: 1` and drew across whatever it
contained, which stayed invisible for as long as every demo left a margin inside its box — `ElementMosaic`
is the first that fills one edge to edge, and the dashes ran straight over the tiles. A measurement drawn on
top of the thing it measures is the wrong way round. The box now isolates itself and the border sits at
`z-index: -1`, which puts it above the checkerboard and below everything the page renders into it.

**The box has no padding, and that is the whole point of it.** Stated by the user, twice: the content hugs the
box, so the border is a measurement rather than a frame. It was defaulting to 20px, which quietly made every
demo on every page smaller than the thing being measured, and three pages had grown a
`size + MEASURE_BOX_PADDING * 2` expression to cancel it back out. The default is now zero and those
expressions are gone. **The components that draw text are the exception and opt in** — `Typewriter`,
`RichText`, `ScrambleText` — because unpadded text is hard to read; `MEASURE_BOX_PADDING` stays exported for
them. The user restated the scope later, in those terms: padding belongs to the text components and to nothing
else, so a demo of anything that is not text hugs its box.

**It kept coming back, so it is restated here in the user's own terms: no padding inside a measure box unless
the content is plain text.** `PatchBoard` and `Bracket` both shipped with `MEASURE_BOX_PADDING` long after the
default went to zero, copied from the text pages. Before reaching for the constant, ask whether the thing inside
draws text as its content; a board, a tree or a wheel with labels on it does not.

**Only the component goes inside the box; the page's own controls sit outside it.** Stated by the user alongside
the padding rule, after `PatchBoard`'s zoom example put its zoom buttons in the same box as the board, so the
border measured a toolbar plus a board and the checkerboard showed behind both. An example that needs controls
renders them beside a `PageMeasureBox` of its own that holds only the component, which is how the zoom example
now reads.

**A demo paints at the full size of its box, and a demo drawn smaller than the box is the same fault from the
other end.** The `CardStack` sample was painted at 70% of the stack's own size, which put a ring of
checkerboard inside the border and made the box read as a frame again — the padding argument exactly, moved
from the box's style into the content's. The box measures what the component asked for, so the sample fills it.

**`isFilling` is how a box takes the width it is given rather than a number.** A demo of something sized by its
container has no width of its own to state, and a number written into the page instead is a number that
overflows the example card as soon as the window is narrower than it was when the number was chosen.

**The box hugs its content, and that is the same point from the other end.** It reports what the component asked for and
nothing else, so the border around a demo is a measurement rather than a frame. That was intent and not yet
code: `measureBoxRoot` was a plain block, so a box given no `getWidth` stretched to its card and the border
was drawn wider than the thing it measured. `width: fit-content` on the class makes it true, and it reaches
only the boxes that pass no width, since an inline `getWidth` overrides it. The consequence, stated by the
user when this was written up the other way round: a component that asks for a share of its parent —
`Formation` and `Staircase` both size themselves as a fraction of their container — has no appetite of its own,
and collapses to nothing inside a box that only grants appetite. That is the box being truthful, not being in
the way. What it forces is that **the page has to state the width it is demonstrating at**, which is what
`getWidth` is for and what `CellAnimationPage` already used it for. Worth naming because the symptom is a demo
that renders and measures as zero rather than one that errors.
