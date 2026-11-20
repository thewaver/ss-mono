# Decisions: `PopupTrigger`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The pickers own their trigger, and `PopupTrigger` is the leaf they share

Settled by the user, on a defect with an awkward cause: a `TimePicker` inside another popover-driven layer
dismissed that outer layer when you pressed an hour. The dismisser walks up from the pressed element and
follows `aria-controls` to jump from a portalled popup back to whatever owns it — and nothing wrote that
attribute, because the trigger was painted entirely by the consumer and `Button` has no way to carry an
arbitrary ARIA attribute.

**The answer was not to let the consumer write it but to let the library own the element.** The user's words:
we already use and abuse wrappers, and the thing that matters is that the aesthetics do not become limited.
That holds by construction — the trigger is an `InteractionWrapper` around a leaf whose class is a pure reset,
so every pixel still comes from the consumer's `renderTrigger`, and the flags, the decoration slot, the tooltip
and the disabled machinery all come with the wrapper.

**`Primitives/PopupTrigger` is the shared leaf**, because three pickers needed the same button and a shared
body belongs in `Primitives` beside `InteractionWrapper` and `TextField`. It carries `aria-haspopup`,
`aria-expanded` and `aria-controls`, and the last is written only while the popup is open.

**`renderTrigger` narrowed from painting the control to painting its content**, on `DatePicker`,
`DateRangePicker` and `TimePicker`. What is genuinely given up is structural rather than aesthetic: a consumer
could previously return anything at all — a link, two controls — and now gets one button-shaped control whose
paint is entirely theirs.

**Two things the decision did not foresee, both found while building.** `TimePicker`'s trailing slot carries
**two** controls on a twelve-hour field, the meridiem toggle as well as the trigger — so `renderTrailing`
survives for the rest and sits beside the owned trigger rather than being replaced by it. And the trigger
needed a `triggerId`, because the element the specs reach for by `#key` is the library's now rather than the
consumer's.
