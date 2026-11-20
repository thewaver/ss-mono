# Decisions: `Tilter`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Tilter`: it tracks the area, not the surface that turns

The second component lifted out of the `PointerTracker` page, and the same wrapper shape as `ShadowCaster`.
The name went through `PlaneTilter` first — the user's image was of something flat being pulled out of its
plane — and settled on `Tilter` because the wrapper does not care whether what it holds is flat.

**The tracker is on the root, and the rotation is on a child of it.** Putting both on one element is the
feedback trap: a rotated element's bounding rectangle is not the rectangle it had before the rotation, so the
reading that caused the turn is taken against a box the turn has already changed. `Proximity`'s magnet entry
records the same trap from the other side — track the box a thing sits in, not the thing. Splitting them also
gives the `perspective` somewhere to live, since a rotation about X or Y does nothing without one on an
ancestor.

**The turn has two falling halves, and only one of them was built first.** The user's description of the
curve: nothing at full distance, growing as the pointer approaches, and shrinking again once the pointer is
on the surface and heading for the middle. The inner half came for free — the turn is driven by how far the
pointer is from the surface's center, so dead center is a card being looked at straight on and it lies flat.
**The outer half was missing**, because the position is clamped to the surface's own box: a pointer anywhere
outside read as being exactly on the edge, so the turn stayed at full strength however far away the pointer
went. `tiltRangePx` is the fix — a multiplier that is `1` while the pointer is on the surface and falls to
`0` as it walks out to that distance.

**The fade runs from the edge rather than from the center.** Measuring from the center would mean a wide
surface reaching full strength before the pointer had touched it and a narrow one never quite getting there,
since the same number would sit at a different place on each. Running it from where the pointer actually
meets the surface makes the strongest turn happen at the edge for anything, whatever its size, which is also
where a hand pressing a real card would tip it most.

**What follows from tracking the root is that the consumer sizes the area the tilt answers to.** The turn
reaches its full angle at the edge of the box the wrapper was given rather than at the edge of the content,
so a card in a generous box tips gently and the same card in a tight one tips hard. That is a knob without
being a prop.

**The sheen is a slot, and this is where it differs from `ShadowCaster`.** A specular band has to take the
corners of whatever is under it, and a wrapper does not know whether its child is a square photo or a card
rounded to the house radius — a rectangular sheen over a rounded card shows its corners. `ShadowCaster` could
solve the same problem inside itself because `drop-shadow` reads the content's alpha; nothing equivalent
exists for a highlight painted over the top. So `renderSheen` is handed the state, including where the band
should sit, and the consumer draws it with their own corners. Left out, the surface simply turns.

**The band runs against the pointer, not with it.** A highlight that follows the pointer reads as something
painted on the card; one that slides the opposite way reads as light coming off a surface that has moved.
`sheenPosition` is reported already inverted, so a painter uses it as a gradient stop without having to know
that.

**Everything in the state is scaled by `strength`, and forgetting that for the sheen is what made it pop.**
The falloff was applied to the turn and not to the band, so walking the pointer away flattened the surface
while the highlight sat where it was at full brightness — and then vanished the moment the pointer left the
range, because the painter was gating it on `isResting`, which is a yes-or-no. A reflection cannot outlive
the tilt that produced it. Both now come off one leaned offset, so the band slides back to the middle as the
surface flattens, and `strength` is published so a painter can fade with it rather than switching on a
boolean. **`isResting` is kept, but it is the wrong thing to paint from**: it says the surface is not
answering at all, which is a state to skip work in, not a dimmer.
