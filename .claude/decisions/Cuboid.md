# Decisions: `Cuboid`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Cuboid`: a box of six faces, and two counts that drive it

Asked for as "like the drum, but two axes of control, and not necessarily even faces". It shares the barrel's
perspective and its projection formula and none of its arithmetic, which is the honest split rather than a
missed reuse.

**Named `Cuboid` and placed in `Exotics`, both on the user's call.** It was built as `Cube` and the name was
put to them, since a component whose point is that the three extents differ is only a cube by accident; they
took the exact word. `Exotics` is where they put it, which also settles that the turning components belong
there rather than beside the carousels. `FlipCard` was left in `Essentials` at the time and has since been
moved across on the user's call, so the rule now reaches every turning component; the user noted that
`DrumCarousel` would fit `Exotics` too but that splitting the two carousels across folders is not worth doing
now. That last point is recorded in `backlog.md` under _Open discussion_ rather than settled here.

**What a screen reader is told is `box`, not `cuboid`.** `aria-roledescription` is read aloud, and the word it
replaces the role with should be the ordinary one — a listener meets "box, group" rather than a term they may
have to stop and parse. The exact word is right for the API, where the reader is a developer choosing a
component, and the plain one is right for the page.

**A barrel derives one radius; a box is told three extents.** Every face of a barrel is the same size, so the
distance from the axis follows from the face count by trigonometry. A box has a width, a height and a depth,
each face sits at half of one of them, and each face's own size is the two extents it spans — the sides take
the depth as their width, the lid and the floor take it as their height. There is no trigonometry anywhere in
`CuboidUtils`.

**The rotation is on the box; a barrel's is on each face.** A box turns as one about two axes, so one transform
on the body says everything: push back by half the depth, then pitch, then yaw. A barrel cannot do that,
because each of its faces sits at its own angle around a single axis. This is why `Cuboid` renders its own
markup rather than going through `Barrel`.

**Two counts of quarter turns, not a named face.** This is the box with `isUpright` off; upright mode keeps
the counts but reads them as a record of presses rather than a pose (below). `yaw` and `pitch` are
unbounded integers, and the angle is the count times ninety degrees. Three things fall out of that. The box always turns the way it was
pushed, because a count of `+1` is a quarter turn in that direction whatever the count already was. There is no
wrapping problem to solve — the drum carousel had to keep a running angle for exactly this reason, and here the
running total _is_ the API. And naming a face as the prop would have required the component to choose a route to
it, of which there are several, none obviously right. A consumer who does want to name one calls `turnTo` on
the controller, which picks the route and writes the counts, so the counts stay the only thing that turns the
box.

**Turning over the top leaves the far side upside down, and that is kept rather than prevented.** The strategy
put to the user said the pitch would be clamped at a quarter turn either way, on the grounds that the two axes
collide there — on the lid, turning across spins the lid in place instead of bringing a new face. Built, that
argument does not hold up: clamping makes a second press of "up" do nothing, where a real box tips over its top
and shows its back inverted. So pitch cycles like yaw, the inverted states are reachable, and `cuboid.spec.ts`
pins the sequence. What is genuinely degenerate — turning across while on the lid — is left as it is, because
it is what a box does.

**Its box is its front face, width by height, and a turn spills past it.** The user's rule for anything turning under
perspective: a component's box is its content at rest, and a turn may draw outside it. The first build reserved the
silhouette of the sphere the box sits inside — correct at every orientation — which on the Playground was a 334px
square around a 200 × 260 face. A cuboid comes to rest on whichever face its turns leave in front, so "content at
rest" needed a decision. Sizing to the face showing now moves the page every time it settles on a different face;
the largest face it can rest on was built first and still left a free-mode cuboid a square of its longest edge,
since a face can rest on its side. **The user settled it by fiat: the front and the back are the faces a cuboid is
sized for**, in both modes, and a side or the lid resting larger than them spills past the box as a turn does. So
`CuboidUtils.getReservedSize` takes the size alone, and the box never changes with the face showing or the mode.

### `Cuboid`: upright mode keeps an orientation, and the counts become a record of presses

**With `isUpright` the box stores how it actually lies, as a rotation matrix, and the two counts stop being a pose.** Each change of a count is a quarter turn about the screen's own vertical or horizontal axis as seen, followed by a spin about the line of sight until the showing face reads upright. Because the face is righted after every press, presses do not undo one another: from the lid, across and back again lands on the front. And the same two numbers can mean different faces depending on the order they were reached in. That is why `getFacing` lives on the controller: in this mode nothing but the component can answer it. A change of several counts at once is that many presses, across before up. A long run is cut short once it loops, since a righted box has only six resting orientations. Off, the counts are read as a pose, as the entry above describes.

**A settle is the shortest turn to the face, then the righting spin, never one straight rotation.** Of the four ways the target face can lie, the turn goes to the nearest, so a single press is exactly the quarter turn about the screen axis that was asked for. Whatever righting remains follows as a spin, and each phase takes time in proportion to its angle. One shortest rotation would have been fewer lines but does not look like the press: top to right becomes a 120° diagonal roll, and tipping over the top becomes a 180° flip about a diagonal.

**The animation is written so the browser only ever interpolates an angle.** Every keyframe carries `translateZ rotateZ(s) rotate3d(axis, θ) matrix3d(target)`, and between neighbors only one angle changes about a fixed axis. Matching function lists interpolate function by function, and `rotate3d` with an unchanged axis interpolates its angle as a plain number. So nothing is handed to matrix decomposition, where a quaternion slerp may take the long way round depending on the browser. The start is read back from `getComputedStyle`, so a press mid-turn or a drag let go part-way still takes the short way. A half turn goes the way it was pushed.

### `Cuboid`: `turnTo` plans from the real orientation and writes the counts

**Naming a face is a controller command because only the component knows where it can be reached from.** In upright mode the counts say nothing about how the box lies, so a pure helper over `(face, yaw, pitch)` could not answer. `turnTo` tries every pair within two turns each way, which reaches every face from every orientation. It takes the fewest turns, then the fewest tips, so turning across comes first on a tie, then positive before negative. It carries the turn out by writing the counts, so an owner of the counts sees it as presses and the counts stay the only thing that turns the box.

### `Cuboid`: a drag follows the pointer and is recorded as presses

**A drag of one box width is one quarter turn, and letting go rounds each axis to the nearest whole turn and writes both counts at once.** Short of half a turn on the axis traveled furthest it springs back. While held, the partial angles are laid over the pose: in upright mode about the screen's axes, which always match the pointer. In the counts-as-pose mode the across turn is about the box's own axis, which is why it is flipped while upside down. On the lid it spins the lid, the same degenerate case pressing has. Reduced motion is the consumer's to answer, as elsewhere: `transitionDurationMs={0}` makes every settle instant. The single-pointer route WCAG 2.5.7 asks for is the counts and `turnTo`, and the component cannot provide it on the consumer's behalf.
