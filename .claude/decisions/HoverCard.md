# Decisions: `HoverCard`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `HoverCard` as a preset over the hover engine and `Popover`

`Drawer` over `Modal` is the shape: a thin component that narrows a vocabulary and adds the behavior the base
cannot express. What `HoverCard` adds to `Popover` is how it opens and closes.

**It is a `dialog`, not a `tooltip`, and it describes nothing.** A card may hold links and controls, and
`role="tooltip"` may not. So the panel is a portalled `Popover` with `role="dialog"`, on the dismiss layer, with a
z-index one above its anchor. It writes no `aria-describedby`: a description is read out whole, and a card is
somewhere to go. Its name is `ModalNameProps`, reused as is, so one of `ariaLabel` or `ariaLabelledBy` is
required, as for any dialog. Nothing is written onto the anchor at all.

**It opens three ways.** A mouse resting on the anchor, through the engine. A keyboard focus on the anchor, after
`focusShowDelayMs`; a focus from a mouse press does not count. A press where there is no hover: on touch a tap
opens and closes it, which makes it a plain popover there, and is why the anchor should be a button, since a
link's press would also be followed.

**Tab is the key into it.** The card is portalled to the end of the document, so the next Tab after the anchor
would otherwise land somewhere else entirely. While the card is open, Tab from the anchor moves into it,
Shift+Tab from its first item goes back to the anchor, and Tab past its last item goes to whatever follows the
anchor on the page. Kobalte's and Radix's hover cards document themselves as mouse-only and answer no key at
all, so there was no reference to match; the focus route here is a deliberate step past them, because a card that
holds a control has to be reachable by keyboard (WCAG 2.1.1) or the control might as well not be there.

**How it closes.** It stays open while focus is inside it, or while the anchor has keyboard focus, so a pointer
leaving then closes nothing. It closes when both the pointer and focus have left; a focus leaving the layer
while the pointer is still over the card is ignored. A press outside closes it. Escape closes it and, when focus
was inside the card, puts focus back on the anchor, marked as a focus restore so the anchor's own focus path
does not reopen the card. While it fades out the `Popover` is `inert`, so unlike a tooltip a closing card cannot
be caught by a pointer arriving during the fade.

**The navigation example does not leave one-open-at-a-time to the dismiss layer alone.** A flyout opened by a
press holds focus and stays open; hovering another flyout's trigger never passes through the dismiss layer, so
both would be open. The example keeps one shared "which is open" key, and the dismiss layer still handles a press
outside, focus leaving and Escape.
