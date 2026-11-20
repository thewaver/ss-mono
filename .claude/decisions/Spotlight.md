# Decisions: `Spotlight`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Spotlight`'s overlay is one masked layer and one clipped layer, not a ring of eight boxes

The user's suggestion, made while looking at `Reveal`, and taken as the option that keeps the pointer honest.
The first build cut the screen into the eight rectangles around the highlighted element and rendered the
consumer's overlay into every one of them, so the hole was a genuine gap in the DOM.

**A mask cannot replace the eight boxes on its own.** A single masked overlay looks right and then swallows
every click over the hole, which breaks `prompt` — the mode whose whole promise is that the highlighted control
is still usable — and makes the dark area of a `hint` include the one place a click must pass through. So the
paint and the pointer are now two layers rather than one: an overlay carrying the mask, `pointer-events: none`,
and a transparent blocker under it carrying a `clip-path` with the same rectangle cut out.

**The blocker is transparent on purpose, and that is what keeps it out of the browser bug.** Chromium handles
`clip-path` and filters on the same element badly; the masked layer is where the `backdrop-filter` lives and it
carries no clip, and the clipped layer paints nothing at all, so the two never meet on one element. This is the
same shape as the rule the `Reveal` entry records for masks and filters, arrived at from the other side.

**One polygon with `evenodd` and a seam, because `clip-path: polygon()` is a single closed path.** There is no
way to give it two subpaths, so the outer ring returns to the origin, runs a zero-width segment out to the
hole's first corner, traces the hole, and runs the same segment back. Crossing a doubled segment changes
nothing under either fill rule, so the seam is invisible; `evenodd` is stated explicitly rather than left to
`nonzero` so a later edit that reorders the points cannot quietly fill the hole in. It is Baseline widely
available and has been since January 2020. `path()` would have allowed two honest subpaths and no seam, but it
takes no percentages, so the layer's own size would have had to be observed to write it.

**`renderOverlay` gained a third argument and now renders once.** The signature is
`renderOverlay(getVisibilityTarget, getTransitionDurationMs, getMaskStyle)`, and the consumer spreads the mask
onto the element it was already returning — the same handout `Reveal` makes to `renderCover` and `Shape` makes
to `renderChildren`, with the same cost attached: an overlay that ignores the style covers the hole as well as
the page, and nothing can detect the omission. The overlay container took `display: grid` so the one child
still fills it, which is what the individual segments used to do.

**What visibly changed, both ways.** Eight adjacent `backdrop-filter` elements each blur their own patch and
each clamps at its own edge, so the four lines running out from the highlight carried a faint seam; one layer
blurs continuously and they are gone, and it is one filter pass per frame rather than eight while the
highlighted element moves. Against that, the blur now samples across the hole's edge, so the highlighted
element's color bleeds a little way into the darkened ring around it. That is inherent to blurring the whole
backdrop and then punching a hole in the result, and it is what `Reveal`'s frosted cover has always done.

**The mask itself is `Abstracts/Cutout`, shared with `Reveal` and `ScratchCard`.**
`CutoutUtils.getMaskStyle(holes)` composes the full-coverage layer, a layer per hole, their positions and
sizes, and the `subtract` / `add` operators that turn them into holes — a dozen property names that were about
to be written twice. Each hole carries its own optional image: `Reveal` passes the SVG it builds from its shape
props, `ScratchCard` passes a feathered rectangle per merged run, and `Spotlight` passes none and gets a plain
`linear-gradient` layer, which is a hard-edged rectangle and is exactly the hole it had before. It took a
single hole when only `Reveal` and `Spotlight` used it; see `ScratchCard`'s entry for why the list, and why
`mask-composite` lost its prefixed twin. **Softness and shape were deliberately
not added to `Spotlight`**: the generalization makes them reachable, but a soft or rounded spotlight is a
design decision nobody has taken, and adding props under a refactor's justification is the thing that must not
ride along. Both pages now list `Cutout` in their derived Abstracts row, which is the mechanism working.

### Spotlights stack like modals: only the top one acts

Found while settling Toasts: every `Spotlight` acted as if it were alone — a document-wide Escape closed every
spotlight and any `Modal` above one, two prompts pulled focus back and forth forever, a second guide sealed the first
guide's popup, and two overlays dimmed the page twice. The user's call: a spotlight demands the reader's whole
attention, so the model is `Modal`'s stack.

**The order is the dismissal stack's own, not a second registry.** Escape is already routed by that stack, and a
separate list of spotlights could disagree with it about who opened last. `Dismisser`'s layers became a store
(`DismisserUtils.openLayers`), a layer may carry a `group`, and `getTopLayerInGroup` answers which member opened last.
`SpotlightUtils.createLayer` puts every spotlight in one group; `getIsOnTop` is the test.

**A spotlight is registered while open or still fading out; it draws while open and on top; it acts while drawn and
on top.** One covered by a newer spotlight fades away but stays open (`visibility` stays `true`) and keeps its place
in the stack; when the one above has finished leaving, it fades back in and its effects re-arm — focus into the popup,
seal, hold, lift. Coming back counts as a first show, so the step is not announced; the popup takes focus and is read
there. `onShow` and `onHide` report opening and closing only, never being covered.

**Escape is the stack's; a hint's other keys answer only while no layer that takes input sits above it**
(`DismisserUtils.getIsTopForInput`). A hint registers as passive, so page shortcuts keep working while it shows; a
prompt and a guide take the keyboard as a dialog does. Checked against WCAG 2.1.2 (each Escape closes one layer, so
nothing traps) and 2.4.3 (focus follows the stack). A spotlight under a `Modal` still counts as the top spotlight,
harmlessly, since the Modal seals the page.
