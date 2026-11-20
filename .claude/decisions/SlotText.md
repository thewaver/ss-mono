# Decisions: `SlotText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SlotText`: the columns turn the way the number is going, and the arithmetic above the barrel is the component

`Abstracts/Barrel` already turns a stack of faces to an angle and is what both drum wheels are made of, so a
digit column needed nothing new: ten faces, `0` to `9`, and an angle. What had to be decided is everything
above it, and each of these was a real call rather than a detail.

**The angle is cumulative and is never wrapped back into a circle.** A column going from nine to zero is a
tenth of a turn forward or nine tenths back, and wrapping the angle into 0–360 forces the browser to take the
short way — so an odometer counting up rewinds its units on every carry. Keeping a running total that only
moves in the direction the number is going is the whole of the fix, and the spec compares two readings rather
than a value for that reason.

**The direction follows the number, not the digit.** Going up turns every column forward, including the one
whose digit fell; going down turns every column back. That is what a geared mechanism does, and it is what
makes 199 → 200 read as travel rather than one column rewinding while two go on.

**A column waits one beat for every column to its right that is also carrying**, unless `computeReel` is given,
which replaces the cascade (_"a reel is asked per column"_ below). Not a fixed stagger: a
column whose neighbor is standing still does not wait for it, so 123 → 223 moves the hundreds immediately
while 199 → 200 cascades from the units up. The delay is per column and reaches the faces through
`Barrel`'s new `transitionDelayMs`, which is the one thing the abstract gained.

**It takes the formatted text, not the number, and that is what keeps a locale out of it.** Any character
that is not a digit is a slot that never turns — a grouping separator, a decimal point, a currency sign — and
the consumer decides what the number looks like.

**The sign is a slot like any other, and the columns follow the magnitude rather than the number.** This was
built the other way first — reading the sign and inverting the comparison below zero, on the argument that a
bigger digit is a smaller number there — and it looks absurd: going from −1 to −2 sends the units nine steps
backwards to arrive at the digit next door. What the columns actually show is the magnitude, so the direction
that reads correctly is the one the digits are going: −1 to −2 turns forward one step, −2 to −1 turns back
one, a change of sign alone turns nothing because no digit changed, and 2 to −1 turns back because the
magnitude fell. Comparing the digit sequences and ignoring the sign gives all four, which is why there is no
sign handling in the component at all.

**A column has to be windowed, and the window has to center the drum explicitly.** `Barrel` is as tall as the
whole drum looks, because a drum wheel is meant to show several faces; an odometer shows one. The window is
one digit tall with the barrel absolutely positioned at its center — `place-items: center` on an item taller
than its box was tried first and lands one face out, which reads as every column showing the digit above the
right one.

**It shows its value on the first paint rather than animating into it.** The angles are seeded from the first
text before the first render, and the effect that turns them is deferred, so nothing rolls on mount. Without
that, every column spins up from zero when the page loads and the value is unreadable for the length of a
turn.

**The columns are keyed by digit and placed by flex `order`, so a sign appearing does not rebuild them.**
Rendering one element per slot in slot order looks obvious and is wrong: a minus sign arriving in front of a
number shifts every digit one position along, so the element that was showing the units becomes the sign and
the units get a brand-new element created at rest — which cannot animate, and 0 to −1 sat still while 1 to 0
turned. The fixed slots and the digit columns are therefore two separate lists, each keyed by its own index,
and each carries the `order` its slot has in the row. A digit column then survives anything happening to its
left, and the row still reads the way the text does.

**A drum's backs are turned off.** `Barrel` renders a back for every face by default, which is what a wheel
with a visible reverse needs; an odometer's faces are never seen from behind, so this halves the elements per
column.

**What a screen reader gets is the number, once.** Every face is handed `isHidden`, which `Barrel` turns into
`aria-hidden` and `inert`, and the value sits beside them in a visually-hidden span. Without that, a column
announces all ten of its digits.

**The split-flap seam is still just a seam.** `backlog.md` recorded that a departure board is the same
mechanism with a window of two recycled faces, and that a barrel rendering every face is the special case
where the window is as long as the list. Nothing here forecloses it: the window would go on `Barrel`, and
whether a split-flap is then a second component or a mode on this one is the user's call, still open.

### `SlotText`: a split-flap is a second way to draw the same count, on `Spine`

**`mechanism` picks how a column changes, `"drum"` by default and `"split_flap"` beside it.** The user's call: a prop on `Odometer` rather than a separate component, left open to more layouts later, so it is a union rather than a flag. Everything above the column is shared: the direction, the cascade, the reels, the slots that grow in and shrink away, and the reduced-motion rules come from `computeTurn` exactly as for the drum. **A split-flap reads the drum's angle as a count of flaps** (`getFlapPosition`), because a cumulative angle and a cumulative count are one running total spelled two ways — which is also why nine to zero drops one flap forward rather than nine back. Going down plays the flaps in reverse, lifting them back up, as the drum turns backwards; a real board only ever flips forwards, and that difference was accepted.

**A column draws three flaps on a `Spine` laid out by `SpineUtils.leaves`, and the characters on them are reassigned as the column moves.** The flap that fell last lies below the middle line showing the bottom half of the character on show; the flap on show carries that character's top half on its front and the next character's bottom half on its back; the next flap stands behind it with the next character's top half. That is the whole picture at any moment, so a reel running through forty characters still draws three flaps, and the picture is identical either side of a whole position, so moving to the next set of characters cannot be seen. Each flap is the full character box with the consumer's drawing clipped to the half it needs, so **`renderDigit` and `renderFixed` keep their meaning**.

**The flaps run on animation frames, not on a CSS transition**, because a transition moves every flap at once and a split-flap drops them one after another. `OdometerUtils.createFlapper` holds each column's position and moves it after the column's delay so the last flap lands one turn duration after the first starts: **more flaps fall faster rather than taking longer**, which is what `turnDurationMs` means for the drum. Each flap is eased inside its own step, so a run reads as separate flaps, and a run asked for partway through another starts from where that one had reached. A column whose target has not moved does nothing, so a digit that did not change never flips. Changing `mechanism` mid-run rebuilds the columns at the current target with no animation.

**What a screen reader gets is unchanged.** Every flap face is hidden and inert, as the drum's faces are, and the value is still the one visually hidden span. WCAG checked: 1.3.1 and 4.1.2 are met as for the drum; 2.3.3 Animation from Interactions as for the drum, nothing turning at all under reduced motion; 2.2.2 does not apply, since the flaps move only when the value changes and each change finishes within the turn duration.

### `SlotText`: a reel is asked per column, and it replaces the ripple rather than adding to it

**`computeReel(digitIndex, digitCount)` returns `{ extraTurns, durationMs }` for each column, and giving it turns the cascade off.** All columns start together and the stagger comes from their durations, so the order they stop in is the consumer's to set. A delay on top of that would be a second way to express the same thing. **The extra turns are added to the step that reaches the digit, in the direction the whole number is going.** The angle stays cumulative, and a reel spinning up lands still moving forward. **Every column spins, an unchanged digit included, and nothing spins when no digit changed.** The consumer is not told which columns changed, and a slot machine spins every reel. A sign change alone is `"same"` and moves nothing. **Under reduced motion nothing turns at all** (WCAG 2.3.3, animation started by an interaction): `SlotTextUtils.computeTurn` gives every column no duration and no delay, so the new characters simply replace the old ones, reel or not. The first build dropped only the extra turns and kept each reel's duration, so a slow reel still turned its one step slowly; the user's call was to go instant instead, because a turn of any length is still motion and every other moving part of the library goes instant under the same preference. **The samples are `Samples/Odometer/Reels`, kept in one file with inline samples** under the rule that a registry is split only when a single file would be unreadable. They are functions of position and count only, so each one is a stagger shape rather than a speed.

### `SlotText`: an arriving slot grows in, a leaving one shrinks out, and it stays until it has

**Width is animated through the Web Animations API over `turnDurationMs`, for digit columns and fixed slots alike**, since a separator appears at 1,000 just as a digit does. **Slots are matched by position within their own list, as the component already keys them.** A position the new text lacks stays as a leaving slot, holding its last character, its old position in the row and, for a digit, its angle, so it does not spin back to rest while it shrinks. It is removed when its shrink ends, taking any leaving slots after it. A slot the text asks for again mid-shrink grows again from the width it had reached. **The painter is told `isEntering` / `isLeaving` and does its own fading or scaling.** The library animates only the width. **A fixed slot clips its content only while its width is moving**, so a painter drawing wider than its slot is not clipped at rest. **Under reduced motion the width changes at once and no slot is ever flagged** (WCAG 2.3.3).

### `SlotText`: letters are columns of their own, and each turns its own way

**`letters` lists the characters a letter column holds, in the order they sit round it, and any character of the text found in it gets a column.** Digits always do; anything in neither stays a fixed slot as before. A letter column is the same wheel as a digit column with the consumer's faces on it, so the mechanisms, the reels, the slots growing in and the reduced-motion rules all reach it unchanged. A column that changes from a digit to a letter, or onto a different set of faces, starts at rest on its face rather than turning, since there is no step between two wheels that do not share faces.

**The digits turn the way the number goes and the letters do not, because letters have no number.** `compareDigits` reads one direction from the digits as a whole, which is what makes 199 → 200 carry; a word has nothing to compare, so each letter column decides for itself through `computeLetterStepDelta`. **`letterRoute` picks how: `"forward"`, the default, always goes on round the letters, as a departures board does, so C to Z passes every letter between; `"shortest"` takes the nearer way, so C to Z goes back three.** Forward is the default because it is what the physical thing does, and the one a split-flap reads most naturally as; shortest is there for a drum, where a long way round is just a long spin. The angle stays cumulative either way.

**The cascade waits only for columns that change**, so a word that keeps some letters moves the rest at once, the rule digits already follow.

**The Playground's words are padded with spaces to one length**, and the space is the first of `WORD_LETTERS`, so no column ever comes or goes between words and every letter turns rather than growing in. The words and letters live in the shared Playground, since all four apps show the same ones.
