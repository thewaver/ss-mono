# Decisions: `ShadowCaster`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ShadowCaster`: a wrapper, and a filter rather than a box shadow

The first of two components lifted out of the `PointerTracker` page as it was pruned. The user's question was
whether a generic component could be wrapped around content to apply the effect, and the answer was yes — the
library already says an effect is a function from measurements to CSS values, in `Proximity` and in `Wheel`'s
`computeEffect`. This is that idea against one element's own box rather than against an arrangement.

**Two small components rather than one general wrapper, and the user took the cost knowingly.** The
alternative was a single wrapper taking an effect function, with the tilt and the shadow as sample effects,
the way `Placement`'s layouts and `Proximity`'s effects already are. It was rejected as too much to guess
from two examples: each of these can be built without predicting what a third would need, and the user's
reason for preferring it was that components composite. **The cost is a tracker per component**, so wrapping
one in the other runs two of them over the same element. The user's answer, recorded because it is the shape
the fix will take: a shared tracker could be passed in, with each component making its own when none is
given — the same arrangement ids already have. Nothing has been built for it.

**It draws with `filter: drop-shadow()`, not `box-shadow`, and that is what lets it be a wrapper at all.**
`box-shadow` draws the shadow of an element's own rectangle, so a wrapper using it would put a square shadow
behind rounded, clipped or partly transparent content — the wrapper does not know the shape its child paints.
`drop-shadow` follows the rendered alpha instead, so the shadow is correct for whatever the consumer puts
inside. Checked on MDN rather than recalled: the syntax is `drop-shadow(<offset-x> <offset-y> <blur>? <color>?)`,
it has been Baseline since September 2016, and the one thing it gives up against `box-shadow` is the spread
radius, which this effect has no use for. The other cost is that a filter is more expensive to paint.

**The root fills its parent and centers its child.** A wrapper sized to its content cannot resolve a child
asking for a percentage of it, which is circular; filling instead means a child's `60%` means sixty percent of
the space the consumer gave the wrapper. The wrapper's own box being larger than the content costs nothing,
because `drop-shadow` reads the alpha and an empty box contributes none.

**It does not read the reduced-motion preference, and `isDisabled` is how a consumer applies one.** That is
the recorded rule that nothing in the library consults the preference internally — the library reports and the
consumer decides. Disabled here means the shadow rests at a short straight-down throw rather than vanishing,
since a thing with no shadow at all reads as a different design rather than as a stiller one.

**The ramp ends at nothing, and resting is not the same state as far away.** The first build faded the
shadow to a floor of `0.25` at the edge of the light, which the user caught: at full distance there should be
no shadow at all. That is the honest end of the metaphor — the pointer is the light, so a pointer out of
range casts nothing. `minOpacity` therefore defaults to `0`. **What it must not take with it is the resting
shadow**, which is a different thing wearing the same number: a page with no pointer on it at all, or one
that has turned the effect off for reduced motion, still wants its content sitting on something. So
`restingOpacity` is its own prop and keeps the old `0.25`. Reading the two as one value is what produced the
fault.

**Both components take an `activeRangePx`, and it is separate from the ramp.** Asked for by the user once
both were up. Without it a pointer anywhere on the page drives every one of these on it, so a wall of cards
all lean and all throw shadows at once as the pointer crosses — right for a single thing on a quiet page,
wrong for a grid. Outside the range each rests, which for `Tilter` is flat and for `ShadowCaster` is the short
straight-down shadow. It is measured from the center rather than from the element's edge, the same way
`lightRangePx` already was, so the two numbers on `ShadowCaster` can be compared without knowing which basis
each uses. Left out it means no limit, so nothing that existed before it changes.

**Its own page draws on white rather than in a `PageMeasureBox`**, which is the exception already recorded
under _"an example borrowing the page's ground is claiming to be the page"_ — a black shadow needs a light
ground to read against. Nothing about the component asks for a checkerboard either: its box is its parent's,
and what the page is showing is the shadow rather than the extent.

**The color prop carries no alpha of its own.** Whatever is passed is parsed with `Color.parse` and re-emitted
with the alpha the distance ramp worked out, so a consumer chooses what the shadow is made of and the near and
far opacities decide how dark it is. Letting both carry alpha would mean two numbers multiplying into one
result that neither of them names.
