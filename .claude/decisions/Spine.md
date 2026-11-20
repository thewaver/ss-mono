# Decisions: `Spine`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Spine`: faces hinged on one line, each swung out by its distance from the current one

The user's idea, its six questions settled with them in `backlog.md` before anything was built.

**It is to `Barrel` what a hinge is to a drum.** Every face is the component's own box, hinged on one line through its middle — upright for `axis="row"`, level for `"column"` — and swung round that line to its own angle; seen end-on it is a star of lines where a barrel is a polygon. At `0` a face lies exactly on the box. A positive angle lifts its leading half (the right half across, the top half up and down) towards the viewer and lays it over the other half, which it reaches at `180`, the way a page turns or a split-flap's flap falls. A back is turned a further half turn so it reads the right way up once its face has gone over, and paints the other half. It is a `Primitive` for `Barrel`'s reason: it renders, holds no value, and has no use until something moves its `position`.

**One rule sets every face's angle from its distance to the current one, and two ship.** `SpineUtils.radial` spaces the faces evenly round a turn (a paddle wheel or a rolodex, and a fan at less than a turn); `SpineUtils.leaves` lays the faces already passed flat on one side and the rest flat on the other, the one between at its fraction (a book or a split-flap). A consumer passes their own as `computeFaceAngle`. The distance is counted straight, never the short way round, because a wrapped distance jumps a whole turn at the seam and a transition would play it as a full spin.

**The spine always runs through the middle of the box, and there is no padding prop.** A hinge on an edge is the box moved by half its size, and the gap between the spine and a face's inner edge — the paddle wheel's hollow core — is painted inside the face. Which half of the box a face paints is the consumer's.

**Faces lying flat on each other are pushed apart by a quarter pixel per face of distance**, before the turn, so the current face sits on top of the faces still to come and the last one over sits on top of those before it; two faces at one angle are otherwise coplanar and the browser cannot order them.

**Accessibility is `Barrel`'s**: `faceRoleDescription` is required, `computeFaceDefs` names each face and says whether it is hidden, and hidden faces get `aria-hidden` and `inert`. It is also handed the face's angle, because a wheel hides what is turned away (`SpineUtils.getIsTurnedAway`) while a book also hides pages that face the viewer but are covered. WCAG 4.1.2 checked; Spine never moves on its own, so 2.2.2 falls to whatever drives the position.

**`hasBacks` defaults to `false`, and `perspectivePx` is a prop** (defaulting to `Barrel`'s constant), because a split-flap the size of a character and a book the size of a spread want very different depths.

**A face fills the whole box but paints half of it, so its unpainted half can catch clicks meant for what lies beneath.** `Flipbook` turns pointer events off on the face and back on for its painted half, in its own stylesheet; every half-painted use of `Spine` meets the same overlap, so it may belong in `Spine` itself.

**The carousel's ring and its hinge rule are built from Spine's geometry.** The ring is the `paddle_wheel` placement family: each slide is the carousel's whole box turned about its middle line by `SpineUtils.radial`, painting only its leading half while its back paints the other — flush to the spine in the Playground, the user's call, though a consumer may leave a gap for a hollow core — stacked by `SpineUtils.getLeadDepth` since half-planes sharing an edge cannot cross. That is Made With GSAP's 3D Wheel Gallery (091) look the user asked for. The `hinge` rule's flipping card was already `leaves` about a level spine, so it now calls `SpineUtils.leaves` with identical output; its waiting stack stays its own. The Playground's slide frame became `frameClasses: { front, back }` because a paddle paints half of itself.

**Spine's page is docs only, as every primitive's is.** The paddle wheel is shown on the carousel page and the book is `Flipbook`'s.
