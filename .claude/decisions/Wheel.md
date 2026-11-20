# Decisions: `Wheel`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### An overhead wheel turns its picked wedge to the marker, and the marker is a prop

The wheel reported the right wedge and highlighted the right wedge, and the wedge was nowhere near the
pointer at the top of the demo. It had been drawing each wedge at `index * step + angle`, which puts the
picked wedge at rotation zero — wherever the layout happens to put its first placement. Nothing said that had
to be under the marker; it used to be, by accident.

**The accident was the ring's whole-turn branch, which was removed on purpose.** A full-turn ring used to
center its _first_ wedge on the facing direction; it now centers the _run_ there, so on eight wedges the first
one starts at the bottom and a wedge boundary sits at twelve o'clock. That change is right and stays — the
entry two along argues it — and this is the consumer that was leaning on the old formula.

**The wheel corrects for it rather than the layout going back.** It reads the first placement's sector, takes
the middle of it, and turns the whole assembly by whatever lands that middle on the marker. Any layout, any
facing, any wedge count: the wedge the wheel names is the wedge under the marker. `markerDegrees` says where
the marker is and defaults to straight up, which is where the layouts already face and where a pip
conventionally sits. It is a prop because the marker is drawn by the consumer, outside the wheel, so nothing
else can know.

**A wedge now reports the angle it was turned to.** `WheelWedgeState` carries `angle`, because the painter
cannot work out its own orientation otherwise — every wedge is handed the _same_ placement rect and told
apart only by the rotation the wheel applies.

### A wheel's label lies across its wedge, and flips rather than reading upside down

The labels were painted at whatever angle the wheel had turned them to, so half the wheel read upside down.
Two things were wrong underneath that.

**The label was square to the layout rather than to its wedge.** With `tiltRatio` at zero the placement's box
is axis-aligned, which looks deliberate only for the one wedge sitting at the layout's own zero and arbitrary
everywhere else. The label is laid across the wedge now — a quarter turn from the sector's own bisector —
which is also what the layout's arithmetic implies, since it sizes the box from the chord across the wedge
rather than from anything radial.

**Then it flips a half turn when it would otherwise read upside down**, which is the half of the wheel where
the painted angle falls between ninety and two hundred and seventy degrees. Top and bottom labels come out
horizontal, the two sides vertical and mirrored, and nothing is inverted at any wedge count.

The flip happens while the wheel spins, at the two crossings. That is accepted: a label is read when the
wheel is at rest, and the alternative — laying every label along its radius, which never inverts — is a
different look nobody asked for.

**This lives in the Playground's painter, not in the wheel.** The wheel says how far it turned each wedge;
what to do about it is the paint, and `components/src` paints nothing.

### An overhead wheel takes presses only on its round face, and paints wherever it likes

**The wedges and the wheel's own box let presses through; a round disc the size of the wheel takes the wheel's
presses; ordinary controls inside a wedge take theirs.** Each wedge is a full-size square turned to its angle, so the
squares' corners reached past the circle and over their neighbors: a press beside the wheel counted as one on it,
which an outside-click layer would misread, and a control painted into one wedge could have its press taken by a
neighbor's corner. Settled with the user over two alternatives. Clipping each wedge to its own sector was rejected
because it also cuts off painting — a glow, a shadow, or an avatar standing out of a wedge's rim, which the user
named as a design worth keeping. Letting only the painted shape take presses was the measured fix from before, and
was rejected because `pointer-events` is inherited: anything a consumer puts in a wedge silently stops working.

**The disc relies on a published rule**: an element with `border-radius` takes pointer events only inside the curve
of its border edge ([CSS Backgrounds 3, corner clipping](https://www.w3.org/TR/css-backgrounds-3/#corner-clipping)).
**Controls are switched back on by one style rule** over links, buttons, form fields, `summary`, editable content and
anything with a tab stop. **A consumer's own clickable element with no tab stop is the one case not covered**, and the
user's call is that it should not be: such an element already fails WCAG 2.1.1 Keyboard, and it opts back in with
`pointer-events: auto`. CSS cannot see a click listener — `[onclick]` matches only the attribute written in markup,
which no framework here uses.

**The selected wedge stacks above the others**, so whatever it paints past its edge is drawn over its neighbors
rather than under them; asked for by the user with the Playground's glow on the picked wedge. A painter cannot do
that alone, since each wedge is its own stacking context. **The root isolates its stacking** so the lifted wedge stays
under anything the consumer lays over the wheel, such as the hub's spin button.

### A drum face's turn animates and its distance from the axis does not

**Each face is two elements: the outer one turns and is transitioned, the inner one moves the face out to the
surface and is not.** Asked for by the user once the cost was put to them. A face used to carry its angle and its
distance in one transitioned `transform`, so changing the face count mid-turn animated the distance over the turn
while the barrel resized at once, and for the length of the turn the faces sat outside the room it had reserved.
`BarrelUtils.getFaceTurnTransform` and `getFaceOffsetTransform` give the two halves; nested, they make the same
matrix as before, `rotate` then `translateZ`. The individual `rotate` and `translate` properties could not do it on
one element: they compose as translate-then-rotate, the wrong order for a face pushed out in its own turned frame.
The cost is one plain element per face, up to 48 on a doubled reel.
