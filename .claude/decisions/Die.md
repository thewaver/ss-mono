# Decisions: `Die`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Die`: any convex solid of flat faces, rolled the way the wheel is spun

Asked for by the user as the third of three readings of "can we have spheres" — a solid built from many flat faces,
which is `Cuboid`'s trick with more faces — and wanted first for a die. The other two readings, points on a sphere
and a sphere we project ourselves, are recorded in `backlog.md` under _Open discussion_ and wait on the look and the
cost of this one.

**A shape is corners and faces, and the tabletop dice are samples of it.** `DieShape` is a list of corners inside
the unit sphere and a list of faces as corner lists, so a d10's kites and a d12's pentagons are the same prop.
`DieUtils.computeHull` wraps a handful of corners in their convex solid and merges coplanar triangles into one face,
which is how `Samples/Die/Shapes` gets every die from nothing but corner coordinates; it compares every triple, so it
is for dice, not for thousands of corners.

**The d100 is 52 points on a spiral, wrapped.** Asked for by the user once splitting a d20 into fours was found to
reach only 20, 80, 320 and on. A solid made of triangles always has two fewer than twice its corners, so 52 corners
spread evenly — the golden-angle spiral, which spaces points on a sphere about as evenly as any simple rule does —
wrap into exactly one hundred triangles. They are close in size rather than identical, which is also true of the
real hundred-sided die. The same hull function builds it; nothing new was needed.

**Many flat faces does not scale to a sphere, and the test for it was dropped.** The first build carried a second
example: a d20 split into four up to four times, with a frame-rate readout, to judge the "sphere of flat faces"
reading. At 320 faces it froze the user's browser while every die ran fine, so the reading was answered, the example
went on the user's call, and `DieUtils.subdivide`, which existed only for it, went with it. The other two readings of
"sphere" are in `backlog.md` under _Open discussion_.

**A face's top follows the face, not the author's corner order, where the two disagree.** A face's top points at
its first corner, which is right for a triangle, a pentagon and a kite. A square's first corner would make the face
land as a diamond, so a face that is the same turned half way round points its top at the middle of its first edge
instead. That one rule gives every tabletop die its conventional upright face without the shapes carrying a
per-face orientation.

**Every face is a real element, turned into place with one `matrix3d` and clipped to its contour.** The browser
does the depth, the perspective and the hiding of back faces, as it does for `Cuboid`; the body carries one more
`matrix3d` for the whole die's rotation and is pushed back by its radius first, so it turns about its own center and
the frame it reserves — `Cuboid`'s formula with the radius as the depth — holds at every angle.

**A roll is the wheel's spin, not the cuboid's counts.** `Cuboid` is driven by two counts of quarter turns because
it rests on six faces reachable by quarter turns; a twenty-sided die has no such lattice. What a die has is an
outcome, which is the wheel's shape: `computeRollTarget` chooses the face, and may answer later; the controller's
`roll()` starts a roll and declines while one is under way; `face` is written as soon as the target is known,
the way `targetIndex` is; `onRollEnd` reports the landing; and the landed face is announced, as `Rotator`
announces a wedge. Writing `face` directly turns the die there with no tumbles.

**Rolling the face already showing still rolls.** Setting a state to the value it holds does nothing, by the library's
rule, so a roll cannot be a write to `face` alone — a d6 that rolls a four while showing a four would sit still.
The roll is a command that writes the signal and runs its own turn, and the turn a direct write would have started is
suppressed for that one write.

**The turn is a quaternion blend with whole tumbles on top.** The die's orientation is held as a quaternion; a turn
blends from where it is to the rotation that brings the chosen face towards the viewer the right way up, and a roll
multiplies in some whole turns about a random axis, which cost nothing at the end because a whole turn is no turn.
It runs on a frame loop with `Rotator`'s starvation timer beside it, so a roll started in a tab that stops painting
still lands and still reports.

**A face is showing only once the die is at rest.** The user's correction: the first build marked the target face as
showing the moment a roll's result was known, so the painter lit it up while the die was still tumbling and the answer
arrived before the roll did. `isShowing` now follows the face the die last came to rest on, and is false for every
face while it turns. `face` still carries the target early, as the wheel's does, for a consumer that wants it.

**Only one face is offered to a screen reader**, the rest `aria-hidden` and `inert`. Since `Die` moved onto `Roller` that
face is the target, as on the drum wheel — the one it is heading for or last landed on — so it stays offered while the
die turns; see _"`Roller`: the wheel's behavior with one more dimension"_. The die reports `aria-busy` while a turn
somebody started is under way.

**The box the faces are laid out in must not shrink.** Pushed back by its radius, a die is drawn smaller than life,
so the frame it reserves is narrower than the box its faces sit in, unlike `Cuboid`'s. That box is a flex item, and a
flex item shrinks to its container by default — so it was squeezed sideways while every face was still placed around
the unsqueezed middle, and the die turned about a point off its own center and wandered as it spun, about sixteen
pixels on a 280-pixel sphere. Found by the user on the sphere test, where a round silhouette makes any drift obvious;
every die had it. `flex-shrink: 0` keeps the box whole and lets it overflow the frame evenly, which is harmless because the
overflow is the box's empty corners. `e2e/die.spec.ts` checks that every face is laid out around the box's middle.

**A change of shape part-way through a turn turns on to the same face of the new shape.** The roller's `reshape` is
what both views call when the geometry changes: at rest on a face the new shape also has, it puts the die straight
onto that face, and during a turn the page asked for it starts the turn again from wherever the die is drawn, towards
that face's rotation on the new shape. **At rest on a face the new shape lacks, it turns too**, onto the face the
target clamps to. The common way in is switching to a die with fewer faces than the number showing, which pulls the
number back and changes the shape at once — and the change of shape and the change of face arrive together, so which
one the framework answers first is not something to lean on: putting a resting die straight onto the clamped face
made a later `turnToTarget` see it already resting there and do nothing, and the switch snapped. Two alternatives were set aside by the user. Snapping onto the new shape, which the port
had shipped, jumps mid-motion. Finishing the turn on the old shape's angle, which the Solid view did before the port,
can leave the die resting crooked. Turning to whichever face of the new shape is nearest to the viewer was also
rejected: it can land off the face the page asked for, and then the die would have to overwrite the page's own face.
A roll is left alone — it lands where it lands, on its own schedule.

### `Die`: free turning, drift and dragging, through `Roller`

`computeRollTarget` is optional, and without it `roll()` returns false. `face` stays the two-way target, written as soon as a roll's result is known and when a step or a drag picks a face; drift leaves it alone. Drift is `autoSpin` with `idleDelayMs` and `driftAxis`, as on the wheel, none unless a delay is given and none while the page is hidden. `isMovable`, off by default and named after `Wraparound`'s, turns on the drag and the arrow keys and puts the die in the tab order. `isSeeThrough` lets back faces paint, for transparent faces whose far side should show mirrored through the front. `aria-busy` now covers any turn somebody started, which is how a turn is told from a snap now that the target face stays offered while the die turns. The tabletop dice behave as before except that a direct turn to a face takes `settleDurationMs`. The icon cloud on the Die page is the user's Magic UI reference: drifting, draggable, transparent faces with an emoji each, step buttons for the single-pointer route, and Pause/Play.

### `Die`: a core at the center, through `renderCore`

Asked for by the user, a planet's core inside a cloud of icons. The core is drawn inside the die's turning body, so the browser sorts it in depth against the faces, and is turned back by the die's own turn (`DieUtils.getCoreTransform`, the transpose of the turn's matrix) so a flat element always faces the viewer like a sphere would; a core that turns with the die would show edge-on mid-tumble. Its box is the die's whole box, so the consumer sizes the painting inside it. It is `aria-hidden`, as decoration: the die's `ariaLabel` names the whole, and a core carrying information would need its own text alternative (WCAG 1.1.1). Nothing is drawn, and no element exists, while it is unset. The Die page's Planet example is the icon cloud with a core, kept to twelve faces whatever the shape picker says, so it stays uncrowded.
