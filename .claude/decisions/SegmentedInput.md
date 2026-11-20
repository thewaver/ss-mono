# Decisions: `SegmentedInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `SegmentedInput`, one hidden field drawn as cells

Decided by the user: a code field built the way `input-otp` builds one, replacing the Playground's one-time code
demo, which faked it with a `TextInput` whose text was made transparent and a painter drawing six boxes over it.
The fake needed three workarounds in consumer CSS — hiding the input's focus outline through a sibling selector,
hiding its `::selection`, and guessing which box was "next" — and still could not do the one thing a person
correcting a code needs: the hidden characters sat bunched at the left rather than under the boxes, so a press
on the third box put the caret nowhere near the third digit, and a selection could not be seen at all. Fixing
digit three of four meant erasing digit four first.

**One real input, not one per cell.** The alternative every hand-rolled code field reaches for is an input per
digit with focus hopping between them, and it loses on the things the field is for. An SMS code offered by the
phone (`autocomplete="one-time-code"`) is written into one field, so with six fields it lands in the first and
the component has to catch and redistribute it; a paste has the same problem; and a screen reader meets six
unnamed one-character fields instead of one field holding the code. One input gets all three from the platform,
and the cells are paint.

**It is a preset over `TextField`, not a shell of its own.** Everything a single-line field already does is
wanted unchanged: the caret-keeping sync and the IME gating in `TextSync`, the `Label` and `FormField` wiring,
disabled-as-`readonly`, `autoComplete` and `inputMode`, and the mask transform hook. What it adds sits on top:
the cell row as the field's `renderContent`, the listeners reading the caret, and the pointer handler.
`TagInput` is its own shell because its value is a list; this one's value is a string like any other field's,
so it has no such reason.

**What the field hides is `TextField`'s `isConcealed`, not consumer CSS.** The one change to the base: an
`isConcealed` state prop, `Omit`ted from `TextFieldPresetProps` so no other preset offers it, which puts a class
on the element making its text, its caret, its `::selection` and its outline transparent or absent — all
`!important`, for the same reason the blank-slate resets are: an app's `:focus-visible` rule and an element
selector outrank a class. The outline in particular: this is the one control where the ring is deliberately not
on the focusable element, because the painter draws it on the cell that has the caret, and a second ring around
the whole row would be wrong. It is a property of the element's paint, so it belongs with the element rather than
in a sibling selector reaching into it.

**What the painter receives, per cell.** `renderCell(getCell)` is called once per cell and hands over one
`SegmentedInputCellRenderProps`: the field's own flags (`TextFieldFlags` plus the interaction set), the
component's `SegmentedInputCellFlags` — `hasCaret` and `isSelected` — and the payload `index` and `char`. It is a
`*RenderProps` because of the payload, and the boolean pair keeps the `*Flags` name as the component's own
contribution. **`hasCaret` marks the cell the next typed character lands in**, which is where the caret is or,
with a selection, where the selection starts; on a full field with the caret at its end it is the last cell. So
exactly one cell has it whenever the field holds focus, and that is what makes it the place for the focus
indicator. Both are false while the field is unfocused, matching a native input, which does not paint its
selection when it is not focused. The component wraps each painted cell in a box of its own, inside a row marked
`aria-hidden="true"`, so the cells are never read — the field's value is.

**The caret and selection are read off the input, not tracked.** `selectionchange` on the element is the event
for it — Baseline 2024 per MDN, and it fires asynchronously even for a selection set by script — with `select`,
`focus`, `blur`, `keyup` and a deferred read after `keydown` beside it for anything that arrives before it or in
a browser without it. A read is idempotent, so hearing about one change several times costs nothing. An effect on
the value re-reads too, because the mask writes the text and the caret together and then reports.

**The pointer handler is the one hand-written piece of input behavior.** The input lies over the whole row at
`inset: 0`, as `TextField` places it, so every press lands on it. On `pointerdown` the component cancels the
browser's own caret placement — which would land somewhere in the invisible text — works out which cell the
pointer is over from the cells' own boxes (the nearest one, so a press in a gap goes somewhere sensible and the
arithmetic does not care which way the row runs), focuses the input and selects the character in that cell, so
the next character typed replaces it and the ones after it are untouched. A cell past the end of the value puts
the caret after the last character. Dragging with the button down extends the selection across the cells
crossed, with pointer capture so it survives leaving the row. Keyboard behavior is the browser's untouched:
arrows move the caret, `Shift` extends, typing at a collapsed caret inserts and pushes later characters along,
and the filter cuts whatever falls off the end.

**Characters are restricted by a predicate, through `TextSyncUtils.applyFilter`, not `applyMask`.**
`computeIsAllowed(char)` defaults to the ASCII digits, published as `TextSyncUtils.getIsMaskDigit`; the
component hands the field `applyFilter(computeIsAllowed, cellCount, next, caret)` as its mask transform. `applyMask`
did not fit: its only slot is a digit, so a code taking letters was impossible, and the part of it that deals
with literals — re-emitting separators, a backspace over one taking the digit before — has nothing to act on in a
field with none. What was reused is the shape: a pure transform in `TextSync` returning the text and the caret,
counted in accepted characters so a refused one in front of the caret does not move it, and tested in
`TextSync.utils.test.ts`. A pasted `123-456` lands as six digits for the same reason a pasted date lands in a
mask. `inputMode` defaults to `numeric` to match the digits default, and a consumer who widens the predicate
says so there as well.

**No string of its own.** It is a `textbox`, which ARIA does not require to be named, so `ariaLabel` stays
optional exactly as on `TextInput` and a `Label` or `FormField` names it just as well. There is no
`roleDescription`: nothing about it differs from a text field to somebody not looking at it. `cellCount` is a
count by _"a tally of cells is a count"_.

**What WCAG said.**

- **4.1.2 Name, Role, Value** — _"For all user interface components …, the name and role can be programmatically
  determined; states, properties, and values that can be set by the user can be programmatically set; and
  notification of changes to these items is available to user agents, including assistive technologies."_ One
  native input satisfies it without help: its role is `textbox`, its value is the whole code and changes are the
  platform's to announce. It is the argument for one input rather than six, since six would each expose a single
  character and no whole.
- **2.1.1 Keyboard** — _"All functionality of the content is operable through a keyboard interface without
  requiring specific timings for individual keystrokes …"_ Everything the pointer handler does — put the caret on
  a cell, select a run of cells — the arrows and `Shift` do natively, so the pointer route adds nothing the
  keyboard lacks.
- **2.4.7 Focus Visible** — _"Any keyboard operable user interface has a mode of operation where the keyboard
  focus indicator is visible."_ The field's own outline is gone by design, so the indicator is the painter's:
  `hasCaret` is set on exactly one cell whenever the field holds focus, and the Playground's painter draws the
  theme ring there when `isFocusVisible`. A consumer painter that ignores `hasCaret` fails this, and the
  `renderCell` block says the ring is theirs to draw.
- **3.3.2 Labels or Instructions** — _"Labels or instructions are provided when content requires user input."_
  The consumer's: the name comes from `ariaLabel` or a `Label`, and an instruction such as how many characters
  are expected is text they place and link through `FormField`. The library supplies no wording.
- **1.3.5 Identify Input Purpose** — _"The purpose of each input field collecting information about the user can
  be programmatically determined when: The input field serves a purpose identified in the Input Purposes for user
  interface components section …"_ It does not reach a code field: the Understanding document scopes it to
  _"inputs collecting information about the user"_, and `one-time-code` is not in WCAG's list of input purposes. So
  `autocomplete="one-time-code"` is not a conformance requirement; it is what lets a phone offer the code from a
  message, which is why the Playground passes it. The component does not default it, because a field holding a PIN
  the person chose themselves must not invite autofill.

**Known limits.** Chromium's `:autofill` look paints an opaque box over a filled field, and a concealed field has
no text to show under it — the anti-spoofing lock `TextInput` records applies here too, and is left alone for the
same reason. Touch was not exercised: the pointer handler is written against Pointer Events and cancels the press
the same way for a finger, but only a mouse was driven by the suite.
