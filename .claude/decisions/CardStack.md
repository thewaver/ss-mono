# Decisions: `CardStack`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `CardStack`: the pile keeps the geometry, the consumer keeps the card

Asked for by the user while pruning the `Abstracts` pages: the `InteractionTracker` page's card-stack example
was the one thing on it worth keeping, so it was lifted out of the Playground and made a component. The name
was theirs, chosen from a list where the alternatives were `Deck`, which reads as slides to anyone who has
met a presentation tool, `SwipeDeck`, which pins the component to one of its three routes in, and `Shuffler`,
which is an agent noun for a thing that does not shuffle.

**Headless, so what the component owns is the pile and never the card.** Which cards exist right now, how far
the top one has been pushed, which way it is leaving, and the stacking order are geometry, and they go in
`CardStackCardState`. What a card looks like — its fill, its corners, the tilt it takes as it is pushed — is
paint, and it is the consumer's, computed from the state they are handed. It is the same split as `Trail`,
which places the traveler and lets the consumer draw it.

**The pile's own shape is geometry, so `cardGap` and `funnelRatio` are the stack's numbers and not the
painter's.** The first build left the offset to the consumer, who nudged each card down by its `depth`. A
painter cannot do it: `depth` says where one card sits, and the shape of the pile needs the count of the
others, which only the stack has. So the stack sizes and places the card slot, and the consumer paints
inside a box that is already the right size — the same division as `Trail` placing the traveler.

**The pile fits inside the box, and it is the cards that give up the room.** The rule the user settled on:
a card is as tall as the box less `(mountedCount - 1) * cardGap`, the bottom-most card sits flush with the
bottom of the box, and each card above it is lifted by one gap — so the top card's top edge is the box's top
edge and nothing sticks out. An earlier build had the pile grow upwards out of the box instead, which made
the box a statement about one card rather than about the stack. Raising the gap now makes every card shorter
rather than making the stack taller, which is what keeps a consumer's layout still after they change it.

**`pileSide` names the edge the pile peeks out of, `"bottom"` or `"top"`, after `Bracket`'s `rootSide`.** The default is
the shape above: the top card flush with the top of the box and the cards behind showing beneath it, which is what
most published card stacks do. `"top"` mirrors it — the top card flush with the bottom, the pile showing above — by
measuring each card's offset from the box's top edge instead of from its bottom (`CardStackUtils.getCardOffsetPx`).
Top and bottom only, the user's pick: a sideways pile turns the whole geometry, and widening the choice later breaks
nobody. The backlog entry that decided this described today's look as peeking out above, and the default was to be
"today's behavior"; the painted stack showed the opposite, so the default is `"bottom"`, which is today's look, and
the prop still names the edge the pile shows from.

**The funnel is width only, and the widest card is the one on top.** `funnelRatio` takes a share of the
stack's width off each successive card, so the top card fills the box and the ones behind it narrow —
`0.08` is eight percent off the second and sixteen off the third. The stack's width is therefore the width
of its widest card, which is the one being touched. A card narrowed past nothing is held at nothing, since
a negative width is not a smaller card but an inverted one.

**The box is the container's, not the content's.** The root is `100%` by `100%`, so a consumer sizes the
stack by whatever they wrap it in and everything above — how tall a card is, how far it is lifted, how wide
it is — is worked out from that. The alternative, sizing the pile to the tallest card in it, was rejected by
the user because the box would then change height as tall cards left. Taking the size from the container also
makes the transforms free: travel arrives as a fraction of the element, so following the pointer is
`translate` in percentages, and a card leaving flies `1.5` box-widths out whatever the box is.

**It renders the pile and nothing else, and the buttons come from the controller.** The first build had a
`renderControls` slot drawing them under the pile inside the stack's own box, which was `Carousel`'s shape
copied. The user rejected it and gave the general rule instead — see _"A component hands out a controller and
renders no controls of its own"_ in `conventions.md`. Two things went wrong with the slot: the stack's box
was then the pile plus a toolbar rather than the pile, so nothing wrapping it could frame the pile alone, and
where the buttons sat was the component's decision rather than the page's.

**Keyboard and pointer are answered by different criteria, and only one of them can be closed from inside.**
**2.1.1 Keyboard**, Level A, is closed in the component: the root is focusable and the four arrow keys send
the top card, always, whatever else was passed. **2.5.1 Pointer Gestures**, Level A — _"all functionality that
uses multipoint or path-based gestures for operation can be operated with a single pointer without a
path-based gesture, unless a multipoint or path-based gesture is essential"_ — and **2.5.7 Dragging
Movements**, Level AA — _"all functionality that uses a dragging movement for operation can be achieved by a
single pointer without dragging, unless dragging is essential or the functionality is determined by the user
agent and not modified by the author"_ — both bite, because the understanding document for 2.5.1 names a
swipe as path-based in as many words, and neither is satisfied by a keyboard route, since both are about
pointers. Sending a card is a discrete choice rather than something the drag is essential to, so the
exception does not apply.

**So the obligation lands on the consumer, which is `Timeline`'s and `Scroller`'s position, and now `Carousel`'s
and `Flipbook`'s as well.** Those two once closed it by taking the gesture only when the consumer drew their
controls through a slot; that is only available to a component that draws the controls, and once both were moved to
controllers neither does. What is left is `send`, handed out at mount, and a props block saying plainly that anything
sending a card without a drag has to be built on it. **A `CardStack` whose only pointer route is the swipe
fails 2.5.1 and 2.5.7, and the library cannot promise otherwise.** The Playground's deck is what discharging
it looks like: four buttons beside the pile, each calling `send`.

**A card is sent by one route and leaves by one path.** `send` is what the gesture, the arrow keys and the
controls all call, so the flight, the callback and the advance happen once and in one order however the card
was pushed. It refuses while a card is already leaving, which is what stops a fast second press sending two
cards on one transition.

**`topIndex` rather than a count of what has gone.** An index into `cards` says the same thing and says
it in the consumer's own terms, so dealing again is setting it to zero and an empty pile is it reaching the
card count. `mountedCount` is what keeps a long deck cheap: only that many cards are in the document, so the
cost of a stack does not grow with the deck behind it.

### `CardStack`: a recalled card comes back the way it went

**`recall` returns the last card from the side it left by, and a card that never left by a side reappears in place.** The stack remembers which way each card went, by its index in `cards`, at the moment it leaves. A card that was moved past by setting `topIndex` has no such record. Inventing a side for it would show a flight that never happened, so it simply reappears. `deal` forgets every record.

**`returningFrom` is a pose, not a phase.** It is set only while the recalled card sits off to its side, for the two frames before it starts back, and it clears as the flight begins. So a painter treats it exactly as it treats `leavingTo`: whatever it draws while either is set is the "away" pose, and the stack's transition carries the card between that pose and the pile. A painter that fades a leaving card out therefore fades a returning one in for free. Setting it for the whole flight would have left a painter nothing to animate from.

**A card is moving until its flight is settled, and nothing else starts in the meantime.** `send` refuses while a recalled card is still placed off to the side, and `recall` refuses while a card is leaving, for the same reason `send` already refused a second send: one transition, one card.

**Reduced motion is the consumer's to answer, as elsewhere.** With `transitionDurationMs` at `0` there is no flight at all, and the card simply appears. WCAG 2.3.3 Animation from Interactions (AAA) covers this flight, since it is motion set off by a press, and the zero duration is the off switch. `recall` is a command on the controller, with no gesture of its own, so 2.5.1 and 2.5.7 have nothing to say about it.

### `CardStack`: `allowedDirections` decides which swipe tracker the stack uses

**A left-out direction is refused by every route.** A swipe that way springs back, its arrow key is not `preventDefault`ed so the page scrolls as usual, and `send` returns `false`. The card still follows the pointer toward a refused direction during a free swipe, then springs back on release, so the refusal is shown rather than hidden.

**When the allowed directions share one axis the stack claims only that axis.** It uses `trackAxialSwipe` then, and `trackFreeSwipe` otherwise, so a left-and-right stack leaves the browser the vertical axis to scroll on a touch screen. The tracker is rebuilt whenever the shared axis changes, rather than both being attached with one disabled: both write `touch-action` to the same element, and whichever effect ran last would win. An empty list turns swiping off.

### `CardStack`: the motion helpers take getters, so only the top card follows the push

**`getCardTransform`, `getCardTransitionDurationMs` and `getCardMotion` are handed `getMotion` (and the duration
helper `getIsSwiping`) rather than the values, and call them only once they know the card is on top.** The push
changes on every pointer move, and only the top card moves with it. In a view that updates only what it read —
Solid, Svelte, and Vue's computed values — reading the motion before checking the depth subscribed every mounted
card to it. Each pointer move then re-ran every card's style and rebuilt every card's state, and the consumer's
`renderCard` re-ran along with it, all to write the same values again. The rule went into the core rather than into each view. Checking the depth first in the Solid view alone would have
repeated a rule the core already owns, and every fine-grained view would have had to remember it. React re-renders
the whole stack on each push either way, so it passes `() => motion` and gains nothing, and loses nothing either.
