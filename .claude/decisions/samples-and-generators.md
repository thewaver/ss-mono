# Decisions: samples-and-generators

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Samples live in the library

`components/src/Samples` holds what was `playground/src/App/Samples`: nine registries and the ~198 sample files
under them. The user's call, argued from what it buys rather than from where the files started — which is
where they started, before the Playground existed.

**What it buys.** The `@components` alias disappears, because a sample reaching `CellAnimation.utils` is now an
ordinary relative import inside one package, which also retires the DOM-test-environment question the alias was
parked on. The source view loses the whole sample-tab mechanism for free, since `components/src` was already
opaque to it. And a consumer imports a sample instead of copying it out of a page.

**A consumer pays only for what they name.** Every sample is re-exported individually from `index.ts`, so
`import { lineRow }` pulls one function and nothing else. Measured against the built `dist`, bundled with
esbuild, minified / gzipped: **5.7K / 2.4K** for one sample and its machinery, against **19.2K / 5.9K** for the
registry that names all sixty. This only works because _"a sample registry and the machinery that runs it are
separate modules"_ landed first — with the machinery still importing the lookup table there is no light path
to offer, and the move would have made every consumer pay for the whole collection.

**The two `plain` files are the one name that could not travel unchanged.** `Pattern/plain` and
`Gradient/plain` collide at the top level, so `index.ts` exports them as `patternPlain` and `gradientPlain`,
which is what the registries already called them internally. Every other sample is exported under its own name,
and the file-name-is-the-key rule is intact inside the registries.

**`SVGDefsSources` and `SVGDefsUri` did not go with them**, and are now
`playground/src/App/PageComponents/SVGDefsSources`. They are not samples: they render sample defs and serialize
them to a data URI so `CellAnimation`'s drawn sources have something to animate. That is Playground furniture by
the _"three trees"_ definition, it needs a DOM, and keeping it out of the library keeps page tooling off the
published surface. Its source tab still works, because it is Playground-side.

**What the tests did with the move.** The seven sample specs run under the library's Vitest now, in the same
plain-Node environment they always used — which was the alias's entire justification. Nothing about them
changed.

### How Samples is laid out

The user's restructure. Every registry is `<Component>/<Part>` — `CellAnimation/Weights`,
`Formation/Layouts`, `Staircase/Indents` — so the top level of `Samples` reads as a list of the components
that have samples, and a second part slots in beside the first without a folder having to be invented later.
Three of the four parents hold a single child, which is the point rather than an accident.

**Only the folder names are short; files keep their full names.** `SliceAnimation/Weights/SliceAnimationWeights.const.ts`
still exports `SliceAnimationWeights`, and no name in the published API moved. The user's call between that and
shortening the files too, which would have broken the file-is-named-after-its-namespace rule for a folder depth
that already says `CellAnimation`.

**A middle `Samples/` layer is kept only where the samples are loose files.** `Weights` and `Keyframes` have
one because dropping it would strew sixty files in with the const, the types and the utils; `SVGDefs` lost its,
because its three sub-registry folders already do that job and a folder called `Samples` inside a tree called
`Samples` said nothing.

**What belongs in `Samples` at all, which is the line the restructure drew.** A sample is something a consumer
might plausibly reach for to get something working quickly. `MosaicImages` was not — the mosaic shapes and
their generated placeholders exist only to give one Playground page something to draw — so it left for
`playground/src/App/Pages/Mosaics/ImageMosaicPage`, is exported from nowhere, and the page imports it as a
local file.

### `Generators/` holds the code that computes things a component is handed, and `Samples/` keeps the examples

The user's call, taken in two steps. The SVG defs had examples, so they could not stay in `Abstracts`, whose
entries carry none; they went to `Samples` first, which broke three things at once — library components
(`Glass`, `Surface`, `GlassSurface`, `Shape`) depended on a folder meant for examples, the pages lost their API
and dependency lists because both leave samples out, and the accepted limit that nothing in `components/src`
depends on sample code stopped being true. **A layer of their own fixes all three**, and the user widened it
to everything in `Samples` of the same kind rather than the SVG defs alone.

**The test is whether a consumer calls it to produce something to hand a component.** That catches the four
SVG families, `PlacementLayoutUtils`, `ProximityEffectUtils`, and the cell animation's keyframe, weight,
breakpoint and zone builders. A registry of sample entries, a sample itself, and the helpers only the samples
use — `SVGDefsUtils`, `SVGDefsFrameUtils` — stay in `Samples`. Each generator took its own types and its
defaults with it.

**The name is `Generators`, not `Factories`.** `Abstracts` is already described as namespaced utilities and
hook-like factories, and holds twenty-eight `create…` functions, so `Factories` would name a thing another
layer already is and leave a new `createSomething` with two plausible homes. `Generators` collides only with
JavaScript's `function*`, of which the repo has none. It passes the layer-name test under _"Layering"_: nobody
builds a `Generator` component.

**The folders are named after the pages**, so the unit name is the folder name and nothing needs a table:
`Generators/SVGDefs/SVGFilters`, `SVGGradients`, `SVGPatterns` and `SVGAnimations`, with the shared `SVGDefs`
output type at `Generators/SVGDefs/SVGDefs.types.ts`, and `Generators/PlacementLayouts` and
`Generators/ProximityEffects` beside them. The SVG families sit in an `SVGDefs` family folder, as
_"A family is a folder"_ has it. The menu's `Generators` section mirrors that, with the `SVGDefs` branch as it
was and a page each for the layouts and the effects.

**The breakpoint and zone tables became generators of their own, split by what they hold.** They arrived as
`SliceAnimationBreakpoints.const.ts` and `CellAnimationZones.const.ts`, each one namespace mixing constant
lists, types and callable functions — so the Docs view skipped the functions, being `.const`, and nothing
documented them. The user's call: the lists stay in the `.const.ts`, the types go to a `.types.ts` as
top-level names (`SliceAnimationEasing`, `SliceAnimationBreakpointTriple`, `CellAnimationZoneType`), and the
functions go to a documented `.utils.ts` as `SliceAnimationBreakpointUtils` and `CellAnimationZoneUtils`. They
got a folder each rather than joining `CellAnimationKeyframes`, which reads both, because
_"One namespace per folder"_ in `conventions.md` would otherwise have put three namespaces of functions in one
folder, and because `ScanlineAnimation` times its lines with the breakpoints too and should not have to reach
into the cell-animation keyframes to do it.

**`SliceAnimationPlayback` joined them in the file-kind sweep that followed.** Its functions turn elapsed
time into a timeline position for any duration and direction the caller has, which is the reusable side of
_"A small thing used only where it is declared stays there"_ in `conventions.md`, so it took the breakpoints'
shape: `DIRECTIONS` in the `.const.ts`, `SliceAnimationPlaybackDirection` and `SliceAnimationPlaybackOpts` in the
`.types.ts`, `SliceAnimationPlaybackUtils` in a documented `.utils.ts`, and a page under `Generators`.

**The rest of that sweep found everything outside `Samples` already in order, and most of `Samples` stays.** The
registry lookups (`CellAnimationKeyframes.computeAnimation`, `SliceAnimationWeights.computeSliceWeights`,
`CellAnimationOrigins.computeOrigin`, `Timed.toConfig`), every `SampleKey` and the samples that are themselves
functions stay in their `.const.ts`, being local to the table they serve. So do `SVGAnimationTracks` and
`BracketConnectorPaths.getSpine`, small helpers that exist for the entries beside them. Two things moved.
The scanline effects' option types went to `ScanlineAnimationKeyframes.types.ts` as top-level names
(`ScanlineHorizontalSnakeOpts`; the underscored draft effects keep their underscore), because pages read them.
And `SVGDefsFrameUtils.createClock` joined `SVGDefsUtils`, which leaves `Samples/SVGDefs` one helper namespace
besides its registries, as _"One namespace per folder"_ asks; `SVGAnimationTracks` could not join it too,
since `SVGDefs.utils.ts` imports the filter factory and a test of the tracks would then pull JSX in.

**Knob descriptions left the library entirely.** The user's rule, recorded in `conventions.md`: the library
keeps a tunable's default and the Playground owns its range, step, label and hint. So each `<Subject>Knobs`
namespace in a `.knobs.ts` became a `<Subject>Defaults` namespace in the subject's `.const.ts`, holding the
`*_DEFAULTS` objects and `DEFAULTS_BY_FAMILY` under the same member names — a namespace rather than loose
constants because two subjects both have a `BAND_DEFAULTS`, and because the plain names `PlacementLayouts` and
`ProximityEffects` already belong to the sample registries. The descriptions went to
`playground/src/App/Knobs/<Subject>.const.ts` under the old `<Subject>Knobs` names, one file per library
subject, on the user's call over keeping them in whichever page first used them: the timed gradients are read
by two pages and the tracked gradients by two others, and a file named for the subject is owned by no page.
**Every knob value lives in `Knobs/`, not only the shared ones.** The user's call, taken afterwards over the
first build's rule that a page's knobs for options of its own stayed in the page. It covers the knob records
and their defaults tables — `ParticleSpawnerPage`'s travel knobs are the case that prompted it — and also the
loose minimum, maximum, step and starting value of every hand-built slider, number field and dropdown that
tunes a demo, each page's under a `<Subject>Knobs` namespace in `Knobs/<Subject>.const.ts` keeping the
constants' old names. **Nothing about a knob stays in the page**, on the user's further call: a starting value
that was written inline where the signal is made gets a name there too, and a dropdown's list of choices is its
range and moves with it. **A knob that starts at the library's default is the one exception**: it reads
`<COMPONENT>_DEFAULTS` where the signal is made, as most pages already did, because there is no number of the
Playground's own to state and a `Knobs` constant would only restate the library's. What stays in the page is
what the example itself is made of: a range handed to the component being shown, as `NumberInputPage`'s
quantity field has, is the example's content rather than a control tuning it, and so are an example's own
state and layout sizes. Patch Board's zoom range is the example's for that reason — its
buttons are part of what the example shows, and the example's source is on the page. **Text is the exception:
any string written identically in all four frameworks lives once, in the shared Playground**, on the user's
call — an example's labels and content lists included, because a reader of the example's source gains little
from the literal words behind a well-named constant. A knob's label, hint and "Sets …" line travel as one
`<NAME>_TEXT` record in its `<Subject>Knobs` namespace, spread into `PageProp`; a docs section's title and
paragraph as one entry of the page's `DOCS_SECTIONS` in its shared `.const.ts`; an example's strings and
content lists as named exports of that same file. Page-level `ariaLabel`s on knob fields stay inline, by the
same call, since they sit beside the control they name. The
knob types went with them into `PageComponents/Knobs/Knobs.types.ts` as `Knob`, `NumberKnob`, `CheckKnob`,
`KnobFor` and `Knobs`, and `Samples/Samples.types.ts`, which held nothing else, is gone. `TimedGradientDefsOf`
and `TrackedGradientDefsOf` stayed in the library beside the entries they read, because the defaults need them
as much as the knobs do.

**`FormFieldOrientation` was named so its lookup could move.** `FormField`'s orientation was written inline in
its props type, so the Playground's list of the two values had nothing to be typed against in the library.
Naming the union is an addition rather than a change, and `FORM_FIELD_ORIENTATIONS` sits beside
`FORM_FIELD_DEFAULTS` under the lookup rule in `conventions.md`. Its order is vertical first, the default,
because that is the order the Playground's dropdown showed.

**Generators are a group of their own in Uses and Used by**, between abstracts and primitives, and a generator
folder is a unit as a whole in the dependency map, the way an abstract folder is. `Surface`, `GlassSurface`
and `Shape` list no generator, because they take only the `SVGDefs` type and a type import runs nothing.

### Samples: one file per key, and the key is the file's name

The same decision from the other end, and why `Samples/` had to be reorganized first.

**A sample is a file, and the registry is an index that imports them.** `SVGDefs.const.tsx` was 2534 lines
holding three registries; a tab showing it would have been useless whatever it cost to load. Splitting was
never about weight — the source is fetched on demand — but about a tab a person can read. That tab is gone now
that the samples ship from the library, and the split earns its keep on a second ground it did not have at the
time: one file is what a consumer can import on its own. See _"Samples live in the library"_.

**The key is the file's name, which is what lets a runtime selection find its source.** The example imports the
whole registry and indexes it with a key from the props panel, so nothing in its own imports says which sample
is showing. Rather than tracing that, the modal resolves the key to `<Registry>/<key>.ts` by name. Two
mechanisms that never have to know about each other: the example's imports give the general tabs, the current
key gives the sample tab. It also makes renaming a sample and renaming its file the same act.

**Keys collide across registries, so the samples sit one folder down per registry.** `plain` exists in both
`Pattern` and `Gradient`; `Samples/SVGDefs/Gradient/plain.tsx` keeps the name-is-the-key rule intact.

**Nothing is folded into a factory.** `circle("grid")` produced three of the pattern samples from one helper,
and a file whose whole content is that call teaches nobody anything — the reader still has to open a second
tab. Each sample is written out. The line, taken from what `Gradient` already did: the sample's own **shape** is
explicit, while small shared helpers that are not the point of any sample — a base color, a diagonal offset —
stay shared and get a tab of their own when opened. The total line count goes up, deliberately.

**A registry is only split when a tab of it would be unreadable, which is not every registry.** The tab is
gone; the line it drew is kept, now read as "unreadable in one file". Which registries are split has not moved.
`CellAnimationZones` and `CellAnimationOrigins` are 71 and 31 lines of one-line entries, and splitting those
produces files shorter than their own import headers — the same emptiness that unfolding the pattern factories
avoided, from the other direction. They get a folder and keep their registry whole. The rule is the goal
restated: split until a tab reads, and stop. Split so far: `SVGDefs` (2534 lines), `CellAnimation` (600),
`SliceAnimationWeights` (515). Left whole: `CellAnimationZones`, `CellAnimationOrigins`,
`CellAnimation/Breakpoints`, `ScanlineAnimation/Keyframes`, the largest at 123 lines.

**A Playground namespace may not share a name with a library one, and the source view is what makes that a
rule.** The keyframe helpers were `CellAnimationUtils`, which `Lib/Exotics` already exports for something else
entirely. Two namespaces of one name is legal and nothing imported both, so the collision cost nothing while the
code was only ever read in an editor that could tell you which was which. A tab is read **out of context**,
which is exactly the confusion a tab cannot resolve. The Playground one is now `SliceAnimationKeyframeUtils`.

Two smaller rules fell out, both house style everywhere else and broken only in the files this split created.
**A `.utils.ts` exports a namespace**, like `InteractionTracker`, `TreeUtils` and `SelectUtils`; `SVGDefsUtils`
and `SliceAnimationWeightUtils` were bare exports and are not any more. And **the folder path names the
namespace it exports** — the keyframes folder was `CellAnimation/` while exporting `CellAnimationKeyframes`.
Since the restructure the path carries it in two parts rather than one: `CellAnimation/Keyframes` exports
`CellAnimationKeyframes`, and the file inside still holds the whole name. See _"How Samples is laid out"_.

**What is not shipping, and why it looks as though it should.** `fromStops` and the 3×3 matrix maths beside it
turn a list of keyframe stops into the evaluation function `CellAnimation` asks for, so a consumer wanting
keyframes rather than a formula writes their own. That is real, and it is still not the library's: the
component's contract is already the smaller and more general thing — a function from timeline to result — and a
stop list with `at`, `depth` and origin keys is one **opinion about how to author** such a function. Shipping it
would freeze that opinion as API for a consumer nobody has met, which is the layer item 2 in `backlog.md`
plans. The matrix half is a different case: it needs only the language to work, which is the `ss-utils` test,
and that package has `Vec2d` and `Vec4d` but no matrix — noted as a candidate rather than moved, because one
consumer is a thin case for an export in another repo.

**Types move to `<Name>.types.ts`, and they stop being a namespace.** A sample file needs the config type and
the registry needs the sample files, which is a cycle, so the types have to come out. They cannot come out into
a namespace of the same name, because a `namespace` does not merge across ES modules and any file wanting both
would import one identifier twice. Plain exported type names are what the rest of the repo uses (see _"House style"_ in
`conventions.md`), and the namespace stays on the value side only.

### A sample reaches its host through a ref, and gets there under its own steam

**`computeSVGDefs` takes a third argument: an accessor for the element the defs are painted onto.** The
signature is `(id, getInteractionFlags, getRef, defs)`. It was weighed against folding the flags and the ref
into one object in the second slot, which would have spared all forty-eight samples a third `___` placeholder
and made a fourth kind of context free to add later. The user chose the positional argument knowing that.

**Two channels, because they carry different kinds of fact.** The ref reaches everything physically
observable — pointer position, the element's box, its computed styles, any event on it. The flags reach what
the app knows and the DOM does not: `hasError` is nothing a measurement can find, and neither is a progress
ratio or a selection. Neither channel substitutes for the other, which is why the ref did not replace the
flags and did not replace `getSize` either.

**`getSize` stays even though a ref could yield a size.** `computeSVGDefs` is called where no element exists:
the Playground's gallery serializes each sample against a synthetic 1200×1200 box that never enters the
layout, and `Surface` probes it three times against a mock 0×0 to decide whether the result is a plain color,
in which case it draws a div and no SVG at all. Size is a parameter of the drawing; the ref is a handle on a
host that may not be there. Both are therefore optional-tolerant, and `PointerTracker` already rests when its
ref accessor returns nothing.

**A sample subscribes for itself, inside `renderDefsElement`, never inside `computeSVGDefs`.** That top level
is called speculatively — the three `Surface` probes throw the result away after reading one field — so
anything with a lifecycle created there would be built and discarded for nothing. `renderDefsElement` runs
under a real owner in both places that call it, which is what `createAnimateDefs` has always relied on for its
signal and its `onCleanup`. The consequence the user accepted: a sample dropped somewhere that supplies
neither ref nor flags draws its resting frame and says nothing about it. The gallery is exactly that case, and
its still image is the resting frame by construction.

**Structure is fixed when the element is built; values vary afterwards.** `SVGLinearGradientDefs` and
`SVGRadialGradientDefs` now take accessors for geometry and for the color array, and those reach the DOM as
attribute-level updates — `cx`, `r`, `offset`, `stop-color` change in place on a live element. What stays
plain is anything that decides how many nodes exist: `spreadKind`, and the length of the color array, read
once through `untrack`. The reason is not taste. Reading a varying value in the body of `renderDefsElement`
re-runs the enclosing expression, Solid rebuilds the whole `<linearGradient>`, every `<animate>` inside it
gets its `ref` callback again and `beginElementAt` restarts the animation from zero — a visible jump on every
hover. The same rule explains the stop ids: `SVGAnimations.Gradient.cycleSmoothColors` targets
`#<id>-stop-<i>` by `href`, so a stop that could appear or vanish would leave an animation aimed at nothing.

**The coordinates handed to the `custom` callback are the initial ones, read through `untrack`.** They feed
SMIL `values` lists, and a running SMIL animation given a new `values` does not agree with itself across
browsers. So an animated sample and a state-reactive sample are the same mechanism at different depths: the
animation owns the attribute it drives, and anything reactive drives a different one.

### A sample registry and the machinery that runs it are separate modules

**The samples' machinery takes the sample itself**; the registry that maps a name to a sample is its own export in
the `.const.ts`, and only code driven by a runtime string — the Playground's dropdowns — touches it.

**Why file layout alone did not achieve this.** The samples were already one file each, and that made no
difference to what a consumer pays for: `SliceAnimationWeights.const.ts` imported all sixty back into a
`Record<WeightType, WeightFn>` and `computeSliceWeights` looked its entry up by a string. Splitting the registries
was for the source-view tabs and remains justified on that ground alone.

**What moved.** `computeSliceWeights` (with its private `normalizeWeights` / `makeWeightsUnique`) went to
`SliceAnimationWeights.utils.ts` and now takes a `WeightFn`. `computeAnimation` went to
`CellAnimationKeyframes.utils.ts` and now takes a `SliceAnimationFn`. Each `.const.ts` exports its registry as
`SAMPLE_WEIGHTS` / `SAMPLE_ANIMATIONS`, matching the `SAMPLE_CONFIGS` / `SAMPLE_LAYOUTS` / `SAMPLE_INDENTS`
names the other registries already used.

**The key-based call is kept, as a one-line forwarder in the registry module.** `SliceAnimationWeights.computeSliceWeights("line_row", …)` still works and every Playground call site is unchanged. This is not two APIs
competing: the forwarder lives in the module that already costs the whole collection, so anyone paying for the
registry keeps the ergonomic call, and anyone who wants one sample imports the sample and the utils module.

**Measured, bundled with esbuild, minified / gzipped.** Weights: 19.4K / 6.0K for the registry path against
5.7K / 2.5K for one sample. Keyframes: 27.3K / 7.1K against 13.7K / 4.8K. Both figures include each utils
namespace whole.

**Two shapes needed nothing.** `SVGDefs` was already correct — `SVGDefs.const.ts` holds only `SAMPLE_COLORS`
and the three `SAMPLE_CONFIGS` registries, no sample imports the registry, and every helper the samples use
(`SVGDefs.utils`, `SVGPatterns.const`, `SVGAnimations.const`, `SVGAnimationTracks.const`) is sample-free. The
registries left whole under the split rule — `CellAnimation/Zones`, `CellAnimation/Origins`,
`CellAnimation/Breakpoints`, `ScanlineAnimation/Keyframes`, `Formation/Layouts` and `Staircase/Indents` —
define their samples inline in the same file, so there is no lighter path to offer without
splitting them, which _"a registry is only split when a tab of it would be unreadable"_ already decided
against.

### A sample looked up by name checks the name is the registry's own, and fails loudly when it is not

Every registry read by a name — the zones, origins, keyframes, weights and easings, the pattern layouts
(`SVGPatternLayouts.getLayout`) and each framework's `SAMPLE_FACTORIES` — checks `Object.hasOwn` first and throws an
error naming the registry and the missing name, per `code-pitfalls.md`. The names are typed as fixed lists, and there
is no sensible fallback for an unknown one, which is why it was first left alone: the check trades one failure for
another. **The user's call was to take it anyway**, because the failure it trades away is the silent one — a name like
`constructor` finds `Object`'s own function and calls it — and the one it trades in says what was asked for.

**`sequence_reverse_binary` visits every cell exactly once, whatever the cell count.** It walks the place numbers up
to the next power of two in bit-reversed order and skips those at or past the count, so a count that is not a power of
two no longer gives two cells the same turn (a 2 by 3 grid used to get places 0, 4, 2, 0, 1, 5). The order for the
last count used is kept, since every cell of one grid asks for the same one.
