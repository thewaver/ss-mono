# Decisions: `FlipCard`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `FlipCard`: the smallest thing that can turn a barrel

**A card is not a carousel, and inheriting the carousel's contract was the alternative that got refused.** The
options were a Playground example of a two-slide `DrumCarousel`, a preset over the carousel shell, and a
component of its own over `Barrel`; the user took the third. A card has no sequence — nothing wraps, there is no
picker, nothing rotates on a timer, and there is nothing to announce as "1 of 2". What it needs is two faces, a
side to show and a duration, and everything else the carousel holds would arrive as vocabulary a consumer has
to ignore.

**A flip card is the degenerate barrel rather than a special case of one.** At two faces the apothem works out
to zero, so the pair sits back to back with nothing between them, and the existing rule that a barrel prints no
reverse below three faces already covers it. Nothing was added to `Barrel` to make this component: two faces, an
angle that moves in steps of `180°`, and the same `computeFaceDefs` every other consumer uses. That it needed nothing is
the evidence the abstract was drawn in the right place.

**The barrel's own front and back are not the card's two sides.** A barrel slot has a front and a reverse; this
card's sides are two _slots_, at `0°` and `180°`. The distinction matters only when reading the code, and it is
why `FlipCardFace` is a different idea from `BarrelFace` despite being the same two words.

**By default the angle reverses rather than accumulating.** With `turnDirection` unset, flipping back turns the
card the way it came, which is what a hand does with a card. Setting `turnDirection` sends every turn the same
way instead, and then the angle does accumulate, as the drum carousel's does — see _"`turnDirection` makes the
angle accumulate"_ below.

**`flipped` is required, and the card renders no control at all.** Two reasons, and the first is the
hard one: a card's faces hold arbitrary content, which may itself be interactive, so the card cannot be a
`<button>` without swallowing whatever is inside it. The second is `Carousel`'s recorded exposure — a library
that renders no button cannot promise one is reachable or named — which means the page must own the control
either way. The signal is required rather than optional because an internal one nobody can set is a card that
can never turn.

**It sits in `Exotics`, and it took two passes to get there.** The first placement was `Essentials` beside
`ImageSwitcher`, derived rather than asked: it swaps one piece of content for another with a transition, which
is what `ImageSwitcher` does for a single image. The user moved it. The `Exotics` test — renders DOM, holds no
value, lays elements out or turns them — takes it, and **turning is the part that decides**, which is the same
line `Cuboid` was placed on. Where the two folders divide was the user's call and now has an answer for the
turning components: a thing that rotates in space is an `Exotic` whatever else it also does.

### `FlipCard`: `turnDirection` makes the angle accumulate

**Unset, the card retraces the way it came; set, every turn goes that way and the angle keeps accumulating.** The angle is a running total changed by ±180° on each turn. Unset is defined as "a turn to the back goes forward, a turn to the front goes backward", which is the rocking motion described above. Because it uses the same running total, switching between set and unset at any point never makes the card jump. `forward` is the default first turn: the right edge of a row card goes away from the viewer, and the top edge of a column card. That is what lets a page turn the card toward whichever edge was pressed.

### `FlipCard`: `peekRatio` is a lean, not a turn

**A lean never touches `flipped`.** The side that counts as showing, and the one a reader can reach, stay put however far the card leans. Deciding that a lean has gone far enough to become a turn is the consumer's to do. The lean goes the way the next turn would, so it follows `turnDirection` when that is set. While the value is above `0` the transition is switched off, so the card follows a drag or a slider directly instead of lagging behind it. Back at `0`, it settles flat over `transitionDurationMs`. Reduced motion is the consumer's here too.
