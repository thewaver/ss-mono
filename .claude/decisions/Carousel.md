# Decisions: `Carousel`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Carousel`, and the first component that acts without being asked

Built, alongside `Paginator`, from the description `backlog.md` had carried since the `Scroller`
naming argument. It shows one slide at a time, wraps at both ends, and can rotate on its own.

**One slide at a time, and a page of several slides is not built.** The description allowed either. One slide
is the reading with a published pattern behind it, and a page of several is `Scroller`'s territory the moment
the arithmetic starts asking how many fit — the boundary the two components were separated along. Recorded in
`backlog.md` as a gap rather than left implicit.

**Wrapping is the difference that makes it a different component.** `Scroller` stops at each end and disables
the step with nowhere to go; `Carousel` comes round, so neither step is ever the dead one. That single line is
why a shared implementation with a `wraps` flag was not attempted: the two disagree about what the ends mean,
and everything they appear to share — a track, a step pair — they hold for different reasons.

**The rotation is why this is a component rather than paint, and the holds are conformance.** WCAG 2.2.2
applies to anything moving by itself for more than five seconds beside other content: it must be stoppable, and
the published pattern adds that it must not move under the pointer or while it holds focus. So the holds are
not a courtesy that could be dropped for a tighter API. `getIsHeld` is `hovered || focus within || page
hidden`, which is `Toasts`' expression character for character. The explicit stop is separate from the holds
and outranks them: a stopped carousel stays stopped when the pointer leaves.

**The carousel draws no controls; the consumer builds them on a controller.** The first build had a
`renderControls` slot handing the consumer elements the library built — steps, pickers, a play and pause button —
so the library owned what a control was and the consumer where it sat. It was replaced, at the user's request, by
the rule `CardStack` was rebuilt to (_"A component hands out a controller and renders no controls of its own"_ in
`conventions.md`): the slot put the controls inside the carousel's own box, so nothing wrapping the carousel could
frame the slides alone. `onMount` now hands over `step`, `pick` and `setIsPlaying` with the getters a button needs
to disable or name itself, and the consumer draws the buttons — `Scroller`'s arrangement, with its stated cost: a
library that renders no button cannot promise one is reachable or named. The props block says what has to be built
on the controller: the single-pointer route WCAG 2.5.7 asks for beside the swipe, and the pause WCAG 2.2.2 asks for
on a carousel that advances by itself.

**The page's buttons hold the carousel through `setIsHeldByPage`.** With the controls inside its box, focus on Next
held a rotating carousel by the same tracker that watches the slides; drawn outside, the carousel cannot see them,
and a keyboard user stepping through was chased. Pausing from the page (`setIsPlaying(false)` on focus) was weighed
and turned down by the user: it flips the play button to "play" while the person merely sits on Next, and a pause the
person pressed would have to be told apart from one the page made. A hold has neither problem — it is a second
source ORed into the carousel's own, it never touches the play state, and it lifts when focus leaves, so a button
beside the carousel behaves as a slide does. That keeps the carousel's departure from the ARIA pattern's "does not
restart" (its own hold already resumes), which WCAG 2.2.2 permits since the pause button is the mechanism. Each
Playground bar runs the framework's hold tracker on its own element and forwards the answer.

**Slides are plain values, not records.** Every other collection here takes records — `Tab<T>`, `TreeNode<T>`,
`Toast<T>` — because each has per-item capabilities the library acts on. A slide has none: its position is
arithmetic, not a field. The records convention was written against **parallel arrays** indexed at each other,
which a single list of values is not.

**The index is a two-way signal, and this is the clearest case in the library for it.** A rotating carousel
writes its own index on a timer with nobody having asked, which no consumer callback can be expected to mirror
back. `SignalMirrorSolidUtils.createOptional` keeps it private until a consumer wants it.

**The announcement goes through `LiveAnnouncer` rather than a live region on the track.** The published pattern
makes the slide container a live region, which works when the slides that are away are removed from the page.
Here they stay — the track translates — and a live region over content that never changes announces nothing.
The shared announcer is already the answer for `Calendar`'s month change. It announces only when the carousel
is **not** rotating, because narrating a slide every few seconds is the noise WCAG 2.2.2 exists to prevent.

**The slides that are away are `inert` as well as `aria-hidden`**, for `Collapsible`'s reason: a control
scrolled off the side is still in the tab order without it, so a keyboard user would tab into a slide nobody
can see and drag the track after them.

**Both directions ship, as a `dir` prop of `"row" | "column"` defaulting to `"row"`** — the name and the union
`Tabs`, `Stepper`, `RadioGroup` and `SplitPane` already carry. Four things read it: the track's flex direction,
the slide's basis (a flex basis of `100%` is measured along the main axis, so one declaration means width in a
row and height in a column), the axis the transform translates on, and the swipe axis handed to
`InteractionTracker`, which already had a vertical mode for `Modal`. The step a committed swipe takes is now
one expression covering all four directions — left and up bring the next slide in, right and down the previous
— rather than a comparison per direction.

**Nothing in the markup names an axis, and that is the pattern's own position.** The published carousel pattern
defines a carousel as sequential display of slides and never mentions orientation; its controls are "previous"
and "next", which are sequence words rather than compass ones. `aria-orientation` is not among the attributes
`role="region"` supports, so there is nothing to set even if there were something to say. A column carousel is
therefore announced exactly as a row one is.

**A column carousel has no height of its own and takes it from the box around it, rather than from a prop.** A
row carousel gets its width from the page for nothing; a column one cannot get a height the same way, because
the track must be exactly one slide tall for a translation of `100%` to mean one step, and slides stacked in
normal flow make the track as tall as all of them together. So in column mode the root is `height: 100%`, the
viewport takes what is left of it after the controls, and the consumer's own element carries the number. That
is `SplitPane`'s arrangement — fill the box you are given, state no size. A `height` prop was the alternative
and was refused for the reason `DrumWheel` can require `wedgeSize` and this cannot: a prop mandatory in one
direction and meaningless in the other is a shape the type cannot state, which is the same objection that
keeps a drum carousel out of `Carousel`'s own props.

### `Carousel`: stopping at the ends is one rule, and rotation stops by writing the signal

**`isLooping`, on by default, decides every way the index moves.** A step, a swipe, a pick and the next turn of
automatic rotation all go through `CarouselUtils.resolveIndex`, which answers "nowhere" for an index past either
end of a carousel that does not loop. So no path can wrap where another would stop. A step control at an end is
disabled through the same `isDisabled` the shared wrapper already carries, so it goes `aria-disabled` and refuses
like any other disabled control; its `targetIndex` reports the slide already showing. A swipe past an end is
refused on release, and the track or drum springs back the way a short swipe does.

**Rotation stopping on the last slide is written to `playback`, not held privately.** When looping is off and
rotation is live, reaching the last slide writes `false`, so the rotation control offers "start" rather than a
pause that pauses nothing. The same effect refuses a `true` written while the last slide shows, which is the
invariant-against-the-state rule `Select` and `Menu` follow for a disabled popup. Pressing play on the last slide
of a non-looping carousel is therefore undone at once; there is nowhere to rotate to.

**The drum takes the flag only so both presets take the same props.** It is a closed ring whose last face sits
beside its first, so looping is the right default there, and its doc block says so.

### `Carousel`: one component, and how a slide sits is a placement rule

From Made With GSAP's carousels — cover flow, a depth wave, cards bending along a cylinder, a stack of folders, cards
flipping down on a hinge, a ring that turns and leans — which the user judged to need one more abstraction before they
could be expressed the way the rest of the library is. The first build had two presets over a private shell,
`TrackCarousel` and `DrumCarousel`, the track sliding a strip and the drum turning a `Barrel`; both are gone.

**What was missing is a slide placed by its distance from the current one.** Counted in slides, fractional while
moving, and measured the short way round when looping (`CarouselUtils.getDistance`). A placement rule,
`placement`, takes that distance with the carousel's box and answers in `Proximity` effects' vocabulary —
transform and filter values, opacity among them — plus an `origin` to turn about, a `layer` to stack by and the `axis`
a turned slide shows its back about. **The shell is public as `Carousel`, with the rule required**, and the seven
arrangements are ready-made rules in `CarouselPlacementUtils`, shipped and tuned the way `ProximityEffectUtils`
ships its effects, with a sample registry for pickers. The user's pick, under the 0.0.x rule that a better API needs
no migration path.

**Every slide fills the carousel's box and sits in the same grid cell before its rule moves it.** That makes the box
the one length a rule needs — a track moves a slide by whole boxes, the drum's depth is worked out from the box so its
faces meet — and it puts every slide's untransformed center at the same point, so slides given the same `perspective`
share one vanishing point without a 3D context across them. Stacking is therefore by `z-index`, from the rule's
`layer` (or nearer-is-higher by default), inside a box made its own stacking context with `isolation: isolate`;
without it, a slide with a negative layer was drawn behind the page around the carousel. **`slideSize` became that
measurement**, as the backlog asked: the box is measured, not given. The drum did not turn out to need it as an input;
a consumer wanting a narrower slide sizes the carousel or the slide's own content. The column carousel's
height-from-the-page rule went with the track: a column now takes the tallest slide's height like a row does.

**The position is continuous and is what `progress` describes.** `progress`, 0 to 1, is the library's existing shape
for driving from outside; on a looping carousel it is one whole lap (`getLapLength`). An index change glides the
position there on a frame loop (`CarouselUtils.glide`, CSS's `ease`), the short way round, writing `progress` as it
goes; a write to `progress` from outside stops a glide and makes the index follow the nearest slide. A swipe offsets
the drawn position and either steps or glides back on release. **The track's visible rewind at the wrap is gone**:
with distances taken the short way, the first slide sits beside the last, which ends the old disagreement between
the track and the drum.

**A press on a visible side slide picks it.** The user's pick. Slides other than the current one stay `inert` and
hidden from screen readers, and the pickers remain the keyboard's route to the same action. Because an inert slide
receives no clicks, the press lands on the box and `computeHitIndex` works out which slide was aimed at: of the
slides whose drawn box holds the point, the one whose middle is nearest — not the topmost, which is what `CardFan`
showed is wrong for overlapping slides. It is gated as the swipe is, so a carousel with no controls leaves presses to
the page, and the click that ends a swipe is already swallowed by the swipe tracker.

**`renderSlideBack` is everyone's**, drawn on a second face turned half round the placement's axis with
`backface-visibility: hidden` on both, since the hinge and the folders turn cards over as the drum does.

**One `orientation` replaces the track's direction and the drum's `axis`.** It decides the swipe and is handed to the
rule, which lays its slides across or up and down; what a slide turns over about is the rule's own `axis`, defaulting
from the orientation.

**Every rule follows the orientation, the stacks included.** The folders and the hinge were first written up and down
only, and the user called that a defect: on a carousel running across, both still moved vertically. Across, each is
its up-and-down self turned a quarter turn: the waiting stack peeks out to the right, the leaving folder slides off to the left, and the hinge turns its card
over the left edge about an upright spine, the way a book's page turns. Up and down is unchanged — the waiting stack
above, the leaving card dropping below.

**Whether a leaving card moves with the swipe or against it is not decided, on purpose.** Up and down, a swipe upward
brings the next card while the leaving one drops; the user declined to settle that, since platforms let people choose
which way a swipe scrolls (Apple's natural-scrolling toggle), and would rather the library not make that call for now.

**`Carousel` lives in `Essentials/`.** With no presets built on it, the layering rule puts it there rather than in
`Primitives/`; the two presets and their Playground pages were deleted, and its page-less entry in the Playground's
`Primitives` section went, since it has a page of its own and the two collided on one route.

### `Carousel`: groups of items, and a group rests on its middle

The user's design: a dot stands for a group of items resting on screen together — a book's spreads, overlapping
sliding pairs. `computeGroups(count)` returns `Span`s (end exclusive, overlap allowed), and `computeGroupLabel(start,
end, count)` names a group in the announcement; `CarouselGroupProps` is a union so the two come together or not at
all, shaped like `ModalNameProps`. **Safeguarded**, at the user's request: `CarouselUtils.resolveGroups` rounds ranges
to whole slides, holds them inside the list, drops empty and non-numeric ones and orders the rest by start, warns
when it fixed anything, and falls back to one group per slide. **`index`, stepping, the dots, looping, swipes and the
controller's `getIndex`/`getCount` count groups**, since an item in two overlapping groups cannot say which is current;
every slide of the current group is current, in the repeated copies a loop draws too, and pressing a side slide brings
up the nearest group holding it. Without `computeGroups` every slide is its own group and every formula gives the old
answer — unit-tested against the one-slide functions, ties and wrapping included; those older functions go once
React, Vue and Svelte are ported.

**Positions are still counted in slides, and a group rests at the middle of its slides**, `(start + end − 1) / 2`, so a
pair at rest sits at −0.5 and +0.5 and a group of one where it always did. **Every shipped placement rule lays a resting group out as one unit**, the user's call over leaving the rules
tuned for one slide. A rule places a group by its distance counted in groups, as it places a slide, and lays the
group's slides side by side inside it, shrunk to share one slide's room; the slot offset is worked through the group's
scale, turn and turning point, so a group that turns, swings or folds moves as one flat piece, in the fixed
translate-rotate-scale order with no `matrix3d`. The placement input carries it as `group: { distance, index, count,
slot, size }`; without groups it is `{ distance, index, count, slot: 0, size: 1 }` (`CarouselUtils.toSlideGroup`), a
slide alone skips the slot step, and a frozen copy of the old rules
(`CarouselPlacements.ungrouped.test.ts`) pins every family's ungrouped output and `reach` as unchanged. `reach`, the
repeated copies and windowing count groups. **A slide in two groups** is drawn, at rest, in the group showing when
that group holds it, otherwise in the nearest group holding it; between two groups that both hold it, it stays at
distance 0 while its slot and size blend, so nothing jumps along a glide. A slide no group holds is drawn alone.
**Cover flow and depth wave gained `faceRatio`** (default `1`): a group needs the content's length to put slides
edge to edge, which those rules never knew; the Playground passes its narrow frame's own
(`toFramedPlacement`). The paddle wheel keeps a group on one paddle, in reading order. The vertical cover flow and
depth wave crowd behind the group, as their single-slide vertical look already does with the narrow frame.
`progress` `0` is the first group at rest; `1` is the last group at rest on a
carousel that stops at its ends, and a full lap of slides on a looping one. A position exactly between two groups
resolves to the one ahead, as `Math.round` did. Sliding pairs end on the last slide alone, mirroring the start.

**No ready-made groupings ship.** Book spreads, sliding pairs and fixed pages were built as named exports and then
dropped by the user: a grouping is a few lines of arithmetic the consumer writes, as the Playground's Pairs example
does — two to a stop, its list doubled when the count is odd so every pair is whole.

### `Carousel`: building only what the placement draws

**`isWindowed` builds a slide only while it is within the placement's `reach`, and is off by default.** Asked for by
the user as critical: a carousel can hold a hundred animated, heavily composited slides with only a handful in sight,
and every one was built, kept and placed on every frame. The window needs no distance of its own, because every
shipped placement already declares `reach` — how far either side it still draws anything, plus one slide of margin —
so a slide is built as it comes within reach, before it can be seen, and removed once it is beyond it, including in
passing during a long glide. A consumer's rule with no `reach` cannot say what it draws, and every slide is built.

**Opt-in rather than automatic, on the user's call, because a slide that leaves and comes back is a new one.**
Whatever it held — text typed into it, a video's place — is gone, and making that the default would lose a
consumer's state with no warning. A slide that is away was already `inert` and hidden from screen readers, so
removing it changes nothing a keyboard or a reader could reach. `CarouselUtils.getIsBuilt` holds the test; the view
wraps each slide in it, and a removed slide clears its face and placement entries so the press test skips it.

### `Carousel`'s concertina: an accordion's bellows seen from the front

Asked for by the user as a zig-zag arrangement: the slide showing lies flat and facing the viewer, and the rest fold back
and forth either side of it. Named `concertina` because `accordion` is already the library's disclosure panel; `bellows`
was the better-known word and `zigzag` the plainest, and the user took `concertina` for being the one that means folded
back and forth.

**Each slide keeps one fold direction, by whether its position is even or odd.** The user's call, over folds that always
leave the slide showing the same way round. Fixed folds are what a real concertina does, and they make a step calm:
only the slide arriving in the middle unfolds and the one leaving folds, while every other slide keeps its angle and
slides along. Folds kept relative to the slide showing would flip every folded slide through flat on every step. The
cost accepted is that the folds beside the slide showing go away from the viewer on one step and come towards it on the
next.

**It needs nothing new from `Carousel`.** A slide's place is a fold walked from the middle of the box out to it, one
slide at a time, and every slide on that walk is known from the placed slide's own distance and position: its angle is
its fold direction times how far it is from flat, which only the slides within one step of the middle are. So
neighbors meet at every fractional distance, and the rule stays a function of one slide like the others. A looping
carousel with an odd number of slides cannot alternate all the way round; the two slides meeting at the wrap fold the
same way, on the far side from the slide showing, rather than one of them changing direction as it travels.

**It shrinks every slide to `faceRatio` of the box, with a scale, where the drum leaves the face's size to the
consumer.** The first build used the whole box and showed only the middle slide: the folds lay outside the box and were
clipped. Shrinking the slide itself means the consumer's content needs no narrower frame of its own and the fold's
arithmetic and the drawn slide cannot disagree about how wide a face is.

### `Carousel`: too few slides are repeated, as far as the rule says it reaches

Found on the concertina with the Playground's four looping slides: each slide was drawn once, so the slide furthest
round sat at one end and, on a step, crossed to the other end in a single frame while still on screen. The drum showed
the same class of fault with fewer than three slides, kept from it only by `SMALLEST_RING` leaving a face empty, and
the user's point was that other rules would carry it too, so it is fixed once in `Carousel`.

**A rule is `{ place, reach }`, and the rule is what says how far it reaches.** The user's call, over a minimum count
the consumer would set and a fixed number of repeats. Only the rule knows its geometry, so a consumer never has to work
out how many slides the concertina or the drum needs. The object over a `reach` property hung on the function, also the
user's call: a consumer who wraps a built-in rule in a function of their own to adjust it would drop the property
without noticing, and the jump would come back. `reach` is the furthest distance at which the rule still draws
anything, so it counts the slide fading out beyond `visibleDistance`; a rule without one is drawn once per slide, which
is what the paddle wheel wants, since it spreads however many slides there are round its turn.

**The whole list is repeated, never single slides, and only on a looping carousel.** `getCopyCount` gives the fewest
repeats that make the ring hold `2 × reach + 1` slides, so every slide keeps the same neighbors in every copy. The rule
is handed the ring — each copy's place and the ring's length — so the drum closes into a full ring of copies and the
concertina folds every place, while the content and every count the consumer sees are the real slides': `renderSlide`'s
state, the labels, the pickers and the steps. A carousel that stops at its ends has no ring to fill.

**The ring follows the position rather than replacing it.** `progress` and the position still run round one lap of the
real slides. `followCopies` keeps the ring on whichever copy is nearest where it was, so the ring turns on through
every lap instead of snapping back to its first copy, and `getNearestCopy` picks which copy of the slide showing is the
front one. Copies are as hidden from the keyboard and from screen readers as any slide that is not showing, so they add
nothing to what assistive technology meets. What they do add is the slide's content drawn more than once, which is
harmless for pictures and text and is the accepted cost for anything that changes by itself inside a slide.

**Each framework follows the ring the way it already follows a value built on its own last one**: Solid a memo reading
its previous value, React state adjusted during render, Vue a `computed` reading its previous value, and Svelte a plain
variable a `$derived.by` writes as it reads — the shapes recorded under porting for `Carousel`'s accumulated turn.

**Pressing a copy picks its original, and the glide goes the short way round the real slides.** So a press on a copy
three places to the right of four slides glides one place to the left, bringing up an identical copy from that side.

### One index wrapper, under the name that was already published

**`CarouselUtils.wrapIndex` and `RotationUtils` had the same function**, character for character: bring an
index into range, wrapping at both ends, and answer `0` when there is nothing to index. `CarouselUtils.wrapIndex`
is now that function rather than a second copy of it, which is legal in that direction — a `Fundamental` may
read an `Abstract`. The published name won over the `getWrappedIndex` the wheel work had invented, and the
export stays where consumers already find it.

**Two objections were raised against this and only one of them held.** That `Carousel` would lean on a namespace
named for something it is not: it does not hold, because a carousel's own vocabulary is already rotation —
`getIsRotating`, `getIsPlaying`, `setIsPlaying`. That the old export has to stay: it does not
hold either, since a one-line re-export is a cost every arrangement but "leave both" would pay.

**What held is that the function is not angular arithmetic, so `RotationUtils` was not strictly its home
either.** It is now `MathUtils.wrapIndex` in `ss-utils`, and `RotationUtils` — which lives in that package too
these days — reaches for it like any other caller. See _"What went to `ss-utils`"_. The published
`CarouselUtils.wrapIndex` alias is unchanged and now points there.

### `Carousel`'s Docs page: one shared bar, one picker for the looks, and no rule written by hand

The user's calls, taken before the page was built. The carousel draws no controls, so every example needs buttons.
**They are written once, in `CarouselsBar`, and every docs example imports it**, Basic included. How a reader gets to
see that code is left open; the user will settle it later. **The nine ready-made placements are one example with a
picker** (and an orientation knob, since every rule follows it), not nine carousels nor a gallery on an Examples
page. Its code builds the rule from the library's own sample list through the Playground's `toFramedPlacement`,
which adds the `faceRatio` for cover flow and depth wave. **There is no section on writing a placement rule by
hand**: the API page's tables cover the rule's shape. **The WCAG warning box** (Previous/Next for 2.5.7, a pause
button for 2.2.2, the bar's hover and focus passed to `setIsHeldByPage`) **sits above the first example, in
`PageDocsAlert`**, as on `SlideButton`; the user means to restyle that box themselves.

The shared settings panel and the Examples page went, as on Accordion: each example owns only the knobs for its own
feature. The slide-count knob went with the panel, under _"A docs example has no knob that exists only for the
Playground"_. Every example sits in a `docsCarousel` box of capped width, like the accordion examples (the user's
call), and every one except Looks uses the plain `track` placement and draws `PageCarouselSlide` straight, with no
frame. Looping and autoplay are one example, at the user's request, so turning looping off shows rotation stopping on
the last slide; its Looping knob starts on, since looping is what the section shows (see _"A section's knob starts
on the behavior the section is about"_). The bar's `isDisabled` became optional, so only Basic, the one example with a
Disabled knob, passes it.
