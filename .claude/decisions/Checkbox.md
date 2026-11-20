# Decisions: `Checkbox`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Checkbox and Toggle draw their own text, as Radio does

The user's call, for consistency: Radio's painter drew the option's words beside the radio and Checkbox's and Toggle's
drew only the box, which is why their Docs pages each needed a "Named by a Label" section. Now `PageCheckboxContent`
and `PageToggleContent` take children and lay them out as `PageRadioContent` does — a row of the box (or track) and the
text, with hover and disabled dimming the whole row — every Checkbox and Toggle Docs example passes its `ariaLabel`'s
words as that text (so the name contains the visible label, WCAG 2.5.3), and the two "Named by a Label" sections went.
Painters used inside a `Label` elsewhere pass no children and look as before.

**All three painters are `aria-hidden="true"` at the root**, per _"Painted text is `aria-hidden`"_ in the controls
rules: the native input carries the name, and Radio's visible text was being read a second time in browse mode.

**The toggle's handle follows the reading direction** — Claude's call, reported to the user as reversible: an "on"
switch's handle sits at the end of the text's direction, so in right-to-left text it slides left, next to its words.
It moves by `inset-inline-start` rather than a transform, since a transform cannot flip with the direction. Material's
bidirectionality guidance mirrors progress the same way ("A progress bar shows 0% on the right, and 100% on the left").

**A Docs page shows a right-to-left example unless nothing changes** — the user's rule, CSS included: if the
component's look or behavior differs in right-to-left text in any way, by its own code or by the browser's, the page
shows it. Where nothing changes, that is not the end of it but a question to raise — should something change, is the
library blind there? — since the text fields' slots and Checkbox's and Toggle's text were both found exactly that way,
while writing their Docs pages. A component with nothing direction-dependent about it, such as `Button`, needs neither.
