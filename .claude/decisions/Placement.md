# Decisions: `Placement`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Arbitrary item placement: `Abstracts/Placement`, and `Menu` as the first consumer

The first half of `backlog.md` item 10. A control's items can be placed anywhere rather than along a line, and
the vocabulary for saying where lives in an abstract so the next control can use the same one.

**A placement is a center, a size, an optional turn and an optional depth, all in fractions of the container's
width.** `Formation`'s trick, taken wholesale: measurements in container-query units resolve in CSS with no
`ResizeObserver` and no measured size anywhere, and the layout declares its own `heightRatio` so the box knows
its shape. The picking works in the same units, which is why none of this touches the DOM to decide anything.

**A layout is data, and that is the whole idea.** `computeLayout` is a function from an item count to
placements. `Menu` takes one and changes nothing without it — the column renders exactly as before, which is
why every existing menu spec passed untouched through the whole of this. The user's framing, and the reason
this beat a `variant` prop: an arrangement nobody has thought of yet is not a name a component could have
shipped, so the shape has to be something a consumer writes.

**The layout sizes itself, in pixels.** Decided by the user against the alternatives of a size prop on `Menu`
and of deriving one from the invoker. The layout is the only thing that knows how many items must fit and how
big they are: `ring` works out the circumference five 96px items need and grows its radius accordingly, which
is the "a wheel of twenty is a bad idea" judgement made in the one place able to make it. The demo carried an
arbitrary 340px box before this and the fan's outer items fell off the sides of it, which is what settled it.

**Picking belongs to the flick, and hovering belongs to the pointer.** The abstract answers "which item is
meant" from a point, by angle about an origin or by nearest center, with the rule declared by the layout
rather than by the component. It exists because `CardFan`'s three findings and the ring's gaps are the same
bug — a layout has an inverse and hit-testing is not it. **But hover was wired to it and that was wrong**: the
user opened a wheel, hovered the opener in the middle of it, and something across the ring lit up with no way
to tell what a click would do. Direction only makes sense for a gesture where the pointer never travels to the
item. So hover hit-tests as it always did, and `PlacementUtils.pickIndex` waits for the flick.

**Three layouts ship, and the names came out of a correction.** `ring` is a closed band round the invoker,
drawn as wedges of a hollow pie chart; `hemisphere` is the same band over half a turn, opening upward; `fan`
is a narrow arc of boxes opening sideways with them tilted along it, which is the shape a combat menu uses. What was
first called `fan` was the hemisphere — the user's own word for it — and the real fan is a different thing:
upright-ish labels reading outward from the thing that opened them, each turned by three quarters of its
angular position so the outer two do not go as steep as the arc. All three grow outward with the level they
are drawn at, which is what makes a submenu concentric with the level above it.

**A laid-out popup is not a box, and three things follow.** All were faults the user found by using it.

- **It must not take the pointer.** `popoverRoot` sets `pointer-events: all`, so the gaps between the items of
  a ring were still the popover's hit area, sitting over the trigger — clicking the opener to dismiss did
  nothing. `Popover` gained `isTransparentToPointer` and the placed items re-enable themselves. The fix
  silently did nothing at first because the new style was declared _above_ `popoverRoot` and lost on source
  order; both are a single class, so the later one wins.
- **It must not be nudged.** A ring is centered on its invoker, and `Anchor` moving it to keep it on screen
  breaks exactly that. `getIsPinned` skips both adjustments it makes — choosing a safe placement from the
  family, and clamping into the viewport bands.
- **Pinned means it has to close.** A layer that does not follow its anchor is pointing at nothing once the
  anchor scrolls away, so `Popover` dismisses with a new `"anchor_gone"` reason. Only when pinned, so no
  existing popover changed. **The anchor's rect is only observed while the layer is visible**, which produced
  the nastiest bug of the batch: after an auto-close the last reading kept was the off-screen one, so the next
  open read a stale rect, decided the anchor was already gone and dismissed inside a frame — indistinguishable
  from the click doing nothing, and worse each time. A layer now has to have _seen_ its anchor before it can
  decide the anchor has gone.

**Restoring focus no longer scrolls the page.** Closing on scroll-out yanked the view back, because the layer
focused its opener again and the browser scrolled to it. `FocusManager` already opened with
`preventScroll: true` and the restore did not; the pair is symmetric now. This reaches `Modal`, `Drawer`,
`Select` and the pickers, and is a no-op in all of them: it only changes anything where the restore target is
off screen, which outside this case never happens.

**A closed menu highlights nothing.** The highlight was cleared the instant `isOpen` flipped, while the popup
was still fading out, so the memo fell back to the first item and the user watched the highlight jump home as
it faded. `getHighlightedIndex` returns nothing while closed, which also lets `getActiveItemId` drop its own
open check.

**Item placement is what the demo's own painter had to catch up with, not the component.** Two of the user's
reports were the Playground's fault and worth recording so the same conclusions are not drawn about the
component: the ring "rendering over a black rectangle with scrollbars" was the example wrapping the layout in
`PagePopoverSurface`, and the menu "snapping between 1 and 0 rather than fading" was the example throwing away
the visibility target and duration that `renderPopup` hands it. A laid-out menu paints its own transition and
its own chrome, or gets neither.

### Concentric submenus: `computeLayout` learns where it is, and a submenu borrows its parent's anchor

The second piece of `backlog.md` item 10. A submenu of a laid-out menu is drawn as a wider ring round the
same center rather than hanging off the item that opened it, so a wheel stays one wheel however deep it goes.

**`computeLayout` takes one object rather than a run of arguments, and the reason is the third one.**
`PlacementLayoutFn` was `(itemCount) => layout` and is now `({ itemCount, level, parentExtent }) => layout`.
A layout that wants only the width of the level above it would otherwise have to declare and ignore the two
before it to reach it — the same fault the one-aggregated-object rule in `conventions.md` exists to prevent,
arriving on a compute function rather than on a painter. Existing layouts destructure what they use and
nothing else changes.

**It is `level`, not `depth`, because `PlacementRect.depth` already means something else.** A rect's `depth`
is its paint order — the z-index a layout can name for an item that has to sit over its neighbor. Two fields
called `depth` in one abstract, one meaning "how far down the menu tree" and the other "how far forward",
is the kind of collision that costs a future session an hour. The root level is `0`.

**A level cannot work out its own radius from `level` alone, which is why `parentExtent` is there too.** A
ring's radius grows with its item count, so the level above could be any size: a root of twenty items is a
far bigger circle than a root of four, and a submenu placed at a fixed step per level would land inside it.
The parent's box width is the one number that settles it, the parent already knows it, and half of it is
exactly the outer edge the child has to clear — so each layout takes `max(what my own items need,
parent's half-width + gap + half an item)`. At the root `parentExtent` is `0` and that second term falls below
every layout's own minimum, so the arithmetic needs no special case for having no parent.

**A laid-out submenu takes its parent's anchor, placement and offset; an ordinary one still takes its own
item's.** Sharing a center is the whole point, and the center in question is whatever the root anchored to —
a trigger, some other element the consumer named, or the point a right-click happened at. Passing the
parent's own anchor down rather than reaching for the trigger keeps all three cases right, and it chains:
level two inherits level one's anchor, which is already the root's. `submenuPlacement` and `submenuOffset`
are untouched and still govern every menu without a layout.

**`isSubmenu` is gone, because `level > 0` is the same fact and cannot disagree with itself.** It existed for
one branch — `ArrowLeft` closes a level only when there is a level above it — and a second prop stating what
`level` already states is a pair that can be passed inconsistently.

**The demo is the nested action set on the ring layout, and the spec asserts the relationship rather than the
radii.** Three bands come out at 296px, 480px and 664px across, but nothing in `e2e/menuLaidOut.spec.ts`
names those numbers: it reads each level's center and width off the element and checks that every level
shares the root's center and encloses the one above it. Re-tuning a gap then cannot arrive as a red run.

### A wheel of wedges: sectors on the placement, and an X in the hole

The user's redesign of the ring, after seeing it drawn as a circle of rounded squares. Three asks: real
wedges rather than boxes, a hole in the middle so the band reads as a hollow pie chart, and a close control
in that hole which the keyboard walk reaches — so the wheel may be drawn straight over its own opener.

**The library places and wires; the painter paints the wedge.** `PlacementRect` gained an optional `sector` —
inner radius, outer radius, and the two angles — and `renderItem` gained a third argument, the item's
placement. Nothing in `components/src` knows what an annular sector looks like: the Playground reads the
sector and emits one SVG path. The alternative, a `clip-path` the layout hands over for the component to
apply, was rejected because it puts a CSS string in the vocabulary and still leaves the painter unable to
draw a border, a gradient or anything else that follows the arc.

**A sector's item element does not take the pointer, and the painted path does.** Wedge boxes overlap — a
rectangle round an arc always covers its neighbors' rectangles — so a box that claimed the pointer would
steal presses meant for the wedge beside it. `menuItemRegion` turns pointer events off on the `menuitem`
element and the path turns them back on for itself, which is the same split `Popover`'s
`isTransparentToPointer` already uses one level up. Hit-testing is then the drawn shape exactly, with no
geometry in the component at all.

**The placement box stays the label's box, and it is not the sector's bounding box — that was tried and it
is wrong.** A bounding box looked tidier: the element would then contain the whole wedge and the label
could simply center in it. But the center of an annular sector's bounding box is not on the sector. For a
wide, thin band — the second level of a wheel is 117° of a band 84px thick — that center lands **inside the
hole**, so the label would float off the wedge and the element's own center would not be a point a pointer
could press. So `leftShare` and `topShare` stay what they mean everywhere else, the mid-radius mid-angle point where
the content goes, and the painter's SVG carries `overflow: visible` so a small box can paint a wedge much
larger than itself.

**The closer is the layout's decision and the consumer's paint.** `PlacementLayout` may return a `closer`
placement, and `Menu` renders a close control there when the consumer also passes `closerDefs`. The layout
is the only thing that knows there is a hole to put one in, which is why the switch lives there rather than
on `Menu`; `ring` returns one at level zero only, so a submenu band does not stack a second X on top of the
first. `closerDefs` pairs the painter with an `ariaLabel` in one object because an X glyph has no accessible
name of its own, and a separate optional label prop could be left off — 4.1.2 Name, Role, Value is not
something a consumer should be able to forget.

**It is the last stop in the walk, and it is a position rather than an item.** The highlight was a value of
`T`, and the closer has no value, so it is `CLOSER_POSITION` — a sentinel index of `-1` beside a boolean
that says the closer holds the highlight. Arrow keys walk items then the closer and wrap, `Enter` on it
dismisses, and typeahead ignores it, because typing a letter should never land on the thing that throws the
menu away.

**Hovering it takes the highlight, exactly as hovering a wedge does, and only one of them can hold it.**
The user's rule: the closer is one of the items, so when it is chosen nothing else is. A first attempt gave
it no hover at all and let the painter light it from `isHovered` instead — which put two things on screen
looking chosen at once, and was the wrong reading of what "part of the items" means.

**It closes an open band below it too, because that is what hovering a leaf does.** Reported by the user:
hover a wedge, hover an item in the band it opened, then hover the X — and the band stayed open with its item
still lit, so two things were chosen at once.

**Making that work needed a hover the pointer did not cause to be thrown away first.** A laid-out menu covers
its own opener, so the pointer can be sitting on the X without ever having gone there, and the browser
reports that as a fresh `mouseenter` the moment anything else changes the layout — opening a submenu with
`ArrowRight` fired one, which closed the submenu that had just opened. A pointer that never moved was undoing
a keystroke. `Menu` now keeps the point of the last real `pointermove` for as long as it exists, and a hover
is acted on only when its own point differs from that one by more than a pixel — a `pointermove` gives 959.98
where the `mouseover` before it gives 959. The cost of the tolerance is that a hover which crosses into another
item on a sub-pixel step is dropped, which no pointer a person is holding can do.

**The guard is on every item, not only on the closer.** The same fault is already recorded against a menu
that lands under the pointer that opened it — six specs failed on a highlight one item too far down — so a
rule that only covered the X would have left the same bug in place one wedge over.

**But it governs the levels only, never the choice.** A hover always moves the highlight; only opening or
closing a level asks whether the pointer really moved. The guard cannot be exact — the two events report a
position at different precisions, so it works to within a pixel — and a pointer inching across a boundary
sub-pixel by sub-pixel therefore has a hover thrown away. Losing a level to that is a bug worth the
tolerance; losing the choice under the pointer is not, and it reads as the thing not registering presses at
all.

**The hole is sized to swallow the opener rather than to fit the glyph.** The default hole radius is 64, so
the closer's disc is 128 across, which covers the Playground's trigger button corners with room to spare. A
smaller disc left the button's ends poking out either side of the X, which is the giveaway that the wheel is
a layer over a button rather than a thing in its own right.

**The ring is a factory, and the ready-made `ring` is what it builds with nothing asked for.** A layout is
data, but a layout with its measurements welded shut is data a consumer can only copy: the wheel's hole, the
thickness of a band, the gap between levels and the gap between wedges were module constants, so anybody
wanting a fatter band had to fork the file. `createRing(defs)` takes all of them, every field optional, and
`ring` is `createRing()` — one implementation, not a default beside a general case that could drift from it,
which is what the first assertion in `PlacementLayouts.utils.test.ts` pins.

**The close control's size follows the hole rather than a constant of its own.** `closerRadiusPx` defaults to
`holeRadius`, so a consumer who widens the hole gets a disc that still fills it and still covers the opener
underneath — the thing the size is actually for. A flat default would have quietly left a ring of bare hole
round the X the moment anybody touched the geometry.

**There is no knob for where the first wedge sits, and that is deliberate rather than forgotten.** The
factory exposes the numbers that were already constants and nothing more; a start angle, a direction of
travel and per-level overrides are all plausible and none has been asked for. `fan` is still a bare constant
for the same reason.

**A hemisphere is the same band over half a turn, so one builder makes both.** Asked for by the user once the
ring was wedges. The builder took the spread in degrees and everything else the ring already had, and shipped
it as two presets. **The presets are gone** — see _"One factory per arrangement"_ — and `spreadDegrees` is a
def on `createRing` like every other knob; the paragraphs below describe the arithmetic, which is unchanged.

**What the spread changes is where the first wedge sits, and that is the only branch in the builder.** A
closed ring centers its first item straight up and the rest follow round; an open arc has two ends, so the
items are spread symmetrically about straight up instead — first and last are mirror images, which is what
`PlacementLayouts.utils.test.ts` asserts rather than any angle. The old hemisphere placed boxes on a 150-degree
arc and sized its radius from how much room the items needed; none of that survived, so `toRadius` and the
crowding factor it used went with it.

**A half turn leaves each wedge half the angle, and the builder used to compensate with a wider hole.**
The arithmetic is worth keeping even though the compensation is gone: a label's width is the chord across its
wedge, which is the radius times the sine of half the wedge's angle, so halving the turn halves the angle and
the only thing left to win it back with is radius. The builder therefore carried a second set of base numbers
that a half turn switched to. **That branch is gone** — the user's call, on the grounds that a default tuned
for what one example needed is not a default — and a caller asking for a half turn passes the hole and band it
wants alongside the spread.

**Its close control does not fill that hole, which is the one place the two shapes disagree.** The rule for
the ring is that the disc fills the hole so it always covers the opener; on a hemisphere the hole is wide
because the labels needed room, not because the opener is, so a disc filling it would be a dinner plate over
a button. The defaults name a closer radius of their own, which is what the knob was for.

**The trigger's caption had to shrink when the wheel grew a hole.** The hemisphere demo's button said "Fan",
which was wrong, and the honest replacement was long enough to poke out from behind the X that covers it. The
Playground's captions are one short word by convention — "Wheel", "Fan", "Edit" — and the card's own title
carries the full name, so the button says "Half". Worth writing down because it is a real constraint on any
consumer of this layout: the hole is sized by the layout and the opener has to fit inside it.

### The wheel as the ring's second consumer, and the `Placement` page

The user's call, once the factory existed: the flat wheel had its own wedge trigonometry and should be
drawing on the same layout the menu does.

**`PlacementUtils.getSectorPath` is geometry, not paint, and the library already ships that kind of thing.**
Two painters were about to write the same arc-and-back path string — the menu's wedge and the prize wheel's —
so the builder moved into the abstract beside the picking. `BracketConnectorPaths` is the precedent: a path
`d` is an expression of a shape in SVG's notation, which is the same kind of answer as "where does this item
go". What stays outside is every choice about how it looks: fill, stroke, gradient, transition.

**The overhead wheel asks the layout for one wedge and turns copies of it, rather than placing each one.**
Placing each wedge was tried in thought and rejected on two counts. A wheel's wedges are identical by
construction, so per-item placements would be the same shape computed N times; and the spin is a transform
that changes every frame, while a layout is static geometry with no angle in its signature — so a placed
wheel would have to rotate a container instead, which moves where the turn is written and breaks the
`wheel.spec.ts` helper that reads it off the first wedge. The wedge divs keep their own rotation and each is
handed `placements[0]`, the canonical wedge at twelve o'clock.

**The placement travels inside `WheelWedgeState`, not as a third render argument.** `Menu` had to add one to
`renderItem` because `MenuItemFlags` is all booleans and a rect in it would have made the name a lie. A
wedge's state already carries an index and a count, so the aggregate rule applies the other way round here:
data a painter needs goes into the object it already receives.

**`labelRadiusRatio` is the knob the second consumer added.** A menu's label sits in the middle of its band;
a prize wheel's sits out near the rim, with the middle left for the hub. Nothing else about the wheel needed
saying, which is the shape of correction the bottom-up plan was expecting — the abstract grew one field
because a real second use asked for it, not because the field seemed likely.

**The `Placement` page is what a shared layout looks like from outside.** Five knobs build one `createRing`,
and the same function is handed to a `Menu` and to an `OverheadWheel` side by side. The two controls have
nothing else in common — one is a popup with levels and a keyboard walk, the other spins — so a knob moving
both is the claim the page exists to make, and `e2e/placement.spec.ts` asserts exactly that rather than any
measurement: widening the band widens the menu's own popup and redraws the wheel's wedge, and emptying the
hole turns a two-arc band into a one-arc pie.

### A fan is an arc that tilts, so there is no fan

**Once the fan had to fit a box, nothing was left that the arc did not already do.** It derived its spread
from the item count and its radius from `itemHeight + gap`, both of which a given box replaces; it spaced
items evenly in angle where the arc walks the curve by arc length, which is the same thing on a circle and
better than it on an ellipse. What genuinely differed was that it turned its items and that it opened
rightward rather than upward. Those are two knobs, so `ArcDefs` has `tiltRatio` and `facingDegrees`, and
`createFan`, `ArcDefs`, `toArc` and `toPlacements` are gone. The registry keeps a `fan` entry; it is an arc
facing zero with a tilt.

**Tilt is one formula and the ring earns it too.** An item is turned by its own polar angle times
`tiltRatio` — not by its offset from the facing, which would leave the top of a ring upright when the whole
point is to radiate. Zero is upright, which is what every layout did before, so the default changes nothing;
one turns an item fully with the radius, which is the fan's old behavior and gives a band labels that point
outward. It reaches the three radial arrangements and stops there, since a honeycomb, a whorl and a zigzag
give an item no angle to turn by — the same boundary as `pickRule: "angle"` and `sector`.

**A turned box is wider than it is, and the fit has to know.** The arc's zoom-out measures each item's turned
footprint — `width·|cos| + height·|sin|` across, the other way down — or the outermost cards of a tilted fan
reach past the box at exactly the point where the arrangement is widest.

**A fan's spread follows its card count: fifteen degrees per card, unless the consumer sets one.** The user's call.
A fixed spread stretched three cards across the same angle as eight. The count is only known when a level is laid
out, so `FanMenuUtils.createLayout` works the spread out per call, and the consumer sets the angle per card
(`spreadDegreesPerItem`) rather than a total — `FanLayoutDefs` leaves `spreadDegrees` out, so there is one setting for
the spread and no question of which wins.

**A fan is a part-ring now, not an arc.** The user's call, once the arc began filling its box: `Menu` pins a layout's
center to the trigger, and an arc zooms its drawn piece to fill the box, so a narrower level drew a bigger curve and
three cards sat 186px from the trigger where eight sat 62px. A ring's box is always the whole circle with the center
in its middle, so every level sits the same distance from the trigger and its cards the same distance apart.
`FanMenuProps.layoutDefs` is `FanLayoutDefs`, `BandDefs` without `computeItemArcs` (a values type takes no function).
**The ring's wedges are dropped**, since `Menu` gives an item carrying a `sector` `pointer-events: none` for a wedge
painter to take presses on its own shape, and a fan's cards are boxes. **The ring places the cards and the fan sizes
them**: the ring holds each item to its wedge, about the radius times the angle per card, which at fifteen degrees made
the page's cards 42px wide, and widening them that way pushed them hundreds of pixels from the trigger. So
`createLayout` keeps the ring's positions and tilt and overwrites each card's size with `itemWidthRatio` and
`itemHeightRatio`, both shares of the fan's width as on the arc, and cards overlap as a fan's should. The ring's
own sizing settings (`itemMaxWidthRatio`, its `itemHeightRatio`, `wedgeGapDegrees`) do nothing to a card after that,
so `FanLayoutDefs` picks only the ring settings that still place one: facing, hole, tilt and item radius.

**The offset the fan used to smuggle in is now something the menu says.** A fan opens rightward, so its
items only ever used the right half of the box it reserved; the empty left half was what made a
center-on-the-trigger popover appear to open sideways. With the box snapped to its content that padding is
gone, so `Menu` shifts its layout box until the layout's `origin` — the pivot every radial layout already
publishes — lands where the box's center used to. A band's origin is dead center, so nothing about a wheel
menu moves; a fan's is near its left edge, and it opens rightward because the rule says so rather than
because of a gap in the geometry.

### One factory per arrangement, and defaults that are nobody's example

**A preset is not an arrangement, and the sample registry is a list of arrangements.** The user's rule, made
against `hemisphere`, which was `createRing` with one number changed and put a second entry in every dropdown
that reads the registry for something with nothing new to look at. `spreadDegrees` is a `BandDefs` field now,
`createBand` and `createHemisphere` are gone, and `createRing(defs)` is the only band factory. A caller
wanting a half turn asks for one where it renders.

**The three whorls stay, and the reason is the distinction worth keeping.** They are also one factory at three
spacings, but a whorl is read against the shape put into it — a circle, a hexagon and a square each want
different spacing — so picking between them on the Formation page shows something a hemisphere does not. The
test is whether a reader learns anything from the second entry, not whether the arguments differ.

**A radial tree left the library entirely and lives in the page that draws one.** It is the only layout that
needs more than an item count: every node has to know its parent before it can be given a slice of the turn.
`Formation` passes no `itemParents`, so in the registry it silently degraded into a worse ring — every node a
root, all of them on the inner circle. It is `Radial.tsx` now, following what `ScanlineAnimation`'s page does
with `glitch`, and it earns its place there twice over: the recursive span divider is exactly what somebody
writing their own layout needs to read, and a layout turns out to be nothing more than a function from defs to
a list of boxes.

**Defaults are neutral, not tuned to what an example needed.** The user's words were that 84 feels oddly
specific and a bit off-grid for a default. Every layout is authored in the same nominal hundred-unit space
now, with round defaults in that space. The numbers the examples used to lean on moved into the example files,
which is the same
split the pixel work drew: the arrangement is the library's, the size is the consumer's.

### Layouts carry no pixels, and the box a layout is given is the consumer's

**Every length a layout takes is unit-less now.** `holeRadius` is `holeRadius`, and so on through
`bandWidth`, `levelGap`, `wedgeArc`, `centerRadius`, `width`, `height`, `itemWidth`, `itemHeight`, `gap`,
`cellWidth`, `innerRadius` and `ringGap`. The arithmetic never had to change, because it was already
homogeneous — every layout computed in its inputs' units and divided by the total before returning, so the
fractions are identical whatever the numbers mean. **The user's framing was that this is what an SVG does**:
author the geometry in one coordinate space and let whoever renders it decide how many pixels that space is
worth.

**`PlacementLayout.width` is `extent`, and the box no longer honors it.** `PlacementBox` used to set
`width: <layout width>px`, which is what made an arrangement rigid; it now always fills its parent, so the
same fractions scale into whatever room they are given and the aspect ratio comes from `heightRatio` as
before. `extent` survives for one job only — telling a level how large the level inside it was — and
`PlacementLayoutDefs.parentWidth` is `parentExtent` to say so.

**What the library gives up is the legibility guarantee, deliberately.** A band was 84px so a label would
fit, and `wedgeArc` was a chord length so a wedge would be wide enough to read. Neither can promise anything
once the box is the consumer's, which also means WCAG 2.5.8's 24px target size becomes the consumer's to
meet. The user's call, on the grounds that the library was guessing at a size only the consumer knows.

**A menu sizes its own levels, because nothing outside can.** Each `MenuLevel` is its own portalled popover,
so once the layout stopped reporting pixels there was nothing to give a level a width. `MenuProps.layoutSize`
takes a CSS length from the consumer — the library never parses it — and each level renders at
`calc(<layoutSize> * extent / rootExtent)`, so the bands still grow outward in the ratios the layout chose.

**Two controls sized themselves from the box and had to be told not to.** `RadioGroup`'s root is
`width: fit-content` and `Sortable` wraps its list in an `InteractionWrapper` whose default sizing is the
same, both of which used to be filled out by the box's own pixel width and collapsed to nothing without it.
Each now switches to filling when a layout is present. `PlacementBox` also carries `width: 100%` and
`flex-shrink: 0`, since a flex item with only absolutely positioned children otherwise shrinks to zero — which
is what emptied the paginator's dial and the honeycomb tabs.

### Sized and fitted layouts are one family, and the registry lists both

**A `SizedLayout` is a `PlacementLayout` with the width filled in, so `FittedLayoutFn` is nothing but the
general signature.** That is the whole of the difference and it lands in one place: `PlacementBox` reads
`layout.extent`, and where it is present the box is that many pixels wide while every fraction is of that,
where it is absent the box fills its parent and the fractions are of whatever it was given. So an arrangement
either dictates its own size or fits the room it is put in, and both are the same contract.

**An arrangement with no effect on it pays for none of this.** The pointer was already left untracked, but
three things still ran: the reduced-motion query was subscribed to, the arrangement's spacing and closure
were computed on every layout change, and both happen once per placed box on a page. `MediaQueryMonitorUtils`
grew the same `getIsDisabled` its neighbor `PointerTracker` already had — a component has to ask for the
accessor while it is setting up, before it knows whether it will ever be read, so asking without joining the
count is the thing it needed to be able to do — and the arrangement memo answers with a resting value while
no effect is passed. Raised by the user as a question about whether the placement work had grown.

**Which is why nothing ever stopped `Formation` taking a ring.** Its `computeLayout` is typed
`PlacementLayoutFn` and a `SizedLayoutFn` returns a subtype of what that asks for. The restriction was in the
Playground's dropdown, which read a key list that existed for five of the eleven layouts.

**The five had no factories only because nobody had needed one.** `podium`, the three whorls and `zigzag` were
module-private functions reachable through a registry, while the ring, arc, fan, honeycomb and radial tree
were exported factories with a defs type each. They are now the same shape: `createPodium`, `createWhorl` and
`createZigzag` beside `createRing` and the rest, with `WhorlDefs` and `ZigzagDefs` lifting numbers that were
already positional arguments rather than inventing knobs, and the three whorls becoming presets of
`createWhorl` the way the ring presets were of the band builder at the time.

**The registry is a `.const.ts` and lists every layout.** `FittedLayouts` was a namespace nested inside a
utils namespace, holding a key list for one page's dropdown — the only registry in the library shaped that
way. It is `PlacementLayouts.const.ts` now, beside `StaircaseIndents` and `CellAnimationZones`, and it names
all eleven, which is what lets a consumer offer the whole set by key.

### Every layout sample lives in one place, and none of them is a menu's

The user's call, taken while `backlog.md` item 10's proving pass was still open. `Samples/Menu/Layouts` was
named when a menu was the only thing that had ever asked for a layout; by the end of the pass it held a
honeycomb and a radial tree, and eleven consumers imported it of which three were menus. It is now
`Samples/Placement/Layouts`, and the arrangements that came in with `Formation` are in it too.

**One contract, so any layout works with any placed control.** `Formation`'s `computeLayout` took a bare item
count while everything else took `PlacementLayoutDefs`, which is what kept the two families apart — the same
divergence as the vocabulary of insets, one level up. `Formation` takes `PlacementLayoutFn` now, so a ring can
be handed to a `Formation` and a whorl to a `Menu`, and neither knows the other exists.

**What separates the two families is whether a layout knows its own size in pixels, and that is what their
names say.** `SizedLayoutFn` returns a `SizedLayout`, which states a `width` — the arc, the fan, the honeycomb
and the radial tree all work out how much room their items need. `FittedLayoutFn` is a plain
`PlacementLayoutFn` whose layouts state no width, so the box takes it from whatever it is put in, which is
what `Formation`'s podium and whorls have always done. Both are `PlacementLayoutFn`s and a control cannot
tell them apart; the difference is only whether the box sizes itself.

**Four exports went with the move rather than into a file that no longer names menus.** `MENU_LAYOUTS`,
`MENU_LAYOUT_KEYS`, `MenuLayoutKey` and `NO_MENU_ITEMS` were a registry for a picker nothing had built:
no consumer in the library, the Playground or the suite read any of them. Carrying a dead registry across a
move and renaming it would have been worse than deleting it.

### The band and the arc are two placers, and `fit` was the seam between them

The user's call, arrived at from the rating arc. One factory had grown a `fit` of `"turn"` or `"content"`,
and it was not a knob: it flipped the same function between two different contracts. A **band** states the
size it needs in pixels and hands that size down, which is what lets a `WheelMenu`'s levels sit concentric
inside one another — a nested band works out its inner radius from `parentExtent`, and that only means
anything while the parent's width _is_ the band's diameter. A snapped box's width means something else, so
snapping and nesting could never both be true. The repo already had names for the two natures, `SizedLayout`
and `FittedLayoutFn`; `fit` was a runtime flag flipping between them.

**The line between the two is wedges against boxes, not a whole turn against part of one.** Every caller that
asked to snap places plain boxes — the rating's stars, the stepper's steps, the toolbar's palette, the
sortable's cards — and every caller that nests paints wedges of a band. Two of the four go all the way round
and still belong on the arc's side, which is why the arc takes a spread up to a full turn rather than being
the partial one by definition.

**So the band keeps the wedges and `createArc` is new.** The band was `createBand` with two presets over it
at the time; it is one `createRing` now, and the split between it and the arc is unchanged. `fit` is gone, and with it the recorded
fault that a snapped arc could not nest — there is nothing left to snap.

**A sector still carries the point it turns about.** That came out of snapping and outlived it: a painter is
handed a `PlacementRect` rather than the layout, so a wedge drawn about the middle of the box would be drawn
about the wrong point whenever the box is not centered on the circle. `getSectorPath` prefers an explicit
argument, then the sector's own, then the middle.

### The two copies of the placement center are kept in step by a test

`PlacementLayout.origin` and `PlacementSector.origin` hold the same number, deliberately — a wedge painter is handed a
`PlacementRect` and never sees the layout — and nothing kept the two in step. Rather than remove the duplication,
`PlacementLayouts.const.test.ts` checks every layout sample at a range of item counts and fails if a sector's origin
ever differs from its layout's, with a second case making sure at least one sample carries both, so the first cannot
pass on nothing.

### The arc can be flattened or stretched, and spaces its items along the curve

The user's proposal: an arc that can be flattened or stretched sideways, rather than one that is always a
piece of a circle. It takes `ovalHeightRatio`, the oval's height against its width, so the same call draws a
circle, a wide shallow sweep, or anything between. It was two lengths at first, `width` and `height`, until
the pair turned out to say nothing a single ratio does not. The same number is now the box's proportion as well —
see _"The arc fills the box the width sets, and its items never move the box"_.

**Equal angles are equal distances on a circle and nowhere else.** On an ellipse a step of angle covers less
ground near the narrow ends, so five stars bent across a wide flat arc would crowd at both tips and spread
across the middle. The user chose even spacing along the curve over the cheaper alternative, which was to take
a circle's positions and scale them sideways — that is an affine squash, and it produces exactly the crowding
just described while making the flattening knob double as a spacing knob.

**It is measured rather than solved, and that is the right trade.** There is no closed form for the angle at
a given arc length on an ellipse. `toEvenArcAngles` walks the curve in five hundred chords, keeps a running
total, and reads back the angle at which that total reaches each item's share. A circle comes out exactly
even, which is the case that proves the walk is not introducing error of its own; flattened, what unevenness
survives is a fraction of what equal angles leave, and the spec asserts that ratio rather than either number.

**The item keeps the size it was given.** Stretching the curve must not stretch what sits on it — only the
centers move, so a star stays a star on a flat arc.

**A run between two items needs the curve, not a radius, so `PlacementLayout` gained `radii`.** `getLinkPath`
drew a circular arc between two centers about an origin, which is right only while the curve is a circle;
`Stepper`'s connectors would otherwise cut across a flattened arc rather than following it. The layout now
says what curve its items sit on, `StepperConnectorDefs` carries it through to the painter, and `getLinkPath`
emits an elliptical arc when it is given one and behaves exactly as before when it is not.

**Whether the band should take two dimensions as well is open.** It is a smaller change than it looks —
every wedge painter goes through `getSectorPath`, so only that function and the sector type would move — but
a band of constant thickness round an ellipse is not the gap between two concentric ellipses, so the wedges
would read as uneven in a way they never do on a circle.

### The arc fills the box the width sets, and its items never move the box

The user's model, worked out on a scratch bench before any code moved. The arc used to fit a box round the drawn
piece and its items and stretch that box to the given width, so an item's size decided the zoom: narrowing a
`Stepper` step by a fifth made its near-vertical curve a quarter taller. The user's rule from that: **an item takes
a share of the box, it never decides the box.**

**The box is the given width by `ovalHeightRatio`, and the oval fills it.** Only the piece the spread covers about
the facing is kept, so the piece is zoomed evenly — "contain", never stretched — until it meets the box on one side
and centered on the other, then zoomed back out evenly about its own center until every item, tilt included, fits
inside the box. Items keep their size through both zooms: `itemWidthRatio` and `itemHeightRatio` are both shares of
the given width — the height used to be a share of the item's own width, which tied it to `itemWidthRatio`, and the
user removed that link. An item too large for the box on its own is left at its size and reaches past the box.

**The layout reports the outer box** (`heightRatio` is `ovalHeightRatio`, `extent` is `1`). After the zoom-out, the
drawn piece's own box depends on the items, so reporting it would let them move the control's height after all. This
is the ring's answer too: a box that comes from the curve's settings alone, with empty space where the curve does not
reach. Every arrangement measures items against the width and nothing else; a height anchor (`sizeAnchor`, as
`Mosaic` has) was tried on the bench and dropped by the user, since every other arrangement is only ever given a
width.

**Accepted with it:**

- **Spread and facing change the zoom.** The piece's box changes shape as it turns, so a sweep of `facingDegrees`
  grows and shrinks the curve. Harmless for a fixed setting.
- **One number sets two shapes.** `ovalHeightRatio` is both the box's proportion and the oval's, so a piece much
  flatter or narrower than its oval leaves the box partly empty. The demos' numbers are the user's to retune on the
  bench rather than converted, since no conversion keeps both the old box and the old curve.
- **Every `FanMenu` level is the same width.** `Menu` sizes a level by its layout's `extent` against the first
  level's, and the arc's `extent` is now always `1`.
- **The degrees are positions on a squashed circle**, not angles a protractor at the center would read; the two agree
  only at 0°, 90°, 180° and 270°. Raised, not changed.

### The fan places tilted boxes, not wedges

The user's call. The wedge vocabulary is on `PlacementRect` and any layout may use it, but the fan's items are cards
tilted along the arc rather than slices of a band, and that is the look it is meant to have.

### A hover the pointer did not cause no longer moves the highlight

The user's call, on a finding that came out of painting a wheel's wedges with a gradient. Putting an SVG
gradient definition inside the wheel's popup was enough to make the browser re-run hit-testing as the popup
appeared, and it reports that as a fresh `mouseenter` — so a wheel, which opens centered on its own trigger,
handed the highlight to the close control in its hole before anybody had touched anything.

**The highlight moves on `pointermove`, not on an enter.** A pointer standing still never sends one, so whatever
the browser re-tests under it, nothing moves the highlight. The first answer kept `mouseenter` and told the two kinds
apart by the point on record (`getIsPointerLed`): an enter within a pixel of the last movement was taken for the
pointer standing still. It made hover feel sluggish, and the user caught it by feel — an enter reports whole pixels
and a movement does not, so a pointer creeping a fraction of a pixel at a time across a boundary was ignored, and a
slow sweep across a fan left the highlight behind on half its samples. The check and its threshold are gone.

**The item a level opens under waits for the pointer to leave it once.** The user's rule, chosen over exempting only
a wheel's close control (a special case) and over a dead zone round the opening point (a threshold again). With
hover on movement, a wheel opening under its own pointer handed the close control the highlight at the smallest
twitch. `MenuUtils.createOpeningHoverGuard` notes the pointer's point when a level opens — the point recorder stays
for this, started by the menu's root so it is running before any level opens — finds the item drawn there on the
first movement, once the level is placed, and ignores that item's hover until the pointer has left it. It is the
desktop context menu's convention; pressing the item still works, and the keyboard is untouched.

**What proves it is a dispatched event rather than a browser quirk.** No real interaction produces the
invented kind on demand — it depends on what the browser decides to re-test and when — so `menu.spec.ts`
dispatches a `mouseenter` carrying the coordinates the pointer actually last had and checks that the same item
moved onto properly still takes the highlight; a second case creeps across a boundary in sub-pixel steps. The demo
keeps its gradient definition in the page rather than in the popup all the same, which is where a definition
shared by every wedge belongs.

### A nested band's wedge is never narrower than the label it will hold

A submenu band sizes each of its wedges from `wedgeArc`, a chord measured at the label radius, because a
nested level is meant to be only as wide as its own items need rather than sharing out a whole turn. The
label box drawn inside that wedge is sized separately, capped at `bandWidth * labelMaxWidthRatio`. Nothing
tied the two together, so the two numbers could disagree — and at the defaults they happen to agree exactly
(`wedgeArc` and `bandWidth` are both `25`, the cap ratio is `1`), which is what kept it hidden.

`WheelMenu`'s demo widens `bandWidth` to `84` and leaves `wedgeArc` at its default. The label cap follows
`bandWidth` up to 84 while the wedge stays at a chord of 25, so every nested wedge was about a fifth of the
width of the label it was drawing — a sliver a dozen pixels across with "From template" laid over it and over
its neighbors. The root ring was untouched because its wedge angle comes from dividing the spread among its
items, not from `wedgeArc`.

**So a nested wedge's chord is the larger of `wedgeArc` and the label's own cap.** The layout can no longer
promise a label box wider than the wedge it sits in. `wedgeArc` keeps its meaning as the width a nested wedge
asks for, and now reads as a floor rather than an absolute; at the defaults the two are equal and nothing
moves, so the change only reaches the consumers where the pair had drifted apart.

This is narrower than the recorded fault about a placed item's box being guessed rather than measured. That
one is about content the layout never sees; this was the layout disagreeing with itself about a number it had
already worked out.

### The wedge gap holds its width rather than its angle as the bands go out

`wedgeGapDegrees` is an angle, so the arc it eats grows with the radius it is taken at. On the root ring a
gap of three degrees is a hairline; on the third band out, at nearly three times the radius, the same three
degrees is nearly three times the gap, and a stack of concentric levels reads as if the outer ones were
spaced by a different number.

**The gap is now scaled by the ring's own label radius against the root's**, so every level's gap is the
same width across the band whatever radius it sits at. The root's label radius comes from the defs the
factory already has — `holeRadius + bandWidth * labelRadiusRatio` — so the root's own gap works out to
exactly `wedgeGapDegrees` and needs no special case; the scaling collapses to one at the level it is
measured from.

The knob keeps its name and its units. It states the gap in degrees at the ring the wheel starts from, which
is the one a consumer is looking at when they tune it, and every band beyond it matches what they saw.

### The arc never closes, so the seam and the anchoring both stop jumping

An open run puts an item on each end, so `N` items make `N - 1` gaps; a closed loop makes `N`. The arc used
to hold both and swap between them the moment the spread reached a whole turn, which moved two things at
once — the spacing, because the gap count changed, and the whole arrangement's rotation, because an open run
is centered on the facing direction while a closed one puts its first item there. Six items over 350° left
five gaps of 70° and a 10° seam; a nudge to 360 made every gap 60° and turned the ring by half a step. The
user described the second half as going from an upright hexagon to a sideways one.

**The arc has no closed case now.** Its spread is clamped to `360 * (N - 1) / N`, the widest run whose own
gaps already measure a full turn divided by `N`, and the run is centered on the facing direction at every
spread. Past the cap nothing changes at all: with six items, 300°, 350°, 360° and 450° all place the same
six points. A full ring is still reachable — at the cap the seam equals every other gap, which is what a
ring is — it simply cannot be asked for as `360` and land somewhere different.

The user's call, and they asked for the clamp to sit in the layout rather than in the knob: the range on
`spreadDegrees` is unchanged, because a def can reach `createArc` from a consumer who never sees a knob. A
spread of 450 used to walk 450° of curve and lay the last items back across the first. The cap depends on the
item count, known only when the layout is called rather than when it is built, so it lives inside the
returned function.

**The two demos that asked for a whole turn carry a facing offset to hold their old rotation.** `Sortable`'s
ring of four faces `45` and `Toolbar`'s palette of nine faces `70`, each being the old `-90` turned by half a
step, so both land on exactly the points they did when the closed branch placed them. Dropping those two
values gives the rotated version rather than a broken one; they are there to keep tuned demos where they were
put.

### The ring starts from the same place at every spread, a whole turn included

The band had a second rule for a whole turn: below one, the run was laid symmetrically about straight up;
at exactly one, the first wedge was centered there instead. Nothing else jumped — the wedge width and the
hole both close smoothly, 55.33° and 13° at 350, 56.98° and 3.1° at 359.9 — but the arrangement turned by
half a wedge at the last degree of the knob.

**There is one rule now: the run is centered on the reference at every spread.** The user's, put as "why
don't we simply always start positioning from X regardless of the full angle being 60, 360 or
366000000000". The whole-turn branch is gone, and the spread is clamped to a whole turn so a number past one
means one. Six items at 359.9 and at 360 place the same wedges.

**What it gives up is a wedge centered at twelve o'clock on a whole wheel.** Centering the run there puts a
wedge boundary at the top when the item count is even and a wedge middle when it is odd. That was the whole
reason for the branch, and a consumer wanting the old look asks for it by turning the ring rather than by
falling into a different formula — the same answer the arc reached.

The arc's version of this is one entry along; both placers now anchor the same way.

### The cliff exposes one knob, because the other four broke it

Renamed from `cliffs` to `cliff` at the user's word, one arrangement being one cliff.

**A cliff is asymmetric and that asymmetry is the whole of it.** First place leads; second steps across and
half a step down; third steps back the other way and lower still. A first pass at making it tunable gave the
two lower places a mirrored, uniform step, which tiles hexagons beautifully and is not a cliff. The user's
correction, and the reason the shape is fixed again.

**A second pass exposed all five offsets as ratios and most of them broke the layout**, which is the point:
the item is a fixed half the box, so the shifts can only span one item width before a cliff runs out of the
room it is drawn in, and nothing stopped a knob asking for more. The four that place the three items are
module constants once more — `CLIFF_SHIFT_RATIOS` and `CLIFF_DROP_RATIOS`, stated in item sizes rather than
in the quarters they used to be — and `cliffStepRatio`, the step from one leader to the next, is the only
def. It is the one that cannot break anything: a cliff grows downward and `toFittedLayout` measures the
height afterwards.

The old `1.75`-quarter base constant is gone, though. It was the centering, worked out once by hand; the
leader is now placed from the shift ratios so a cliff sits centered in its box, which comes out at exactly the
same `0.4375`.

**Hexagons still overlap and that is where it rests.** Tiling them wants second across by half and third back
by a whole one — a span of one and a half item widths, past what the fixed item size allows. Making it fit
means the item taking its size from the ratios the way the zigzag does, which changes how large every cliff
draws. Not built, and not asked for.

### The honeycomb's unit is a cell, and a whorl clears the whorl above it

Two more of the same, on the arrangements the arc and the band had left behind.

**The honeycomb's cell was a length and did nothing on its own.** The layout normalizes to its own box, so
`cellWidth` only ever mattered against `gap` — the painted cell is the box divided by the columns, whatever
number was written. The cell is the unit now, `cellWidth` is gone, and `gap` is `gapRatio`, a share of a
cell. The user's: _"cellWidth simply becomes total / col count"_.

**A whorl's step ignored the whorl's own height.** `whorlSpacing` was the distance from one whorl's top item
to the next whorl's top item, so it had to be larger than the drop of the two below it plus an item, and
nothing said so: below `itemSpacing + 2` the lower pair of one whorl sat on top of the next whorl's leader.
The defaults were already inside that — a drop of 1.75 and a step of 3.5, where 3.75 was the first value that
cleared. **`whorlSpacing` is now the gap between whorls**, measured from the bottom of one to the top of the
next, so zero means they touch exactly and nothing can overlap. The step is worked out from the whorl's own
height instead of being asserted. Its default changed with it, being a different quantity.

### The band's hole is a share of its radius, so nothing about it is a length

With the stacking gone the band is scale-free: its placements are fractions of its own box, so `holeRadius`
and `bandWidth` only ever mattered as a ratio to one another. Doubling both changed nothing on screen, which
is what made the pair read as pixels while behaving as a single number.

**They are one number now — `holeRatio`, the share of the radius the hole takes.** The band is whatever is
left, the outer edge is always the box, and every other size on the ring is already stated against one of
those two. The user's, from the same pass that moved the stacking out.

`WheelMenu` keeps the lengths, because a thing that stacks rings needs a scale for the stack: `holeRadius`,
`bandWidth` and `levelGap` are its props, it works out each level's `holeRatio` from them, and it reports
each level's true diameter as the layout's `extent` so `Menu` still sizes the levels against the root. That
override is why its `layoutDefs` no longer accepts `holeRatio`, `spreadDegrees` or `computeItemArcs` — it
sets all three per level, and a value passed in would have been discarded in silence.

**A wheel's first wedge is aimed at twelve o'clock only when it fills the turn.** A partial wheel centers its
run there instead, which is what a half wheel always did, and the aim uses the first wedge's real arc rather
than an even share — otherwise a wedge that asks for extra room drags the whole ring off north.

### The band places one ring and nothing else; the wheel owns its own stacking

The band had grown three jobs that were not placement. It worked out its own inner radius from the level
above (`parentExtent`, `levelGap`), it decided that a nested level should be only as wide as its items need
rather than sharing a spread, and it put one item in the hole (`hasCenterItem`, `centerRadius`). Every one of
them existed for `WheelMenu` and nothing else reached them.

**The user's call, and their argument is the whole of it: concentric rings are trivial arithmetic the
consumer already has.** Ring A's radius is 200, ring B's hole is 200 plus whatever gap the consumer wants.
An item in the middle is `index === 0 ? a circle : a wedge`. Neither needs the placer's help.

**So `createRing` takes an item count and answers with one ring.** It has no notion of depth, of a parent, or
of a root, and `path`, `parentExtent` and `parentPlacement` no longer reach it. What it gained instead is
`facingDegrees`, the same knob the arc has: where the run is centered. That one number replaced the aiming
branch, because aiming a submenu at its opener is just facing the opener's mid-angle.

`wedgeArc` went with the nesting. It only ever sized wedges on a level that was not the root, and there is no
such level now — a ring shares its spread among its items, and a consumer that wants a narrower band asks for
a narrower spread.

**`WheelMenu` picked all of it up**, which is a dozen lines: each level's hole is the root's plus depth times
band-plus-gap, each level's spread is what its items need at that radius via `AngleUtils.getChordAngle`, each
level's gap is scaled so the painted gap holds its width as the bands go out, and the closer is a box at the
origin appended after the wedges. It also aims its own root so the first wedge sits at twelve o'clock, which
the band used to do in a branch and is a wheel's business rather than a placer's.

**`levelGap` is a `WheelMenu` prop now**, not a band def, because only a thing that stacks rings needs one.

The label props went too, renamed rather than removed: `labelRadiusRatio`, `labelHeightRatio` and
`labelMaxWidthRatio` are `itemRadiusRatio`, `itemHeightRatio` and `itemMaxWidthRatio`. They were never about
labels — they place and size the box the consumer paints into — and the user said plainly that they could not
tell what they were for.

### A placed menu walks on all four arrows, so `Escape` steps out one band

The user's call: a ring has no left and no right, so the pair of arrows that opens and closes a level in a
straight menu should walk it instead. That leaves two functions needing keys, and 2.1.1 Keyboard is explicit
that authors choose which — "deviating from these conventions does not fail the normative requirement of this
success criterion" — but equally explicit that the functions have to stay reachable.

**Activation opens a band and `Escape` leaves one.** Opening was already `Enter` and `Space`, since a wedge
with children opens them when it is activated. Leaving was `ArrowLeft`, and is now `Escape`, which steps out a
single band and closes the wheel only from the root. Both are scoped to a laid-out menu, so no straight menu
changed: there `ArrowRight` and `ArrowLeft` still open and close, because there they mean something.

**`Escape` had to be stopped from reaching the dismisser, and `stopPropagation` was not enough**, because the
menu's handler and `Dismisser`'s listener are both on `document`. A level calls `stopImmediatePropagation` to
keep a dismissal to itself.

### Five more controls take a layout, and each one broke something different

The rest of `backlog.md` item 10's proving pass, run against `Stepper`, `Toolbar`, `Sortable` and `Tree` after
`Paginator`, `RadioGroup` and `Tabs`. The reason to keep going past the first was that each control was
expected to strain a different part of the abstract, and each did.

**A connector has to reach, which no amount of repositioning gives you.** `Stepper`'s run between two steps
was a bar between two flex siblings: it has no idea where either of its neighbors is, because in a row it
does not need to. A placed run is handed both placements and draws its own path, and
`PlacementUtils.getLinkPath` is the geometry — straight between two placements, or bent along the arc they
sit on when it is given the point they turn about. `BracketConnectorPaths` is the precedent for a connector
as a path string rather than as a box, and this is the same answer reached from the other end.

**A placed `li` stays a child of its `ol`, and becomes a layer rather than a box.** Wrapping it in the
abstract's div would put a generic element between an `ol` and its `li`s, which stops the list counting;
`display: contents` on the `li` would do the same in Chrome's tree. So each `li` is stretched over the whole
box with `pointer-events: none`, the step sits in a placement inside it, and the run to the next step is
drawn across it. That is `Menu`'s radio-group run pattern, and it is what makes a reaching connector possible
at all — the connector needs a surface as wide as the box, which a placed item is not.

**`Toolbar` is the one control where a layout removes a behavior instead of moving it.** Its whole substance
is the cut: it measures every action against the room it has and moves the tail into a menu. A layout sizes
the toolbar itself, so there is no room to run out of — a placed toolbar collapses nothing, its overflow menu
holds nothing, and its observers do not run. The 1-D arithmetic in `ToolbarUtils.computeCut` is not extended
to two dimensions; it is simply not asked.

**`Sortable` is what `PlacementUtils.pickIndex` was built for, and the first thing to call it.** A row decides
a drop by walking its items in order and comparing one coordinate against each midpoint. A ring has no such
coordinate — the item at twelve o'clock is neither before nor after the one at three — so a placed list asks
which placement is nearest instead. `toLayoutPoint` converts the pointer through the box's own rect, which is
also why the `Viewport` scale divides out: a ratio taken within one rect does not care what scale that rect
was measured at. The backlog recorded the picking as a tested generalization with nothing consuming it, waiting on
the flick; the flick is still unbuilt and this got there first.

**`Tree` is the only layout that needed to know more than how many items it is placing.** Where a node goes
depends on which node it hangs from, and no field in `PlacementLayoutDefs` could say so. `FlatRow` already
carried `parentIndex`, so the defs gained `itemParents` — one optional field, general to anything tree-shaped,
and enough for `createRadialTree` to work the depths out from the chain rather than being told them. The
rejected alternative was a per-item depth array, which is the same fact stated less generally: parents give
depths, depths do not give parents.

**Windowing and a layout cannot both be in force.** A window mounts a run of rows and moves them down a
column; a layout places every visible node wherever it likes. `Tree` turns virtualization off when it is given
a layout, so a placed tree renders all of its open nodes. This is a boundary rather than a fault — there is no
run to window — and it is recorded in `backlog.md` as an accepted limit.

**Both pairs of arrows walk a placed control, and that is now the fourth control to reach it.** `Menu`,
`Tabs`, `Toolbar` and `Sortable` all fall back to "both" when they are laid out, because none of them runs
along an axis any more. `Tabs` is the exception and deliberately so: it keeps `dir` as the axis because
`aria-orientation` has to say something and the consumer is the one who knows whether their arrangement reads
as a row or a column.

**A placement carries the shape it occupies, and that came out of the honeycomb rather than out of a wedge.**
A hexagon drawn inside a rectangular box leaves its corners live, and two interlocking rows of them overlap in
exactly those corners — so a press in a notch activated whichever cell came later in the document. The
painter cannot fix it, because the element that takes the press is the library's own button. `PlacementRect`
gained `clipPath`, and CSS Masking 1 settles what that buys: "pointer-events must not be dispatched on the
clipped-out (non-visible) regions of a shape". `TileBoard` had already concluded that the shape belongs on the
hit layer; this is the same rule arrived at from the opposite direction, and it stays geometry rather than
paint for the reason `getSectorPath` gives.

### A landing mark is placed like an item, and the gap between two placements is geometry

The user's, on seeing that a placed `Sortable` marked nothing: the two neighbors a card would land between
have borders, and the point midway between them is calculable however they are turned. So it is calculated,
in the abstract, and the answer is a `PlacementRect` — which means the mark is placed exactly the way an item
is and needs no second mechanism.

**`PlacementUtils.getGapPlacement` takes the placements and an index, not two rects.** The index is the one a
control already has — where the carried item would land — and the ends of the list are the reason the whole
list is the argument: before the first and after the last there is only one neighbor, so the gap is aimed by
the pair inside it and put on the far side of the outermost one. A list of one has no direction and gets
nothing back.

**It measures between the borders that face each other, which is not the midpoint of the two centers.** Those
are the same point only while the neighbors are the same size. A placement may also be turned, so the
distance from a center to its own border along a direction is a ray against a box in that box's own frame
rather than against the upright rectangle it would have been — and the length of the mark is the box's
shadow across the join, which for a diagonal join is neither of its two sides.

**The end of a run is found by carrying the run round its own curve, not along its last straight line.** The
first attempt aimed the last gap by reversing the join before it, which is right for a row and a quarter turn
out on a ring: the user found it by eye on the north-west gap of a ring of four, where the mark lay across
the six-to-nine join instead of across nine-to-twelve. Three consecutive placements say how a run is curving
and two say only which way it is heading, so the imagined neighbor past the end sits on the circle through
the last three, one turn further round; where those three are in a line the circle has no center and the
straight continuation is all there is, which is the row's answer falling out of the same arithmetic. Both
ends of a closed ring then describe the same gap, because on a ring they are the same place.

**Four gaps a quarter turn apart is what the spec checks, rather than each mark on its own.** One wrong
bearing among four looks plausible in isolation and is obvious the moment the set is compared, which is how
the fault reached the user rather than the suite. `sortable.spec.ts` walks the carried card round all four
and asserts the step between consecutive bearings; reverting the continuation to the straight line fails it.

**A placement is a center before it is a size, so what sits in one stays on that center whether or not it
fits.** The user's, on noticing that the item at the top of a ring and the item at the bottom did not share
a center. The boxes did — both were at `50cqw` — and what had moved was the card inside one of them: a card
whose content needs more room than the box it was given pulls the box's only track out with it, and an
`auto` track grows out of one side only. So the placed box pins its single track to itself and centers what
it holds, and holds that child to at least the box's own size so a painter that draws the whole box still
has one to draw. What does not fit is then squeezed rather than shifted, which is the honest failure: the
item stays on its point and the too-small box shows up as clipped content rather than as a crooked ring.

**The gap is the space, and how much of it to ink is the painter's.** The rect handed over is the whole gap,
turned so its own width runs along the join and its height lies across it; the library centers whatever the
painter draws inside that, rather than stretching it to fill. A painter that filled it drew a diamond the
size of the gap, which is what settled the split — the same line `getSectorPath` draws between a shape and
the paint on it.

**The turn is what a spec can read, because a row's mark never had one.** `sortable.spec.ts` drags a card
round the ring and checks that the box the library placed carries a real bearing rather than none, which
separates a placed mark from a repositioned bar without measuring where either of them is.

### A column fills its width, and how wide it is belongs to whatever holds it

**`createColumn` places items the full width of the box, as `createRow` does, and lost `itemWidthRatio`.** The user's
call, over shrinking the placed box to the span its items cover. On the Formation page a row met its box exactly while
a column left three quarters of it empty — every layout is written in shares of the box's width, so a column of items a
quarter of that width stood in the middle of a box four times wider, and the box could not shrink to it because the
items are measured against the box. Shrinking the box to the drawn span would have fixed every layout at once; it was
set aside for the narrower fix, which makes the column behave like the row and leaves a column's width to the CSS of
its container. The Tree page's leaning example, the only other caller, lost its 0.9 and now fills its box.

**The Formation page gives each arrangement its own starting width, with a knob to change it.** The user's call, for
the Playground only: row and arc 380, ring 320, honeycomb and whorl 300, cliff 260, zigzag 240, column 100 — each
picked so the arrangement reads at a sensible size, since a width that suits a row makes a zigzag nearly 900px tall.
Each arrangement remembers its own width while the page is open. **The field is remade when the arrangement changes**,
keyed on it, because a field that outlives the switch writes its last value into the newly picked arrangement.

### Each layout family is a module of its own, and `PlacementLayoutUtils` is the one that holds the names

The user's call, where two rules pulled opposite ways: one namespace per folder, and `code-pitfalls.md`'s "code
imported for behavior never imports a string-keyed table of variants". `FanMenu` and `WheelMenu` use the ring
alone, but importing `PlacementLayoutUtils` pulled in all eight families, eight ready-made layouts built the moment
the file loaded, and `toLayoutFn`'s lookup by name — about 1.8 KB gzipped a menu never ran. **So each family is
`Placement<Family>.utils.ts`** (`PlacementRingUtils.createRing` and so on), the helpers they share are plain exports
in `PlacementLayouts.internal.ts` so a bundler drops the unused ones, and `PlacementLayoutUtils` stays as the module
for code that holds a family's name at run time: it re-exports every factory, keeps the ready-made layouts and
`toLayoutFn`, and is what the Playground's pickers and `Formation`'s examples import. Measured with esbuild: the fan
menu went from 3.1 KB to 1.3 KB gzipped, the wheel menu from 3.6 KB to 1.8 KB. This folder is the exception to one
namespace per folder, and the tree-shaking rule is why.

`toRun` lays a column's cross axis centered and a row's where the caller put it, which is what makes `toFittedLayout`'s
height the run's own extent rather than the box's.
