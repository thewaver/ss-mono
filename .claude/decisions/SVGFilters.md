# Decisions: `SVGFilters`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The `SVGFilters` page is the factory's

It was filed under `Abstracts` at first; the factory and its three siblings now live in
`Generators/SVGDefs` and the page is under the `Generators` section. What follows is otherwise unchanged.

Asked for as a page to test the filter defs factory. It renders no component of its own — what it shows is a
consumer built on top of something the library only hands out, and nothing here is a `Fundamental` or an
`Exotic` to demonstrate. That is also why it survived the prune described under _"Every abstract has a menu
entry, and a page with no examples is a config entry rather than a file"_: a factory's output has no other
showing anywhere in the Playground.

**It is named for what is on it, not for the folder it comes from.** The first build was `SVGDefs`, on the
reasoning that a gradient or a pattern example would be the same page's next section rather than its own menu
entry. The user renamed it: `Gradient`, `Pattern` and `Animation` sit beside `Filter` under one folder, but
the page holds the filter factory and nothing else, and a name promising the other three is a name that has
to be believed rather than read. If those arrive they get their own entries, and the menu says plainly which
is which.

**One subject, six examples, and every method of the factory appears exactly once.** The subject is a striped
card carrying a word, chosen because it answers three questions at once: stripes show a displacement, the
word's edges show a blur or a shadow, and a saturated fill shows the color matrix family. The examples are
the five primitive families — blur, drop shadow, turbulence, hue and tone — plus one that stacks four of them,
which is the only one where `method` is visible. Hue carries hue rotation, saturation and the color channels;
tone carries brightness, contrast and inversion; splitting them that way keeps either panel to a readable
number of knobs and still leaves nothing untested.

**The stacked example's four primitives are two `Sortable` lists rather than four checkboxes.** The user's
call, on the observation that the order genuinely changes the result: a blur before a displacement is not a
blur after one, and under `chain` the list reads exactly as the pipeline does. The first build was four tick
boxes in a local props panel, which could say whether a primitive was in but had nothing to say about where.
Two lists sharing one `groupId` — **Applied** and **Left out** — do both jobs with one mechanism: the position
in the first list is the position in the chain, and dragging into the second is the off switch. Emptying
Applied altogether is worth a try, because it is the state the stage's own guard exists for.

**A checkbox could not have lived inside a sortable item anyway.** The item slot already owns `pointerdown`
and `click` for the carry — tap to pick up, tap to place — so a control nested inside it would be fighting
the drag for the same gestures. Moving between lists is the toggle precisely because it does not need a
second gesture.

**The order lives on the page rather than in the example**, like `TrailPage`'s progress signals, because the
readout under the example names the order and the page is what writes readouts. `sizing={"fill"}` is on both
lists: an `InteractionWrapper` is `fit-content` by default, so an empty list collapses to the width of its
placeholder text and reads as a sliver rather than a target.

**`method` and the region are global props, because they are the factory's own two ideas** rather than any
primitive's. The region toggle is what `computeFilterPrimitives` does with `elementSize`: given one it writes
a `userSpaceOnUse` box grown by `maxOffset` on every side, and given nothing it falls back to the
`-50% / 200%` region. Turning it off with a large displacement or a long shadow is the fastest way to see the
fallback run out.

**The stage refuses to reference a filter that does not exist, and that is a real trap rather than a
nicety.** Every `add…` method has a no-op guard — a blur of zero, a saturation of one — so a factory whose
every call was an identity produces no primitives at all and `computeFilterPrimitives` answers `undefined`.
An element still carrying `filter: url(#id)` at that point does not render **at all**: a CSS filter
referencing a missing filter element takes the element off the screen rather than leaving it unfiltered. So
`PageFilterStage` memoises the defs element and writes the `filter` style only when there is one, and pulling
the blur down to zero shows the card unfiltered instead of showing nothing. `SVGDefsUtils.getBaseBlur` already
sidesteps this from the other end by answering `undefined` for the whole entry when there is no blur width.

**`SVGFilterMethod` was exported for the page.** The union lived inline on the factory's private
`SVGPrimitiveDefs`, so a consumer holding the choice in a signal had no name for it and would have had to
write `"chain" | "isolate"` again. It now sits in `SVGFilterDefs.types` beside the defs types, which the index
re-exports wholesale.
