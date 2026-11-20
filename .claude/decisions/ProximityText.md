# Decisions: `ProximityText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ProximityText`: letters held at how near a point is

Seen at Fancy Components' variable-font proximity text, which the user called a "cool example" rather than the
feature, and at Made With GSAP's weight wave. **A second driver over `LetterDriver`, not a mode of `Typewriter`** —
the user's pick. The mechanism is shared — every letter plays keyframes held at some point — and only what decides the
point differs; each one's own props mean nothing to the other (caret, erasing, arrival order and the end-of-run
callback against source and reach), which is why the wheels and the carousels are presets over one base. Named by the
user, over `SwellText` and `NearText`: it stays true whatever the keyframes do.

**The effect is keyframes held at the strength.** The user's pick over two font-axis settings and over a function
from strength to styles. Each letter's `computeAnimationName` keyframes are paused at `strength × duration`, through
the same `LetterDriverUtils.computeAnimationStyle` `Typewriter` uses, with the driver's time variable at `0` and the
strength carried in each letter's own delay — so the browser blends any property, font axes included. The strength is
`Proximity`'s falloff of a plain distance (`ProximityUtils.getDistanceFalloff`): one under the point, falling as the
square of the distance to nothing at `reachPx`.

**Every line is sized for all its letters at their widest end frame, and that is written once in the shared layer.**
`LetterDriverUtils.wrapAtWidestFrame` reads each animation's end keyframes from the page's style sheets and, when any
of them changes a letter's width, measures the words with every letter at the wider of the two in a hidden box, through a
`measureTextWidths` override `JSXTextParserUtils.getInlinedSegments` now accepts; otherwise it wraps exactly as before,
so `Typewriter` changes only for a keyframe that widens letters. The user's design over reserving room per letter or
per word: at rest the spare room sits at the end of each line, and a growing letter really pushes the rest of its line
along. **The contract is that the widest frame is the first or the last**, and the props documentation says so: keyframes running
from spread to closed — the barrel example's letter spacing, widest at rest — wrap as safely as ones that grow.

**Nearness is measured from where the letters sit at rest**, so a letter pushed along by its neighbor does not weaken
because of the push and the effect cannot feed back on itself — `Proximity`'s rule for the dock. A second copy of the
lines, hidden, holds every letter at its first frame, and its letters' layout boxes are read on every re-layout. Links
in the text stay links: their letters are drawn inside the anchor.

**The point comes from a source**, the pointer by default (`PointSource`, under _"`PointerTracker`: one reading of where the pointer is relative to one element"_).

**With `PaintedText` inside, letters push their neighbors along, as they do without it.** The user's call, over
letters swelling where they were laid out, which cost nothing but made the two versions behave differently.
`PaintedText` normally places every letter once, at a fixed position read from its invisible HTML copy. While
`ProximityText` drives it (`getComputePushingAnimationName` on the driver context), it wraps its text with every
letter at its last frame, lays each letter out in an inline block of its own, and on every change of strength
styles those blocks and reads them back (`PaintedTextUtils`' layout `relayout`), so a letter is drawn as far along
as the growth of the ones before it on its line carries it. That is a layout of the hidden copy per frame the
point moves, per drawer — the price of matching plain `ProximityText`. Line breaks never move, because the text
was wrapped for every letter at its widest. Drawers report where their letters sit at rest (`restLetters`) through
the registry's `setBoxes`, and `ProximityText` measures nearness from those boxes offset by each drawer's position,
so the push cannot feed back into what is measured. `Typewriter` gives no pushing name, so its letters still
animate where they were laid out. The registry keeps its run of letters as the same array while the letters are unchanged, so a drawer reporting boxes is
not read by `Typewriter` as the text changing.
