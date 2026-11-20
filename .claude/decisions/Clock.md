# Decisions: `Clock`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Clock`, and why a time popup is columns rather than a list

Settled on the user's call, after the two shapes were weighed side by side.

**The name pairs with `Calendar`.** `Calendar` is the standalone surface a date is picked from and
`DatePicker` is the field plus that surface in a popup; `Clock` and `TimePicker` are the same two things for
a time. Neither surface knows anything about a popup, which is what lets the Playground put a calendar on a
page of its own and would let a consumer do the same with a clock.

**One column per unit, not one list of times.** The list shape is the obvious one — 09:00, 09:15, 09:30, the
thing a booking site shows — and it is what this file used to predict. It was rejected on a single point:
`TimeInput` accepts `getHasSeconds`, and a list at seconds granularity is 86,400 rows. The picker would then
have had to refuse a value the field beside it accepts, which is the one failure a paired field and popup
cannot have. Columns have no such ceiling: the longest is 60 rows whatever the granularity, and the same
`hasSeconds` and `isTwelveHour` accessors drive both halves, so the two cannot disagree about what a time is.

The cost, accepted: picking a time is two or three separate acts rather than one, and the keyboard walk
crosses columns as well as running down one.

**An option carries the whole time it would produce, not just its own number.** Each option is
`{ unit, time, label }` where `time` is the current value with that one unit replaced. Everything else falls
out of it: the option is disabled when that time is outside the bounds, selected when the value already reads
that way, and picking it writes that time. It also gives the honest reading of a bound — with opening hours
of 09:00 to 17:30 and a value of 09:47, the hour option 17 is disabled, because 17:47 is shut.

**The label is the library's, and that is a departure from `Calendar`.** `Calendar` hands the painter a
`DateValue` and lets it draw `day.day`; `Clock` hands over a finished string. Two reasons, and the first is
the load-bearing one: a twelve-hour column reads 12, 01 … 11 rather than 00 … 11, and the conversion is the
one `TimeUtils` documents as easy to get wrong — midnight is 12 am and noon is 12 pm, so it is not `hour % 12`
in either direction. A painter deriving that itself would be re-deriving the exact arithmetic that was moved
into `ss-utils` to stop it being re-derived. Second, the am/pm label is locale text, not a number.

**Twelve is the first row, not the last.** The column runs 12, 01 … 11, because that is the order the hours
fall in — twelve am is midnight. Listing 01 … 12 would put midnight at the bottom.

**The column names come from `Intl.DisplayNames`, and the am/pm words from `Intl.DateTimeFormat`.** A
listbox has to carry a name, and inventing "Hour" in English would bake one language into the library.
`Intl.DisplayNames` with `type: "dateTimeField"` answers `hour`, `minute`, `second` and `dayPeriod` per
locale — "Stunde" in German, "am/pm" in `en-GB` — and it has been in every browser since April 2021, so it
needs no fallback. The am/pm words are read off `formatToParts` of a formatter forced to `hour12: true`,
picking out the `dayPeriod` part, because the words are the locale's and no list of them belongs here.

**The visible column heading sits outside the listbox, and the options sit inside it.** A listbox may
contain options and groups; a heading among them is noise a screen reader has to step over. So the library
draws four levels — a `role="group"` for the whole clock, a plain column, a heading whose content is
`renderUnit`'s, and the `role="listbox"` around the options — and the painter's scrolling box goes inside
the listbox through `renderColumn`, which is where `Select` already put the painter's panel. Keeping
`max-height` and `overflow` out of the library's props is the same argument as there.

**With no value, the fallback time is pulled inside the bounds.** The base a column mutates is the value, or
the current time when there is none. Left unclamped, a bounded clock opened at 22:00 with opening hours of
09:00 to 17:30 has every option in its minute column disabled — each would produce 22-something — so the
picker looks broken until the user happens to pick an hour first. `TimeUtils.clamp` on the fallback fixes it
outright and costs nothing when a value exists.

**Selection is one tab stop over the whole clock, as in `Calendar`.** Up and down move within a column and
wrap; left and right cross to the next column, landing on its reading of the same time; Home and End go to
the ends of a column; only Enter or Space commits. Moving the highlight deliberately does not select, so a
walk across three columns does not write three times. The roving position is stored as **one whole time**
rather than a per-column index, which is what makes crossing columns free — the new column simply reads the
same time its own way.

**Two bugs found building it, both worth knowing because neither is visible in the source.**

An effect that focuses the roving option had its early return _above_ the line that reads the highlight, so
on the first run — when nothing inside the clock has focus yet — the effect finished without ever subscribing
to the highlight and never ran again. Focus then stayed on whichever option it started on while the highlight
walked away. `Calendar`'s equivalent reads its roving day above the guard and is correct by accident of
ordering.

And the whole column re-rendered on every value change, destroying the focused option and dropping focus to
the body. The column's children expression read `getColumn().unit`, and the column object is rebuilt whenever
the base time changes, so the expression re-ran and called `renderColumn` again — a fresh `Index`, fresh
elements. A `createMemo` over the unit stops it: the memo only notifies when the string actually changes,
which for a given column is never.
