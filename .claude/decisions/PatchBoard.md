# Decisions: `PatchBoard`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `PatchBoard`: boxes placed by hand, sockets, and cables that are the data rather than a drawing of it

The user asked whether this could be `Bracket` with a draggable prop and then answered it themselves — a node
can be patched in from several earlier nodes. That is the whole answer. `Bracket` is handed one root and
derives every position from the shape of the tree; here the positions come from the person dragging, a box has
more than one parent and therefore no layer to be placed in, and the cables **are** the data rather than
something read off it. A draggable prop would have had to switch off the layout, which is the only thing
`Bracket` owns, swap `root` for a list of boxes plus a list of links, and add sockets, which `Bracket` has no
notion of; the keyboard walk would go too, since `to_root` and `to_leaves` mean nothing once a box has two
parents. What the two genuinely share is drawing a curve between two points, and `renderConnector` already
hands that to the consumer — a seam that is already the consumer's is the sign these are two components.

**Both interactions are carries, and they share one zone.** Moving a box and drawing a cable are the same
shape of thing — take something, aim it somewhere, drop it or put it back — so both go through `Carrier`,
with the carry's value saying which it is and the place being a union of a spot on the board, a socket, and a
free point for a cable in flight over nothing. Writing a private drag instead would have meant writing the
keyboard route, the tap route, the cancel and the announcements again: **checked 2.5.7 Dragging Movements** —
"all functionality that uses a dragging movement for operation can be achieved by a single pointer without
dragging" — which the tap carry answers, and 2.1.1 Keyboard, which the key carry answers. Both come with the
abstract rather than being built here.

**A carried box is rendered at the place being aimed at, not at the place it was taken from.** The placements
memo reads the aim, so the sockets move with the box mid-drag and every cable hanging off them is redrawn
against the new socket positions — which is the behavior the whole component exists for. Nothing is written
back to the consumer's list until the drop commits, so an escape puts the box back with one signal read rather
than an undo.

**A node's box is given rather than measured.** `spot` and `size` are both the consumer's, written as
fractions of the board's width (_"positions written as fractions of the width"_ below), so socket positions
are arithmetic on numbers the component already has and the cables are correct on the first painted frame. The
alternative is a `ResizeObserver` per node, which buys a box that sizes itself to its content at the cost of a
frame where every cable is drawn to the origin.

**What refuses a cable, and where each rule lives.** The component's own: an input already holding a cable
refuses a second, two sockets of the same kind cannot be joined, a node cannot be wired to itself, a disabled
socket or a disabled node takes nothing, and the same pair cannot be joined twice. An **output fans out** —
one source can feed several inputs, which is why "taken" is only a refusal on the input side. On top of that
`computeCanLink` is the consumer's, and the Playground's mixing desk uses it for a rule the component could
never know: only the desk may feed the amplifier.

**Unplugging is a press on a connected input.** A cable has to be removable or a wrong connection is
permanent, and the socket that has exactly one cable is the one that can name it without ambiguity — pressing
it removes that cable and announces it. `Delete` and `Backspace` on any socket clear every cable at it, which
is the answer for an output feeding four inputs.

**The board is one tab stop and the arrows walk it.** Left and right step through the stops in reading order —
a box, then its own sockets, then the next box — and up and down step between boxes, so a person can reach a
socket without walking through every box's sockets on the way. `Enter` picks up, the arrows then aim (a box
moves by a step, a cable steps from socket to socket), `Enter` drops and `Escape` puts back.

#### Three things the build found, and what each cost

**A reactive read inside an event-handler prop rebuilds the element under the pointer.** This one is in
`conventions.md`, under _"An event handler prop is bound once, so reading a signal in it rebuilds the
element"_, because it is a Solid rule rather than a fact about this component. Here it read as the keyboard
route being dead: picking a cable up worked, and every arrow press afterwards did nothing, because the socket
element had been replaced the moment the carry started and focus had fallen to the body.

**`CarrierUtils.dragFromPointer` cannot be given a small element.** It listens for the move on the element it
is handed and only takes pointer capture once the pointer has traveled the four-pixel slop that means a drag
— so an element smaller than that journey never sees the move that would start it. A fourteen-pixel socket is
exactly that element, and dragging from one did nothing at all while dragging a whole box worked. `PatchBoard`
hands it the **board root** for both carries instead, which sees every move over the board and captures the
pointer for the rest of the drag. The abstract was left alone: `Sortable` and `SortableGrid` both pass items
large enough for the slop and both work, and changing where capture is taken would change what `click` sees in
two components that are already right.

**A refusal has to be worded while the carry is still in flight.** The drop announcement is composed after the
commit, so a cable that had just been connected was announced as "dropped in Signal chain, Lamp signal, cannot
connect" — the link it had itself just made was now a duplicate, which is one of the refusal rules. The label
asks whether a carry is in hand at all before it says anything about a refusal, and says nothing about the
socket a cable was taken from, which trivially cannot take it back. Same defect and same fix as the place
count under `SortableGrid`, one component along.

#### What the first review of `Trail` and `PatchBoard` found

**The traveler was not on its path, and the transform order was why.** Reported by the user against the
circuit demo. The rule is in `conventions.md` under _"A rotation and a centering offset on one element have to
be ordered"_ — the half-its-own-size shift that centers the traveler was being turned along with it, so the
box swung off the curve wherever the direction was not straight. Their guess was `Viewport` scaling and it was
not: the whole subtree scales together, and the traveler and the path stay in step at any scale. What made it
survive the build is that every check had been made at a window height that happens to give a scale of one and
on the straight top edge of the loop, where the fault is exactly zero.

**A range's paint is a fixed length, so `sizing="fill"` needs a length to match.** Also the user's, on the
timeline demo: the pointer at the right-hand end of the painted track read about seventy per cent rather than
a hundred. `PageRangeContent` draws a track of `RANGE_LENGTH` whatever box it is given; the
control had been told to fill a 320-wide box, so the hit area was 320 and the paint was 220 and the arithmetic
was right about a track nobody could see. Nothing in the library is wrong here — a painter that draws its own
size is the whole point of the split — but **a `Range` given `sizing="fill"` has to be given `length` as
well**, and the timeline slider now passes the trail's own width so the two agree. Worth remembering as the
shape of the mistake: a control whose hit area and paint disagree looks like a bug in the control.

#### `PatchBoard` stands up as well as lying down

Asked for by the user. `orientation` takes `horizontal` or `vertical`, the same vocabulary and the same two
values `Bracket` already uses, and it moves the sockets to the other pair of edges: inputs on the left and
outputs on the right when the board lies across, inputs along the top and outputs along the bottom when it
stands up. Each kind still spreads along its own edge without counting the other, so a box with three inputs
and one output puts the three at thirds of one edge and the one in the middle of the other.

**The cable defs carry the orientation, because the painter has to know which way to bow.** A bezier whose
control points lean sideways is right for a board that flows left to right and wrong for one that flows top to
bottom, where it makes an S lying on its side. The component does not draw the cable, so the fact has to reach
the consumer rather than being used privately — it sits beside `fromKind`, which the painter already needed
for the same reason.

**Nothing else changes, and that is the point of where the prop went.** Placement is the only thing that reads
it: the refusal rules, the carry, the walk and the announcements are all about which sockets exist rather than
where they are drawn, so they were untouched. The Playground shows one board of each — the signal chain lies
across, the mixing desk stands up with its three sources in a row above the desk and the amplifier under it.

### `PatchBoard`, a node graph rather than a list

Settled by the user. The board was `role="list"` with two plain divs between it and each `role="listitem"`, and
the sockets were `role="button"` sitting inside that list rather than inside any item — so the list owned none
of its items, which is the 1.3.1 part.

**The list semantics went rather than being regrouped.** A patch board's nodes are positioned freely, there is
no order to them, and nothing sets `aria-posinset` or `aria-setsize`, so the role never delivered what a list is
for. Keeping it would have meant renaming what a node _is_ purely to satisfy the wrong shape. The board is a
`group`, each slot is a `group` holding its node and that node's sockets, and the node itself is the `button` it
already behaved as.

**A `group` has no required owned elements**, so the intervening divs are harmless — which is the second reason
this beat regrouping the list.

**The socket-to-node relationship was never actually missing.** A socket's name is built from `getEndLabel`,
which is the node's own label plus the socket's, so it already announced as "Oscillator out 1, output,
connected". What the change adds is the structural half.

**One thing this broke and the fix it needed.** `CarrierUtils.INTERACTIVE_SELECTOR` matches `[role="button"]`,
and both node handlers guarded with `closest(INTERACTIVE_SELECTOR)` — so giving the node that role made it
disqualify itself and a node could no longer be dragged. The guard means "did the press land on something
interactive _inside_ the node", so it now excludes the handler's own element. The slot group is deliberately
left unnamed: the node button inside it already carries the name, and labelling both would say it twice.

### `PatchBoard`: positions written as fractions of the width, like `Formation`

**The defaults are the user's, confirmed by eye**: `socketSize`, `socketReach` and `stepSize` were converted from the old
pixel values by the add-ons round rather than tuned, and put to the user, who kept them; so were `Smoother`'s settle
threshold, `Reveal`'s `stepSize` and `Cuboid`'s drag. They are measured values now,
under the rule that leaves those to the user.

**Every spot, node size, socket size, reach and step is a fraction of the board's own width, and the board writes them as `cqw`.** A saved patch does not depend on how wide it was drawn. Zooming was the consumer giving the board more width or scaling it, until it moved into the board as a view — see `PanZoom`. There is no `size`, only `heightRatio`, because once the width is the container's, the only thing left to say is the board's shape. The root is the query container, and a spacer child gives it its height for the reason recorded under `Formation`: an element cannot query itself. The cable surface's viewBox is `0 0 1 heightRatio`, so a painter writes paths in the same numbers the defs carry. `y` is also a fraction of the width rather than the height, so a node keeps its shape on any board.

**The pointer is converted against the measured board box, and nothing else is measured.** `getBoundingClientRect` already includes every CSS transform above the board, whether `Viewport`'s or a consumer's zoom. Dividing by the rect's own width therefore lands the pointer in board fractions with no scale prop and no call to `viewportContext.getScale()`. This is the pointer-against-client-rect case the `Viewport` convention says must not be converted.

**Pan is a view, and the board keeps a keyboard-carried item in it.** Walking the board moves focus, and focus outside the window brings the window to it. Carrying a node does not move focus, so while a carry is in keyboard mode the aimed node or socket is brought into the view the same way. Without a view, the old behavior stands: the consumer's scrolling container is scrolled to the aimed item's nearest edge.

**Bracket stays in pixels, and that was argued.** A bracket's natural size comes from its content — leaf count times node size — and it already lays out in counted units internally, so fractions would squeeze a large draw into the same box as a small one. A fitted bracket is one line for the consumer through `BracketUtils.computeLayout`; the reverse would not be possible from a fraction-based one. PatchBoard has no count to measure against, because its nodes are placed by hand, so the board is its only ruler. Timeline already works in ratios along its time axis.

### `PatchBoard`: snapping is a spot-to-spot function, and an arrow key goes to the next snapped spot

**`computeSnapSpot(spot)` is applied to every aim, not only to the drop**, so the node visibly moves in snapped steps under the pointer and what is dropped is what was shown. **A keyboard step cannot just be snapped**, because a step smaller than the grid would snap back to where it started and the key would do nothing. So `getNextSnappedSpot` probes the direction one `stepSize` at a time and takes the first snapped spot that is further along. Shift repeats that four times.

### `PatchBoard`: refusing loops is a helper for `computeCanLink`, not a board rule

**The board allows feedback, because some patches need it.** `PatchBoardUtils.getClosesLoop` is the pure answer a consumer calls from `computeCanLink`. It follows links node to node, regardless of which socket each link uses.

### `PatchBoard`: boards that share a `groupId` pass nodes between them, landing where they were held

The user's call, with a Playground example ("Two boards, one group"). The board's zone already
took a node out of one board and put it into another (`takeAt`, `putAt`, cables to it removed), but two things made it
jump: where the person was holding the node was kept by the board it was picked up from, so the board it was dropped
on placed it by its top-left corner; and the source board drew the node at the aimed place even while another board was
aimed at, in its own coordinates. **The grab point now travels with the carry**, as a share of the node's own size
(`grabRatio`), so it means the same thing on a board of any width, and **a board draws the carried node at an aimed
place only while it is the board aimed at**. The `groupId` doc says sharing is supported. **While another board is aimed at, the
board being aimed at draws a preview of the arriving node where it would land** — the consumer's own `renderNode` with
`isCarried` set, `inert` and hidden from screen readers, so it is not a second control — **and the board it came from
hides the node and its cables**, so it is never drawn twice; a drag that ends anywhere else brings it back. The user
found the preview "not perfect, but much better" and chose to keep it simple for now.
