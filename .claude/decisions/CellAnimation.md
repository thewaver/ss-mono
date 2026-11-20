# Decisions: `CellAnimation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `CellAnimation`: weights as the staggering primitive

**A cell's weight is its position on the timeline.** A weight function returns 0..1 per cell from
`(pos, count, origin)`, and `computeBreakpoints(weight, opts)` turns that into the slice of the global
timeline the cell owns — direction is weight inversion, smoothness is the width of the window.

**The timing curve is the sample's, and it shapes a cell's own window rather than the whole timeline.**
`computeLocalTimeline` takes one of the five CSS timing functions — `linear`, `ease`, `ease-in`, `ease-out`,
`ease-in-out` — and applies it to the ratio a cell has traveled through its own slice, so the stagger keeps
the arrival order the weights decided and only the playback within each cell bends. It is solved as CSS
solves it, a cubic bezier inverted by Newton with a bisection fallback, so `ease` here and `ease` in a
stylesheet are the same curve rather than two approximations of it.

**Per-keyframe easing stays out, because the keyframe data can already express it.** CSS puts a timing
function on each keyframe, and that was the shape the React-era component had — but a stop list interpolated
linearly is exactly what `linear()` is, so an eased segment is written as denser stops in the sample rather
than as a second easing mechanism in the sampler. What denser stops cannot express is a curve over the
cell's whole window, which is why that is the half that got built.

**A source that is drawn rather than photographed is a data URI, and it needs nothing from the library.** The
component slices whatever URL it is handed, so an SVG written as a string — a gradient, a solid, a pattern —
is a first-class source: `data:image/svg+xml,` followed by `encodeURIComponent` of the markup. No base64 step;
the Playground has been doing this for its `Mosaic` samples all along, and `Samples/CellAnimationSources` is
the same trick for this component. Two things the SVG must do: declare `xmlns`, and state a `width` and
`height`, because the invisible anchor takes the box's aspect ratio from the image's intrinsic size — a
400×200 source at `width: 100%` in a 300px box measures 300×150, exactly as a photograph would.

**The cell's background URL is quoted, and that is what makes a drawn source work at all.** Unquoted, measured,
**zero** cells painted a background while the anchor still sized the box correctly, which is the failure that looks
like the animation having broken rather than the source.

**The Playground shows the three source kinds in one example, chosen from a sample group at the top of the
page.** The user's merge: a `Source` picker (`image`, `gradient`, `pattern`) heads its own panel and brings the
knobs that kind needs — a file for the photograph, a dropdown over `Shape`'s own gradient or pattern samples and a
ratio for a drawn one — while the grid, the weights and the timing stay in the page-wide panel below. The stress
test slices the same chosen source, its tiles sized by `computeSourcedWidth` so each keeps the picture's
proportions with its longest side at the tile size.

**A drawn source also picks its own shape, which the photograph cannot.** The two serialized sources are
written at whatever width and height they are handed, so `1:1`, `2:1` and `1:2` are one ratio dropdown, shared by
gradient and pattern, over
`SOURCE_RATIO_SIZES` — the long side stays 1200 and the short one halves, so the default source is the same
1200×1200 it always was. `computeGradientSource` and `computePatternSource` take that size as an argument
rather than reading `SOURCE_SIZE`, since the rect, the sample's own `getSize` and the `<svg>` attributes all
have to agree on one number. A photograph's ratio is the file's, so the image source has no such control, and
the pattern's cell size is left at 150×150 — a wider source therefore shows more pattern cells rather than
stretched ones. The demo box takes its width from the ratio so the longest side is always the same 480: a
portrait source renders 240 wide rather than 960 tall.

**The palette and the animation length come from the same places the Shape page gets them.** The four
colors are `SVGDefsSamples.SAMPLE_COLORS`, which `ShapePage` now seeds its own editable store from rather
than declaring a second copy; the duration is the cell animation's own, passed in per call. What a sample then
does with that duration is the sample's business and is not normalized — the pointy-top hexagon runs its fill
cycle at four times what it is given, on the Shape page and here alike, so the numbers agree at the input
rather than at the output.

**A `Shape` def becomes a source by being rendered and serialized, which is `SVGDefsSources`.** The samples
are Solid callbacks returning live elements, so the helper renders them into a detached `<svg>`, adds a
full-size rect per entry filled from that entry's color or `url(#id)`, serializes with `XMLSerializer`, and
disposes the reactive root. Nothing about the samples changes; the Shape page and the animation page ask the
same registry for the same thing.

**Whether a def still moves inside a source is decided by how its animation begins.** Loading an SVG through
an `src` runs no script but does run SMIL — measured: an `<animate>` with `begin="0s"` kept animating inside a
data URI while the same animation with `begin="indefinite"` sat frozen. The pattern samples carry a `dur` and
no `begin`, which defaults to zero, so they were always going to move. The gradient samples are driven by
`createAnimateDefs`, which sets `begin="indefinite"` on purpose and starts it from a ref that reads the
document's own clock, so that the iteration patterns can be sequenced.

**So the serializer writes the timing into the markup, which is the whole of what a script would have done for
the common case.** With no iteration delay asked for, every `begin="indefinite"` becomes `begin="0s"` on the
way out. That is exact rather than
approximate wherever the iteration config is `constant`, because `constant` supplies no patterns at all: the
repeat count is already `indefinite` and the only thing missing was the start. It is a serialization-time
rewrite rather than a change to the builders, and it is only correct because a source is a document nothing
will ever drive — the live `Shape` on a page still needs the script, which is what sequences its stages.

**The cell timeline is keyed on the picture as well as the iteration, so a new source starts it over.** Two
clocks are in play and only one of them can be restarted: the cells run on the page's frame loop, a drawn
source runs on the image's own timeline, which begins when the image loads. Rebuilding a source hands it a
fresh timeline while the cells carry on, so the offset between them becomes whatever the cells happened to be
doing — visible as a sweep sliding against the slicing. Treating a changed `src` as a reason to begin again
puts both back near zero together. Near, not exactly: the image's clock starts on load, so a slow source still
lands a frame or two behind, and nothing can hold them together after that.

**The pause between repeats is a begin that refers to the animation's own end.** The component waits on a
timer between runs; a document nothing drives has no timer, so the wait has to be stated. SMIL says it
declaratively: one repeat, and `begin="0s;<id>.end+<delay>ms"` — measured, the animation runs, freezes at its
end, holds through the pause and starts again. Every animation in the source is given an id and that begin
when a delay is asked for, which is why an overridden `repeatCount="indefinite"` is part of it: an animation
that never ends never reaches an end to start again from, so a repeat that never stops and a pause between
repeats are not two things that can both be true. At a delay of zero there is nothing to express and the
simpler continuous form comes back.

**Only the gradients take the pause; the patterns flow on.** Settled by the user, and the reason is what each
one looks like when it is out of step. A repeating fill has no beat — it tiles and cycles, so there is nothing
in it that can be seen to happen at the wrong moment, and a pause would only make it stutter against cells
that are resting for their own reasons. A gradient does have a beat: a sweep crosses the box once, and a sweep
crossing while the cells sit still reads as two things that were meant to agree and do not. So the delay is
passed for a gradient and pinned to zero for a pattern.

**What that does not reach is a multi-stage iteration pattern**, where the script advances a repeat count and
re-begins the animations after each stage ends. As a source, a def built that way plays its first stage and
freezes. Expressing the rest declaratively is possible — SMIL's syncbase timing works inside an image source,
measured: an animation beginning at `one.end+0.2s` ran after the one it names — so the chain would be one
`<animate>` per stage with a begin referring to the previous one's end, and a begin list to loop it. That is a
second variant of the builders rather than a rewrite of the existing one, and nothing has asked: the Playground
uses `constant` everywhere.

**The library names no weight and knows nothing about origins.** `CellAnimation` took
`getOriginType`, `getWeightType` and `getWeightOpts`, so the nine named origins and thirty-seven named
weights were the only ones a consumer could have. Wrong ownership: a consumer wanting an origin the library
never thought of, or a distribution driven by their own data, had no way in. All of them moved out of the component and into
`components/src/Samples` as sample code to copy, extend or ignore.

**The weights slot is a callback taking the count.** The grid the component draws is not the grid the
consumer asked for — the requested count is clamped against the measured pixel size, since cells thinner
than a pixel cannot draw. A weight grid built from the consumer's own numbers would be the wrong shape
whenever that clamp bites, and a wrong shape breaks indexing, so the component hands the effective count to
`computeSliceWeights`. Missing weights fall back to `0` per cell rather than throwing.

**The origin never enters the library at all, not even as data on the defs.**
`SliceAnimationEvaluationDefs` is `{ pos, count, weight, size }`; a consumer needing an origin merges their
own in at the call site, as the Playground's `DefaultExample` does. A threaded origin would be a value the
component stores, validates and re-renders on while never reading it — API surface that only forwards. The
consumer already holds the point, having computed the weights from it.

Two consequences. Whoever wants origin-aware zones or keyframes types their own defs as
`SliceAnimationEvaluationDefs & { origin: Point2d }`, which is what `CellAnimationZones.isInZone` and
`CellAnimationKeyframes.computeAnimation` take. And a consumer whose origin is derived from the grid must
derive it from the count they requested, not the count the component settled on — the one place this shape
is weaker than threading the value.

**`ScanlineAnimation` is a preset over this, not a second engine.** A scanline is a 1×N grid, so a line is a
cell and `getLineCount` is the only prop it adds; the five orderings it used to own became the `sequence*`
weight functions, which are exact rather than approximate. It kept its own name and evaluator alias because
the line-shaped API reads better for the common case — the reasoning that makes `Toggle` a preset over
`Checkbox`.

**A preset that loses an axis drops what indexed on it rather than narrowing it.** A scanline is a single
column, so every weight reading `dist.x` collapses: measured on a single column of eleven with the origin pinned at
`{ x: 0, y: 0 }`, which is what the Playground's Scanline page does, thirteen give every line the same weight
(`line_column`, `line_column_alternate`, `line_column_convergent`, both `quadrant` entries, all six `radar` entries, and
all three `frame` forms, whose ring is zero for every cell of a single column) and three more fall to two
values (`entwine_row`, `roll_row`, `roll_row_convergent`), and
most survivors are a plain row ramp wearing a name like `spiral` or `checkered`. The distance-based
survivors are the only reason an origin would exist on a line, and a control meaningful for three of nine
options reads as broken. This used to be enforced in the library — `ScanlineAnimation` narrowed `weightType`
to `ORIGIN_FREE_WEIGHT_TYPES` and exposed no origin. With the vocabulary gone there is nothing to narrow, so
the constraint is now the Playground's: its Scanline page offers only origin-free weights and pins the
origin to `{ x: 0, y: 0 }`. A real loss — the type used to make the trap unreachable.

**Cell geometry is integral and the requested count is honored exactly.** Edges are
`round(idx * total / count)`, so every cell starts on a whole pixel and the remainder is spread across the
row — 7 cells over 240px start at 0, 34, 69, 103, 137, 171, 206. This replaced two worse rules:
`ScanlineAnimation` snapped `lineCount` down to a divisor of the measured size, tiling exactly but silently
giving 80 lines when you asked for 119; `CellAnimation` used fractional sizes, which have no visual upside
and push a consumer toward a higher count purely to tile cleanly. The count is separately clamped to the
pixel dimension.

**Cells are still drawn one pixel larger than their slot, and integer edges did not make that redundant.**
The Playground renders inside `Viewport`'s `transform: scale()`, so whole-pixel layout edges land on
fractional device pixels, the browser antialiases each cell independently, and hairline seams appear. This
was removed once on the reasoning that exact tiling made it unnecessary and had to go straight back — the
seams were visible on screen, and reasoning about sub-pixel rounding is not a substitute for looking. Only
the drawn box grows: positions, `background-position` and the logical span stay exact, so the extra pixel
repeats the neighbor's first column rather than shifting the slicing. `defs.size` reports the drawn box,
because that is what a percentage `translateX` resolves against. The pixel has a cost the seams do not: where
the source is partly transparent, the lapped strip is composited twice and every cell ends up boxed in a
brighter line. That is recorded as an accepted limit in `backlog.md`, with the three fixes that were declined.

**Whole-grid operations cannot live in a per-cell evaluator**, which is why weights are computed once per
count rather than per frame: `shouldMakeUnique` and `shouldNormalize` rank every cell against every other,
and memoising the grid also stops `random_default` reshuffling every frame. The component owns that memo and
calls the consumer's function to fill it.

**Grid geometry belongs to `ss-utils`.** The per-axis distance between two cells, the clamp of a point into
a grid, and the distance from a cell to the further of its two edges are `Point2dUtils.getDelta`,
`getBoundPoint` and `getFarthestBound`, added in `ss-utils` 0.0.20 for exactly this. `CellAnimationUtils`
keeps only the parity predicates (`isEvenRow`, `isEvenColumn`, `isEvenRing`, `isEvenCheckered`), which read
a distance rather than measure one.

**`getFarthestBound` is not a drop-in for the old `getMaxDistance`.** It reports the honest `0` on a
single-cell grid where the original floored at `1`. Every distance-based weight divides by that number, so
the floor is what stops a 1×1 grid producing `Infinity` — a property of the weight functions rather than the
geometry, so it lives in `SliceAnimationWeights.const.ts`. `computeSliceWeights` is pinned on a 1×1 grid so a
future simplification that drops it fails loudly.

**An anchor is a translate, not a new value key.** Scaling or rotating about an anchor `a` equals the
center-anchored transform `M` plus a translate of `(I - M)·a`, and translate percentages resolve against the
element's own unscaled border box — so `transform-origin` folds into `translateX` / `translateY` inside
`fromStops` and never reaches the result type. Exact rather than an approximation, and it generalizes to 3D:
with `perspective` on the **parent**, a 3D rotation folds the same way using `translateZ`. It does **not**
work with the `perspective()` transform function on the element itself, which puts the vanishing point at
that element's own `transform-origin`, so moving the origin changes the projection. Perspective on the
parent is also the better rendering: one shared vanishing point is a 3D scene, per-element perspective is N
independent cards.

**Transform functions are emitted in a fixed order** — perspective, matrix, translate, rotate, skew, scale,
with each family's axis variants together — because `translateX(50%) scaleX(50%)` and its reverse are
different matrices, so ordering by `Object.entries` would make composition depend on the key order of a
literal the consumer wrote. Filters are ordered by `CSS_FILTER_KEYS`, and the transform/filter split is
decided by those lists rather than by the ordering constant, so a key nobody listed cannot end up in the
wrong string. `toAnimationStyle` always answers all three properties, so a frame that stops producing a
filter clears the previous one, and it zips each value against `CSSConst.ANIMATION_UNITS[key]`, one entry per
function argument. Why `opacity` is a property of its own, why a neutral filter is left out and why
`assignAnimationProps` skips a write that would change nothing are under _"`CSSUtils.toAnimationStyle`: what a
frame costs, and the three rules that came of measuring it"_.

**The cell container carries `isolation: isolate`.** Cells carry a per-cell `z-index` from weight so earlier
ones layer above later ones while they overlap. Before the container isolated them, those values landed in the
Playground's stress test modal and painted over its FPS counter.

### `CellAnimation`: how a finite run stops, and why the counter runs one past the end

**A finished run holds its last frame because its progress stays where the run left it.** The frame loop
stops with the progress at `1`, and the grid is always drawn at the current progress (see _"the pass is a
progress signal"_ below), so a run given `animationIterationCount={1}` ends on its own last pose and stays
there. There is no separate "hold" mode and none is needed — the hold is nothing moving the progress on.

**The counter increments past the maximum on the last pass, even though no iteration follows it.** That
looks redundant and is not: `getHasEnded` compares the counter with the maximum, and it is what `getIsRunning`
reads to keep the frame loop from starting again when playback or the window's visibility next changes, as well
as what `finalFrame` waits on before swapping the cells out. Incrementing only when another iteration is
scheduled is what the first version did, which left the counter one below the maximum forever and made the
guard unsatisfiable: a finished animation replayed from the start. So the last pass increments too, purely so
the guard can see it. A future reading that deletes the write because nothing consumes the value reintroduces
the replay.

**Which is why the source gets its own reset.** With a counter that parks above the maximum, a finite
animation would refuse to play for a second image. `createEffect(on(getSource, …, { defer: true }))` puts both
the counter and the progress back to zero when the source changes, whether the run had finished or was still
going.

**`finalFrame` is the consumer's word for what the last frame amounts to, and it is opt-in because the
component cannot work it out.** Three values, the user's own three cases. `"source"` — the run lands on the
untouched image, so reveal the `<img>` and unmount the cells. `"cells"` — the run lands on something only the
grid can draw, whether partially assembled, transformed or filtered, so everything stays. This is the default,
and it is what happens when the prop is absent. `"nothing"` — the run hides the picture, so unmount the cells
and leave the `<img>` hidden too: an empty box of the right size.

**Guessing it was considered and rejected.** Every animated value is a number against a known unit —
`CSSConst.ANIMATION_UNITS` covers all 31 functions — so "did this land on identity" is one table of neutral
values away, and `"source"` could in principle be detected. `"nothing"` cannot. A cell can be hidden by
opacity, by scaling to zero, or by being translated past the container's clipped edge, and only the first two
are readable without composing the full transform stack per cell against its box and the perspective, which
would still be wrong under a 3D rotation. The argument that settles it is the cost of being wrong: the swap
fires once, at the end of a run, and replaces the picture with a different picture. A detector right nineteen
times in twenty produces a silent visual corruption at the moment least likely to be watched, which is worse
than no detector at all. The consumer wrote the keyframes and always knows.

**The root's transform and filter are deliberately left alone, including under `"source"`.** The first build
cleared them, on the reasoning that "the final frame is the source image" cannot be true of a root that ends
rotated. The user overruled it and kept the hatch: a consumer may want the cells gone for the cost saving while
a filter still sits on the whole image, and clearing would take that away. So `"source"` means the cells reduce
to the image, not that the root is untouched, and nothing the component does ever unwinds `computeRootAnimation`'s
last write.

**The name states a fact rather than issuing an order.** `finalFrame="source"` reads as a description of the
animation the consumer wrote, which is what it is — the component's unmounting is the consequence, not the
request. The rejected spellings were `shouldRevealSourceOnEnd`, a boolean that could not express the third
case at all, and `endKind` with `"revealed" | "partial" | "hidden"`, where `"partial"` undersold a case that
also covers fully visible but transformed. Values are inline in the union everywhere except the exported
`CellAnimationFinalFrame` alias, which exists because the Playground stores one in a signal and enumerates
them in a dropdown; `sizeAnchor` next door has no alias because nothing enumerates it.

**A run held past its end is redrawn at its last frame on resize, and is not restarted.** Drawing is its own
effect, re-run when the cell elements or their sizes change as well as when the progress does, so the held
frame's transforms are worked out again for the new size rather than left stale. Restarting instead would be
worse: a held final frame that replays itself whenever a window changes width is not a held frame.

### `CellAnimation`: the pass is a progress signal, and the grid is always drawn at it

**Both consequences below were confirmed by the user**: a paused grid shows the pass where it stands, the first
frame if nothing has run, rather than the whole picture; and a resize or a tab switch does not start the pass over.
Pausing freezes the animation where it is, which is what scrubbing needs.

**Where the pass is lives in `progress`, in Trail's shape.** The component writes it every frame while playing, and writing it from outside moves the pass there. While playing, the pass carries on from the written point. With playback paused, the grid is redrawn at whatever is written, which is what a scrub is. The frame loop adds elapsed time over duration to the current value, not time since the pass began, and that is what lets a written value be carried on from rather than overwritten. It goes back to `0` at the start of each pass and when `src` changes.

**Drawing is its own effect, separate from the clock.** One effect draws every cell at the current progress, and it re-runs when the progress, the cell elements or their sizes change. The frame loop only advances the number. So a paused grid shows the frame at its progress (frame 0 before anything has run) rather than the uncut picture, and a finished run held on `"cells"` is redrawn at its last frame when the box resizes rather than keeping transforms worked out for the old size. The consumer's compute functions are called outside Solid's tracking (`untrack`). Tracked, every signal read in every cell's evaluation would have been recorded as a dependency on every frame, thousands of entries rebuilt at 60Hz. The cost is that a change to what the functions read, made while paused, shows at the next progress change rather than at once.

**Tabbing away or resizing does not restart a pass.** The loop does not depend on the cell layout, so it carries on from the progress it holds. The counter still goes one past the maximum on the last pass, and `!getHasEnded()` in `getIsRunning` is the guard it feeds. The source reset is `on(getSource, …, { defer: true })` putting both the counter and the progress back to zero.

### `CellAnimation`: the screen wipe is an example, not a component

**There is no `ScreenWiper`, owner's call: CellAnimation already carries weights and samples, so a separate wiper had nothing of its own.** The CellAnimation page reproduces it: a solid-color SVG source at the viewport's size, portaled into the viewport layer and fixed over it, one `pipe` iteration with a hold (in, hold, out, the part covered first uncovered first) and `finalFrame="nothing"`, unmounted on `onAnimationEnd`. The order of the cells is whichever weight sample the page has selected. **The lozenge is a square turned 45° and scaled past √2**, the least that covers its own cell, because CellAnimation only transforms and filters rectangular cuts. **The circle has no equivalent** for the same reason: a transform cannot round a corner. Under reduced motion the leg is 0ms, so the cover cuts in, holds and cuts out.
