# Decisions: `Staircase`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Staircase`: the direction is the component's, and the curve is the consumer's

**A step's indent comes from a function of its index**, and the four curves the original shipped —
linear, a broken bilinear, repeating, alternating — are `CellAnimation`'s weights again: one opinion about how
to author the function the component actually asks for. They are samples under
`Samples/Staircase/Indents`, and only the linear default lives in the component, because a component with a
required function and no default cannot be written down in one line.

**The direction knob hands the steps back to front instead of being passed down.** Every one of the original
functions took a `direction` argument and half of them ignored it, named `_direction` to say so. Reversing the
index before the function sees it puts the flip in one place, and the function's defs shrink to the three
fields all of them use. The e2e spec asserts the two staircases on the page are each other's mirror, which is
the property that arrangement buys.

**Indents are physical padding on a wrapper, not a logical property.** `padding-left` and `padding-right`
rather than `padding-inline`, per what was then the field convention: the value is symmetric so the two are
equivalent today. The text fields have since gone logical, which removes the convention this leaned on; it has not
been revisited.
