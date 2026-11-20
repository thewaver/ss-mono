# Decisions: `TimePicker`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `TimePicker`, and the trailing slot carrying two controls

**It is `DatePicker`'s arrangement, part for part**: the field, the surface, a `Popover` between them, the
open state a `SignalMirror` so a consumer may own it, `Escape` returning focus to the input and an outside
press leaving it alone. Nothing here was decided again.

**The one thing `DatePicker` did not have to solve is that the trailing slot was already taken.** On a
twelve-hour field the am/pm control lives there, and the trigger wants the same physical position. The first
build widened `renderTrailing` a third time to `(getFlags, meridiem, trigger)` and let the painter place both.
That gave way when the pickers came to own their trigger (_"The pickers own their trigger, and `PopupTrigger`
is the leaf they share"_): the trigger is now a library-owned `PopupTrigger` in an `InteractionWrapper`, painted
through its own `renderTrigger(getFlags, meridiem)`, and `renderTrailing` is back to `(getFlags, meridiem)`,
drawing whatever else sits after the text. `TimePicker` fills the field's trailing slot itself with the two in
order — the consumer's `renderTrailing` first, then the trigger — so a twenty-four-hour field simply passes no
`renderTrailing`, and the meridiem still reaches both painters because either may want to show it.

**Both pickers forward a per-item disabled predicate, and `DatePicker` gained its one here.** `Calendar`
had always taken `computeIsDayDisabled` and `DatePicker` never passed it through, so a consumer wanting to
gray out weekends had to drop down to `Calendar` and build the popup themselves. The bounds a picker takes
are a range, and a range cannot express "not on a Sunday" — closing that was the user's call, taken
separately from the work that surfaced it rather than carried along inside it.
