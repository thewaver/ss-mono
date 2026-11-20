# Decisions: `FormSection`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `FormSection`: the collecting stops at the nearest one

The last piece of the form story. `Form` collected every field on the page and there was no way to
say that a run of fields belongs together, which left two things with nowhere to go: a heading over a group,
and a rule that is true of a group rather than of any one field in it.

**A section provides a `FormContext` of its own and registers itself with the one outside it.** That is the
whole implementation, and it is why neither `Form` nor `FormField` changed by a line. A field registers with
the nearest collector — its section if it is inside one, the form otherwise — and a section reports one
verdict upward to whatever is collecting above it. Sections nest for free by the same rule, and nothing is
counted twice, because a field is only ever heard by one collector.

**What a section reports is `!isValid`, and `isValid` is its own rule plus every entry inside it.** The own
rule is `hasError`, set by the owner exactly as it is on `FormField` — validation is still not the library's.
This is the half that could not be expressed before: "these two passwords do not match" is answerable from
neither field alone, so neither field can carry it, and both are individually fine while the form still has
to refuse.

**`getHasSubmitted` passes straight through from the enclosing form.** A section is not submitted, so it has
no state of its own to report there; a submit button inside a section reads the section's validity and the
form's submitted flag, which is the honest answer to both questions. In practice nothing hits that case,
because `Form` hands its own state to `renderContent` and a submit button reads it from there.

**It renders a real `<fieldset>` and a real `<legend>`, and the legend is the whole naming mechanism.** A
`<fieldset>` is `role="group"` already, so the library adds no role; the legend names the group with no
generated id and no `aria-labelledby`, which is the same argument `FormField` makes about ids — an
accessibility relationship threaded through consumer markup fails silently when a strand is dropped.
`ariaLabel` is there for a section with no visible caption; a legend, when present, is what names it.

**A section cannot mark itself invalid, and that is a fact about ARIA rather than a choice.** `aria-invalid`
is not global: it is supported on `checkbox`, `combobox`, `gridcell`, `listbox`, `radiogroup`, `slider`,
`spinbutton`, `textbox`, `tree` and `application`, and `group` is not among them — which is why `RadioGroup`
may carry it and this may not. So the only route to a section-level rule is the text of it, and the message
is wired both ways: `role="alert"` while the section reports an error, so it is read out when it appears, and
`aria-describedby` on the fieldset, so it is still reachable to someone navigating into the group afterwards.
Without that pair, `hasError` on a section would be a state with no accessible surface at all, which
WCAG 3.3.1 asks for in text.

**The UA paint is stripped, and it is the only element in the library that needs stripping.** A `<fieldset>`
arrives with a border, padding, margin and `min-inline-size: min-content`, none of which the library chose;
`<legend>` arrives with padding. Both are reset with `!important`, for the reason the `TextField` resets carry
it — element-level styling is what every reset stylesheet ships, and a blank slate that loses to an element
selector is broken. The consequence worth stating: the border-with-a-gap-for-the-legend look a fieldset is
known for is the UA's, and it is gone, so a consumer wanting a box paints one inside `renderContent`. A
`<div role="group" aria-labelledby>` was the alternative — it is what `Select` already does for an option
group — and it was not taken, because it buys the same box back at the cost of generating an id and wiring a
label reference that the platform will do for nothing.

**The legend is not a flex item.** A `<fieldset>` with `display: flex` puts its content in an anonymous flex
box and leaves the legend outside it, so `dir` and `gap` lay out the fields and the message while the caption
always sits above them. That differs from `FormField`, where the caption is a flex item and `dir: "row"`
puts it beside the control, and it is the platform's arrangement rather than a decision.
