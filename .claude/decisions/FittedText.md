# Decisions: `FittedText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `FittedText`: lines sized to fill their box, around a function that sat unused

A component around `JSXTextMetricsUtils.getNormalizedFontSizes` in `ss-utils`, which nothing called. The consumer hands
over the lines already split, the user's call: splitting text into lines is not part of it. Every line is scaled to
the box's full width, then all of them shrink by one factor until the stack fits the height, so a short line comes out
larger than a long one.

**The box is the container's.** The root fills its parent on both axes, as `CardStack`'s does, so a consumer sizes the
text by sizing what it sits in, and the lines are measured against the root's layout size, which a scaled ancestor
does not change. `lineHeightRatio` is each line's height as a multiple of its own size, and it is both the CSS
`line-height` each line is drawn at and the room the fit leaves for it, so the two cannot disagree.

**The font is the one the component inherits, read off the root when it measures.** The lines are measured on a canvas
at a reference size and scaled from there, so the reference does not matter; letter and word spacing are carried as a
share of the root's own size, so spacing written in `em` keeps its proportion as a line grows. It measures again when
the box changes size or a web font finishes loading — the two events `Typewriter` already watches — and the
controller's `update` is the way in for a change it cannot see, such as a class on an ancestor that swaps the font.
