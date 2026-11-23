# Decisions: ss-utils

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### What goes to `ss-utils` and what stays here

Settled by the user, when `@internationalized/date` was taken as a dependency.

**`ss-utils` is bare: it implements logic on top of nothing.** That is the line, not "maths versus
layout". A primitive needing only the language belongs there. A module adapting a third-party package
to this library's shape stays here however mathematical it looks, because sending it would put a
dependency inside a package whose value is having none.

So `Abstracts/DateValue` wraps `@internationalized/date` from inside `components/src`. Pure formatting or
numeric helpers are candidates for `ss-utils`; anything importing the date package is not.

### What went to `ss-utils`, and what was weighed and kept

An extraction round ran: candidates were staged in a temporary `src/Extract`, the
user lifted what they wanted, the folder was removed. Recorded so the next round starts from the
argument rather than the survey.

**Left**: `Audio`, `ColorValue` (now `Color`, a namespace per color space), `Decimal`, `Matrix3` (now
`Matrix3d`, over a `Point3d` rather than a tuple), `TimeValue` (now `TimeUtils`). `MathUtils` gained
`clamp`, `clamp01`, `normalize`, `lerp`, retiring sixteen hand-written `Math.min(Math.max(…))` clamps
across ten files — **nobody should write that expression again.** Four collapsed further to
`clamp01(normalize(…))`; `Progress` keeps its own guard, because its zero-span answer is `1` where
`normalize` reports `0`, and that choice is the caller's.

**`AngleUtils` is the third round, and it went because subtracting two bearings with `-` had produced three
bugs in one sitting.** The user's call. A bearing is a position on a circle rather than a quantity — `350` and
`10` are twenty degrees apart, neither is larger than the other, and the same direction has infinitely many
spellings — so `to - from` is right almost everywhere and wrong at exactly the place a run's two ends meet.
Every fault came from that: a zoomIn's far item taking the opposite way round an arc, then taking it again
after the first repair, and a run's facing coming out as noise for a closed ring.

**The line drawn is that `AngleUtils` owns the scalar algebra and anything touching a point does not.**
`wrap`, `wrapPositive`, `getTurn`, `getSeparation`, `add`, `lerp`, `getMidpoint` and `unwarp` moved or were
written; `Point2dUtils.getAngle`, `polarToCartesian` and `cartesianToPolar` stayed where they are, since each
takes or answers with a point and the namespace that knows what `x` and `y` mean is the one that should. What
did move out of `Point2dUtils` is `radiansToDegrees` and `degreesToRadians`, which know nothing about points
and are `fromRadians` and `toRadians` now, beside the two conversion constants that came from `MathUtils` and
`unwarpAngle` that came with them.

**Two wrap forms rather than one, and the difference is which question is being asked.** A bearing is written
from `-180`, because its two neighbors either side of straight back are as near as each other. An amount of
turning is written from `0`, because it has a direction and no negative form — a sweep of `370` is a sweep of
`10`. Both had been hand-written: the first four times across `Placement` and `Proximity`, the second in
`SVGUtils.getArcPath` and `RotationUtils.getIndexAngle`. Nobody should write either expression again, which is
the same sentence the clamps got.

**`PlacementUtils.getAngleDelta` is gone rather than kept as a pass-through**, being `AngleUtils.getSeparation`
under another name, and `Placement`'s private signed-turn helper went with it.

**`RotationUtils` went, whole, and is `utils/src/Abstracts/rotation.ts`.** It was listed below as a kept
candidate, and only `wrapIndex` was ever staked as qualifying — the rest reads as angular arithmetic in a
wheel's vocabulary. The user asked for the namespace, not the qualifying half of it, and the split would have
been worse than either whole: `getIndexAngle` calls `getStepAngle`, `getSpinAngle` calls `getIndexAngle`, so
half a namespace here and half there means a package boundary through the middle of one calculation. **The
line the "kept" list draws is about what a function needs, and every one of these needs only the language.**
What made them look component-driven is that their _documentation_ has to talk about wheels — which the
`utils/` doc rule now carries, in full, on all five.

`wrapIndex` did not go with them: it is `MathUtils.wrapIndex`, since wrapping an integer is not angular
arithmetic and `MathUtils` is where the sixteen hand-written clamps went for the same reason. It lost its
`stepCount` parameter name for `count` on the way, nothing about a ring of things being a step outside a
wheel. `CarouselUtils.wrapIndex` still exists and aliases it, so the published name a consumer already uses
did not move; `RotationUtils` is now published by `ss-utils` rather than by this package, and
`components/src/index.ts` no longer names it.

**`EasingUtils` went too**, but not out of this round — it was written for the move from the day it was
commissioned, and only the separate clone was holding it here. See _"`EasingUtils` went to `ss-utils` whole"_
below.

**Kept, with the shape each would need first.** The user's verdict: the remainder still feels
component-driven. Not outstanding work — the argument, so it is not re-derived.

- **`TextSync`** is ready as it stands: string and caret arithmetic, no DOM, and a mask engine is
  normally its own package. Needs a name that is not "syncing a text field".
- **`DismisserUtils.getIsWithinOwnedLayer`** is ARIA-aware DOM containment with nothing about dismissal
  in it; `DOMUtils` is where that belongs.
- **`Anchor`** is "align one rect to another along an axis, in/out/center, then fall back to the
  variant that fits". `Rect`, `Bounds` and `Dir` already say that; the `AnchorHPlacement` vocabulary is
  the component-driven half, and dropping the word anchor **is** the abstraction. `getStackingBase`
  stays behind either way.
- **`ElementHighlightUtils.getSegmentRects`** computes the eight regions left when one rect is
  subtracted from another — general, except it returns CSS strings. Returning rects is the change, and
  it is why the function has no unit test: geometry cannot be asserted on a string.
- **`CellAnimationUtils`** is two things. `assignAnimationProps` writes ordered transforms and filters
  onto an element and already reads `CSSConst.ANIMATION_UNITS`, so it is the missing writer half of
  something that package owns; the four parity predicates are grid tiling and belong with the weights.
- **`SlideButtonUtils`** and half of **`SliceAnimationWeightUtils`** mostly dissolved into `clamp01` and
  `normalize`. What is left of the first is a thumb sliding in a track, which is `SlideButton`'s.
- **`radar` and `spiral` should not go at all**: real algorithms, but tuned by a `SweepDefs` record — a
  quadrant count and one multiplier per clock direction (`clockDownMul`, `clockRightMul`, `clockUpMul`,
  `clockLeftMul`) — whose meaning is the weight samples' and nobody else's.

**Never staged, by category**: anything shaped around a component's own record (`SelectUtils`,
`TreeUtils`, `ToastUtils`); anything bound to a framework (`InteractionTracker`, `FocusManager`, `FrameRateMonitor`,
`ElementFader`, the SVG defs modules that return JSX — the arithmetic that used to be tangled into them has
since moved to the Playground samples instead, so what is left here is markup and nothing else); anything adapting a
third-party package (`DateValue`, `Virtualizer` over TanStack's `virtual-core`); and three near misses
blocked only by a pure type sharing a file with Solid props — `NumberInputUtils`,
`RichTextUtils.parseContent`, `compileStops` / `sampleTrack`.

### The fourth extraction round, and the rule it settled

**One consumer is enough when the maths itself is generic.** The user's rule, stated when the layout algorithms came
up: a function with a single caller still goes to `ss-utils` if nothing in it is about that caller. Weigh what the
function needs and what its names mean, never how many places call it today. **The "bound to a framework" exclusion of
the earlier rounds no longer exists**: `components/src` imports no framework since the package split, so `FocusManager`
and its kind are judged like anything else.

**What moved.** New modules `circle.ts` (`CircleUtils`: D3's enclosing circle and sibling packing, van Wijk's zoom),
`quad.ts` (`Quad`, `QuadCorner`, `QuadUtils`: QuadWarp's four-corner geometry and its `matrix3d`), `quaternion.ts`
(`Quaternion`, `QuaternionUtils`: Roller's, in degrees like the rest of the package) and `span.ts` (`Span`, `SpanUtils`:
PanZoom's span arithmetic, Timeline's lane packing and round-number ticks). New namespaces `Point3dUtils` and
`Index2dUtils`. Additions to `MathUtils` (`wrap` for fractions, `getDecimalCount`, `getGreatestCommonDivisor`,
`getDecay`), `AngleUtils.getChordAngle`, `BitwiseUtils.interleave`, `Point2dUtils` (`getDistance`,
`getSegmentDistance`, `rotateAbout`, `getCircumcenter`, `getCornerTurn`), `RectUtils` (`getCenter`, `project`,
`bisectByWeight` — Treemap's partition), `Matrix3dUtils.toCss` / `fromCss`, `RandomUtils` (`hash`, `createSeeded`,
`shuffle`), `GestureUtils` (`computeVelocity`, `coast`, `GestureSample`), `ObjectUtils` (`isSameArray`,
`moveArrayElement`), `PolygonUtils` regular-polygon measures, `SVGUtils.getRingSectorPath`, `DOMUtils` (`getScreenScale`,
`revealWithin`) and `IOUtils.matchesAccept`. Each replaced copies in components, several of them two to eight copies.

**No aliases, and no pass-throughs left behind**, following `EasingUtils`: `QuadWarpCorners`, `CornerKey`,
`RollerQuaternion`, `PanZoomSpan`, `RangeSpan`, `TimelineSpan`, `TimelineTick`, `TimelineStepPair`,
`CirclePackingCircle` and `CirclePackingView` are gone, and so are the published wrappers that only forwarded to the
new home: `PlacementUtils.getAngle` / `getDistance`, `CarrierUtils.computeMovedOrder`, `CirclePackingUtils.toView`
(a view is now the `Circle` it frames), `PlacementLayoutUtils.toChordAngle`, `ParticleFieldUtils.toCenter` /
`isPointInPolygon` / `computeRoll`, `TrailUtils.getAngle`, `RevealUtils.toCenter` and Popover's reveal. Icicle's and
Sunburst's spans are `Span` plus their own fields, and Range's two-thumb value is `Span` itself — `RangeValues` went,
though it is a value a consumer passes rather than a stretch of a line, because the shape and the meaning are the
same: where a selection starts and where it ends.

**A follow-up pass took four more**, found after the first: Die's convex hull (`Point3dUtils.getConvexHull`;
`DieUtils.computeHull` stays as the builder of a `DieShape`, a die's own type), Cuboid's matrix helpers
(`Matrix3dUtils.transpose`, `isSame` with a tolerance, `round`, `getRotationAngle`), `Size2dUtils.getCenter`, and
Range's knob measuring its center through `RectUtils.getCenter`.

**What stayed, and why.** `CorridorLayoutUtils.computeTubeCorners`: every input names a tube; its general parts
(turning about a line, a point on a cylinder, projection) are `Point3dUtils`. `TreemapUtils.easeZoom` keeps its name
because it records which easing every zoom uses, paired with `TREEMAP_ZOOM_EASING`; its body is now
`EasingUtils.easeInOutCubic`. Barrel keeps its rounding to whole pixels and its minimum face count over the
`PolygonUtils` measures; Cuboid keeps its snapping of near-whole numbers over `Matrix3dUtils.fromCss`, because the
tolerance is tuned; TileBoard keeps its collapse-to-center check over `PolygonUtils.insetPolygon`. Smoother keeps
`getStep` as its own API, built on `MathUtils.getDecay`.

**One repeatable-random function, so the patterns moved.** CellAnimation's weights, CorridorLayouts' item gaps and
ParticleField's rolls each had their own integer hash; they all call `RandomUtils.hash` now. ParticleField's output is
unchanged (its hash was the one adopted); the fixed-seed CellAnimation samples and the corridor gaps draw a different,
equally fixed, arrangement. The user accepted that.

**`DOMUtils.revealWithin` exists because `scrollIntoView` moves the page.** A popup that has just opened is still
unplaced at the top-left of whatever it is portaled into, so `scrollIntoView` on its highlighted row scrolled the
document to the top. Moving only the scrollers between the element and a given root, as `block: "nearest"` would,
reveals the row without that; converting each distance into the scroller's layout pixels keeps it right inside a scaled
`Viewport`.

### Look in `ss-utils` before writing anything general-purpose

Asked for by the user. `ss-utils` is a dependency of this repo by the same author and already holds
a lot. Re-implementing something it exports is the easiest waste to commit and the hardest to notice,
because the duplicate works.

**The trigger is the shape of the code, not the name of the file.** Most utils start as three lines
inside a component, so "I am not writing a utility right now" is the wrong test. The real test:
**could this function be given a name and a couple of arguments and still make sense with nothing
around it?** If yes it is general-purpose, whatever file it is in. The user's example — comparing two
arrays by an id on each element — is not in `ss-utils` and is still that shape.

Aimed at the things that read as small enough to just write: clamping, rounding to a step, comparing
rects, spreading a padding, kebab-casing, picking a random element, deduplicating, formatting a number.
Several are already there — `MathUtils`, `RectUtils`, `CSSUtils`, `StringUtils`, `RandomUtils`,
`PolygonUtils`, `ShapeUtils`, `BitwiseUtils`, `FunctionUtils`, `DOMUtils`, `SVGUtils`, `IOUtils`,
`KeyframeUtils`, plus `Point2d`, `Vec2d`, `Vec4d`, `Rect`, `Bounds`, `Size2d`, `Dir` and `Count`.

**How to check, in order**: pick the namespace it would belong to; read that namespace's file under
`utils/src`, small enough to read whole; grep the export list for the noun
rather than the verb, since the package names things after what they operate on. Only then write it. If
genuinely absent, it is a candidate to go _to_ `ss-utils` — see the section above for which side of the
line it falls on.

### `EasingUtils` went to `ss-utils` whole

It is `utils/src/Abstracts/easing.ts`, and the arithmetic and its reasoning are documented there, as
everything in that package is. Two things about the move are this repo's to know.

**No alias was left behind, on the user's call.** `RotationUtils` kept a published name alive on its way out
only because `CarouselUtils.wrapIndex` already aliased it; there was no equivalent here, so anyone importing
`EasingUtils` from `@thewaver/ss-components` imports it from `@thewaver/ss-utils` instead. `Rotator` is the
only caller in this repo.

**It exports far more than has a consumer, and that is deliberate.** `Rotator` uses `ease` and nothing else;
the rest of the family exists because a package of easings missing two thirds of the set is one nobody reaches
for. **Do not prune it back to what this repo happens to call, and do not read the unused exports as dead
code.**

### `ss-utils`: the arguments behind the utilities, which their own documentation does not carry

A published `/** */` block says what a caller needs and nothing about why the code is shaped that way — see
`conventions.md`. These are the whys for `utils/src`, kept here where a future session will find them and a
consumer will not.

**`MathUtils.clamp` matches `Math.min(Math.max(…))` exactly, including the wrong-way-round case.** The
equivalence is the point rather than an accident: it is what made replacing a hundred and seventy hand-written
clamps a change of spelling rather than a change of behavior. Anything that would make `clamp` cleverer —
swapping reversed bounds, refusing them — breaks that and is not a small change.

**`MathUtils.lerp` is `from + (to - from) * ratio`, not `from * (1 - ratio) + to * ratio`.** The first is
exact at a ratio of `0` and can be a float out at `1`; the second is exact at both ends and can overshoot in
between. Landing exactly on `from` matters more here, because `0` is where an animation starts and where a
value at rest sits.

**`MathUtils.roundToDecimalPlaces` shifts through exponent notation rather than multiplying**, which is what
keeps `1.005` at two places from coming back as `1`.

**`MathUtils.clamp01` and `wrapIndex` exist to be named.** `clamp01(elapsed / duration)` says "ratio" where
three arguments bury it, and `wrapIndex` is the ring's answer to `clamp`'s line. Both were hand-written
repeatedly before they were extracted, which is the argument for a one-line function generally: the cost is
never the arithmetic, it is the number of places to get it wrong.

**`GestureUtils` measures in ratios of the element, and clamps nothing.** A ratio is what lets one commit
threshold mean the same thing on a phone and on a desktop. Overshoot is real travel, so `computeSwipeProgress`
reports past `1` and below `0` and a caller that wants it bounded says so — while `computeSwipeOffset`, which
exists to be fed to a transform, does clamp, because a modal swiped away should not slide back onto the screen
when the pointer goes backwards. The commit threshold is the caller's number because a photo in a carousel is
not a modal being dismissed.

**`RotationUtils` is in degrees throughout**, because the numbers end up in CSS transforms and a reader
checking one against the other should not have to convert in their head.

**`RotationUtils.getSpinAngle` only ever counts upwards.** A wheel that unwound to reach its target would read
as a correction rather than a spin, and a transition animating to a smaller number would run backwards — so
the whole turns are counted from above the current angle, the total is never reset, and at least one turn is
always added so that a spin onto the step already showing still moves. `getJitterAngle` clamps to half a step
for the matching reason: past that, `getAngleIndex` reads the step next door, and the wheel would show one
step while reporting another.

**`TimeUtils.getMeridiem`, `getTwelveHour` and `withMeridiem` live in the namespace rather than in a 12-hour
field**, because they are the whole of what is easy to get wrong — midnight reads as 12 am and noon as 12 pm,
so the mapping is `hour % 12` in neither direction and no type catches the mistake.

**`StringUtils.applyTextTransform` capitalizes on `(?<![\p{L}\p{N}])\p{L}` rather than `\b`**, so "état"
capitalizes as "État". **Do not simplify this back to `\b`.**

**`IOUtils.downloadJson` revokes its object URL immediately.** Without the revoke the blob is pinned in memory
for the lifetime of the page.

**`EasingUtils.protect` clamps the input rather than the output.** Clamping the output would flatten `back`
and `elastic`, whose whole point is to leave the `0`–`1` range in the middle; clamping the input leaves the
overshoot alone while still pinning the two ends.

**`Vec2d`, `Vec3d` and `Vec4d` are factories taking key names** so that `Point2d`, `Size2d`, `Index2d`,
`Vector3d`, `Rect` and `Bounds` share one set of operations without the arithmetic being written six times.

**`ShapeConst`'s `hectogon` is named for what it is rather than for the circle it stands in for**, because a
shape here is a list of corners and a circle has none. An exact circle is reachable without a name — a
`square` whose join radii are half its side rounds into one, every corner's arc sharing the square's own
center — but that takes a second descriptor the caller has to pass, which is why the hundred-sided entry earns
its place.

**The four corner-cut triangles are named for the corner their right angle sits in** — `triangle_top_left`
and the rest — because they do not point at the middle of a side the way `triangle_up` does, and the corner is
the one thing about them that differs. Each starts at its topmost-leftmost corner and runs clockwise, as every
other entry does.

**`ShapeUtils` falls back to an edge length of `1` where two corners sit in the same spot.** The division
would otherwise produce `NaN` and take the whole path with it, and a path of `NaN` renders as nothing at all.
With the fallback only that one corner is wrong and the rest of the shape still draws.

**`ShapeUtils` rounds a reflex corner from outside the shape.** A corner that turns outward — a star's notch —
has its arc center on the far side of the contour, so the arc is centered at `offset + r` rather than
`offset - r` and its end points sit at `-r` along the normals; the inner path shares that center at radius
`r + thickness`. Centering it inside, as every corner once was, puts both end points past the vertex on the
edges' extensions, and the contour draws a small loop that crosses itself at every notch.

**`setupPaths` shrinks radii by the length each arc takes from its edge, not by the radius itself.** An arc of
radius `r` at a corner that turns by `φ` starts `r · tan(φ / 2)` from the vertex, which equals `r` only at a
right angle. The factor is applied only where the turn is sharper than a right angle and is `1` everywhere
else, so a square, a hexagon or any wider corner shrinks exactly as before; only corners whose arcs used to
overrun their edge and overlap the neighbor's — a triangle's, a star's tips and notches — are held back
further. Using the exact factor on wide corners too would let them round further than they do today, which
would change how existing shapes look, so that was left alone.

**`PolygonUtils.getLineIntersection` passes an epsilon of `1e-6`, looser than `Point2dUtils.intersectLines`'
own `1e-8`.** Polygon edges that are nearly parallel are better treated as parallel than sent off to a distant
corner. The number is measured and is the user's; flag a concern rather than changing it.

**`FunctionUtils.trailingThrottle` holds its pending arguments outside the timer's closure.** The timer is
scheduled once per cooling-off period, so later calls in the same period have to be able to overwrite what the
run will use — which is what lets the last value through rather than the first.

**`KeyframeUtils` guards its release with a `released` flag.** One caller releasing twice would drive the
tally below what it should be and delete a rule other callers are still animating with.

**`JSXTextMetricsUtils` treats a measured width of `0` as a fitted size of `0`.** An empty string measures
nothing, and dividing by that gives `Infinity`, which drags the whole stack's scale to `0` and blanks out
every other line.

**`JSXTextParserUtils` forces `display`, `visibility` and `white-space` rather than reading them.** Each piece
is redrawn inline whatever its source was, and the tree being walked hides itself and holds every line
unwrapped so that spaces survive measurement. The baseline shares those last two, so comparing against it
would drop them and leave the redrawn text collapsing whitespace that was measured.

**`JSXTextParserUtils.pushStructuralLineBreak` collapses structural breaks only.** Two blocks in a row would
otherwise close one and open the next, producing a stray blank line between them. Breaks the author wrote — a
literal newline, or a `<br>` — are content and always push, or `"a\n\nb"` silently loses its blank line.
**Do not route the explicit sites through it.**

**`JSXTextParserUtils` hands raw text to `measureTextWidths`**, which applies any `text-transform` itself, so
the transform is applied once rather than twice.

**`IOUtils.downloadJson` releases its `blob:` address straight after `click()`, and that is safe by the
specifications.** Clicking a download link runs HTML's "download the hyperlink" synchronously: the link's address is
parsed in step 3 — which is when the File API looks the blob up (§8.3.1, "looking up the URL in the blob URL store
when parsing a URL") — and the request is built and its fetch started in steps 8 and 9, all before `click()`
returns. The File API then says revoking does not cancel it: "Requests that were started before the url was revoked
should still succeed" (§8.4). Sources: [HTML, links](https://html.spec.whatwg.org/multipage/links.html) and the
[File API](https://w3c.github.io/FileAPI/). So no timer; a browser that lost the download this way would be
breaking the specification, and a report of one is a reason to add the timer then.

### `Color`: `colord` reads and recognises, and does nothing else

**`colord` parses every CSS notation and the named colors, and reports which notation a string was written in.
That is the whole of its job here.** The parsing is a table and a grammar nobody should hand-write, and the
notation report is what lets a control hand a value back in the spelling it was given. What `colord` cannot do
is hold a color without losing it: its hue-space output is rounded to whole numbers, so a hex value taken to
HSV and back comes out different for **3472 of the 4096** three-digit colors — `#123456` returns as `#123457`.
A picker storing that would shift a shade every time a value passed through it, which is the exact fault the
file exists to prevent. So `Color.parse` uses `colord` to read and recognise, then re-derives the value
through the conversions in the file.

**Units follow CSS**, and the percentages were `0`–`1` fractions in an earlier build. Nothing reads them that
way any more.

**An unreadable string answers `undefined` rather than black.** A control handed something it cannot read
should say so; substituting a color hides the fault at the one place it could still be reported.

**`HSV.toCss` writes `hwb()`.** CSS has no `hsv()` notation, and `hwb()` is HSV under another name that
converts exactly, so the result stays in a hue-based space instead of falling back to `rgb()`.

**`HSV.interpolate` and `HSL.interpolate` take the increasing direction where two hues are exactly opposite**,
which is what CSS's own `shorter hue` interpolation does.

### `Color.getContrastingColor`: the hue and saturation are kept and the lightness is solved for

Asked for by the user. Hand it a hue, a saturation, a color to sit against and a WCAG ratio, and it answers
with the `Color.HSL` whose lightness reaches that ratio.

**The contrast arithmetic is written out rather than taken from `colord`'s `a11y` plugin.** The plugin is
already in the tree and would have worked. The relative-luminance formula is eight lines straight out of WCAG,
and the file re-derives everything else for the reason above, so importing a plugin to do it would buy a
dependency on somebody else's rounding in the one file built to avoid exactly that.

**Two lightnesses reach any reachable target, and that is the whole of the API question.** With hue and
saturation held still, a color's luminance rises steadily as lightness runs from 0 to 100 — so its contrast
with a fixed other color falls to 1 where the two match in brightness, then climbs again. One answer is darker
than the other color and one is lighter, and since no input lightness is given there is nothing to call one of
them the nearer. The caller has to say, which is what `prefer` is for. It is `darker` / `lighter` / `auto`
rather than a boolean because the useful default is a third thing: whichever side has more room, meaning the
lighter side for a dark color and the darker side for a light one.

**The preference only chooses between two passes.** Where the preferred side cannot reach the target and the
opposite side can, the opposite side is answered with. The contrast is the requirement and the side is a
preference, so the requirement wins; a caller who would rather have nothing than the wrong side sets
`mustMeetTargetContrast` and checks. Where neither side reaches the target, the preference is ignored
entirely and the answer is black or white, whichever contrasts more — a best effort has no side.

**Each answer is the lightness nearest the other color that still passes**, found by bisecting 24 times, the
count `easing.ts` settled on for the same job. Nearest rather than most extreme, so a color asked to reach AA
against white comes back a mid-tone rather than near-black, and a caller wanting the extreme asks for a higher
ratio.

**The lightness is rounded outward.** Rounding to the nearest two decimals can land a ten-thousandth below the
target, which is the worst way to fail a check — true by construction, false by the value that was returned.
So the darker answer rounds down and the lighter answer rounds up, and what comes back is a value that has
been verified rather than one derived from a value that was.

**`A` is `3`.** The user's call, and the number is right even though the letter is not: 3:1 is what WCAG asks
of large text and of non-text elements such as icons and input borders, while level A carries no contrast
requirement at all. The type's own documentation says as much, because a consumer reading `"A"` will otherwise
take it for a conformance level.

**Alpha takes no part.** What a see-through color really contrasts with depends on whatever sits behind it,
which the function is never told, so a translucent color is measured as though it were opaque.

**The ratio itself is not exported.** `toLuminance` and `toContrastRatio` are module-private, because what was
asked for was one function.

### `Color.getLuminance` and `Color.getPerceivedLightness`: two numbers a palette is tuned by

Asked for by the user, while tuning a game's palette: next to each shade's contrast against white and black they
wanted how light it looks. **Both reuse the luminance `getContrastRatio` already computed privately**, so the three
can never disagree. `getLuminance` is WCAG's relative luminance, `0`–`1`, linear in light; `getPerceivedLightness`
is CIE L*, `0`–`100`, spaced so equal steps look equal, and it is the one to tune by — a mid gray is about a fifth
of the way along luminance and about half along lightness.

**The luminance keeps WCAG's own `0.03928` threshold** for leaving the linear segment, not sRGB's `0.04045`: the two
differ only for channel values of about 10 or 11 out of 255, by far less than any rounding a palette sees, and
keeping one formula means lightness, luminance and contrast all come from the same numbers.

### `CSSUtils.toAnimationStyle`: what a frame costs, and the three rules that came of measuring it

The stress tests of `CellAnimation`, `ScanlineAnimation`, `ParticleSpawner`, `ParticleField` and `ParticleDissolve` were profiled in headless Chromium, which draws in software: a production build, each test running with no pause between passes, the median of three runs, and every candidate fix tried as a probe on a copy of the library before any was built. **The user's rule for these: any improvement is taken unless it makes the code unreadable or unmaintainable.** The user took three rules from it, and chose to put the first two in the builder rather than in `assignAnimationProps`: which CSS property carries a value is the builder's question, and answering it in the writer would have left two answers. **Unverified in a GPU window**, which is where a rendering change has to be seen.

- **`opacity` is the `opacity` property, not `filter: opacity()`.** Every element whose filter changes is restyled and drawn again on every frame — about 2,700 redraws a frame in the 72-picture fade test — while a changing `opacity` only changes how the element is blended. Measured: the fade test went from 9.5 to 33 frames a second (main thread 107 → 29 ms a frame), the 3D cube from 1 to 4.2, and `ParticleDissolve`'s Card at 4 px cells from 53 with dropped frames to a steady 60. It looks the same by argument: CSS applies `filter` before `opacity`, and the filters after `opacity` in `CSS_FILTER_KEYS` act on color and leave alpha alone, so moving it to the end cannot show. **One difference reaches a consumer**: a filter makes its element the box that `position: fixed` content inside it is placed against, and `opacity` does not. The user accepted that for `Carousel`, `PlacementItem` and `Wheel` in choosing the builder. Every caller writes all three properties; `Carousel.toSlideStyle` writes a full opacity where it has none, as it writes `none` for no transform, because the Svelte view sets each key it is handed and an absent one would leave the last fade standing.
- **A filter function at its neutral value is left out** (`CSSConst.NEUTRAL_FILTER_VALUES`), so a cell resting at `blur(0px)` or `grayscale(0%)` carries no filter and is not redrawn. Measured: blur went from 3 to 14 frames a second with the `opacity` rule, the scanline filter test from 7.9 to 11.7. `drop-shadow` has no neutral value, since a shadow with no offset and no blur still shows through a see-through element. **Transform functions at their neutral value are kept**: leaving them out measured no gain on the 2D zoom or the 3D cube, and taking a zero-degree 3D turn off a resting cell would change which cells get a compositor layer of their own — about a quarter of the cube's layers were cells resting at exactly that turn. A sample that rests away from neutral keeps its filter — the Brightness scanline rests at `brightness(0%)`.
- **`assignAnimationProps` does not write a property whose text has not changed** since it last wrote that element: the browser parses a value even when it turns out to be the same. Measured on the 2D zoom test: 25 → 28.6 frames a second as built (30 in the probe). It remembers what it wrote rather than reading the element back, so the three properties are the writer's alone; no view in any framework binds them on the elements it writes.
- **The keyframes round with arithmetic, and the builder joins text directly** — the user's pick of two small costs. `MathUtils.roundToDecimalPlaces` goes through text and back to give exact decimals, about 280 ns a value against 12 ns for `Math.round` on a scaled value (measured in Node), and `fromStops` rounds every value of every cell on every frame. A style value needs no exact decimal while `NumberInput` and `Range` do, so the helper stays as it is and `fromStops` has its own `roundForStyle`. `toAnimationStyle` and `toFunctionCall` build their strings by joining text rather than through arrays: the same strings, about a third cheaper per cell. Together they took about 2 ms a frame of script off the 2D zoom test (18.7 → 16.4) and 1.4 off the fade, and moved neither test's frame rate nor its total main-thread time, which stayed within run-to-run noise.

What was measured and not acted on:

- **A compositor layer per cell is far worse**: `will-change: transform` took the 2D zoom test from 25 to 4.6 frames a second. The 3D samples get one per cell anyway — about 8,900 layers in the cube test — and at 4.2 frames a second with every fix, a 3D sample at that cell count is simply too many cells. **One layer per moving animation is the opposite**: the `…Moving` class on `CellAnimation`'s container and on the particle roots gives each a layer only while it moves, so its motion stops forcing the graphics card to redraw the page beneath it — measured on a real GPU, 30–80% faster on every stress test but the 3D cube, which loses about 10%.
- **What remains of a 2D test is the browser regrouping every separately moving cell each frame** (`Layerize`, 7–13 ms at about 8,700 cells). It follows the cell count; nothing in the library removes it.
- **The Playground's `DefaultExample` costs about 5 ms a frame of the zoom test's script**: it reads a store, works out the shared timeline and builds an object for every cell on every frame, though only the cell's own window depends on the cell. Offered to the user as a fix to the sample and not taken.
- **The stress popup's own `backdrop-filter` blurs cost about 70 ms a frame in software** and dominated every stress test's frame rate there (cells 18 → 25 frames a second with them off, spawners 14 → 47). Their cost on a graphics card was not measured. **The user's call: a stress popup's overlay is an opaque black layer that still fades in and out** (`PageModalOverlay`'s `isOpaque`), so a stress test measures the components rather than the blur behind them; every other modal keeps the blurred overlay. That alone took 96 spawners from 13 to 31 frames a second and the cells from 18 to 22. **The modal and drawer panels have no `backdrop-filter`**, which the user removed: the panel is opaque, so the blur never showed (its pixels differed by at most 1 in 255 with it on or off) and cost about 13 ms a frame in software. With both gone the stress popups measured 50 frames a second for 96 spawners and 31 for the cells.
- **Working out every cell's strings once, at the start, was argued and left.** It would remove most of the script and none of the browser's work; it freezes a consumer's function the library cannot see into (a knob, the Glitch sample's shifts re-rolled each pass) unless the consumer asks for a rebuild; and at stress size it is about a million evaluations up front. Handing the browser the whole animation instead gives every animating cell a compositor layer, the cost measured above.
- **`ParticleField`'s stress test (72 fields of 11 × 11) spends a third of its frame on its sample's filter flash.** The Playground's default `fade_in_flash` changes `brightness` and `saturate` on every particle, so each is repainted every frame: 24 frames a second, against 34 with an opacity-only fade. What remains is the browser's work for each particle and the making and removing of about a hundred particle elements a frame; the engine's own bookkeeping is about 2 ms.

### `JSXTextParserUtils`: an inherited style is weighed against where the text lands, not against its own parent

`getSegmentTokens` reads the computed style off each piece of text and copies it onto the run it emits, and it
leaves out the properties CSS inherits on the grounds that the copy will pick them up for free. That reasoning
only holds against the right baseline, and the first version used the wrong one: it compared a piece against
its own parent element.

Nothing the parser produces stays where it was read from. `Typewriter` keeps a hidden copy of the children to
measure, walks that, and builds the visible characters somewhere else entirely — a sibling of the hidden copy,
under the same root. So the question is never "does my parent already say this", it is "will the place this
text is going to say this", and the two differ the moment a value is set more than one level up. A red set on
a `<div>` reached a `<b>` inside it by inheritance, both computed to red, they matched, and the color was
dropped — and the destination, which had no red anywhere above it, drew the text in the page's color. The
same went for `text-shadow`, `text-align` and `direction`, every inherited property that is also one the parser
carries. One level worked by luck, because the value's own element and its parent still disagreed.

**The baseline is now the element the walk started from**, which is the sibling of the destination and so
resolves every inherited property to the same value the destination will. Everything between it and the piece
of text stops mattering, which is the point: the whole chain is judged at once instead of one link of it.

**Three properties are forced rather than compared, because that root is not a neutral baseline.** It is the
measuring copy, and it hides itself and holds its content on one line so that every space is counted, so
`visibility` and `white-space` would compare equal against it and be dropped — leaving the redrawn text
collapsing whitespace the measurement had already paid for. `display` joins them for an unrelated reason: a
piece is redrawn inline whatever it was cut from. `white-space` is pinned to `pre`, matching what the text was
measured under, and a run never needs to wrap because the line breaks were decided before it was emitted.

#### Text stroke was missing from the list, and text fill is deliberately still missing

`-webkit-text-stroke` and its two longhands are now carried, and they are inherited so they sit in both lists
beside `color` and `text-shadow`. The tell that the omission was an oversight rather than a decision is
`paint-order`, which was already in the render list: that property does nothing except choose whether a stroke
paints over the fill or under it, so a list holding it and not the stroke itself was incomplete.

**`-webkit-text-fill-color` stays out, and that is the decision rather than the oversight.** Its initial value
is `currentcolor`, so a computed style always resolves it to whatever `color` resolves to — meaning it would be
written onto every run whose color differs from the baseline, which is every colored run, saying nothing that
`color` had not already said. That redundancy is not the problem; the problem is that an explicitly set
`-webkit-text-fill-color` beats `color` for the glyph fill. A consumer animating `color` in their keyframes
would find the text frozen at the color it was parsed with, and the property they would have to know about to
explain it is one they never wrote. So a fill color set inside a `Typewriter` is lost, and that is the cheaper
of the two failures.

### `JSXTextParserUtils`: the space a wrapped line ends on hangs, as a piece of its own that takes no room

Found through `ProximityText`'s barrel example, which scrolled sideways, and chosen by the user over fixing it in that
one component or hiding the scroll in the example. `getInlinedSegments` wraps before the word that does not fit, so
the space in front of it stays at the end of the line it leaves. A browser lets that space hang past the edge without
counting it; every component that draws a letter at a time draws it as a box, so it pushed past the edge — 19px in
the barrel, whose spaces widen with the effect, about 2px in `Typewriter` and `PaintedText` — and moved a centered line
off its middle by half a space.

**The space is split off and styled, not dropped.** Dropping it would change how many characters the text has with
every change of width, and with it which letter each animation name, start time and rest position belongs to. So
`getInlinedSegments` ends by splitting each wrapped line's trailing white space into its own text piece, marked
`isHanging` and carrying a zero-width, clipping, top-aligned inline-block in its `nonMetrics`. Every drawer already
applies a piece's `nonMetrics` to the element around its letters — the four frameworks' `Typewriter` and
`ProximityText`, and `PaintedText`'s hidden layout — so none of them changed. `getIsHanging` tells such a piece apart.

**Clipping costs the caret one place, so the caret steps back past it.** `Typewriter` draws the consumer's caret inside
the piece holding the letter it follows, and a caret after a hanging space would be clipped with it for one step.
`computeCaretIndex` takes the hanging places, from `LetterDriverUtils.getHangingIndices`, and places the caret after
the letter before instead, which is the same spot on screen. Leaving the space unclipped was the alternative, and is
what kept the overflow: a zero-width box whose content spills still widens what scrolls.

**The width the lines are laid out to is read exactly and rounded down, not taken from `clientWidth`.** The hanging
space cleared the barrel in every headless run, and the user's own Edge at 125% scale still drew a scrollbar with
`clientWidth` and `scrollWidth` both 350. `clientWidth` rounds to the nearest pixel, so room of 349.6 pixels — a
scrollbar of a fractional width leaves that — reads as 350, and lines set to 350 overflow by less than any whole-pixel
measurement shows. `LetterDriverUtils.measureLineWidth` reads the used width from the computed style, adds the padding
`clientWidth` counts, and floors it; `ProximityText`, `Typewriter` and `PaintedText` each lay out to it.

### `Color`, and why `colord` reads strings but does not hold them

The user's call was that `colord` should become the engine and `Color`'s own conversions go. Building it turned
up a measured fact that changed the split, and it is recorded here so nobody re-opens it on taste.

**`colord` rounds its hue-space output to whole numbers.** A hex value taken to HSV and back comes out
different for **3472 of the 4096** three-digit colors — `#123456` returns as `#123457`. `ColorInput` holds HSVA
and writes a string out, so it performs that round trip on every mount and every edit. Adopting `colord` as the
store would have replaced the fault the work was commissioned to fix with a quieter version of itself.

**So the split is by capability rather than by preference.** `colord` **reads and recognises**: `Color.parse`
accepts any CSS notation, `Color.getNotationOf` reports which one, and `Color.isSame` compares two strings
across notations — all things the hand-written code could not do at all. The **arithmetic stays**, because it
keeps full float precision and the conversions are lossless in both directions.

**`Color.parse` uses `colord` to read and then re-derives the value through the conversions here**, which is
what keeps the precision while still accepting `rebeccapurple`.

**The per-space hex comparisons went.** `Color.Hex.getIsSameHex` and `Color.Hexa.getIsSameHexa` could only
answer the question for two values already spelled the same way; `Color.isSame` answers it for any two.

**Units moved from `0`–`1` fractions to `0`–`100` percentages**, on the user's call — they had doubted the
original choice, and a reputable library going the other way settled it. Hue stays `0`–`360`, RGB stays
`0`–`255`, and alpha alone stays a `0`–`1` fraction, which is what CSS does. `ColorArea`'s axes and its `step`
prop are in those percentages now, and its default step went from `0.01` to `1`.
