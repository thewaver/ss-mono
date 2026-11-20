# Decisions: `Sunburst`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Sunburst`, `CirclePacking` and `Icicle`: Treemap's siblings, each following its D3 gallery example

Asked for by the user straight after `Treemap`, one at a time, with the same standing instruction: follow the
example (`@d3/zoomable-sunburst`, `@d3/zoomable-circle-packing`, `@d3/zoomable-icicle`) wherever it answers a
question. With `Treemap` they are the four zoomable hierarchies of D3's gallery, and the user called the set
complete there. What the examples fix is not restated here; the entries below are where the library had to decide.

**One tree shape, four types, one set of tree helpers.** Each component declares its own node type —
`SunburstNode`, `CirclePackingNode`, `IcicleNode` — because a type lives with the component that owns it, but all
four are `{ value, weight?, children? }`, so one consumer tree feeds any of them and the Playground draws the same
tree (the library's own source, from `LibraryTree.generated`) on all four pages. The weights, the path to a node and
the "has anything to zoom into" test are `TreemapUtils`' and the siblings call them rather than keeping copies:
_"Anything non-local is exported"_, and three copies of `computeWeights` would drift. The Playground's dependency
view therefore lists `Treemap` under each sibling's "Uses", which is true.

**Treemap animates with the Web Animations API; the siblings run their own frame loop.** Treemap's tiles are
rectangles whose start and end are known, which is what `element.animate` is for. An arc's path, a circle's
center and a cell's box all have to be recomputed from interpolated numbers on every frame — an arc is not a
shape the browser can interpolate between — so each sibling owns a progress signal driven by
`requestAnimationFrame` and every painted thing reads it. Each arms a timer for the zoom's length plus slack beside
the frame, the answer `Rotator` gave in `e2e/noAnimationFrames.spec.ts`: a zoom started in a tab that stops
painting still arrives, rather than freezing half-way with the leaving level still drawn. A zoom interrupted by
another starts from wherever the first had got to, which is what D3's tween on `d.current` does.

**A painter is handed geometry, not a drawn shape.** `renderArc` gets angles and radii and draws with
`SunburstUtils.computeArcPath`, which takes the gap between arcs and between rings as options because a gap is
paint; `renderCircle` gets a center and radius; `renderCell` gets a rectangle, as `Treemap`'s tiles do. The label
helper `computeLabelTransform` turns text along an arc and keeps the left half upright, which is the example's
`labelTransform` published so nobody re-derives it.

**`CirclePacking` draws its labels in their own layer, through an optional `renderLabel`.** SVG paints in
document order, so a branch's label drawn beside its circle was covered by every child circle drawn after it —
"Essentials" was barely readable on the first build. The example keeps its labels in a separate group above all
circles, and so does the component. The layer takes no pointer and is `aria-hidden`: the name a reader hears
comes from the circle, which in the Playground carries the example's hover `<title>`.

**Each way back out is the example's, and Escape is added everywhere.** `Sunburst`'s middle is the page's own
button inside a positioned box, not a slot: the wheel's `renderHub` was removed on exactly this argument (_"No
slot survives either"_ under the wheels), and the page works out the hole's size from `ringCount`.
`CirclePacking` keeps the example's rule that a press landing on nothing it can zoom into — a leaf, the circle in
view, the space around it — goes to the root; that press is on the component's own surface, not a control it
renders. `Icicle` keeps "press the cell in view to go up". Escape goes up one level in all four, because each
example's way out is a pointer gesture and 2.1.1 Keyboard needs another.

**`Icicle` takes a `focus` rather than a `branch`, because a leaf can be brought into view.** The
example zooms into any cell, and a leaf brought to the left at full height is how a sliver too thin to read gets
read. The other three zoom only into branches, so their signal keeps the name that says so.

**The keyboard walks follow each picture.** `Treemap`, `Sunburst` and `CirclePacking` walk the zoomable things
in view in one line — heaviest first, which in a sunburst is clockwise — with Home and End. `Icicle`'s cells sit in
columns, so its walk is two-axis, the way `Bracket`'s is: up and down within a column, left to the parent, right
to the topmost child, and every cell is a stop because every cell responds.

**What a screen reader is handed is the level in view.** Arcs, cells and circles that are only on screen
because a zoom is carrying them out are `aria-hidden` and take no pointer until they are gone; circles deeper than
the level in view are drawn but hidden, since reading two hundred nested circles out would say nothing.

**The circle packing is D3's, ported, with its seeded shuffle.** `CircleUtils.pack` in `ss-utils` is D3's
front-chain placement, `CircleUtils.enclose` its smallest-enclosing-circle search, and `computeLayout` its two-pass `pack`
with the padding re-scaled between passes; the shuffle inside uses the same fixed-seed generator, so a tree always
packs the same way and the unit tests can ask for repeatability. `CircleUtils.interpolateZoom` is van Wijk and Nuij's smooth
zoom as D3 draws it, which is why a zoom between distant circles pulls back before it travels. Nothing was added
as a dependency.

### `Icicle` and `Sunburst` keep their own span walks

The user's call, asked during the review (R88). Both `computeSpans` share out a node's span among its children in
proportion to weight, in about ten matching lines, but differ in the two places a merge would have to take as
arguments: the order children are laid out in (`Icicle` puts deeper subtrees first, then heavier; `Sunburst` orders
by weight alone) and the span each child gets (a column, or a ring). A shared walk taking both as callbacks would
read more abstractly than either copy, for two users. A fix to the share-out arithmetic is made in both.
