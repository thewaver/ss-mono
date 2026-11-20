# Decisions: `DateInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `DateInput` and `DatePicker`, without the mask

Both ship; the mask `backlog.md` named as their blocker turned out not to be one for
a typed date.

**`DateInput` is a `TextField` over a private text signal, and it reads and writes ISO order only.**
`yyyy-mm-dd`, because that is the one spelling `DateValueUtils.fromIso` accepts and refuses exactly — it
returns nothing for 31 February rather than nudging it into March. A locale-ordered display (`dd/mm/yyyy`) is
what actually needs the mask, since the caret has to skip separators and the display form stops matching the
value form.

**The field owns its text while it is being typed, and snaps when it is left.** The rule the hex field arrived
at, for the same reason: a partial value is not a value, so a string shorter than a complete date is ignored
rather than treated as cleared, and the canonical spelling is written back on blur. This is why `DateInput`
sits on `TextField` rather than `TextInput` — `TextFieldPresetProps` omits `onBlur`, and the blur is the whole
mechanism.

**Its two range props are `getMinDate` / `getMaxDate`, not `getMin` / `getMax`.** `TextFieldState` already has
numeric `min` and `max` for a spin button, and spreading a `DateValue` into those would either fail to compile
or set a nonsense attribute; renaming is cheaper than an `Omit` plus a hand-written pass-through. There is no
`onInput` either: the consumer owns the signal, so an effect over it sees every change.

**`DatePicker` is `DateInput` plus `Calendar` in a `Popover`, and the trigger lives in the field's trailing
slot** — the slot that existed for `NumberInput`'s stepper, needing no widening. The visible month is the
picker's own signal, snapped to the value each time the popup opens, which is what `Calendar`'s required
`month` was left public for. Typing a date and picking one agree without either knowing about the other:
both write the same value signal, and the calendar follows it.

**Dismissal repeats `ColorInput`'s arrangement**, outside-`pointerdown` plus `Escape` — the third dismissal
story in the repo, and the count is the argument rather than any one of them.

**Paint is four slots**, matching `ColorInput` and `Select`: the field's `renderContent`, `renderTrigger`,
`renderDay`, `renderWeekday`, and `renderPopup` for the surround, which receives the month signal so the
consumer draws the title and paging buttons.

### Date and time bounds are `minValue` and `maxValue`

**Every date and time control takes `minValue`/`maxValue`**: Calendar, RangeCalendar, Clock, DateInput, DatePicker,
DateRangePicker, TimeInput, TimePicker, DateTimePicker. The three earlier spellings (`min`/`max`, `minDate`/`maxDate`,
`minTime`/`maxTime`) came from each control working around the numeric `min`/`max` it removes from `TextField`. One
name across all of them is what React Aria uses, and it leaves `TextField`'s numeric pair alone.

**DateTimePicker takes one pair, typed as its combined value.** A `DateTimeValue` bound is a moment, not a day plus
a separate time. So the calendar stops at the bound's day, and the clock stops at the bound's time only while that
day is the one picked; on every other day the clock is offered the whole day, because an accessorized bound cannot
answer `undefined`. A time rule that should apply every day, such as opening hours, is `computeIsTimeDisabled`'s
job. Known edge: a time picked before any day can end up outside the bound once the bound's own day is then
picked, because the clock only learns its limit from the day.

### Controls: `DateInput`'s format states the order, and the mask follows from it

Settled, with the mask. `getFormat` takes `"iso"`, `"day_month_year"` or `"month_day_year"`,
defaulting to ISO.

**An arbitrary mask string is deliberately not the prop.** A consumer passing `##/##/####` directly would
leave the component guessing which slots were the month, and a pattern the parse does not agree with is a
field that reads a date wrong in silence. So the order is stated and the pattern derived from it — one source
of truth, the argument the discriminated `SelectItem` record makes.

**`fromIso` is still the only thing that decides whether a date exists.** The display order is reassembled
into `yyyy-mm-dd` and handed to it, so 31 February is refused in every order rather than once per order, and no
second validator exists to disagree with the first.

**ISO is masked too, on the same path.** It could have kept its unmasked branch and did not, because two
paths would be two behaviors to keep in step. Nothing observable changed: a typed `-` is discarded and the
mask supplies its own.

**`TextSync` is not exported from `index.ts` yet.** `DateInput` is its only consumer and the standing
rule is private until a second arrives — which will be `TimeInput`'s 12-hour clock or the formatted number,
either of which is also the moment to decide whether a consumer building their own masked field should reach
it. _`TimeInput` became that second consumer; the export decision is still open._
