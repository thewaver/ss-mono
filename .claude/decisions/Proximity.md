# Decisions: `Proximity`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Abstracts/Proximity`: an arrangement reacts to the pointer, and the reaction is the consumer's

The second half of what a layout function does, on the same split. `computeLayout` says where the items go;
`computeEffect` says what being near the pointer does to one, and both are functions the consumer passes in,
so the library never holds a list of named effects. A macOS dock, a row that brightens toward the cursor and a
ring whose far side dims are the same mechanism answering differently.

**An effect answers in CSS function names, which is what makes it general without becoming a string.** The
type is `CSSAnimationValues` — the same `Partial<Record<CSSAnimationKey, number | number[]>>` `CellAnimation`
evaluates per cell — so a scale, a translate, a brightness and a blur are all one vocabulary and the item does
not need a prop per response. A structured alternative with `scale`, `offset` and `opacity` fields was
rejected on the obvious ground: the next effect wants `hue-rotate`, and the one after that wants
`drop-shadow`.

**Which meant one writer for both, and it went to `ss-utils` rather than to a shared spot here.**
`CellAnimation` held the ordering table and the unit formatter privately, beside the `ANIMATION_UNITS` table
that already lived in `ss-utils`; splitting a writer from its own units across two packages is the thing to
avoid, so `CSSUtils.toAnimationStyle` is where both go. It answers with `transform` and `filter` in full every
time, which is what lets a caller assign the pair and have a value that stopped being produced stop applying.

**`PlacementBox` tracks the pointer and `PlacementItem` measures itself against it.** The box is the layout's
own coordinate space — a container whose height is `heightRatio` of its width — so one `PointerTracker` on it
gives `boxRatio`, and `toLayoutPoint` turns that into the same coordinates the placements are in with no
measuring of anything else. The two talk through a context, which is `RadioGroup` and `Radio`'s arrangement:
every consumer already renders a `PlacementItem` inside a `PlacementBox`, so not one of the nine call sites
had to learn an index or thread a reading down. Tracking is off entirely while no effect is passed.

**Effects are per item and pure, which is what stops the feedback the dock example warns about.** Each item is
measured against the resting layout, never against where its neighbors have moved to — grow an item from its
live position and it shifts its neighbor, which changes that neighbor's distance from a pointer that has not
moved, which changes its size. What a consumer gives up is a `zoom_in` that genuinely re-flows the run: the
displacement is a transform, so items pass over one another rather than pushing. `zoom_in` gets the look back
instead by displacing each item by the running total of what its inner neighbors grew.

**That running total is counted item by item, not integrated.** It was first the falloff curve integrated into a
closed form, scaled by a `pushRatio` quoted in item widths with a default of `0.75`. That left neighbors in a row
overlapping by about 5% of an item width with the pointer on the row, and by close to 30% with it near the
row's top edge — the integral ran along the straight line to the pointer, where the room is needed along the
row. The user asked for it fixed, rows and columns being where an overlap reads as a fault. Each item is told its
own position and the run's spacing, so in an evenly spaced run it can list every item between itself and the
pointer and add up their growth exactly (`toRoomNeeded`): each pair parts by the growth of its two facing halves,
and the two items either side of the pointer split their own pair's share in proportion to how far each is from
it, which hands over without a jump as the pointer crosses an item. A row and a column split the pointer's
offset into the part along the run and the part across it, and an arc counts along its arc length.

**A scatter is not counted, because it cannot be.** The count was first used everywhere, and on a cliff the
user saw items leap as the pointer came down through it: a scatter's items do not sit at whole spacings from
one another, so the count rounds each distance to a number of steps, and whenever the rounding tips over the
item moves by a whole neighbor's growth at once. So only arrangements declaring `"horizontal"`, `"vertical"`
or `"arc"` are counted.

**A scatter grows its space instead, like a lens, and its layout picks which of two lenses.** The user's call,
after a smooth estimate stopped the leaping but left the overlap: take both of D3's fisheye distortions and let
each arrangement point at one internally, so they can be compared by flipping a word. `PlacementLayout.spreadRule`
is that word — not a prop and not a knob, set by the layout the way `reachRule` is, and ignored by a run.
`"circular"` (the default when unset) stretches every distance out from the lens's middle by what an item at that
distance grows by, so items move straight away from it; `"cartesian"` stretches across and down separately, so a
line of items stays a line and an item level with the pointer moves aside however far off it sits. **D3's fixed
rim is dropped from both**, because a lens keeps its edge still by squeezing what is just inside it, and an item
there does not shrink to match. Without it everything beyond the lens moves outward, as a row grows longer.
**Off to one side of the items, the circular lens moves to the nearest point of the box their centers cover**,
weakened by how far off the pointer is. Grown from the pointer itself, it shifted the whole scatter away to
stretch empty space, and subtracting that from each item's travel instead left neighbors at about 75% of the
room they needed; moved to the box, it grows nothing the pointer is not near and stays a lower bound on every
item's growth. The cartesian lens handles the same case per axis, exactly. Both keep neighbors at about 95% of
the room their growth takes or better, the rest being that an item scales by one amount while the stretch
varies across its width. Honeycomb starts on `"cartesian"`, being a grid; cliff, whorl and zigzag on
`"circular"`. **`pushRatio` is now a
share of the room the growth takes, defaulting to `1`**: at `1` neighbors part by exactly what they grew, below
it they overlap by the rest, above it they open gaps. `ProximityEffects.utils.test.ts` sweeps a real row and
column with the pointer on, between, past and off them and asserts no two neighbors overlap, and walks the
pointer down through a cliff, a zigzag and a honeycomb under each lens and asserts no item moves by more than a
few times the step.

**That integral is anchored to the run's own span, not to the pointer's raw coordinate.** The first version
measured every item's push from its own distance to the pointer alone, which reads "past one reach" the same
way whether the pointer is genuinely near another item or has drifted off the end of the run entirely with
nothing there to have grown — so a pointer far past the whole run still pushed every item by the same large,
constant amount, and two items equally near the pointer (the common case of it sitting between them) both read
as "at the growth center" and got zero push each while both were still growing, colliding into each other.
`PlacementUtils.getRunOverreach` is the fix: `0` anywhere between the run's first and last item, where the gap
to a neighbor is a real gap between real neighbors, and only positive once the pointer has actually left the
run's own span. `ProximityEffectDefs.overreach` carries it, and `zoom_in`'s count of the room needed starts at
the run's end once the pointer is past it: there is nothing between the pointer and the end item to have grown,
so the end item grows where it stands and only the items behind it give way.

**Nearness is not a straight line, and an arrangement is the only thing that knows what it is.** The user's
diagnosis, and it is the whole architecture rather than a correction to it. In a ring what separates two
wedges is the turn between them, so measuring across the middle makes the far side read as near and the whole
thing respond at once. So `PlacementLayout` carries a `reachRule` beside its `pickRule` — `"horizontal"`,
`"vertical"`, `"arc"` or `"plane"` — and `PlacementUtils.getReachDistance` is what everything measuring
nearness asks, spacing included, so a reach and the spacing it is quoted in are in the same units whatever the
shape.

**A row and a column measure a straight line, the same as a scatter.** They first counted only the gap along
their own axis, so that a pointer a little above a row would not make it go quiet, and paired that with a gate
at the box's edge on the other axis (below). The user found the result on the Formation page: coming at a row
from above, the pointer crossed the gate with the horizontal gap already small, and the item it was over jumped
to full size at once, while approaching along the row grew it smoothly. Cliff, measuring a straight line with
no gate, had no such blind spot, and the user asked for every axial arrangement to behave like it. So
`"horizontal"` and `"vertical"` now differ from `"plane"` in two places only: `getReachBearing`, so an item
giving way still moves along its run, and `getRunOverreach`, which measures the straight line from the pointer
to the stretch the item centers cover rather than to the nearest item — the nearest-item answer swells and
shrinks as the pointer crosses the gaps between items, which would make the push pulse along a row.

**The same rule read as a direction is what an item gives way along**, which is `getReachBearing`. Whatever
the rule ignores when it measures, it also refuses to move along: a row's items part sideways however far
above them the pointer is, and a ring's turn about their own center rather than sliding across the middle.
That last one was a visible fault before the rule existed — two neighbors displaced along the chord between
them both drift inward, and the circle buckles exactly where it was meant to spread.

**Which way round the run the pointer lies is read about the middle of the run, not by the shorter way.**
Two wrong answers preceded this one and both showed as the same thing — the item at the far end of an arc
giving way into its neighbor instead of away from it. The first signed the tangent by its agreement with the
straight line to the pointer, which is right in the middle of a run and unstable at the ends of one, the
chord there being nearly at right angles to the item's own tangent. The second took the shorter way round,
which is ambiguous at exactly half a turn — and a half-turn arc's two ends are exactly that far apart, so the
ambiguous case is not an edge case but the default arrangement. `PlacementUtils.getRunFacing` reports the
circular mean of where a run's items lie and both bearings are unwrapped about it, which puts the ambiguity
diametrically opposite the middle of the run — off the run entirely for anything that does not close. A run
that does close has no middle, its items canceling out, and reports zero; nothing reads it, because a closed
run is not pushed along at all.

**And the travel takes its direction from that same answer rather than working it out again.**
`toRunDisplacement` reads the bearing and takes the sign from its agreement with the tangent, so the way an
item is sent and the way it was said to lie cannot disagree — which they did, once.

**And traveling along a curve is a rotation, not a step along the tangent.** A tangent step is only the
first term, and an item giving way travels far enough for the rest to matter — on a half-turn arc of six, a
push of three quarters of an item width is a twenty-seven degree step, and the straight tangent leaves the
curve far enough that neighbors overlap, which is what the user saw. `ProximityUtils.toRunDisplacement`
swings the item about the pivot by the angle that distance is worth at its own radius and answers with the
chord, so every item stays on the curve and the spacing between them is preserved exactly.

**`"arc"` answers in arc length rather than in degrees**, swept at the item's own radius, so it stays
comparable with every other length in the layout. It is a cousin of `pickRule`'s `"angle"` and the two were
deliberately not merged: picking asks which item a direction means and reaching asks how far away something
is, and one is not derivable from the other.

**How far round the run is the caller's reach; how far off the band is the arrangement's.** A turn alone
treats every radius as equally near, which is wrong the moment an arrangement has more than one band — a
nested wheel menu's inner and outer items share a bearing and are not the same distance away — and on a
single band it makes the whole ring answer at full strength from anywhere in its column. What was tried
first and is wrong is folding the two into one length and handing it one reach: the reach is quoted in
spacings, and a pointer sitting on the pivot is then some arbitrary fraction of a reach from every item,
which is why the middle of a ring lit the whole ring up at about half strength.

**The two are bounded differently, and that is the reason they cannot share a reach.** How far round an
effect should carry is a matter of taste, so it is a number the caller picks. How far in or out it can carry
is not, because the space is finite — a pointer cannot travel further in than the pivot. So the radial part
spans exactly the run's own radius, which is the whole of the room there is, and
`ProximityEffectDefs.radialShare` reports it as a share of that: `0` on the band, `1` at the pivot, and `1`
again as far outside the band as the pivot is inside it. `getFalloff` takes the two in quadrature, so a
turning arrangement gets the one profile that is right — nothing at the pivot, everything on the band,
nothing again on the way out — and a turn can never make up for being off the band, which is what would
otherwise let the far side of a ring answer.

**That is also why the gate is radial rather than the box.** A pointer may travel inward as far as the
pivot, so it has to be let outward the same distance past the items or the two sides of the same ring answer
differently — the box edge sits barely past the items, and cutting there would make approaching from outside
feel dead while approaching from inside did not. `getRunRadius` reports the middle radius of the run, the
gate is twice it, and the radial falloff reaches nothing at exactly that point, so the two agree rather than
one clipping the other.

**`getFalloff` takes the whole defs rather than a distance, and that is the point.** An effect asks how much
one item cares; which of the arrangement's axes that weighs, and how far each of them runs, is not something
an effect author should have to know. It was briefly a knob — a `polar` rule beside `arc`, with the choice
offered on the ring and the arc — and the user's call was that a profile with the wrong numbers is a defect
rather than a preference. There is one turning rule.

**What a rule throws away is read once more, as a yes or a no.** The user's call, and it closes the hole the
rule opens: an ignored quantity is ignored without limit. `PlacementUtils.getIsWithinReach` asks it as a
boolean, never a distance, so nearness inside the arrangement is untouched. Only `"arc"` throws anything away
now — the radius — so only it is gated, and the whole box is the test, which is why a wheel still answers a
pointer outside its ring and stops answering one that has left the wheel. Every other rule measures a straight
line, already falling toward nothing well before a pointer reaches the far side of the page, and carries no
gate. **A gate on a straight line is a defect, not a safety margin**: it cuts wherever the box ends, and if the
effect has not faded to nothing by then, crossing that edge switches it on at once, which is the jump rows and
columns had while they carried one.

**That `"plane"` case was wired to the row/column box gate for a while, and it was a defect rather than a
second reading of the same reasoning.** The distinction above says plane needs no gate at all, but the
`switch` had no case for it, so it fell through to the two-axis box check anyway — a scattered layout stopped
answering the instant the pointer left its own bounding rectangle, on either axis, which is exactly the "sat
lit forever" problem this section exists to prevent, just inverted into "went dark too soon." Caught because
`Honeycomb`, `Cliff`, `Whorl` and `Zigzag` visibly snapped at their own edges where a row or a column never
does at its measured one. Fixed by giving `"plane"` its own case.

**The gate is on the pointer rather than on the item**, so failing it is indistinguishable from the pointer
not being there: the box reports no point at all and no item computes an effect. Gating per item instead
would have left `fade` dimming a whole arrangement the pointer had already walked away from, since a distant
item and an absent pointer are different things to an effect that answers on remoteness.

**A `zoom_in`'s push is clamped to the room the arrangement actually has, and a closed run is where that room
runs out.** Past the reach the push saturates at its full value, which is right for a row — everything beyond
the growing item shifts outward and the row gets longer — and ruinous for a loop, where the two directions travel
round and pile into each other at the far side. The first answer was a flag: test whether the run closes and
refuse to push when it does. The user's correction was a clamp, as `createRing` already clamps a spread to a turn
and a hole ratio to one, and the falloff clamps nearness.
`PlacementUtils.getRunSlack` reports how much of a turning run's circle is still free, counting the run's own
width as occupied along with the turn its items cover, and the push is capped at half of it, the two ends
spreading in opposite directions and each taking a share.

**What that buys is a continuum rather than a switch.** A
half-turn arc has room to spare and is untouched; at two hundred and eighty degrees the push comes down to
about half what was asked for; at three hundred and forty there is nothing left and it grows in place. A ring
is simply the end of that curve, so there is no closed case to detect and `isClosedRun` is gone. It also means
`pushRatio` can be asked for freely: an arrangement that cannot honor it says so, rather than the number being
quietly ignored on some arrangements and not others.

**Reach is measured in the arrangement's own spacing, and that was not the first answer.** Measuring it in
item widths is the obvious scale-free unit and it reads completely differently in the arrangements the library
actually ships: a cliff's hexagons are half the box wide and overlap heavily, so two-and-a-half item widths
reached every item on the page and the whole formation bloomed at once rather than picking one out.
`PlacementUtils.getSpacing` reports the middle distance between items that follow one another — the middle
rather than the average, so a zigzag's turn or a tree's tier step does not drag it — and the box computes it
once per layout. "The two either side of this one" is a statement about spacing, and only the layout knows
what that is.

**Everything the run knows about itself arrives as one value.** The reach rule, the pivot, the spacing and
whether the run closes are facts about the arrangement rather than about any item in it, so
`ProximityUtils.toArrangement` reads them off the layout once and the box memoizes that. What forced it was
the signature: each one had arrived as another positional argument, and `toEffectDefs` had reached six. The
reduced-motion flag stayed outside the bundle, being a fact about the reader rather than about the
arrangement. `PlacementReach` is the pair the measuring functions actually need, and a whole layout satisfies
it, so a caller passes whichever it is holding.

**An item's placement and the box its transform lands on are two different rectangles.** They are the same
one almost everywhere, which is why `frame` defaults to `placement` — but a wheel paints every wedge across
the whole wheel, so an effect measured against a wedge has to be written onto the wheel. Keeping one field
for both would have made a translation on a wheel wrong by the ratio between a wedge and the disc, silently,
in exactly the effects that move things.

**The defs carry the reduced-motion preference rather than the library acting on it.** A transform is motion
under success criterion 2.3.3 and a blur is too under its erratum, so the library could tell which half of an
effect to strip — and stripping is the one thing the `PointerTracker` entry above argues it must not do, because
only the consumer can _substitute_. So the flag arrives in the defs and each sample effect answers it in the
way that suits it: `zoom_in` sends the same curve to `brightness` instead of to size, `fade` keeps its dimming
and drops its blur, and `glow` is not motion under the criterion's own definition and is unchanged. Three
samples, three different right answers, which is the argument for the flag rather than a rule.

**A row and a column joined the layout registry, and they are there to be tested against.** The user's call.
Every arrangement the library shipped curved, scattered or overlapped, which meant there was nothing to check
a pointer effect against where the right answer is obvious by eye — and both faults above were invisible until
there was. They are the two arrangements a control would have had without a layout at all, which is the second
thing they buy: a dock is a row, and until these existed the one shape `zoom_in` most obviously wants was the one
shape no layout could describe.

**`Wheel` takes one, and it is the one place the effect is not measured against the layout it was given.** A
wheel reads a layout for one wedge's shape and then puts every wedge where CSS says, turning the lot as it
spins — so the placements are a design drawing rather than a description of what is on screen. Each wedge's
defs are built from where it currently points: the resting placement turned about the layout's own origin by
that wedge's live angle, which means the effect follows the wheel round as it spins rather than lighting the
place a wedge used to be. `Bracket` and `Satellite` take no layout and never did — each owns a
`computeLayout` of its own, internal and not a prop, which is why a search for the name turns them up.
