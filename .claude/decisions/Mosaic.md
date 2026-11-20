# Decisions: `Mosaic`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Mosaic`: one side comes from the parent, the other is what the arrangement costs

Settled with the user across one conversation, from "a grid of sorts that occupies the minimum possible
size". The name is theirs, chosen from three sets — a mosaic is unequal pieces set into a rectangle with
grout between them, and the gap prop is the grout.

**"Minimum possible size" does not define itself, and the size anchor is what fixed that.** Minimum by area,
minimum against a target shape and minimum height for a given width are three different arrangements, and
the first two can come out wider than the parent and spill. `sizeAnchor: "width" | "height"` is
`CellAnimation`'s prop and its vocabulary: one side is taken from the parent, the other is whatever the
arrangement costs, and the objective is to make that second side as small as it goes. Nothing can overflow
the side that was given, and there is no number to tune.

**The two anchors are one algorithm and a transpose, not two.** Sizes go in swapped, placements come back
swapped, and everything between works in one space where the anchored axis is `x` and the free axis is `y`.
`MosaicUtils.transposeSize` and `transposePlacement` are the whole of it.

**The presets differ on exactly one thing: whether an item keeps its size or only its shape.** That is what
made two presets over an unexported base the right shape rather than one component with a mode — a mosaic of
fixed-size elements can never become a mosaic of rescaled images while it is mounted, so the choice is not a
runtime value. Same reasoning as `SpotlightHint` / `SpotlightPrompt` / `SpotlightGuide`, and as `Checkbox` /
`Toggle` / `Radio` over `BinarySwitch`. The base takes the packing function from the preset, which is why
`computePlacements` exists at all; `getIsItemSized` says whether the placement's width and height are written
to the DOM or only its position.

**The packer is a skyline, and the gap is baked into the cell rather than added afterwards.** Every item is
inflated by the gap on its right and bottom edges and packed into a container one gap wider than the real
one. Two neighbors then have exactly one gap between them and the outermost items sit flush against the
edges, with no special case for the first column or the last row. The placement written out is the inflated
cell minus the gap again.

**Items are packed tallest first, and that is what fills the holes.** A short item leaves room under it that
a plain row layout can never reclaim; the skyline records the free space and the next item that fits drops
into it. `elementMosaic.spec.ts` pins the invariant that says so — a tile's top edge is either the top of
the mosaic or exactly one gap below some other tile's bottom edge — because a packer that quietly fell back
to rows would still pass a no-overlap check.

**An item wider than the container overhangs rather than being shrunk.** Shrinking it is the other preset's
job, and silently distorting something the consumer gave a fixed size to is worse than showing that it does
not fit. It reserves the full container width, so nothing is placed beside it.

**The reading order is derived from the finished geometry, and the DOM is rendered in it.** The user's call,
over the safer option of forbidding hole-filling so that placement order and reading order agree by
construction — their reasoning was that a mosaic which leaves its holes open is not a mosaic. So the
arrangement is cut recursively: find a horizontal line no item straddles and the mosaic splits into bands;
within a band find a vertical line and it splits into columns; recurse, alternating. This is how reading
order is recovered from a scanned page. An arrangement that decomposes on neither axis falls back to sorting
by top edge then left edge.

**Which makes the accessibility answer the DOM itself, with no `tabindex` and no ARIA, unless the keyboard
walk is switched on** (_"the keyboard walk is opt-in"_ below). WCAG 1.3.2
Meaningful Sequence and 2.4.3 Focus Order are both Level A, and both are satisfied by putting the elements
in the order they read: Tab and a screen reader then follow the eye by construction. The property that
survives every arrangement, and the one the spec asserts, is that an item announced later never sits above
**and** to the left of one announced earlier — announcement may move right and it may move down, and it
never goes back.

**`<For>` runs over one stable slot per item, not over the placements.** A placement is a fresh object on
every pass, so `<For>` would key on nothing stable and rebuild every tile whenever the container resized. The
slots are keyed by the item's identity, for the reasons under _"tiles are keyed by identity"_ below, so a
reorder moves the existing nodes rather than rebuilding them. Moving a node does not keep its focus, though —
the browser drops focus from an element taken out of the document, even for the instant of a move — so focus
is noted before the reorder and put back after it, as that entry describes. The order memo compares element by
element so an unchanged order does not re-diff at all.

**`readingIndex` is on the item state because nothing else can work it out.** The consumer knows its own
array order and the component decides the announcement order, so a consumer staggering an animation along
the reading order has no other way to ask. Everything else on `MosaicItemState` mirrors `Formation`'s.

**An unplaced item is rendered and hidden, never left out.** Where the sizes come from mounted elements —
which is `ElementMosaic` — an item that is not in the DOM can never be measured and would never earn a
placement, so leaving it out is a deadlock rather than an optimization. It renders at the origin with `visibility: hidden`, which still measures,
and takes its place on the next pass. That is also what covers the first frame, where nothing has been
measured yet.

**The measuring wrapper is `width: max-content`, and that is what stops the height anchor eating itself.**
An ordinary block inside the positioned wrapper would shrink to fit the container, so its measured width
would depend on the container's width — which, when the height is the anchored side, is itself computed
from the measurements. `max-content` breaks the circle by making an item's width its own business, and it
is the same rule that lets an oversized item overhang.

**Sizes are read with `ElementObserverUtils.createBorderBoxSizeObserver` rather than from a client rect.** A
bounding client rect is the transformed size, so inside a `Viewport` it is the layout value times the scale
factor and the whole mosaic packs against numbers that are wrong by a constant. `ResizeObserver`'s
`borderBoxSize` is the layout box and no transform touches it.

### `Mosaic`: a re-pack glides through the Web Animations API, and a resize does not

**Tiles are moved in the document as the reading order changes, and a moved element does not run CSS transitions reliably, so the glide is written with `element.animate`.** After each pass, a tile whose box changed animates a translate from its old box to its new one, plus width and height where the preset sizes the tile. `left` and `top` are written at their final values, so anything measuring a tile reads where it is going.

**Only a pass that kept the anchored extent glides.** A pass where the anchored side changed is the container resizing, or the fixed side being switched, and there the tiles follow at once and any glide in progress is canceled. A tile placed for the first time appears in place, since it has nowhere to glide from.

**An interrupted glide restarts from where the tile is on screen,** read from its computed transform and size, so a burst of changes never snaps a tile back to its last target. Under reduced motion every tile jumps; WCAG 2.3.3 was checked.

### `Mosaic`: tiles are keyed by identity, and duplicate keys are counted rather than merged

Index keys would make a removal hand every later tile its neighbor's contents, which a glide makes visible as the wrong tiles sliding. `keys` names each item. `ElementMosaic` passes the items and `ImageMosaic` passes each source's `src`, since a consumer may rebuild the source objects. Each key keeps a stable slot object, matched by key and by which occurrence it is, so two equal keys still get two elements. `<For>` runs over the slots in reading order.

**A tile's index comes from its key, never from the layout.** `ElementMosaic` measures its elements by index. An index derived from reading order would feed the measurement that decides the reading order, which is a cycle.

**Focus is put back after a reorder.** The tiles are reordered with `insertBefore`, so the element holding focus is noted before the reorder and refocused afterwards, with `preventScroll`.

### `Mosaic`: the keyboard walk is opt-in, named, and follows what the eye sees

**Passing `onActivate` is the opt-in, and it makes `ariaLabel` required.** The two travel as one union, `MosaicWalkProps`, in `ModalNameProps`' shape. When on, the mosaic is one tab stop in Bracket's shape: a labeled `list`, a `listitem` per tile, and a `role="button"` inside each with a roving tabindex. Without it the mosaic has no stop of its own, and the reading-ordered document is what Tab follows.

**Left and Right follow the reading order; Up and Down follow the geometry.** The next tile in reading order may be anywhere, so a vertical step goes to the tile directly below or above that shares the most width, earlier in reading order on a tie. "Directly" means in sight: across the width the two tiles share, a candidate is skipped if nearer tiles cover all of it. Without that, a narrow pair under a wide tile would be jumped over for the wider tile beneath them. None of the steps wraps, as in Bracket. The helper is `MosaicUtils.computeStepIndex`, and it is pure.

**The browser's own `:focus-visible` answer reaches the painter as `isFocusVisible`,** read on focus and on keydown and cleared on blur. WCAG 2.1.1 and 2.4.3 were checked: every tile can be reached and activated from the keyboard, and in an order that matches what is seen.
