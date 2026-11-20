# Decisions: `Formation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Formation` is the abstract's, and the placed box became two things because of it

Part of the same fold. `Formation` held a second copy of the machinery: a root with `containerType`, a spacer
that gave it its shape, an absolutely positioned item per entry, and its own vocabulary of insets. All of it
was `Abstracts/Placement` under different names.

**A placement's box does not always size itself, and that is the one real correction `Formation` forced.**
`PlacementLayout.width` is optional now, and `PlacementBox` falls back to filling its parent. This is not a
concession: a layout that works in fractions has no pixel size to state, and one that works in pixels does.
The alternative was making `Formation`'s arrangements invent a width, which would have turned a fluid
component into a fixed one — the opposite of what _"one side comes from the parent"_ says about `Mosaic` and
of what `Formation`'s own entry argues.

**The floaters stopped multiplying by a width because of it.** `Tabs` and `RadioGroup` had been converting a
placement into a pixel box by multiplying through `layout.extent`, which only works for a layout that has one.
Both now write the floater in the same container-query units the items use, which means the floater has to
live inside the box rather than beside it — and that is simpler than what it replaces, since there is no
conversion left to get wrong.

**Neither `FormationInset` nor `FormationLayout` survived.** A layout is not the same shape as before, because
`insets` became `placements`, so its old name had nothing to point at. An inset and a placement are the same four
numbers, so `FormationInset` was kept for a while as an alias of `PlacementRect` — but nothing referred to it,
and an alias nobody uses is a second name to keep in step for no reader, so it went. `PlacementRect` is the one
name.

### The grouped panel is every page with a sample picker, not just `Formation`

The sample group, the divider and the global group below it went to the four other pages that drive a sample
from a picker: both gradient pages, `GlassSurface`'s border pattern, and `ShapePage`. `ScanlineAnimation` was
left alone at the user's word.

**A group exists only where props depend on each other to be shown.** The user's rule, in their words: if prop
Y only shows when prop X is set to a particular value, X and Y belong in a separate group with X first. Props
that are related but not dependent in that way get no group, however closely they belong together. So a picker
whose choice brings its own knobs with it — a gradient family, a layout, an effect — heads a group with its knobs
under it, and a picker that shows or hides nothing goes with the rest: `ShapePage`'s fill pattern and fill cell size are in the global panel, because the
pattern brings no knobs. **The same holds inside an example's own popup**, which is one flat list with no
dividers, since nothing there shows or hides anything. `ShapePage`'s geometry — shape, corners, radii, exponents
— sits in the popups of the two examples that use it, and clip and pad in the first one's only; the stroke,
fill and timing are page-wide because all three examples draw them.

### `Formation`: positions written as fractions of the width, and nothing measured

**The original measured its own width with a `ResizeObserver`, computed pixel insets from it and carried a
comment saying to remove all of that once container query units existed.** They exist. Every inset a layout
function returns is a fraction of the formation's inline size, the component writes them as `cqw`, and the
browser resolves them — so there is no observer, no state, no frame of wrong layout on mount, and no
arithmetic to redo when the container changes size. `formation.spec.ts` checks a written position against the
root's measured width, because the failure mode is silent: with no query container in scope `cqw` falls back to
the small viewport width and every item lands somewhere plausible and wrong.

**The root's own height comes from a spacer child, because an element cannot query itself.**
`container-type: inline-size` makes the root a container for its **descendants**, so a `min-height` in `cqw` on
the root would resolve against whatever container sits above it. A single in-flow spacer whose height is the
layout's `heightRatio` in `cqw` gives the root its height instead. There is no circularity: inline-size
containment leaves the block axis free, which is exactly the case that unit was designed for.

**The podium arrangement sat unevenly in its box, and the fault was vertical rather than horizontal.** The
sideways offsets are deliberate — first place at 0.4375 of the width with the other two at +0.25 and -0.125
from it, which leaves an equal margin at each side even though the three are not symmetric about first place.
What was wrong is that the first row started a quarter-and-a-bit down while the last row ended flush with the
bottom, so the arrangement had a gap above it and none below. It now starts at its own half-height, the way
the whorl arrangements already did, and `formation.spec.ts` measures the four margins rather than any one
coordinate — which is the assertion that would have caught it, and the one that does not have to be rewritten
when a sample's numbers change. Corrected by the user after a first attempt moved the horizontal offsets, which
were never the problem.

**Width-relative rather than height-relative, so a taller parent leaves space instead of stretching.**
`top` and `height` are in `cqw` too, not in percentages — a percentage `top` resolves against the height, and
an arrangement stretched vertically by a parent that happened to be tall is a distorted podium. Every number
in a placement is therefore in one unit, and `heightRatio` is the honest bottom edge of the lowest
item rather than the original's hand-tuned trims.

**This is the first use of container query units in `components/src`, and it carries no fallback.** Argued on the
terms _"Compatibility arguments cite `components/src` and nothing else"_ sets: caniuse puts the units at 94.05%
globally, from Chrome 105, Safari 16 and Firefox 110. `InteractionWrapper.css.ts` already depends on `:has()` with no
fallback — 94.07%, and Firefox 121, which is **ten months later than the unit being added here**. So the
published package already requires a strictly newer browser than this does, in the one component every control
passes through.

### `Formation`: gliding between arrangements is a transition on the placed box, and the angle left `transform` to allow it

**The glide belongs to `PlacementBox` and `PlacementItem`, and `Formation` only feeds them.** The box holds one duration and hands it to its items through the context, returning `0` while the user asks for reduced motion. Each item takes its own delay, and a stagger is simply that delay growing with position. Any other control that places items can glide by passing the same prop, with nothing new to learn.

**The angle is written to `rotate` and the centering offset to `translate`, so `transform` carries nothing but the pointer effect.** A transition on `transform` would make the effect trail the pointer by the glide's duration. With the three properties split, the glide transitions `left`, `top`, `width`, `height` and `rotate`, and the effect stays immediate. The browser applies them in the order translate, rotate, then transform, which is exactly what `translate(-50%, -50%) rotate(a) effect` in one `transform` draws, so nothing looks different. Individual transform properties date from Chrome 104, Safari 14.1 and Firefox 72 (caniuse, 95.37%), older than the container-query units the component already needs.

**A resize never glides, and the transition only exists while a rearrangement is running.** Positions are in `cqw`, so a resize changes their computed values and would start a transition on every item. An item therefore switches its transition on only when its placement changes, and off again once `getAnimations()` says every transition it started has finished. A resize arriving outside that window follows at once.

**A zero duration writes no transition at all, so a stagger cannot delay a reduced-motion jump.** `left 0ms ease 200ms` still waits 200ms before jumping. WCAG 2.3.3 Animation from Interactions was checked: motion triggered by an interaction can be switched off, and reduced motion switches it off.

### `Formation`: items are keyed by themselves

**`For` over the items, not `Index` over positions**, so taking an item out removes its element and leaves the neighbors' elements where they were, instead of handing each one the next item's contents. The index a render receives is reactive, and `renderItem`'s signature is the same either way.
