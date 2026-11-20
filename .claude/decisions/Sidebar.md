# Decisions: `Sidebar`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Sidebar`: a panel that grows between two widths and never blocks the page

**It is its own component, not a mode of `Drawer`.** `Drawer` is `Modal` all the way down: it seals the page,
locks scrolling, traps focus and says `aria-modal`. A sidebar that pushes the page aside so the page can keep
being used cannot keep any of that, and one prop switching all of it on and off would leave most of `Drawer`'s
contract hanging on it. The user's call. The name is theirs too, over `NavigationRail`, which says the
contents are navigation, and `SidePanel`, whose "panel" already means `Collapsible`'s opening part.

**It is not built on `Collapsible` either.** A collapsed `Collapsible` is `inert` and the only thing on show is
its trigger; a collapsed sidebar is a strip whose contents stay usable. What the two share is a box changing
size, which is `ElementFader` and a CSS transition, and `Sidebar` uses those directly.

**Push or overlay is a prop, and both are legitimate.** Pushed, the sidebar's own box grows and the content
beside it gives the room up. Overlaid, the box the layout sees stays at the collapsed width and the panel inside
grows over the neighbor from the docked edge, raised one step above whatever stacking it sits in. The edge only
matters to overlay; pushed, the consumer's layout already decides which side it is on.

**Nothing drawn in a `Sidebar` is clipped.** The first build put `overflow: hidden` on the panel, which also
cut off anything painted outside it, so the Playground menu lost its shadow. `overflow-clip-margin` would let a
clip leave room for one, but MDN lists it as limited availability rather than Baseline. So the panel clips
nothing and is always exactly the sidebar's width, and contents laid out at the expanded width clip themselves
inside an outer box that fills the panel — the outer box keeps its shadow because nothing above it clips.

**Both sizes are the consumer's.** Measuring the expanded size from the contents is circular, since the
contents change layout with the size they are given.

**It docks to any of the four edges, and its two sizes are `collapsedSize` and `expandedSize`.** It started with
left and right only, and grew top and bottom for the Playground's build progress strip. The props were
`collapsedWidth` and `expandedWidth`, which would have named a height on a sidebar docked to the top, and
_"A grid index names its space and its axis"_ in `conventions.md` reserves those words for what they say. A second pair,
`collapsedHeight` and `expandedHeight`, was the other way out and was rejected: only one pair means anything for a
given edge, so both would have to be optional, and leaving out the right pair would compile and draw a sidebar of
no size. `Size` here is the length measured out from the docked edge, the way `gutterSize` and `laneSize` already
are a length along whichever axis applies.

**The contents are handed a phase — collapsed, expanding, expanded, collapsing — rather than a visibility
target.** The user asked for it so a collapsed layout and an expanded one can be swapped smoothly: expanding
is when to show the wide layout so the growth uncovers it, collapsed is when to put the narrow one back. It is
read from the intended state and `ElementFader`'s `getHasTransitionFinished`, not from the transition target,
because the fader commits its target a frame late and the target would briefly say the opposite.

**It draws no control; `expanded` is the whole interface.** Expanded is state, so it is a signal, and
anyone holding it can open or close the sidebar from anywhere (_"Playback is a signal; a rewind is a
command"_ in `conventions.md`). The accessibility of the button travels with it: the consumer's button carries
`aria-expanded` and points `aria-controls` at the sidebar's `id`, which is why `id` is a prop.

**Hover is a look, not a decision.** `isExpandedOnHover` goes through `HoverIntentUtils` into a private
signal that is OR-ed with the owner's, so resting the pointer expands it without writing `expanded`: a
sidebar the owner expanded stays expanded when the pointer leaves, and the owner's button keeps reporting
collapsed while it is only being looked at. The hover-expanded state is a dismiss layer, so Escape and a press
elsewhere put it back — WCAG 1.4.13 asks for content that appears on hover to be dismissable without moving the
pointer. The owner collapsing it clears the hover state too, so pressing the button while hovering collapses
at once.

**Something opened from inside holds it open.** A popup is portaled out of the sidebar, so reaching it is the
pointer leaving — the first build collapsed the Playground's menu the moment the pointer moved onto its own
settings pane. So while any control inside says `aria-expanded="true"` and points `aria-controls` at an
element outside the sidebar, a leave collapses nothing. The test is read off the attributes the library's
triggers already write, which is what lets it cover a popup the sidebar knows nothing about. Holding cannot
end with a leave, since the pointer has already left, so while hover-expanded the sidebar also listens for
pointer movement on the document and lets go on the first move that lands outside it and everything it owns
once nothing is held.

**The owner collapsing it waits on the same thing.** Switching the Playground's auto-hide on from a checkbox in
its own settings pane collapsed the menu under the open pane, which was left pointing at a cog nobody could
see. That checkbox has since gone, so the Playground no longer reaches this case and no spec covers it; the
behavior stays because any consumer collapsing from inside a popup would hit it. So a
collapse that arrives while something opened from inside is still open keeps the sidebar expanded, and lets go
the way a hover does. **The wait is its own state, not a hover.** The first attempt reused the hover state,
which is a dismiss layer, and a layer registered after the pane sits above it — so Escape collapsed the menu
and left the pane standing. The wait registers no layer; Escape closes the pane, and the next move away
collapses the menu.

**A sidebar that starts expanded appears expanded.** `ElementFader` always starts from hidden and grows into
the first state it is given, so every page load slid the Playground's menu open. The first transition runs at
zero duration when the starting state is expanded, and the real duration applies from the first change on. The default rest before it expands is shorter than a tooltip's, because the strip is a
deliberate target rather than something passed over on the way elsewhere; it is a guess, not a measurement.

**It does not register itself with `ElevationUtils`.** The first build did, reading its own `z-index` from
`ElevationUtils.getBase` while registering it — and registering bumps the revision `getBase` reads, so the
registration re-ran itself and the panel never settled on its expanded width. Popups inside it find the raised
panel through `AnchorUtils.getStackingBase`, which reads ancestors' `z-index` from the document, so the
registration bought nothing.

**A collapse made from inside, under the pointer, pauses hover-expanding until the pointer leaves.** With
`isExpandedOnHover` on, a collapse button inside the sidebar undid itself: the press collapsed the panel, and the
pointer still resting on it counted as a hover — `HoverIntent` treats an anchor handed over while hovered as the
pointer arriving, on purpose, for tooltips shared along a row — so the panel grew straight back. When `expanded` goes
to `false` while the root matches `:hover`, the sidebar stops handing its root to `HoverIntent` until the root's next
`mouseleave`. Whichever of the two effects runs first, nothing reopens it: a peek already scheduled is canceled by the
collapse, and one not yet scheduled finds no anchor.
