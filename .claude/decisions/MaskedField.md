# Decisions: `MaskedField`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A typed sign is opt-in, and only the grouped mask has one

**`TextSyncGroupDefs` gained `hasSign`, and nothing else can hold a sign.** `applyGroupedMask` takes a minus
wherever it appears in the text, moves it to the front, and keeps it while the digits regroup; `applyMask`, the
fixed-pattern one, has no notion of it. That asymmetry is the point rather than an omission: a date's ISO
spelling is `2026-08-10`, so a fixed-pattern field that read a hyphen as a sign would misread every date it
was given. The flag is off by default, so an unsigned field drops a typed minus rather than refusing the
keystroke — the digits still land, which is what a consumer who did not ask for signed amounts wants.

**A lone minus is held rather than dropped**, because otherwise the sign could never be typed before the
digits, which is the order everybody types it in. The mask returns the sign alone with the caret behind it,
and `MaskedField` reports no value until digits arrive — a sign is not an amount.

**The sign rides in the digit string, and `MaskedField` gained one optional def to allow it.** `readDigits`
overrides how the field reads digits out of its text, defaulting to `TextSyncUtils.getMaskedDigits`, which
strips everything that is not a digit. `CurrencyInput` passes `readSignedDigits` when signed, so `fromDigits`
receives `"-123456"` and `toDigits` returns it. Widening the shared digit reader instead was rejected for the
same reason the mask flag exists: `DateInput` would have started reading its ISO separators as signs.

**`DecimalUtils.toDigits` drops the sign**, which is documented in `ss-utils` and is correct there — it
converts a magnitude. `CurrencyInput` re-attaches the sign around it rather than asking that utility to
change, because the sign belongs to the field's spelling and not to the decimal shift.

### Group sizes are read from the decimal point outwards, and the last one repeats

**`TextSyncGroupDefs.groupSizes` is a list, read from the point outwards.** `[3]` is every locale that groups
in threes, `[4]` is a group of four, and `[3, 2]` is the Indian grouping: three digits nearest the point, then
twos for as long as the digits last. The last entry repeating is what lets a fixed-length list describe a
number of any size — the alternative, a list as long as the value has groups, would have to be recomputed
every keystroke by whoever supplied it.

**An empty list means no grouping at all**, which is the same rule read at its limit: there is no size to
repeat, so the whole run is one group. A size below one is treated the same way, because the alternative is a
loop that never advances.

**`getGroupSizes` reads the pattern off `Intl` rather than carrying a table of locales.** It formats a
ten-digit sample, measures each group the locale produced, reverses them and drops the leading one — which is
a remainder rather than a group — then collapses the repeated tail to a single entry. Ten digits is chosen
because it divides evenly by none of the group sizes in use, so the leftmost part is always a partial group
and dropping it is always safe. A locale that produced no groups at all falls back to threes, matching what
`DecimalUtils.getSeparators` does when a locale names no separator.

### The mask: only digits are typed, and the caret is computed rather than preserved

Settled, on the user's call to try a mask rather than the element-per-segment shape every other library uses.
The primitive two shipped fields were waiting on.

**What the survey found, kept here because it is the argument against the shape that was chosen.** React Aria
renders one focusable, editable segment per date unit, each a spin button in its own right, and says so as the
point of the design: any locale order, in any calendar system, without a browser input mask. MUI moved to the
same shape in v7, replacing the single `<input>` with a list of sections behind an
`enableAccessibleFieldDOMStructure` prop, so that ARIA attributes can sit on each section. An element per
segment does not solve the display-form-versus-value-form problem; it makes it not arise, because there is no
single string to be in two forms. **And no component library owns a mask at all** — MUI's own text-field
documentation covers formatting by swapping the inner input for `react-imask` or `react-number-format`, so
everywhere it appears it is a dependency rather than a component. That is the gap this primitive fills, and it
is why exporting it was worth doing.

**`TextSyncUtils.applyMask(pattern, previous, next, caret)` is a pure function, so the caret arithmetic is
reachable from `npm test`.** A pattern is `#` for a digit slot and any other character as a literal, so
`dd/mm/yyyy` is `##/##/####`. It returns the text and where the caret belongs; `TextSyncUtils.utils.test.ts` covers
the cases that are easy to get wrong.

**Only the digits carry meaning.** Everything that is not a digit is discarded on the way in and re-emitted
from the pattern on the way out. That single rule makes typing `25122026`, pasting `25/12/2026`, pasting
`25.12.2026` and pasting ` 25 12 2026` all land the same value, and it is why the caret cannot simply be
preserved: the position that survives an edit is _how many digits precede it_, and the text offset is derived
from that afterwards.

**Deleting a literal deletes the digit in front of it.** Backspacing the slash in `12/34` would otherwise
strip a character the mask immediately puts back, so the key would read as broken. The tell is that the digit
count did not change across an edit that shortened the text.

**The mask lives in `TextSync` because it owns the caret, and a transforming setter cannot.** The owner's
setter runs after the browser has written the text; it can refuse or rewrite a value but cannot move a caret
it never saw, and a caret left where the keystroke put it lands before the separator the mask just inserted.
`createValueSync` therefore takes an optional `getMask` and, when there is one, writes the masked text, sets
the caret and reports upward — instead of reporting first and syncing back.

**One consequence, accepted: inserting into the middle shifts rather than overwrites.** Typing a digit into
the middle of a complete date pushes every later digit along and drops the last, because the mask holds a
digit string and not a set of fixed-width fields. Overwrite-in-place is what per-segment elements give free,
and it is the main thing this shape does not.

**What a mask cannot do at all**, which is the line where segments would come back: with one input the browser
draws the whole string, so nothing can tint or box the segment the caret is in, and nothing can be placed
_between_ two segments. What it keeps is everything about the field being one input — `renderLeading` /
`renderTrailing` untouched, the measured adornment inset still applying, `computeTextStyle` still styling the
value. Verified on the masked `DatePicker`.

### A masked field shows the separator it wants next, and never deletes what it could not read

Both settled, from the user testing the fields and finding them, in their words, broken. One
complaint: **a field must say what it is waiting for, and must never answer a mistake by throwing the mistake
away.**

**The separator arrives with the group before it, not the digit after it.** Four digits into `####-##-##` the
text is `2026-` with the caret after the dash. The old rule was the opposite and is argued a few paragraphs up
— a half-finished field never held a trailing separator, so nothing had to decide whether an incomplete value
ended at a digit or at punctuation. A real simplification bought at the reader's expense: typing `2020` into an
ISO field gave no sign that a month was wanted next, or that the dash would be supplied rather than typed.
Nothing downstream cared, because every consumer of the text counts digits rather than characters.

The deletion rule is unchanged and now does more work: backspacing over a separator still removes the digit in
front of it, so two presses remove two digits rather than a digit and a dash. What changes is where it stops —
`25/12/` loses the `2` and becomes `25/1`, keeping the separator its first group earns.

**An unreadable field keeps its text and reports an error.** `DateInput` and `TimeInput` used to rewrite the
text from the value whenever the field was left, and with no value that meant erasing what had been typed:
entering `2020-20-20` and tabbing away left an empty field and no explanation. The rewrite now runs only when
there is a value to rewrite from.

**Wrong and unfinished are different, and they report at different moments.** A spelling that cannot exist —
the 20th month, `29:99`, a date outside `getMinDate` / `getMaxDate` — is wrong the instant the last digit
lands, and errors immediately while the field still has focus. A half-typed value is not wrong yet; saying so
mid-keystroke would be noise, so it errors only once the field is left, and typing again clears that. Both
surface through the flag the painter already reads: `getHasError` is the consumer's own prop **or** the
field's own judgment, so a consumer who passes nothing still gets a field that says no.

This is what `hasError` on sixteen controls was waiting for a producer to do, and the producer turned out to be
the control itself rather than the form story `backlog.md` files it under.

**The value is still cleared when the text cannot be read.** The error is about the text; the owner is told
there is no date, which is true. What changed is that the field stops agreeing with the owner by going blank.

**A part that cannot exist is refused before the rest of the value does.** Added the same day, on the user's
observation that a 13th month is already wrong without waiting for a day: `TextSyncUtils.readGroups` reads the
**complete** fixed-width groups of the digits typed so far and range-checks each on its own — month 1-12, day
1-31, hour 0-23 or 1-12 on a 12-hour clock, minute and second 0-59. A group still being typed is not reported,
so `1` never has to answer for the month it might become.

The bounds are per-part rather than per-value: the day's ceiling is the longest month, because a 30 February is
two parts _disagreeing_ rather than one part being impossible, and that stays `fromIso`'s to catch. Three
checks in order — impossible part, complete-value parse and bounds, then unfinished — each reporting at the
earliest moment it can be sure.

**Not extended to an impossible _prefix_**, though the same argument reaches it: a month whose first digit is 2
can only become 20-29 and is already doomed. Refusing it needs the field to reason about what a group could
still become, and the published answer to that case is auto-advance — typing `2` fills `02` and moves on —
which is a different feature with its own keyboard consequences.

### A masked field offers the placeholder that matches its own mask

`renderPlaceholder` is `(getFlags, hint)`, where `hint` is `yyyy-mm-dd`, `dd/mm/yyyy`,
`hh:mm` or `hh:mm:ss` depending on what the field is spelling. A consumer wanting something else ignores the
argument; the Playground's eight variants stopped carrying eight hand-written strings, three of which were
wrong — every time field said `yyyy-mm-dd`.

**It comes from the format, not from the mask string.** The hint and the pattern are two renderings of one
definition (the ordered parts and the separator), so `computeHint` sits beside `computeMask` and reads the
same record. Deriving the hint by rewriting `####-##-##` would need a second thing to know that the first
group is a year — the guessing _"an arbitrary mask string is deliberately not the prop"_ avoids.

**It is a plain string rather than an accessor**, following `Calendar.renderWeekday`'s `name`: the painter
reads it inside a tracking scope, so a format change re-renders it anyway.

The prop behind it is `getPlaceholderHint` on `TextField`, `Omit`ted by `DateInput` and `TimeInput` for the
reason they omit `getMask` — they own the format. A hand-built `TextField` or `TextInput` sets neither and its
painter is handed `undefined`.

### `MaskedField`: the half every field over a typed value shares

Extracted, once `DateInput` and `TimeInput` had written the same thing twice and a formatted
number was about to write it a third time. `Abstracts/MaskedField` owns the private text signal, the effects
keeping it and the value in step, and the three moments at which a field reports a problem. What stays in each
control is what differs: its codec, its bounds, and whatever control it puts in a slot.

**The value arrives as a getter and a setter, not a `Signal`.** A control may not hand its own prop through
unchanged — `DateInput` converts the value into the calendar the field types in first — so the field cannot own
the signal. Same shape as `SignalMirror`, same reason.

**Completeness is counted in digits, and may be absent.** Only digits are typed, so a half-typed value is one
whose digit run is short; measuring the _text_ agrees while every group is a fixed width and stops agreeing the
moment one is not. `getDigitCount` returning `undefined` says the field has no notion of half-typed at all,
which is the honest answer for an amount.

**A value the codec refuses is reported to nobody, and the owner keeps the one it holds.** The commit effect
used to hand `undefined` outward whenever a complete digit run yielded nothing — the 31st of February, a 24th
hour, an amount over a field's maximum — so a field that had held a date all along spent a few keystrokes
telling its owner it was empty, and whatever read that value acted on it. It now commits only what the codec
accepts, plus the empty field itself: no digits still means no value, because that is what an empty field
means, and everything else waits. Two things fall out of it. The half-typed guard is gone, because a codec
that needs all its digits already answers `undefined` without them, which leaves `getDigitCount` to
`getHasIssue` alone. And blur restores the text from the held value, which is what a half-typed value already
did and what a refused one now does too — the field cannot clamp arbitrary text the way `NumberInput` clamps a
number, so going back to the last accepted value is the only settling available.

**The spelling follows the formatting as well as the value, and that needs its own effect.** Nothing else
catches a change of format on its own: switching an amount field's locale leaves the value and the digits
exactly as they were, so the effect comparing them stays quiet and the field goes on showing the old
punctuation. The text is rebuilt **from the value** rather than from the digits on screen, because the same six
digits are `1,234.56` at two decimal places and `123,456` at none.

**The value is committed when the digits change, never when the rules do.** Solid commits from an effect over the
digits, and that effect used to read the codec tracked, so a change of format re-ran it over the digits still on
screen: a `TimeInput` typed to `13:00` and switched to twelve hours and back came back as `01:00`, because the
twelve-hour text `01:00` was read once more as twenty-four-hour digits before anything rewrote it. The effect now
tracks the digits alone and runs the codec `untrack`ed. The re-spelling effect, for its part, tracks the value and
remembers the value and spelling it last saw, rewriting only when the spelling moved under an unchanged value — so a
field that started empty, and so read no rules on its first run, follows its format once something has been typed.

**In React and Vue the control watches its own format.** Their masked field commits from the text's setter and has no
effect that could re-read the text, so it has no such fault, and no watcher of the format either: `TimeInput` calls
`refresh` when `isTwelveHour` or the segment count changes and `DateInput` when `format` or `calendar` does. React's
call is a layout effect, so the new spelling is on screen in the frame the format changed rather than one after.

**A control must not keep a second copy of something the value already carries.** `DateInput`'s era signal is
state _only_ for the empty field, and `fromDigits` reads the era off the held value. Reading the signal instead
made the two fight: moving the era commits a new date, the new date re-spells the text, and the text-to-value
effect re-derived a date from those digits and the signal — which had not caught up — committing the old era
back. Duplicated state plus two effects is a loop.

### The masked field commits only what the reader typed, flags a value it cannot read back, and settles on blur

Found on CurrencyInput's Docs page: a held −250 with Signed switched off became 250, and switching Signed back on
had nothing to restore. The cause was in Solid's and Svelte's masked-field helpers, which committed whenever the
digits changed — including when a change of settings made the field rewrite its own text, which they then read back
as if typed. The user's model fixes it, recorded in `conventions.md` under _"A field keeps the text it shows apart
from the value it holds"_.

- **Only the reader's typing commits.** Solid commits from `onInput`, which `TextField` calls after writing the
  reader's text; a rewrite of the text from the value commits nothing. Svelte's respelling writes the text directly
  instead of through its typing path. React's and Vue's `CurrencyInput` rewrote the text on a change of format
  through the same setter typing uses, and so committed it; they call `refresh` instead, as their `TimeInput` and
  `DateInput` do.
- **A held value the settings no longer allow is shown and flagged.** `MaskedFieldUtils.getIsUnheld` asks whether the
  field, reading its own spelling of the value back, gets a different value; every helper ORs it into the error.
  CurrencyInput now spells a negative amount with its minus whether or not a sign may be typed (its `formatDigits`
  formats with the sign allowed), so a held −250 shows "−250.00", flagged, and the consumer keeps −250.
- **Limits correct on blur, edited or not.** `MaskedFieldDefs.settleValue` clamps the held value when the field is
  left. CurrencyInput's `min`/`max`, DateInput's and TimeInput's `minValue`/`maxValue` moved out of their parsers
  into it, so an out-of-range entry is kept as typed and pulled to the bound on leaving, as NumberInput's always was.
  The parsers still accept bounds; the inputs no longer pass them.
- **Not covered:** an amount with more decimals than the field keeps is still spelled rounded, though it is flagged as
  unheld and kept. Range draws an out-of-range value at its end, unchanged and unflagged; whether it should mark it
  is open.
