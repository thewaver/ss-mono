# Decisions: `ImageMosaic`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ImageMosaic`: no smallest to aim at, so it is given a shape to aim at instead

**"Make the free side as small as possible" is degenerate once the component picks the sizes.** With fixed
elements the objective has an answer; with images it does not, because the smallest arrangement is always one
row with everything scaled down — sixty images across a 380px column is sixty slivers, technically minimal
and useless. So the preset needs a second thing to aim at, and three were weighed: a target thickness for a
row in pixels, a floor under how small an image may get, and a target shape for the finished mosaic. The
user took the shape.

**The target is a width and a height, not one number, and that is theirs.** `{ width: 16, height: 9 }` says
which way round it goes at the call site; a bare `1.78` does not, and the reader has to know whether the
library divides width by height or the other way. It defaults to `{ width: 1, height: 1 }`, so a consumer
who has no opinion gets something close to a square.

**The row count is not asked for and not guessed: it is scanned for.** Splitting the images into more rows
makes each row shorter and the mosaic taller, so the finished height rises with the row count. The scan runs
the count upward from one, stops at the first count whose mosaic overshoots the target height, and keeps
whichever of that count and the one before it lands nearer. Nothing is tuned and there is no window
constant to defend.

**Within a row count, the split is a dynamic program rather than a greedy fill.** For a candidate count the
target height divides into an ideal thickness per row, and the program picks the split minimizing the summed
squared deviation from it — the standard way a justified image wall is laid out. A greedy pass closing each
row as soon as it is full is cheaper and visibly worse: it pushes all the slack into the last row. The cost
is the honest one for a dynamic program, quadratic in the images per row count tried, so a mosaic of several
hundred images is doing real work on every resize.

**Rows run over the order given, and nothing is reordered.** The element preset reorders because reordering
is how a hole gets filled; here every row fills its side exactly by construction, so there is no waste to
reclaim and reordering would only shuffle the images for nothing. The reading order derived from the
geometry therefore comes back equal to the order passed in, which costs nothing and keeps the two presets on
one mechanism.

**The preset transposes the target shape, not the base.** The base swaps the axes so that one packer serves
both anchors, and a target shape stated by the consumer is in the consumer's axes — so with the height
anchored, a 16:9 target has to reach the packer as 9:16. `ImageMosaic` does that swap itself because it is
the only thing that knows the target exists; `computePlacements` stays "whatever the preset wants" and the
base stays a mechanism with no opinion about what is being packed.

**Every source carries a text alternative, because WCAG 1.1.1 Non-text Content is Level A.** A wall of
images with no alternatives fails outright, so the array is `{ src, alt }` rather than bare strings and a
deliberately decorative wall says so by passing an empty string. Not a house preference — the criterion
leaves no room, and it outranks any argument about how tidy `string[]` would have been.

**The measuring copy of an image is never mounted.** `new Image()` with a `src` fires `load` and reports
`naturalWidth` without ever being in the document, so the component learns every shape without owning
anything the consumer can see. The first build mounted a hidden `<img>` per source instead and concluded
from that that the consumer could never be given the element to render — a wrong conclusion, corrected by
the user, and the reason the render slot below exists at all.

**Which also means every source is fetched up front, and there is no lazy path.** The layout cannot start
until every shape is known, so deferring a file defers the whole arrangement rather than one tile. The
visible image and the measuring copy share a URL, so the browser serves the second from cache and only one
request leaves the machine. Attributes that split the cache — a `crossorigin` or a `referrerpolicy` a
consumer sets on their own markup — would cost a second fetch, which is the one case where the two copies
stop being free.

**An image that fails to load keeps a square box.** Dropping it would take its alternative text out of the
document along with it, so a reader who cannot see the wall would not be told the picture was ever there.
A square is the honest guess when the shape is unknowable.

**`renderItem` hands over the image, and the cell keeps the size.** Without it the component renders its own
`<img>` and the preset behaves as before. With it the consumer receives `renderImage` — the library's
element, built and ready to place — plus the item state, and returns whatever they want around it: an
anchor, a `<figure>` with a caption, a `<picture>` with a srcset. Same shape as `DatePicker`'s
`renderCalendar`, `TimePicker`'s `renderClock` and `Select`'s `renderOptions`: the library builds, the
consumer places.

**The size is forced by the cell being a one-cell grid, not by asking the consumer to honor a number.**
Publishing the computed size as a prop was weighed and dropped: it hands over a decision the component has
already taken, cannot revise and cannot verify, so a consumer who quietly ignores it gets overlapping tiles
that nothing detects. The cell carries the pixel width and height, `display: grid` puts every direct child
into the single cell, and a grid item is blockified — so a bare inline `<a>` becomes a full-size click
target with no CSS from the consumer at all, and several returned elements each fill the cell instead of
splitting it into rows. An explicit width or height on their element still beats the stretch, which is
deliberate: it is what lets `ElementMosaic`'s `max-content` measuring box keep its own size inside the same
wrapper, so one mechanism serves both presets.

**The cell does not clip, and that is the user's call.** `overflow: hidden` was proposed to stop a long
caption spilling across the gap and rejected on the case it forecloses — an image that grows on hover. What
happens to paint inside or outside the box is the consumer's half, the same line the library draws around
`Shape` and around the `Toasts` painter; the box's job is only to be the right size. The consequence worth
knowing is that a grown tile paints **under** the tiles after it, since later siblings win ties, and the
cell wrapper is deliberately not a stacking context — so `position: relative` plus a `z-index` on the
consumer's own element reaches past its neighbors and lifts it clear.
