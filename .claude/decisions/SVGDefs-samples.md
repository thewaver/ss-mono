# Decisions: `SVGDefs-samples`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The gradient samples' tuning is props, composed rather than declared per sample

The per-sample defs pass gave the gradients a `cycles` flag and, on four of them, `banded`. Everything else
each sample was tuned with stayed unreachable — inline in the JSX for the timed ones, module constants for the
tracked ones. The user's correction of the shape: the mechanism for props that differ per family was already
there, it was the tuning that had not been separated.

**The opts are a small vocabulary that samples intersect**, rather than a bespoke type each:
`GradientStepsOpts`, `GradientGlowOpts`, `GradientTrailOpts`, and the pre-existing cycle and banded flags. A
sample says `GradientCycleGlowOpts & GradientTrailOpts` and gets exactly the props it honors; the entry
union says the same, so a knob a sample never reads cannot be handed to it.

**`steps` is the one number every animated timed sample shared.** All fifty-odd calls to
`getIntermediateValues` walked their sweep in twelve, whatever the sweep was — the endpoints are the sample's
identity, the count is its smoothness. Fourteen samples take it now and the default lives once, beside the samples'
other defaults, as `TimedGradientDefaults.STEPS_DEFAULT`.

**`bands` replaced four literal stop-key arrays.** The flows held a seven-entry array for the blended case and
a thirteen- or seventeen-entry one for the banded case, alternating two or three colors by hand.
`getCycleStopKeys` builds either from a repeat count, remembering the closing stop that lets the strip slide
without a seam, and each sample keeps its own two repeat counts as the defaults it had.

**The tracked samples keep their constants, which are now the defaults rather than the only value.** Every
one of the eighteen was gone through, at the user's word — _"expose what we can and then I'll ask to hide back
what we shouldn't"_ — and the numbers that shape an effect are all reachable: the radial falloff on the spots
and flares, the band's core and spread and how far it tracks, the hand's sweep arc and lead, the whole ripple
set from source size through ring count, spacing, start and end scale, decay and crest, the smear's speed
response, and the color walk's span and period. Nothing was retuned — every constant still holds the number
the user arrived at, and an untouched knob resolves to it.

**The opts reach them by bag rather than by parameter.** The values live inside module-level helpers —
`computePoolColors`, `computeSweepColors`, `computeGhostColors`, `getCycleColor`, and each family's stamp or
ripple creator — none of which can see the factory's `opts`. Rather than grow their parameter lists one value
at a time, each takes the sample's own opts type, which also folded away the `alpha, decay` pair an earlier
pass had added.

**A knob with no default reads as `NaN`, and on a number field that loops.** The gradient pages passed an
empty defaults map to the generic panel, which was harmless while every gradient knob was a checkbox —
`Boolean(undefined)` is `false`. The first number knob turned it into `Number(undefined)`, the field wrote
that back, and the page overflowed the stack before it painted. Both registries export a
`DEFAULTS_BY_FAMILY` now, the way the layouts always did, and the four pages that render gradient knobs read
from it. The lesson is the registry's, not the pages': a family that states a knob has to state the number
that knob starts at.

**What was deliberately left alone** is the mechanism: the frame interval derived from sixty a second, the
lifetimes computed from it, the grace period before a still pointer stops stamping, and the epsilon that
decides whether the pointer moved at all. A knob on any of those turns the effect's clock rather than its
look.

### A band's travel is the pointer projected onto the band's own axis, normalized

`band_diag_1` exposed its angle but kept its motion pinned to the diagonal it was built at: the gradient was
drawn at the angle asked for while the pointer offset was still decomposed along a hardcoded forty-five, so
turning the knob left the band sliding across itself instead of along itself. Three knobs on the band family
were declared, defaulted and never read at all — `band_diag_1`'s travel, and the travel on the second gradient
of `band_1v1`.

**The travel is one rule now, `projectBoxRatioOntoAngle`.** The centered pointer ratio is projected onto the
band's axis and divided by `|cos| + |sin|`, which is the largest that projection can reach inside the box. So
a drag from one corner to the opposite one moves the band by the whole of its travel knob whatever angle it
sits at, rather than by a factor that grows and shrinks with the angle.

The normalization was chosen because it reproduces both hand-written formulas exactly rather than replacing
them. At nought degrees it collapses to `x - 0.5`, which is what `band_1` wrote; at forty-five it collapses
to `(x + y - 1) / 2`, which is what `band_diag_1` wrote. Neither sample was retuned and neither moved a pixel
at its own default — the two were already the same rule, seen at two angles.

**`band_diag_1`'s stated travel default was wrong as well**, at `1`, against the `1.25` the sample was tuned
with. The knob was never read, so nothing showed it. Fixing the reading fixes the promise the registry makes,
and the default now says `1.25`.

**The same fault ran through the flares' ghost colors.** `spot_flare_2` and `spot_flare_3` declared ghost
saturation and brightness, defaulted them and painted from the module constants, because `toGhostColor` was
the one helper in those files that never took the opts bag — the pass that threaded opts through
`computeGhostColors` stopped one call short. It takes the bag now, like its neighbors.

**`band_1` and `band_1v1` keep their fixed horizontal and vertical**, at the user's word, and are not to be
offered an angle knob again. The travel rule reaching them costs nothing either way — at nought and ninety it
is the same arithmetic they already had.

**The lesson for the rest of the exposure pass**: a knob is only exposed once the value it names is read at
every place it is used. A helper the value reaches by module constant, a second gradient in a paired sample,
or a decomposition taken at a literal angle each swallow a knob silently, and the panel shows a control that
does nothing. Cross-checking the registry's keys against the sample's own reads is what found the four here.

### The hand's sweep is pinned across its arc, and a fade exponent says so in its label

**`sweepLead` is gone rather than defaulted**, at the user's word, and is the second narrowing after
`elastic_*`'s step count. The knob turned the gradient that paints the hand while leaving the clip arc where
it was, so any value but ninety slid the bright band off the wedge it is meant to fill and the sample stopped
reading as a hand at all. Ninety is not a tuned number: the gradient runs across the arc's bisector, which is
a quarter turn from the pointer by construction. It is written as `QUARTER_TURN` in the four hand samples
beside the `HALF_TURN` that was already there, so it reads as the geometry it is rather than as a value
somebody chose.

`GradientSweepOpts` is `sweepArc` alone now, and `hand_1` and the three `hand_trail_*` lost the prop.

**Two fade knobs are exponents and their labels now say so.** _"How fast the trail fades"_ and _"How fast a
ring fades"_ promised a rate, and the number is neither a duration nor a speed — it is the power that
remaining life is raised to, which the code has always called `STAMP_DECAY_EXPONENT` and
`RIPPLE_DECAY_EXPONENT`. One leaves the fade even; higher drops it away sooner. There is no unit to add, so
the labels name the shape instead: _"Trail fade curve (exponent)"_ and _"Ring fade curve (exponent)"_.

### The cycle time sits beside the cycle switch, and the smear has a one-color member

**A knob's neighbors are its panel order**, since the generic panel renders `KNOBS_BY_FAMILY` in the order
its keys are written. `cycleMs` had drifted to the far end of six families, several rows below the switch
that turns cycling on, so the number and the thing it governs were never on screen together. It follows
`cycles` directly now in all six.

**The two cycling ripples got the same knob, at the user's word.** `spot_ripple_2` and `spot_ripple_3` held
`CYCLE_MS` as a module constant while their trail, smear and hand equivalents exposed it, so those panels
showed a cycle switch with no period beside it.

The period needed a home in the vocabulary before it could reach them. It had only ever existed inside
`GradientColorAgeOpts`, bundled with `ageColorSpan`, and the ripples have no age-banded color walk to
justify taking that whole pair — while `GradientCycleOpts` is the bare switch that a dozen timed samples take
without any period of their own. So `cycleMs` is its own `GradientCyclePeriodOpts` now, `GradientColorAgeOpts`
intersects it rather than declaring it, and the ripple sample opts intersect it directly. Nothing else
changed shape.

**`spot_smear_1` is the one-color member the family was missing.** A trailing digit in this vocabulary is
how many of the theme's colors a sample paints with, and the smear had a two and a three but no one. It is
`spot_smear_2` without the color machinery — no cycle, no age-banded walk, everything primary — which is
exactly the relationship `spot_trail_1` has to `spot_trail_2` and `spot_ripple_1` to `spot_ripple_2`.

**It takes the family's shared opts type and simply declares fewer knobs**, rather than a narrower type of
its own. That is what `spot_trail_1` and `spot_ripple_1` already do: one opts type per family, and the
registry is what says which of them a given member honors. A precise per-member type would read better in
isolation and worse beside its neighbors, and the neighbors won.

Nothing in the Playground needed editing for it. The picker builds its groups from `SAMPLE_ENTRIES` and
groups by the leading word of the key, so registering the sample is the whole of it.

### A spot can hold its shape against the box, and the correction sits outside the smear's turn

A bounding-box gradient is measured in fractions of the element, so a radial gradient with a radius of
`0.4` reaches four tenths of the width across and four tenths of the height down. On a square element those
are the same number of pixels; on an oblong one they are not, and the spot paints as an oval. Nothing in the
samples chose that — it is what SVG does when no transform says otherwise, and the Playground's example box
is resizable, so it is reachable by dragging.

**Every `spot_*` sample takes a `circular` switch, off by default.** Off is what the family did before. On,
the gradient keeps its shape whatever the box does.

**The radius is taken from the shorter side.** Correcting onto the longer one would let a spot tuned at `0.8`
of the width balloon far outside a short box; the shorter side keeps it inscribed. It also means a square
element computes a correction of exactly one, so the transform is byte-for-byte what it was and no sample
moves at its default.

**The correction had to go into `getRadialTransform` rather than into the samples' `aspect`.** Six of the
twelve could have folded it into the aspect they were already passing — they pass no angle, so order does not
bite. The three smears cannot: they use `aspect` and `angle` together to stretch a stamp along its heading,
and the box correction has to apply to the result of that turn rather than inside it. The helper emits the
counter-scale between the origin translate and the rotate, so one field serves both cases and all twelve
samples ask for it the same way.

**What the switch does not do is make the arrangement round**, and the user accepted that when it was put to
them. A ghost's reach, a ripple's spacing and the pointer's own reading are all fractions of the box, so a
stretched element gives round blobs strung along an oval. Correcting those is a different piece of work — it
would change how the whole family measures itself, not add a knob.

**The size arrives as an accessor chosen at build time, not an accessor that may return nothing.**
`AccessorProps` strips `undefined` from what an accessor may return, on the grounds that an accessor
returning nothing is the same as no accessor. `circular` is a plain flag the factory reads once, so the
sample picks between an accessor and `undefined` rather than passing one that answers conditionally.

### A trail sample opens one pointer tracker, not one per stamp

A trail is 34 stamps plus the mark itself, and each stamp factory used to call `PointerTrackerUtils.create`
on the same element — so one sample instance ran 35 trackers, each calling `getAdjustedBoundingClientRect`
and `computeReading` every frame for a reading identical to its neighbors'. On the tracked-gradients page
that was around 420 rect reads a frame where 19 would do.

**The tracker is opened once at the top of `computeSVGDefs`, and the stamp factory takes `getReading` and
`getIsPointerPresent` rather than the ref.** Passing the two accessors rather than the whole tracker keeps
the factory's dependency visible in its signature and needs no type for the tracker itself. `create` opens a
`createEffect` and an `onCleanup`, so it needs an owner; `computeSVGDefs` always runs under one, which the
user confirmed.

**What the stamps still own is their own timing.** Each keeps its birth tick, its last origin and its last
movement time, which is what staggers them along the pointer's path — sharing the reading changed where the
numbers come from and nothing about what each stamp does with them. Twelve samples work this way:
`spot_trail_1..3`, `spot_smear_1..3`, `hand_trail_1..3` and `spot_ripple_1..3`.

### A tracked gradient's defaults have one home, and the samples read from it

Every default was written twice: once in `DEFAULTS_BY_FAMILY`, which is what the Playground panel starts a
knob at, and once as the module constant the sample falls back to when no knob is passed. Nothing tied the
two together and nothing complained when they disagreed, so the panel could paint one number while a consumer
importing the sample got another. Thirteen of them had already drifted apart.

**The registry is the home and the samples import from it**, the user's, in those words. Each sample holds
`const DEFAULTS = TrackedGradientDefaults.<FAMILY>_DEFAULTS` and every fallback reads a field off it, so the
number cannot be stated in two places again. The direction is safe: the defaults file imports only types, the
samples import the defaults file, and the sample registry imports the samples.

**The defaults compose rather than repeat.** Fourteen objects cover the nineteen samples. A family states its
numbers once and its cycling members add the two color knobs to it — `SPOT_TRAIL_CYCLING_DEFAULTS` is
`SPOT_TRAIL_DEFAULTS` plus the span and the period — which is where most of the seventy-six repeated entries
went.

**Two of the compositions cross a family line, deliberately.** `SPOT_FLARE_DEFAULTS` extends
`SPOT_DEFAULTS` and `SPOT_SMEAR_DEFAULTS` extends `SPOT_TRAIL_DEFAULTS`, because in both cases the base is
exactly contained in the extension and the relationship is real — a flare is a spot with ghosts, and a smear
is a trail whose stamps stretch. The consequence is that retuning a spot moves the flares with it. That is
the point of unifying, but it is worth knowing before changing a number.

**Where the two copies disagreed, the registry's value won.** The user had just retuned there, so the
registry held what they wanted and the constants held what it used to be. The rebuilt map was checked
value-for-value against what was on disk before the change, and nothing moved.

**`rippleStartScale` keeps its link to `sourceScale`.** A ring starts at the size of the source that threw
it, which the sample expressed by defining one constant as the other. Both now read a single
`RIPPLE_SOURCE_SCALE`, so the relationship survives rather than becoming two numbers that happen to match.

**The wide type on `DEFAULTS_BY_FAMILY` stays.** Four pages index it with a key that may be the
no-sample sentinel, so a precise object type would push a cast into each of them. The shared objects carry
the precise types the samples need, and the map is the loose page-facing view of the same values.

### A trail for the tracked patterns, and three more tracked gradient families

**A tracked pattern's cells can leave a trail**: a cell lights as the pointer passes and fades on its own afterwards,
from Fancy Components' pixel trail. It is one option, `trailMs`, on every tracked pattern rather than a new kind of
sample, so every layout has it — hexagons and triangles as well as squares — and the Playground gives every family a
trail knob. `TrackedPatternUtils.createTrail` remembers each cell's brightest recent level by the key the framework
gives it, `row_col`, and a cell shows the higher of its live level and what is left of that memory, eased back to
rest. Keyed by place in the tile, the copies of a repeating tile share one trail, so with `tiled: true` the trail
repeats in every copy. The clock is the samples' shared one, woken by the pointer moving, so it stops once the last
cell has faded. Three samples default to it: `square_g_trail_2`, `hexagon_pt_trail_2` and `triangle_t_trail_2`.

**`retentionMs` holds a cell where the pointer left it before the fade begins.** The user's idea and name. A cell
stays at the level it reached — fully grown, fully visible, whatever the sample's warm end is — for `retentionMs`,
then fades over `trailMs` as before. Only the cooling waits: a cell already shows the higher of its live level and
its memory, so moving back over a held or fading cell warms it at once. It defaults to `0`, which is the old
behavior, on all three default sets, and every family carries a knob for it. The memory already stored when each
cell was lit, so nothing new is recorded; `TrackedPatternUtils.computeTrailShare` turns the time since then into
"held whole, then easing out", and `getTrailSpanMs` is the hold and the fade together, which is how long each
framework's clock keeps ticking after the pointer last moved, since a clock that stopped after `trailMs` alone would
leave a held cell stuck lit. A hold with no fade is allowed and drops the cell to rest the moment the hold ends, so
`getHasTrail` is true when either is above zero. `createTrail`'s `computeLevel` now takes the resolved options as one
object rather than `trailMs` and `restLevel` positionally, since a third tuning number would have made five
positional arguments.

**Comets, a swarm and a pixel trail are tracked gradients, not components** — the user's ruling, since React Bits
draws the first two with WebGL and they are no different from `spot_smear`. Each is a family of three, `_1` to `_3`
by how many colors it uses, the way every other family is numbered.

- **`comet`** is three chains of soft stamps whose heads chase the point on a spring, each at its own pace, every
  body stamp easing toward the one ahead (`SVGDefsUtils.followChain`), thickest at the head. It was built as
  `ribbon_3` and renamed by the user, over `streamer` and `tendril`: a bright head with a fading tail is a comet. The
  first color's comet is drawn on top, the user's correction to the first build, which stacked the last on top.
- **`swarm`** is a handful of separate tracers, each a springy head wandering round the point on a path of its own
  (`computeSwarmTarget`, `stepSpring`) with a tail following it the way a comet's does. **The first build merged the
  spots into one liquid shape** — a blur-then-sharpen filter over spots painted into a pattern — and the user's
  verdict on seeing it was "flubber", not tracers; it was removed entirely rather than kept as an option, the user's
  pick over a knob defaulting to off.
- **`pixel_trail`** leaves squares where the pointer passed; it has an entry of its own below.

**On `_2` and `_3`, a comet or a tracer has a color of its own**, the user's pick over coloring each tail by age
the way the trails do. The tracers take the run of colors in turn; with `cycles` on, each moves through the whole
run over `cycleMs`, starting from its own place in it so neighbors stay apart (`computeTracerColor`). That leaves
two meanings of cycling side by side, and the user accepted it: on a trail the color follows age along the tail, on
a tracer it follows time.

**Every one of them is drawn as gradient stamps, never as a pattern.** Gradients and clip paths read the paint area
and patterns do not (_"Paint area"_ below), so a sample painted through a pattern draws the group's top-left corner
in every cell of a shared group — which is how the first pixel trail and the first swarm behaved on the tracked
page's _Shared_ example, where only the top-left box followed the pointer.

**A family is one builder and three named files.** `comet.tsx` exports `createCometSample(colorKeys, defaults)`
and `comet_1` to `comet_3` are one line each, so a key still has a file of its own, as the registry and the
package exports expect, while the three do not drift apart; the builder is not exported from the package. In
Svelte the builder is a `.svelte` file, since it draws, and the three named samples are plain `.ts` files, as the
timed samples there already are. The older
families repeat the whole sample per color count, and were left as they are.

### `pixel_trail`: squares snapped to a grid, which is not a pattern's `trailMs`

From Fancy Components' pixel trail, and what the user meant by that name: the pointer leaves squares behind it, the
way `spot_trail` leaves soft stamps, and each square's top-left corner snaps to an imaginary grid whose cells are the
square's own size. **It is a tracked gradient, not a tracked pattern option.** The pattern's `trailMs` above lights
many cells of a fixed grid at once by nearness and lets them fade; this lights only the squares the pointer actually
passed through. The user's distinction: on a pattern several cells are expected to be lit together, so the two are
different effects and both stay.

- **It is built the way `spot_trail` is, as the user asked**: a fixed set of stamp slots, here forty-eight, each a
  layer painted one flat color and clipped to its square. A new square takes the next slot, so the oldest square
  gives way first. The first build drew every square into one pattern instead, on the reasoning that a gradient
  alone draws no square; the user had asked for stamps, and a clip draws the square.
- **A fast movement leaves an unbroken run.** `SVGDefsUtils.computePixelTrailCells` walks the straight line from the
  last reading to this one through every cell it crosses, in order, rather than stamping only where each frame
  landed — otherwise a quick flick would leave squares a frame apart.
- **A square is laid only while the pointer is inside the box.** A reading from outside would draw a line from far
  away across the element; leaving and coming back starts a fresh run instead.
- **A square fades in a straight line over `trailMs`** (`computePixelTrailAlpha`); passing over it again lays it down
  anew. On `_2` and `_3` it takes its color from its age, or with `cycles` on, from the moment it was laid, as
  `spot_trail_2` and `_3` do.
- **The clock runs only while a square is still fading.** Each frame with a live square keeps it awake, and its own
  grace is one short beat, so it stops as the last square goes.
- **`squareSize` is in pixels**, as a tracked pattern's cell size is: it is the consumer's knob, and a square that
  grew with the box would turn a resize into a change of look. The defaults are Fancy Components' own.

### Patterns split into timed and tracked, the way the gradients are

Asked for by the user: the timed patterns' cells grow (the circles) or fade (the polygons) on a clock, and the
tracked ones do the same thing by how near each cell is to the pointer. **The layout mirrors the gradients
throughout**, the user's pick over a separate `TrackedPattern` registry beside `Pattern` and over a pointer switch
on each existing sample: `SVGDefsSamples.Pattern.Timed` holds the old registry unchanged, `Pattern.Tracked` holds
factories with entries and `toConfig`, the files sit under `Pattern/Timed/` and `Pattern/Tracked/`, the menu has an
`SVGPatterns` group whose first page is the generator's, and the paint picker offers both as two kinds. Every
consumer of the old `Pattern` namespace — the shape page, painted text, cell animation, the drawn sources — moved
to `Pattern.Timed`. The cell animation and the drawn sources stay timed-only: they serialize a pattern into an image,
and an image has no pointer.

**The two whirls have no tracked form.** They are a clipped radial gradient rather than a grid of cells, so there is
nothing for a per-cell level to drive.

**A tracked key adds what the cells do** — `circle_g_grow_2`, `hexagon_pt_fade_2` — between the layout and the color
count. The bare timed names are exported at the package's top level, so the tracked ones need names of their own.

**What a tiling repeats is the decision the samples hand to the consumer, as `tiled`.** A pattern is one tile the
browser repeats, and every copy is drawn from the same single set of cells, so a cell lit by the pointer is lit in
every copy. Two answers, each with a real cost, and the user's call was to make it a prop rather than pick:
`tiled: false`, the default, draws one tile reaching across the whole painted area
(`TrackedPatternUtils.computeCoveringCellCount`), so only the cells near the pointer react, but the cell count follows
the area — 441 cells at a 20-pixel cell in the 420-pixel example box; `tiled: true` draws the timed patterns' fixed
8 × 8 tile and lets it repeat, which stays cheap but lights the same spot in every copy. Coverage grows the **count**,
never the cell: the cell size is the consumer's knob, and growing it would turn a resize into a change of look.

**Distance is measured in cells, and on a repeating tile to the nearest copy of the pointer.** Cells, not pixels, so
`reach` keeps its meaning as the cell size changes and stays round on cells that are not square. The nearest copy is
what makes a cell at one edge of a tile answer to a pointer just past the other edge, so the lit spot crosses a seam
without a cut. The level eases from `restLevel` to `1` rather than in a straight line, so the lit area has a soft edge.

**A layout's requested count is the tile's size in whole cells, which the lozenge and the triangles did not honor.**
Their rows (the lozenge, the sideways triangle) or columns (the upright triangle) step half a cell, so the samples'
8 × 8 request drew a tile 8 cells one way and 4 the other, and square cells repeated at twice the distance across as
down. The user saw it on a tiled lozenge; the timed samples had always had it. Fixed in the layouts rather than in
each sample's request, the user's pick: `diagonal`, `triangle` and `triangle_sideways` double the request along their
half-step axis, so an even request now gives a tile exactly that many cells each way, as `grid`, `half_shift` and
`half_drop` already did. **The hexagons are left as they are**, the user's call: their rows overlap by a quarter of a
cell, so their tile is 8 by 6 at the same request, and the user accepts that as the shape's, since a hexagon is not
square to begin with. An exactly square hexagon tile exists only at multiples of six cells. `TrackedPatternUtils`
hands the layouts a request in these same units and leaves the converting to them.

**Each framework draws the cells its own way, over one shared piece of arithmetic.** `TrackedPatternUtils` works out
the count, the pointer in pattern units and each cell's level; `SVGPatterns.computeTrackedLayoutPattern` in each
package feeds those into the existing layout builder. Solid rebuilds the pattern only when the cell count changes and
lets each cell's attribute follow the pointer on its own; React, Vue and Svelte redraw the pattern on every pointer
move, as their tracked gradients already do. Svelte has two cell components of its own,
`SVGPatternTrackedCircleCell` and `SVGPatternTrackedUseCell`, because its timed cell components carry the
`animate` element.

### Lighting primitives: the surface is turbulence, and the light is what moves

**`feSpecularLighting` and `feDiffuseLighting` each arrive as a whole four- or three-step chain, not as one
primitive.** Both read one channel — transparency, treated as height — and both produce something that cannot
be drawn on its own. Specular output is not opaque and has to be added back with
`feComposite operator="arithmetic"` at k2 and k3 of 1, after being clipped to `SourceAlpha`; merging it like an
ordinary layer makes it vanish. Diffuse output is opaque and multiplies instead, k1 of 1 and the rest zero.
Hiding that behind one `add…Filter` call is the point: a consumer asks for lighting and gets lighting, rather
than four primitives they have to wire in the right order.

**The height map is turbulence, and its settings ride with the lighting defs rather than being a separate
call.** Lighting a flat opaque shape produces nothing at all, so a surface is not optional and there is no
sensible default that is "none" — asked for by the user in exactly those terms, that some degree of turbulence
comes along with the filter's own options. The alternative surface, a blurred copy of the alpha, is what turns
an edge into a bevel rather than a texture; it is not built, and adding it would mean the surface becomes a
choice between two shapes rather than a set of numbers.

**These two set `color-interpolation-filters` to sRGB and nothing else in the factory does.** Filters run in
linearRGB unless told otherwise, which makes a highlight noticeably hotter than the same color anywhere else
on the page. Setting it on the whole `<filter>` would change how every existing filter in the library paints,
so it is set on the elements of these two chains alone. Nothing already built moves.

**Nothing reserves extra filter region for them.** A blur or a displacement grows outside the element's box and
`maxOffset` exists to pay for that. Specular is clipped to `SourceAlpha` and diffuse is multiplied into the
source, so both stay inside the shape, and neither touches the region arithmetic.

### `spot_1`: the same idea with no filter at all

**A radial gradient whose origin is the pointer reading, and nothing else.** `boxRatio` is already 0–1 and a
radial gradient's `cx`/`cy` are object-bounding-box units, so the origin is the reading passed straight
through — where the specular version has to multiply by the element's size every frame to place a point light
in pixels. There is no filter, so no turbulence pass and no lighting pass: the whole sample is four color
stops and an accessor.

**The falloff is a stop list, which is the point.** The lighting version steers one fixed curve with four
numbers — light height, exponent, constant, surface scale — and cannot produce a small hot core with a long
soft tail, because a single specular lobe has one width. Stops place the core, the mid and the transparent
edge wherever they are wanted, independently. That is why the user asked for this one after seeing how much
work the filter needed to approximate the same shape.

**It stays in the registry where the glass sheen no longer does.** It is a gradient, interchangeable with
every other gradient, and it needs nothing beyond the uniform `defs` bag — which is exactly the test the glass
sheen failed. See _"The sheen left `Samples/SVGDefs/Gradient`"_.

### `glass_sheen_1`, and what a pointer-driven sample looks like

**It is a gradient sample whose filter slot carries the moving part.** The color ramp is an ordinary vertical
linear gradient; what follows the pointer is an `fePointLight` inside a specular chain, positioned from
`PointerTracker`'s `boxRatio` times the element's own size. When no pointer is present — and in the gallery,
where the sample is serialized against a detached SVG with no element at all — the ratio rests at the center,
which is what the still image shows.

**The tracker is created inside `renderDefsElement`, and the light's x and y are accessors.** Both follow from
the rules recorded under _"A sample reaches its host through a ref"_: the top level of `computeSVGDefs` is
called speculatively and must stay free of lifecycle, and a value read in the body of `renderDefsElement` would
rebuild the filter on every pointer frame.

**The distortion and the blur are applied to the lit image, not to the source, and the order is the whole
trick.** The three primitives run chained — specular lighting, then displacement, then blur — because the
shape being filtered is a flat translucent white. Warping a uniform color changes nothing that can be seen,
so displacing the source first would be invisible; displacing the _highlight_ is what makes the light look as
though it is coming through rippled glass. The blur last is the fog, and it softens the edge the displacement
has just made irregular. The ripple is a coarser, slower noise than the lighting surface — frequency 0.012
against 0.05 — so the pane warps in broad waves while the sheen keeps its fine grain.

**It does not distort what is behind it, and cannot.** An SVG filter can only reach the element it is applied
to; bending a real backdrop needs `backdrop-filter: url(#…)`, which Chromium honors and Firefox and Safari
ignore outright. So this is a pane that ripples its own light rather than the page beneath it, and a sample
that had to bend a real background would have to put that background inside the filtered element.

**Its numbers were chosen against a fill, not against a stroke, and that is a real limitation.** A specular
pool is a wide soft thing; on a four-pixel border it is a sliver and reads as a faint tint however it is tuned,
while on a filled box it reads as a lamp. The settled values — light height 28, surface scale 1.6, specular
constant 1.7, exponent 8, grain frequency 0.02 over two octaves — came from a sweep of that space rendered as a
grid and read by eye. They are deliberately gentler than the sketch the user pointed at, which uses a coarser
surface and reads as hammered metal rather than as a sheen.
