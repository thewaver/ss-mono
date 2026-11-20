# Decisions: `DateTimeValue`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `DateTimeValue`, and why a missing half is no value

**`DateTimeValue` is `{ date: DateValue; time: TimeValue }` in `Abstracts`**, joining the calendar-aware date
this library owns to the `TimeValue` from `ss-utils`. `DateTimeValueUtils` covers the operations the two
halves cannot answer between them — `isSame` ignores the seconds shape the way `TimeUtils` does, `compare`
orders by date and falls back to time, and `toDate` flattens to a real `Date`.

**`createSplit` is the composition, and `DateTimePicker` is the control over it.** The helper takes the one
signal and returns a date signal and a time signal for the existing fields; the control pairs `DatePicker`
with `TimePicker` over them, so the consumer holds one value and the two fields are an implementation detail.
The helper is exported in its own right, because pairing a plain `DateInput` with a `TimeInput` needs the
split without the two popups.

**The control passes its shared props to both halves and overrides what cannot be shared.** The props type is
`Omit<DatePickerProps, "value" | "ariaLabel" | "visibility">` plus the time-only knobs, so the
field paint, the layer placement and the locale are written once. Three things collide and are named apart:
`renderTimeTrailing`, `renderTimePopup`, and the two visibility signals. One collides silently and is
overridden — `renderLeading` on the date side takes an era as its second argument, which the time field has
no notion of, so the time half is given `undefined` rather than the date half's renderer.

**Both composed pickers set `width: fit-content` and stop their children shrinking.** Without it the two
picker roots are flex items that shrink below their content and overlap, which puts the second field's trigger
underneath the first field's input — clickable by coordinate, unclickable by pointer. `DateRangePicker` has the
same rule for the same reason. The Playground pages give these examples `span: 2`, because a control about
460px wide otherwise overflows a 320px grid column and the neighboring card paints over its trigger.

**A pair with a half missing reports nothing, and this was corrected mid-build.** The first version filled the
absent half from a default, so typing a date alone produced a value at midnight. That is wrong twice over: it
disagrees with `RangeCalendar`, where half a range is explicitly not a range, and it made editing destructive,
because clearing a field to retype it dropped the other half. The split now remembers each half privately and
emits only when both are present — so clearing one clears the value, and retyping it brings the other back.
