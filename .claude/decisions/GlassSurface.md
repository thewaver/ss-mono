# Decisions: `GlassSurface`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `GlassSurface`, and the two things that decide its shape

**It is built on `Shape`, not on `Surface`.** `Surface` exists to make two decisions — plain div or SVG, and
which defs the consumer wants — and `GlassSurface` has already made both. Wrapping it would inherit a branch
that can never be taken and a props shape built around defs it does not accept. What it actually wants is
`Shape`: the point list, the corner radii and lamé exponents, the measured size, and the clip path handed to
`renderChildren`, which is what makes the backdrop layers' corners follow a squircle exactly instead of
approximating it with `border-radius`.

**The backdrop is two layers, not one declaration with a fallback.** `backdrop-filter: url(#…)` is honored
by Chromium and ignored by Firefox and Safari, both of which support `backdrop-filter` with the CSS functions
and both of which parse the `url()` form as perfectly valid. That last part is what rules out
vanilla-extract's `[fallback, desired]` array: the array works by the browser _rejecting_ the second
declaration, which is how the Skins’ `[unshifted, "hsl(from …)"]` pairs degrade, and
here nothing is rejected — the value parses and the effect is simply missing, so the blur would be discarded
in favor of a url() that does nothing. Two elements instead: a lower layer carrying only the blur and an
upper one carrying only the `url()`. Chromium composes both; the other two get the blur and an inert second
layer. No feature detection anywhere, and none is possible — `CSS.supports` returns true in all three.

**The layers sit at negative z-index inside a stacking context the component makes for itself, and both
halves of that are load-bearing.** They must paint below the tint and the sheen, which `Shape` renders at
`z-index: -1`, so they are lower still at `-3` and `-2`. The first build had no stacking context of its own, so
they were hoisted to an ancestor, painted before its in-flow content, sampled an empty backdrop and silently did
nothing. Wrapping `Shape` in a `position: relative; z-index: 0` div contains the negative-z children in a
context of the component's own, so everything outside the component has already painted by the time they do.
It is `z-index: 0` rather than `isolation: isolate` because the backdrop has to see the page behind the
component.

**The ripple samples outside the pane, so the displacement is faded to nothing at the edges.**
`feDisplacementMap` at scale _k_ reaches up to _k_/2 pixels away, and for a `backdrop-filter` those pixels are
outside the element, where the browser has nothing real to give it. A drop shadow exposed this
first — one offset sixteen pixels downward, so the bottom was the only edge with
anything to pull and it alone grew a smeared band — but a large corner radius showed the true extent: at 150px
on a 300px pane the visible boundary is a circle touching the rectangle's edges, and the whole rim was chewed.

`edgeFade` on `SVGTurbulenceFilterDefs` is the fix, and it builds a displacement map that is neutral near the
border rather than trying to clamp the sampling. `SourceAlpha` in a backdrop filter is an opaque rectangle the
size of the element, so eroding it by the fade distance and blurring the result gives an inset mask; the
turbulence is forced opaque with an `feColorMatrix`, composited `in` that mask, then laid `over` an `feFlood`
of `#808080`. Mid-gray is zero displacement in both channels, so the map lerps from noise in the middle to no
movement at all at the edge, and nothing is ever sampled from outside. `GlassUtils` derives the fade from the
ripple scale rather than exposing it, because it is a correctness constraint and not a matter of taste.

**A layer only carries a `backdrop-filter` when there is a filter for it to name.** The factory's `add*`
methods decline to register a primitive that would do nothing — `addTurbulenceFilter` returns early at a scale
of zero — and `computeFilterPrimitives` then returns nothing at all, so no `<filter>` is emitted. A layer that
names it by id anyway is pointing at something that does not exist, and Chromium does not treat that as a
no-op: the pane grew a dark ring hugging its rim, which reads as an edge artifact and is nothing of the sort.
`GlassSurface` now renders each backdrop layer only when its filter exists, which is also why the blur layer
disappears at a blur radius of zero rather than sitting there forming a stacking context for nothing.

**The shadow moved anyway, and for a second reason.** It now paints on an overlay sibling that comes _after_
the glass in paint order rather than on a wrapper that comes before it, which keeps it out of the backdrop
entirely instead of leaning on the fade to hide it.

**The blur has an edge artifact of its own, and it is a different fault entirely.** A `backdrop-filter`
samples a backdrop image bounded by the element, so a blur near that boundary averages in nothing and the
result darkens and desaturates — a vignette hugging the rim that grows with the blur radius and is absent at
zero. Nothing about the displacement causes it. The layers are therefore inset by a negative margin of three
times the blur radius plus the ripple scale, which puts the blur's own falloff outside the visible shape, and
each clips itself to `GlassUtils.computeMarginedClipPath` — the pane's own points translated by that margin,
so the visible boundary is unchanged while the sampled area is larger.

**The oversized layers still count as content, so the root hides its overflow.** `clip-path` decides what is
painted and nothing about layout: a layer inset by a negative margin sticks out of the pane by that margin and
enlarges the scrollable overflow of every ancestor, so an ancestor with `overflow: auto` grows scrollbars —
which the Playground's resizable stage did, visibly, once the ripple was turned up. `overflow: hidden` on
`glassSurfaceRoot` stops the overflow propagating and, unlike `clip-path`, does **not** form a Backdrop Root,
so the blur still sees the page behind it. It also costs nothing visually, because the clip path cuts inside
the root's box already.

**The clipping cannot be done by a wrapper.** The obvious arrangement — one oversized layer inside a
pane-shaped clipping parent — renders no backdrop at all, because `clip-path` forms a Backdrop Root and the
page behind is then outside what the layer can see. It is the same trap as `isolation: isolate` above, and it
is why each layer carries its own clip rather than sharing one.

**The fringe this section used to blame on a disagreement between the two backdrop layers is postponed, not
fixed — see item 9 in `backlog.md` for the current standing.** The margin explanation did not survive a
direct test: pushing the margin far past what either layer needs changes nothing, and shrinking it to nearly
zero changes nothing either. Folding the blur into the ripple filter was tried, looked clean, and was reverted
anyway — not because it cost Firefox and Safari their blur, though it does, but because "clean" turned out to
mean "clean under the software renderer every one of these tests was unknowingly run under." A later pass
building a `feImage` / `feComposite` mask into the filter, so the pane never needs a `clip-path` or an
ancestor `overflow: hidden` at all, also looked clean under that same software path and also failed once
checked against a real GPU-accelerated window. Neither fix is in the tree. What each attempt actually ruled
out is real and kept below; what it did not do is find a fix that survives real rendering, and nothing further
should be attempted here without a way to check against GPU rendering from the start — see item 9.

**The Playground's pane is dragged with `left` and `top`, never with `transform`.** A transform on an
ancestor creates a stacking context and changes the containing block, and given how readily this arrangement
breaks — `clip-path` killed the backdrop outright and `isolation: isolate` would have — it is not a coin worth
flipping when plain offsets cost nothing. `InteractionTrackerUtils.trackDrag` on the stage supplies a clamped 0–1
ratio, an offset captured on the gesture's first move turns it into a grab rather than a jump, and the
position is a `clamp()` in CSS so the pane stays wholly inside the stage without anything measuring it. The
drag exists for two reasons, both of them measurements: seeing the glass travel over a detailed background,
and finding out what a blurred and displaced backdrop costs when it repaints every frame.

**A `GlassSurface` is sized by what it contains, like every other `Shape` consumer.** `Shape` measures its
own root with a `ResizeObserver` and the root is sized by its children, so a fixed box placed _around_ one
collapses the SVG layers to zero height. The box goes inside.

**The pane's edge is the consumer's, not a fifth `GlassDefs` group.** The question was open — a hairline edge
is part of how glass reads, so it could have been described alongside the tint and the sheen — and the user
settled it the other way: `GlassSurfaceProps` carries `computeStrokeDefs` and `borderWidths`, exactly the two
`Surface` takes, and whatever paints the edge is chosen outside. `GlassDefs` stays the description of the
optical effect; a border is a color, a gradient or a pattern like any other stroke in the library, and
routing it through the glass vocabulary would have meant a second, poorer copy of the defs contract.

**The two are declared together or not at all, which the type enforces rather than the runtime.**
`GlassSurfaceProps` is the common half intersected with a union: either both `borderWidths` and
`computeStrokeDefs` are present, or neither is. Making them independently optional would compile a call that
hands over stroke defs with no widths, and `Shape` draws that as a band of zero thickness — nothing visible,
no error, and no clue which of the two was forgotten. `Surface` has no such union because its `borderWidths`
is required outright; a glass pane usually has no edge, so requiring the widths from every consumer would be
noise.

**Everything else about the stroke is `Shape`'s already.** The widths become one `strokeGeom` entry, passed
only when stroke defs exist, and `Shape` renders the band between its outer and inner contours above the
content. Thickness moves the inner contour only, so the fill, the clip handed to `renderChildren` and the
margined backdrop clips are all unaffected by a border appearing.

**The page's border knobs are `Shape`'s, not a color and an opacity.** The first build gave the pane a flat
color with an opacity beside it, on the reasoning that a glass edge is a hairline and a registry picker would
drag the color bag, the animation duration and the iteration pattern onto a panel about glass. The user's
answer was to look at the `Shape` page, and it settles the general rule: **a knob for a `computeStrokeDefs`
prop is the gradient registry, the shared colors, the blur, the animation duration and the iteration
pattern** — the same five every other page that paints a stroke carries, so the page shows what the prop can
take rather than what one consumer would probably pass. A flat edge is still reachable, as the `plain` sample.
Width zero is how the edge is turned off; both props are always passed, and `Shape` draws a band of no
thickness as nothing.

**The default is `spot_1`, and the six border knobs sit together at the top of the panel.** Both the
user's call. `Shape` and the gradients page open on `sweep_diag_1v1`, which is the right choice where the
subject is the registry; here the subject is glass, and `spot_1` is the radial counterpart of the
component's own highlight, so the pane opens with an edge that catches the pointer the way the surface does.
It was chosen when that sample was called `sheen_1`, before the plainest key moved to the vertical band and
before the whole registry was respelled; the page follows the sample rather than the name, which is why the
default has been rewritten twice and never re-chosen. Grouping the
knobs matters because four of them are named for the border and two — the animation duration and the
iteration pattern — feed nothing else on this page, so scattered among the noise and sheen controls they read
as belonging to the glass.

**The Playground page exposes every `GlassDefs` field except the noise seed.** The seed picks which
arrangement of the same grain the ripple and the sheen share, so turning it changes the pattern without
changing anything describable — the page settles on the component's default and the knob is gone. It stays a
prop, so a consumer that wants two panes to differ can still set it.

**The tint can be a gradient, built the same way every other gradient in the library is.** Raised when the
Playground's own tooltip moved onto `GlassSurface` and lost the two-tone background it used to paint by hand.
Full `FillDefs` support — handing the tint a filter, a clip-path or a blend mode — was ruled out as more than
a tint needs; a gradient is the one piece of that worth having, and `Shape` already draws a `gradientOrPattern`
fill exactly the way it draws a flat color, so nothing downstream of the fill changed. `GlassTintDefs` is now
a union: a flat `color` and `opacity`, or an `opacity` with a `gradient` shaped like `SVGGradientDefsUtils`'
own `computeLinearGradient` / `computeRadialGradient` arguments (minus `id`, which `GlassUtils` assigns
per-instance the way it already does for the sheen and backdrop filter ids) plus a `kind` discriminant, so a
caller writes the same shape it would write anywhere else a gradient is built rather than a `GlassSurface`-only
vocabulary.

**Merging a partial tint had to stop being field-by-field.** `GlassUtils.mergeDefs` spreads every other group
over its defaults — `{...defaults.sheen, ...partial?.sheen}` — because each is a flat set of numbers and any
subset can be overridden safely. A tint that is sometimes a color and sometimes a gradient is two different
shapes, not a wider set of the same fields, so the same spread would blend half a color into half a gradient
and produce neither. `PartialGlassDefs.tint` takes a whole `GlassTintDefs` or nothing, and a caller who
supplies one replaces the default outright.

**The sheen turns off at a `specularConstant` of zero, and the switch had to live in `Glass.utils.ts`, not
just in the SVG filter factory.** Found on the Playground's tooltip: `feSpecularLighting`'s highlight is
composited onto the tint with `feComposite operator="arithmetic", k2=1, k3=1` — an unclamped add, not a blend
— which reads as a tight, tasteful shine on a 300px demo pane and as the whole surface blown toward white on
something tooltip-sized, because the same light height and falloff that make a small hotspot on a large pane
cover a small element's entire area at once. `SVGFilterDefsFactory.addSpecularLightingFilter` now declines to
register a primitive at `specularConstant <= 0`, matching every sibling `add*` method's no-op guard — but
`computeSheenDefs` still has to omit the `filter` key from the returned def entirely in that case, rather than
pointing one at an id the factory built nothing for. That second part is the one that actually matters:
`Shape` decides whether to write `filter="url(#…)"` from whether the def object _carries_ a `filter` key, not
from whether anything was rendered under that id, which is the same "a factory-built filter can build
nothing" trap the backdrop layers above are already written to avoid. Skipping the key also skips
`PointerTrackerUtils.create` and the rest of the primitive-building work, so a caller who wants no sheen pays
nothing for one.

**The ripple layer's edge is postponed, not fixed, and the investigation is recorded here so it is not repeated
blind — see item 9 in `backlog.md` for what this means for now.** Found on the Playground's tooltip once
moved onto `GlassSurface`: a patch of whatever sat behind it rendered sharp and barely warped instead of
frosted. Chased with a standalone sandbox — raw `feTurbulence` / `feDisplacementMap`, no library code — every
test run in the browser this session had, which turned out to be headless Chromium and headless Edge, both of
which render SVG filters on the software path unless told otherwise. Under that path, the fault tracked one
variable cleanly: whether the layer was clipped by anything at all. `clip-path`, an ancestor's
`overflow: hidden`, on the layer itself or a grandparent two levels up, all reproduced the identical defect in
the identical place; `mask-image` on an ancestor failed differently and worse, since masking an ancestor forms
its own boundary that `backdrop-filter` cannot see through, so the layer stopped seeing the page behind it at
all. Leaving the layer fully unclipped was the only configuration that rendered correctly under software
rendering, at every setting pushed. A plain `backdrop-filter: blur()` layer, clipped the same two ways, showed
nothing wrong at any blur radius tried under that same path — that finding was never re-checked against a real
GPU window and should not be trusted further than that.

An unclipped oversized layer is not shippable regardless: it paints a hard rectangle past the rounded pane in
every direction, and — measured directly by wrapping the pane in a scroll probe — it grows a scrollable
ancestor's `scrollWidth`/`scrollHeight` by the margin, the same growth `overflow: hidden` was already added
once to stop. So a fix needs the shape drawn some other way, and one was built: `feImage` referencing a data
URI built from `computeMarginedClipPath`'s own path — the same string `clip-path` already used, drawn as a
filled shape instead — composited against the displaced result with `feComposite operator="in"` as the
filter's own last step, with the filter region switched to an explicit `userSpaceOnUse` box matching the
layer's own size so the mask's coordinates are unambiguous. It rendered perfectly under software rendering, at
default settings and pushed hard on both blur and ripple. **It does not render correctly under a real,
GPU-accelerated window**, checked directly in desktop Microsoft Edge after the user reported still seeing the
fault post-fix. The corruption under GPU rendering is a different shape from the original one — not the same
fringe, but a precise, repeatable notch at two diagonally opposite corners of the mask, present with the curve
built from 12 line segments and unchanged at 96, present at a device pixel ratio of 1 and unchanged at 4. Both
of those rule out the two cheap explanations — a too-coarse curve, a DPI/rasterization-scale mismatch — without
identifying what the real one is. The fix was reverted; nothing about this component has shipped from this
investigation.

**Tried the same masking technique on the Playground's raw SVG-filters page and it does not carry over
either.** That page applies `filter: url(...)` (not `backdrop-filter`) directly to the element being warped,
and there `feDisplacementMap`'s painted output ignored every clipping mechanism tried — `overflow: hidden` on
an ancestor, `clip-path`, CSS `mask-image`, and the internal `feComposite` mask — while a plain `blur()` on the
same element clipped exactly as expected. That page was left alone too.

**This is a known, unresolved interoperability gap, not a defect in how any of this was built.** The W3C SVG
working group has an open issue asking for an interoperable way to do backdrop displacement/refraction for
"liquid glass" UI precisely because `backdrop-filter: url(#svg-filter)` combined with `feDisplacementMap` is
not currently reliable across — the proposal is a real filter input (`BackdropGraphic`) to replace the current
approach, not a workaround for it: [w3c/svgwg#1142](https://github.com/w3c/svgwg/issues/1142). Safari does not
implement the combination at all: [WebKit bug 245510](https://bugs.webkit.org/show_bug.cgi?id=245510). A
community library built around the same technique independently documents the margin/filter-region trap this
file already worked out on its own, and separately lists GPU jank and stacking-context interference among its
own known gotchas. Nobody has written up the specific two-corner symptom found here, but the broader picture
holds everywhere it was checked: this combination is unreliable across the ecosystem right now, not just in
this codebase. Re-open when the platform actually supports it — the W3C issue above is the thing to watch —
and do not re-attempt a CSS-only or filter-internal workaround in the meantime; every shape that one could take
has already been tried once.

### The Playground does not use `GlassSurface` outside its own page

It was commissioned to replace the Playground's example boxes and left navigation, and for a while drew the
tooltips. The user dropped all of it: heavy, busy and buggy. The boxes and the navigation paint a plain opaque
gradient, and every tooltip is a `Shape`, arrowed or not. The component keeps its page.
