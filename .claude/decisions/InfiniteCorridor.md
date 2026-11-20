# Decisions: `InfiniteCorridor`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `InfiniteCorridor`: looking down a corridor of items, walked by a progress from outside

Asked for by the user from two published Framer components, one with a tidy row on each wall moved by scrolling and one
with pictures strewn over both walls and a switch between moving by itself and moving with the scroll. Both
arrangements are layouts here, and both kinds of motion are the consumer's.

**A component of its own rather than two `Carousel` arrangements.** The user's call. A carousel has one current slide
and keeps the rest out of the keyboard and out of a screen reader; in a corridor every picture is equal and nothing
sits in front, so the carousel's rule would leave one picture reachable at a time. `Wraparound` was the other
candidate and was set aside because it repeats one measured block of content across a flat grid, where a corridor
places separate items on two walls in perspective.

**The name says it never ends.** The user's `InfiniteCorridor`, over `Corridor`: `Wraparound` already says in its own
name that it comes round again, and `Corridor` says nothing about it. It holds while the corridor always loops, which
it does — a progress outside `0` to `1` comes round, and `1` is the start again.

**It has no motion of its own; `progress` is the position.** The user's call, in the library's usual shape: scroll, a
clock, a random source or anything else writes it. So the pause WCAG 2.2.2 asks for is the consumer's, as it is for
the carousel's turning ring, and the Playground's clock example carries a Play/Pause button and starts paused under
reduced motion.

**The layout is a rule, as a carousel's arrangement is: `{ place, reach, focusDistance }`.** `place` answers from a
drawn item's distance down the corridor with its size, its offset in pixels, its turn, the perspective and its
opacity. `walls` packs one row on each wall at eye level, its items taking turns between the walls by their slot.
**`walls` is one layout with an angle rather than two layouts.** The user's two reference pictures — items flat against
the walls like a maze seen from inside, and items turned towards the viewer in two angled stacks — are the two ends of
`angleDegrees`, since the spacing down the corridor follows the angle and packs items edge to edge at whatever angle
they stand. The angle was then split into `nearAngleDegrees` and `farAngleDegrees`, both `75`, the user's call so a
consumer can turn the near items differently from the far ones; the angle turns evenly between them down the drawn
length, and an item's depth is the running total of the spacing up to it, worked out in closed form, so neighbors
still meet. **A first `scatter` layout, items strewn over both walls at drawn heights and sizes, was taken out** by the
user, to be rethought differently later; nothing else depended on it. **The walls stand at the box's edges level with the viewer, and `farWidthRatio` sets how far apart they
look at the end of what is drawn**, the two joined evenly in between; the user's correction of a first build whose one
width moved both ends together, so a narrow corridor pulled the near rooms in from the edges instead of tapering. **The
width is as it looks on screen, not as it stands in depth**: the second build set the far width in depth, the
perspective shrank it again, `1` did not keep the walls at the edges and the walls met near `0.15`. The far end's
position is grown by the reverse of the perspective at the far end's depth, so `1` keeps the walls at the box's edges
all the way down — where the rooms further back stand directly behind the nearest ones — and `0` brings them together.
**Each wall is flat, leaning in from the box's edge so it looks the far width apart at the far end.** The user's
correction of a build that joined the two evenly in distance and grew each item by the reverse of the perspective at
its own depth: that bent the wall into a curve, and on screen its top and bottom edges drew a rounded taper. A flat
wall's edges are straight lines on screen. The lean is solved in closed form from the far width and the wall's length,
and a far width too narrow to reach in that length turns the wall as far across as it can go. **The far width is the
gap the last items leave between them, measured at the innermost point anything at the far end is drawn**: the inner
edge of the last item, where it has finished fading. The user read the setting as a share of the box kept clear, and
the first flat build measured it at the middle of the last fully drawn item, so that item's far half and the fading
one beyond it came within a few pixels of meeting at `0.1`. Measuring it where the fading item ends keeps the drawn
length as it was, rather than finishing the fade earlier. Where the corridor narrows that point is the closest anything
comes to the middle; where it barely narrows, an angled item near the viewer sticks in further, since it stands at the
box's edge and reaches in by its own turn. At `1` the wall runs
through the viewer's eye and is seen edge-on, so items lying flat on it vanish, which no arrangement can avoid.
**Items are packed along the wall and their angle is measured from it**, so at `90` each lies flat along the wall and
starts exactly where the one before it ends. The first build kept every item pointing straight down the corridor and
placed only its middle on the wall, so where the wall narrowed each item's ends stood off it and neighbors stepped in
and out by tens of pixels; pinning each item's corners, as the tube does, was weighed and set aside, since a turned
item is drawn exactly once the wall is flat. The cost is that at a low angle the stacks lean with the wall rather than
facing straight down the corridor. **`staggerRatio` says how far the right wall's items stand behind the left's**:
`1`, the default, half an item further down than the slot before, so the walls take turns; `0` level with it, so the
two walls stand side by side. Asked for by the user as a switch, then taken as a ratio in the library with the
Playground showing it as a switch. Only the right wall moves, by a fixed share of a slot, so the corridor still moves
smoothly, and with every item on one wall it changes nothing. Every
item's box is centered on the corridor's middle before it is moved, so the per-item perspective
gives the whole corridor one vanishing point, the way the carousel's slides share theirs.

**Too few items are repeated, and the copy nearest the viewer is the real one.** The user's call, over drawing each
item once and over `Wraparound`'s moving original. The repeats are the carousel's (`followCopies`), but the ring is
measured forwards: an item is behind the viewer only within one place of having passed, so the ring needs room for the
reach plus one, not twice the reach. When the real copy passes behind, the next one along takes over, and anything
focused in it loses focus as it leaves the view.

**Focus brings an item into view by moving the corridor and writing `progress` back.** The user's call, over leaving
items out of view unreachable: a scrolling box scrolls to what takes focus inside it, and so does this. A page driving
it from a scroll position follows by scrolling to the progress written, as the Playground's scrolled example does. An
item counts as in view from half the layout's `focusDistance` out to twice it; `walls` brings a focused item to the front
of its wall, since anything further back stands partly behind the items in front of it.

**It glides the copy that took focus, by its own distance, never the short way round.** The first build glided the
item the short way, and going backwards brought another copy round from behind the viewer, which became the real one
mid-glide and took focus away from the element holding it. Moving the focused copy by its own distance keeps it the
nearest all the way.

**Its own writes coming back do not stop the glide.** A page scrolling to each progress reads the scroll back a frame
or two later, in whole pixels and moved by whatever else nudges the box, and the first build took the very first of
those as someone else taking over and stopped on the first frame. `getIsEcho` counts anything within a hundredth of a
lap of the last few writes as the corridor's own.

**Its items are not expected to be interactive.** Stated by the user when a fix for copies taking over as the real
item was argued: the corridor is a view to look down, and whatever it draws is decoration. That is why the hand-over of
the real instance as the ring turns is an accepted limit rather than a fault — it can only lose state an item is not
expected to hold. The keyboard route and the copies kept out of reach still stand, for the consumer who puts a
focusable thing in an item anyway.

### `InfiniteCorridor`'s tube: items lining a ring of sides, upright towards the center

From Framer's 3D SpatialGallery, a WebGL tunnel of pictures round its axis. Named `tube` by the user, since a tunnel can
be square, lozenge-shaped or a half-circle. It is a third layout rather than a shape setting on the component: the walls
were always a tube with two positions round it.

**Each item lines the tube's side, facing the middle, with its top towards the far end.** The user's call, from a
screenshot of the effect: on screen every item then stands upright towards the center — upright below the middle, on
its side to the right, upside down above. The placement grew a `rollDegrees`, round the corridor's axis, and a
`tiltDegrees`, leaning back about the item's level line, both left out by `walls`; the transform moves,
rolls, leans, then turns. The tube is a ring of flat sides, `12` by default, rather than a smooth circle, because every
item is flat. **Its `farWidthRatio` is the size of the hole at the far end**, as it looks on screen, the user's call
once the setting turned out to do nothing for the tube: the near ring stays at the box's edges and each ring's radius is
grown by the reverse of the perspective at its depth, as the walls' width is, with each item widened to match so the
ring stays closed. **That growing stops at both ends of what is drawn**: past `visibleRings` the radius holds and
the tube carries on as a plain tube shrinking to its vanishing point, and behind the viewer it holds at the near ring
and widens as it passes. Grown all the way, every ring past the far end sat at the hole's size on screen, so an item's
near and far edges landed on one circle, its pinned corners lay on a line, and the fully opaque ring at the limit was
drawn as garbage; the passing ring flattened onto the box's edge the same way. **Rings always touch**: each item runs from its own ring's edge to the next ring's, the user's call
after a narrow far end left dark bands between rings that each lay flat at one radius.

**Each item's four corners are pinned, through `QuadWarpUtils`, rather than the item being moved and turned.** The
user's call, which is where `CornerPin` came from. The first build stretched a rectangle to the average width of its
two edges and leaned it to follow the taper; the right shape between two rings of different size is a trapezoid, so a
rectangle stuck out at one end and fell short at the other, and with a twist the next ring's item did not start where
this one ended. `CorridorLayoutUtils.computeTubeCorners` places the four corners where the side crosses its own ring
and the next, each edge turned by its own ring's twist, leans them about the item's middle line by `tiltDegrees`, and
projects them the way `perspective()` would; `InfiniteCorridorUtils.toItemStyle` stretches the item onto them with
`QuadUtils.toCss`. So neighbors share corner points exactly, round the ring and on to the next. With a twist
the far edge is turned further than the near one, so the four points are no longer on one flat surface in depth; the
item is drawn as the flat shape the four points make on screen, which is what makes the corkscrew close. A placement is
therefore one of two shapes, `InfiniteCorridorTurnedPlacement` (the walls) or `InfiniteCorridorPinnedPlacement` (the
tube), told apart by whether it carries `corners`; both names carry the distinguishing word, since neither is the
general case. An item with a corner level with the viewer or behind cannot be projected, so its corners are
`undefined` and it is hidden, which the fade already does by then at every default.

**Every tube item is laid out at the nearest ring's size, and pinning does all the shrinking.** Found by the user, who
guessed it from the far ring looking wrong after the geometry was right: each item was laid out at its own true size,
under forty pixels wide by the third ring, so a label spilled out of the box and a painter's rounded corners ate most
of its width — and pinning stretches whatever spills along with the box, so the overlap read as wrong corners. Laid
out at one size, a far item is an exact smaller copy of a near one, content included.

**A steady spin is an angle the consumer turns, not a clock in the layout.** The user asked for a rotation speed
independent of traveling down the tube, and picked it over the twist when the two seemed to compete; both remain,
since the twist turns each ring by its depth and the spin turns the whole tube. `spinDegrees` is how far the whole tube
is turned, and the Playground's Rotation speed turns it on a clock, the way the carousel's turning ring is driven from
its example, so the component keeps no timer of its own and the pause WCAG 2.2.2 asks for stays the consumer's; the
Playground starts it at `0`. **Each example runs its own spin clock**, the page handing down only the speed and a way to
build the layout at an angle: the Clock example's Pause has to stop everything that moves in it, the spin included, and
a single clock on the page could not stop for one example without stopping the other.

The page shows each layout's own settings the way Formation does — a knob list per family,
held per layout, every setting of the layout shown, the layout and its settings in a row of their own above the
corridor's own settings — with Rotation speed added for the tube, since the spin is driven rather than set.

**`minSkipCount` and `maxSkipCount` leave empty slots, and every slot keeps its size.** The user's definition, for the
walls and the tube, first as one count and then split into a range drawn per item, the user's call, from the item's
index and a seed, so a copy has its original's gap:
the walls are a run of slots taking turns left and right, so a skip of `1` puts every item on the left wall and `2`
alternates walls with gaps; the tube's slots run round each ring, so a skip of `2` leaves two empty sides after each item
and the gaps carry on into the next ring. Both layouts work in slots — an item's slot is its place times one plus the
skip — and convert their reach, focus distance and behind distance back to items, using the narrowest gap for how far
they reach and the middle one for where a focused item lands. With a range, an item's slot is the sum of the gaps
before it, worked out once per item count and ring length, and a position between two items runs evenly across the
first one's gap; so the layout is handed the real item count beside the ring. The tube's whole-ring rule became a
function of that count — the list is repeated until items and gaps together fill whole rings — since the slots one lap
takes depend on which items there are.

**The walls' depth is `visibleCards`, counted in card lengths along one wall.** Asked for by the user as the walls'
counterpart of the tube's rings drawn, once the item count turned out to change only how many different items repeat.
It replaced a `visibleDistance` counted in slots across both walls, which took two slots to make one card length and
read as half what it said; the layout converts it back to slots, empty ones included.

**Rings, not one corkscrew.** The user's call, over items each a little further round and further down than the one
before. A ring holds one item per side at fixed positions and a twist turns each ring further round as it comes towards
the viewer; the cost is that the drawn items must fill whole rings, so the layout says `placeMultiple` and the corridor
repeats the list until it divides — 16 items in rings of 12 are drawn 192 times at the defaults, which is the heaviest
page this component makes. The layout also says `behindDistance` of a whole ring, so a ring passes the viewer whole
instead of losing one item at a time to the far end.

**Where a focused item is brought is `focusDistance`, and the tube's is `focusRings`.** The user's call, taken over
renaming only the labels: it was `viewDistance` on the layout rule and on the walls, and `viewRings` on the tube, which
said nothing about focus and read too close to `visibleRings`, the rings drawn. One idea gets one name at every level, so
the rule's member moved with the two layouts' settings. **The tube's width level with the viewer is `nearWidthRatio`**,
which was `radiusRatio`; same number, now stated as a width so it pairs with `farWidthRatio`.

**The real copy is the nearest one ahead of the viewer, never one behind.** Written for the copies decision and
first built including the item just passing by; with a whole ring allowed behind, that put most real items out of
sight. A focused item is brought no further than one item count down the corridor, since its next copy towards the
viewer would otherwise take over once it arrived.
