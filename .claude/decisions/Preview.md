# Decisions: `Preview`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Preview`, which shortens rather than hides

Settled with the user, for a "read more" on the Playground's card. A `Preview` shows its content down to a
height the consumer sets and opens it the rest of the way on a press.

**It is a component beside `Collapsible`, not a prop on it, because the two disagree about what collapsed
means.** MUI and Chakra took the other route — `collapsedSize` and `startingHeight` on their own `Collapse` —
and it costs them nothing because their `Collapse` is a bare transition wrapper with no `aria-expanded`, no
`aria-controls` and no `inert`. Ours has all three, and one of them **inverts**: `Collapsible` marks its panel
`inert` while closed, which is right when nothing shows and wrong here, where the opening lines are on screen
being read. A flag that silently reverses an accessibility rule is not a flag.

**Nothing is ever hidden from a screen reader, and that is a consequence rather than a choice.** `inert`
cannot be lifted off part of a text flow, so the remainder past the cut cannot be sealed without sealing the
visible opening too. The control is therefore an affordance for the eye, and a reader using a virtual cursor
gets the whole text. `preview.spec.ts` asserts it, because it is exactly the thing a later change would
"tidy up" by copying `Collapsible`.

**`getCollapsedHeight` is required, alone among the props.** There is no defensible default: the right
height depends entirely on what is being shortened, and a component that guessed would be inventing the one
number it exists to hold. `Spotlight`'s `getPadding` defaults to 0 because 0 means "no padding"; there is no
equivalent no-op height.

**Content that already fits gets no control and no overlay.** A control that opens nothing invites a press
and does not reward it. Mantine's `Spoiler` does the same — under its `maxHeight` it renders the children and
nothing else — and it is the reason the overflow test drives the paint as well as the button.

**An unmeasured content box reads as the collapsed height, never as zero.** The height observer starts at 0,
so the first render would otherwise ask for a zero-height box and then grow to the collapsed height once the
measurement arrived — a preview that visibly unfolds on page load, and a transition running before anybody
touched anything. Reading "not measured yet" as the collapsed height means the common case, where the content
overflows, never changes height at all.

**The overlay's visibility target is 1 while collapsed, which is the one place a renderer is handed the
inverse of the open state.** It is the fade that says there is more, so it belongs to the shortened state;
handing it the expanded target would mean every consumer writing the inversion themselves. The pair is
`(getVisibilityTarget, getTransitionDurationMs)` as everywhere else, and the wrapper around it is positioned
across the bottom of the shortened box — which is the library's element and unreachable from `renderContent`,
the same reason `InteractionWrapper` owns the box its `renderDecoration` paints into.

**The overlay sits beside the clipped box rather than inside it, and hangs a pixel below it.** A `Preview`
holds two elements whose bottom edges are the same line: the box that cuts the content off, and the fade drawn
over the cut. When that line does not land on a whole screen pixel — which is the normal case in the
Playground, where everything is inside a `Viewport` scaled by a fraction — the browser paints the last part-row
by mixing what is under it with what is behind it, and it does that **once per drawing operation rather than
once for the whole box**. So the fade covers three quarters of that row, the text underneath covers three
quarters of it, and the quarter the fade misses is a quarter of the text: a hairline of clipped letter-tops
along the bottom edge, right above the trigger. Pushing the overlay down while it is still inside the cut
changes nothing, because the cut trims it back to the same line. **The overlay therefore lives in an unclipped
frame wrapping the box, and its `bottom` is `-1px`**, so it covers that last row outright instead of sharing
it. The trade is that the overlay is no longer trimmed to the box: an overlay taller than the collapsed height
now spills above it rather than being cut, and it paints over the top pixel of whatever follows — the trigger —
which is why it stays `pointer-events: none`.

**The scroll is opt-in and fires on the way in, which is the opposite of `Accordion`'s.**
`getIsScrolledIntoViewOnCollapse`, off by default, for the user. Opening pushes what is below further
down and leaves the reader looking at the text they asked for, so nothing should move; closing pulls it all up
by the height that just vanished and takes the control they pressed with it, so something should. `Accordion`
is the mirror image — its growth is the event that can leave a section below the fold — which is why the two
props are named for the half they act on rather than sharing one name. The machinery underneath is the same,
latch and all: see _"Scrolling a newly opened section into view is `Collapsible`'s"_ for why the wait, the two
calls and the extra frame are each there.

**`Fold` is reserved and must not be spent on anything else.** The user's call, made while naming this: it is
being kept for a possible component that folds in the literal sense, growing or shrinking by 2× or 0.5×.
`Spoiler` was rejected for meaning content concealed until revealed, `Summary` because `<summary>` is the
**trigger** half of a native disclosure, and `Excerpt` because a name has to be spellable from memory.
