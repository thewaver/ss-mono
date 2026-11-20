# Decisions: `TagInput`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `TagInput`, and why it is not a `TextField` preset

A field whose value is a list: type a word, press Enter, it becomes a tag beside the
caret.

**It owns its own box rather than sitting in `TextField`'s leading slot, and that was the whole decision.**
The cheap route was a preset like `NumberInput` with tags in `renderLeading`. That slot is absolutely
positioned and the input's left padding inset by its measured width — right for a currency symbol, wrong for
a list: the moment tags wrap onto a second row, an out-of-flow strip and one inset number cannot describe the
layout. Widening `TextField` to make its slot optionally in-flow was the third option, rejected on ownership:
`TextField` is a single-line field with decorations at its edges, and a tag input is a box of controls that
happens to contain a field. Bending the first into the second costs four shipped presets a concept they do
not need.

**Twelve tags in a 240px box wrap, and the box grows — settled by the user.** Nothing clips,
nothing scrolls sideways, no cap. Stated rather than hidden: the control's height is a function of its value,
so a form reflows as tags are added. That is what every published tag input does, and the alternatives were
deferred rather than missed — a `maxRows`-style cap, a single scrolling line over `Scroller`, and a "+10
more" collapse are all additions on top of wrapping. `tagInput.spec.ts` pins the growth.

**Backspace on an empty field steps into the tags rather than deleting one.** First press moves focus onto
the last tag, a second removes it. Deleting outright changes the value with nothing focused to announce it,
which is silent for a screen reader and invisible to anyone who mis-hit the key. `ArrowLeft` does the same
step, arrows walk the tags, walking past the last returns to the field. Backspace only leaves the field when
the field is empty, or it would swallow ordinary editing.

**The tag is a `<button>` whose accessible name is the tag text, and pressing it removes it.** No separate
delete trigger; a consumer painting an `✕` is painting decoration on a control that is already the remove
control. The name defaults to the tag's own text rather than "Remove X", because a library that paints
nothing has no business shipping an English sentence — `computeTagAriaLabel` is where a consumer supplies
wording.

**Tags are `string[]`, not `T[]`.** Every other list control here is generic; a tag genuinely is the text
that was typed, with no identity apart from its characters. A consumer needing records keeps a map beside it.
`computeTag` is where text becomes the stored form — trimming, casing, refusing a duplicate — and returning
nothing declines a word, leaving the text in the field to be edited rather than retyped.

**The draft text is private unless asked for**: `text` is optional through
`SignalMirrorSolidUtils.createOptional`, the arrangement the popups use for their open state.

**Owning the box means owning the pointer back, which the first build did not.** Fixed afterwards.
`interactionRoot` sets `pointer-events: none` and each part turns it back on for itself (`buttonElement` does,
`textFieldElement` does); `tagInputField` did
not, so the field could not be clicked, focused or typed into and the control read as a box of tags with no
text entry. Every spec passed throughout, because they wrote the field's value with `fill()`; the click path is
now asserted. The root
turns pointer events on too, with `cursor: text` and a `pointerdown` that focuses the field when the press
landed on the root itself, so the padding around the tags behaves like the padding of any text box.

**A control that owns its box must be positioned, or the painter paints over it.** Fixed, and
the more general of the two. `renderContent` draws an opaque box at `position: absolute; inset: 0`, and CSS
paints positioned elements _after_ ordinary in-flow content regardless of document order — so the painter's
background covered the field's text. The value was in the DOM, the caret was in the field, the click worked,
and the box looked empty. The tags escaped only by accident, each sitting in an `InteractionWrapper` whose
root is `position: relative`; `TextField` escapes it deliberately, its element being absolute too.

So: **anything the painter is meant to sit behind has to be positioned.** `tagInputRoot` is now
`position: relative`. This is the trap for every future control rendering in-flow content next to
`renderContent` — the symptom is content that is simply not there, and nothing in the markup or the flags
hints at it.

**The field is a row of its own beneath the tags.** Settled by the user, and recorded
because the first build arrived there by accident and the second "fixed" it. An `<input>`'s intrinsic width
is around 177px (the default `size`), and `flex-basis: auto` takes that as its starting size, so it happened
not to fit beside the tags and wrapped. That looked like a stray empty row and was changed to a 60px basis.
The user asked for the full row and is right about the shape: chips in front of a caret read as a search box
that has already matched something, while a block of tags with an empty line under it reads as a list and a
place to add to it. It is now `flex: 1 0 100%` — a 100% basis cannot share a line, so the break is declared
rather than incidental.

**The caret is the painter's, through `computeTextStyle`.** `TagInput` had no way to reach the
input's text, so the caret fell back to the inherited color while every other field drew the theme's. The
slot is `TextField`'s, reused with the same name and `TextFieldTextStyle` type — the `TabLinkProps`
precedent: a second identical type for the second caller is the thing to avoid.

**A printable key on a focused tag returns to the field.** `handleTagKeyDown` answered
only Backspace, Delete and the arrows, so a letter pressed on a tag went nowhere. Focus now moves back to the
field and the keystroke lands there. Deliberately not `preventDefault`ed: the character is inserted by the
default action, after the handler has moved focus.

**Disabled has to close the write paths, not only announce itself.** Same fix. The field carried
`aria-disabled` and nothing else, so a disabled tag input could still be typed into and Enter still added
tags. It now takes `readOnly` the way `TextField` does — never native `disabled` — and both key handlers
return early. `userSelect: text` was missing for the same reason as `pointer-events`.

**Not built:** a cap or a collapse; editing a tag in place; pasting a delimited list as several tags; a drag
to reorder.

**The field keeps the browser's focus ring, as `TextField`'s does.** The field's stylesheet used to switch its
`outline` off on focus, so a consumer whose painter drew no ring of its own had a field with no visible focus —
WCAG 2.4.7, "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is
visible", and failure F78, styling the outline away with nothing in its place. The reason for the override was
recorded nowhere, and the controls rule says the outline is deliberately left because it is the ring. Removed;
the Playground's painter rings each tag, never the field, so the field's ring is the only one around it.
