# Decisions: `Form`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Form` moves focus to the first field in error on submit

**After the handler returns, focus goes to the first registered field whose `hasError` is true.** Registration
order is the order the fields were first drawn. The handler always runs, because the library does not decide that
a form may not be sent. Focusing after the handler rather than before means an error the handler reports
synchronously also counts, and a field whose error depends on `hasSubmitted` counts too, because that flag is set
before either step. Validation that arrives later, after a request comes back, moves nothing: its timing belongs to
the consumer.

**`FormField` knows its message but not its control, so the control hands its element up through the field's
context.** `registerControl` and `unregisterControl` sit on `FormFieldContextType` beside `getDescriptionId`, and a
control calls `FormFieldUtils.registerControl(getElement)` beside its `resolveAriaDescribedBy` call. The two travel
together because the element that carries the field's description is the element that should take focus for it.
The field holds the latest element registered and lets go only of the one it holds, so a control that swaps its
element (`Select` between its button and its filter input) ends up registered either way. The field passes the
element on to `Form` as its entry's `getFocusTarget`, and `FormSection` answers with its own first failing field's.

**The first entry in error decides, and focus does not skip past it.** If it has nothing to focus, focus stays where
it was, because jumping to a later field would take the reader past the first thing that needs fixing. Every control that reads the field's
description registers its element beside that read, so `TextField`, `BinarySwitch`, `TagInput`, `FileInput`,
`ColorInput`, `SlideButton`, `Range` and `Select` all take focus this way. A `FormSection` in error only on its own
word, with no field inside it failing ("these two do not match"), sends focus to its first field, on the user's call: the
reader lands inside the thing that is wrong and can read the section's message from there, and for a mismatch which
of the two fields is retyped is arbitrary anyway.

### The form story: the library wires, the consumer validates

Settled, on the user's call. It closes the largest open item, and the decision is the whole of
it.

**Validation is not the library's.** No validator prop, no required / min / max / pattern, no rule language.
Validation is application logic — schemas, async server checks, rules spanning fields — and a library that
owns it ends up with a half-built rule language nobody can extend, plus two sources of truth the moment a rule
needs another field's value. `hasError` stays what it was: a prop the owner sets. What changes is that it now
has somewhere to go.

**What the library owns is association and announcement.** `FormField` generates the ids and wires a control
to its message; `Form` collects what its fields **report** and never computes anything. Those two are the
whole surface.

**`FormField` publishes a context and the control reads it, which is `Label`'s shape reused.**
`FormFieldUtils.resolveAriaDescribedBy` sits beside `LabelUtils.resolveAriaLabel` and merges the context's
message id with any `aria-describedby` the consumer passed, so the consumer wires nothing. The alternative —
handing ids out through a render prop to thread — puts an accessibility relationship in application code where
a missing attribute fails silently.

**An error message is a live region; a hint is not.** The message element takes `role="alert"` only while the
field reports an error, so an error that appears is read out and a standing hint is not re-read on every
render. A message that empties takes the description reference with it, so a control is never described by
nothing.

**`Form` collects entries the way `RadioGroup` collects radios.** Each `FormField` registers
`{ getHasError }` during setup and cleans itself up; `getIsValid` is the memo over all of them. A submit
button reads it through the context, so disabling itself needs no state of its own. Registration rather than a
data-driven list, because a form's fields are written as markup rather than enumerated as records.

**`Form` renders a real `<form>` with `noValidate`, and prevents the default on both events.** The element
gives Enter-to-submit and reset for free; `noValidate` keeps the browser's own bubble from competing with the
messages the consumer draws. `hasSubmitted` is exposed because "show the errors only after the first attempt"
is the one piece of form state that is not a field's.

**A control does not hold its own error back until submit, and `hasSubmitted` is not for the errors it
raises.** Stated by the user. The split is by _who can answer the question_, not by when the
reader would rather hear it. A format, range or mask error is answerable from the field's own text the moment
it is typed, so hiding it until submit is a control keeping a secret from its reader. `hasSubmitted` exists
for the other kind: an answer only a server has — whether credentials are accepted, whether a name is taken.
So `DateInput` and `TimeInput` raising `hasError` from their own text is the other half of the same rule
rather than a conflict.

**`Button` gained `getType`.** A submit button has to be `<button type="submit">` and the leaf hardcoded
`"button"`. It defaults to `"button"`, so nothing changed for existing call sites.

**Every field reads the description context, and so does `SlideButton`.** `TextField` and `BinarySwitch` cover
`TextInput`, `TextArea`, `NumberInput`, `CurrencyInput`, `DateInput`, `TimeInput`, `Checkbox`, `Toggle` and
`Radio`; `Select`, `ColorInput`, `FileInput` and `Range` each make the same one-line call. `SlideButton` is the
one control that is not a field and reads it anyway — see the entry under its own heading. The plain `Button`,
`Menu` and the navigational controls do not, and nothing has asked.

**`aria-required` is in, because it is announcement.** Rejecting the native `required` attribute (a browser
bubble, which is paint) and rejecting validation (rules, which are the consumer's) left the ARIA state
unconsidered, and every mainstream library writes it. It paints nothing and enforces nothing; it tells the
reader that a value is expected, which is exactly the half the library owns. So `isRequired` sits on
`TextField` (and every preset over it), `BinarySwitch` for `Checkbox` and `Toggle`, `RadioGroup` (a `Radio`
omits it, since the group is the field), `Range`, and the `Select` family, each writing `aria-required` on the
element that carries the role. `FormField` takes it too and hands it out in `FormFieldState` beside `hasError`,
so the caption and the control read one value. Nothing checks it: a required field left empty submits like any
other, and the consumer's own validation says otherwise.

### A control with no native element submits through a hidden input

Settled, on the user's call, and it did not wait on whether `Form` ever carries values. A plain `<form>` around
`Select`, `MultiSelect` or `ColorInput` sent nothing, since none renders a native field, and around `DateInput`,
`DatePicker` and `TimeInput` it sent the text on screen (`23/09/2026`), which a server cannot parse. Both routes to
a value for `Form` — reading the fields' entries, or leaving it to the native submit — need the same hidden input,
so building it settled nothing the `Form` question still holds.

- **`FormValue` draws one `<input type="hidden">` per text, under `name`, and nothing when `name` is unset**, so a
  control nobody names pays nothing. `FormValueUtils.computeText` writes a value as submitted text.
- **A single `Select` with nothing picked submits an empty entry; a `MultiSelect` with nothing picked submits none.**
  Both are what a native select does.
- **Option values are any type, so the text is the consumer's to name, with a default.** `computeFormValue` on the
  select; left out, a string goes as it is, a number or boolean as its plain spelling, anything else as
  `JSON.stringify`. Decided on the user's call over a warning with no fallback: the repo's own record options
  (`Airport`, `Delivery`) are plain data JSON handles. A value JSON cannot write throws, which matches _"any
  conversion into a form that cannot hold the value fails loudly"_.
- **The date and time fields give their `name` to the hidden input and not to the visible field**, otherwise a
  submit would carry both the ISO value and the display text under one name. The value is the one the field holds,
  never the text on screen, so a half-typed or refused entry submits the last valid value, as _"a field keeps the
  text it shows apart from the value it holds"_ says. A date goes through `DateValueUtils.toIso`, always Gregorian;
  a time through `TimeUtils.toIso`, `HH:MM` or `HH:MM:SS` by the value's own shape.
- **`ColorInput` submits its string as written**, in whichever notation it holds.
- **`TagInput` submits one entry per tag and never the half-typed text**; its text field carries no `name`.
- **`NumberInput` and `CurrencyInput` submit the number they hold through `FormValueUtils.computeText`** — as
  `String` writes it: digits with a point, never grouped or in the locale's marks, and with an exponent below a
  millionth or from 10²¹ up (`1e-7`), which is still a valid number to HTML and to any parser — and
  `FormValueUtils.EMPTY_TEXT` when they hold none. The visible field gives
  up its `name`, as the date fields' do, so the display text ("1.234,50") is not sent beside it.
- **A disabled control still submits**, consistent with _"disabled is one mechanism for every control"_ in
  `controls.md`, which already accepts that `aria-disabled` controls are not left out of a submit.
- **Composed pickers need nothing of their own**: `DatePicker`, `TimePicker` and the two-part pickers already hand
  `name`, or `<name>-start` / `-end` / `-date` / `-time`, down to these fields.

### `Form` hands `onSubmit` the browser's `FormData`

Settled, on the user's call, once every field submitted a real value through a hidden input. `onSubmit` is
`(data: FormData) => void`, and the data is `new FormData(form)` read at the moment of the submit. It closes the
backlog item that asked whether `Form` should ever carry values.

- **It does not revisit _"The form story: the library wires, the consumer validates"_.** The library still computes
  nothing about a form's data: the browser collects the named fields, and the fields already write native values, so
  `Form` forwards what the page would have sent. A decision to hand over an object of values would have been the
  library choosing how repeated names collapse, which is the computing the story rules out.
- **A multiple select sends one entry per pick under its one name**, so the consumer reads it with `getAll`. This is
  why an object shape was not chosen: one pick and several picks are the same field, and a plain object cannot tell
  them apart without the library deciding.
- **A field with no `name` sends nothing**, and a disabled control still sends, the cost already accepted in
  `controls.md` under _"Disabled is one mechanism for every control"_.
- **The submit is still canceled.** `Form` keeps calling `preventDefault`, so a consumer who wants the browser's own
  submit leaves `Form` out and uses a plain `<form>`.
- **The type changed in the shared core**, `BaseFormCbs`, so the four frameworks changed together; a callback taking
  fewer arguments still fits, so existing call sites needed nothing.

### `Form`'s Docs page: the submit button is never disabled, and a status line shows `isValid`

**Form's page covers Form only**, the user's call over one page for Form, FormField and FormSection: its examples
use FormField but each of the three keeps its own page.

**Basic's Sign up button stays enabled; `getState().isValid` drives a status line instead** ("Ready to send." /
"Some fields need attention."). The old example disabled the button while any field was in error. The user's gut was
to keep that and the standards outweighed it: WCAG does not forbid it here, since every error is already in text
(3.3.1), but the GOV.UK Design System says "Disabled buttons have poor contrast and can confuse some users, so avoid
them if possible", and the library's own answer — submit, and focus lands on the first field in error — needs an
enabled button. **Each example's submit handler checks its own completeness before "sending"**, since the handler
runs whatever the fields report, and that is the consumer deciding, which is the point the info box makes. To keep
the status line and the handler in agreement, an empty email is an error in Basic ("Enter your email."), and the
hint "We only use it to sign you in." shows once the address looks right.

**Each example has its own section, and the intro has none.** "Errors shown as you type" holds the sign-up form and
says what both forms share — `isValid`, the handler running either way, focus moving to the first error — so
"Errors shown once the form is sent" says only what `hasSubmitted` adds, and nothing is said twice. Each example holds its own signals and shows its outcome in a readout line under its buttons,
in place of the Examples page's readouts. No knobs: nothing about Form is worth one.
