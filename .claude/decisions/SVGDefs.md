# Decisions: `SVGDefs`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SVGStyleDefsUtils`: a computed style into fill and stroke

- **It is a utility and knows nothing about elements**: the caller decides what to read and when to read again — the
  user's call. A computed style is live but announces nothing.
- **What it cannot convert is skipped and reported with `console.warn`, in production too** — the user's call for this
  utility, over the general rule that a lossy conversion fails loudly.
- `ALPHA_BLEND_STEPS` is a guess, the user's to change: CSS blends translucent stops premultiplied and SVG does not, so
  a segment whose alpha and color both change is sampled.
- **A corner's radius is a number or a pair** — the user's shape for elliptical corners. The pair is edge-relative
  (arriving edge, leaving edge) because a contour's corners need not be axis-aligned, so the converter swaps a CSS
  corner's horizontal and vertical at alternate corners. A pair's inner curve subtracts the other edge's thickness, as
  CSS does; a single number keeps subtracting the thicker edge, so existing shapes draw the same.
- **Each fill layer may have its own contour, through `fillGeom`** — the user's call, generic over a CSS-only fix, as
  long as a `Shape` given none paints exactly as before. An entry moves each edge out or in and rounds the corners
  the CSS way, or with radii of its own; that is what draws a shadow's spread, an inset shadow's hole and a
  padding- or content-box background exactly.
- **Box shadows are fill layers** — outer ones under the background, inset ones over it — each drawn from its layer's
  solid shape rather than its paint and clipped as CSS clips it: outside the border box, or inside the padding box.
  With no spread the filter cuts the shadow against its own source; with a spread the source is the moved contour,
  so the cut is a clip, and **the clip is `fillGeom`'s `clip`, which `Shape` draws from its own contour** — the user's
  pick. The converter knows only the box, so a clip it drew itself was a rounded rectangle: under a skin with a
  spread glow, an octagon's cut corners showed the inset glow and an arrow caught the outer one.
- **A gradient whose origin box differs from its clip box is tiled with a pattern**, as CSS repeats it, rather than
  skipped: the default origin is the padding box, so any gradient behind a translucent border needs it. The same
  pattern, with a window onto part of the image, draws `background-size`, `-position` and `-repeat` and each of a
  border image's nine regions, each region a fill layer whose `fillGeom` is its rectangle with square corners, since
  `border-radius` does not reach a border image.
- **`corner-shape` is converted, not passed through**: CSS's `superellipse(K)` draws with exponent `2^K`, measured
  in Chromium against `squircle` and `superellipse(3)`, while `Shape`'s Lamé exponent `e` draws with `e + 1` (or
  `1 / (1 - e)` below zero). The two agree only at `round`, `bevel`, `scoop` and the extremes, so the converter
  maps one onto the other.
- **Border-image `space` follows the spec, not Chromium**: the spec drops partial tiles and spreads the gaps evenly,
  and Chromium draws partial tiles at both ends of each edge, so that one mode does not match the browser.
- **`backdrop-filter` is passed through, not converted** — the user's request, so a Skin's frosted tooltip reaches
  `Shape`. SVG has no way to read what lies behind it, so the converter hands the value back as written and the
  consumer draws a layer beside the `Shape` wearing it, cut to the contour `onContourChange` reports (see `Shape.md`).
  Filter Effects 2, §2.1: the filtered backdrop gets the element's own clips and opacity. Any ancestor that is a
  Backdrop Root (`opacity` below 1, `filter`, `mask`, `clip-path`, `backdrop-filter`, `mix-blend-mode`) cuts off what
  the layer can see, so a fade must run on the layer and the `Shape` separately, never on a box around both.
- **Sides of different colors are one ring per color, each clipped** to the wedges between the box's corner-to-inner-corner
  seams, using `SVGDefs.clipPath`. `SVGClipPath` reads fractions of the box, so the polygons are fractions.

### A SMIL animation resets by being rebuilt, and the defs record is what says so

Settled by the user, closing the `Show ... keyed` item `backlog.md` had parked. SMIL cannot be rewound in
place, so an animation restarts by being **built again** — and what rebuilds it is a new defs record: the
consumer's callback returns fresh objects, `Shape` inserts new elements, and the old ones are discarded
mid-flight. That is the whole mechanism, and it is now the stated contract rather than a side effect nobody
had written down.

**What was removed is the thing that pretended to own it.** Every animation builder wrapped its `animate`
elements in `<Show when={defs.animationIterationPatterns ?? EMPTY_ARRAY} keyed>`, whose intent was exactly
this remount. It could never fire: `defs` is a plain object, so reading a field off it tracks nothing, the
memo behind `Show` has no dependencies, and the children were built once and never again. Deleting it changed
nothing — measured, the `animate` elements are replaced on a duration change and on an iteration-pattern
change with the wrapper gone exactly as with it there. Three builders wrapped sibling elements, so a fragment
took the wrapper's place; the rest lost a level of nesting.

**An animation is started by asking for a delay from now, never by naming a moment.** `createAnimateDefs`
used to work out the document's current time and write it into `begin`; switching iteration pattern while one
was running then produced an animation that looked perfectly healthy — connected, right duration, right repeat
count, a real interval — and never animated, then reverted at the end of that interval. The instant had
already passed by the time the browser read the attribute, and an interval that begins in the past is not the
same thing as one beginning now. `beginElementAt(delay)` is the call the sequencing already used for every
later stage, so both paths now start the same way and the clock is never consulted. Measured across the
sequence that reaches it — pick a repeating pattern, let it run, switch mid-run — twenty-four runs clean where
the old path failed roughly one in three.

**A loop with no start of its own runs on the page's clock instead of being begun.** A pattern that repeats forever
with no delay has nothing anybody can see begin, only a phase, so `SVGAnimationDefsUtils.getIsPageClocked` answers
`true` for it and every framework's builder writes `begin="0s"` rather than `"indefinite"`. The scheduler then does not
call `beginElementAt` on it at all: a frame after the element is put in the page, it sets the outermost drawing's clock
to the page's (`setCurrentTime`). Two drawings of the same loop then show the same moment of it, and a drawing put in
the page later — a word replaced by the next, an example remounted — carries the loop on rather than starting it from
its first frame. Anything scripted, a count or a delay, is begun from script as before, from the moment it is put in
the page. `paintedText.spec.ts` reads every looping drawing's clock against the page's.

**The clock is set twice: once in a microtask straight after the element is attached, and again on the next frame.** A
browser holds a newly added animation at its first frame until something moves the clock it runs on, and it advances
its animations for a frame before running the frame's resize callbacks. So an element added from a resize callback — a
paint rebuilt because `PaintedText` or `Shape` just learned its size — was drawn for one frame at the loop's start,
seen as a blink of the gradient snapping back. The microtask seek runs before that frame is painted and removes it;
it reads `performance.now()`, a few milliseconds past the frame's own time, so the frame seek follows to line the
drawing up exactly with the others. The microtask is used rather than a synchronous seek because Solid's `ref` runs
before the element is in the page, when it has no outermost drawing yet.

**Each drawing's clock is set once per batch, not once per animation.** Setting a drawing's clock makes the browser
work out every animation in it again, and the scheduler used to set it from every element it attached. A timed pattern
on the Shape page at a 10px cell is about six hundred animations in one drawing, so a rebuild made 1,246 calls, each
re-working 81 animations, and took about nine seconds — long enough to stall the page whenever the cell size changed.
`playgroundPanels.spec.ts`'s NumberInput test walked into it every time it left the field holding an out-of-range
value and the correction rebuilt the pattern, and timed out more often than not. Now the microtask seek collects every
drawing asked for in one render and sets each once, and the frame seek sets each drawing once per frame (`clockToPage`,
`clockToFrame`): 28 calls and about ten milliseconds for the same rebuild. Every drawing is still set to the same
moments as before.

**`PaintedText` measures once as soon as it mounts, then observes.** Its first layout used to come from the resize
observer's first report, which arrives after the frame's animations have been advanced. A copy mounted mid-animation —
`MorphText`'s outgoing word, mounted fresh at the start of every morph — therefore drew its first frame from an
unmeasured layout. Measuring in the mount handler puts the real size in place before the frame is worked out.

**The two diagonal-flow gradients update in place when the box changes shape, in Solid.** `flow_diag_2` and
`flow_diag_3` turn 45° into whatever angle looks like 45° on the box (`AngleUtils.unwarp`), so their angle, offset and
sweep values depend on the size. Solid's `renderDefsElement` runs inside one tracked expression, so reading the size
directly in it rebuilt the whole gradient on every resize. The samples now read it inside memos handed to the gradient
and to `SVGAnimations.Linear.sweepDiagonal`, whose coordinates and angle accept accessors, so a resize rewrites
attributes on the elements already there and the running animation keeps its phase. React, Vue and Svelte needed no
change: each re-renders the same description onto the same elements by key, which already updates in place.

**The guard is a spec rather than a note**, because the failure mode is silent: memoise the defs so the same
record survives a change and the animation simply carries on with the old timing, looking like a component
that ignores its props. `shape.spec.ts` holds an element, changes the duration, and asserts the one it held is
neither the current one nor still connected.

**This is the same shape as the cell timeline being keyed on its source**, and worth reading together: in both
cases the restart is owned by an identity that changes, and in both cases the thing to avoid is a restart that
happens by accident somewhere up the tree. The difference is which document owns the clock — a `Shape` on the
page rebuilds its own elements, while a serialized source gets a new clock only by being a new image.

### `addTurbulenceFilter` emits two primitives, because a lone `feTurbulence` cannot chain

Asked for as a turbulence entry in `SVGFilterDefsFactory`, and it could not be one on its own.

**Every other primitive in the factory transforms the running graphic; `feTurbulence` generates and ignores
its input.** That breaks both of the factory's assembly modes rather than one. Under `chain` a bare turbulence
would hand noise to whatever came next and silently discard everything upstream of it, so a blur followed by a
turbulence would lose the blur. Under `isolate` the closing `feMerge` would lay an opaque rectangle of noise
over the source graphic, covering it completely — the merge has no opacity or compositing of its own. There is
no defs object that makes either of those useful, so the generator is not a primitive this factory can hold.

**What is a primitive here is the displacement, and the noise is its map.** The method registers one entry
that emits `feTurbulence` to a private result and `feDisplacementMap` taking `in` from the running graphic and
`in2` from that result. One graphic in, one graphic out, which is the contract the chain and the merge both
rely on, and `resultGraphic` is the displacement's key so a following primitive reads the bent image rather
than the noise. The name follows the consumer's vocabulary rather than the elements: it is the same call the
existing methods make — `addHueRotationFilter` is an `feColorMatrix` and `addDropShadowFilter` names an
effect, not a tag.

**The region grows by half the scale, which is the whole of the arithmetic.** `P′(x, y) ← P(x + scale ×
(XC − 0.5), y + scale × (YC − 0.5))`, so a channel at either extreme reaches `scale / 2` away and the filter
region must carry that much on every side or the edges are cut off flat. `maxOffset` takes
`Math.abs(scale) / 2` — absolute, because a negative scale is legal and simply mirrors the direction. The
no-op guard is `scale === 0` rather than `<= 0` for the same reason, matching `deg` and `amount` rather than
`stdDeviation`.

**Three of the defaults deviate from the spec's, deliberately.** SVG defaults `type` to `turbulence` and both
channel selectors to `A`; the factory defaults to `fractalNoise`, `R` and `G`. The spec's own defaults are the
two documented traps of this primitive — `turbulence` sums absolute values so its channels sit dark and most
of the displacement pulls one way, which reads as marbling rather than the even ripple almost everyone is
after, and displacing both axes from alpha slides the image diagonally instead of rippling at all. Defaults
that produce the surprising result are worth less than defaults that produce the expected one, and both are
one word to override.

**`baseFrequency` takes a `Point2d` as well as a number**, because the axes are independently useful: a low x
against a high y is the vertical draw of old window glass, and there is no way to reach it with one value. The
single number stays the common case and is written straight through.

**`custom` goes to the `feTurbulence`, not the displacement.** It is the animation slot every other method
carries, and the attributes worth animating on this pair — `baseFrequency` and `seed` — are the noise's.

### A pixelate filter, built from an image of dots

From Fancy Components' pixelate filter. `addPixelateFilter({ size })` samples the picture once at the middle of every
square and grows each sample back out to fill its square: an `feImage` holding one dot per cell, made opaque wherever
it is drawn (`feComponentTransfer`), the source kept only where a dot lands (`feComposite in`), and `feMorphology`
dilating by half a cell. A size of one pixel or less changes nothing and is not kept, like the other no-op effects.

**The widely published construction draws nothing at all in Safari, and this one was found by checking.** That one
floods a single dot with `feFlood` and the primitives' own `x`/`y`/`width`/`height`, then repeats it with `feTile`.
Checked in Safari against the same box in Chromium, piece by piece: the flood-and-tile grid is empty in Safari
whatever the region; and with the region given in pixels (`filterUnits="userSpaceOnUse"`, which the registry writes
whenever it knows the element's size) Safari also refuses `feMorphology` and `feImage` on their own. With the region
given as shares of the element's box, the image of dots, the composite and the dilation all draw. So:

- **The dots are an image**, built by `SVGFilterDefsUtils.resolvePixelate` as a data URI of the region's exact size,
  with the cells counted from the element's corner. It must be that size: an image with no size is drawn by Safari at
  a default size and stretched, which drifts the columns, and an image placed with its own `x`/`y`/`width`/`height`
  makes Safari lay the filtered box out at the wrong width.
- **The dots are made opaque before sampling**, because Safari smooths the image and leaves every dot partly
  transparent, which drew the squares visibly dimmer than Chromium.
- **A filter holding a pixelation writes its region as shares of the box** — the same region, in the units Safari
  honors. Other filters keep the region in pixels; whether they should all switch has not been checked or argued.
- **A pixelation needs the element's size.** Without it the image cannot be sized, so the registry leaves the effect
  out and assembles the rest as if it had never been added; the graphic shows unpixelated rather than blank.

The blur-then-sharpen filter a liquid edge needs (`feGaussianBlur`, then an `feColorMatrix` that steepens alpha) was
checked in the same pass and draws in Safari as it does in Chromium.

### The SVG defs vocabulary is sample code, and the arithmetic is a file with no JSX in it

Settled by the user, applying the `CellAnimation` ownership rule to the one place it had not reached.

**The library never used any of it.** Seven named tilings, four families of animation builder, and the shared
helpers under them were exported from `components/src` and called by nothing except Playground samples. `Shape`
takes `computeFillDefs` and `computeStrokeDefs` from its consumer and renders whatever it is handed, which is
the same seam `CellAnimation` has for weights — so a named set of tilings is vocabulary, and vocabulary
belongs where the origins and the weights already went.

**What moved and what stayed.** The seven tilings and the `Linear` / `Radial` / `Path` / `Gradient` builders
are now `Samples/SVGDefs`. `computePattern` — place N cells in a tile and repeat it — stays, along with
`createAnimateDefs` and `unrollSelfReferencingPatterns`, because those are what a consumer writing a tiling of
their own would build on. The gradient file stays whole.

**The split the move was for is a file extension.** `vitest` runs `src/**/*.test.ts` in a node environment
with no JSX transform, which is the rule _"Unit tests"_ in `conventions.md` already states — so a test cannot import a file
containing an element. That makes the separation mandatory rather than stylistic: `SVGPatternLayouts.const.ts`
and `SVGAnimationTracks.const.ts` hold the arithmetic and no markup, `SVGPatterns.const.ts` and
`SVGAnimations.const.tsx` hold the builders that consume them, and only a file that really does write an
element keeps the `.tsx`. This is what `backlog.md` asked for and could
not get while the numbers lived inside the callback that emitted the element.

**A tiling is now four pure functions rather than a closure.** Each entry in `SVGPatternLayouts.ALL` answers
how many cells the requested count rounds to, how big one tile is, where a cell sits, and whether it straddles
the seam. A wrong tiling still tiles — that is the whole reason this arithmetic could be wrong for months —
and now the pointy-top hexagon's rows can be asserted to sit at −15, 7.5 and 30 for a 30px cell, which is the
three-quarter overlap that makes hexagons interlock rather than merely repeat.

**`triangle_sideways` is `triangle` transposed, and it is a second entry rather than a flag.** The upright
tiling wants an even number of rows and an odd number of columns, steps half a cell across and a whole cell
down, and marks the first and last column as the ones cut by the seam; the sideways one wants the opposite
on every one of those four counts. Writing it as an axis flag inside the existing entry would put four
conditionals into arithmetic whose whole value is that it can be read straight off, so the table gets a row
instead, and `triangle_s_2` is the sample that draws left- and right-pointing triangles through it.

**One thing the extraction found immediately.** `computeGrowTracks` assumes its two ends are given in order;
handed them reversed it walks outside the segment instead of mirroring. No call site does that, so it is a
precondition rather than a defect, and it is pinned by a test rather than changed — the behavior is what
ships and nothing has asked for the other one.

**`SVGDefsUtils.DEBUG_SEAMS` stays in the published samples**, switched off. The user still turns it on while
building a pattern, to see which cells the tile's repeat cuts in two, so it is kept rather than moved out, and carries
the doc block every `.utils.ts` export needs.

### The Playground: a paint is chosen as a kind, then a sample

**Every page that paints a slot with a defs sample offers it as two dropdowns: what kind of paint, then which
sample of that kind.** The user's call. `Shape` used to give its stroke the timed gradients and its fill the
patterns, and `PaintedText` gave both slots all three registries in one list grouped by a sample's first word — a
grouping that never says the kind, so even the user, who designed the registries, did not see that tracked
gradients and patterns were in it. One control, `PagePaintPicker`, now does it in all four Playgrounds: the kind
is Solid, Pattern, Timed gradient or Tracked gradient, and the second dropdown lists that registry alone. Each slot
remembers a sample per kind, so switching kind and back finds the last one picked. A page may override the sample a
kind starts on — `PaintedText` starts its timed gradients on `flow_diag_3`, the user's pick, where `Shape` keeps
`sweep_diag_1v1`.

**A slot is one sample panel, and its Reset leaves the kind alone.** The panel's Reset skips the first field it
registered, which is the kind, so it resets the sample and its knobs and keeps what the user chose to paint with.
The sample dropdown is remounted when the kind changes, so the value Reset returns it to is that kind's own
starting sample rather than one from another registry.

**The settings only one kind reads appear only while a slot uses that kind.** Cell size is a pattern's; duration
and iteration pattern are a timed gradient's and a pattern's; a tracked gradient reads none of them. The props
spec that types into the cell size on the Shape page therefore picks a pattern for the fill first.

**"Solid" is the flat color the samples are built from, on every page.** The first build called it "None" and let
each page decide: `Shape` painted `computeNoSampleDefs`' colors and `PaintedText` painted nothing, falling back to
the text color when both slots were empty. The user's call was one meaning under a name that says what it does, so
the shared helper paints `computeNoSampleDefs` for the slot it is told it is painting, background-derived for a
fill and border-derived for a stroke. Nothing is lost: hollow letters are a solid fill with the background color
made transparent, which the color field allows.

**`CellAnimation` has no tracked example, and that is deliberate.** Its source is a picture — a sample serialized
into a data URI — and a picture runs no script, while a tracked gradient follows the pointer only through script.
The example would sit frozen at its resting frame. The user's call: show only what works there.

### The defs registries are split by what drives a sample, not by what it looks like

**`Pattern` and `Gradient` were named after their output and typed by their payload, and the two disagreed.**
`PatternConfig` differed from `GradientConfig` by exactly one field — `cellSize` — so "Pattern" meant "needs a
cell size" and "Gradient" meant "does not". Two samples sat in the wrong box under that rule. `whirl_2` is a
radial gradient clipped by rotating wedges with no tiling in it at all, filed under Pattern because it borrows
the cell size as a wedge radius. The `sheen` family took the gradient payload and ignored its clock half,
consuming instead the one thing no other sample used — the element ref — so the picker offered them an
animation duration and an iteration pattern that did nothing.

**`Gradient` now nests `Timed` and `Tracked`, and the user chose that over a third sibling registry.** The
alternative was `Gradient` plus a `Pointer` registry beside it, which names the driver on one side only and
leaves "gradient" quietly meaning "the clock-driven ones". Nesting keeps the element kind as the kind and
makes the driver the sub-axis, so `SVGDefsSamples.Gradient.Timed` and `SVGDefsSamples.Gradient.Tracked` each
carry their own `SAMPLE_CONFIGS` and `SampleKey`, and a `Pattern.Tracked` would have an obvious home if one is
ever wanted. `TimedGradientElementDefs` is the old gradient payload; `TrackedGradientElementDefs` is that
minus the animation fields, which makes it a strict subset — a consumer holding the timed payload can call
either, and nothing had to branch to keep that true.

**`SVGDefsSamples` is data, `SVGDefsSampleConfigs` is drawing.** The user's call, on the ground that a lookup is
plain TypeScript and has no reason to be framework-specific. The registry was written four times, once per framework
package, identical but for an import line, because its tables pointed at the sample files that draw. It is split by
that line. `SVGDefsSamples` moved to the core's `Samples/SVGDefs/SVGDefs.const.ts` and keeps every data member at the
path it had — the sample colors, the `Iteration` table, each sub-registry's `SAMPLE_ENTRIES`, `Entry`, `SampleKey` and
`SAMPLE_KEYS` — so a key typed against it reads the same from any package, and the Playground's knobs could become
shared. Timed patterns have no entries, so their names are a list of their own there. Each framework package keeps
`SVGDefsSampleConfigs`, holding only what draws — `Pattern.Timed.SAMPLE_CONFIGS` and the three `SAMPLE_FACTORIES`
with their `toConfig` — and each of those tables `satisfies` a record over the core's `SampleKey`, so a framework
missing a sample, or carrying one the core does not name, fails to compile. A framework package still re-exports
`SVGDefsSamples` through its `export *` from the core, so a consumer reaches both names from one import.

**The folders mirror the namespaces, because the left nav mirrors the folders.** `Samples/SVGDefs/Gradient`
holds `Timed` and `Tracked` directories, and the menu's SVGGradients entry became a branch with a
`TimedGradients` and a `TrackedGradients` child. This is the one branch of the SVG group whose nav shape
followed the samples tree rather than `Abstracts/SVG/Defs`, which is where its siblings came from. The
generators have since moved to `Generators/SVGDefs`, so the nav follows that folder throughout. Nothing in the plumbing depended on sample folder
depth: the source view globs the Playground's own tree only, so the move was import paths and nothing else.

**Two pages, because the knobs differ.** The timed page carries the animation duration and the iteration
pattern; the tracked page carries neither, since nothing there reads a clock. What they share — how the defs
are painted, the colors, the blur — lives in `SVGGradientsProps`, a fragment of `PageProp`s each page drops
into its own panel, the shape `CarouselsPanel` already set. The consumer pages follow their knobs rather than
their history: `Shape`'s stroke picker offers `Timed`, since every knob beside it is an animation knob, and
`GlassSurface`'s border offers `Tracked`, which is why the animation duration and iteration knobs are gone
from that page. Each page therefore offers exactly the samples its payload can drive.

**`plain` stopped being a sample.** Both registries carried one, and neither was a gradient or a tiling — a
flat color is the absence of a def. They also disagreed: the gradient's was the base border color and the
pattern's the base background color, so a single shared entry would have needed to be told which, and every
sample would have carried a fill-or-stroke field for the benefit of one. Instead the pickers offer a `none`
choice and the page paints the base color itself, choosing fill or stroke because the page already knows
which it is doing. `NO_SAMPLE_KEY`, `toGroupEntriesWithNoSample` and `computeNoSampleDefs` are the whole of
it, and they live beside the group helpers the pickers already used.

### Per-sample defs: a sample is a factory, an entry is a family plus a bag, and knobs are derived

The build of the per-sample defs item, across all three registries; the item is closed. What it answers: a sample's
tuned numbers were module-level `const`s that neither a consumer nor the Playground could reach, so the only
way to try a different value was to edit the file.

**A sample is a factory named after its key.** Every gradient sample was `export const scan_1:
TimedGradientConfig = {…}`; it is now `export const scan_1 = (opts?: GradientCycleOpts):
TimedGradientConfig => ({…})`. The export keeps the file's name, so _"one file per key, and the key is the
file's name"_ is intact — only the type moved from a config to a function returning one. Samples with no
options are zero-argument factories rather than a second shape, which is what lets one resolver call them
all. `Placement/Layouts` already had this shape as `create<Family>(defs?)` and did not move.

**An entry is a family plus its own options bag, and a resolver turns one into a config.** Each registry now
holds entries — `SAMPLE_ENTRIES` for the gradients, `SAMPLE_LAYOUTS` for the layouts — and exposes
`toConfig(entry)` / `toLayoutFn(entry)` beside the factories. The entry type is a union discriminated on
`family`, so a family that takes no options cannot be handed a bag and one that takes `banded` cannot be
handed a knob it does not read. Nothing in `components/src` outside `Samples` reads a sample key at all; the
six places that read a registry by key are all Playground pages, and each now threads a bag alongside the
key it already threaded.

**Knob descriptions are derived.** They have since left the library for `playground/src/App/Knobs`, and the
vocabulary below for `PageComponents/Knobs/Knobs.types.ts`, under _"Knob descriptions left the library
entirely"_; what follows is how they were first built. `Samples.types.ts`
at the root of the tree holds the vocabulary — a number knob with a range and a step, a check knob, and a
`SampleKnobs<T>` mapped type that checks each entry's name and kind against the family's own options type,
so a renamed option breaks the build and a boolean cannot be given a slider. Each registry has a
`*.knobs.ts` module next to it; the registry does not import it, so a consumer who names one sample never
pulls labels and step sizes to call a function that never reads them. **The vocabulary is deliberately two
kinds**, because two are what the three registries need; it grows when a family needs a select or a color,
and an unused kind would be dead API.

**A check knob may sit over a number, and then writes `1` when on and `0` when off.** The user's call, with the
walls' `staggerRatio`: the library takes a ratio so a consumer can stop anywhere between, and the Playground shows
only its two ends. `KnobFor<number>` therefore admits a `CheckKnob` beside a `NumberKnob`, and every framework's
`PageKnobs` writes through `toCheckValue`, which answers a number wherever the default is one. A value between the
ends reads as on.

**Defaults stayed with the family, which is what kills the drift.** `BAND_DEFAULTS`, `ARC_DEFAULTS` and
their neighbors are exported from the layout factories, and the scanline registry's eight
`DEFAULT_…_OPTS` moved inside its namespace. The Playground's generic panel seeds from those, so a number
lives in exactly one place. **The ranges came out of the pages**: `PlacementPage` held twenty module
constants of minimum, maximum and step for five knobs and the scanline page held thirty-odd, and all of
them are now facts the sample states about itself.

**One generic panel renders them all.** `PageKnobs` is a switch over the field components the Playground
already had, so it is not new UI. It replaced five hand-written knobs on `PlacementPage`, which went from
150 lines to 68, and eleven hand-written panels on the scanline page, which lost 85 lines and every
non-null assertion it carried. `Glitch` keeps its hand-written panel, being a page-local composite rather
than a registry sample.

**Two visible changes came out of it, both deliberate.** `PlacementPage` now opens on the ring's own
defaults rather than the page's — a hole radius of 25 against the band's 25, where the page used to open at
64 and 84 — so what the Playground shows on load is what a consumer gets from `ring`. If those proportions
read worse in the demo box, the fix is `BAND_DEFAULTS`, not the page. And `labelRadiusRatio` is shown as
the ratio it is, 0 to 1 in steps of 0.05, rather than as a percentage the page converted.

### What collapsed, and what a turned knob means for the key

**A preset stops existing once a knob reaches it.** The user's call. `fan` was `createArc` with a wider
spread and a tilt, so once arc had those knobs the key was a knob position rather than a sample; `whorlHex`
and `whorlSquare` went the same way, being `createWhorl` with two spacings changed, and `whorlCircle` took
the plain name `whorl` — the same principle that gave `spot_1` the plainest key. Nine layout keys became
six, one per family.

**The gradients collapsed their suffixes and nothing else.** The axis of variation between sibling keys was
the suffix, so `c` became a `cycles` flag and `s` a `banded` one. Eighty-nine keys became fifty-one: sixty
-three timed became thirty-three, twenty-six tracked became eighteen. Every other difference — an arm count
of two against four, `diag`, a `v` grouping — stays a key of its own and is argued per family later, which
is the user's ordering.

**The collapse merged the variants that existed and designed nothing**, so eleven families came out of it
without a flag: the four `async` keys had no cycling twin, and `fill` and `elastic` had no static one. The
first write-up called that a rule, as though `fill` and `elastic` were exempt because cycling is their
identity; **the user corrected it** — neither family is exempt in principle, and `elastic` has since taken
its static position.

**`snake_async_3`, `orbit_async_3`, `orbit_async_2v1` and `merge_diag_async_4` carry no `cycles` flag by
design.** The user's call, and it is settled rather than pending: the four samples answer one group of
elements against another out of phase, and nobody has decided what cycling should do to that. Adding the
flag would be designing a look rather than collapsing two that exist. **Do not close this gap on the
strength of `elastic` having closed its own** — it was raised and declined. The words were "by design for
now", so the position may change; it changes when the user says so.

**`elastic` took its static position and went back to `_1`.** The off position of a cycle is the color it
starts on, so a static `elastic_circle` is the same clip painted flat in `primary` — the motion is the
sample's identity and is untouched by the flag, which is what makes the static form a real look rather than
an absence. Adding that sibling moves the family into the first case of the numbering rule, where the number
is what a viewer sees at any one instant, and for a flat fill that is one in both positions. So
`elastic_circle_3c` is `elastic_circle_1` with a `cycles` flag, and the same for `drip`, `semicircle` and
`inter_semicircle`. **The number has now moved three times** — `_3`, then `_1c`, then `_3c`, now `_1` — and
each move was the rule applying to a changed situation rather than a change of mind: the `_3c` reading holds
for a family with no static sibling, and this one has one.

**`fill` stays cycling-only, and that is the user's call rather than a consequence.** Its number counts the
walk, so a static `fill_2` and a static `fill_3` would both be a flat `primary` — the same sample under two
names — and only `fill_diag_2v2c` has a static form that distinguishes itself. The alternatives were to make
the static form paint the ramp its number names, which turns the flag into a change of geometry, or to drop
the family to one key with the walk length as a knob. Neither was taken; `fill` keeps the `c` and offers no
flag.

**`flow` is the only family that carries both flags**, which is why its parity was closed first: all sixteen
combinations exist, so neither flag has a ragged edge anywhere it appears.

**The tracked merges swap a mechanism rather than adding one, and that is the difference from the timed
ones.** A timed `c` sample is its plain sibling plus a `cycleSmoothColors` call, so the merge is that call
inside a `<Show when={opts?.cycles}>` and nothing else moves. A tracked one is not: the plain sample colors
each stamp by its **age**, banding the palette across the wake, while the cycling one colors each stamp by
**when it was born** against a clock. Both mechanisms now live in the file and the flag chooses, which is
about twenty lines apiece. Two smaller consequences: the two color-key lists were the same list under two
names and are now one `COLOR_KEYS`, and the clock's `keepAwake` — which the cycling samples call whether or
not the pointer moves, and the plain ones only when it does — is now one guard reading
`fade > NO_FADE && (opts?.cycles || moved)`. **`spot_ripple` needed a hand merge** where the other seven
were mechanical: its plain `getColors` takes the ring's own color, chosen by slot at the call site, where
the cycling one takes the whole palette, so the merged form takes the palette and the slot index and picks
inside.

**What a turned knob means for the key answered itself.** The question was what it means to pick `fan` and
then move the spread — the page still says `fan` while no longer showing it. With presets collapsed there is
no such key: the key names the family and the panel names the bag, and the two together are the entry. A
reader can see both at once, so nothing is misrepresented and no rule was needed.

**The conversion was checked against what the Playground actually painted, not by argument.** Every timed
key's gradient elements, stops, offsets, colors and `animate` values were recorded from the browser before
the change and after it: all thirty-four surviving keys came back identical, once the transparent-stop
spelling is normalized — the merged samples use `getTransparentColor` throughout where a plain sample used
to spell the same color relatively. Then every one of the thirty retired keys was reproduced by picking its
family and checking its flags, and all thirty matched their old recording exactly. The tracked eight were
checked the other way, since they are pointer-driven and have no static rendering to diff: each paints in
both flag positions and paints differently between them, and a sample with no flag offers no knob.

### `SVGDefsFrameUtils.createClock` is the shared animation frame for samples that fade rather than follow

**Why it exists.** Two tracked samples now advance while nothing is moving, and the loop they need is
identical: one `requestAnimationFrame` shared by every layer of the sample, a signal each layer reads for
the current time, and no frames at all when there is nothing to draw. Writing it twice would have been
twenty-five lines of stateful loop duplicated in two sample files, which is the kind of thing that drifts.

**Each sample gets its own clock, not one clock for the registry.** `createClock` is called once at the top
of a sample's module with that sample's own grace period, so a trail and a ripple whose marks live for
different times each stop at the right moment for their own content. It is also what keeps the
samples independent: a clock is alive only while layers of its own sample are mounted.

**It mirrors `PointerTracker`'s shape rather than inventing one.** A signal every consumer reads, a
`subscribe` that counts consumers and drops them on `onCleanup`, and a loop that stops when the count
reaches zero. The extra piece is `keepAwake`, which a consumer calls when it knows there is something to
animate; the loop then runs until the grace period has passed with nobody calling it again, which is exactly
the time the last thing on the surface needs to finish fading.

**It lives in `Samples/SVGDefs` rather than in `Abstracts`.** It is general enough to be an abstract, and an
abstract is where a future consumer would look for it — but every abstract in this library carries a
Playground entry, and promoting a frame loop to that status is a bigger call than two samples needed. It
imports no sample, so it satisfies the registry-separation rule where it sits, and moving it later costs an
import path.

### The gradient and pattern registries each get a page that paints them as a fill

**Both were menu entries with no page, and now have one.** The reasoning for entries without pages is under
_"Every abstract has a menu entry"_; these two earned a page because the only place either registry could be
seen live was `Shape`'s stroke, which is a few pixels wide. A gradient meant to sweep across a surface and a
tiling meant to repeat across one are both illegible at that width.

**The gradients page can paint either way, and defaults to the fill.** A dropdown swaps between
`computeFillDefs` and `computeStrokeDefs` on the same `Shape`, because the two read completely differently: a
sweep across a surface needs the surface, while a border is where most of these actually get used. The stroke
carries a fixed sixteen-pixel thickness rather than a control of its own — thick enough that a gradient reads,
and `Shape`'s own page is where thickness is the subject. The patterns page has no such switch; a tiling on a
sixteen-pixel band is a row of fragments.

**The tracked page carries two examples, and the second is a test rather than a gallery.** `Default` is the
single large box every other defs page shows, which is what a sample is judged on. `Continuity` is four
boxes in a 2x2 grid, and it exists because every tracked sample computes `boxRatio` against the element it
is painting — a single demo can never show whether two neighboring elements agree. Four of them can: park
the pointer on the grid's center and `spot_1`'s pool spans all four cells as one continuous circle, each
quarter drawn by a different element from its own reading. `hand_1` in the same position lights the inner
corner of each cell, four wedges each pointing at the cursor from its own center — correct, and looking
nothing like continuous. Seeing both is the point. Each cell keeps the resizable child, so the cells can be
given different sizes and checked again.

**The four cells are four of the first example, not a second copy of it.** `Default.tsx` exports the shape
itself alongside its example, and `Continuity.tsx` renders four of them with a smaller box class. The
alternative was duplicating the `computeSVGDefs` wiring into a second file, which would have meant two
places to keep in step for the sake of a source tab; as it is, `Continuity`'s source reads as what it is —
four of the thing next door.

**The demo is a `Shape` painted through those callbacks, and the sized box is its child.** `Shape` measures
itself from what it wraps rather than from a prop, so a fixed-size box placed around it collapses the SVG to
zero height. The resizable box therefore goes inside `renderChildren` and stays transparent, since a child with
a background of its own would cover the fill it is meant to show.

**Neither page passes interaction flags.** They exist to show the defs, and wiring `InteractionTracker` to the
demo would either make a display area focusable or hand it flags that never change. The ref reaches the sample
either way, which is what a pointer-driven one needs.

### Paint area: a gradient laid across a box other than the element it paints

**The drawer owns the area, not the sample** — the user's pick (option A) over an explicit field forwarded by every
sample. A gradient's positions are fractions of a box, and by default the box is whatever element it paints. A
drawer that splits one picture over several elements — `PaintedText`'s letters during a run, and the user's
example of a `TileBoard` whose tiles should read as one contiguous gradient — knows the area those elements share;
the 56 sample files that build gradients cannot. So the drawer provides it and each framework's two gradient
builders read it: Solid through `PaintAreaContextProvider`, React through the same name with a `paintArea` value,
Vue through a `PaintAreaProvider` component and Svelte through a `PaintAreaProvider` component. React's and Vue's
builders are plain functions that cannot read context, so each wraps its element in a small internal component that
reads the area and adds the two attributes; Svelte's gradients were components already. Vue and Svelte need a
provider component rather than providing from `PaintedText` itself, because providing there would also reach the
consumer's own content inside the painted text. The cost accepted with it: the link is invisible, and a gradient lays out
differently depending on where it is drawn. Outside a provider nothing changes, so `Shape`, `Glass` and every page
built before this are untouched.

**The area is applied as a transform, never by rewriting the fractions.** `SVGGradientDefsUtils.computePaintAreaAttributes`
sets `gradientUnits="userSpaceOnUse"` and puts `translate(x y) scale(width height)` in front of the gradient's own
`gradientTransform`. The fractions stay fractions, so the timed samples' `<animate>` tags, which move `x1`/`x2` as
fractions, keep working untouched, and a radial gradient's own transform still applies inside the area. An area with
no width or height yet is ignored rather than collapsing the gradient to nothing before the first layout.

**A tile would pass the board, offset by itself.** Each tile is its own drawing with its own copy of the gradient,
so its area is the whole board at `-tileX, -tileY`; that is why the area is a `Rect` and not a size. Not built yet,
and one thing is unchecked: each tile's timed gradient runs on its own clock, so a tile mounted later may run out of
step with its neighbors.

**A group of separate drawings shares paint through `PagePaintAreaGroup`, in the Playground.** Shape's _Shared
Paint_ example and the Tracked page's _Shared_ example lay four cells out in a grid; the helper measures each cell
against the group (corrected for the `Viewport` scale, since it reads screen rectangles) and gives each cell the
group's box shifted back by its own position. Each cell still renders **its own copy** of the gradient, under an id
of its own: one literal gradient referenced by all four would be laid out in each drawing's own coordinates and show
the same slice in every cell. The copies agree because they are built from the same settings and handed the
group's size and the group's element as `getSize` and `getRef`. That last part is also what makes pointer-tracked
paint work across the group without touching the tracked samples: the pointer is read against the group, the
paint is laid across the group, and the two agree.

**Clip paths read the area too, through `SVGClipPath`.** The hand samples showed the gap: their gradient was shared
across the group but their wedge-shaped clip was not, because the samples wrote `<clipPath clipPathUnits=
"objectBoundingBox">` by hand and nothing told it about the area. All sixteen such samples in Solid now write
`<SVGClipPath id>` instead, which reads the same context as the gradient builders and, given an area, switches to
`clipPathUnits="userSpaceOnUse"` with the area's transform (`PaintAreaUtils.computeClipPathAttributes`). Without an
area it is exactly the old element. All four frameworks have it; in Svelte the samples share one
`SVGSampleClipPath`, which is what goes through it there, plus the four hand samples that write their own.

**The Shape page's Default example resizes one box and clips another.** The "Clip children" knob cuts the child to
the shape's contour, and it used to cut the same box that carries `resize: both` — so the rounded corner of the
contour cut away the browser's resize grip, which was invisible and, since a clip also stops clicks, partly
ungrabbable. The resizable box is now unclipped and holds an `exampleSurface` that takes the clip, the padding and
the background. Shared Paint never clipped its boxes, which is why its grips were always fine.

**Only gradients and clip paths read the area.** Patterns were observed not to show the per-letter problem when the run was first
built, so they were left alone.

**A wrapper nested in a wrapper stays undefined, as it is today.** `Typewriter` inside `Typewriter` already
misbehaves — the outer one reads the inner one's hidden copy as well as its output — so the composition neither
causes nor fixes it.
