# Decisions: `CornerPin`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `CornerPin`: four grips that pin a wrapper's corners, over an abstract that does the arithmetic

Asked for by the user as two pieces: an abstract that works out the math, and a component that draws four corner grips
and stretches its content through it. The tube was the first consumer of the abstract and the reason for both.

**The name is the effect's industry name.** After Effects calls exactly this Corner Pin. The user's first word was
`Skewer`, set aside because CSS's `skew` only makes parallelograms and this makes any four-sided shape. The abstract
is `QuadWarp`, `QuadWarpUtils`, the user's name for it: sharing `CornerPin` would have put two units of one name in the
Playground, whose dependency map is keyed by name, so the component's page would never have listed the abstract it
stands on.

**The arithmetic is a projective map onto four points, written as a `matrix3d`.** `QuadUtils.toCss` solves
the map from the unit square onto the four corners (Heckbert's square-to-quad form) and scales it by the element's own
size, so it needs `transform-origin: 0 0`. The content is a flat sheet seen in perspective: straight lines stay straight
and nothing can bend it, a limit the user accepted when the effect was put to them. A shape whose corners do not all
turn the same way cannot be drawn, so the transform is `undefined` for it.

**Corners are shares of the box, `0` to `1` on each axis.** The user's call, over pixels: a resting shape is written
without measuring anything, and resizing the box carries the corners with it. `QuadWarpUtils.RESTING_CORNERS` is the
untouched box. `corners` is two-way, written back by every route that moves a grip.

**A corner may go past the box's edges by `reachRatio`, and stops short of folding.** The user's call, so
the content can be stretched as well as squeezed. Folding is the one thing the math cannot draw, so `clampMove` moves
the corner along its straight path and stops it where any corner would come within a margin of lying on the line
between its neighbors; each of the three turns a moved corner affects is linear in its position, which is what makes
the stopping point exact rather than searched for. An already folded shape is never folded further.

**The route without dragging is tap a grip, then tap where it goes.** WCAG 2.5.7 asks that dragging can be done with a
single pointer and no drag, and a keyboard route does not count towards it. The user's call, over handing out commands
for the consumer to wire, because the library ships the accessible route itself. While a grip is picked a catcher
covers the box widened by the reach, so the second tap lands anywhere a corner may go; it exists only from the pick to
the put-down, so it takes no presses at any other time. Tapping the picked grip again, or Escape, puts it down.

**The keyboard and a screen reader reach each corner as two sliders, across and down — eight tab stops.** `ColorArea`'s
shape, a hidden range input per axis, and the standing rule that a control holding several values is one tab stop per
value (_"An enabled multi-element control stays one tab stop per element"_): a corner is two values, and one control
cannot honestly carry two. The names are the consumer's, `gripLabels`, and each axis reads out as a percentage.

**The grips are painted by the consumer**, `renderGrip`, told which corner, where it is, whether it is picked or being
dragged, and which axis shows keyboard focus. The box is the content's own size at rest; the stretched content spills
past it, which is the rule for anything turning under perspective.

**The corner names are `QuadCorner`, in `ss-utils`.** `CornerHighlight` had declared the same four values for its own corner marks; two
names for one idea would have read as two ideas, so both components took it from `Abstracts/QuadWarp` as `CornerKey`, and
it went to `ss-utils` with the rest of the four-corner geometry as `QuadCorner`.
