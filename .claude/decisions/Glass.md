# Decisions: `Glass`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The glass effect is a type in `Abstracts`, and the sheen stopped being a sample

**`Theme.css.ts` exports its radii as bare numbers as well as CSS values.** `FOCUS_RING_WIDTH` was already
the precedent: a Playground page that has to hand a number to a component — `Shape` wants join radii as
numbers, not as `px` strings — otherwise invents one, and the first `GlassSurface` page invented 28. The
literals now live in `BORDER_RADIUS_HALF` and `BORDER_RADIUS_FULL` and the theme is built from them, so there
is one source of truth for both forms.

**`GlassDefs` names five groups, and the first of them is shared.** The effect has four parts — the backdrop
blur every browser gets, the ripple only Chromium gets, the tint, and the sheen — but the ripple and the sheen
were each describing their own noise, so the highlight sat on bumps the distortion knew nothing about. One
`noise` group carrying `frequency`, `octaves` and `seed` now feeds both, which is what makes the light respect
the distortion rather than merely coexist with it. The user's call, and it collapsed six controls into three.

**The two scales stayed apart, deliberately.** They look like the same knob and are not: the ripple's `scale`
is how far the shared field pushes the backdrop, in pixels, while the sheen's `surfaceScale` is how tall that
same field reads to the light. One field, two multipliers, two units. Merging them would have removed a degree
of freedom the tuning sweeps had been using. Asked about and settled by the user in those terms.

**`GlassDefs`'s remaining groups**: the backdrop blur every browser gets,
the ripple only Chromium gets, the tint, and the sheen. Nothing beyond what the effect actually has was
invented for it. It lives in `Abstracts`, which renders no DOM and is where shared vocabulary belongs, and
`Glass.utils.ts` assembles the defs there and hands them to `SVGFilterDefs.factory.tsx`, which is what writes
the elements.

**The sheen left `Samples/SVGDefs/Gradient` because the registry's contract could not carry it.** Every
sample in that registry has to be callable with the same `defs` bag — that is what lets a picker take any key
and call it with one payload. A sample needing its own inputs cannot be, and widening the shared bag would
put a field on all thirty-eight others that none of them read. Making the config type generic fails for the
same reason from the other end: a config demanding more than the uniform bag is not assignable to one that
does not, so it falls out of `Record<string, GradientConfig>` entirely. The user's call was that the glass
sheen is not a gradient sample at all, which is right — it is one component's identity, and it should not
appear in a dropdown of interchangeable options. Once it left the registry it also left the folder, whose
contract is one file per key with the key as the filename and which the source view resolves by name.

**This is why the factory rule does not apply to it.** _"Nothing is folded into a factory"_ governs sample
files, and this stopped being one. What remains in `Samples` are samples; the glass sheen is a builder with
one home that two callers use.
