# Decisions: `TextField`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `TextField` extracted, with `TextInput` and `TextArea` as presets

Settled, on the terms `TextInput` had already written down: a private shared leaf
parameterized by its element, presets that `Omit` what does not apply, in the `BinarySwitch` shape — and
**not** a `"textarea"` member of the type union, which would be a type that silently changes the element.

**Nothing about `TextInput` changed except where it lives.** `Primitives/TextField/` holds the
base; `TextInput` is `<TextField {...props} getElement={() => "input"} />` and `TextArea` the same with
`"textarea"`. The base is absent from `index.ts`; only `TextField.types` ships. The types moved with it
and the old names are gone rather than aliased: `TextFieldFlags`, `TextFieldTextStyle`, `TextFieldType`,
`TextFieldMode`. `Select` imports the text style from the base, and the Playground's painters were renamed
— `PageTextFieldContent` / `PageTextFieldPlaceholder` / `PageTextFieldAdornment` — since one painter now
serves three shells.

`TextSync` widened to `HTMLInputElement | HTMLTextAreaElement`, exported as `TextSyncElement`. Both carry
`value`, `selectionStart`, `selectionEnd` and `setSelectionRange`, so the caret restore is unchanged
rather than branched.

**The element is a `Dynamic`, and that is the whole parameterization.** One attribute list, with the two
element-specific attributes computed: `type` is `undefined` on a textarea, `rows` on an input. This also
tightened `min` / `max` / `step`, now emitted only for `type="number"` — the browser ignores them
elsewhere, but a `type="text"` field carrying them is a lie in the DOM, and `NumberInput` is a
`type="text"` field that owns a range.

**Auto-growing height is opt-in, and the only thing that could not be inherited.** A fixed textarea leaves
the settled arrangement untouched: the painter sizes the box, the element covers it, `rows` is beside the
point. An auto-growing one inverts that — content decides the box — and the resolution keeps the inversion
out of the overlay and puts it on the wrapper. `getIsAutoSizing` turns it on, `getMinRows` (defaulting to the
native `<textarea>`'s) is the floor, `getMaxRows` the optional ceiling.

The measurement mirrors `getMinWidth` one axis over. `InteractionWrapper` gained `getMinHeight`;
`TextField` sets the element's `bottom` to `auto` for one frame, reads `scrollHeight`, restores it, and
clamps against the row floor and ceiling. `scrollHeight` includes the element's padding and the element
has no border, so the number _is_ the root height needed. `bottom` is the only property touched, because
the class already carries `height: auto !important` and an absolutely positioned box with `top`, `bottom`
and `height: auto` takes its height from the insets. Nothing Solid writes as an inline style is disturbed.

**A growing root only moves the painter if the painter lets it.** The root is `display: flex` with
`align-items: stretch`, so a painter declaring no height follows the root. Same limitation `getMinWidth`
records, load-bearing in the other direction: an auto-sizing `TextArea` wants a painter with no height, a
fixed one wants a painter that sets one. The Playground says which through `getIsStretched` / `getHeight`
on its own painter.

Two smaller consequences. **The re-measure listens for width, not height**, because publishing a height
the observer then reads back is a loop; it compares `inlineSize` against the last one and returns early.
And **`overflow-y` is `hidden` while growing uncapped**, so no scrollbar flickers in during the frame
between a keystroke and the new floor, and `auto` otherwise.

**`resize` is `none`, deliberately without `!important`.** A user-dragged element would decouple the
element's box from the painted box. The other resets carry `!important` because a real conflict was
observed; no such selector exists for this property — a bare `textarea { resize }` is weaker than a class
and loses already. Escalating on suspicion is the defensive habit that rule warns against.

### `TextField` takes a mask transform, not a pattern

Changed, when the grouped number became the third consumer.
`computeMaskedText(previous, next, caret)` replaces `getMask`: a pattern mask and a grouped number are the same
function with a different body, and a grouped number has no pattern to state because it has as many separators
as its value needs. The transform stays where `getMask` was — inside `TextSyncUtils.createValueSync` — because _"a
mask owns the caret"_ is unchanged.
