# Decisions: `DateValue`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The date value carries its calendar system, and every bound is asked of it

Settled by the user, choosing to take `@internationalized/date` as a dependency rather than
read the calendars out of `Intl` by hand, and to support as many calendar systems as the package really
implements. The measured reasoning — what the platform contains, what the reverse conversion costs, why
`chinese` cannot be done this way — is in the entry below.

**`DateValue` is `CalendarDate`, aliased rather than wrapped.** A value carries its calendar, an era, a **year
within that era**, a month index and a day. The old `{ year, month, day }` record with a signed year is gone,
and with it every constant the library held about what a year is made of: month count, month length, month
names, grid row count and year ceiling are now questions asked of the value's own calendar through
`DateValueUtils`. Aliasing rather than wrapping is deliberate — a wrapper would have to re-expose `add`, `set`,
`cycle` and `compare` to be useful, and would then be a second date library.

**Thirteen calendars, and the list is explicit rather than the package's own.** `createCalendar` does not
refuse an identifier it has no implementation for: asked for `chinese`, `dangi`, `islamic` or `islamic-rgsa` it
returns a **Gregorian** calendar, so a consumer would get Gregorian dates labeled as something else with no
indication. `DateValueCalendarId` names the thirteen that map to themselves, and `getCalendarIds` is what a
consumer offers in a picker. The lunisolar calendars are excluded rather than half-supported — the same call as
`Table` being out of scope: a thing that looks supported and is not costs more than a thing that is absent.

**An era is a list the calendar reports, never a pair.** `getEras` returns `{ id, name }` for each — two for
Gregorian, one for Hebrew, five for Japanese. The names are not in the package, so they are read out of `Intl`
by formatting a date inside each era with `era: "long"`; finding a date inside era _n_ is a bisection over the
ISO year, since era index is monotone in time, and the result is cached per calendar and locale. A BC/AD toggle
was proposed and withdrawn: it is one calendar's model, and hardcoding it would put a Western assumption into
a control's API.

**The era is a control in `DateInput`'s leading slot, not a slot in the mask** — the am/pm arrangement in the
trailing slot, for the same reason: the mask carries digits only, an era identifier is not digits, and a
consumer paints it. `DateInput` hands `renderLeading` a `DateInputEra` with `getValue`, `getOptions` and `set`,
so the painter can draw a cycle button, a select, or nothing when the calendar reports a single era. The
Playground draws a cycle button and hides it below two eras, which is what React Aria does with its era
segment.

**The signed year is gone, and that is a gain.** A year before the common era is `era: "BC", year: 44` — no
negative numbers, and no off-by-one at the origin, because ISO's astronomical numbering is the package's
problem and stays inside `toIso` / `fromIso`. The cost is that a year past the end of an era, 12026 AD, can no
longer be _held_: the constructor constrains it to 9999 silently, so `fromIso` and `fromParts` compare the
built fields back against what was asked for and return `undefined` rather than passing a different date on.
**Anything built over this package must do that comparison** — `new CalendarDate(2026, 2, 31)` is February
28th, not an error.

**`getMonthGrid` takes an anchor value rather than a year and a month number**, because a month index means
nothing without the calendar it indexes. It still returns **six** week rows for every month of every supported
calendar — the fixed height predates this work, so paging never reflows the page — and six is enough because
no supported calendar has a month longer than 31 days.

**Two dates are the same day if they denote the same day, whatever calendar each is in.** `isSame` and
`compare` go through absolute day, so a Gregorian `min` bounds a Hebrew value and a date held in one system is
found in another system's grid. `DateInput` converts a value into the calendar it is configured for rather
than refusing it, so a consumer may hold Gregorian and show a Hebrew field over the same signal.

### An era is named from year 2, not from its first day

Settled, from a defect that survived two wrong fixes. `getEras` needs a date to format each
era's name from, and the era's own first day is the one date that does not work: the package puts Meiji 1 at
1868-09-08 while ICU switches on the proclamation date weeks later, so formatting the first day reports the era
_before_ it and Meiji came out named "Keiō (1865–1868)". Year 2 is a full year clear of the boundary and works
whichever way an era counts — forward for Meiji, backward for BC, where year 2 is earlier.

**Every instant handed to `Intl` is taken at midday.** A `CalendarDate` becomes an instant at local midnight,
and midnight is the one moment that does not survive the trip: a daylight-saving change can put it on the
previous day, and a pre-standard-time zone offset is not even a whole number of minutes. The pre-package
`DateValue` did this, it was dropped in the rewrite, and it is back.

**An era carries a long name and a short one.** `DateValueEra` is `{ id, name, shortName }`: the identifier is
the package's and is not display text — `BC`, `meiji`, `before_minguo`, with no casing convention and an
underscore in one — while both names come from `Intl` and are the locale's. A compact control shows `shortName`
and labels itself with `name`. Nothing may render `id`.
