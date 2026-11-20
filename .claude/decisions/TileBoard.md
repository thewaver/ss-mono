# Decisions: `TileBoard`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `TileBoard`, ported from a React game, and the tiling table each shape needs

The second arrival from the user's own earlier codebase, after the four that became `Exotics`. It came in
through `external/` as `BoardTiles`, was named with the user, and is `Exotics/TileBoard`.

**It is an `Exotic`, placed there by the user.** It was first built as a `Fundamental` on the reading that
the four earlier arrivals hold no user-editable value and are not compositions of `Essentials`, and that a
board of `InteractionWrapper` tiles fails both. The user's reason overrides it and is about the folder's
purpose rather than its members: **a game board is not the kind of component a component library normally
ships.** That is a better test than the derived one, because it is about what a consumer expects to find,
and `Exotics` is where the things nobody expects already live. The derived rule stands for anything that is
plainly a control.

**The keyboard walk, the refusal and the roving tab stop are still a control's, and none of that moved.**
Where it sits says nothing about what it owes: `Calendar` is what it was written against, line for line.

#### Every built-in shape tiles, and the numbers are a table rather than a derivation

The first build read the row spacing off the shape's own corners — the topmost corner on its left edge,
divided by the height — and claimed no constant was needed. **That is true only for the shapes whose rows
interlock by a half-tile shift, and it was wrong to generalize from them.** `hexagon_flat_top` tiles through
the other axis entirely, with its rows half a tile apart and its columns one and a half tiles apart, and no
reading of the left edge produces that. Triangles do not tile by translation at all.

So `TILING_RATIOS` names, per `ShapeConst.DefaultShape`, the pitch as a fraction of the tile box and two
questions about how the rows and tiles sit:

| Shape                      | Pitch across | Pitch down | Offset rows | Turned-over tiles | Neighbors             |
| -------------------------- | ------------ | ---------- | ----------- | ----------------- | --------------------- |
| `square`                   | 1            | 1          | no          | `none`            | `orthogonal`          |
| `lozenge`                  | 1            | 1/2        | yes         | `none`            | `diagonal`            |
| `hexagon_pointy_top`       | 1            | 3/4        | yes         | `none`            | `diagonal_and_across` |
| `hexagon_flat_top`         | 1 1/2        | 1/2        | yes         | `none`            | `diagonal_and_down`   |
| `triangle_up` / `-down`    | 1/2          | 1          | no          | `top_to_bottom`   | `upright_triangle`    |
| `triangle_left` / `-right` | 1            | 1/2        | no          | `left_to_right`   | `sideways_triangle`   |

**Offset rows** shift every other row half a pitch across and give it one tile fewer, which is what puts it
in the notches; **turned-over tiles** mirror a tile when `row + col` is odd, which is what makes a triangle's
base meet a base rather than two half-bases. Both together never happen, and a square needs neither — it is
the one shape here that does not interlock at all.

**`tileFlip` names the direction rather than answering yes or no, because the sideways triangles turn over
through the other axis.** An upright triangle is mirrored top to bottom; a left- or right-pointing one is
mirrored left to right, and a boolean cannot say which. So `TileBoardTiling` carries
`tileFlip: "none" | "top_to_bottom" | "left_to_right"`, `getIsFlippedTile` asks whether it is anything but
`"none"`, and `getTilePoints` reads it to pick the axis it mirrors across.

**The sideways pair is the upright pair transposed, in every number.** Half a tile of overlap moves from
across to down, the strip that ran along a row now runs down a column, and the vertical edge that a
left-pointing tile shares with the right-pointing one beside it is what the upright pair share as a base.
Nothing else about the board knows the difference.

**The numbers are the shapes' own corner fractions, so they can go stale where a derivation could not.** The
unit tests read the corners back out of `getDefaultShapePoints` and compare, so a shape redrawn in `ss-utils`
turns the table red rather than quietly tiling with gaps. That is the honest cost of the table and the reason
it is worth naming here.

**Which is why the shape is a name again and `computeTilePoints` is gone.** A consumer cannot supply a
tiling for an arbitrary polygon without supplying the lattice as well, and two props that must agree is a
trap. `tiling` (once `tileShape`) defaults to `hexagon_pointy_top`, the board derives the points and the tiling from it, and
the points it worked out — turned over or not — are handed to `renderTile` in its render props, so the
painter never needs to know which shape it is drawing. `triangle_down` is not a second implementation: it is
the same tiling with the starting orientation inverted, which the unit tests pin by asserting a turned-over
`triangle_up` equals `triangle_down`'s own points. `triangle_left` and `triangle_right` stand in the same
relation to each other, with one wrinkle the test has to allow for: `getDefaultShapePoints` promises corners
clockwise **starting from the top**, and mirroring a right-pointing triangle lands its top corner in the
middle of the list rather than at the front. The corners are the same corners in the same order round the
contour, so the test rotates both lists to start at the topmost corner before comparing them.

**`hasShortFirstRow` inverts which rows are short.** Asked for by the user. It has no effect on a shape whose
rows are not offset; a triangle board that should start the other way round asks for `triangle_down` instead,
which is what the two names are for.

**A tile's neighbors are a sixth column in the table, because "the rows are offset" does not decide them.**
The first build read them off `hasOffsetRows`, which handed the same six-tile list to every offset shape, and
that is wrong for two of the three. A lozenge has four edges, so the tiles to its left and right — which the
six-tile list claimed — meet it at a single corner and nowhere else. A flat-top hexagon has six edges, but
its flat ones point up and down, and the tile they meet is **two rows away**, not one column across: rows two
apart sit at the same offset and the same column positions, so `hexagon_flat_top` is the one shape whose
neighbor steps are `row ± 2`. Both were reporting two tiles that touch nothing and, for the hexagon, missing
two that do.

Neither is derivable from the two questions already in the table, so `neighborhood` names the family
outright and `computeNeighbors` switches on it. The six families: `orthogonal` is a square's four;
`diagonal` is the lozenge's four; `diagonal_and_across` adds the two beside it, which is the pointy-top
hexagon; `diagonal_and_down` adds the two `row ± 2` away, which is the flat-top one; `upright_triangle` and
`sideways_triangle` are three each. Every list is clockwise from the top, filtered to what is on the board.

For a triangle, which three depends on the way the tile points, which is the shape name and the turn
together — so `triangle_right` unturned and `triangle_left` turned over answer the same list. For an upright
triangle the two beside it are always there and the vertical one depends; for a sideways one it is the two
above and below that are always there and the horizontal one that depends.

**A wrong neighbor list is the failure that never announces itself**, which is why this was checked by
measurement rather than by reading: for every shape, every tile of a seven-by-six board and both row
phasings, the tiles that genuinely share an edge were found by intersecting the actual polygons and compared
against what `getNeighborTiles` claims. That is what turned up the two faults above, and it now comes back
clean. The unit tests pin one central tile per family, which is the part worth keeping cheap. `getNeighborTiles` answers them clockwise from the top,
filtered to what is on the board. A consumer re-deriving this gets a plausible board with the wrong adjacency,
which is the failure that never announces itself.

#### The shape is worn by a hit layer, so the pointer follows the drawing and the paint is free

A tile is a rectangle in the DOM. A pointy-top hexagon's box overlaps the boxes around it by a quarter of
its height, a triangle's box overlaps its neighbor's by half its width — about a quarter of every hexagon
box is corner that belongs to a neighbor and is drawn by one. A press there has to reach the tile that is
drawn there, or the board's one promise, that these things interlock, is false to the pointer.

**The first build clipped the cell itself, and the user rejected it: content has to be able to hang out of
its tile, as it did in the original project.** A piece standing taller than the tile it occupies is the
ordinary case on a game board, and the clip cut its head off — along with any glow, and along with the
Playground's global `:focus-visible` ring. Their instruction settles it, and "clip the face and let the
consumer paint a second layer outside it" was not offered as a compromise, because the same board would then
own two renderers to answer one question.

**So the shape moved off the cell and onto a layer of its own.** A tile is three elements: the cell, which
carries `role="gridcell"`, the name, the tab stop and the click handler and is `pointer-events: none`; a
paint layer holding whatever `renderTile` returns, unclipped and overflowing freely; and a transparent hit
layer over both, `inset: 0`, `aria-hidden`, wearing the `polygon()` clip and the only thing in the tile that
is `pointer-events: all`. The rows, the cells and the root are all `pointer-events: none`, so a press
landing outside every hit layer falls through to the tile beneath rather than stopping on a box.

**A `pointer-events: none` element still sees what its descendants are pressed with**, which is the whole
reason the cell can stay the focusable element while the layer inside it takes the pointer. Checked in
Chromium rather than recalled: with a clipped `pointer-events: all` child as the hit target, the cell
receives `mouseover`, `mouseenter`, `mousedown`, `click` and `mouseleave` and takes focus, and a press in the
clipped-away corner hits nothing at all. That is the defined behavior — `pointer-events: none` stops an
element being a hit _target_; it does not stop events propagating through it — but it is load-bearing enough
here to be worth having watched happen.

**`Shape` would have taken the corners straight back, and that is what the descendant rule is for.**
`shapeRoot` carries `pointer-events: visiblePainted`, and a hit test in the empty corner walks past the
clipped-away hit layer and lands on it. `TileBoard.css.ts` therefore writes
`globalStyle(`${tileBoardTile} ${tileBoardPaint} *`, { pointerEvents: "none" })`. **The doubled ancestor is
specificity, not tidiness**: at one class it would tie with `shapeRoot`'s own rule and be settled by
stylesheet order, and at two it wins outright without an `!important` the property's type will not take.
The consequence to know: **nothing a consumer paints inside a tile can take the pointer**, so an interactive
control inside a tile is not a thing this board supports. The tile is the control.

**What the consumer clips is now the consumer's business, and the face is the case that shows it.** The
Playground's tile paints a CSS gradient, which without a clip is a rectangle behind a hexagon contour —
`PageTileBoardTile` passes `Shape`'s own `getClipPath` to it, which is what `ShapePage` already does. The
piece and the glow are outside that clip and hang over the row above.

**Unclipping the paint let a second focus ring through, and the box one is the wrong one.** With the clip
gone the Playground's global `:focus-visible` rule started painting a rectangle around the cell, beside the
stroke the painter draws on the shape — two rings for one focus. Which to keep is not a matter of taste:
**the cell's box is not the tile.** For a hexagon it is a tight bounding box and merely looks wrong; for a
triangle the box is twice the pitch, so the rectangle covers the focused triangle and half of each
neighbor, and an indicator that marks out three tiles is not identifying the focused one. The stroke
follows the polygon exactly and is what stays.

**And the ring it does draw only shows when it should.** The tile's stroke reads `isFocusVisible` rather
than `isFocused`, so a tile pressed with the pointer holds focus without advertising it and the next arrow
key brings the ring back. The flag was added for this and is the browser's own verdict; see
_"`isFocused` is focus and `isFocusVisible` is the ring"_ in `conventions.md`.

**The suppression is the Playground's, not the library's, and the reason is what a fallback is worth.** The
board draws no focus of its own — `renderTile` gets `isFocused` like every other painter here — so removing
the box outline inside `components/src` would take away the one indicator a consumer gets for free and make
an invisible focus ring the default. Instead `TileBoardContent.css.ts` scopes it out for the cells this
painter is inside: `[role="gridcell"]:has(<painter class>):focus-visible { outline: 0 none }`. **A consumer
with their own global focus rule will see the same double ring and wants the same one line** — and a board
of triangles wants it most, for the reason above. `tileBoard.spec.ts` pins that one ring is drawn and that
it is not the box's.

**Two things follow that a consumer should know.** The board's own box no longer bounds what it draws, so a
board packed against something else can overlap it. And paint order is row order, so a piece overhanging
_downwards_ is covered by the row below while one overhanging upwards is not — which is the right way round
for a piece standing on a tile, and is why nothing lifts a z-index to correct it.

**Rows are absolutely positioned and so is every cell, because a flex gap cannot go negative.** The first
build spaced the tiles with the row's own `gap`, which works while the pitch is at least a tile wide and
breaks for triangles, whose pitch is half a tile: the tiles have to overlap, and `gap` clamps at zero. A cell
positioned by `left: col x pitch` has no such floor, and the row keeps `role="row"` while carrying no size of
its own.

#### A piece that is not a tile's content: `getTileCenter`

The paint being free settles where a piece _may_ be drawn; it does not answer where to draw it. A game piece
usually belongs to the board rather than to a tile — it moves between tiles, it should animate while it moves,
and it should not be rebuilt because the tile under it re-rendered. That consumer renders it as a sibling of
the board and needs one thing from the library: **where is tile 2,3 on screen.**

`TileBoardUtils.getTileCenter(tile, layout)` answers it, and the `layout` a consumer needs is the same
`getLayout(shape, count, tileSize, hasShortFirstRow, taper)` they already build for `getNeighborTiles`. It carries
the short row's half-tile shift and steps by the **pitch** rather than the tile, which is what makes it right
for a flat-top hexagon at one and a half tiles across and a triangle at half a tile.

**The gap does not enter it, which is worth knowing rather than deriving twice.** A gap insets the row by half
and shrinks the tile by a whole, and the two cancel: the center of the tile's box is where it would be with no
gap at all. So a consumer positioning a piece never passes the gap, and a piece does not shuffle when the gap
changes.

**It is the middle of the tile's box, not the shape's centroid.** For a triangle those differ — a triangle's
weight sits a third of the way up from its base — and the box is the honest, predictable answer that a
consumer can offset from. Saying which one it is matters because both are defensible and only one is what the
function returns.

**The board opens its own stacking context, and that is what makes a layer above it possible at all.**
`InteractionWrapper` lifts a hovered tile to `z-index: 2` and a focused one to `1`, which is right inside the
board and wrong outside it: a piece drawn as the board's next sibling was painted **under** the tile it stood
on, and only under the one the pointer happened to be over, which reads as a piece that vanishes when you
touch it. `tileBoardRoot` carries `z-index: 0` on top of its `position: relative`, which opens a stacking
context, so those lifts order the tiles against each other and stop at the board's edge. The alternative —
telling the consumer to outrank a number the library chose — is asking them to know an internal, and it goes
stale the day the internal changes.

**It was written as `isolation: isolate` first, and that silently deleted the whole stylesheet.** The build
reported success, printed no warning, and emitted **none** of `TileBoard.css.ts` — not the property, the
file. Every rule in it vanished: the rows stopped being positioned, so the board collapsed into one column of
overlapping tiles, and the hit layer stopped taking the pointer, so the consumer's paint took presses again
and nothing could be clicked. Bisected by removing the one line and rebuilding, which brought all seven rules
back. `z-index: 0` opens the same stacking context and emits fine.

**Both Playground examples put their pieces on that layer**, one piece or several, and the piece stands on
the tile's middle rather than being centered on it: `translate(-50%, -100%)` puts its base on the point
`getTileCenter` returns, which is how a piece on a board is drawn. The board is unaware of any of it.

#### `taper` leans the board away, and the browser draws it through one matrix

Asked for by the user for the pieces: a meeple moved from a bottom row to a top row has to shrink, and the
board doing that arithmetic beats every consumer re-deriving it. **`taper` is the top edge's width as a
fraction of the bottom edge's**, the user's definition, defaulting to `1` for flat.

**The whole board is transformed as one sheet, the user's choice over two others.** Drawing each row a little
smaller than the one below breaks the tessellation — a narrower row of hexagons does not sit in the notches of
a wider one, and the mismatch grows towards the edges. Working out each tile's tapered contour in script
leaves the painted content a rectangle, which would then need a 3D transform per tile anyway. One transform on
the root keeps every tile meeting its neighbors exactly, and hit testing goes through it for free: the browser
inverts the matrix when it finds what a press landed on, so the clipped hit layers still decide, and
`tileBoard.spec.ts` presses the drawn middle of a top-row tile and a short-row tile to show it.

**It is a single `matrix3d`, not `perspective` plus `rotateX`, because the ratio already fixes the drawing.**
A tilt angle and a viewing distance are two numbers, but the taper only fixes one combination of them, and
the only thing the other changes is an extra uniform vertical squash of the whole board — the top row's height
relative to the bottom row's is always `taper²`, whatever the angle. So the ratio decides everything except
that squash, and the matrix is the version with none: the tallest drawing any lean produces, and one number in
the API rather than two that must be kept in step. The bottom edge stays exactly where it was and at full
size, every row is pulled towards the vertical middle line, and the board is drawn `taper` times its flat
height with its top at the top of its box.

**The root's box is the drawn size**, full width and `taper` times the height, so a tapered board reserves no
empty band above itself — unlike a component that turns under perspective, the drawing does not move, so the box can be exact. **The
transform sits on `tileBoardPlane`, a sizeless layer between the root and the rows, not on the root.** On the
root it bent the root's own box as well: the box the board reported to the page was that shorter box pushed
through the lean, 400 by 80 for a board drawn 600 by 240, so anything anchoring to the board or scrolling it
into view read the wrong rectangle. The plane is applied from its top left corner and the matrix is built for
the flat board's height, which is what maps the flat rows into the shorter box.

**Thin lines break up in the far rows, and no CSS switch changes it.** The browser paints the board flat at
full size and then squeezes the picture — to half its width and a quarter of its height at the top, for a
taper of `0.5` — so a 1px stroke there covers a fraction of a pixel and is sampled in and out, which draws it
dashed. `will-change: transform`, `backface-visibility: hidden` and `shape-rendering: geometricPrecision`
leave the pixels identical, and `transform-style: preserve-3d` changes a few without improving anything. What
does work, checked on an isolated page, is a line drawn thicker by as much as its row is squeezed. **The
user's call is to leave it**: the board does not hand painters a squeeze factor, and a consumer who wants solid
far rows draws thicker lines themselves — `getTileScale` is the horizontal squeeze and its square the vertical
one, if they want to match it. A flat board
gets no transform at all, so it is not pushed onto a compositor layer for an identity matrix.

**Everything a consumer places beside the board is answered as drawn.** `getTileCenter` and `getBoardSize`
include the taper; `getTileScale` is what a piece standing on a tile is multiplied by — `1` on the bottom
edge, the taper on the top one, following perspective in between, which is exactly how much the tile under it
is narrowed. `getDrawnPoint` and `getDrawnScale` answer the same for any point on the flat board, for a
piece that stands somewhere other than a tile's middle. **`getTaperTransform` and `getDrawnPoint` are two
writings of the same map**, one for the browser and one for script, so a unit test applies the matrix to
points by hand and compares — the two cannot drift apart silently.

**The taper is held between `0.01` and `1`.** At `0` the top edge collapses to a point and the bottom edge's
perspective divisor reaches zero, so the far side would be drawn at infinity; above `1` the top would be wider
than the box. Both are clamped in `getLayout`, so the component and a consumer's own layout agree.

**The Playground's meeple scales its width, and `width` joins `left` and `top` in its transition**, so a piece
changes size smoothly as it walks up or down the board rather than snapping at the end of the move. It keeps
`translate(-50%, -100%)`, whose percentages follow its own size, so its foot stays on the point it is given.

**The Playground's second example is the proof, and it is deliberately not a tile's content.** The piece is a
sibling of the board, positioned from `getTileCenter`, `pointer-events: none` so the tile beneath it is still
pressable, and it transitions between positions — which is exactly what a piece owned by a tile could not do,
since moving it would mean unmounting it from one tile and mounting it in another. `tileBoard.spec.ts`
measures the piece's middle against the tile's own measured middle rather than against a written coordinate.

#### A refused tile still takes focus, and `InteractionWrapper` had to learn how

The original's walk stepped in a straight line until it found a **selectable** tile and skipped everything
else; with no selectable list at all it also disabled every tile, so the keyboard could not move. On a board
where three tiles of fifty are legal moves, skipping means somebody reading with a screen reader can never
find out what shape the board is. So the arrows walk every tile, and a refused one is `aria-disabled`, takes
focus, and refuses `Enter`.

**That is the composite-widget case the disabled-mechanism convention had knowingly shut out**, and it has
now shown up, so it took the prop that entry said it would earn. See
_"Disabled is one mechanism for every control"_ in `conventions.md` for the widened predicate. Two things
were broken without it and both are pinned by the spec: a refused tile reported `isFocused: false` for ever,
so the painter drew no ring and focus landed somewhere invisible — a 2.4.7 failure the board introduced by
making refused tiles focusable — and, worse, `tabIndex` was forced to `-1` on every disabled element, so a
board whose roving tile happened to be refused **had no tab stop at all** and could not be entered from the
keyboard.

**The board asks for it only while the board itself is on**: `isFocusableWhenDisabled={() => !isDisabled}`.
A board disabled as a whole is skipped entirely, which is what a disabled composite should do.

#### The rest of the port

**Up and down keep the column rather than choosing a diagonal.** Six neighbors do not fit on four arrows.
Left and right walk the row; up and down go to the row above or below at the same column index, clamped into
it when that row is the shorter kind — which lands on the nearer of the two diagonals and zigzags with the
tiles, the same walk a plain grid does. Home and End are the ends of the row and Ctrl with either is the
first or last tile of the board, per the `grid` pattern. Nothing wraps and nothing carries between rows: a
board's left edge is an edge, not a route to the row above.

**A tile is an `Index2d`, so the axes name themselves.** The original addressed tiles as `{ x, y }` with `y`
counting rows, which is the pair _"a grid index names its space and its axis"_ exists to stop. There is one
ordering here and no sorting, so nothing is a `data*` or a `layout*`. `Index2d.toString` also gives the tile a
key — `ROW2_COL3` — which is what the refs map and the element ids use, so a board that changes size does not
shift a row of stale indices.

**Rows alternate full and short, and the first row is the full one by default.** The original made the
**even** rows short, so a board declared four columns wide opened with a row of three.

**Nothing of the game came with it.** The `external/` drop also carried that project's battle logic, boards,
creatures and journeys, as the reference for what `BoardTiles` depended on. What was needed was `Point2d`,
`Index2d`, `Size2d` and `MathUtils`, all of which are `ss-utils` already; the rest is a game and belongs in
one.

### `TileBoard`: reach and route are pure helpers on the neighbor table

**`getTilesWithin` and `getShortestRoute` walk `getNeighborTiles`, so they inherit its per-shape adjacency rather than restating it.** Both search outward one step at a time from the start tile, taking neighbors in their clockwise order, so the answer is the same every time for the same board. A tile the caller marks blocked is never entered, so nothing is reached through it. `getTilesWithin` leaves out the start tile, because a piece's own tile is not somewhere it can move to. `getShortestRoute` never checks the start against `computeIsBlocked`, since the piece already stands there, and answers `undefined` for a destination that is blocked, off the board or cut off.

### `TileBoard`: a sweep begins by leaving a tile, and the board hit-tests it itself

**`onTileSweep` turns sweeping on, and a sweep starts only when a press moves onto a second tile.** At that moment the starting tile is reported, then every tile entered after it, each once per press. A press that never leaves its tile is a click and goes to `onTileActivate`, and the click that ends a sweep is swallowed. So a consumer can give the two callbacks different meanings, a toggle and a paint, without any tile being acted on twice. Refused tiles are passed over without being reported.

**The board finds the tile under the pointer with `elementFromPoint` rather than listening on the tiles.** A touch press is implicitly captured by the hit layer it began on, so the other tiles never hear the finger arrive. Looking up the topmost element in a map of hit layers works the same for mouse, pen and touch, and goes through the taper's transform for free. Only the pointer that started the press is followed. A move with no buttons held ends the sweep, which covers a mouse released outside the window.

**While sweeping is on, the root carries `touch-action: none`, so a touch that lands on a tile sweeps instead of scrolling the page.** That was the owner's call. Pressing tiles one by one, or Enter from the keyboard, is the single-pointer route (2.5.7). For 2.5.2 Pointer Cancellation, the press going down does nothing on its own; tiles are acted on as the pointer moves, before release, which meets "No Down-Event" as written without being the release pattern the Understanding document prefers. A board that fills the screen cannot be scrolled by touching its tiles while sweeping is on.

### Triangles that share a box: the cut tilings on `TileBoard` and in the patterns

The user's observation: the triangles the library tiled with were only the two strips (`triangle_up` and
`triangle_left` and their mirrors), while cutting a square or a lozenge gives more. Sorted by what the board
looks like rather than by how it was cut, the cuts collapse to five arrangements: a lozenge cut across is the
upright strip, a lozenge cut down is the sideways strip, and a hexagon cut into six from its middle is one of those
two again, depending on which way up it is. Three are new: a square cut by one diagonal, a square cut by both, and
a lozenge cut both ways — which is squares cut by one diagonal whose lean alternates like a checkerboard. The only
new shapes they need are the four corner-cut triangles; a square cut by both diagonals is the four pointed
triangles at half size, all on one board.

**`tileShape` became `tiling`, the user's pick over two others.** A square cut in four puts four shapes on one
board, so no shape name can describe it, and `triangle_up` already meant the strip. Widening `tileShape` to accept
names that are not shapes, and adding a second `tiling` prop beside it, were the alternatives; the second is the
two-props-that-must-agree trap `computeTilePoints` was removed for. `TileBoardTilingKind` is every shape name but the
four corner-cut triangles, plus `triangle_ltr`, `triangle_rtl`, `square_quarters` and `lozenge_quarters`, and
`TILE_BOARD_TILINGS` lists them for a picker. A shape name keeps meaning what it meant.

**The halved boards are two, named for the way the cut runs: `triangle_ltr` from each box's top left corner down to
its bottom right, `triangle_rtl` from its top right corner down to its bottom left.** The user's names, read the way
a page is read, top down. The first build gave each of the four corner-cut triangles a board of its own: the two
sharing a diagonal drew the same board, so the second was made to start each row half a box late, which left a
missing triangle at both ends of every row and was rejected on sight. Two halves of a box cut one way are one
arrangement, so one name each. The corner-cut triangles stay built-in shapes, and appear on a board only as the
pieces of these two.

**The tile size is the box, and so is the count.** For a cut tiling `tileSize` is one uncut box and
`tileCount.colCount` counts boxes across, so a five-by-five board of any cut tiling covers the same five squares by
five that a `square` board does. The first build counted triangles, which put the two props in different units
on one board and let a row end on a part of a square; the user called it, and the patterns already counted the
same way. The pointed triangles are not affected: their `tileSize` is one triangle, so counting triangles keeps
their units agreeing.

**Each triangle is still addressed by its own column, so a row's columns run past the count.** Three boxes of
quarters is a row of twelve tiles, `getRowLength` and `getColumnCount` say so, and the grid announces twelve
columns. The pieces of a box sit side by side in one row rather than across rows, and that is a choice about
addressing rather than about the picture — for halves the two are interchangeable to look at. Rows were taken
because a grid is read row by row, which keeps a box's pieces next to each other in reading order, and the arrow
keys then walk them in that order: right steps through a box's pieces, down goes to the same piece of the box
below. Columns run left to right by where each piece sits: left quarter, top, bottom, right; a half-square's two
halves, left one first.

**A cut tiling is one more row of the same table, holding `pieces`.** Every entry in `TILING_RATIOS` now carries
the pieces one box is cut into — a whole tiling has one, the whole shape. A
second list of pieces is the checkerboard: which list a box uses alternates with `row + box`. The pitch of a cut
tiling is the box, nothing is offset and nothing is turned over, since each piece already names its own shape.

**Neighbors of a cut tile are found from the pieces rather than written into a table.** The whole tilings keep
their hand-written families, checked once by intersecting polygons. For the cut ones the check _is_ the answer:
each piece is cut out in whole-box units, where every corner lands on a half and compares exactly, and a piece
whose contour runs back along one of this tile's edges is a neighbor. They come back clockwise from the top by the
direction of the shared edge. A unit test walks every tile of every cut board and asks that each neighbor lists it
back, and that a tile clear of the edges has three.

**The gap is taken off every edge of a cut tile, its cuts included.** Shrinking the box by the gap, which is what a
whole tile does, would leave two halves of one box touching along their diagonal. So a cut tile's contour is moved
in by half the gap along each edge, and its box is whatever that leaves: the tiles of one board are no longer all
the same size, which is why `getTileGeometry` answers the offset, size and points per tile and the Solid board
places every tile from it. On a box edge the result is the same as shrinking the box, so the square and the
quartered square agree at their outside.

**A cut tile's middle is the average of its corners, not its box's middle.** `getTileCenter` promised the box's
middle, and for a half-square that point is on the cut, shared with the other half — a piece stood there belongs to
neither. Whole tiles keep the box's middle.

**The patterns cut their cells the same way, through four layouts named as the tilings are.** `triangle_ltr`,
`triangle_rtl`, `square_quarters` and `lozenge_quarters` give every triangle a cell index of its own, several to one cell,
and a layout carries `computeCellPiece` to say which triangle an index is. A sample asks
`SVGDefsUtils.getCellPiece` and draws that shape rather than choosing one by the index's parity, so the sample and
the layout cannot disagree. The tracked level is measured from each piece's own middle, through
`SVGDefsUtils.computeCellCenter`; measured from the cell's, the two halves of a cell would light as one. The
checkerboard layout asks for an even count both ways, or the tile would not repeat. Each arrangement has a timed
sample and a fading tracked one, `triangle_ltr`, `triangle_rtl`, `triangle_sq` and `triangle_lq`, in every framework. A sample draws each piece's
path once, from `SVGDefsUtils.getCellPieces`, and points every cell at its piece with a `use`, as the pointed
triangles do.
