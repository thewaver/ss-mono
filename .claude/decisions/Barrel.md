# Decisions: `Barrel`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Barrel`: the drum, lifted out of the wheel so a second component can turn one

A drum and a carousel are the same picture driven by different arithmetic — a barrel of faces seen through a
perspective, turned to bring one of them to the front. What differs is where the angle comes from: `Rotator`'s
spin, overshoot and settle for a wheel, an index and a step for a carousel. So the barrel is a `Primitive` and
the angle is its caller's.

**It renders, which is why it is a `Primitive` and not an `Abstract`.** `Barrel` is four nested elements — a
girth box, a perspective box, the barrel itself, and one absolutely positioned element per face — and lifting
only the arithmetic would have left both consumers holding the same markup and the same four class names. The
split is drawn where it costs nothing: the primitive owns the box, the depth and every face's `transform`; the
consumer owns the element around it, what goes inside each face, and every word said about them.

**Each face's name and hidden-ness come back through `computeFaceDefs`, because the vocabulary is the
consumer's.** A wheel's faces are wedges and a carousel's are slides, and the two disagree about what is
hidden — a wheel hides everything but the wedge at the front, and only its own rules say so. `Barrel` takes
`faceRoleDescription` and asks per face for a label and whether it is away, then writes `aria-hidden` and
`inert` from the answer. It never decides either.

**The geometry is `BarrelUtils`' alone, and the wheel keeps no names for it.** The move first left
`WheelUtils` behind as aliases of `BarrelUtils` so the wheel's old unit tests could prove the move changed
nothing, which is the standard the `RotationUtils` conversion was held to. Once it had, nothing called the
aliases, so `WheelUtils`, `DRUM_PERSPECTIVE_PX` and the file holding them went: a second published name for
the same function is a second thing to keep in step for no reader. The perspective is
`BarrelUtils.PERSPECTIVE_PX`, the geometry's unit tests are `Barrel.utils.test.ts`, and the wheel's own
Playwright suite — including the drum's "paints inside the room it reserves" checks — is what guards the
drum as a whole.

**The face transform is a function now, rather than a template literal inside the markup.** It was the one
piece of the drum with no test around it: an axis, a face, an angle, an index, a count and an apothem in;
`rotateY(-120deg) translateZ(50px)` out, with a half-turn appended for a back. `BarrelUtils.getFaceTransform`
is unit-tested against those strings, which is cheaper than reading them off a rendered page.

**A barrel carries a transition duration it does not use by default.** The wheel animates its angle frame by
frame and wants no transition at all, so the property is declared and the duration left unset, which is a
transition of zero. A carousel steps its angle in one jump and asks for the duration it already publishes.
Both behaviors live side by side rather than one winning.
