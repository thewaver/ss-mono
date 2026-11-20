# Decisions: `ScratchCard`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ScratchCard` and `Reveal`: one mechanism, two components, one folder

Both lay a cover over content and cut holes in it. `Reveal` cuts one hole where the pointer is and it travels
with the pointer, so the cover is whole again the moment the pointer leaves. `ScratchCard`'s holes accumulate.
They sit together in `Exotics/Reveals`, the way `OverheadWheel` and `DrumWheel` share `Exotics/Wheels` — and
so do their Playground pages, under `Pages/Reveals` and behind one **Reveals** node in the left-hand tree.
Grouping a page does not change its route: `/reveal` and `/scratch-card` stay flat, as `/drum-carousel` does
under **Carousels**.

**They stayed two components, and the argument that nearly collapsed them into one is worth keeping.** From a
consumer's side the only difference is permanence, which is a fair reading and was the user's. What decided it
the other way is that permanence is not only a visual property: it is what creates state. A hole that tracks
the pointer is a pure function of where the pointer is — nothing to remember, nothing to finish, nothing to put
back. Once holes stay there is progress, a completion and a reset, and the thing stops being decoration and
becomes something a person operates to get somewhere, which is where the obligation to let a keyboard user
finish it comes from; `Reveal` owes the keyboard only a way to look under the cover (_"one Tab stop"_, under
`Reveal`). An
`isIncremental` flag on one component was weighed seriously and could have been stated honestly as a
discriminated union; two names were kept because nobody hunting for a scratch card searches for `Reveal`.
**Two names are discoverable and one name is honest, and there is no version that is both** — the shared folder
is the compromise the user asked for.

### `ScratchCard`: one path that grows, and why the grid it used to have is gone

**The rubbed area is a single SVG path, and every rub appends a subpath to it.** The mask is an inline
`<svg><mask>` in the component's own DOM — a white rectangle for the cover, a black `<path>` for what has gone,
blurred by one `feGaussianBlur` — and the cover element points at it with `mask-image: url(#id)`. Baseline
across browsers since December 2023, the same line `mask-composite` crossed. **No boolean union is computed
anywhere**: subpaths under `fill-rule: nonzero` render as their union for free. The one condition is that every
stamp winds the same way, which is automatic because they are one shape translated — two stamps wound against
each other would cancel into a hole instead of merging.

**Mutating the path beats regenerating a data URI by about seven times.** Measured in Chromium on a 600×300
card: setting `d` on the live element costs 0.1ms median and 0.4ms at worst, where re-encoding the whole mask
as a `data:` URI costs 0.7ms a stamp and 5.8ms once the card is fully rubbed, because every change is a new
image for the browser to decode.

**A stamp is refused when it would add nothing, which is what bounds the path by area rather than by time.**
`SVGGeometryElement.isPointInFill` is asked about the brush's center and four points a radius out, and the
stamp is skipped only when all five are already inside. On a long back-and-forth scribble that is 150 stamps
where stamping everything gives 401, **with the rubbed area identical to four decimal places**. Testing the
center alone is the tempting cheap version and it is wrong: it drops to 53 stamps but under-fills, because it
refuses stamps whose outer half would still have widened the edge.

**`cellCount` is gone, and with it rows, columns, run-merging and the layer ceiling.** The previous build cut
the cover into a grid, hid cells as they were rubbed, then merged each row's runs into mask layers to keep the
layer count off the cell count. All of it existed to make a quantised drawing model survive; none of it is
needed when the drawing is one path. What the user said when the knobs survived the first rewrite is the whole
argument: rows and columns beside softness, shape and radius is an incoherent set, and `cellCount` was a
drawing-model leak. **The props that remain are `brushRadius`, `softness`, the three shape props,
`clearThreshold`, `precision` and the render callbacks.**

**Two things improved for free.** The rubbed area now carries one soft contour round the whole of it rather
than a feather per row-run, so the rule that each hole's solid core had to be drawn a feather wider than its
cell — to stop two neighboring feathers meeting at three-quarter alpha and leaving a quarter of the foil
behind — disappears entirely. And the edge is a real union rather than a staircase of axis-aligned boxes, at
any softness.

**What it cost: `onScratch` is a sampled estimate rather than an exact count.** The ratio comes from asking
`isPointInFill` about a lattice of points. This overturns the previous entry, which argued the grid was worth
keeping _because_ it made the number exact — that was true and is no longer available, since an exact count
needs the drawing to be quantised and quantising the drawing is the thing being removed. `clearThreshold`
rides on the estimate.

**The lattice is a square count of samples, not a square spacing, and that is the aspect-ratio question the
user raised.** A square count means each sample stands for an equal share of the area whatever shape the card
is, so the estimate is unbiased and **the cost is fixed**. Equal pixel spacing is the version that assumes an
aspect ratio: measured against a fine reference, `precision` 32 costs 1024 probes and 2–4ms on every card
shape and errs by at most 0.28 percentage points, including on a 5:1 card — where equal spacing needs 5120
probes and 16.8ms to do no better.

**The measurement is throttled, and that is why `precision` costs nothing to raise.** Reported by the user:
precision 32 lagged and 24 was smooth. Two things compound there — the probe count is the square of the
precision, and `isPointInFill` gets dearer as the path lengthens, so the cost climbs through a stroke rather
than sitting still. Measuring on every stamp ties that cost to the pointer's rate, and **the user's
point is that it should never have been tied to it at all** — that is now a convention rather than a note
here, under _"What a component reports runs at its own rate"_ in `conventions.md`. **Throttle rather than debounce, which was the user's call and is the right one**: somebody
rubbing steadily never stops, so a debounce would report nothing until they lifted the pointer. So a
measurement runs at once, then at a bounded rate, with a trailing one so the final number always
settles — and the user's own argument for why the delay is free is that nobody can tell whether a threshold
was announced a fraction of a second late.

Measured after: frame pacing over a three-pass scribble is identical at precision 16, 32 and 64 — same median,
same 95th percentile, same count of frames over budget. **Precision no longer touches the frame budget**, only
how exact the number is.

**`precision` is the user's, optional, and defaults to 32.** It is samples per axis, so the cost is its square:
24 gives 576 probes and errs by up to 0.9 points, 32 gives 1024 and errs by up to 0.28, 48 gives 2304 and buys
almost nothing. A consumer who never sets it never thinks about it, which is the whole point of the prop that
replaced the two it removed.

**`renderBrush` draws a preview of the coin, and takes the `Sortable` family's shape.** Asked for by the user
in those terms: an optional callback for an element showing how much is about to come off. The signature is
`SortableGrid`'s `renderLanding` — optional, a boolean accessor and a geometry accessor, with the component
mounting the result in an absolutely-positioned, `pointer-events: none` wrapper sized to the geometry's box,
so a consumer paints and never positions.

**The brush props are authoritative for what is drawn, and the two builds that got this wrong are worth
recording.** The first reported only the cells that would _newly_ go — the more literal reading of "how much is
about to be scratched", and wrong, because while a drag is in progress everything under the brush has just been
scratched, so the set is empty for the whole gesture: the preview vanished on the press and `getIsRubbing`
could never be observed true, making the flag in the signature a lie. The second sized the wrapper to the
bounding box of the cells the brush covered, which meant **the brush changed size as the pointer crossed from
one cell into the next** — the user's report. Both mistakes are the same one: deriving the brush from the grid.
The brush is a property of the props. Its box is `2 × brushRadius` centered exactly on the pointer, and what
actually comes off is allowed to differ, because the difference is sampling and the user said so explicitly.

**It takes `Reveal`'s shape props, and they drive the rub as well as the drawing.** `computePoints`,
`joinRadii` and `lameExponents` are the sibling's names and shapes, and `softness` was already shared. The
geometry hands back a ready `clip-path` value built from the same points, which the consumer spreads onto the
element it was already returning — `renderCover`, `renderChildren` and `renderOverlay` all make that same
handout. `clip-path: path()` was ruled out for `Spotlight` because it takes no percentages and the layer's size
would have had to be observed; here the size is `2 × brushRadius` and known outright, so the objection does not
apply. **A shape that only changed the preview would be a prop that lies**, so the stamp appended to the mask
is the shape's own contour, and the circle is drawn as two arcs rather than as a polygon so that the default
is exact.

**Where the pointer is comes from `PointerTracker`, not from `trackDrag`.** A preview has to follow a pointer
that is only hovering, and `trackDrag` reports nothing until a press. The frame-late reading that
`backlog.md`'s `CardFan` findings warn about is harmless here, because nothing is picked from it — the rub
itself still comes from `trackDrag` on the press, which is what that finding is about. `Reveal` reads the same
abstract for the same reason, and the same `edgeRatio <= 1` test: `getIsPointerPresent` means a pointer exists
on the page, not that it is over this element, and taking the two for the same thing left the brush on screen
after the pointer had left the card.

**It can be operated with no pointer at all, and that was decided before it was built rather than after.**
`SlideButton`'s recorded gap is a control that only answers to dragging; scratching is worse, because it is a
path-based gesture. Success criterion 2.1.1 Keyboard (A) requires the functionality to be operable from a
keyboard, and 2.5.1 Pointer Gestures (A) requires that anything operated by a path-based gesture also be
operable with a single pointer without a path. So the cover is a `button` with a name, `Enter` and `Space`
take the whole of it away, and a single press without a drag still rubs off one brush-width — which is the
path-free pointer route the second criterion asks for.

**Crossing the threshold fades the rest out rather than taking it in one frame.** `clearThreshold` defaults to
1, which means nothing happens until the cover is genuinely gone; a consumer who sets 0.6 gets the rest taken
away the moment six tenths of it has been rubbed off. The remainder used to be marked scratched immediately,
which cleared the whole mask between two frames and read as the cover blinking out of existence — the user
named this as the clunky part, and the scratching itself as fine. So the threshold now starts a fade of the
cover's opacity over `clearDurationMs`, and the cover is unmounted at the end of it. `onClear` still fires when
the cover has actually gone rather than when the threshold was crossed. The controller's `clear` goes the same
way for the same reason; `reset` cancels a fade in flight.

**A controller rather than a signal, because a reset is a command and not a state.** `onMount` hands back
`reset` and `clear`, which is the shape `Typewriter` and `ScrambleText` already use. The Playground needs
`reset` for the house rule that a demo a visitor can move must be a demo they can put back.

**The component states no size of its own, so a card is as tall as what is under it.** The root used to be
`width: 100%; height: 100%`, which `Reveal` never did — and with the two of them in one folder, the same shape
sizing itself two different ways was the odd part. **How tall a card is belongs to whoever wrote what is
inside it**, and a component that pins itself to its parent takes that away with no route back: a card that
grows with its content becomes impossible to build. So the root is `position: relative` and `overflow: hidden`
and nothing else, the absolutely-positioned cover follows whatever box the content makes, and a consumer who
does want a filled parent says so on the content, which is what `Reveal`'s own page does.

**The page carries a second demo, and each one keeps its own tally.** `Reveal` has a frosted cover beside its
opaque one — a cover that blurs rather than hides, so what is underneath sharpens instead of being uncovered —
and the same cover works here because the mask is the only thing the component owns. The page used to hold one
cleared-ratio signal, which two demos would have written over each other; it now keys progress by the example,
so a third demo is a key rather than another pair of signals. The frosted card is much the taller of the two,
and it got that way by having more to say rather than by being handed a bigger number — an earlier pass reached
the same look with a `FROSTED_CARD_HEIGHT` constant, and the user asked whether the layout was adjusting or
being told, which is what turned the constant up as a smell. **The page sets no height at all.** Do not tidy
the two into matching boxes — **the Playground is there to show the component holding up and to put edge cases
in front of somebody**, which is the user's standing reason and outranks a tidy row.

**The spec reads the reported share, because there is nothing left to count.** The grid is gone, so the old
assertions about hidden cell elements and merged mask layers went with it. One test reads the share twice at
different `precision` values and expects them to agree: that is not a precision check but a check that the
sampling is unbiased, which is the property that replaced the exact count. Another rubs the same ground three
times and expects the number not to move, which pins the union. A test asserting that the fade carries a
transition was written and deleted; it is an appearance check, it cannot tell a restyle from a break, and it
raced the fade it was watching.

**`Abstracts/Cutout` no longer has `ScratchCard` as a consumer.** It grew from one hole to a list of them for
the grid build, and that build is gone; `Reveal` and `Spotlight` each pass a list of one. The list form is kept
rather than reverted because it is tested and costs nothing, but it is now a generalization with no second
consumer, which is worth knowing before anything is built on it.

### `ScratchCard` and `Reveal`: what is under the cover cannot be reached until it is uncovered

**Covered content is held back, in both components** — the user's call. A coupon's "Copy code" link under a
`ScratchCard` used to be the first Tab stop, focused behind the foil where its ring could not be seen, and a screen
reader read the prize before it reached the cover: WCAG 2.4.11 Focus Not Obscured (Minimum), _"When a user
interface component receives keyboard focus, the component is not entirely hidden due to author-created content"_.
**What `renderContent` draws sits in one wrapper carrying `inert`**, with `display: contents` so the layout is the
consumer's as before. On a `ScratchCard` it is inert until the card is cleared, which includes the clearing fade and
a disabled card; Tab reaches the cover, Enter or Space clears it, and the content is then reachable. On a `Reveal` it
is inert always, since its cover never goes.

**The cost, taken in view:** a `Reveal`'s content can never be operated, by keyboard, screen reader or pointer, and a
hidden text that a determined visitor could once select is now out of reach too. The options turned down were to
keep `Reveal`'s content reachable and move the hole onto whatever takes focus, and to leave it as the consumer's duty
in the documentation. **Nothing is announced when a card clears**; whether something should be is not decided.
