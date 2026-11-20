# Decisions: `Calendar`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Calendar`'s `precision`

`precision?: "day" | "month" | "year"`, default `day` in `CALENDAR_DEFAULTS`, on `Calendar` and `CalendarComposite`
and passed through by `DatePicker`, on the user's call. `RangeCalendar` does not take it: a range of months needs
its end on the last day of the month, which is a separate question. `DateTimePicker` omits it, since a moment has
a day.

**One page model at every precision.** A page is what the grid shows (a month of days, a year of months, twelve
years), and a cell is named by its first day. `CalendarUtils` holds the arithmetic: page start, cells, grid shape,
cell start and end, same-cell, bounds, page step and long step.

**What keeps its kind.** `month` still says which page is shown. The two-axis walk is
`NavigatorUtils.computeNextCell` over the page's shape, and a step off either end carries into the neighboring
page, as the day grid already did through its outside-month days; only Home and End on a short last row clamp to
the last cell. `minValue`/`maxValue` leave a cell pickable while any of its days is inside, and a pick is clamped
into them. `computeIsDayDisabled` receives the cell's first day. The paging announcement fires when the page start
changes, and names a year page through `Intl`'s own range formatting, with the same add-the-era rule for a past
era.

**The year page runs in twelves from year 1 of the era**, so 2017 to 2028 is one page, which keeps pages aligned
within eras. **Shift with the page keys is a year under `day` and twelve pages above it**; under `day` it stays
`addYears` rather than twelve months, because a Hebrew leap year has thirteen months.

**Zooming through the header is not built.** The header is the consumer's, and `CalendarUtils.stepPage` is what it
pages with; a header that steps from days to months to years is a later question.

### Controls: `Calendar`, and the date value the library owns

Settled, closing the dependency question `backlog.md` recorded as a real decision.

**No date library, and no `Date` in the public API.** `Abstracts/DateValue` holds
`DateValue = { year, month, day }` with **`month` 1-12**, plus `DateValueUtils`. Two things drove it: a
`Date` is an instant, so a date-only value round-tripping through one shifts across a zone boundary, while a
record has nothing to shift by; and `Intl.DateTimeFormat` already supplies every locale-dependent string, so
the only thing left to own is arithmetic, about eighty lines. Months are 1-12 rather than `Date`'s 0-11
because an off-by-one month is the most common bug in date code and no type catches it.

**Every conversion goes through midday**, never midnight. A midnight anchor can land on the hour a zone skips
or repeats, so "add a day" moves by 23 or 25 hours and lands on the same or the wrong calendar date — a
stepper that appears to stick. Midday is never inside a transition anywhere on Earth.
`DateValue.utils.test.ts` pins both European transition dates.

**No conversion may pass a year to the `Date` constructor, because it reads 0 to 99 as the 1900s.** Corrected
. `new Date(year, month - 1, day, 12)` was the single conversion for a long time and is wrong
below year 100: a Caesar born in year 44 was stored as 44 and described everywhere as 1944 — wrong weekday,
wrong grid, wrong label — with nothing reporting a problem. `getDaysInMonth` had it twice over: February in
year 4 answered 29 because it was really being asked about 1904.

Both now go through one private `buildLocalDate`, which builds an anchor date in a safe year and calls
`setFullYear(year, month, day)` — the documented way past the shorthand. **All three fields go in that one
call**: set alone, the year lands on an anchor whose month and day have already been normalized, and year 0 is
a leap year while the 1900 it was shorthand for is not, so 29 February in year 0 would have become 1 March on
the way through. The shorthand is unreachable from the rest of the file — the two remaining `new Date` calls
with a literal year build the month and weekday **name** lists, where the year is an arbitrary anchor.

**A year outside 0000 to 9999 is written in ISO 8601's expanded form, and only then.** Same day, closing the
other half of the same bug. `toIso` was padding the _signed_ string, so year −44 came out as `0-44-08-01` with
the minus where the third digit belongs, and `fromIso`'s four-digit pattern refused to read it back. Padding
the absolute value and putting the sign in front is the whole fix; the pattern widens to "four bare digits, or
a sign and six" and the fixed length check goes, since a pattern anchored at both ends already rejects
anything longer. Six digits with a leading sign is what ISO 8601 prescribes and what
`Date.prototype.toISOString` emits, so the expanded form round-trips through the platform.

**Expanded only when the year needs it.** Emitting a sign on every date would be more uniform and would
rewrite every stored date string every consumer has, for a case almost nobody reaches. The cost is that the
writer is canonical while the reader is lenient — `fromIso` accepts `+002026-08-10` and `toIso` gives back
`2026-08-10` — so reading and writing normalizes rather than reproducing the input character for character.
Both halves are pinned by tests. `-000000` is refused: ISO 8601 does not allow a negative zero year, and
`toIso` can never emit one.

**What this does not buy: a BC date still cannot be typed.** `DateInput`'s mask is a fixed run of digit slots
and everything that is not a digit is discarded on the way in, so a sign has nowhere to go — the same missing
piece `backlog.md` tracks for the formatted number. Storing, loading, computing and displaying a
pre-common-era date all work; entering one is by code or by the calendar's paging.

Before anything labels one: this is astronomical year numbering, inherited from `Date`, so there is a year 0
and it is 1 BC — year −44 is 45 BC. `Intl`'s `era` option already does that conversion, and nothing here
should reimplement it.

**`addMonths` clamps the day; `fromIso` refuses an impossible date.** 31 January plus a month is 28 or 29
February, never 2 or 3 March, because `Date.setMonth`'s rollover makes a month stepper skip months. And
`fromIso("2026-02-31")` is `undefined` rather than 3 March: a field that silently moves what was typed is
worse than one reporting the value as not yet valid.

**The grid is always six weeks of seven days, and carries the neighboring months' days.** A fixed row count
stops the calendar changing height as months are paged. The neighboring days make the keyboard walk work
without a special case — the grid is a continuous run of dates, so the next cell from `computeNextCell` maps
back as `addDays(gridStart, y * 7 + x)` whatever `y` is.

**The page keys move a month, and held Shift moves a year.** `PageUp` and `PageDown` step the roving day by
one month, `Shift` with either steps it by one year, and both go through the same `moveTo` — so both clamp to
`min` and `max`, both pull the visible month along, and both are announced by the month effect already
watching it. This is the one part of the grid's keyboard a consumer cannot supply from outside: the grid owns
its `keydown` handler, so a caption can offer a year jump as a button but nothing outside can bind a key to
one. Note that the year step is `addYears` rather than twelve `addMonths`, which is what keeps 29 February on
a year that has no 29 February from walking somewhere unexpected.

**Forty-two `InteractionWrapper`s per month is the cost of consistency, and it has been measured rather than
worried about.** Building a whole calendar — which is what opening a `DatePicker` popup does — takes about
3ms of work, and changing month takes about 1.7ms, worst case under 3ms; both are the synchronous update, so
the frame they land in is not otherwise at risk. That is a headless Chromium on one machine over a production
build rather than a guarantee, but it settles the shape of the answer: a three-month view would be roughly
9ms to build and 5ms to page, still inside a frame, and the per-cell wrapper is not what would make a
multi-month calendar expensive. The remaining per-cell cost worth caring about is a consumer's own disabled
predicate, which is called once per cell and is theirs to make cheap.

**The visible month is a `Signal` the consumer owns, and `Calendar` renders no header.** `month` is
required, and the month title and paging buttons are the consumer's markup outside the component. The
alternative — a private month plus a `renderHeader` slot handed paging callbacks — would invent a controller
record for something the settled convention covers. `Calendar` writes the signal when the keyboard walk leaves
the month, which is exactly the two-way case, and it means `DatePicker` can snap the month to the value when
its popup opens without the component having an opinion.

**That header being the consumer's is what made an interactive caption free.** Added: the
Playground's caption is a month title that turns into a `Select` for the month and a `NumberInput` for the
year when clicked, with the paging arrows either side throughout. `Calendar` was not touched — the caption
writes `month` exactly as the arrows did. It lives in `PageComponents/CalendarCaption` and both
`CalendarPage` and `DatePickerPage` use it, since the two had written the same header twice.

**The fields are a mode, not the resting state**, so a calendar reads as a calendar until someone asks to
jump. Three things end the mode and they are not interchangeable: `Enter` accepts and hands focus back to the
title; `Escape` puts the month back to what it was when the mode opened, which is the only reason a restore
point is kept; and focus leaving the group ends it without moving focus, since the usual way out is clicking a
day and pulling focus off that day would undo the click.

`Escape` layers correctly with the month `Select` underneath — `Select` handles the key only while its popup
is open and marks the event handled, so the first press closes the popup and the second closes the mode; the
caption checks that flag rather than the key alone. The cost: `Enter` cannot close the mode from the month
field, because `Select` claims `Enter` unconditionally. From the year field it works, and `Escape` and `Tab`
work from either.

**Two bugs found building it, both recurring in any component with modes.** A `focusout` fires when the
fields unmount, _after_ the mode has been ended by `Enter` or `Escape`, so the focus-out handler ran a second
time and canceled the focus restore the first exit asked for; it now ignores anything arriving once the mode
is closed. And the year field's `SignalMirror` pushes its inner value outward from an effect, which runs after
the handler that closed the mode — so `Escape` restored the old month and the mirror wrote the abandoned one
back over it; the year write ignores anything queued while the mode is closed. Both are the same shape:
**ending a mode is not one event, and the tail of the old mode arrives after it.**

**The year is written on a `FunctionUtils.debounce`, not on every keystroke.** Typing 1066 into a live field
pages the calendar through years 1, 10 and 106. `Enter` and focus-out flush whatever is pending rather than
waiting, so nothing is lost by leaving quickly. The mirror tolerates this without special handling — while no
write has landed the outer value has not changed, so nothing pushes back over what is being typed.

**The year is a number field rather than a second `Select`, and not on taste.** A `Select` materialises every
option and nothing here virtualises them, so a year list must be bounded — and any bound is invented, since a
hundred years back is right for a birthday and absurd for a booking. A number field needs no bound, and typing
four digits beats scrolling eighty rows even in the ordinary case.

**The caption sets the calendar's width, which is why the day cell grew from 36px to 46px.** Two arrow
buttons, a month name and a four-digit year do not fit across seven 36px columns — the frame ended up a
hundred pixels wider than the grid, with the grid visibly floating. `Calendar`'s root is `width: fit-content`
and the cell size is the Playground painter's, so the cell is the only end that can move: 46px × 7 is 322px,
which is what the caption needs. If a `getSizing` is ever added to `Calendar`, this constraint goes away.

It also keeps the frame still across the mode switch: the edit-mode header is the wider of the two, so sizing
the grid to it means the box does not resize under the pointer when the title is clicked — which it would
have, by seventy pixels, at the old cell size.

**Selection is by date, one tab stop, and the cell carries the whole date as its name.** `value` holds a
`DateValue | undefined`. The grid is a roving tab order over 42 `InteractionWrapper`s, following `Tabs` rather
than `Select`'s `aria-activedescendant`, because each day is a real element that can hold focus. Since the
painter draws a bare number, the cell sets `aria-label` to the full formatted date, or a reader announces
"17" with no month. `aria-current="date"` marks today, `aria-selected` the selection.

**`CalendarFlags` carries the day itself**, unlike every other flags record, because the painter's whole job
is to draw that date and it would otherwise be handed the accessor twice — once as `renderDay`'s first
argument and once inside the flags. Both are available, and the flag is the one a `classList` block can read
alongside `isSelected` and `isOutsideMonth`.

**An intervening wrapper div sits between `role="row"` and `role="gridcell"`**, because every cell is an
`InteractionWrapper` owning its own root. `Select` already made this trade between `role="listbox"` and
`role="option"`; it is in `backlog.md` now that a second component has hit it, a grid's row/cell relationship
being the stricter of the two.

### `Calendar` shows several months at once, and numbers its weeks

The two gaps `backlog.md` used to record for `Calendar`, built together. Both were put to the user as choices.

**Several months are a mode of `Calendar`, `monthCount`, rather than two calendars side by side.** The user's choice,
for the keyboard: two composed calendars cannot walk from the 31st of one into the 1st of the other — an arrow at the
end of the first would page it instead — and the consumer cannot fix that from outside. So one calendar draws a
`role="group"` named by `ariaLabel`, holding a `role="grid"` per month named by the month, with one tab stop across
all of them. **Only the day view has it**: `CalendarMonthCountExcludesPrecision` refuses `monthCount` beside
`precision`, and `CalendarUtils.warnIfMonthCountIgnored` catches the rest. With one month the markup is exactly what
it was. `RangeCalendar` gets it through the shared composite, and its page is where the two-month example lives —
the user's call, since a range across a month boundary is the case that needs both months on screen.

- **A day belonging to a neighboring month is blank** in the several-months view: the month beside it already shows
  it, and drawing it twice would put one date in the grid twice with the same name.
- **The page keys step by `monthCount`, and a walk past the months shown moves them by whole groups** —
  `computeMove` steps the first month by `monthCount` until the day is in view, so August and September become
  October and November, never September and October. With one month this is the old behavior exactly.
- **`renderMonthHeader(month, index)`** draws a title over each grid, since without it nothing says which grid is
  which month; **`monthGap`** spaces them. Both were added without being asked for, and reported.

**Week numbers are a column of row headings, counted by the consumer's rule.** Countries disagree about week one:
ISO 8601 starts weeks on Monday and wants four days of the new year in the first week; the United States starts on
Sunday and calls the week holding 1 January week one. The user chose a second setting beside `weekStartsOn`,
`minDaysInFirstWeek` (date-fns calls it `firstWeekContainsDate`), over deriving the rule from the start day — which
would leave a Monday-start, one-day country wrong with no way out — and over ISO always, which numbers a Sunday-start
row wrongly one day in seven. The default, Monday with four, is ISO. `DateValueUtils.getWeekNumber` does the counting
in the date's own calendar. The column appears while `renderWeekNumber` is given; each row's heading is a
`rowheader` and the column's a `columnheader`, named through `Intl.DisplayNames`' `weekOfYear` field so the word is
the reader's language rather than an English string the library ships.

### `Calendar`: disabled days described rather than computed

**`disabledDays` takes descriptions — a date, `{ from, to }`, `{ before }`, `{ after }`, `{ daysOfWeek }` — beside
`computeIsDayDisabled`, and both apply.** The user's call, after the per-cell cost of the function was put to them,
on the strength of react-day-picker's `disabled`, which accepts the same five shapes. The common cases never call
anything, so the expensive form is visibly the expensive one. **They are a separate data prop rather than a widened
function prop** because a `Base…Values` type holds no functions and a `Base…Cbs` type holds nothing else, so one
prop accepting both would belong to neither.

**The semantics are react-day-picker's**: a range includes both ends and is read whichever order its ends were given
in, `before` and `after` exclude the date itself, and `daysOfWeek` counts from `0`, Sunday, read in the machine's own
time zone as `DateValueUtils.toDate` reads it. A description is tested against a cell's first day, as the function
always was, so under `month` or `year` precision `{ daysOfWeek: [0] }` refuses a month that starts on a Sunday — the
same answer the function gave. `DatePicker`, `DateRangePicker` and `DateTimePicker` pass it through to their calendar.
