# Decisions: `SharedTooltip`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SharedTooltip`: the controls inside it share one tooltip

Asked for by the user for the Playground's nav previews, and at library level rather than as the Toolbar example's
consumer wiring. **It is a wrapper, not an option on each collection.** Every control in the library that takes a
tooltip does so through `InteractionWrapper`'s `tooltipDefs`, so a context read there reaches `Tree`, `Menu`,
`Listbox`, `Sortable`, `SortableGrid` and `Stepper` at once, where a prop would have been added to each of them in
four frameworks. Inside a `SharedTooltip`, a wrapper with `tooltipDefs` draws no `Tooltip` of its own: on its
element's `mouseenter` or `focus` it hands over its element and its tooltip props, and the one `Tooltip` the
wrapper draws takes them — placement, offset, delays and content all come from the control it is on, so nothing
about the tooltip is configured twice. A control with no `tooltipDefs` hands nothing over and is a gap.

**The content is rebuilt per control, the box is not.** The body is drawn from the current control's own
`renderContent`, keyed on the hand-over, so each control's flags and content are its own; the positioned box
around it stays, which is what glides. A control handing over again while it is already the anchor changes
nothing, so re-entering it does not rebuild its content.

**A control that goes away while it is the anchor takes the tooltip with it**, with no fade, since there is
nothing left to point at.

**A control that stays but loses its `tooltipDefs` fades its tooltip out instead**, the user's call, found when
the left nav stopped previewing the open page and a clicked row's preview blinked out. `Tooltip` closes whenever
its `anchorRef` is `undefined`; `SharedTooltip` and `InteractionWrapper` both keep drawing the last props they
were given and hand the `Tooltip` no anchor while the control has none, so the box stays where it was and plays
its ordinary fade. **Svelte needed two more things.** Its wrapper draws the body from a snippet, which read the
control's live `tooltipDefs` and so went empty the moment they were withdrawn, leaving the fade nothing to fade: the
snippet now draws from the last defs it was given (`shownTooltipDefs`). And the Svelte `Tree` re-runs a row's
attachment whenever the row's record is replaced, which detaches and re-attaches the same element; the wrapper's
hand-over effect read that as the control going away and released the shared tooltip. It now follows
`claimTarget`, a `$derived` of the element, so a re-attach of the same element changes nothing.

**React's context has a third function, `update`.** Solid's shared tooltip reads the claiming control's props
live; React's would hold the props as they were at the claim, so after each render a control calls `update`, which
only takes effect while that control holds the tooltip. React and Vue re-mount the content per claim with a fragment
keyed on a counter that goes up on every new claim, Svelte with `{#key}`.

**The scope is everything inside, through portals too.** A context follows the component tree, so a menu opened
from inside a `SharedTooltip` shares the same tooltip. That has not been argued; it is what the mechanism does.

**The reveal is the drawing's, and the Tooltip page now offers six.** From Codrops' image reveal effects, which the
user judged covered already: `Tooltip` hands its drawing whether it is showing and for how long the change takes, so
a fade, a zoom, a slide, a wipe, an unblur or a flip down are classes on the Playground's own tooltip painter, chosen
by a `reveal` knob. Nothing changed in the library for it.
