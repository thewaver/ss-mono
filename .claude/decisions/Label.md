# Decisions: `Label`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Label`

Settled, closing the gap the audit recorded.

**It wraps, and it can point, as a native label does.** `Label` renders a `<label>` around both caption and
control, so association is implicit by default and no `id` has to be threaded. The first build stopped there,
rejecting `for` as a second thing to keep unique; an outside review then found what wrapping alone cannot do. A
wrapping label names the _first_ control inside it, and `TagInput` draws its remove buttons before its text box, so
the caption named a button, the text box had no name, and a click on the caption deleted a tag (WCAG 1.3.1, 2.5.3,
4.1.2). The user's call: allow both, the native way. So `Label` takes `for`, the native name, and otherwise asks the
control: the context carries `setControlId`, and a control whose real element is not its first registers that
element's id through `registerControlId` (`useControlId` in React and Vue) — `TagInput` registers its text box,
inventing an id when the consumer gave none. The consumer's `for` wins over the control's, the control's over
plain wrapping. A nested `Label` draws a `<div>` and passes a registration up to the outer one.

**It paints nothing, including the cursor.** Geometry only: `display: flex`, `width: fit-content`,
`getDir`, `getGap`. Cursor was left out deliberately: a `<label>` cannot know whether the control inside
is disabled, so a blanket `cursor: pointer` would lie, and taking `getIsDisabled` would duplicate state
the control owns. The caption is the consumer's child, so the cursor is theirs; the Playground sets it in
`pageStyles.labelCaption`.

**`aria-label` loses to a visible caption.** `Label` publishes a context and `BinarySwitch` reads it:
inside a `Label`, `getAriaLabel` is suppressed and a warning fires. Not a preference — `aria-label`
overrides the label's text as the accessible name, so a control carrying both is announced as something
other than what can be read, which is WCAG's _Label in Name_ failure. Suppressing rather than merging
keeps one visible source of truth; warning rather than failing silently is the house pattern.

That context is the audit's `LabelContext` idea put to better use, and it also does the original's job: a
`Label` nested inside a `Label` renders a `<div>`, since nested `<label>` is invalid and its activation
target ambiguous.

**A group caption is not a `Label`.** `RadioGroup` takes `getAriaLabel` and puts it on the
`role="radiogroup"` element. Wrapping a group in a `<label>` would claim one control is being named, and
would make a caption click activate an arbitrary member.
