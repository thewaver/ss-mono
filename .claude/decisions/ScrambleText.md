# Decisions: `ScrambleText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ScrambleText`: the text is replaced rather than animated, and that decides the whole shape

The sibling of `Typewriter` that `backlog.md` argued for before the item closed. `Typewriter` stages a CSS animation over text that never
changes; this replaces the character a position is showing, on a timer, until the position's own moment
arrives. Nothing about that is expressible as a keyframe, which is why it is a component rather than an entry
in the Typewriter page's effect list — the two things that block the CSS route are recorded below.

**It takes a string rather than children, and `Typewriter` taking children is not a precedent it should
follow.** `Typewriter` parses whatever is nested inside it, links and images included, because it only ever
adds a stagger on top of what is there. This has to know what every position is going to become in order to
scramble it, and a `<img>` has no character to settle on. A `text` prop states that contract in the type
instead of failing on the first consumer who nests an element.

**A position holds the width of the character it will settle on, and that is the whole of the layout
problem.** The naive build swaps the character in place, so a proportional font reflows the line on every
frame and the effect reads as broken rather than lively. Here every position is a box containing the real
character — kept in the flow, painted `transparent` while it churns — with the noise glyph absolutely
positioned over it. The box is therefore always the width of the answer, no measurement is needed, and the
noise is free to be wider or narrower than what is under it.

**`color: transparent` rather than `visibility: hidden`, and the difference is the whole accessibility
story.** The real string is what reaches assistive technology from the first frame, and every noise glyph
carries `aria-hidden="true"`. The spec
checks this as a relationship — the text read out mid-churn equals the text read out once it has settled —
rather than by naming the demo's copy.

**Characters are grouped into words, because an inline-block per character makes every gap a break
opportunity.** Without the grouping a line breaks mid-word, which is the second way this effect looks
broken. A word is one `inline-block` span, and an inline-block is an atomic inline box, so no line can break
inside it; the whitespace between words stays a plain text node, which is what keeps the real break
opportunities exactly where the text put them. `ScrambleTextUtils.getSegments` is that split, and it carries
each segment's `startIndex` so a weight still reaches the character it was computed for.

**The settle order is a weight per character, in the same 0..1 vocabulary the animation samples use.**
`computeCharacterWeights(count)` returns one number per position and the position settles at
`initialDelayMs + weight * settleDurationMs`, so left to right, right to left, outwards from the middle and a
scatter are all the same component with a different function. It is the 1D form of
`CellAnimation.computeSliceWeights` deliberately, down to the guarantee living in the resolver rather than in
each formula: `resolveWeights` clamps whatever it is handed and fills any position the caller skipped.

**A character has three states, not two, and the third is what makes a sequential reveal possible.**
`churnDurationMs` says how long one position churns before it settles; without it every position churns from
the first frame and only the settle is staggered, which is the whole-line effect. With it, a position starts
churning that long before its own settle time and renders nothing before that — so setting the churn window to
the gap between two consecutive settle times gives a line that grows one character at a time, each arriving as
noise and landing before the next appears. Asked for by the user as an example, and it needed the third state
rather than a new weight.

**A position that has not started yet holds its place, and this was got wrong first.** The first build took
those positions out of the flow, so the line grew as the reveal passed along it — and a word narrower than it
will be fits on a line it will not fit on once the rest arrives, so the word jumps to the next line
mid-reveal. That is the exact fault `Typewriter` exists to avoid, and the user caught it on the sequential
example. A not-yet-started position is now simply transparent: it takes its full width from the first frame,
so every line break is settled before anything is revealed, and it is still announced because transparent
text stays in the accessibility tree.

**A position's noise is seeded with a glyph, never with its own character, and that is not a detail.** The
noise array is rolled on an interval while whether a position _shows_ its noise is decided from the elapsed
time on every frame, so the two do not change together. A position that has not started yet holds no noise
of its own, and it used to fall back to the character it will settle on — harmless while it is pending, since
nothing is drawn then, but the moment it starts churning the overlay appears carrying that fallback and shows
the answer until the next tick rolls it. On a loaded machine the ticks spread out and eight positions were
caught mid-gap at once. `pickGlyph` was never at fault: it is handed the settling character as the one to
avoid and it avoids it. The seed is now a rolled glyph too, so there is no value a churning position can
display that is not noise. This is what `scrambleText.spec.ts`'s "never the character it is going to settle
on" has been checking all along, and it is why that assertion exists rather than being a nicety — a position
showing its own answer reads as having finished a beat before it has.

**Reduced motion is the consumer's to answer, and the component does not read the preference.** That is the
house line — the library reads `prefers-reduced-motion` in CSS in one place and never in JavaScript, and
`WheelPage` rather than `Wheel` is what withdraws the idle turn. The route here is `settleDurationMs={0}`,
which settles every position at once and produces no churn at all; `ScrambleTextPage` reads the preference
and passes it, and disables the duration field so that the override is visible rather than mysterious.

**The glyph set is `computeGlyphs`, inside the accessorized block like any other `compute*`.** Leaving it
out falls back to a default that is itself a function, `SCRAMBLE_TEXT_DEFAULTS.computeGlyphs`, so no consumer
needs `undefined` to mean "the built-in set", and the second hole in `AccessorProps` that `conventions.md` records — an
optional prop whose meaningful "off" value is `undefined`, the position `getIdleDelayMs` is in — does not reach
it. Why it takes the character is _"the glyph set is a function of the character it will settle on"_ below.

**The noise never shows the character the position is going to settle on.** `pickGlyph` excludes it from the
set before rolling. Without that, a position lands on its answer for a frame at random and reads as settled a
beat early, which is invisible in review and obvious in a spec.

### `ScrambleText`: `changedOnly` diffs the two texts, and a carried character must have settled to stay settled

**A text change is compared as a longest common subsequence, not position by position.** A position comparison loses everything after an insertion: adding " RC1" to "Build 1.4.3 ready" would re-scramble "ready" because it moved four places along. `ScrambleTextUtils.getCarriedIndices` pairs each new character with the old one it came from, so only what is actually new churns. Where two pairings are equally long, the one keeping the earlier characters of the new text wins, so the answer depends on nothing but the two strings. The table is the product of the two lengths, which is nothing for a line of text.

**A carried character starts settled only if it had settled when the text changed.** A text changed mid-run would otherwise let a still-churning character jump straight to its answer. So the component takes a snapshot of which old positions had settled at the moment of the change, and a character counts as carried over only if it was both paired and settled. **The first run and `restartAnimation` scramble everything**, because a restart is a command to replay, not a text change. Changed characters keep their weights across the whole text, so the order and the run length do not depend on what changed.

### `ScrambleText`: the glyph set is a function of the character it will settle on

**The glyph set is `computeGlyphs(character)`, so a position can churn among its own kind.** A digit churning through letters reads as noise, while a digit churning among digits reads as a counter. Being a function, it goes inside the props block like any other `compute*`, so it needs no exception to `AccessorProps`. The default is `SCRAMBLE_TEXT_DEFAULTS.computeGlyphs`, one mixed set for every character. The `matched` sample keeps case: it compares a character with its lower- and upper-case forms rather than testing for A–Z, so an accented capital churns among capitals. The glyph and weight samples live in `Samples/ScrambleText`, and `Typewriter` reads the weights from there too.
