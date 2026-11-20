# Decisions: `TextInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `TextInput`

The first control whose element the user can see through, which turns out to be
the only thing separating it from `Checkbox`.

**The overlay geometry survives; what the input keeps does not.** Painter first in flow, `<input>` second
at `inset: 0` — the `CheckboxElement` arrangement, so the ring lands around what was painted. What
changes is the blank-slate rule: a text input **is** the thing showing the value, caret and selection. So
the reset keeps `appearance`, `background`, `border`, `border-radius`, `box-shadow`, `margin` and
`min-width` — all `!important` — and leaves `padding`, `font`, `color`, `caret-color` and the rest of the
text-drawing properties alone. `user-select: text` is set because `interactionRoot` sets `none`.

**Nesting the input inside the painter was the obvious alternative and lost on the focus ring.**
Typography would inherit and the padding duplication below would vanish, but the input is still the
focusable element, so the ring would be drawn around the inner text area rather than the frame, and
recovering it means the painter matching on `:has(:focus-visible)` — the arrangement rejected under
_"Nothing that fades or filters may touch the element that owns the focus ring"_. It would also make
`renderContent` a two-argument contract for one control.

**Accepted cost: the painter's inner padding and the input's `padding` have to agree, and nothing
enforces it.** Both are in the consumer's stylesheet, so a shared constant fixes it — the Playground's
`TextFieldContent.css.ts` derives both from `FIELD_PADDING`. The first place the painter does not own
literally every pixel, and the direct price of keeping the ring correct.

**`computeTextStyle` is the one place paint lives on the element the browser owns**, because there is no
other hook: the consumer must style the text, the text is inside the input, the input is the library's. It
takes `getFlags` per _"Render props receive what drives them"_ — disabled text is gray, and no ancestor
knows the flags.

It returns a **whitelisted** object rather than a class name:
`TextInputTextStyle = Pick<JSX.CSSProperties, "color" | "font-size" | "padding" | …>`. The first version
took `computeClassName` plus a prose rule ("only properties that draw text") that nothing enforced. A
`Pick` makes that a compile error, so a border or a `position` cannot decouple the painted box from the
wrapper's box. Solid's `JSX.CSSProperties` extends `csstype.PropertiesHyphen`, so keys are kebab-case and
lengths are strings — `"12px"`, not `12`.

**Applied as an inline style, which ends the specificity war on the consumer's side.** Inline styles
outrank every selector short of `!important`, so a consumer no longer reaches their input through a
`globalStyle` to beat an app stylesheet's `input:not([type="range"])`; the Playground lost four
`globalStyle` blocks. The library's own `!important` resets still win, correctly:
`caret-color` under `[aria-disabled='true']` must beat whatever the consumer asked for.

**One prop rather than one per property**, because almost everything that draws text is an _inherited_
property — `color`, `font-*`, `line-height`, `letter-spacing`, `text-align`, `text-transform`,
`caret-color`. Enumerating them reimplements CSS one prop at a time and still leaves a tail; one object
covers the tail by widening the `Pick`.

**Padding is deliberately _not_ whitelisted, because the library owns it.** The obvious division —
background element owns borders, corners and padding; input owns text — does not work: an absolutely
positioned box resolves `inset` against its containing block's padding box and **ignores that ancestor's
padding**, so padding on `renderContent` insets nothing. The first version whitelisted padding and made
the consumer compute it; `getPadding` and `getGap` replaced that (see below).

**What a value-only API cannot express**, recorded because it is why the class may have to come back:
`::selection`, `::placeholder`, `::-webkit-*` and `:autofill` are selectors, not values. The last is a
real gap — Chrome's `:autofill` forces an opaque background that `background: transparent` cannot clear,
so an autofilled field paints a solid square-cornered rectangle **over** the painter, and `color` is
locked the same way.

**Left alone deliberately, and not because it is hard.** The lock is anti-spoofing: Chromium refuses
author overrides so a site cannot conceal that the browser filled a field with stored data. Defeating it
is possible — `box-shadow: inset 0 0 0 1000px <color>` paints above the background and below the text,
and `-webkit-text-fill-color` covers the forced text color — but doing it by default would suppress a
signal the browser is deliberately showing. `opacity` and `filter` are not alternatives at any
specificity: both composite the whole paint, fading text with background and reaching the ring. So no
escape hatch ships; if one is ever wanted it should be a narrowly documented pseudo-selector hook rather
than a general class prop, and the consumer should be the one deciding to override an anti-spoofing
default.

**`renderPlaceholder` is a slot, not a string.** Native `placeholder` is paint the library emits, which
_"A control paints nothing"_ forbids. The slot is `position: absolute; inset: 0; pointer-events: none`,
rendered between painter and input so typed text is never occluded, and **always rendered when the prop
is given** — gating on `isEmpty` internally would make a floating label impossible. The painter reads
`getFlags().isEmpty` and decides between hiding and floating. Placeholder text should be `aria-hidden`,
for the same reason a checkbox painter's glyph is.

This is also why the slot belongs to the leaf rather than `renderDecoration`: the decoration wrapper sits
above the input and is shared by every control, whereas a placeholder must sit below the caret and only a
text field has one.

**Focus is drawn once, by the ring, and a painter must not draw a second one.** The first
`PageTextFieldContent` colored its border on `isFocused`, producing two concentric indications at
different radii. The outline already hugs the painted box exactly, so there is nothing left to add.
`isFocused` stays available for focus-driven paint that is **not** a ring.

**Adornments are `renderLeading` / `renderTrailing`, and they are the leaf's.** Both absolutely
positioned against the root at `insetBlock: 0`, both rendered **after** the input so they stack above it.
Width is their content's, so the slot hugs what it holds and clicks either side still land on the field.
The Playground puts a real `Button` in one: an adornment can hold anything, including another
`InteractionWrapper` with its own ring, tooltip and disabled state.

**The slot inherits `pointer-events: none` from the root and must not override it.** It briefly set
`auto`, which inverted hover: the slot sits above the input, so pointing at a static adornment stole the
hit test, the input never received `mouseenter`, and `isHovered` went **false** exactly while the cursor
was over the adornment. Inheriting `none` lets the hit test fall through, and hovering the adornment
reads as hovering the field, which is what it is.

Interactivity is unaffected, which is why `none` is the right default rather than a compromise:
`pointer-events` is inherited, so an interactive element re-enables it for itself, and every control
element here already does (`buttonElement`, `binarySwitchElement`, `textInputElement` all set
`pointer-events: all`). Only raw consumer markup that must be clickable needs `pointer-events: auto`, the
same one-liner `interactionDecorationWrapper` always required.

One consequence, left alone: hovering an interactive adornment drops the field's `isHovered`, since the
adornment is a sibling of the input and `mouseleave` fires. That reads correctly — you are hovering the
button — and fixing it means moving `wrapElement`'s hover tracking to the root and to `mouseover` /
`mouseout`, which is shared-code surgery for a cosmetic gain.

They do not go through `renderDecoration` because that slot is one full-box overlay shared by every
control, while these are positional, text-specific and drive the input's padding. Nor are they one prop
taking a side — _"one slot, not layered slots"_ was about stacking, and these reserve opposite ends.

Named leading/trailing for **role, not axis**, and **placed by the reading direction** — the user's call, reversing
an earlier "sides are physical" choice whose reason (nothing else in the library was right-to-left aware) stopped
holding. The leading slot sits at `inset-inline-start`, the trailing one at `inset-inline-end`, and the text's inset is
`padding-inline-start` / `padding-inline-end`, so the browser does the flipping and no code reads the direction. In
right-to-left text a prefix sits on the right, where reading starts, and `NumberInput`'s stepper on the left.

**The `padding` prop is logical too, on all four sides** — `CSSLogicalPadding`, `{ paddingBlockStart,
paddingInlineEnd, paddingBlockEnd, paddingInlineStart }`, CSS's own names. The user's call, over three others weighed
together: keeping `paddingLeft`/`paddingRight` and mapping them inside (a name pointing at the wrong side in
right-to-left text), React Native's `paddingStart`/`paddingEnd` (rejected as "the worst of both worlds": new vocabulary
that does not map directly to CSS), and keeping the names physical while reading the direction in code (the backlog
item had ruled that out). The Playground's stepper fields are why it matters: they set 5 on the trailing side for the
stepper, and that 5 must travel with it. **`CSSPadding` became `CSSPhysicalPadding`** (and `spreadPadding`
`spreadPhysicalPadding`) in the same change, under _"When a function grows a sibling, both names get the distinguishing
word"_. `CommandPalette`'s `fieldPadding` feeds a `TextField` and is logical. **`Select`'s `padding` is logical as well**, the
user's call once its clear button was found pinned to the physical right in right-to-left text: the button sits at
`inset-inline-end`, and the Playground's Select painter aligns its value to `start`.

**The field's inset is measured, not declared.** `getPadding` and `getGap` are what the consumer states;
everything else is derived. `getPadding` takes `CSSLogicalPadding | number`, normalized
through `CSSUtils.spreadLogicalPadding`, so one number spreads to four sides and per-side control needs no second prop.
`CSSUtils.spreadableToStyle` renames the keys and adds the `px`, so no template strings are built by
hand. It briefly took a bare `number`, and briefly used `Bounds` — the right shape for
`createViewportRectObserver`, which measures _edges_, while `CSSPadding` arrives keyed by CSS property.

Each adornment slot is observed by a local `createAdornmentWidth`, and the input's text area is inset by
`padding + (adornment ? adornmentWidth + gap : 0)` per side, applied as an inline style along with the
same inset on the placeholder slot. The slots themselves sit at `padding` from their edge. So the only
numbers anyone writes are padding and gap, and the placeholder need not know an adornment exists.

_Corrected after the fact: this section originally argued that an adornment reserves no space and the
consumer supplies matching padding, since measuring "buys correctness with a resize observer per field
and takes the decision away from the painter". The decision it takes away is one the painter cannot make
correctly — the strongest counter is **i18n**, where `Show` / `Hide` becomes `Anzeigen` / `Verbergen` and
any declared width silently breaks, along with font swaps and dynamic adornment content._

**A `ResizeObserver` specifically, not a measured rect.** `createViewportRectObserver` is a
`requestAnimationFrame` loop, right for a position that moves and far too heavy for a width that changes
rarely. `borderBoxSize` also reports **untransformed layout size**, which matters because the Playground
runs inside `Viewport`'s `transform: scale()` and `getBoundingClientRect` would return scaled values —
the whole reason `ViewportUtils.getAdjustedBoundingClientRect` exists. `offsetWidth`, used for the
initial synchronous read so the first paint is already inset, is likewise transform-free.

No feedback loop is possible while adornments stay absolutely positioned: the input's padding cannot
change an adornment's size. `getMinWidth` derives the **root's** size from the same measurements and is
safe for the same reason. Anything making an adornment's width depend on the root's would close the loop.

**`getMinWidth` is the floor, and it is the same numbers summed.** `InteractionWrapper` gained
`getMinWidth` beside `getSizing`; `TextInput` feeds it `leadingInset + trailingInset`, which expands to
`padding × 2 + adornment widths + gap × adornment count` — exactly the chrome. Below that the field draws
over its own adornments. It reserves nothing for the text: a zero-width text area is a legitimate floor,
and picking a minimum number of visible characters would be the library inventing a design decision.

This is why the measurement lives in `TextInput` rather than `TextInputElement`: `min-width` belongs on
the root, the root belongs to `InteractionWrapper`, and props flow down. The leaf receives `getTextInset`
and `getSpreadPadding` ready-made and is correspondingly dumber.

**What `getMinWidth` does not do: make the painter follow.** It protects the root, the input and the
adornments. A painter with a fixed `width` stays put, so if the floor exceeds it the root grows and the
frame is narrower than the field it frames. Guaranteeing they move together needs `flex-grow: 1` in
`interactionRoot > *`, which would change every control at once — not worth doing on `TextInput`'s
account. Until then the rule is that a painter must not be narrower than its own adornments require.

**It is a local helper in `TextInput.tsx`, not an `Abstracts` utility.** It briefly was
`ElementObserverUtils.createLayoutSizeObserver`, which put a second unrelated thing in a namespace whose name
then had to work harder, and shipped public API for one internal caller. Both instances live in one file.
Same rule as `TextArea` below: extraction is cheap, the wrong base is not, and the trigger is a second
component wanting it.

One correct-but-odd consequence: the focus ring encloses the adornments, because they are inside the
field's box. An adornment that should own its ring is a `Button` in the slot, and it gets one.
`interactionRoot > * { margin: 0 !important }` reaches the slots, which is the rule doing its job — a
consumer insets an adornment with margin or padding on their own content, one level down.

**Disabled means `readonly`, the first control where `preventDefault` could not do the job.** "Activation"
for a text field is typing, pasting, dragging text in, autofill and IME composition, with no single event
to cancel. `readonly` blocks every one and satisfies the constraints that forced the `aria-disabled`
rule: the element stays focusable, its events keep firing so a disabled-but-reachable field still reveals
its tooltip, and — decisively — **the UA does not repaint a readonly input**, so appearance parity holds
for free. Selection and copying survive, which native `disabled` would have killed.
`element.readOnly = isDisabled || isReadOnly`.

**The caret is suppressed while disabled, and only while disabled.** A disabled-but-reachable field is
focusable by design, and the browser draws a blinking caret in a `readonly` input — an invitation to type
that the field will refuse. `caret-color: transparent` on `[aria-disabled='true']`, with `!important`
because a consumer's `caret-color` reaches the input through `computeTextStyle`. Read-only keeps its
caret, since keyboard navigation and selection inside it are the point.

Read-only is a real feature, so `getIsReadOnly` is public, `aria-readonly` reflects only the consumer's
intent and `aria-disabled` reflects disabled. There is deliberately **no redundant JS guard on the input
path** — `readonly` is the single mechanism and a browser cannot deliver an `input` event past it. The
mouse handlers keep explicit gating, because `readonly` does not suppress `mouseenter` / `mouseleave`.

**Native constraint validation stays out.** `required` / `pattern` produce a UA-painted bubble, which is
paint the library would be emitting; `hasError` is the owner's. `maxLength` is out for a different reason:
the owner's setter owns transforms, and an attribute that truncates silently would be a second mechanism.

**`syncElement` is `BinarySwitch`'s function with two problems `BinarySwitch` never had.** Same premise —
the browser mutates `value` before `input` fires — except on every keystroke rather than a rejected
toggle.

- **Assigning `value` collapses the caret to the end.** The sync captures `selectionStart` /
  `selectionEnd`, writes only when `element.value` actually differs, and restores; the accepted path
  therefore never touches the selection. The `null` guard is load-bearing: `type="email"` and
  `type="url"` do not support the selection API, so the properties read `null` and `setSelectionRange`
  would throw. Truncation needs no special case — `setSelectionRange` clamps.
- **Writing mid-composition destroys it.** An `isComposing` signal gates both the sync and the report,
  and `compositionend` reports and re-syncs. Chrome and Firefox fire `input` after `compositionend` while
  Safari has historically fired it before; running the report from both is idempotent.

Both are read inside the render effect, so ending a composition re-syncs on its own.

_Corrected after the fact: that re-sync is real, and in the original ordering it destroyed the commit._
`handleCompositionEnd` cleared the composing flag **before** reporting. Clearing it re-runs the render
effect synchronously, `syncElement` finds `element.value` holding the text the IME just committed and
`getValue()` holding the pre-composition state, and writes the stale state over it — after which
`reportValue` reads the clobbered element and reports the old string. Composing `にほ` into `Ada` and
committing `日本` left both DOM and state at `Ada`. The report now runs first and the flag flips after, so
the re-sync finds nothing to write; a refusing or transforming owner still gets its correction one step
later. Found by the first run of the interaction suite, which is the whole argument for having one — the
ordering reads as correct and nothing about it is visible in markup.

**Transforms compose through `onInput`, not through a derived signal.** `TextInput` writes `value`
with the raw value then calls `onInput`, exactly as `Checkbox` writes `checked` before reporting, so
a consumer wanting upper-casing or digits-only writes the signal a second time from `onInput` and the sync
corrects the DOM. Handing `TextInput` a hand-built `[getter, transformingSetter]` pair was abandoned:
Solid's `Setter<T>` is an overloaded type a plain `(value: string) => void` cannot satisfy, so it needs a
cast at every call site to express what the sanctioned path already does.

**`isEmpty` and `isReadOnly` join the flags, now a trend rather than an exception.** Both follow
`checkedState`: added to `ExternalInteractionFlags`, exposed as `getIsEmpty` / `getIsReadOnly`, and
`getIsEmpty` `Omit`ted from `TextInputProps` because the component owns the value. `getIsReadOnly` stays
public. The painter does **not** receive the value: the input already renders it, and a painter drawing it
too would double it. `isEmpty` is the summary driving placeholder and floating-label paint, nothing more.
The cost is in `backlog.md` — `ExternalInteractionFlags` is on its way to being the union of every
control's private state.

**`number` is a type, not a component.** _Corrected after the fact: this originally argued for a separate
`NumberInput`, because writing `String(state)` back on every keystroke makes `"1."`, `"-"` and `"1e"`
untypeable and `setSelectionRange` throws on `type="number"`. Both claims are true, and neither was a
reason for a component._ The argument rested on an unstated assumption: that a number field means
`value: Signal<number | undefined>`. It does not. **The DOM's value is a string for every input
type**, and with `Signal<string>` the round-trip never happens — `syncElement` compares strings, finds
them equal, writes nothing. The `setSelectionRange` hazard was already handled by the `null` guard written
for `email` and `url`.

So `"number"` is a member of `TextInputType`, and it needed three behavioral attributes (`getMin` /
`getMax` / `getStep`, driving arrow-key stepping) and one CSS rule suppressing the spin buttons, which are
UA paint. Consumers who want a number derive it from the string.

This generalizes: **an HTML input type is not a reason for a component.** `Toggle` was not one because its
difference was paint; `number` is not one because its difference is an attribute. What earns a component
is behavior the shell has to own — which `RadioGroup` had and neither of these did.

**One caveat `type="number"` carries and the library cannot repair.** During bad input — a lone `"e"`,
`"-"`, `"1e"` mid-typing — the HTML value sanitisation algorithm makes `element.value` return `""` while
the field still shows the characters. State and screen diverge, nothing in the DOM exposes the visible
string, and `syncElement` sees two empty strings and correctly does nothing. The visible symptom is
`isEmpty` reporting true with text on screen, so a `renderPlaceholder` overlay draws over it.
`type="text"` with `getInputMode={() => "decimal"}` avoids it and is better wherever the placeholder or an
exact value matters.

**Password is not a component.** Its only distinguishing behavior is revealing, which is `getType`
flipping between `"password"` and `"text"` over a signal the consumer owns — the audit's "`Toggle` needs
no new library code" result again. The Playground demonstrates it with a `Toggle` beside the field.

**`LabelUtils.resolveAriaLabel` was extracted rather than copied.** The context read, the suppression and
the warning lived inline in `BinarySwitchElement` and are needed identically here — the
`computeIsReachable` situation, so it moved to `Label.utils.ts` under the same namespace idiom, and the
warning lost its `BinarySwitch:` prefix.

**The shared composite this section predicted is `TextField`** (below). Everything settled here still
holds, one file down, and `TextInput` is a dozen lines on top of it.

### Controls: `TextInput`'s suggestions, and why they sit on `TextInput` rather than `TextField`

Built from the survey's verdict: autocomplete that accepts free text, as props on `TextInput` over the exported
list, in a `Popover`, with the combobox wiring `Select`'s field already has. The value stays a string.

**The props are on `TextInput` only, and `TextField` gained one hidden pass-through.** A combobox is a single-line
field. ARIA in HTML allows a `textarea` no role other than its own, and in a textarea the vertical arrows move
between lines, which is exactly the keyboard a combobox needs. So `TextArea` must not inherit the props.
`TextField` still owns the element, so it takes `ariaAttributes`, written after its own attributes, and
`TextFieldPresetProps` omits it, as it already omits `onKeyDown` and `onBlur`. `TextInput` builds the cursor and
the popover and passes the keyboard handler and the combobox attributes down through those.

**The suggestion props are a union, because the list's name is required.** A listbox has to be named, so
`suggestionsAriaLabel` is required whenever `suggestions` is present, and so are `renderSuggestion` and
`renderSuggestionPopup`, since a list with no painter shows nothing. The union's other branch spells each prop as
`undefined`, so passing `suggestions` alone does not typecheck. `TextInput` became generic, `<T = string>`,
because a suggestion is a record as often as it is a string.

**The field's attributes are `Select`'s:** `role="combobox"`, `aria-haspopup="listbox"`,
`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` while open, and `aria-activedescendant`.
`autocomplete` defaults to `off` while suggestions are present, so the browser's own autofill list does not open
on top of ours; a consumer's `autoComplete` still wins.

**Nothing is highlighted until the reader moves into the list, which is the whole difference from `Select`'s
autocomplete.** The cursor takes `isHighlightExplicit` for this: no fallback to the picked option or to the first
one. So Enter on typed text leaves the text alone: the event passes through and the list closes. Enter with a
suggestion highlighted writes that suggestion's text and closes the list. A closed list's first arrow opens it
and lands on the first suggestion, or on the last for the up arrow. Space types, and Home and End move the caret,
because the cursor treats the field as filterable.

**The value is never cleared or restored by the list.** Escape and focus leaving close the popup through
`Popover`'s dismiss layer, and the text stays as typed. A pick writes into `value` and calls `onInput`, then
`onSuggestionPick`. The text written is `computeCustomSuggestionText(suggestion)` when given, named after
`Select`'s `computeCustomText`; otherwise it is the option's text as a screen reader reads it, taken from the
element the library owns, which is the typeahead decision applied to the value.

**The list is open only while the reader wants it and there is something in it.** Typing and the arrows ask for
it; a pick, Escape, Tab and leaving the field withdraw the request. While the consumer's filter returns nothing,
the popup stays shut and `aria-expanded` says so, and it reappears when the list refills. A disabled or read-only
field never opens it. No suggestion is ever `isSelected`: the value is text, not a pick, so every option carries
`aria-selected="false"`, and the highlight is announced through the field's `aria-activedescendant`.

### `TextInput`'s Docs page: states as knobs, one section per use

The user chose to rework the Input folder one page at a time, Solid only, pausing after each — token cost is a concern
on their account, and the ports are left to a later session. TextInput came first since half the folder sits on it.
Its thirteen examples became Basic plus nine sections, following Button's Docs page: the four examples that were one
state each (read-only, disabled, disabled and reachable, error) became knobs — Read-only, Error and Disabled on
Basic, Disabled last; Reachable when disabled and Disabled on a Tooltip section, as on Button. The rest are one
section each: rewriting what is typed, refusing it, leading and trailing content, passwords, numbers, suggestions,
the tooltip, naming by a Label, and editing in place last, since it is a composition rather than a use of a prop.
Every example holds its own state; there are no readouts.

**`onInput` does not replace the write.** The field writes what was typed into its value, then runs `onInput`; what
`onInput` writes back wins, which is how both the rewriting and the refusing example work. The section text says so,
and a type of number points at `NumberInput` for stepper buttons rather than at the trailing slot.
