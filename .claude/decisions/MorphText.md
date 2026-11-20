# Decisions: `MorphText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `MorphText`: two copies melting into each other under one filter

From Magic UI's Morphing Text. When the text changes, the old and the new copies cross-fade while blurring, under a
filter that makes anything half-transparent either solid or clear, so the blur melts one word into the next.

**It sits in `Exotics/Text` beside `ScrambleText`, whose contract it shares: text that changes with an effect.** The
user's pick over a text switcher in `MediaSwitchers`, whose components own a list of values and step through it.
`MorphText` takes one `text`; cycling through words is the consumer's timer, as with `Typewriter`'s phrases, and the
Playground's examples each own one with a Pause button, which is the stop WCAG 2.2.2 asks of anything moving for more
than five seconds.

**The content arrives as a function of the text, `renderText`, not as children**, because the outgoing text is drawn
beside the incoming one and both need drawing. Left out, the text is drawn as it is.

**The filter sits on the component's own box**, an SVG `feColorMatrix` that stretches alpha far past one and pulls it
back down (`MorphTextUtils.THRESHOLD_MATRIX`), so plain text and `PaintedText` both work inside, gradient and pattern
paint included. It is applied only while a morph runs, so text at rest keeps its normal smooth edges.

**The blur and the opacity follow Magic UI's curve**: a copy's blur is `maxBlurPx / share - maxBlurPx`, capped at
`maxBlurPx`, and its opacity is `share ** 0.4`, so both copies are visible and blurred across the middle, where the
filter fuses them (`computeCopyStyle`). The clock is a frame loop in `MorphTextUtils.createMorpher`; a change part-way
through starts a new morph from the text that was arriving, and `morphDurationMs: 0` swaps at once, which is the
reduced-motion route, the consumer's call as everywhere else.

**Only the incoming copy is offered to a screen reader**; the outgoing one is `aria-hidden`. The copies share one
grid cell, so the box is as large as the larger of the two and nothing around it moves.

**The root is a block-level grid, not an inline one.** The first build used `inline-grid`, which sizes to its content,
and a freshly mounted `PaintedText` copy measures its wrapping width from its container — so the outgoing copy wrapped
to nothing for a frame and the whole example grew taller at the start of every morph. Taking the container's width
removes it; a consumer who wants the text inline wraps it in an inline box of their own.
