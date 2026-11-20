# Decisions: `Anchor`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Anchor`: a placement may fall back within its family and never outside it

`getSafeHPlacement` and its vertical twin choose between candidates by asking each where the content would
land — `getHPlacementShift` plus that candidate's own `getHPlacementOffset` — and taking the least
overflow. They used to hand-derive a "space" figure per branch from the anchor's edges, which is how the
`in` branch came to ignore the content size and place content off-screen in 78 of a 240-case sweep.
Deriving the span from the functions that do the positioning makes that class of error unexpressible, and
fixes a second one: the offset was previously computed once from the _requested_ placement and reused to
judge its mirror, whose offset has the opposite sign.

**A placement never crosses between `in` and `out`.** `in` means aligned to an anchor edge and overlapping
it; `out` means beside it. Choosing between them is the consumer stating a relationship, not a hint — a
tooltip that hops from inside its anchor to outside has changed what it means. So `left_in` may become
`right_in` and `left_out` may become `right_out`, and nothing else. `center` may fall back to either `in`,
since a centered layer already overlaps.

The cost is measured: when an anchor is itself clipped by the viewport there are cases where no `in`
placement fits and an `out` one would have. All of them require the anchor to be partly off-screen.

**Content that fits nowhere takes the least-overflow candidate and may run off the screen.** `getPosition`
never clamps. Clamping would keep content visible at the price of detaching it from the edge it was aligned
to, which is the same trade as crossing families and refused for the same reason. A layer wider than the
viewport is the consumer's to size.

### `Anchor`: the positioning half of a floating layer, extracted

Settled, as the other half of the `Select` groundwork. A dropdown needs everything `Tooltip`
knows about placing a box against an element and nothing it knows about when to show one.

**The split is behavior from markup**, and the existing rule decides where it falls: _"it renders DOM, so
it is not an `Abstract`"_ means the extraction is the effect, not the popup. `Abstracts/Anchor/` holds
`Anchor` (the placement math, formerly `TooltipUtils`, moved unchanged) and
`AnchorUtils.createPortalPosition(getAnchorRef, getIsVisible, opts)`, which observes the anchor, measures the
content, resolves the collision-safe placement and returns `{ getPlacement, getPosition, setContentRef }`.
`Tooltip` lost sixty lines and kept its triggers, `aria-describedby`, `role` and markup.

**The name carries the coordinate space**: `createPortalPosition` returns a position in the `Viewport`
portal's space, which is what a consumer assigns to `top` / `left` on a portalled element. The anchor rect
still comes from `createViewportRectObserver`, so the scale factor is divided out exactly once.

**The anchor is read the moment the layer is shown, and that reading is the one it opens at.**
`ElementObserverUtils.observeViewportRect` measures once as it starts, before it listens or polls, and every
framework starts it from the effect that runs after the DOM is updated and laid out and before the browser
paints: `createEffect` in Solid, `useLayoutEffect` in React, `watchAfterRender` in Vue, `$effect` in Svelte. The
layer's own size comes from a `ResizeObserver`, which also reports before paint. So the first position at which
`Popover` stops painting `visibility: hidden` is already the final one, and no frame is needed to supply it.

The reading each framework also takes as the component mounts is not a substitute. It is taken when the
consumer's page mounts, which can be long before the layer opens and before the page has finished laying out:
on `ViewportWrapperPage` it catches the scrolled anchor with no height yet, and an anchor scrolled while its
layer is closed makes it stale in every framework, React's included, whose mount reading only happens to repeat
once the viewport context settles. Left to the poll, the correction arrives with the first frame, which is in
time while frames arrive and never comes on a page that is not painting — the layer then opens off its anchor
and stays there until some event moves it. Reading as the observer starts is also what `followScroll` and
`observeBorderBoxSize` already did; the frame-driven observer was the one exception.

This settles only the opening. What a layer paints while its anchor is moving is still open, under _"An
anchored layer is always a frame behind"_ in `backlog.md`, and this does not touch it.

**What stays duplicated is the dozen lines of `<Show><Portal><div>`, deliberately.** Both consumers portal
into the same mount and position absolutely, but disagree about everything else — a tooltip is
`role="tooltip"`, takes the pointer but never focus, and closes itself; a listbox is focusable, walkable and
`role="listbox"` — so a shared component would be a two-mode component. Behavior is shared; markup is not.
The tooltip was `pointer-events: none` throughout when this was written, which is no longer true and was
never what separated the two; see _"A tooltip can be hovered"_ below.

`Tooltip` is not renamed. `AnchorPlacement` replaces `TooltipPlacement` (and its `H` / `V` halves) because
the type is now shared vocabulary.

**The content's size is first taken at the browser's own measurement, never on the spot.** `Anchor` watched the
popup's size with an observer of its own, whose first report was the `ResizeObserver`'s first callback, after
layout. A later pass folded it into `ElementObserverUtils.observeBorderBoxSize`, which reports a spot measurement
straight away — right for its other callers, wrong here: the spot size came back before the popup's content was in,
the popup was placed and asked to take focus on that, and every menu in the Playground opened without focus in Vue
and Svelte, and the flick wheel in all four (124 specs). The Playgrounds could not build at the time, which is why
nothing caught it. The helper keeps both behaviors, per the rule on merging implementations that disagree:
`isImmediate`, default `true`, and `Anchor` passes `false` in all four frameworks.

### Arrows: grown on the unrounded contour, aimed by `Anchor`

Asked for by the user so that a tooltip or popover can carry an arrow whatever its placement or shape. Two
functions, which know nothing of each other beyond one small type, and `Shape` knows nothing of either.

**`ShapeUtils.attachArrow(geometry, aim, template)` works on the corners before any rounding.** The user's model,
stated in those terms: the arrow attaches to the sharp contour and returns its three new corners at radius 0, and
`getPaths` rounds what is left exactly as it would any contour. From `Shape`'s side, whether an arrow was attached,
drawn by hand or absent is opaque. A body corner the arrow swallows loses its entries in every list; the arrow's
corners take the template's `joinRadii` / `lameExponents`, sharp when it gives none; each of the arrow's two sides
takes the stroke thickness of the edge it grows out of, so a border runs round the arrow unbroken rather than
leaving a gap where it joins. A short list is padded before it is reshaped, so `[8]` still means every body corner.

**Where it attaches is a point, moved to the nearest place on the contour.** Chosen by the user over an edge index
plus a fraction (the consumer would have to know which index is which edge) and over a fraction of the whole
perimeter (lands somewhere different on every shape): `Anchor` knows only the box, and a point in the box's pixels
is the one form it can give for any contour the consumer draws.

**Direction is independent of position.** The user's point: an arrow near the bottom-left may want to point
straight down, at the middle, or left. `aim.angle` is degrees on screen, `0` right and `90` down.

**The arrow is a template in its own frame, and may be scalene.** The frame is an arrow hanging off the bottom of a
box — origin where it leaves the contour, `+y` the way it points — and the template is turned to `aim.angle`, never
mirrored. The user's lightning bolt (`0,0 · 10,0 · 20,20`) is why the triangle is three free points rather than a
width and a length; `ShapeConst.getIsoscelesArrow(baseWidth, length)` builds the ordinary one.

**Each base point is found by walking along the contour from the attachment point**, as far as the template's base
sits from its origin across the arrow, and towards the same side. On a straight edge that is the template exactly; at a
corner it starts the base that far down each of the two edges, so the arrow swallows the corner; on an octagon's corner
it reaches the two neighboring edges, which is what the user first asked of the rule. The two base points and the tip
replace the stretch of contour between them. Of the two stretches the base points split the contour into, the one
replaced is the one whose replacement leaves the larger area with the body's own winding, which is what makes the
result independent of which way the corners run. The walk never misses the contour, so only a tip inside the contour or
a base with no width attaches nothing.

**This replaced extending the two sides back from the tip until each met the contour**, after the user found corner
arrows far too wide on the Tooltip page's "Every arrow at once" example and chose to have them built from the corner
outward. Extending the sides failed at corners by its nature: off a box corner the arrow points along the diagonal, so a
side meets an edge at the difference between 45° and the arrow's own half-angle — a shallow angle, far from the corner,
which spread even the 14 × 9 triangle the Playground then started on into a long sliver down both edges, and a symmetric arrow at least twice
as wide as it is long never met them at all and drew nothing. Sliding each base point back along the arrow's direction
was considered on the way and set aside: it fixes the diagonal case but makes the same sliver for an arrow aimed at a
corner at any other angle.

**The arrow sticks out of the box, into the gap.** The user's call: the body is what `Anchor` measures and positions,
and making room for the arrow is the consumer's `offset`, if they want it. `Shape` already paints its layers with
`overflow="visible"`, and the gap is already bridged for the hover, so nothing else had to change.

**`computePoints` may return a `ShapeGeometry`, and its lists replace the props'.** `Shape`'s rounding props sit
outside `computePoints`, but an arrow's corners depend on the measured size, so only the contour knows which entry
belongs to which corner. An arrow-specific prop on `Shape` was proposed and refused by the user ("we can't put that on
Shape"); the general form was accepted because it carries no knowledge of arrows. Returned `strokeThicknesses`
replace each stroke's `thicknesses` in turn and keep its offset. `ShapeLayerUtils.computeGeometry` does the merge.

**`AnchorUtils.computeArrowAim` reads the aim off the placement.** Content beside the anchor on one axis grows the
arrow from the side facing it, slid to line up with the anchor's middle and held at the side's ends, pointing straight
out — sliding is what keeps it on the anchor after the screen edge has pushed the content along. Content off a corner
(`-out` on both axes) grows it from its own nearest corner, **pointing along that corner's diagonal** rather than at the
anchor's middle: aimed at the middle, the angle is rarely 45°, and the first build showed one side of the triangle then
running away above the content and the arrow vanishing. The diagonal lands on the anchor's facing corner when the
offset is the same across and down. Content over the anchor on both axes (`-in` or `center`
on each) gets no arrow: whichever covers the other, the arrow would start on top of what it points at — confirmed by
the user, who had expected exactly that case to be the awkward one. The point is in the content's own pixels. Solid's
`createPortalPosition` exposes it as `getArrowAim`, which `Tooltip` and `Popover` hand to `renderContent` after
`getPlacement`.

**The corner aim and the side fallback are provisional.** The user's words on taking both: the answers were tentative
and only testing will settle them. Reopening either after the Playground has been tried is expected, not a reversal.

### `Anchor` positions against a rect when it is given one

Settled, and it is the virtual anchor `backlog.md` has wanted since `Menu`.
`createPortalPosition` takes an optional `getAnchorRect`; when present it replaces the observed rect and the
element observer is not attached at all. Everything downstream is unchanged, because the placement maths only
ever saw a rect.

Two consumers arrived together, which is what made it worth doing rather than inventing privately inside one of
them: a spotlight positions its popup against the **padded hole** it cut rather than against the element
inside it, and a right-click menu would anchor to the point that was pressed. The second is not built; the seam
it needs now exists.
