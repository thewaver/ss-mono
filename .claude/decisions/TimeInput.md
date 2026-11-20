# Decisions: `TimeInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The am/pm segment is a control in the trailing slot, not a slot in the mask

Settled, on the user's suggestion, removing the extension the mask looked like it needed. A
12-hour field was the reason to add a non-digit slot to the pattern; putting the meridiem in `renderTrailing`
means **the pattern stays digits-only** and nothing about the mask changes.

**It is `renderTrailing` widened, not a new slot, and not `renderDecoration`.** `TimeInput` re-declares that
slot as `(getFlags, meridiem)`, exactly what `NumberInput` does with its stepper — both would want the same
physical position, and one slot lets a painter draw a unit and a control together. The decoration overlay
cannot host this at all: one full-box overlay inheriting `pointer-events: none`, so a control inside it is
unclickable, and it is not positional.

**The value stays 24-hour and the meridiem is a way of reading it.** `TimeValue` gains no fourth field.
`TimeValueUtils.getMeridiem` / `getTwelveHour` / `withMeridiem` / `fromTwelveHour` are pure and tested, and
they are tested because **midnight reads as 12 am and noon as 12 pm** — the mapping is not `hour % 12` in
either direction, and nothing in the type system catches an off-by-twelve. Keeping 24-hour form also makes the
hard case free: stepping the hour past eleven carries into the next half of the day with no arithmetic of its
own, because the meridiem is derived from the hour rather than stored beside it.

**The meridiem is nonetheless a signal, and only because of the empty field.** With no value there is no hour
to read it off, and a consumer who chooses "pm" before typing has to have that remembered. Whenever a value
exists it wins — an effect pushes the value's own meridiem back into the signal — so the two cannot disagree
about a time that is actually held. The parse reads the signal `untrack`ed, per the mirror rule.

**Accepted consequence: it is a second tab stop.** Native `<input type="time">` makes am/pm a third segment
inside one control, reachable by arrow keys. Here it is a `Button` in the trailing slot with its own focus
ring, the same call recorded for a two-thumb `Range`. It has to carry a name: the Playground's toggle sets
`aria-label` to "Before or after noon: AM", because the glyph is `aria-hidden` like every painter's text.

**`TimeInput` uses the mask too, as of.** It did not, and the paragraph here argued that was
deliberate; the user found out what it meant by typing `203` and getting `203` rather than `20:3`. The
reasoning was sound about not bundling and wrong about the outcome: a field whose twin punctuates itself and
which does not is not a smaller feature, it is an inconsistency the reader hits immediately.
`computeMask(segmentCount)` builds `##:##` or `##:##:##` from the same constants the caret arithmetic uses, so
the two cannot drift, and the segment stride is unchanged because a mask emits exactly the fixed-width
segments the arithmetic assumed.

### Controls: `TimeInput`, and stepping the segment the caret is in

Settled, immediately after `DateInput` and on the same shape.

**`TimeValue` is `{ hour, minute, second? }` and mirrors `DateValue` deliberately**: a record rather than a
`Date`, its own arithmetic, `Intl` only for formatting. No midday trick, because a time of day carries no zone
— which is also why `second` is optional in a way `DateValue`'s fields are not: a time to the minute and a
time to the second are both complete values, and the shape says which one a consumer holds.

**Everything compares through `getSecondOfDay`**, so a value with seconds and one without mix safely: `09:00`
and `09:00:00` are the same time and `isSame` says so. Field-by-field comparison would make those different,
which shows up as a filter quietly dropping rows.

**Stepping wraps around the day; typing does not.** `addUnit` carries between segments and wraps at midnight,
because a clock has no end. A **typed** time is refused instead: `24:00` reports no value rather than becoming
midnight, on `fromIso`'s rule. Bounds behave the same way in both directions: a stepped value clamps, a typed
one outside the range is simply not a value.

**The arrow keys step whichever segment the caret is in, and then select it.** The segment is derived from the
caret offset — three characters per segment including its separator — so no per-segment elements and no mask
are needed. Selecting the stepped segment afterwards is what makes a run of presses work: the caret would
otherwise drift and the second press would land on a different unit. The one part of the control with no
precedent in the repo, and why `TimeInput` takes `onKeyDown` for itself rather than passing it through.

**The time popup is `Clock`, and it is a column per unit.** The paragraph here used to say there was no
popup and that a list of generated times in a `Popover` would be one; the second half is what was
reconsidered, and why is under `Controls: Clock` below.
