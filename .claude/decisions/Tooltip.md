# Decisions: `Tooltip`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A tooltip can be hovered, and the offset it is held clear by is bridged rather than left as dead space

Success criterion 1.4.13 asks that content revealed on hover can itself be hovered, so that somebody reading
at magnification or with an unsteady hand can bring the pointer onto it. `Tooltip` failed that by what it
did: the root was `pointer-events: none`, and any `mouseleave` on the anchor hid it outright, so the pointer
could never arrive. The Playground made this the main way it explains itself, which is what brought it up.

**Three things had to change, and each is load-bearing on its own.**

**The root takes pointer events while it is shown.** `pointer-events` is `none` in the class and overridden
inline to `auto` while `getShouldShow()`, so the closing fade is click-through — the same split the popup
already uses, and for the same reason. The cost is real and accepted: a shown tooltip now swallows clicks
on whatever it covers, which is inherent, because nothing can be both hoverable and click-through.

**The offset is bridged by a `::before` on the root.** An offset holds the tooltip clear of its anchor, and
that gap is dead space: a pointer crossing it is over neither, so the tooltip is withdrawn before it can be
reached. The pseudo-element extends the root's hit region back across the gap, on the one side facing the
anchor — `AnchorUtils.getHBandKind` / `getVBandKind` already say which side that is, and an `in` or `center`
placement overlaps its anchor and gets no bridge at all. It is absolutely positioned, so it changes neither
the measured `offsetWidth` the placement math reads nor anything painted, and a negative offset clamps to
zero rather than eating into the tooltip.

**The bridge sits beneath the content, at `z-index: -1` inside a root that is `isolation: isolate`.** It spans
the whole root plus the gap. `HoverCard`'s panel had the same bridge without the index, and a plain `<a>` in the
profile card could not be clicked: the pseudo-element took the press. The `Follow` button beside it worked only
because `InteractionWrapper`'s root is positioned and comes later in the tree, and the navigation flyout only
because its surface carries a `transform`. `Tooltip`, `HoverCard` and the Playground's flyout all take it.

**Leaving is judged by where the pointer is going, not by a timer.** `mouseleave` carries `relatedTarget`,
so the anchor ignores a leave into the tooltip and the tooltip ignores a leave into the anchor. A grace
delay would have done the same job and was rejected: it is a tuned constant standing in for something the
event already states exactly, and it would have to be longer than any hand is slow.

**The other half of the criterion is Dismissible, and `Tooltip` joined the layer stack for it.** `Escape`
was bound to the anchor's own `keydown`, so it only ever arrived while the anchor had focus — a reader using
a pointer alone, which is exactly who the hoverable half was fixed for, had no way to put a tooltip away
except by moving off it, and moving off it is the mechanism the criterion excludes. `Tooltip` now registers
with `DismisserUtils.createLayer` like `Popover` and `Modal`, so the document-level handler reaches it from
wherever focus happens to be, and its own `keydown` wiring is gone: there is one Escape path, not two.

**It registers on `getShouldShow` rather than on visibility**, so a dismissed tooltip leaves the stack at
once and a second `Escape` reaches the layer beneath instead of being eaten by one that is still fading.

**A showing tooltip now outranks an open dialog for `Escape`, and that is the intent rather than a cost.**
The stack unwinds topmost-first one press at a time, which is what the criterion asks for; the whole suite
was run against it precisely because sixteen spec files press `Escape`, and none of them changed.

**What it did not take from `Dismisser` is blur.** `handleBlur` stays, because the shared `focusout` handler
tests the element receiving focus and gives up when there is none — focus leaving for the document body or
another window would otherwise leave a tooltip standing. The press-outside and focus-out paths it did take
are near no-ops for a tooltip, since a pointer that presses elsewhere has already left the anchor.

### A control's hovered item stays hovered while the pointer is on that item's tooltip

`Tree` and `Listbox` mark the hovered item — the highlight floater follows it — and clear the mark on the
container's `pointerleave`. An item's tooltip is portalled out of the container, so the pointer crossing from the
item onto its tooltip was a leave: the Playground's left menu dropped its hover track while the preview for that
very row was still up, leaving an open tooltip pointing at a row that no longer looked hovered. The tooltip
already treats anchor and panel as one hover region (above); the control now does the same.

**The tooltip is recognised through `aria-describedby`, not through a flag threaded up from `Tooltip`.**
`TooltipUtils.findDescribingTooltip` takes the leave's `relatedTarget` and accepts it only if it sits inside a
`role="tooltip"` whose id the hovered item is described by right now. `describe` sets that id only while the
tooltip is showing for that anchor, so a tooltip still waiting out its delay, fading out, or showing for another
item does not count. It needs no wiring through `InteractionWrapper` or `SharedTooltip`, works whether the tooltip
is shared or per-item, and is the same in every framework because it reads the page rather than any component's
state.

**The hold ends on the first `pointerover` outside the tooltip**, via a document listener from
`TooltipUtils.observePointerExit`. Landing back inside the control only ends the hold — the control's own
`pointerover` has already set the new item, and clearing here would race it, since both listen at the document
in Solid. Landing anywhere else clears the mark. A tooltip dismissed with Escape under a resting pointer is
noticed on the next move, which was judged not worth a mutation observer.

`TooltipSolidUtils.createHoverHold` packages the pair as the handler for the container's `pointerleave`.

**A tooltip the item draws itself also sends the crossing as a `pointerover`.** It is portalled from inside the
control, and both Solid and React pass delegated events up through a portal to where it was declared, so the
pointer arriving on it reaches the control's own `pointerover` as a hover on no item and cleared the mark before the
hold could matter. The hold therefore also answers `getIsOnTooltip`, and `Tree` and `Listbox` skip their
`pointerover` handling for a target inside the hovered item's showing tooltip. The React port found it; the left
menu never showed it, because its preview is a `SharedTooltip` declared outside the tree. Vue's `Teleport` and
Svelte's portal pass nothing up, so neither needs the check, though it costs them nothing.
`Tabs` and `RadioGroup` also clear on leave but take no per-item tooltips, so they do not use it; `Menu` never
clears on leave and has nothing to fix.

### `Tooltip`: a hover waits, and a shared window lets the next one skip the wait

**A hover waits `hoverShowDelayMs` (700) before showing, as focus waits `focusShowDelayMs`.** Without it, sweeping
across a row of icon buttons flashed one tooltip per button. Leaving before the delay shows nothing. The leave path
is untouched: it still reads where the pointer is going rather than using a timer, and a pointer arriving on the
tooltip itself shows it at once, so the bridge still works during a fade.

**The skip window is one module-level timestamp shared by every tooltip.** When a tooltip that was actually showing
closes, it records the time; a hover within `skipDelayWindowMs` (300) of that shows at once. Only a real close
refreshes the window, so a fast sweep across controls that never opened anything keeps every one of them waiting.
Both numbers start from the Radix pair and are the user's to tune; they live in `TOOLTIP_DEFAULTS` and nowhere else.

**Focus uses the window too: only opening waits.** The user's rule, stated when the nav's previews were made to
share one tooltip: delays are skipped for moving between items, and only the first opening has one. Focus first
ignored the window, so arrowing from one control to the next hid the tooltip on the blur and made the next wait out
`focusShowDelayMs` again. The blur still closes it and still records the close, so the focus that follows lands
inside the window and shows at once — which is what lets a shared tooltip glide under the keyboard as it does under
the pointer. A plain row of separate tooltips gets the same: tabbing on from one that is showing opens the next at
once.

**One timer serves both ways in, and a mouse focus no longer cancels a pending hover.** Focus clears the pending
timer only when it is about to start its own, a `:focus-visible` focus. Otherwise clicking a button within the hover
delay would have canceled the tooltip for as long as the pointer stayed on the button. Playground demos that a spec
hovers set `hoverShowDelayMs` to 0.

**The Playground's tooltips wait less than the library's default.** The user found the default far too long for a tooltip that is the only label
an icon-only button or a "?" mark has, and chose to set the Playground's own tooltips from one constant,
`TOOLTIP_HOVER_DELAY_MS`, rather than change the library's default; the Tooltip page's knob starts there too. The
default is still open to revisiting on the same argument.

### `Tooltip`: handed a new anchor while showing, it glides there

Asked for by the user with React Bits' shared tooltip: one tooltip whose anchor is whichever control in a row is
hovered or focused, gliding from one to the next instead of hiding and reappearing. **The hover engine already kept
it up across the change** — leaving one control and entering the next inside the same tooltip lands in the skip
window, so it never faded — but the position jumped. So a change of anchor while the tooltip is visible now turns on a
`transform` transition (`TooltipUtils.getGlideTransition`) for one fade duration, and nothing else that moves it — a
scroll, a resize — is eased. The description moves with it for free, since `aria-describedby` already follows the
anchor through `TooltipUtils.describe`. **The glide ends when the tooltip unmounts.** A new anchor arriving
during the fade out turned the glide on; if the fade then finished and the tooltip reopened inside the glide's
window, the fresh root started at the `translate(0, 0)` it carries before it has a position and slid in from the
screen's corner. The left nav did this when scrolled fast. The Toolbar page's shared-tooltip example first picked the anchor itself, from
the row's `pointerover` and `focusin`; it now gives each action its own tooltip and wraps the bar in `SharedTooltip`.

**A Toolbar action carries a tooltip, as a Tree node or a Menu item does.** The core type is
`ToolbarActionRecord<T, TTooltipDefs>` and each framework's `ToolbarAction` fills the tooltip type in. A collapsed
action takes its tooltip into the overflow menu, where the menu item shows the same one. A menubar's word takes none
(`ToolbarActionRecord<T, never>`): it is a `Menu` trigger, which has no tooltip to hand it to.

**An anchor handed over while it holds keyboard focus counts as the focus arriving**, as one handed over under the
pointer already counted as the pointer arriving. A consumer picking the anchor in `focusin` does so after the
element's own `focus` has fired, so the tooltip, which only starts listening once handed the element, never heard
it: a shared tooltip never opened from the keyboard. `HoverIntentUtils.create`'s `observeAnchor` now checks for focus
the way it checks `:hover`.

### `Tooltip`: showing it drops a placeholder where it sits, and that is left as it is

**When a Tooltip shows, its `Show` puts the `Portal`'s placeholder node into the spot the Tooltip occupies.**
While hidden it leaves nothing there. In a run of siblings that Solid renders as one list — a passage of
`RichText`, say — that new node makes Solid reconcile the list, and elements after it can be taken out and put
back. An element taken out loses keyboard focus, so a tooltip shown on focus can knock focus off a later element
in the same run. The Playground's glossary example hit exactly this, on its second term.

**The library is not changed, and that is the user's call.** Keeping the `Portal` mounted and switching its
content inside would make the spot never change, at the price of one empty container per Tooltip left in the
floating layer. The user judged that a smell: a page full of permanently present empty nodes is the kind of
thing that makes extensions like ad blockers, which scan the document, slow a page down. So the answer is at the
consumer: **wrap the anchor and its Tooltip in one element**, which keeps the placeholder inside that element
where reconciling it cannot move anything else. The glossary example does that. Popover and HoverCard share the
shape and the same advice holds for them.
