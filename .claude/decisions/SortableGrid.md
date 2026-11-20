# Decisions: `SortableGrid`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SortableGrid`: an inventory board, where the space left over is the game

Asked for by the user as an exotic in the shape of a game inventory — the pack in an action RPG, where a
sword is one cell by three, a shield two by two, and whether the next thing fits depends on the shape of what
is already in there. It sits in `Exotics` beside `TileBoard`, which is the other board that owns its own
geometry and hands the paint to the consumer.

**A footprint is a set of whole cells, and a rectangle is the shorthand for the common one.** `footprint` is
either a `{ width, height }` or a list of cell offsets, so an L, a Z and a T are all sayable and a plain box
stays two numbers. It is one field with two spellings rather than a box plus an optional mask, because the
two could then disagree about which cells an item holds and something would have to decide who wins. The
user set the bound: orthogonally adjacent squares, nothing finer — no points, no angles — which is what
keeps every calculation here integer. Everything downstream works on the expanded cell list, so fit is "are
all of these cells free" rather than a rectangle intersection, and an L can nest into another shape's notch.

**Turns are counted from nought to three rather than flagged, because clockwise and anticlockwise are only
the same thing for a rectangle.** Turn a 2×1 either way and it covers the same two cells; turn an L one way
and its foot goes left, the other way and it goes right. A boolean cannot say which, so the item carries
`turns` and a quarter turn sends every cell at (x, y) to (height − 1 − y, x), the counter-clockwise one to
(y, width − 1 − x). Four orientations also serve the rectangle case properly, since a consumer's artwork
has an up even when the cells do not. `Cuboid` already counts quarter turns for the same reason.

**The turn belongs to the aim rather than to the item until the drop commits.** The place is
`{ x, y, turns }`, so turning while carrying changes where the item would land and nothing else — `Escape`
puts back an item that was never turned, and a turn that leaves the footprint hanging off the edge is
clamped back in by the same code that clamps a movement. Turning the item itself and untangling it
afterwards was the alternative, and it has a cancel path that has to remember one more thing.

**Where you took hold of it is remembered, because an inventory that snapped to its own corner would be
unusable.** Grab a three-by-two pack by its bottom right cell and the footprint follows that cell. The grab
is a cell offset held in one module-level record alongside the zone it was taken from, not in the carry:
the zone that needs it is the one being _aimed at_, which may be a different grid from the one the item came
from, and a carry that did not begin in a grid at all — from a list, say — has no grab to speak of and takes
hold at the top left. Only one carry exists at a time, which is what makes a single module-level record
enough; the zone comparison is what stops a stale one being read after a list started the carry.

**Items are positioned by arithmetic, and only the empty cells are laid out by CSS grid.** The cell layer is
a real grid of `columns × rows` decorative divs; every item is placed absolutely at
`gap + cell × (cellSize + gap)`. Two reasons, and the second is the one that decided it. `InteractionWrapper`
renders the element that would have to carry `grid-column`, and it takes no style — so an item in the grid
flow would need a wrapper div of its own anyway. And the same arithmetic run backwards is how a pointer
becomes a cell, so a layout that came from somewhere else would mean two sources of truth for one geometry.
The pointer conversion divides the measured rect by the viewport scale, per _"a measured rect and a written
offset are in different spaces inside a `Viewport`"_.

**The cell size is a number of pixels the consumer states, not a fraction of anything.** Everything here is
arithmetic between cells and pixels — the item boxes, the landing box, the carried copy's size, the pointer's
cell — and a cell that sized itself to its container would turn every one of those into a measurement taken
after layout. An inventory has a fixed cell in every game that has one, so the constraint costs nothing that
was wanted.

**It is a list of items, not a grid of cells, as far as a screen reader is concerned.** The `grid` role wants
rows of cells that are mostly addressable and mostly full; this is a board that is mostly empty, whose
occupied regions span irregular rectangles, and where the only things worth reaching are the items. So the
root is `role="list"`, the items are `listitem`, and the cell layer is `aria-hidden`. **Each item's whole
accessible name comes from the consumer's required `computeItemAriaLabel(value, size, spot)`** — the user's call,
on WCAG 3.1.2: the component used to append the footprint and the coordinates in English (_"Kite Shield, 2 by 2,
column 2, row 1"_), read in English on a German page. A position on a board cannot be inferred from anything else
that is spoken, so the consumer is handed the size and the spot to say it in the page's language;
`computeItemLabel` stays the bare name the move announcements use. `aria-posinset` counts in
reading order, top row first and left to right within it, which is also what `Home` and `End` go to.

**The arrows walk to the nearest item in the direction pressed, not to the next one in the array.** Two items
on the same row are next to each other whatever order they were declared in, so `getNeighborIndex` scores
candidates by how far along the direction they are plus twice how far off to the side, and takes the lowest.
Array order is what a list uses because a list has only one axis; using it here would send the right arrow to
an item three rows down.

**The bug that survived the first build, because its symptom pointed at the wrong thing.** Turning an item
without also moving it did nothing at all, while turning and then moving worked — which reads as a broken
turn key. It was neither: `end` clears the carry state _before_ it asks the target whether the place may be
committed, and the check for what is already in the way excluded the carried item only while this zone was
the source of a live carry. With the carry gone, the item was compared against its own old footprint, so any
new footprint touching the old one — which turning in place always does — was refused for overlapping itself.
The filter now drops the carried key unconditionally, which is right at every moment: a grid being aimed
into from outside does not hold that item anyway, so there is nothing to exclude. Worth keeping as the
general shape: **anything the zone is asked after `end` has begun is being asked with no carry in flight.**

**A list and a grid exchange items, and that is the payment for generalizing the engine.** A
`SortableGridItem` is structurally a `SortableItem`, so a grid item dropped into a list is one; an item
arriving from a list carries no footprint and is given a single cell, which is the smallest honest thing to
say about something that has never had a size. Where it lands is the first free spot scanned row by row,
since a keyboard carry arriving by `Tab` has no pointer to take a position from.

**The carried copy, the landing box and the surface are all the consumer's paint.** The library positions a
box the size of the aimed footprint and hands over whether that place is allowed; `renderLanding` decides
what green and red look like, `renderCell` paints the empty board, and `renderCarried` is handed the item
exactly as `Sortable` hands it over. The Playground's own painters draw the landing as a dashed box, filled
in the theme's primary when it fits and its error color when it does not — color is not the only channel,
since the announcement says "no room" in the same breath.

**Turning is a command on a handle, and the component binds no gesture for it at all.** The user's call,
against the alternative of keeping a built-in key beside the handle. `onMount(controller)` carries
`turnCw`, `turnCcw` and `getIsCarrying`, which is the shape `Wheel`, `Typewriter` and `AudioSwitcher`
already use and the one `conventions.md` names — and it is the right side of the boundary recorded there,
since a turn is a command about a carry in flight rather than state anyone can read. What the consumer
binds it to is theirs: a button, the wheel, a right-click, a gamepad.

**The argument against was 2.1.1, and the user's answer is why it did not win.** A handle alone lets a
consumer build a grid that turns only by mouse. Their reading: that is the same kind of exposure as an
`ariaLabel` a consumer fills in badly — the library supplies the mechanism and cannot supply the judgement.
It holds better than the objection did, because the default costs nothing: a consumer who binds nothing has
a grid that never turns, which conforms perfectly well. The failure needs a consumer to add a pointer
gesture and stop there.

**What the consumer has to know, and the Playground shows it rather than saying it.** A carry claims `Tab`
while it is in flight, so nothing else on the page can be focused mid-carry — which means a turn button is
unreachable from the keyboard exactly when it is wanted, and a consumer who wants the keyboard route has to
bind a key of their own on the window. The examples bind `R` and `Shift` with `R`, and the wheel to the same
pair, with the buttons as the pointer route. Anyone copying that page copies a conforming control.

**A command that arrives as a call rather than as a key removed the special case a key had needed.** The
first build owned the key, which meant a held drag — deaf to the keyboard on purpose, so that an arrow
cannot fight the pointer for the aim — needed one key let through, listened for on the document because a
drag captures the pointer and the element that started it may not hold focus. None of that exists now: a
`turnCw()` mid-drag is a call, and the carry's deafness has nothing to say about it. `isTurnable` stays, and
is now the only gate: it is asked of the grid being aimed **into**, so a grid can accept items without
accepting turned ones.

**The command is refused unless this grid is the one the carry started in.** Every mounted grid hands out
its own controller, and a stray `turnCw()` on an uninvolved one would otherwise turn somebody else's carry.
So the guard is `getIsCarrying`, which is also what a consumer's button reads to know whether to be
disabled — `WheelController.getIsSpinnable` is the same idea.

**A painter is handed the geometry and picks its own way of drawing a shape.** The user asked for both
routes and the answer is one slot with both in it: `renderItem` receives the item, its flags, and a geometry
carrying the bounding size in cells, a pixel rectangle per occupied cell, and the contour of the whole shape
as a point list. A painter that wants tiles maps over the rectangles; one that wants a single continuous
piece uses the contour as an SVG polygon or a clip path. Neither has to know the cell size or the gap, which
is the arithmetic that would otherwise be copied into every consumer. The Playground draws both: most
examples use the contour, one uses the cells, and they are the same items either way.

**The contour bridges the gaps inside an item and stops short of them at its edges, which is the whole
difficulty.** Two cells of one item are one object, so the board's gap between them has to be filled; the
item's outer edge, though, has to stop where the cell stops or the shape is a gap too wide. So the walk is
done in cell units, where a shape is a union of unit squares and shared edges cancel, and only the finished
vertices are converted: a vertical edge running down is a right-hand boundary and lands at `u × pitch − gap`,
one running up is a left-hand boundary and lands at `u × pitch`, with the same rule on the other axis. That
is exact for every rectilinear shape and needs no polygon insetting. A footprint enclosing a hole yields its
outer boundary only, since a polygon cannot express a hole anyway — such a shape is one to paint by cells.
**An item answers for the cells it holds, not for the rectangle it is drawn inside.** Reported by the user
and it was a real defect: the item element spans the bounding box, so a press in an L's notch — inside the
box, no part of the L — picked the L up, and the board never saw the click. The fix is a transparent square
per occupied cell inside the item element, with the element itself set to `pointer-events: none` and the
squares opting back in. That is `interactionRoot`'s own arrangement, and it is `TileBoard`'s answer to the
same problem without needing `TileBoard`'s clip path: a polyomino is squares, so squares are enough.

**Two orderings are load-bearing there.** The hit squares are rendered **before** the consumer's paint, so a
consumer's own interactive child — which has to opt back into pointer events, as everything under an
`interactionRoot` does — sits above them and still takes its own press. And the notch now falls through to
the grid root, which is what makes a click in it a drop into that cell rather than nothing at all. Clipping
the item element to the contour was the alternative and was rejected: it would clip the consumer's paint as
well, so a glow, a badge or a shadow hanging past the shape would be cut off by a decision the library took
for a hit-testing reason.

**The geometry carries the largest solid rectangle inside the shape, because a shape with a notch has no
usable middle.** Reported by the user as an icon drawn off-center on a two-by-two: the painter had been
choosing the cell nearest the shape's center, which for an even rectangle is a corner and looks like a
mistake. `block` is the largest run of filled cells that is itself a rectangle, so a rectangle's block is the
whole of it and an L's is its long arm, and a painter centers on that. A bare center point was the simpler
answer and is wrong for a U, whose center of mass is in the hole; a rectangle is also more useful than a
point, since a label needs a width to sit in. Ties are broken by whichever candidate is nearest the shape's
center of mass, which is what puts a Z's block on its middle pair rather than on an end.

**The Playground's cell-by-cell example colors each item's squares by a hue derived from its key.** Also
the user's: drawn as bare squares, two items side by side read as one field of tiles. The contour example
did not need it because the shape's own edge says where an item ends, so this is the one thing the per-cell
route has to solve for itself — which is worth a demo showing it rather than a note saying it.

**A shape drawn into an SVG must be given a viewBox of its own proportions, and the Playground's was not.**
Reported by the user, who noticed it worst on a one-by-three and a one-by-four and — the part that made it
hard to name — not at all on the Z. The painter inset the viewBox by two units on every side so the stroke
would have room, which changes the ratio of the box, not just its size. An SVG whose viewBox is a different
shape from its element scales the drawing down uniformly to fit and centers what is left, so the contour
came out short of the cells it was supposed to cover: a 44 by 140 sword was given a 48 by 144 viewBox and
drawn at 91 per cent, while a 140 by 92 Z was given 144 by 96 and drawn at 96 — near enough to look right.
The room for the stroke was never needed, since the element is `overflow: visible` and the half that falls
outside is drawn anyway. So the viewBox is exactly the shape's own box and one user unit is one pixel.

**The spec for it asserts the painted shape covers its box, and nothing tighter.** `getBBox` was the obvious
call and is useless here: it reports the geometry before the viewBox is applied, so it would have gone on
passing throughout. `getBoundingClientRect` sees what was actually drawn. Only the lower bound is pinned,
because a stroke sits half outside the shape and how thick it is belongs to the painter.

### `SortableGrid`: a blocked spot is a wall, and a wall is not a place to aim at from the keyboard

**`computeIsSpotBlocked(spot)` marks cells nothing may occupy, and everything that asks what is taken asks it too.** The blocked cells join the taken list, so an item cannot land on a wall or overlap one, an item arriving from another grid by `Tab` is put clear of them, and the place label's `hasRoom` is false over one. `renderCell` is handed `getFlags()` with `isBlocked`, so the consumer draws the wall. The spot stays its own argument and the flag goes in an aggregate, per _"a grid index names its space and its axis"_ and _"one aggregated object per painter"_.

**The arrow keys step a carried item over walls; they do not step it over other items.** The owner's verdict was that the keyboard walk respects a blocked spot. The walk moves to the first spot in the direction pressed where the footprint touches no wall, and falls back to the plain one-cell step when there is none before the edge, so a shape that fits nowhere clear can still be moved. Items are deliberately left out. _"A place that cannot be committed is still a place you may aim at"_ was argued for items, whose positions change, and a wall is part of the board and never changes. The pointer is unchanged: it aims wherever it points, and the landing is painted refused over a wall. `SortableGridUtils.getSteppedSpot` is the pure half and is unit-tested.

### `SortableGrid`: `compact()` slides, it does not repack

**The owner's design: `compact()` on the controller, `false` when nothing moved, and holes are the default.** Called from `onTransfer` it keeps the grid packed after every move, which is what a dashboard does; called from a button it tidies up once.

**Each item slides straight up in its own column until the next row would collide, which is gravity, not bin-packing.** An item never jumps past a wall or another item, never moves sideways and never turns, so what the person arranged is still recognisably their arrangement. Fit is cell by cell, so a shape slides into another's notch. Items are taken top first, and the pass repeats until nothing moves, because an item can be held down by an interlocking one below it that moves later in the same pass.

**It fires no `onTransfer`, and it declines while a carry is going into or out of the grid.** The first is what makes calling it from `onTransfer` safe: the callback would otherwise call itself. The second keeps the aim and the landing from moving under a person mid-carry. By the time `onTransfer` runs, `CarrierUtils.end` has already cleared the carry, so the dashboard route is never declined. `getCompacted` returns unmoved items as the same objects, which is how the controller tells whether anything changed.

**The drop announcement names the spot dropped on, not the spot compaction slides the item to.** The library speaks no English of its own, so saying the final spot is the consumer's job in a compacting grid.
