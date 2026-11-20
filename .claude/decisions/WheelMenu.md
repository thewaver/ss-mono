# Decisions: `WheelMenu`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `WheelMenu`: the wheel becomes a component, and `Menu` forgets it ever knew

The user's call, after the wheel's needs started leaking into `Menu`'s item list. A wheel is a menu whose
items are angular; everything angular now lives in a thin component over `Menu`, and `Menu` is a menu again.

**The close control is an ordinary item, which is what took the last of it out of `Menu`.** Everything the X
needed — a place in the walk, a highlight that excludes every other, activation that closes the menu — a menu
already does for every item it has. So `WheelMenu` appends one to the list it hands down and intercepts its
activation so the consumer never sees it; `Menu` lost a sentinel index, a second highlight flag, a second view
component, a second walk and the `closerDefs` prop. `PlacementLayout` lost its `closer` slot with them: the
layout places one more item, in the hole, because the layout is what knows where the hole is.

**One thing had to be added to `Menu` for that to work, and it is not about wheels.** An item whose painter
draws a glyph has no accessible name, so `MenuItem` gained `ariaLabel`. That is a general want — an icon-only
row in any menu has it — and it is what lets the X be an item rather than a special case. Typeahead is
unaffected without a rule: the accessible text is read off the rendered row minus anything `aria-hidden`, and
a hidden glyph leaves nothing to match.

**A layout is told which branch it is laying out, not only how deep.** `PlacementLayoutDefs` traded `level`
for `path`, the indexes from the root down to the item that opened this level, and gained that item's
`parentPlacement`. Depth alone could not answer "whose children are these", so a component holding per-item
hints had nowhere to look them up; and a submenu that wants to point at its opener needs the opener's angle.
`path.length` is the old `level`, so nothing was lost and nothing is stated twice.

**Arcs are sequential from one start angle, and an item asks only for its own share.** The user's
simplification, and it removes a whole class of problem: no item names an absolute angle, so two items cannot
collide, and there is no rule needed about who wins. An item may declare `arcDegrees`; the rest split what is
left. Two protections finish it — the block is normalized down if it would exceed the level's spread, and its
start is chosen so it sits inside that spread rather than being squashed to fit.

**The root fills its spread; a deeper band is only as wide as its items need.** A band four levels out has a
radius several times the root's, so the same angle there is a far longer arc — which is how a two-item
submenu ended up sprawled across a half-circle. Below the root each wedge asks for a target arc _length_
instead, converted to an angle at that band's radius, so a wedge is about the same size however deep it is.
The block is then centered on the wedge that opened it, which is the thing that makes three bands legible.

**Where the pieces live.** `Menu` is in `Essentials/Menus`; `WheelMenu` and `FanMenu` are in `Exotics/Menus`, moved
there by the user, and import `Menu` across. The Playground keeps all the menu pages under `Pages/Menus`, and the
left-hand nav has a Menus group under each category. The arc factory itself is sample code
rather than component code, and it lived in `Samples/Menu/Layouts` for as long as a menu was the only thing
asking for one — see _"Every layout sample lives in one place, and none of them is a menu's"_ for where it
went once that stopped being true.

### Hold and flick: the wheel's fast path, and the three criteria that shaped it

`Menu` gained `opensOnHold`. With it on, pressing the opener brings the menu up straight away, moving a short
way in the direction of an item highlights that item, and letting go runs it — the pointer never travels as
far as the thing it picks. It is `PlacementUtils.pickIndex`'s second caller, after `Sortable`'s drop
targeting, and the one the abstract was originally named for — a layout has an inverse, and hit-testing is
not it.

**The gesture may only exist because the two ordinary routes still do, and that is a conformance requirement
rather than a courtesy.** 2.5.1 Pointer Gestures asks that "all functionality that uses multipoint or
path-based gestures for operation can be operated with a single pointer without a path-based gesture", and its
understanding document names flicking in a straight line as exactly such a gesture. 2.5.7 Dragging Movements
asks the same of anything "that uses a dragging movement for operation". Both are answered by the same thing:
a press that never travels leaves the menu standing, so the wheel can be clicked open and then clicked
through, with no path and no drag. 2.1.1 Keyboard is untouched — the walk was already there.

**2.5.2 Pointer Cancellation is the one that shaped the gesture itself.** Opening on the press means the
down-event is doing part of the work, so the "No Down-Event" clause is out, and the wheel is not essential
either. What is left is "completion of the function is on the up-event, and a mechanism is available to abort
the function before completion". So the pick lands on release and never before, and coming back toward the
middle before letting go clears the choice and runs nothing. **The abort is a real branch of the code and has
a spec of its own**, because it is what the conformance rests on: an implementation that lit a wedge and kept
it lit while the pointer came home would look the same and fail.

**The threshold is a share of the layout's own width, not a pixel count.** `FLICK_TRAVEL_RATIO` is 0.1, so a
wheel measuring 296px across asks for about 30px of travel and a bigger wheel asks for proportionally more,
which is right — a wider ring is a longer reach. Under the threshold nothing is picked and the highlight falls
back to where opening put it, so the display and what release would do never disagree. **The number is a first
guess and not a measurement**, unlike the tuned constants elsewhere in the repo.

**The level owns the gesture, because the level is what owns the layout.** `Menu` detects the press and hands
down the point it started from; `MenuLevel` converts client coordinates into layout space off the box of its
own layout root — divide by the measured width, which cancels whatever scale `Viewport` has applied — and
`PlacementUtils.pickIndex` does the rest. Nothing about the wheel appears in either: a layout declares its own
`pickRule`, so an arrangement nobody has drawn yet is picked from by the same code.

**`pickIndex` had a defect that only a layout with something in the middle could reveal.** An item placed on
the origin has no direction to be aimed at, and `Math.atan2(0, 0)` is zero, so the wheel's center X scored as
though it pointed due east and won any flick that went that way. The guard the query point already had is now
on the placements too: under the `"angle"` rule a placement sitting within `NO_DIRECTION_RADIUS` of the origin
is passed over entirely. `Sortable` reached the same function first and never saw it, because a sortable ring
puts nothing in its hole; hover, the other way an item is chosen, hit-tests and cannot see it either.

**A press on an open menu is the ordinary close, and the click that ends a gesture is swallowed.** Opening on
the down-event means the `click` that follows would otherwise toggle the menu straight back shut, so the press
that opened it marks the next toggle spent. A second press, on a menu that is already open, arms nothing and
lets the click through — which is how the opener still closes what it opened.

**Flicking onward through a submenu is not built.** A flick that lands on an item with children opens that
level on release, and the pointer is up by then, so reaching the band underneath means pressing again. Nothing
opens a level mid-gesture, because nothing hovers during a flick.
**Two callers now turn a client point into a layout point, and each does it by hand.** `Sortable` divides by
the box's height and hands the share to `toLayoutPoint`; the flick divides by the box's width and skips it.
The two agree, since a layout's height is its `heightRatio` of its width, but the conversion is stated twice
and the abstract owns neither spelling.
