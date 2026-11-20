# Decisions: `RangeCalendar`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `RangeCalendar`, `DateRangePicker`, and the half-entered state

**`RangeCalendar` is a second component beside `Calendar`, not a mode on it**, on the precedent `MultiSelect`
already set: the shared work moved into a `CalendarComposite` — the grid, the roving day, the keyboard, the
month announcement — and the two thin components over it own only their value shape and answer three hooks,
`computeIsSelected`, `computeAnchorDay` and `onPick`. `SelectComposite` is the same arrangement, so a reader
who knows one knows both. `DateRangePicker` sits beside `DatePicker` the same way.

**A control holding two fields suffixes the consumer's `id` and `name` rather than passing them to both.**
`DateRangePicker` composes `-start` and `-end`, `DateTimePicker` composes `-date` and `-time`, which is what
`ColorArea` already does for its two axes. Handing one `id` to two inputs puts the same id on both, so a
`<label for>` reaches whichever the browser finds first, and one `name` submits two fields under one key —
a form receives `date=2026-01-01&date=2026-01-08` and cannot tell which end is which. The suffix is not
documented on the `id` prop itself because both types inherit it from `DateInputProps`, and redeclaring a
prop only to document it is the drift that got the `locale` redeclarations deleted. `Range` does the same for its two thumbs, submitting `-start` and `-end`; a one-thumb range keeps the bare name.

**`DateRangePicker`'s Escape returns focus to the end field, which is where the trigger lives.** The calendar
is opened from the trailing slot of the second field, so focus has to go back to that field rather than to
the first — a dismissal that lands on the start field moves the person somewhere they did not come from. It
is found by the composed `-end` id, with a generated id standing in when the consumer supplied none, rather
than by taking the root's first `<input>`.

**The half-entered state is the component's, and never reaches the consumer.** `RangeCalendar` holds the first
end in a private signal; while it is set, the outward value is `undefined` and the grid paints the span from
that end to the day under the pointer, or to the roving day when the pointer is off the grid, so keyboard movement
previews the range without a pointer. The pointer's day is held apart from the roving day, because moving the roving
day moves focus, and a key press drops it so the band follows the keyboard from there. The second press
commits `orderRange(first, second)`, which sorts the ends — so picking backwards gives the same span, and a
consumer never receives a record of which end was clicked first. A third press starts again rather than
extending, which is the behavior that needs no rule to remember.

**Three flags carry the band: `isInRange`, `isRangeStart`, `isRangeEnd`.** `isInRange` is inclusive of both
ends, so a painter can lay a continuous band and then round the two caps; the ends are marked separately
rather than inferred from position, because the first and last day of a visible week are not the ends of the
span. The Playground's day painter writes them out as `data-in-range`, `data-range-start` and `data-range-end`
so the suite can read the flag rather than a hashed class or a computed color.

**`DateRangePicker` derives its two fields from the one signal.** A start typed on its own leaves the outward
value `undefined`, exactly as a single press on the calendar does, and the grid and the fields are two ways
into the same value rather than two values kept in step.
