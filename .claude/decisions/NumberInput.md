# Decisions: `NumberInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `NumberInput`, and the first preset that earns a codec

This does not reopen _"`number` is a type, not a component"_ — it passes that
test. Four things a consumer would otherwise write per field, none of them an attribute: the ladder
stepping walks, clamping when the field is left rather than per keystroke, refusing characters that cannot
appear in a number, and the string-to-number codec.

**It is a `type="text"` field**, which the caveat above already recommends: under `type="number"` the
sanitisation algorithm makes `element.value` return `""` during half-typed input, so `isEmpty` lies and a
placeholder overlay draws over what was typed. A field whose job is to own a number cannot afford that.
What the browser stops providing — spin buttons, arrow stepping, the spin-button role — the shell
provides.

`getIsSpinButton` on `TextFieldState` is exactly the `getIsSwitch` shape: the base computes
`role="spinbutton"` and publishes `aria-valuenow` / `aria-valuemin` / `aria-valuemax` from the value and
range it already holds. `aria-valuenow` is omitted while the text does not parse.

**`value` is `Signal<number | undefined>`, and `undefined` means an empty field.** The one place the
`Signal<string>` rule is deliberately broken, because the codec is the feature. A private `Signal<string>`
still runs the element, so the `"1."` hazard is untouched — the string signal is what `TextSync` compares
and the number is never written back over it. `undefined` rather than `0`, because a `0` would be a value
the user did not type.

**Typing is refused character by character rather than parsed and rewritten** — the transforming-setter
idiom moved inside the control. `NumberInputUtils.sanitizeText` keeps a character only where it can legally
appear: one sign at the front, one more after an exponent, one decimal point, one exponent and only after a
digit. Written to keep half-typed values typeable rather than to accept only complete numbers: `-`, `1.`,
`1e` and `1e-` all survive, each reporting `undefined` upward until it parses.

**Clamping happens on blur, not on input.** Per keystroke it makes the second digit untypeable — with a
minimum of 40, typing `5` becomes `40` before the `0` arrives. Stepping still clamps immediately, because
a step is a complete gesture and typing is not.

**And an out-of-range number is reported to nobody until the field settles.** Blur-clamping alone was not
enough, because it only governs the text: the number still went out on every keystroke, so a duration field
with a floor of 100 handed its consumer `5`, then `50`, and restarted the animation twice at durations nobody
asked for. What holds the range now is silence — while the text parses to something the range refuses, the
`value` and `onInput` are left alone and the owner keeps the last reading that was allowed. Leaving the
field clamps and reports, as before, so the value an owner sees is only ever one it could have been given.

**`undefined` is still only "empty", and out-of-range is held rather than reported as `undefined`.** An owner
cannot afford the two to be one answer: `undefined` is what it acts on to mean "nothing was entered", and
holding needs no third state to say the rest. `CurrencyInput`, `DateInput` and `TimeInput` reported `undefined`
for a figure or a date their codec refused, which is the same fault a level down; `MaskedField` holds too now,
so all four controls agree — see _"a value the codec refuses"_ in the `MaskedField` entry.

**The field says so itself**, `hasError` ORing the range issue into whatever the owner passed, the same line
`CurrencyInput` writes. It shows immediately rather than on blur, matching a native number field: `:invalid`
tracks the value, so it follows `rangeUnderflow` from the keystroke that causes it — waiting for the field to
be left is what the separate `:user-invalid` is for, and a control that reports nothing meanwhile owes the
person typing the reason straight away.

**Stepping, `Home` / `End` and the stepper's end flags read the text, not the reported value.** They used to
read `value`, which was the same thing while every keystroke was reported and is not any more: with
`999` typed into a field capped at 100 and the owner still holding `99`, an arrow would have stepped from the
`99` nobody can see. The text is what the field holds; `value` is what the owner has accepted.

**The fault this came out of was one level out, in the Playground's own panel adapter.** `PageNumberField`
brought every keystroke into range before storing it, and the mirror then wrote the stored number back over
the text — so with a floor of 100, pressing `5` to begin `500` left `100` in the field and the `0`s appended
to that. It also reported twice, once through the mirror's setter and once through `NumberInput`'s `onInput`.
Both are gone and the adapter now guards nothing, because the control does.

**The step ladder counts from `min`, not from zero**, matching a native number field: a value on a rung
moves a whole step, one between rungs snaps to the next rung in the direction of travel. `computeStep`
runs the arithmetic in whole units of the smallest decimal in play rather than in floats, so `0.1` from
`0.3` gives `0.4` and no epsilon has to be chosen. Pure function in `NumberInput.utils.ts` with tests.

**The stepper reaches the painter through `renderTrailing`, widened rather than duplicated.**
`NumberInput` re-declares that slot as `(getFlags, stepper)`, the same widening `InteractionTooltipDefs`
does. A second `renderStepper` slot loses: both want the same physical position, and one slot lets a
painter draw a unit and a stepper together. The `stepper` carries `stepUp` / `stepDown` plus `getIsAtMin` /
`getIsAtMax`, so a painter can disable the end of the range it has reached — flags stay pure state, actions
stay out of them.

**`onKeyDown` and `onBlur` exist on `TextFieldCbs` and are `Omit`ted from both public presets.** The
arrows, `Home` / `End` and the blur-clamp need them, and the base is where they belong; whether `TextInput`
should expose them is a separate question, and answering it as a side effect would be smuggling.

**`untrack` on the mirror is the fix for a real flip-flop, not a micro-optimization.** The effect
restating the text when the owner writes a new number must read the text _untracked_. Tracked, it also
re-runs when the text changes — and `TextField` writes the raw text into the signal before the preset's
`onInput` sanitises it, so for one moment the text says `"1"` and the number still says `undefined`. A
tracked effect fires in that gap, formats `undefined` back to `""`, and the two fight: the observed
symptom was a caret jumping to the start and digits arriving in reverse. The `ImageSwitcher` shape — an
effect whose job is one-directional must only depend on the direction it syncs from.

### Controls: `NumberInput`'s page step, and numbers read and written by locale

**PageUp and PageDown move `pageStep`, which defaults to a multiple of `step`.** The default is worked out in the
component from a private multiple, because a defaults object keyed by prop name cannot state a value that depends
on another prop. It is the same arithmetic as one step over a longer distance: `computeStep` takes an optional
`distance`. A value between steps first falls back to the step behind it, so ten from 13 with a step of 5 gives 20;
a distance that is not a whole number of steps lands on the next step past it; bounds clamp exactly as for the
arrows. With `distance` equal to `step` the arithmetic is the old single step, so the existing tests stand.

**`locale` finds its separators with `DecimalUtils.getSeparators`, the same call `CurrencyInput` makes.** Left out,
it means the reader's own locale, as it does for `Calendar`. Parsing drops group separators and reads the decimal
separator as the fraction, so under a German locale `1.000` is one thousand and `1,5` is one and a half. While
typing, a group separator is kept only straight after a digit of the whole part; under a locale that groups with a
space, any white space counts, because nobody types the non-breaking space the locale actually uses. The field
writes a number back with the locale's decimal separator and without grouping, only on a step or on leaving the
field, so what it writes looks like what the reader types and reads back as the same number for every finite value.

**`TextField` gained `computeSpinValue`**, because it read `aria-valuenow` with `Number(text)`, which gets both
German spellings wrong. The presets omit it beside `isSpinButton`.

### The stepper handles report whether they moved

**`ScrollerStepper` and `NumberInputStepper` return `boolean` from every command**, although they are handed out
through a render slot rather than at mount. _"Every controller callback reports whether it succeeded"_ is about the
caller being able to find out that nothing happened, and a render slot's caller has the same need.
`stepToPrevious`/`stepToNext` answer `false` at the matching end; `stepUp`/`stepDown` answer `false` when the field
refuses writes or the value did not move; `startStepping*` answers `false` and does not start repeating when its
first step is refused; `stopStepping` answers `false` when nothing was repeating.
