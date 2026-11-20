# Decisions: `Timeline`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Timeline`: a window over a range, where the component owns the arithmetic and nothing else moves it

**The window is the consumer's state and the component only computes against it.** `range` is the whole
extent, `view` is the part on screen, and everything the component paints is derived from the pair: a
span's left and width are its share of the window written as percentages, so a resize needs no code here at
all and the browser recomputes. The signal is optional through `SignalMirrorSolidUtils.createOptional`, so a page that
does not care gets an internal one and a page that wants a readout passes its own — the same arrangement
`Carousel` and `Trail` already use.

**Every write goes through the same clamp, so an illegal window cannot be rendered.** `clampView` fixes the
width first and the position second: a window wider than the range is cut to the range, one narrower than
`minViewExtent` is opened back up, and one that has run off an end is slid back against it rather than
squashed. Zooming clamps the width **before** it places the anchor, which is what keeps the value under the
pointer under the pointer at the limit — the first build clamped afterwards and the picture crept sideways
as you pushed past full zoom.

**The component owns the gestures, and the first build was wrong to withhold them.** The argument for
withholding was the `Scroller` one — that component renders no button of its own — and the user's objection
is what broke it: `Scroller` withholds a **button**, which is paint with a look and a name, while a wheel or
a drag has no look at all. Pinch to zoom and drag to pan are conventions rather than taste, and a component
that leaves them out is not neutral, it is unfinished; every consumer then re-solves press-versus-drag, and
the Playground's first attempt got it wrong in the way described below.

**A plain wheel zooms, which is what the comparable libraries do.** Checked rather than assumed: vis-timeline
ships `zoomable: true` and `moveable: true` with `zoomKey: ''`, so an unmodified wheel zooms and requiring a
held key is opt-in; React Flow ships `zoomOnScroll: true`, `zoomOnPinch: true`, `panOnDrag: true` and
`preventScrolling: true`, so it zooms on the wheel and deliberately stops the page scrolling underneath. The
Ctrl-held convention belongs to the applications that own the whole viewport — Figma, Excalidraw — where
there is no page behind the canvas to scroll, and to Google's embedded maps, which adopted it precisely
because a map dropped into a long article eats the scroll. **That last case is real, and it is what the off
switch is for**: `isZoomable` and `isPannable` both default true and either can be turned off, which is the
same shape as vis-timeline's two flags.

**Touch is claimed narrowly.** The root sets `touch-action: pan-y`, so a vertical swipe still scrolls the page
past the timeline and only the horizontal half of the gesture is taken. A trackpad pinch arrives as a wheel
event with `ctrlKey` set and needs no separate handling; a real two-finger pinch is tracked from the pointer
events themselves, zooming by the change in the gap and panning by the change in the midpoint.

**The controller stays, because a gesture is not a route for everybody.** `onMount` hands over `zoomBy(factor,
focusRatio)`, `panBy(ratio)` and `showSpan(span)`, which is what the tracks example's five buttons drive —
earlier, later, in, out and the whole reel.

**Lanes are packed when nobody says otherwise and taken as given when somebody does.** With no
`computeLane`, `packLanes` walks the spans in start order and drops each into the first lane whose last span
has already ended, which is the greedy answer and is what a diary wants: two meetings that overlap are
stacked, two that do not share a row. With `computeLane`, the number is the consumer's and the packing never
runs, which is what a set of named tracks wants — a clip belongs to the audio track whether or not anything
else is playing. `laneCount` is then given too, so an empty track still reserves its row.

**The ticks are chosen by the component and worded by the consumer.** A step is picked from a ladder of
round numbers against the width the component measures for itself, so the same timeline shows hours at one
zoom and quarter hours at another with nothing to configure; the label is `renderTick`'s business, because
only the consumer knows the number is minutes past midnight rather than seconds of video or millions of
years. **The ladder is a prop rather than a constant** because roundness is not decimal everywhere: sixty
seconds and twenty-four hours are round in a way ten thousand is not, and a component counting in unitless
numbers cannot know which it is looking at. With no ladder the fallback is the usual one, two and five per
decade.

**The major step is the next entry that divides the minor one, and it took two corrections to get right.**
The first rule asked for an entry at least three times the step and invented one when the ladder had none —
so a half-minute step over a three-minute reel was labeled at 0:00 and 2:30, which are the wrong numbers to
write on an axis. Preferring an entry three times the step and falling back to the smallest that divides it
fixed that, and then broke differently at a narrower width: the step rises to a minute, the ladder has
nothing above a minute, and the invented major was five minutes on a reel three minutes long, so the axis
carried exactly one label. **A major step nobody can see is not a major step**, so the choice is now made
among the entries that divide the step _and_ fit inside the window, and when there are none the step is its
own major and every tick is labeled.

**The axis strip is inside the component's own box, because clipping one direction clips both.** The root
hides its overflow so a span reaching past an edge is cut at it; `overflow-x: hidden` with a visible `y` is
not a thing CSS offers, so a label drawn above the lanes by the consumer was clipped away entirely.
`axisSize` reserves that band at the top of the component's height, the tick element spans the whole height
including it, and the lanes start below — which also puts the reserved room in the height the consumer lays
other things out against.

**Only what the window can show is built, plus whichever item holds the walk.** `computePlacements` reports
every item with an `isInView` flag rather than filtering, so the component decides what to mount and the
painter can still see where an off-screen item would be; the roving item is always mounted so a walk never
focuses something that is not there. Because the list is a window onto a longer one, each item carries
`aria-posinset` and `aria-setsize` over **all** the items, which is the published answer for a windowed list
and the only way a reader is told there are ten meetings when four are on screen.

**The rendered list is keyed by item index rather than by placement.** `For` compares its items by identity,
and a placement is a fresh object every time the window moves — so keying on placements rebuilt every block
on every frame of a drag, taking the focused element with it. A list of plain numbers compares by value, so
a block that stays on screen keeps its element and only the items entering or leaving the window are built.

#### Three things the build found

**A walked-to element is not focusable yet in the update that creates it.** `InteractionWrapper` writes the
tab stop from `InteractionTrackerUtils.wrapElement`'s own effect, and for a block that has just entered the
window that effect has not run when the walk's effect fires: `focus()` on a `div` with no `tabindex` does
nothing at all, so pressing `End` blurred the old block and landed on the body. The walk sets `tabIndex` on
the element itself before focusing it, which is the same value the wrapper writes a moment later. Worth
recording because every other roving component in the library builds all of its stops up front and so cannot
meet this.

**A pan that captures the pointer eats the press it started with, and that is why the gesture belongs
inside.** The first Playground version took pointer capture on `pointerdown`, panned correctly, and no block
could ever be pressed. The settlement is that capture
is taken **only once the pointer has traveled four pixels**, the same slop `Carrier` uses. A press that
stays put never captures, so its click reaches the block; a drag captures, and its click is then delivered to
the root instead, which is exactly the behavior wanted and costs no flag to suppress. This is one rule, it
is subtle, and it is the strongest argument for the component owning the gesture rather than each consumer
writing it again.

**Focus that arrives from outside is adopted rather than ignored.** The roving index used to change only on
a click or a key, so an item focused any other way left the walk pointing somewhere else and the next arrow
jumped back across the timeline. Each block reports its own `focus` event, which costs one handler and makes
"whatever holds focus is where the walk continues from" true by construction.

#### What WCAG said

**2.1.1 Keyboard**: the board is one tab stop, the arrows walk the blocks — left and right through time, up
and down between lanes — `Home` and `End` reach the ends, `Enter` and `Space` activate (`Space` only, once edges are on), and a walk that
leaves the window brings the window with it, so nothing is reachable only by pointer. **4.1.2 Name, Role,
Value**: each block is a `button` named by `computeItemAriaLabel`, and a block the consumer marked off
limits carries `aria-disabled="true"` and is skipped by the walk rather than removed from it. **2.5.7 Dragging Movements** — "all functionality that uses a dragging movement for
operation can be achieved by a single pointer without dragging, unless dragging is essential or the
functionality is determined by the user agent and not modified by the author" — **now applies to the
component, because the component drags**. The understanding document's own worked example is this case: a map
that pans by dragging must also offer directional buttons. The user-agent exemption covers the browser's own
scrolling and stops covering it the moment `touch-action` takes the gesture, which `pan-y` does for the
horizontal half. **2.5.1 Pointer Gestures** does the same to pinch, which is multipoint and so needs a
single-pointer route that is not a path.

**Neither can be discharged inside the component, and that is a gap rather than an oversight.** The only
things that satisfy both are controls — buttons, a field, a click target — and this component renders none,
by the rule the library is built on. So the obligation lands on the consumer exactly as `Scroller`'s does:
**a Timeline that a person can only move by dragging or pinching fails 2.5.7 and 2.5.1, and the library
cannot promise otherwise.** The tracks example is what discharging it looks like — earlier, later, zoom in,
zoom out — and the meetings example deliberately has no buttons, so the two sit side by side and the
difference is visible.

#### What it does not do

A block cannot be dragged along time or moved between lanes. Stretching one at either end is opt-in through
`onSpanChange`, the one route by which the component writes back, and snapping arrives with it through
`computeSnapValue` (_"an item's edges are a `Carrier` carry"_ below); a marker for a current position is
_"markers are a list of values"_ below. There is no second row of ticks at a coarser step and no vertical
arrangement — every measurement in it reads one axis, the same limit `Scroller` and `SlideButton` record.
None of these is an accepted limit; they are simply not built, and moving a block along time or between lanes
would be the same carry the edges already use, the way `PatchBoard` moves a node.

### `Timeline`: markers are a list of values, drawn like ticks

**A marker is a point in time the consumer names and the component places, in the tick's own shape.** `markers` is a plain list, so a playhead or a "now" line is an accessor the page moves; the component turns each value into `{ value, ratio, isInView }` against the window and hands it to `renderMarker` with its index. Off-screen markers are still handed over, flagged, so a painter can point at the edge or draw nothing. The layer is `aria-hidden="true"` like the ticks: a line across the lanes is paint, and the position it stands for is the consumer's to say in words.

### `Timeline`: an item's edges are a `Carrier` carry, and `Enter` takes hold

**Passing `onSpanChange` turns edges on, and every route to an edge is one carry through `Carrier`.** The timeline registers itself as a zone of its own group; the carried item is the index, and the place is the whole proposed span, so the item is drawn at its new size while held and the consumer is told only on drop. Which edge is held is the timeline's own state rather than part of the place, so switching ends and dropping without moving is "left in place" rather than a change. **The pointer takes an edge from a strip centered on it, `edgeGrabSize` wide**: a press there stops the pan from seeing it, a drag past four pixels moves the edge, and a press that never travels picks the edge up so the next press puts it down, which is the single-pointer route 2.5.7 asks for. The 24-pixel default is 2.5.8's minimum target. **The keyboard follows PatchBoard's pick-up pattern instead of modifier keys, at the owner's request**: `Enter` holds the end, `Home` and `End` choose the start or the end, the arrows move it, `Enter` or `Space` drops and `Escape` puts it back. `Tab` is never taken, and leaving the timeline while holding cancels. So `Enter` stops activating while edges are on and `Space` still does. **An arrow press is one notch**: with `computeSnapValue` it lands on the nearest snapped value past the current one (looked for a tick at a time, then narrowed down by halving), and without it, one tick of the ruler. Nothing is spoken unless `edgeAnnouncements` is given, because the library says no words of its own.
