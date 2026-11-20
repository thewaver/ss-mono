# Decisions: `InteractionTracker`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Pointer drag: a ratio, opt-in, and captured

Settled, closing the primitive `backlog.md` asked for.
`InteractionTrackerUtils.trackDrag(ref, disabled, opts)` reports where a pointer is inside an element for as long as
a drag lasts.

**It is a separate call rather than part of `wrapElement`**, as `backlog.md` asked: most controls want no
listener at all, and a two-dimensional surface is the one shape that cannot borrow a native input the way
`Range` borrows one per thumb. `trackActivation` beside it took the same shape for the same reason.

**It reports a ratio of the element's own box, not a position**, which keeps it out of the coordinate-space
trap: pointer coordinates and the element's rect are both client-space, so `Viewport`'s scale divides out of
the fraction exactly and never has to be looked up. Same insight that fixed the two geometry specs — a ratio
of two same-space measurements is scale-free by construction.

**`setPointerCapture` is load-bearing.** A drag that stops reporting when the pointer leaves the element
strands the control mid-drag, and releasing outside must still land the value. Capture also means the
`pointermove` handler can be on the element rather than the document, so nothing leaks when the component goes
away.

**`pointerdown` reports immediately**, so a click positions the value without a drag — what a color surface
and any track-clicking slider need.

**A drag is dropped when the tracked element is swapped, and only then.** The pointer's id and the measured
rect live outside the effect that binds the listeners, so they used to survive that effect re-running. That is
what a control needs while it is being dragged — flags change under it constantly and the listeners are rebound
without the gesture noticing — but it also meant a control that unmounts mid-drag and comes back later carried
the old pointer id into its new element, and a bare `pointermove` matched it. `ScratchCard` hit this: rub past
the threshold while still holding the button, take a fresh ticket, and moving across it rubbed the whole thing
off without a press, because the release had landed on an element that was already gone.

The first fix cleared the state in the listener effect's cleanup, which is wrong and `ColorArea` caught it
within a run: its drag handler focuses an axis input, that changes the interaction flags, the flags are what
`getIsDisabled` reads, and so the effect re-runs on the first move of every drag — canceling it. So the reset
is its own effect, on the ref alone and deferred, and it fires when the element genuinely changes rather than
whenever anything the binding effect happens to read has moved. **A drag surviving a rebind and a drag
surviving a swap are different questions, and the binding effect can only answer the first.**

### The one-shot activation origin: a flag with a count, and opt-in for the same reason `trackDrag` is

Settled on the user's instruction, closing the item `backlog.md` had left as "not worth building until
something asks". `trackDrag` reports a **ratio while a drag lasts**, which is not an event with an origin: a
ripple has to know where one press landed and then run once from there.

**`InteractionTrackerUtils.trackActivation(ref, disabled)` is that**, and it returns `{ ratio, count }` or
nothing. The ratio is of the element's own box, for `trackDrag`'s reason — pointer coordinates and the rect
are the same space, so `Viewport`'s scale divides out of the fraction and the `transform: scale()` bug that
has been open against MUI's ripple for years cannot be written here.

**`count` is what makes it one-shot.** A ratio alone cannot tell a second press at the same point from the
first, so a painter watching only the position would draw nothing on the repeat. The count rises on every
activation, so a painter compares it with the one it last drew and starts a new effect when they differ.
That is the same information an event carries without being one: it is state a painter can read at any time
and compare, rather than a callback it has to have been mounted to receive.

**The keyboard gets the center.** `Enter` and `Space` produce `{ x: 0.5, y: 0.5 }`, with `e.repeat` ignored
so holding the key does not fire a stream of activations. A press has no point when it did not come from a
pointer, and reporting nothing would mean a decoration that exists for mouse users only.

**It is a separate call and an opt-in prop**, not part of `wrapElement`. `InteractionWrapper` takes
`isActivationTracked` and folds it into the disabled accessor it hands the tracker, so a control nobody asked
to track attaches no listener and measures no rect — the cost is a `getBoundingClientRect` per press, which
is a forced layout, and paying it on every control in the library for a decoration almost none of them draw
is the wrong default. Same argument as `trackDrag`'s.

**It reaches the painter as a flag, through the mechanism that already existed.** `activation` is on
`InternalInteractionFlags`, so it arrives in `renderDecoration`'s `getFlags` beside `isHovered` and
`isPressed` with no new argument anywhere, and a painter that ignores it is unaffected. The Playground's
`PageRipple` is the first consumer: it sits in the decoration layer, which is `position: absolute; inset: 0`
over the control, so a ratio is a percentage and no measuring happens on the painter's side at all.

### The swipe: one gesture over the drag machinery, an axis it claims, and a verdict at the end

Settled, closing the gesture `Abstract` `backlog.md` asked for. `InteractionTrackerUtils.trackAxialSwipe(ref,
disabled, opts)` reports how far a pointer has pushed an element along one axis, and at the release says
whether that push counts. `Drawer` and `Carousel` are its two consumers.

**Both gestures sit on one private `trackPointer`, and the public pair stay separate.** `trackPointer` owns
the pointer bookkeeping — which pointer is being followed, capture, the four listeners, and whether a release
was a release or a cancel. `trackDrag` reports position from it and `trackAxialSwipe` reports travel from it, and
neither has a way to express the other's report. The item argued for exactly this: a drag reports **state**
for as long as it lasts, a swipe reports **an event** with a verdict, and the argument survived the later
decision that a swipe also reports progress in flight, because the verdict is still a thing a drag has no
word for.

**`trackDrag` now says why a drag ended, which closes `SlideButton`'s canceled-pointer gap in the same
change.** `onDragEnd` receives `"release"` or `"cancel"`; `SlideButton` activates only on the first, so a
drag the browser or the OS takes over with the thumb already at the end no longer confirms. A swipe must
never commit on a cancel, and that consumer is what made the change to a shipped `Abstract` worth making —
recorded in the item as the condition for doing it.

**Travel is a ratio of the element's own box, not a distance in pixels.** Same insight as `trackDrag`'s:
pointer coordinates and the element's rect are both client-space, so a `Viewport` scale divides out of the
fraction exactly. It also answers the question the item left open — whether in-flight progress should be a
raw offset or a ratio — without taking either horn. A ratio **of the commit threshold** would mean the
`Abstract` dividing by a number only the consumer knows, which is why the item leaned towards the offset; a
ratio **of the element** is neither, and it is the space `trackDrag` already reports in. A consumer wanting
the fraction-of-threshold reading divides at the call site, where the threshold lives.

**The box is the one the gesture started in, and this is load-bearing rather than tidy.** A drawer that
follows the finger moves the very element the ratio is measured against, so a live `getBoundingClientRect`
feeds the element's own displacement back into the travel: pushing a left-edge drawer leftwards halves every
reading, and pushing a right-edge one rightwards runs away to a commit on the first move. Freezing the rect
at `pointerdown` removes the loop. `trackDrag` keeps measuring live, because its two consumers do not move
under the pointer and a page scrolling during a drag would strand a frozen rect.

**A swipe takes the pointer over only once it has traveled, and a drag takes it immediately.** `trackDrag`
captures and calls `preventDefault` on `pointerdown`, which is right for a color surface — a click there
sets a value. A swipe cannot: the elements it watches are a dialog and a carousel viewport, both full of
buttons and links, and capturing every press inside them would break all of them. So `trackAxialSwipe` waits until
the travel passes a small slop, then captures, and swallows the one `click` that follows an engaged gesture
so a swipe that began over a button does not also press it. The slop is a ratio of the element like everything
else here, which does mean a wide carousel tolerates more jitter than a narrow drawer; a constant in pixels
would be the truer reading of finger jitter, and was not worth reintroducing the scale question for.

**The `Abstract` writes `touch-action` itself, from the axis it was given.** A horizontal swipe sets `pan-y`
and a vertical one `pan-x`, so the browser keeps the axis the gesture does not want and the page still
scrolls. Leaving this to the consumer's stylesheet is the silent-failure case the item warned about: get it
wrong and the browser claims the gesture, the handler never fires, and it happens only on touch hardware.
Since the axis and the CSS have to agree, the `Abstract` owns both ends rather than documenting the pairing.

**`Modal` moves the container, and no painter had to change.** The swipe offset is a `transform` on
`modalContainer` while the painter keeps its own slide off `getVisibilityTarget` — two elements, two
transforms, composing. This follows the rule already recorded for the edges: **placement is geometry and the
slide is paint**, and where the dialog box sits is placement. It also means every existing `Modal` consumer
gets the gesture without touching `renderContent`, which a third argument handing out the offset would not
have.

**A committed swipe keeps its offset and lets the exit run from there.** Resetting the transform on commit
would snap the panel back to fully open for one frame before the painter slid it out. The offset is cleared
when the fader stops being visible, which is after the exit has finished and the whole layer has unmounted.

**Where the gesture is offered is derived, never configured — SC 2.5.1 Pointer Gestures, Level A.** A swipe
is path-based, so anything operable by one must also be operable with a single pointer and no path. `Modal`
attaches it only when the alignment is an edge, and only when overlay-click dismissal is still on: `Escape`
is the path-free route, and a consumer who has already turned off casual dismissal is not handed a more
casual one. `Carousel` attached it only when `renderControls` was passed until the slot was removed; it now
attaches it unless the page drives `progress` (a carousel moved by a scroll position leaves the gesture to the
browser), and the single-pointer route is the consumer's to build on the controller, as `CardStack`'s is.

**A swiping carousel does not rotate, for the same reason a hovered one does not.** WCAG 2.2.2 asks that
self-moving content not move under the pointer; a finger on the track is a pointer on it. `getIsHeld` keeps
its recorded meaning — hovered, focus within, page hidden — and the swipe joins the rotation predicate beside
it rather than being folded into the flag the consumer reads.

**The commit thresholds are per component, not one constant here.** `trackAxialSwipe` takes `getCommitRatio` and
has no default; `Modal` and `Carousel` each name their own. The item recorded that shape, and it is the same
rule as merging two implementations that disagree on a constant. Neither number is a public prop, for the
reason `SlideButton` has no threshold prop: a tuned value with no consumer behind it is a guess.

**A threshold is a fraction of the drawer, so the four edges commit at the same fraction and different
distances.** The travel is measured against the dialog box along the swipe axis, and how thick a drawer is
belongs to the painter — on the Playground a side drawer is 320px wide and a sheet 400px deep, so the same
0.35 asks for 112px sideways and 140px vertically. The alternative readings are a fraction of the viewport,
which would make a narrow drawer need a push most of the way across the screen, and a distance in pixels,
which would make a thin drawer commit almost at once and a thick one feel stuck. Proportional to the thing
being pushed is the reading that holds at every size, and it is the one a person's hand is already using —
the drawer under the finger is the whole of what they can see moving.

**A sheet whose content scrolls needs a second mechanism, and `touch-action` alone cannot be it.** The first
build left top and bottom edges out on the reasoning that `touch-action: pan-x` on the dialog would disable
touch scrolling inside it. That reasoning was wrong in both directions, and the correction is the useful part.

`touch-action` is **not** simply inherited down the tree. A gesture resolves it by walking from the touched
element up to the nearest ancestor that would handle the gesture — the first containing scroll container —
and intersecting only that stretch. Anything above that scroller is never consulted. So `pan-x` on the dialog
does not reach a scrolling panel inside it, and the panel keeps scrolling normally. What actually happens is
the reverse of the fear: over a scrolling panel the browser takes the vertical gesture and the swipe never
fires, and over a panel that does not scroll the swipe works. A gesture that silently works in some places
and not others is worse than one that does not exist, which is why the limit was worth removing rather than
documenting.

**So the gesture is claimed on the first touch move, and held for the whole gesture.** `trackAxialSwipe` listens
to `touchmove` non-passively and, on the first move that has a direction, walks the scroll chain from the
touch target up to the tracked element asking whether anything there could still scroll the way the finger is
pushing. If something can, the gesture is the browser's and the swipe stays out of it; if nothing can — the
sheet is at the top of its content and the finger is pushing down — `preventDefault` claims it. This is the
iOS sheet rule: reading scrolls, and pushing from the top dismisses.

**Holding it for the whole gesture is the part that is easy to get wrong.** Preventing only the first move
stops that one scroll, and then the browser claims the _next_ move and sends `pointercancel` — the pointer
stream ends mid-swipe and nothing commits. Measured in Chromium: preventing every move keeps `pointermove`
flowing to the end with no cancel and no scrolling; preventing none scrolls and cancels at the second move;
preventing only the first scrolls nothing but still cancels. So the decision is taken once per gesture and
then applied to every move of it.

**`touch-action` still carries the axis, because it is the up-front declaration.** It is what tells the
browser the intent before any listener runs, and it is what keeps the page from panning across a drawer in
the areas that have no scroller of their own. The `touchmove` guard is the second half, not a replacement.

**This is the only place in the library that listens to touch events rather than pointer events.** Pointer
events cannot express it: by the time `pointercancel` arrives the browser has already taken the gesture, and
there is no pointer-level way to say "not this one". The guard is therefore touch-only and the mouse path
never reaches it.

#### Two entry points, `trackAxialSwipe` and `trackFreeSwipe`, over one private core

`CardStack` needs all four directions from one gesture, and the function was built around a single axis.
The user's first suggestion was to run two trackers on the same element and hand each one an axis, which is
the right mechanism and the wrong number of owners: **each tracker writes `ref.style.touchAction` in an
effect of its own**, one `pan-y` and the other `pan-x`, so two of them on one element write the same property
with different values and the last effect to run wins. On a touch screen the browser then keeps scrolling one
of the two axes and that half of the gesture never arrives. The same split runs through the `touchmove` guard,
where each tracker asks whether the scroll chain has room along **its** axis and the two can answer
differently about one finger. A gesture claiming both axes needs `touch-action: none`, which neither of them
would ever write, and it needs somewhere to arbitrate two verdicts from one diagonal push.

**So the inside of the suggestion was kept and the outside was given one owner.** `trackSwipeGesture` is
private and takes `getAxis: () => SwipeAxis | undefined`, where `undefined` means free. Exactly three things
read it — which travel the slop threshold is measured against, which `touch-action` is written, and how the
verdict is decided — and everything else a swipe competes with is written once. The travel it reports
internally is always both axes; `trackAxialSwipe` unwraps the one its caller asked for.

**Both names are specific, and that is the user's rule rather than a consequence.** The obvious rename was to
leave `trackSwipe` alone and add `trackFreeSwipe` beside it, which reads as though the plain one is the
general case and the other a variant — it is not, they are two equal choices. `trackSwipe` therefore became
`trackAxialSwipe` in the same change. `Modal` and `Carousel` moved with it and neither changed in any other
way, since the axial signature is untouched.

**The verdict for a free swipe is one direction, not two.** `GestureUtils.computeFreeSwipeDirection` takes the
axis traveled furthest and measures only that one against the commit ratio, so a push mostly rightwards and a
little downwards commits to `right` rather than to both or to neither. `computeTravelAxis` is split out beside
it because the `touchmove` guard needs the same answer about a finger before any progress has been computed.

### The hold is one function, and all three consumers call it

**Three components pause while somebody is looking at them, and each had written the test out.** `Toasts`
stops its countdowns, `Carousel` stops advancing, and a wheel stops turning by itself; all three meant
`hovered || focus within || page hidden`, and all three carried their own four handlers, their own
`visibilitychange` effect and their own copy of a `getHasLeft` guard. `InteractionTrackerUtils.trackHold(ref)` is now
the only copy, and the user's call was to convert the two existing components rather than leave them pointing
at it.

**It sits in `InteractionTracker` rather than in a folder of its own.** `InteractionTrackerUtils.wrapElement` already turns an
element's pointer and keyboard events into state; this is the same job one level out — the region rather than
the control — and `trackDrag` had already established the `track*` verb for "attach listeners, hand back a
signal". A folder for one function would have been discoverable only by someone who already knew it existed.

**Why it carries a Level A requirement rather than being a nicety**: see 2.2.2 under `Rotator`. That is the
argument for one copy. Three copies of a conformance behavior can drift apart silently, and the fourth
component to want it copies whichever it finds first.

**`mouseenter` / `mouseleave` replaced `mouseover` / `mouseout` plus a containment check.** The pair that does
not bubble already ignores movement between descendants, which is exactly what the guard was reconstructing by
hand. Focus still needs the guard: `focusout` fires on the region when focus moves from one child to another,
and `relatedTarget` is the only way to tell that from focus actually leaving. So the guard survives, used once,
for one of the two axes.

**What proves the conversion changed nothing is the existing specs, not new ones.** `carousel.spec.ts` covers
the hold under the pointer and the hold while a child has focus; `toasts.spec.ts` covers hovering, a hidden tab
and the arithmetic of a countdown resumed half way through. Those were written against the hand-rolled
version and pass unchanged against the shared one.
