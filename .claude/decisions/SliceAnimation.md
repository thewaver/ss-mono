# Decisions: `SliceAnimation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The animation sample collections: `fromZones`, and why a fifth circle is not worth adding

**Adding members to an existing family stops paying off, and the reason is structural rather than a matter of
taste.** A weight function is one number per cell that does not change while the animation runs, so any weight
that falls away smoothly from a point is a wipe, and there are only so many shapes a wipe can be — round,
square, diamond, banded, spiral. A keyframe sample is a function of one cell's own progress that ends with the
cell in place, so it is always an entrance. Two batches of new entries were built against the existing
collection and the user's verdict on most of them was that they look repetitive, which is the expected outcome
of adding a fifth circle rather than a failure of the individual samples. **What pays off instead is machinery
that recombines what is already there**: an operator over any weight, or a combinator over any two animations,
multiplies the collection without adding anything that looks like its neighbor. `shouldMakeUnique` and
`shouldNormalize` on `computeSliceWeights` are already this pattern, and `fromZones` is the first one on the
animation side. Ideas of that kind, graded but not built, are in `backlog.md` under **_Open discussion_**.

**The three ring metrics are diamond, circle and rectangle, and two of them were called the wrong thing.** What
separated the family that was called `circular`, the one called `quadratic`, and `radial` is only how a cell's
distance from the origin is measured: the `circular` family took the mean of the two axis distances, so its
rings are diamonds standing on a corner, and it is now `diamond` — the word this file already used when it
listed the shapes a wipe can be. `radial` takes the true straight-line distance, so its rings are the only
actual circles in the collection, and it gained the third form the other two had, `radial_convergent`, built
from `diamond_convergent`'s shape with the straight-line distance. `quadratic` took the larger of the two axis
distances, so its rings are squares — and that turned out to be one half of a pair rather than a family of its
own, which is the entry below.

**`frame` is one metric with three normalizations, and it absorbed both `quadratic` and the old
border-anchored `frame`.** The metric is the larger of the two axis distances, so its rings are nested
rectangles around the origin, and what differs is only what that distance is divided by. `frameFarthest`
divides by the larger of the two maximum distances, so the ring stays square and grows until it reaches the
farthest edge, overshooting the short axis on the way. `frameNearest` divides by the smaller, so the square
stops at the nearest edge. `frameStretched` divides each axis by its own maximum, so the ring is pulled to the
grid's own proportions and all four edges are reached at once. `quadratic` was the Farthest one all along, under
a name that described neither the shape nor the family.

**What `frameNearest` costs is worth knowing before it is judged, because the clamp hides it.** Everything
outside the square that fits inside the grid lands below zero and is clamped, so all of it starts at the same
moment: measured on a twenty-one by seven grid with a centered origin, forty-nine of a hundred and forty-seven
cells carry the ramp and the other ninety-eight arrive together. On a square grid it is identical to
`frameFarthest`. It is here because the user asked for the nearest-edge member by name, having been told first
what it does to a wide grid.

**What that cost, and why it was still the right trade.** The `frame` that existed before measured its rings
from the grid's border inward and ignored the origin entirely, which is a different idea rather than a second
normalization — a shared name with the origin-anchored metric would have hidden the larger difference. The
user chose the pair, so the border-anchored behavior is gone, and with it `frame`'s place in
`ORIGIN_FREE_WEIGHT_TYPES` and therefore on the Playground's Scanline page. Measured before removing it, all
three of its forms gave every line of a single column the same weight, so the Scanline page lost nothing it
could show.

**Each member keeps its own ring parity, which is what `Alternate` and `Convergent` turn on.** `isEvenRing`
answers "is this cell's square ring an even one", so `frameNearest` and `frameFarthest` use it unchanged;
`frameStretched`'s rings are stretched rectangles, so it asks the same question of its own metric —
`isEvenStretchedRing`, the parity of the rounded stretched distance. Using `isEvenRing` for all three would have
banded a wide grid's stretched entries across rings the ramp does not follow.

**Handedness is an axis of an existing family, not a family of its own.** `_sweepCw` and `_sweepCcw` were a
second implementation of the thing `radar` already does — one arm turning about the origin — and measured, with
the origin at a corner they and `radar_single` order the hundred and twenty-one cells identically to within a
rounding error, so nothing on the page could tell them apart. At a centered origin they do differ, but only in
which ray the arm starts from and which way it turns: `radar_single` starts at six o'clock and turns
counter-clockwise, `_sweepCw` starts at twelve and turns clockwise. Sweep also spaces the arm by true angle
where radar spaces it by how far round the square ring a cell sits, which is a few percent of one cell's start
time and not a difference anybody was going to see. So both sweeps went and the handedness they were carrying
became `radar_single_cw`, `radar_double_cw` and `radar_quad_cw`, which reaches Double and Quad as well — something
a one-armed sweep could never have done. The three existing radar entries keep their names and are the
counter-clockwise ones.

**A mirrored sample reflects its input rather than growing a parameter.** A clockwise entry is
`radar` called with the position reflected across the vertical line through the origin —
`getMirroredPos`, `x' = origin.x * 2 - pos.x`. The reflection leaves the distance the maths runs on untouched,
since `|origin.x - (2 * origin.x - x)|` is `|x - origin.x|`, and flips only which side each quadrant test lands
on, which is the whole of what handedness means here. So no branch went into the util, its arity did not grow
past a signature this file already calls readable only to its own callers, and the same one-line reflection reaches
`spiral` unchanged if a clockwise spiral is ever wanted.

**A quadrant pair names the two corners it grows from, which `Default` could not.** The entry that was called
`quadrantDefault` multiplied the two signed distances, so the product is negative in the two quadrants where the signs disagree
and those corners start first — the top-right and the bottom-left, which are the two ends of a rising diagonal.
It is therefore `quadrant_up`, and `quadrant_down` is the same expression with that product added instead of
subtracted, so it starts from the top-left and the bottom-right. The direction words are the ones the diagonal
band entries already use, so the pair reads off the same vocabulary rather than inventing `Mirrored`.

**The diagonal is a band direction, and it was the one thing the collection had none of.** Diagonals were not
absent so much as never straight: `diamond`'s rings are four diagonal segments meeting at corners, and
`checkered`'s two passes alternate on the parity of `dist.x + dist.y`, which is a diagonal parity. What nothing
produced was a band whose edge is a single 45° line — the thing `line_row` and `line_column` are, turned
half a right angle.

**One rotated coordinate pair covers every family that had a Row and a Column.** `getDiagonalDelta` returns
`down`, which is `|dx - dy|` and counts bands parallel to a line falling to the right, and `up`, which is
`|dx + dy|` and counts bands parallel to one rising to the right. That is all the new arithmetic there is,
because every one of these families is the same three ingredients: a band index, a position along the band,
and the parity of the band index. `line_row` is `(dist.y, dist.x, isEvenRow)`; `_lineDiagonalDown` is
`(down, up, isEven(down))`, and the Up member swaps the pair over. So `line` gained all three forms, `roll`
gained its two and `entwine` gained one each way, from two helpers and no new formula.

**Each direction gets its own maximum, worked out rather than bounded.** `maxDist.x + maxDist.y` is an upper
bound for both diagonals and is exact for neither: with the origin in a corner of an eleven by eleven grid the
down-diagonal only reaches ten, so that bound would have left half the weight range unused and the wipe would
finish halfway through its stagger. `getMaxDiagonalDistance` takes the larger of the two corner sums per
direction instead.

**Two of the four families degenerated on a diagonal basis, and the fix was to normalize along the band.** In
the rotated basis `down + up` is always even, so a cell's two diagonal distances always share a parity. `roll`
and `entwine` use the band index for nothing but its parity, so that parity was the parity of the coordinate
the ramp already ran on, and the weight collapsed into a function of one coordinate — a banded diagonal wipe.
For `roll` the collapse was exact: measured, `roll_diagonal_up` came out byte-identical to
`line_diagonal_down_alternate` on every grid and origin tried, and `roll_diagonal_down` to `line_diagonal_up_alternate`.

**What broke the collapse is dividing the position along a band by that band's own length.** Every row is as
long as every other, so `roll_row` can divide by the grid's width and nothing is lost; diagonal bands are all
different lengths, so dividing by the longest left short bands using a sliver of their range — and left the
band index out of the value, which is what allowed the collapse. `getMaxDiagonalDistanceInBand` answers how far
the along-band coordinate reaches inside one band, by intersecting the band with the grid and evaluating at the
two ends, which is exact because the distance along a band is convex. After it, no two diagonal entries are
equal on any grid or origin tried, and `roll` and `entwine` each vary within a band as well as across bands.
It reads off both signed bands at the same distance, because these families index a band by distance and treat
the two sides of the origin as one, exactly as `line_row` treats the rows above and below it.

**`zigzag` is the one family with no diagonal member, and the reason is a ratio it cannot change.** Its
along-band term is one part in `bandCount + 1` of the range whatever it is divided by, and a diagonal basis has
about twice as many bands as a row basis on a square grid — eleven against six on eleven by eleven. So the
diagonal snake deviated from a plain diagonal wipe by at most 0.091 where the row snake reaches 0.167, and
per-band normalization could not widen that, only let every band sweep its own length. The user looked and
deleted both entries: a snake that reads as a straight diagonal wipe is a fifth circle. `roll` and `entwine`
kept theirs, because for them the same normalization was the difference between a duplicate and a pattern.

**The origin moves a diagonal wipe only across its bands, which is the family's own behavior rather than a
gap.** `line_row` reads `dist.y` alone, so sliding the origin sideways changes nothing; a diagonal reads its own
band index alone, so sliding the origin along the band changes nothing — measured, `_lineDiagonalDown` is
identical at `center` and at `top_left`, both being on the same falling line.

**Ripple and the concentric families were deliberately left out of this.** The user axed ripple's row and
column entries in the same breath as asking for diagonals, on the grounds that ripple is for concentric
patterns; the same reasoning keeps a diagonal out of `radial`, `diamond` and the three `frame` members, whose
whole subject is a ring around a point.

**`oval` is not one of them, and reading it as one was a mistake made from its name.** `oval_row` is
`zigzag_row`'s even branch with the parity flip removed: rows are the bands, the ramp runs along each row from
the origin's column, and every row sweeps the same way. The frontier that gives it its name is curved because
the two terms compound, not because anything measures a radius. It is therefore a band family and does take a
diagonal member — the caution about rings never applied to it.

**Its diagonal member was built, measured and deleted, on `zigzag`'s ratio.** With a centered origin, `oval_row`
differs from `line_row` by up to 0.167 on eleven by eleven and 0.250 on twenty-one by seven, while the diagonal
member differed from `line_diagonal_down` by 0.091 and 0.071 — the second figure worse, because a wide grid has
few rows and many diagonal bands. That is the same 0.091 that had both `zigzagDiagonal` entries deleted, so
`oval` and `zigzag` are the two band families with no diagonal, for one reason rather than two.

**A sequence starts at the origin, which is the whole of what an origin can mean to an ordering.** `sequence_morton`
and `sequenceStride` were indexed on absolute grid coordinates, so the Origin control did nothing for them.
Morton now interleaves the bits of the distance from the origin rather than of the position, so the Z-curve
grows out of the origin — and at an origin of `{ x: 0, y: 0 }` the distance is the position, so it reproduces
exactly what it used to do. Stride rotates its walk so the origin's own cell is the one that arrives first.
Both consequences are worth stating: they leave `ORIGIN_FREE_WEIGHT_TYPES`, and with it the Playground's
Scanline page, whose list is exactly that array; and the user had already said they do not look good on a
scanline, so the removal went with their leaning rather than against it. Putting them back on that page means
the page naming them, not the array.

**Stride's axis is which way the flat index runs, not how long the step is.** `sequence_stride_row` counts the
index along rows and `sequence_stride_column` along columns, which is the `line_row`/`line_column` pair applied to
an ordering. The step itself stays the golden-ratio one, stepped down until it shares no factor with the total
so that the walk visits every cell exactly once — a shorter step was offered as a second axis and not taken,
so `stride` takes the total and the origin's index and owns the step.

**`random` is a group of two, because reseeding made a third one redundant.** `random_default` draws per cell
and `random_clustered` interpolates a hash over four-cell blocks, which is the only one that can give a smooth
blob. A flat hash of the cell's coordinates was built as well, and its only distinction from `random_default` was
that it repeated; once the user chose a pattern that never repeats, a freshly seeded flat hash is a slower
`Math.random()` giving a statistically identical picture, so it was dropped rather than kept as a duplicate.
`random_clustered` takes a seed, and the seed is drawn once per `computeSliceWeights` call: a cluster needs
neighboring cells to agree on it, and a never-repeating pattern cannot fix it at module load either. That is
the one piece of mutable state in the collection, it lives in `SliceAnimationWeightUtils` beside the hash, and
`FIXED_HASH_SEED` is there for the callers that want the opposite — `_computeHorizontalDropout` picks which
scanlines drop out and is called every frame, so a seed that moved would reshuffle the dropout mid-animation.

**Ripple is a cosine over a distance, and everything that varies is an argument.** The `ripple` util takes the
spread, the spread's maximum, the period in cells and a travel ratio, and each entry is that call with its own
distance measure. Eight were built to be looked at and four survived the first pass: straight bands along a row
or a column and rings on the square metric were all discarded, and the diamond metric was kept — so the family
is now two metrics, the straight-line distance and the diamond one, each with the same variants. The period
gives `Tight` at two cells and `Wide` at eight, and the travel ratio gives `Traveling`, which mixes the bands
with a falloff so the rings arrive in order outward instead of all at once — the difference between one wave
crossing the grid and a set of standing rings. `ripple_default` and `ripple_diamond_default` are the two the user
has kept, and the plain-distance entries carry no metric word in their names for the same reason the
counter-clockwise `radar` entries carry no handedness: the unmarked name is the one that was there first.

**A sample selector is sorted alphabetically, always.** The user's rule, given after a batch of new animations
sat unsorted at the end of the dropdown. It covers every list a Playground control reads from — the weight and
animation registries and the `SVGDefs` gradient and pattern registries, whose keys are what their dropdowns
show. Sorting is by the name with any review marker stripped, which is also how the Playground groups, so a
marked entry sits beside the family it belongs to rather than in a block of its own at one end. The registry
records are sorted the same way as the type arrays, so there is one order to maintain rather than two.

**Three lists are exempt, confirmed by the user, because their order carries meaning.** `ORIGIN_TYPES` walks
the center and then clockwise, `EASINGS` runs in the order CSS names them, and `ZONE_TYPES` groups by kind.
Alphabetising any of the three would scatter something a reader uses to find an entry, which is the opposite of
what the rule is for. The rule is about collections whose order is otherwise arbitrary.

**A directional family names its members after the direction each one travels or the edge it turns on, and its
quadrant entry reads that word off the zone.** `swing` pivots on an edge, so its members are `swing_top`,
`swing_bottom`, `swing_left` and `swing_right`, and `swingDefault` became `swing_top` once there was more than one.
`tumble`, `shoot`, `shake`, `drip` and `hop` are named for where the cell is heading, so they gained the missing
directions under `Up`, `Down`, `Left` and `Right`, and `dripDefault` became `drip_down` for the same reason
`swingDefault` had to go: a family of four with one member called Default cannot say which one it is. Their
quadrant entries dispatch outward — a cell above the origin travels up — which is the mapping `elastic_up` and
`pull_up` already had against the `top` zone.

**An entrance starts hidden, by opacity or by geometry, and `skew` was the one entry that did not.** A cell
animation runs from a weight-decided moment to the cell at rest, so at its first stop the cell must not be
visible — otherwise the whole grid shows the picture before anything animates, and the stagger is invisible.
Most entries satisfy this by scaling from nothing (`zoom_in`, the `pop` family, `pull`, `swarm`, `encircle`) and
the rest by opening at `opacity: 0` and reaching `100` a fifth of the way in. `skew_cw` and `skew_ccw` did
neither: they began at full size and full opacity with a 45 degree skew, so every cell was already there.
Checked at the same time, those two were the only entries in the collection that started visible.

**Where an entry can hide itself by geometry, that beats an opacity fade, and the user's reason is what it looks
like at full size.** A cell that fades in at its final dimensions reads as the shape appearing rather than
arriving — the eye is given a large rectangle that simply gains substance. So `skew` hides by scaling from
nothing instead, and the shear it unwinds went from 45 degrees to 75 to keep the entry recognizably a skew now
that a growing cell carries most of the movement. Transforms are written scale-last, so the shear is applied to
an already-scaled cell and a 75 degree lean on a nearly-zero-size cell stays local rather than smearing across
the grid. Opacity is still right where nothing about the geometry can hide the cell, which is what `cube`,
`flip` and `swing` do — they rotate in place at full size.

**A quadrant entry has an `Inverted` twin, which is the same zones pointing at the opposite members.** Where the
plain entry sends a cell outward — above the origin travels up — the inverted one sends it inward, so `top` takes
the Down member, `left` takes the Right one, and for the two diagonal families each quadrant and axis takes the
member diagonally opposite. Nothing new is animated: an `Inverted` entry is its twin's list with the members
swapped in pairs, which is why all thirteen came from one mapping. `pop` keeps `pop_center` as its fallback and
the rest keep `zoom_in`, exactly as their plain twins do.

**A pair that differs only in handedness or in axis can be mixed by a zone, and that is two entries rather than
a new animation.** `encircle`, `skew`, `swarm`, `spinUp` and `spinDown` each hold a clockwise and a
counter-clockwise member; `pull` and `flip` each hold a horizontal and a vertical one. Every one of those pairs
gained a `Rings` entry, which gives the even square rings the first member and the odd rings the second, and a
`Checkered` entry, which splits them by checkerboard parity instead. Both come free of new keyframes:
`even_rings` and `even_checkered_cells` were already in the zone vocabulary, and `fromZones` already dispatches on
it. This is the _"machinery that recombines what is already there"_ argument applied to the animation side a
second time, and the reason it pays is that neither member changes — what changes is which cell gets which.

**`fromZones` takes an ordered list and an explicit fallback**, not a record keyed by zone. Zones overlap by
design — `top` is every cell above the origin including the corners, and the four quadrants exclude the two
axes entirely — so first-match-wins is the only contract that stays predictable, and the order is part of what
a sample is saying. The fallback is required rather than defaulting to no animation: a cell that matched
nothing would otherwise sit fully visible and motionless while the rest of the grid assembles, which reads as
a defect rather than as a choice.

**A zone entry picks the family member of the same name, and where no such member exists the family does not
get a zone entry.** So the `top` zone takes `carousel_top`, `hinge_top`, `elastic_up` and `pull_up`, and the
top-left quadrant takes `pop_top_left` and `roll_up_left`. `spin` is the family deliberately left without one: its
four members are two directions times two handednesses rather than four positions, so any mapping onto
quadrants would be invented here rather than read off the names.

**A diagonal family needs the four axis zones as well as the four quadrants.** The quadrants leave out every
cell sharing a row or a column with the origin, which on an odd grid with a centered origin is a cross of
twenty-one cells out of a hundred and twenty-one — enough to look broken if they all fall through to the
fallback. `roll_quadrant` maps each axis to the quadrant member clockwise after it, and only the origin cell
itself reaches the fallback. A family with a center member — `pop` has `pop_center` — needs no axis entries,
because the fallback is already the right answer for the whole cross.

**Entries the user has not yet groomed carry a leading underscore.** Asked for so that a batch of new samples
can be found and judged against the existing collection in one pass; it is a review marker rather than a
naming convention, and it comes off when an entry is kept. The Playground's option grouping strips it before
grouping, so `_carouselQuadrant` sat inside the `carousel` group next to the four members it dispatches to
while it was under review, rather than in a group of its own — which is the comparison the prefix exists to
make possible. Nothing in the `CellAnimation` collections carries it now, and the `ScanlineAnimation` keyframe
builders groomed: `Dropout` and `Interlace` were kept and lost the underscore; `Wave`, `Roll` and `Skew` were dropped.

**`Skew` was dropped because a lean on a row of the picture cannot be seen.** A row is a few pixels tall at the
Playground's line counts, and a lean moves a strip's top and bottom edges sideways by a fraction of its own height, so
20° at 3px a row moved the edges about half a pixel and the middle not at all. A version that leaned the whole picture
(each row sliding in proportion to its distance from the middle) was offered and not taken.

**On the `ScanlineAnimation` page, examples that apply a filter sit after the ones that apply a transform** — the
user's rule: `Brightness`, `Grayscale`, `Hue` and `Interlace` come last, before the stress test. `Dropout` slides rows
as it fades them, so it sits with the transforms.

### The animation pages give each example its own pause button and scrubber

The user's call, for `CellAnimation`, `ScanlineAnimation` and `RGBAnimation`: every example that shows one running
animation has a `PagePlaybackScrubber` under it, driving a play state and a progress that belong to that example
alone. **Only one example plays at a time** — the user's rule, on every page of the animation and particle families
with more than one: only the first plays when the page opens, and starting another pauses whichever was playing
(`PlaybackScrubberUtils.createGroup` in Solid and Svelte, `useGroup` in React and Vue; the scanline page's wrappers
take their state through `PlaybackGroup.context`). A page-wide play state survives only where something
still needs one, the stress tests, whose popup switches it. **Every example's component plays only while both its
own state and the page-wide one say so**, so opening the popup pauses everything behind it while each scrubber keeps
showing its own state; handing the example its own state alone had left the page-wide one switching nothing. Solid
and React join the two with `PlaybackScrubberUtils.gate`; Vue binds `isPagePlaying && playback` with its own update
listener, and Svelte a function binding of the same. RGBAnimation's stress test is one group, each tile one of the
page's examples at random at its starting settings, where ScanlineAnimation's splits transforms from filters.
**Two kinds of example take no controls**: `CellAnimation`'s Wipe, which exists only while it covers the whole
screen, and the stress tests, which run dozens at once. On a drawn source (`CellAnimation`'s gradient or pattern)
the colors inside the picture keep moving while the cells are paused, because they animate on the source's own
clock; a scrub moves the cells only.

### Slice animations: a component takes the recipe, and draws it on the graphics card when it can

Covers `CellAnimation`, `ScanlineAnimation`, `RGBAnimation`, `ParticleField`, `ParticleDissolve` and, in part,
`ParticleSpawner`; the shared machinery is `SliceAnimationUtils` and `SliceRendererUtils`.

**A component takes the sample, not an evaluator — the user's call, after the alternative was argued.**
`computeSliceAnimation` and `computeParticleAnimation` keep their names (every sample-taking prop in the library is
a `compute*`, as `computeEffect` and `computeLayout` are) but take a `SliceAnimationFn` itself, and `CellAnimation`
and `ScanlineAnimation` take `breakpointOpts`, `playbackOpts` and `origin` beside it and work each slice's window out
themselves (`SliceAnimationUtils.computeTiming`, `computeValues`). Before, every example assembled the window, the
playback and the origin into an evaluator of its own, and the library could see only a function. The rejected
alternative kept the evaluator and had a helper tag it with what it was built from; wrapping the helper's result in
an arrow, as every example did, would have silently dropped it to page elements. The argument that carried it: when
a slice's turn comes is the component's business, since it already holds the weights. `RGBAnimation` plays every
channel over the whole pass; a scanline or cell sample that wants the whole pass sets `smoothness: 1`.

**The scanline samples are tables, the same input the cell samples take** — the user's call, which leaves one row
(or one column) of cells as the only difference between the two components. They were hand-written functions given a
line's window and the timeline, several with randomness of their own; a line that needs a table of its own (Glitch's
shifts, Dropout's hashed lines, a phase per line) gets it from `fromSlices`. That is also what lets them reach the
graphics card.

**A sample exposes its tables by remembering what it was built from.** `fromStops`, `fromZones` and `fromSlices`
register their inputs in a module-level `WeakMap` keyed by the returned function; `getDefinition` reads it back and
`resolveStops` follows zones and per-slice stops down to one slice's table. `SliceAnimationUtils.resolveTables` asks
for every slice once per grid and keeps each distinct table once. A function written by hand has no definition, and
neither does any sample whose zones reach one, so `resolveTables` answers `undefined` and the component draws with
elements. `fromSlices` asks its function for each slice's stops once per grid and caches by the array returned, so
the function must return the same array for the same slice for as long as the sample is in use.

**The renderer, as built.** One WebGL 2 context on an `OffscreenCanvas` serves the page, since browsers keep only a
few contexts alive and the stress tests run 72 to 96 components. The tables go up as a small float texture, one row
per table plus a row for the easing curve, and the shader interpolates them per slice per frame, in three modes:
slices whose window comes from their weight, particles whose life comes from when they spawned, and particles whose
values JavaScript worked out (`ParticleSpawner`, whose path is a function).

**Every component's frame is drawn into one shared picture once per animation frame, and each piece is copied onto
its component's canvas** — the user's choice, after measuring. `item.draw` only takes note of the frame; one
`requestAnimationFrame` per frame draws every noted component into its own rectangle of the shared canvas (laid out in
rows, a second picture only if one would pass the graphics card's limit), takes it with one `transferToImageBitmap`,
and copies each rectangle with `drawImage` onto the component's own 2D canvas, which is sized to its piece. **The
cost is one frame**: a picture shows one animation frame after the progress it was drawn for, since the four
frameworks update the page at different moments and the renderer cannot know when the last component of a frame has
asked. **So a component places and sizes its canvas only when `draw`'s `onShown` reports the picture landed**, never
from what it just asked for: `ParticleSpawner`'s canvas follows its particles and moved a frame ahead of its picture,
which showed late and stretched, as particles jumping.
**The pieces are not cut out with `createImageBitmap` into `bitmaprenderer` canvases**, which the renderer did before.
A plain cut shows Firefox the whole uncut picture, squeezed into the canvas (asking `createImageBitmap` for the cut's
own size forces a real copy and fixes it), and Safari on an M3 Pro ran 72 cells at 8 frames a second that way. Copying
with `drawImage` took Safari, Chrome and Firefox on the M3, and Chrome and Edge on the Radeon, to their screens' refresh
rate; Firefox on Windows runs it at 54 to 65 in a clean profile, and half that in the user's own, which an extension
or a changed setting slows (Troubleshoot Mode recovers it). **Copying straight from the WebGL canvas, skipping
`transferToImageBitmap`, stalls Firefox below one frame a second**, and padding small canvases to Firefox's 128-pixel
acceleration threshold changed nothing. Firefox's cost is that `transferToImageBitmap` reads the shared picture back
from the graphics card (its WebGL runs in another process) — half of every frame in a profile. Showing each piece
through `-moz-element` instead, to skip the read-back, failed both ways: a canvas registered with `mozSetImageElement`
never repaints its pieces, and one placed on the page is read back again, below one frame a second.
**In Firefox a frame costs what the shared picture's area costs**: its snapshot is a synchronous `readPixels` of the whole
drawing buffer plus a byte swap and flip on the CPU (`ClientWebGLContext::BackBufferSnapshot`), so every pixel of the
shared picture is paid for, drawn into or not, and every pixel a canvas reaches past its box too. Chrome's copy stays on
the graphics card and costs nothing. Hence the shared picture fits each frame rather than only growing, and canvases
reach no further than they must (below). **Routes measured and not taken:** `readPixels` of only the drawn part, and
`readPixels` into a pixel buffer collected a frame later, gained little over fitting the picture, and would make Chrome
copy too; one WebGL canvas per component is Firefox-only (Chrome, Edge and Safari keep 16 contexts a page, and drop the
oldest past that); WebGPU drawing straight into each component's canvas removes the copy but Firefox charges for
presenting each WebGPU canvas, so 72 of them ran slower than the shared picture; antialiasing off saves little and
changes edges.
**The shared picture grows at once to what a frame needs plus `ATLAS_HEADROOM`, and shrinks only after it has been
larger than that for `ATLAS_SHRINK_FRAMES` frames in a row**, to the largest size those frames needed. Both values
are the user's, chosen after measuring the spawner stress test in Chrome and Firefox at the same page size and
density. The headroom is a share of the picture rather than a fixed step because a fixed step is a large share of a
small picture and a negligible one of a large picture. Its size came from replaying a recording of the spawner
page's ordinary examples: Firefox's resizes stop falling at 1%, and every point above that only adds pixels for it to
read back; Chrome's resizes keep falling with more headroom, but nothing showed that their rate at 1% costs it anything.
It is not a multiple of 5%, the usual rule for a ratio, because it was measured rather than guessed. The frame count is the user's 60: with 30, Chrome resized about twice a second and lost some of its average, and
Firefox no longer needs a short count because the cost gate below shrinks for it within a few frames.
**It also shrinks sooner once the extra pixels have cost `ATLAS_SHRINK_COST_MS` of read-back**, summed over the frames it
has been too large: each read-back is timed and the cost per pixel kept. Where the read-back costs nothing measurable
(Chrome, Edge) the sum never reaches it and the frame count decides; where it is paid (Firefox) the picture shrinks
within a few frames. So the rule follows what extra pixels cost on the page at hand rather than naming a browser. The
budget is the user's, chosen over 4 ms, which resized about every second frame and came out slower.
**Handing each component's picture over on its own was removed** — the user's call. It made the browser wait for the
graphics card at every handover, so 72 components ran about ten times slower in Chrome on an M3 Pro, and Firefox there
managed 22; Safari preferred it to the old cut-outs, but not to the copy above.
Its one advantage, about 1.6× on a Radeon RX 7900 XTX, was measured only in a Chromium drawing with its older engine;
Chrome with Skia Graphite and Edge show no such gap, so it is not to come back for that number. A handover per item
also needed the shared canvas sized to the largest item of the frame, every canvas that size, which the shared
picture never did.
**`uploadTexture` selects texture unit 0 itself before binding**: `render` leaves unit 1 active after uploading a
component's tables, so a picture texture made in the same render used to land on unit 1, replacing the tables, and that
one frame drew every slice at rest, the whole picture, before the animation's first frame.
**A frame's `tables` and `easing` are compared by identity**, and a new one is converted and uploaded again, so a
component passes the same array every frame — a constant where it has none (`ParticleSpawner`'s `NO_TABLES`): a fresh
`[]` per frame re-uploaded 72 times a frame in the spawner stress test.
**A canvas reaches past its box** by `computeArea`, which counts only what moves a slice past the box —
travel, growth, turning, nearness under perspective, blur — because a first, generous bound made the scanline
canvases six times their box and cost most of their frame rate. Travel reaches only the sides it heads towards, which
is safe because the shader adds travel after turning and a track never leaves its stops' range. **A spawner's area
starts each round from every place its particles head for, grows if one is carried further, and starts again once
none is left** (`ParticleSpawnerUtils.settleArea`, `growArea`; why it is settled is under the worker, below). Three
other sizings were built and measured, and none earned its place: following the particles frame by frame resized
canvases often enough to slow Chrome; one size per round, worked out ahead from every particle's path, and stepped sizes
over the round, also worked out ahead, both left Firefox no faster. **Firefox pays for the shared picture, not for a
component's canvas**: the picture holds every component drawing that frame and keeps its largest recent size, so a
smaller spawner canvas does not shrink what Firefox reads back. A sizing aimed at Firefox has to shrink the shared
picture. The formulas and the area step are Claude's guesses, checked only by the pictures matching. **The table texture's
limits throw** rather than draw something wrong. **Accepted as close enough**, all from the proof of concept: blur
is a pre-shrunk copy of the picture with softened edges rather than an exact blur; curved RGB effects are sampled at
33 points; multiply mixing over a see-through picture skips one term of the blend; the scanline samples Wave and
Interlace follow each line's own window rather than the whole pass, so they look different from their old
hand-written forms; and the picture is always sampled smoothly, where Chrome samples a moving 2D element jaggedly.

**When it falls back to elements, and the `renderer` prop.** Both renderers stay, the graphics card the default —
the user's call, "for now". A component draws with elements when asked to (`renderer: "elements"`), where there is no
WebGL 2 in an offscreen canvas (Safari before 17), when its sample has no tables, when the picture's server refuses
cross-origin permission, and while the browser has taken the context away. The picture is requested with
`crossOrigin = "anonymous"`, since the graphics card may not read a picture without it; a refusal gets a second,
plain request so the size is still known, and a warning names the address. A lost context is rebuilt when the
browser gives it back (`webglcontextlost` is prevented so that it can), and every component hears both through
`SliceRendererUtils.subscribe`. **An animated picture freezes on the graphics card**, and `renderer: "elements"` is
the way to keep it playing — the user's choice over detecting it and falling back silently, since detection is
missing from Safari. Where `ImageDecoder` exists, a picture whose address names a format that can hold frames is
fetched once and warned about if it has more than one; an SVG is not checked, since `ImageDecoder` cannot read one.

**A canvas sits where the elements sat** — the user's call. It is a child of the component's root, as the particle
and cell elements are, so it stacks and clips as they did: under a modal while the spawner is on the page, inside the
modal while the spawner is in it. One canvas over the whole page was ruled out for exactly that stacking. It reaches
as far as anything it draws travels, since particles leave their box on purpose (ash rising off a button, a spawner
reaching a target elsewhere): `ParticleField` and `ParticleDissolve` from their tables, `ParticleSpawner` from
where its round's particles head, growing in steps past that and starting again once none is left.

**Checking it.** `.claude/gpuCompare.md` compares the two renderers headlessly, picture for picture, and
`.claude/perfCompare.md` their frame rates in a real window. `e2e/graphicsCard.spec.ts` checks only which renderer
drew; the component specs read single slices off the elements, with WebGL taken away (`useElementRenderer`).

**Particles take a picture and a tint** — a tint rather than a color, because a picture is multiplied, not
recolored: a butterfly tinted red stays a butterfly. No size prop, the user's call: `ParticleField` and `ParticleDissolve` draw a
particle at its cell's size, `ParticleSpawner` at its picture's own size. A tint is multiplied into the picture; on
elements that is the picture as a background over the tint with `background-blend-mode: multiply`, cut to the
picture's shape with the same picture as a mask and the tint's alpha as an opacity. It differs from the graphics
card only on a soft edge, where the element comes out slightly lighter. `ParticleDissolve` tints each particle with
the color of the content it rose from, and a fully see-through tint where it found none. The spawner works its path
and its look out in JavaScript on either renderer, so the graphics card draws only its scale, turn, fade and travel
(`ParticleSpawnerUtils.toDirectValues`); a filter shows only on elements.

**The renderer runs on a worker thread where reading the shared picture back is slow, and makes fewer WebGL calls —
the user adopted both after they were measured on the M3 Pro** (Chrome 156 uncapped, Safari 27 and Firefox 155 at the
60 Hz cap, the Solid Playground's stress tests; the method and the stored tables are in `.claude/perfCompare.md`).
Before them, at 72 components: Chrome spent about 3 ms of main thread a frame and ran 300 frames a second uncapped (170
for the spawners); Safari held the refresh rate with a 2 ms frame tail (8 ms for the spawners); Firefox spent 9–15 ms
of main thread a frame, which dropped the blur cells to 47 frames a second and the spawners to 39. A Chrome trace put
its 3 ms at about half WebGL calls (17 uniform writes per component a frame, 1.2 ms of them) and half the main thread
blocked on the GPU process's command buffer; the Firefox time is the read-back of the shared picture
(`transferToImageBitmap`, about 3–4 ms per megapixel there, 0 in Chrome, about 0.2 in Safari).

- **The host and the executor.** `SliceRendererUtils` is split in two. The host, on the page's thread, keeps every
  calculation — pictures, tints, areas, instance and table data, the depth sort, the shared picture's layout and its
  grow and shrink rules — and packs one message a frame. The executor, `runExecutor`, owns the WebGL 2 context, the
  per-item buffers and textures and the item canvases, and does only what the message says. It runs either in-thread,
  called directly with the probe's canvas, or in a dedicated worker made from a Blob URL of its own source, with each
  item canvas handed over by `transferControlToOffscreen`. **So the executor must stay self-contained**: it references
  only its parameters and browser globals, everything else (shaders, the placement layout, the uniform block's
  offsets) arrives in `EXECUTOR_PARAMS`, and after `npm run build -w components` the function in
  `dist/Abstracts/SliceRenderer/SliceRenderer.utils.js` is checked to name nothing else. Nothing framework-side
  changed, since every framework reaches the renderer through `createItem`. Where `Worker` or
  `transferControlToOffscreen` is missing, or the worker throws or fails before it is ready, the host falls back to
  in-thread and replays what it had queued. A worker that throws after it is ready is terminated and the renderer
  counts as failed: it marks itself lost and notifies, and every component falls back to elements as on a lost context,
  for the rest of the page's life — in-thread is no longer possible, since the canvases already belong to the worker. A canvas handed to the worker can never be drawn into or read on the page
  again, which the Solid `Show` already tolerates by remounting the canvas on a renderer switch.
- **The thread is chosen once, by measuring the read-back**, so no browser is named: at the renderer's first use a
  1024 × 1024 probe context is read back once untimed (the first read-back carries a one-time cost — about 30 ms in
  headless Chromium against 5 for the rest), then enough times to cover `READ_BACK_PROBE_MEGAPIXELS` in one timed
  span, and the cost per megapixel is compared with `WORKER_READ_BACK_MS_PER_MEGAPIXEL`; above it, the worker.
  **The sample is summed because Safari's clock steps in whole milliseconds**: a single 1-megapixel read-back read 0,
  1 or 2 ms there for the same work, which sits on the threshold either way, while one span over four reads at most
  one tick too many, about 0.25 per megapixel. Expected readings: Chrome about 0, Safari about 0.2 (at most 0.5),
  Firefox 3–4. **Both constants, 4 megapixels and 1 ms per megapixel, are Claude's round guesses and the user's to
  tune.** The probe costs Firefox an estimated 15–20 ms once, at the renderer's first use (five read-backs at its 3–4 ms each). `getThread` and
  `getReadBackMsPerMegapixel` publish the choice and the reading; nothing overrides the choice, so a comparison forces
  a thread from outside (`.claude/gpuCompare.md`).
- **At most one frame is in flight.** While the worker is drawing, an animation frame sends nothing and marks a frame
  pending; the `shown` reply sends it at once with every component's latest frame, so a slow worker drops frames
  rather than queueing them. In-thread a frame is shown before `send` returns, so the rule never holds anything back.
- **Fewer WebGL calls.** Each item's values go into one std140 uniform block, written into the frame's placement data
  on the host and uploaded once a frame with `bindBufferRange` per item; instance buffers keep spare capacity and are
  written with `bufferSubData` instead of a fresh `bufferData`. The block's member offsets are checked against the
  driver's at context creation, and a mismatch throws, which falls back to elements.
- **The transferred buffers are pooled.** A frame's `placements`, `instances` and `tables` arrays travel to the worker
  as transferred buffers, so the host can no longer reuse them; the executor hands every one back in its `shown`
  reply, and the host takes the smallest pooled buffer that fits before allocating a new one, sized up to a power of two.
  In-thread the same buffers come back at once. Without the pool, garbage collection on the spawner stress test rose
  from 0.12 to 0.35 ms a frame.
- **`ParticleSpawner` settles its area for a round instead of following it.** Under a worker, a canvas whose box
  changes shows one stretched frame: the host sets the canvas's CSS box in one task and the worker resizes its bitmap in
  another, and the browser may paint between them. The other components' boxes never change while they play; the
  spawner's did, as its particles flew. So when the first particle of a round appears, the area starts from
  `ParticleSpawnerUtils.settleArea`: the spawner's own box and every target's and modifier marker's center, each
  padded by a particle's half-diagonal plus one `AREA_STEP_PX` block, snapped out to those blocks — the union of
  every place the round's particles head for, from the engine's `getPlacement`. `growArea` still grows it for a
  particle carried further (scaled up, pushed by a modifier), and it still starts again once no particle is left. **This
  is not the "one size per round" trial above**: that was worked out from every particle's path and was dropped
  because it left Firefox no faster; this one exists because a box that moves frame by frame cannot be kept in step
  across two threads, and it reads only boxes the engine already measured.
- **Measured.** Firefox takes the worker, and its main-thread frame tail falls from 9–27 ms to 0–4 ms; the spawners go
  from 39 to 60 frames a second and the blur cells from 47 to 60 (their pictures update about 40 times a second while
  the page runs at 60), and with the uniform block the fields on the worker went from 54 to 60. Chrome measures the
  read-back at 0 and stays in-thread; forced onto the worker it freed about 1 ms a frame at 60 Hz, with more garbage
  collection, which the pool answers. The uniform block moved Chrome's time to `bindTexture` and its frame rates by
  −2% to +5%: the cost there is whichever call waits on the GPU process, not the call count. Safari stays in-thread,
  and has to: its canvases owned by a worker update only 30–46 times a second however little the worker does; the
  uniform block and instance headroom took its spawner frame tail from 8 to 2 ms, since the spawner re-sends its
  instance data every frame. Pictures match the previous renderer exactly on all six stress pages.
- **Closed by measurement, in a standalone probe:** one WebGL context per component — Chrome and Safari keep 16 on the
  main thread and 4 in a worker, Firefox keeps all 72; cutting the shared picture into `bitmaprenderer` canvases with
  `createImageBitmap` in a worker — wrong pictures in Firefox, 130 ms a frame in Safari.

**A picture is kept on the graphics card only at the sizes drawn in the last frame** — the user's policy. The
renderer uploads one texture per picture per drawn pixel size, and used to keep every one for the page's life: an
animation that follows its container would add width × height × 4 bytes for each size it passed through, about
3.7 MB each at 1280 × 720 (worked out from the code; the Playground's animations take a fixed size, and measured 3
textures, 0.9 MB, through 40 window widths). Now, after each frame, every texture no component drew in that frame is
freed. **Why not "the latest size of each picture"**, which the user first picked: a picture's id is shared by every
component showing the same `src`, and the textures sit in one map for the whole renderer, so two components showing
one picture at two sizes would evict each other and re-upload it every frame. **The cost accepted**: a component that
misses a frame — scrolled out, paused — uploads its picture once more when it draws again. Loaded pictures and parsed
colors are untouched and still kept for the page's life.

**Neither a picture nor a component's drawn area is ever larger than the graphics card allows** (`maxTextureSize`).
A texture past the limit fails to upload and samples black, with no warning — a 1400-pixel-tall element at a pixel
ratio of 3 passes a phone's 4096. Both are scaled down to fit, keeping their shape, and the canvas stretches what is
drawn; the tables, which cannot be scaled, still throw past the limit, as before.

### The scanline page stays a gallery of effects

Collapsing the page's eleven registry-effect examples into one picture with an effect picker and a panel that
follows it was a backlog item the user had promoted from an aside, and the user dropped it once its cost was laid
out: the gallery is what lets two effects be compared side by side, each box's readout describes its own effect,
and the picker, the changing readout and where the knobs sit would all have needed designing. Do not propose it
again as cleanup.

### The 0..1 guarantee belongs to `computeSliceWeights`, not to each formula

Three formulas leave the range a weight is defined on, and always for the same reason: they are built for
whole-number distances, and a centered origin on an even count makes the farthest bound a half-integer. `spiral`
subtracts its raw result from 1 and divides, so a result below 1 lifts the weight above it. `radar` divides by
`maxWeight - 1`, and measured on an eight-by-eight grid with a centered origin `radar_single` reached -0.019,
`radar_double` -0.038 and `radar_quad` -0.083. `checkered_convergent` reached -0.071 on the same grid and -0.25 on
every cell of a two-by-two.

**So the clamp sits in `computeSliceWeights`, once, on the user's call.** It is the only place that knows a
weight is contractually a position on the timeline between 0 and 1, and per-formula clamps had already been
added twice while a third case sat unnoticed. The two that existed are gone, so no formula clamps its own
return any more, and a new sample cannot forget to.

**What the clamp deliberately does not do is re-derive the formulas.** Dividing `radar` by `maxWeight`, or
rounding `spiral`'s distances before it runs, would be the principled fix in each case and would move every
measured weight on every grid, including the ones nobody complained about — and measured values are the user's
call, not something to re-bless while closing a range violation. So the extremes stay shared where two cells
share them, and the tests pin the range across every deterministic entry on the grids that overshoot rather
than pinning the old out-of-range numbers.

### Particle and cell layers are contained, and never clipped

The user's call, for `ParticleField`, `ParticleSpawner`, `ParticleDissolve` (through its field), `CellAnimation` and so `ScanlineAnimation`: their particles or cells are born, moved and removed on every frame, and **`contain`** tells the browser that nothing inside affects layout outside, so each change is laid out and painted within the box rather than up the page.

- **The particle roots take `contain: size layout style`, never `paint`.** Paint containment clips descendants to the box (MDN, `contain`: "If a descendant overflows the containing element's bounds, then that descendant will be clipped"), and particles leave their box on purpose — ash rising off a button. Layout containment does not clip; per CSS Containment 2, §3.2, overflow of a box with `overflow: visible` "must be treated as ink overflow", so a particle drifting past the box is still drawn but no longer gives an ancestor a scrollbar. Size containment is free here: the roots are `width` and `height` `100%`, and their only children are absolutely positioned, which never sized them anyway.
- **`CellAnimation`'s container takes `contain: size layout style`, never `paint`, and no `overflow: hidden`**: cells are meant to fly in from outside the box (`tumble_left` and its siblings start there), so the container never clips them — the user's call.
- Layout containment also makes each root a stacking context, so a `z-index` a consumer gives a particle now orders it only among its siblings.
- **Measured headless on `ParticleDissolve`'s Card, it changed neither layout nor style time**, since the particles were already absolutely positioned. Kept as the user's call; a GPU window was not measured. **Particles do not get compositor layers of their own** — a later measurement counted seven layers on the whole page mid-dissolve at a 4 px cell size. What cost most there was a fade written as a filter, which the next entry is about.
