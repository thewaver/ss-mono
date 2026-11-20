# Decisions: `Typewriter`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Typewriter`: erase is the same run played backwards, and the text rests hidden after it

**`mode: "erase"` reverses each character's animation and reverses the weights**, so the last character goes first and whatever keyframes the consumer wrote run backwards. It needs no keyframes of its own. **Once an erase ends the text rests hidden**, with `visibility: hidden` on each element, whatever the animation's first frame drew. A hidden link leaves the tab order and the accessibility tree, which is right for text that has been erased. **Changing `mode` starts a run**, so a phrase loop is only `onAnimationEnd` switching the mode. The phrase list, the hold and the loop stay with the consumer, and the Phrases example owns them. Reduced motion is the consumer's call, as it is for typing: the example sets the delay and duration to zero. The example has a Pause button, because a loop and a blinking caret that start on their own and run past five seconds need one under WCAG 2.2.2 Pause, Stop, Hide.

### `Typewriter`: one progress draws every moment, whether it plays or is driven from outside

Settled with the user while going through Made With GSAP's text effects and a scroll-lit paragraph on CodePen.
**`Typewriter` takes `progress` and `playback`, in the shape `CellAnimation` and `Trail` already have.** With playback
on it runs and writes `progress` as it goes; with playback off, writing `progress` draws that moment of the run. A
paragraph lit by scrolling is playback off with the progress taken from a progress observer; karaoke is the consumer
turning a song's time into progress.

**Every letter's keyframes are held, not played.** Each letter's CSS animation is paused, and its delay is its own
start less the run's time, `calc(<start>ms - var(--time))`, with the time one custom property on the driver's root
(`LetterDriverStyles.letterDriverTimeVar`, applied through `LetterDriverUtils.computeAnimationStyle`). A paused
animation's frame is its held time minus its delay, so moving the variable moves every letter at once to the frame
that moment calls for — partway through one letter's own keyframes if the moment falls there, the first frame for a
letter not yet reached (it fills backwards), the last for one that has finished. The playing case is the same
mechanism with the progress walked forward each frame by `TypewriterUtils.run`, so there is one way of drawing, not a
playing path and a scrubbing path. The cost is a frame loop while playing, where the old run started its CSS
animations and set one timeout; the loop writes one number and the variable is one style write, so nothing is per
letter. The rejected alternative kept running CSS animations while playing and re-anchored their delays on a seek,
which needs the moment each animation actually started — a frame the binding does not control.

**The caret is placed from the same progress, which replaces moving it on each letter's `animationstart`.** The old
rule existed so the caret could not drift from a clock running beside the animations; with one clock driving both,
there is nothing to drift from. `TypewriterUtils.computeCaretIndex` gives the place after the letter that most
recently started (before it while erasing), so a scatter of weights still jumps to the latest arrival. The drawers no
longer report letter starts, and `reportLetterStart` left the driver context.

**`playback` stays on once a played run ends.** `Trail` writes its playback off at the end; `Typewriter` cannot,
because a change of text replays the typing — `resetAnimationOnContent` and `resetAnimationOnLayout` — and that has to
keep working after the first run. So a played run that reaches `1` comes to rest, drawing the text plainly again, and
waits there. **A change rewinds the run only while it is playing**: a consumer driving the progress owns the moment,
and a content change only re-measures. **A driven run never comes to rest**, even at `1`, so keyframes that end
somewhere other than the text at rest — letters flying away — stay where they ended. `onAnimationEnd` fires only when a
playing run reaches the end. `restartAnimation` turns playback on and rewinds.

**An animation per letter is `computeAnimationName(character, index, count)`**, replacing `animationName`. The user's
pick over keeping both props: one animation is a function returning the same name. A whole element is passed as the
object replacement character and a break the text holds as a line feed — what the letter registry already reported for
those slots, now `LetterDriverUtils.WHOLE_ELEMENT_CHARACTER` and `LINE_BREAK_CHARACTER` — so an animation chosen by
character picks the same letters with or without a drawer. A change in the names it returns for the same characters
restarts the typing, which is how a function reading a signal behaves like the old accessor did.

**A break the wrapping inserted is not a letter.** `getInlinedSegments` used to emit one token for every break, so a
reflow added or removed letters, renumbered everything after each wrap and changed the run's length. For an animation
chosen by index that flipped "odd letters rise" at every line. `JSXTextParserUtils.getIsWrapBreak` now tells an
inserted break from one the content holds; neither `Typewriter` nor `PaintedText` counts it, so the letters are the
same at any width.

### `Typewriter`: arrival order is ScrambleText's weights over a run of `count × animationDelayMs`

**`computeCharacterWeights(count)` goes through `ScrambleTextUtils.resolveWeights`**, so it has the same 0..1 contract, the same clamping and the same fill for missing entries. An image or a line break counts as one character. Each element starts at `initialAnimationDelayMs + weight × count × animationDelayMs`, so with the default in-order weights the last character starts at `count × delay`, which the run's length allows for. The caret is documented as meant for in-order weights, because with a scatter "the most recent arrival" jumps around.

### Text wrappers drive a drawer: `<Typewriter><PaintedText/></Typewriter>`

**The wrapper owns time and the drawer owns space.** The user's shape, asked for so that animating text and painting
it compose rather than each component growing the other's feature. `Typewriter` and `ScrambleText` decide what each
letter is doing — when it arrives and with which keyframes, which noise glyph it shows — and `PaintedText` decides
where it sits and what paints it. They meet through `LetterDriverUtils.createRegistry` in the core and a
`LetterDriverContext` per framework: the drawer registers its root and reports its letters, the wrapper reads every
drawer's letters as one text and answers `getLetterState(index)` per letter. It is the controls' rule — the wrapper
owns behavior, the leaf owns the element — applied to text.

**Letters are counted as `Typewriter` counts them**: a character as a reader sees it (a grapheme, through
`StringUtils.splitGraphemes`, so a letter with its accent or a joined emoji is one), a line break the text holds, and a
whole element such as an image are one each; a break the wrapping inserted is not counted. That keeps arrival weights and delays meaning the same thing with or without a
drawer. A break is reported as a line feed and a whole element as the object replacement character, so a wrapper
that reads characters, as `ScrambleText` does, gets a text of the right length.

**A wrapper with a drawer inside draws nothing of its own and measures nothing.** `Typewriter` renders its children
in the flow instead of in its hidden measuring copy, its player is told the count through `setCount` rather than
measuring, and its HTML output is not rendered. Without a drawer, both components behave exactly as before.
`ScrambleText`'s `text` became optional for this: with a drawer inside, the drawer supplies the text.

**Several drawers in one wrapper share one run in page order** — the user's call over one-drawer-only and every
drawer running on its own. The registry sorts drawers by `compareDocumentPosition` whenever one joins or changes,
and each drawer reads its offset from it, so a heading types and then the paragraph after it carries on.

**The caret stays the wrapper's; the drawer only places it** — the user's call, so `Typewriter` keeps its caret and
`PaintedText` does not grow one. `PaintedText` puts the wrapper's `renderCaret` in an absolutely placed box over the
letter the caret follows, sized to that letter's line.

**The Typed example's caret blinks without end, beside a "Stop blinking" toggle.** The user wanted it to blink like
an editor's caret rather than stop after five blinks. An editor's caret is drawn by the browser or the system and
follows the system's own blink setting; this one is page content, so WCAG 2.2.2 (Pause, Stop, Hide) requires a way to
stop anything that blinks on its own for over five seconds — the toggle is that way, the same pattern as the Pause
button on `Typewriter`'s Phrases example. Reduced motion stops it as well, but does not count as the mechanism.

**Letters are separate only while a run plays.** During a run each letter is its own `<text>`, because only a whole
`<text>` can be transformed — a `<tspan>` takes opacity and filters but ignores `transform` in Chromium, measured —
and `Typewriter`'s keyframes scale and slide. Each letter is placed at the box the browser laid it out in, and
`PaintedTextUtils.computeLetterStyle` makes it transform about its own center. When the run ends the letters join back
into one piece per line, as `Typewriter`'s do. During the run the usual per-line copy stays in the page at zero
opacity, and it is the one a screen reader gets; the letters are hidden from it.

**The gradient is laid across the whole block, so separate letters share it.** A gradient fits itself to the box of
the element it paints by default, so separate letters would each show a whole gradient and the paint would jump when
they join back up. `PaintedText` therefore provides a **paint area** — its own block, at `0,0` — and every gradient
built inside it is laid across that area instead (see the paint area entry below). Each letter shows the part of
the gradient where it sits, the run and the joined lines look identical, and a letter scaling in carries its patch
of color with it. The masked-rectangle alternative was rejected because it loses any arrival effect that changes
color, such as the glow.
