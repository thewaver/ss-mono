# Decisions: `PointerTracker`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `PointerTracker`: one reading of where the pointer is relative to one element

The abstract answers a single question — where is the pointer, relative to this box — and everything a
consumer paints from it is arithmetic on that answer. The brief was a grid of squares that light as the pointer
nears, a card whose cast shadow swings away from the pointer, and a surface under a veil with a hole at the
pointer; the veil became the `Reveal` `Exotic` and left the abstract's page, and the shadow turned out to need
no second element at all — a `box-shadow` whose offset, blur and alpha come from the reading does it, which is
the honest version of the demo and one fewer div in the tree.

**The page's examples are the user's pick, and two were cut after they ran them.** A card that started
fetching when the pointer came within three radii, and the veil the `Exotic` replaced. Recorded so neither is
re-proposed: the fetch-on-approach one was making a point about the reading being data rather than paint, and
that point did not survive contact with a demo where nothing visible happens.

**The magnet's reach is in pixels, not in radii, and that is the example's whole lesson.** It first used the
edge ratio like the lamps, and on a wide, short button that made the vertical reach about twenty pixels — the
element's own radius upwards is half its height. A magnet's field is a distance, so it reads `distance`
against a pixel range, eased so the pull is already visible at the far end of it rather than creeping in over
the last few pixels. The lamps keep the edge ratio because a lamp's glow really is a property of its shape.
Both numbers are in the reading precisely so a consumer can pick the one that matches what it is modeling.

**The magnet tracks the box it sits in, not itself, and this is the feedback trap `trackAxialSwipe` already
documents.** An element that leans towards the pointer moves the very box its reading is measured from, so the
next reading is taken from the displaced position and the direction wanders as the pointer closes in. The fix
here is not a frozen rect but a different subject: the tracker watches the stage, which never moves, and the
transform goes on the button inside it. That is also the truer model — a magnet's pull is a property of where
the thing rests, not of where it has already been dragged to.

**The lean is a fraction of the offset, capped — not a fixed length along the direction.** The first two
versions multiplied a unit direction by a constant scaled by the falloff, which is wrong in the way that is
easiest to miss: the falloff is strongest at the center, so the button jumped its full travel towards a pointer
sitting almost on top of it and only snapped back to nothing at the exact center, where the direction
degenerates. Reported by the user as the button not being centered when the pointer is. The reading was not at
fault — the readout on the same page shows `distance: 0px` at the element's own center — the arithmetic on top
of it was.
Taking `distance × follow ratio × pull` gives the behavior the name promises: nothing at the center, and a
reach that grows as the pointer approaches without ever overshooting it.

**What limits the reach is the room the box leaves, not a constant.** A fixed maximum was the first answer and
it was visibly wrong in the way the user reported next: the button stopped short of the edges with no
explanation, because thirty-four pixels is less than the travel a two-hundred-and-eighty-pixel stage allows a
button half its width. The cap is now `(stage − button) ÷ 2` per axis, from two
`ElementObserverUtils.createBorderBoxSizeObserver` calls, and it is clamped per axis rather than along the
direction — so a pointer off one corner slides the button along the edge it has already reached instead of
stopping in mid-air. Measured flush on all four sides.

**The reading carries pixels _and_ a ratio, because the two answer different questions.** A pixel offset from
the element's center is isotropic, so the angle derived from it is the true direction on any shape; a ratio of
the box says where inside the box the pointer sits, which is what a mask position wants and what
`trackDrag` already reports. Reporting only the ratio would have distorted the angle on a non-square element —
a bar 400 by 40 would call a shallow approach 45° — and reporting only pixels would have left every
mask-positioning consumer dividing by a size it has to measure again. Both fall out of one measurement, so
carrying both costs nothing.

**The user's contribution, and the part that makes the reading shape-aware: `edgeOffset`.** Draw the line from
the element's center through the pointer and record where it leaves the box. `distance / edgeDistance` is then
one number that means the same thing on any element: below `1` the pointer is inside, `1` is on the edge, `2`
is a further element-radius away. A wide bar reports a short reach sideways and a long one along its length,
so a falloff written against it lights the way a bar-shaped lamp actually would, with no consumer arithmetic
about aspect ratio. It is also scale-free by construction — both lengths are measured in the same space, so an
ancestor scale divides out, the same immunity `trackDrag`'s ratio has.

**The boundary is the element's rectangle, so a rounded element over-reports its corners** — a circle made
with a 50% radius says its diagonal reaches about 1.4 times as far as it is drawn. Left alone: none of the
three consumers is round, and teaching the abstract about shapes means either reading `border-radius` back out
of computed style or taking a shape argument, both of which are a lot to carry for a decoration.

**The arithmetic went to `ss-utils` as `RectUtils.getEdgePointTowards`.** It needs only the language, which is
the line for that package, and the degenerate case follows a rule already recorded there: the center has no
direction to leave in, so it reports the middle of the right-hand edge, matching `Point2dUtils.getAngle`
reporting `0` for the origin.

**One document listener and one frame, shared by every consumer, because an element cannot hear a pointer that
never touches it.** The listener has to be on the document, and the case this was designed against — a grid of
twelve lamps, each reading the pointer against its own box — calls `create` twelve times, so a listener per
consumer would be twelve listeners and twelve `getBoundingClientRect` calls per pointer event. Instead the module holds the client point and a subscriber set, `pointermove` marks the frame
dirty, and one `requestAnimationFrame` recomputes every subscriber — the `Dismisser` shape, which
attaches on the first consumer and detaches on the last. Scroll and resize mark the same frame dirty, since a
page moving under a still pointer changes every reading.

**`getIsPointerPresent` is returned from every `create` call even though it is module state**, so a consumer
reads one thing and never has to know which parts of the reading are shared.

**A resting reading rather than an absent one, and it rests infinitely far away.** The reading is never
`undefined`: before the first pointer event, and on a touch device where the pointer only exists while a
finger is down, it reports `distance` and `edgeRatio` of `Infinity` with a zero offset. That is the honest
statement — infinitely far away, in no particular direction — and it means the arithmetic path never branches:
a falloff clamps to nothing lit, an offset multiplied by a normalized zero direction displaces nothing. Zeros
would have been the wrong resting value, since a zero distance is the pointer at the center, which is every
effect at full strength. **After a pointer has been seen the last reading is kept**, and
`getIsPointerPresent` goes false, so a consumer can fade out from where it was rather than snapping — which
is what leaving a room looks like. A consumer ignoring the flag gets an effect frozen mid-strength; that was
weighed and accepted as the price of not making the reading optional.

**Reduced motion is the consumer's to answer, and the abstract does not touch it — see
`MediaQueryMonitor` below for where the preference is read.** Considered and rejected: the abstract
suppressing the reading itself. It cannot do the thing the preference actually asks
for. The platform preference is to "remove, **reduce, or replace**" motion, and success criterion 2.3.3
Animation from Interactions (AAA) covers only motion animation triggered by interaction — its own definition
excludes changes of color and opacity that do not change perceived size, shape or position, with an erratum
amending it to no longer exclude blurring. So the lamp's brightness is outside the criterion entirely, while
the shadow's offset and blur and the reveal's traveling hole are inside it. An abstract that stops reporting
can only delete, and it would delete the brightness along with the movement; only the consumer knows which of
its own responses is motion, and only the consumer can substitute. The three examples each answer differently:
the lamp keeps its brightness and drops its glow, the shadow pins its offset and blur and keeps responding
through opacity alone, and the reveal replaces the traveling hole with the whole veil fading.

**The abstract briefly published the preference alongside the reading, and does not any more.** The user's
question closed it: a consumer can read a media query in CSS with no JavaScript at all, or in about ten lines
of signal and listener, so publishing it bought a saved listener rather than a capability the consumer lacked.
What survived the question is the observation that made it non-trivial — a `PointerTracker` consumer paints
from computed numbers as inline styles, and a CSS media query cannot withdraw an inline style without
`!important` — and that is an argument for the preference being reachable from JavaScript, not for a pointer
abstract being the one to hand it out.

**The Playground gained an `Abstracts` category for it**, ahead of `Exotics`. Nothing that renders no DOM had
a page before; the alternative was filing it under `Exotics`, which is the folder for things that do render.

#### A point source: following something other than the pointer

Settled with the user for every reader of the tracker at once, after `ProximityText` needed it. **A source is a point
given as a fraction across a box, `PointSource = { ratio, element? }`.** Without an element the fraction is of each
follower's own box; with one, of that element — so a light moving across a banner is "this fraction of the banner",
handed to every card under it. Screen pixels were rejected because the consumer would then own the conversion and
every scroll; each component's own box only was rejected because it cannot share one point between several.

**The conversion happens inside `PointerTrackerUtils.observe`, on the same pass as the pointer's.** `observe` takes a
getter for the source and asks it on every pass, so a source is measured with the same `getAdjustedBoundingClientRect`
the follower is, in the same space, and keeps up with a scroll, a resize and a zoomed `Viewport` for free. A moving
source raises no event the tracker can hear, so the bindings call `PointerTrackerUtils.refresh()` whenever the source
they were handed changes; several in one frame cost one pass. Scroll and resize now invalidate unconditionally, since
a supplied point needs re-measuring under them even before any pointer has been seen.

**A source with no point is absent, and absent is what the pointer leaving the window already meant.**
`getIsPresent(source, isPointerPresent)` answers with the source's `ratio !== undefined` when there is a source and
with the shared presence otherwise, and the bindings hand that out as `getIsPointerPresent` — the name kept, because
the abstract calls whatever it follows "the pointer" throughout (`PointerTracker`, `PointerReading`), and a supplied
point is a stand-in for it. While a source has no point no reading is reported and the last one stands, which is the
pointer's own resting rule.

**Every reader takes one except `ScratchCard`**: the three pointer effects, `Reveal`, `GlassSurface`'s sheen,
`PlacementBox`, the wheels through the `Wheel` primitive, `ProximityText`, and every tracked gradient and pattern
sample. The user's call — "go big from the get-go". Scratching needs a press, and a supplied point has none.
`GlassSurface` was not named in the backlog's list but is a reader, so it follows the rule rather than the list. The
samples take theirs through their own interface: `TrackedElementDefs.getPointSource`, folded into the tracked
gradient and pattern defs, which the host passes beside `getSize` and the colors.

**`smoothingMs` stays on each component**, because smoothing what is drawn rather than the reading is what lets the
pointer leaving the window glide too.

#### The dock, the card stack and the tilt's sheen: three findings that outlived the examples

All three began as examples on the `PointerTracker` and `InteractionTracker` pages, and none of those pages
exists any more — the pages were pruned, the card stack became `CardStack` and the tilt became `Tilter`. What
is kept here is the part that needed a decision the sketch did not contain, because each is the kind that
would be got wrong a second time.

**The dock sizes every tile from the row's layout at rest, never from where the tiles currently are.** A dock
grows the tile under the pointer and its neighbors by less, which means the row's total width changes while
the pointer is inside it. Size the tiles from their live positions and the row feeds back into itself: a tile
growing shifts its neighbor sideways, which changes that neighbor's distance from a pointer that has not
moved, which changes its size, which shifts the next one. The reading is taken as a ratio of the row's own
box — which never changes, because the tiles are absolutely positioned inside it — and the resting centers
are arithmetic rather than measurements. The row is then laid out by accumulating the grown widths and
centering the result, so the whole row breathes symmetrically around the pointer.

**Its footprint is the magnified spread, not the resting one.** Seven tiles at rest is 204px and the same
seven at full magnification is 285px, so a box sized to the resting row has tiles hanging out of it. The
constants were chosen against the magnified figure, which is the one worth computing before picking them.

**A card that has gone is destroyed, never cycled to the back of the stack.** Sending the flown card straight
to the bottom is one line shorter and looks broken: the element survives, so its transform changes from
off-screen to the back of the deck and the browser animates the difference — the card visibly slides back in
from the side it just left. The element has to stop existing, so there is nothing left to animate. `CardStack`
keeps that by mounting a window of the list rather than the whole of it: a card that leaves falls out of the
window and its element goes with it. What it did not keep is the automatic re-deal — dealing again is a
command on the controller now, and the Playground puts a button on it.

**The tilt's sheen is a band positioned by its own color stops, and it travels against the tilt.** A
reflection is of something that is not moving, so it slides the opposite way to the surface and further than
it — which is what separates foil from a sticker painted on the card. Two constructions were tried and
abandoned before the third: `background-position` over an oversized image puts the band off the element at
the extremes, because the gradient line is measured over the image rather than the box. Interpolating the
stops themselves — `transparent`, white, `transparent` at a center driven by the pointer — is exact, always
within the element, and needs no second layer.
