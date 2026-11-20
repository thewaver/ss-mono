# Decisions: `OverheadWheel`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `OverheadWheel` and `DrumWheel`: two presets, because a wheel cannot become a drum

**They share behavior and no markup at all.** One rotates in the plane of the screen; the other is a barrel
seen edge-on, with a front and a back face per wedge, a perspective ancestor and a size derived from the
wedge's own extent. A single component with a mode prop would be `Scroller` and `Carousel` again —
everything they appear to share, they hold for different reasons.

**So the split is `Spotlight`'s exactly**: an unexported `Wheel` shell holds both markups behind one variant
prop, each preset is a one-line pass of that variant, and only `Wheel.types` and `Wheel.const` are exported.
The public API cannot express a variant change at runtime, which is the point, and the props each preset needs
differ in a way a mode prop could not state — `renderWedgeBack` and `wedgeSize` are required on the drum and
meaningless on the flat one.

**The drum's geometry is the component's; the wedge's shape is the consumer's.** `BarrelUtils` computes the
apothem, the circumdiameter and the girth, because the shell cannot lay a barrel out without them; it does not
compute the pie-slice path, because a wedge could be a card, an image or a label on a ring, and the shell never
needs to know. That is the same line `Paginator` draws from the other side: its entries are arithmetic the
component needs to render, so it owns them.

**A wedge's content is sized from the slice it sits in, in container query units, and nothing is measured.**
The original's wedge content was authored against a 600px wheel: it watched the wheel with a `ResizeObserver`,
divided the measured height by that base size, and multiplied the content's `scale` by the result — then
multiplied again by `min(12 / wedgeCount, 1)` so the content shrank once the wedges outnumbered twelve. Both
multiplications are gone, replaced the way `Formation`'s insets were and for the same reasons: the label's box
and its type size are fractions of the wheel's own width written as `cqw`, so the browser resolves them and
there is no observer, no base size, and no frame of wrong layout on mount. `wheelWedge` carries
`container-type: inline-size`, which makes one `cqw` a hundredth of the wheel's width — the same unit the
wedge path's `viewBox` is drawn in, which is why one geometry function returns numbers that serve both the
path and the label.

**The room a label has is the width of the slice at the radius where the label starts, bounded twice.** The
two straight edges bound it as `radius × tan(halfAngle)`, and the arc bounds it as
`√(wheelRadius² − radius²)`; the narrower of the two is the one that applies. Taking only the first puts the
label's top corners outside the circle at low counts — at four wedges the straight edges are 45° off vertical
and give a half-width larger than the circle has left at that radius. Taking only the second is the
original's `paintedSize.width`, the chord between the slice's two rim corners, which is wider than the slice
is anywhere the label actually sits. The half-angle is clamped to a right angle so that two wedges, where the
edges are parallel and the tangent is unbounded, fall to the arc bound rather than to infinity.

**The count-based shrink was inert on the page, which is why the labels collided.** `min(12 / wedgeCount, 1)`
is exactly 1 at every count the props panel offers, since the panel stops at twelve — so the mechanism the
original had could never be seen, and the label box was the full width of the wheel rather than the width of
the slice, so at twelve wedges each label ran across its neighbors. Sizing the type from the slice bites at
every count instead of only past a threshold, and it needs no reference count to be kept in step with the
length of the prize list.

**Two paint constants carry it, and they are ratios rather than sizes.** `LABEL_RADIUS` is how far out from
the middle the label's top edge sits, in `viewBox` units, and `LABEL_TYPE_RATIO` is the type size as a
fraction of the slice's width there. Both are the consumer's half — a wedge could be a card or an image, and
the library never sees either number.

**Type size rather than a `scale` transform, which is what the original used.** A scaled box lays out at its
unscaled width and paints at the scaled one, so clamping the box to the slice and then scaling it down leaves
the paint narrower than the slice — the room would have to be divided back out by the same factor to come out
even. Setting the type size instead keeps layout and paint in one space, and the gap between lines is in `em`
so it follows without a second rule.

**The girth is the diameter after perspective, and the constant it replaced was a fudge that broke.**
Foreshortening means the barrel needs less room than the circle it turns in, and the original took a flat 1% off
per wedge to approximate that. Within the counts it was written for — eight to twelve portrait faces — it lands
within a few percent of the truth; at sixteen faces it takes 16% off and the drum paints outside the box it
reserved, which is the rule `InteractionWrapper` states as _"the wrapper's box has to equal the painted box"_.
So the approximation is gone and the arithmetic it was approximating is in its place:
the width at which the eye's line of sight **grazes** the drum, which is
`2 × perspective × circumradius ÷ √((perspective + apothem)² − circumradius²)`. `BarrelUtils.PERSPECTIVE_PX` is
published and applied as the inline `perspective`, so the number the CSS uses and the number the box is computed
from cannot drift apart.

**The obvious formula is wrong, and it was shipped once before being caught.** Measuring at the axis —
`circumdiameter × perspective ÷ (perspective + apothem)` — reads the width of the drum where its axis sits. But
the silhouette is not there: the tangent points are **nearer the eye** than the axis, so they project wider. The
error is the factor `(perspective + apothem) ÷ √((perspective + apothem)² − circumradius²)`, which is a fraction
of a percent on a narrow drum and grows with the ring, reaching 2.6% at twelve faces 150px wide — twelve pixels,
visible against a dashed border, and worse at higher counts. **This is the second wrong answer here**, after the
original's flat percentage per wedge, and both failed the same way: right in the middle of the range they were
checked in, increasingly short outside it. The user caught both by eye.

**What the geometry is checked against is the rendered result, not the derivation.** The reserved box is measured
against the union of the faces' own boxes, at every count from two to twelve, at rest and sampled forty times
through a continuous turn. That is the assertion that would have caught either wrong formula, and neither unit
test would have. Two faces back to back have no depth at all and one face has no barrel, so the apothem
is zero below two wedges rather than the infinity the tangent gives.

**A drum turns about either axis, and the Playground shows both.** `axis: "row"` rotates about the upright
axis so the faces travel left and right — the original's arrangement — and `axis: "column"` rotates about the
level one so they travel up and over, which is a reel. The extent the geometry works from is the wedge's width
in the first case and its height in the second, which is why a landscape face makes a compact reel and a wide
drum: the same card is the small dimension one way round and the large one the other. **The reel carried each
prize round twice at first, and the user took that out** — nothing on the page now demonstrates that a wheel's
wedges need not be one per option, and the component still allows it.

**The wheel renders no control at all, and hands out a handle instead. This reverses `Carousel`, and the
reversal is the user's.** `renderSpin`, `renderControls`, `computeSpinLabel` and the `<button>` behind them are
gone. What replaces them is `onMount(controller)`, carrying `spin()` plus `getCurrentIndex`, `getPhase`,
`getIsSpinnable`, `getIsAutoSpinning` and `getIsUserSpinning` — so a control **anywhere on the page** can spin
the wheel and can disable itself while a spin is outstanding, which is the whole of what the built-in button
knew.

**Nothing the consumer already holds is on the handle.** A `getWedgeCount` was there and the user took it off:
the wedge array is the consumer's own prop, so its length is theirs to read and the wheel repeating it back is
a second source for one fact. The test for a member is whether the wheel is the only place it can be
known — `getPhase`, its two derived spinning flags and `getCurrentIndex`, which is read off an angle only the
wheel holds, are internal outright. The target is not on the handle, because `targetIndex` already
publishes it.

**`Carousel`'s argument does not carry over, and it is worth being exact about why, since the two now sit on
opposite sides.** There the library owns every button because the rotation is automatic and WCAG 2.2.2 requires
a stop mechanism that is not the author's to omit — a carousel with no controls is one nobody can stop. A wheel
has nothing to stop: the idle turn is ended by the spin and by the consumer's own switch, both recorded above,
and the spin itself only ever happens because someone asked for it. So the button the wheel rendered was
carrying no conformance load, and what is left is `Scroller`'s trade — the consumer renders the button, inherits
naming and the focus ring and the disabled treatment from `Button`, and the library keeps only what nobody else
can know.

**The cost is stated rather than mitigated: a library that renders no button cannot promise one is reachable or
named.** A consumer who wires up no control has a wheel that can only be driven from elsewhere through
`targetIndex`, exactly as a `Carousel` whose consumer builds no buttons on its controller has no keyboard route. That is the same exposure
item 5 records for `Scroller` and it is now the wheel's too.

**No slot survives either, and the one that briefly did was kept for a bad reason.** A `renderHub` was left on
the overhead wheel out of deference to an earlier choice — that an overhead wheel has one control slot and it is the
hub. The user axed it. That choice was about where a **button** goes and there is no button
now; intrinsically the slot contributed one number, `inset: 35%`, which is paint, and a consumer who wraps the
wheel in a positioned box writes it themselves. The Playground does exactly that. `OverheadWheel` renders wedges
and nothing else, `DrumWheel` renders a barrel and nothing else.

**The handle arrives after the first render, which is a real consequence rather than a wrinkle.** A control
reading `getController()?.getIsSpinnable()` sees `undefined` for the first tick and paints as disabled, because
`onMount` fires after the tree is built. `Typewriter`'s `getController()?.update(…)` has the same shape and the
same tick. Nothing on screen has moved by then, so no consumer has yet been able to press anything.

**The overhead wheel exposes every wedge; the drum hides the ones that have turned away.** All of an overhead wheel's
wedges are painted at once, so all of them are real content. A drum's are not — `backface-visibility` removes
them from the picture — and `Carousel`'s rule applies: a control nobody can see is still in the tab order, so
the faces that are not at the marker are `aria-hidden` and `inert`, and the back faces always are.

**A drum of two wedges renders no backs, because it has no barrel to have an inside.** At three faces and up
the apothem is positive, the faces stand off the axis, and a face that has turned away shows the reverse
printed on its own card — which is what `renderWedgeBack` is for. At two the apothem is zero: the faces are
flat against one another with nothing between them, and the reverse of one _is_ the other. Rendering backs as
well puts a blank card in exactly the same plane as a prize, and since they are coplanar the paint order
decides, so the drum showed a back where a front belonged. `BarrelUtils.getHasBacks` is the guard and it
is a count test rather than an apothem test on purpose — the apothem is also zero while a consumer's wedge
size is still being measured, and backs must not flicker in and out during a measurement.

**A picked wedge and a picked drum face wear the same treatment, and the color is decided by contrast
rather than by taste.** Asked for by the user, who found the drums had no visible highlight at all: the card
changed its border from `primary.main` to `primary.light` and nothing else, which is not something anyone
notices on a barrel that is turning. Both now take a `secondary.dark` to `secondary.light` gradient behind `secondary.contrast` text — the
flat wedge as a `fill` on its shape, the drum face as a `backgroundImage` on its card, because one is SVG and
the other is a div, and that is the whole of the difference.

**The purple failed WCAG 1.4.3 and the theme was moved rather than the component.** The wheel's picked
wedge was reported as a warning, not patched — see _"A contrast finding in the Playground's own look is a
warning"_ in `CLAUDE.md` — and the user answered by editing the palette itself, which is the right layer:
every consumer of `secondary` gets the correction rather than the one component that happened to be measured.
What moved was `secondary.light` from 60% to 50% lightness and the family's `contrast` token from a pale
lavender to plain white.

Measured on the built page afterwards, so nobody has to take them again:

- **The overhead wheel's label**, 17.35px regular on a 340px wheel, so normal text needing 4.5:1: **7.04:1**, up
  from 3.41:1.
- **The drum card's text**, 14px regular, the same pairing: **7.04:1**, up from 3.41:1.
- **The drum card's rank badge**, `primary.main` at 24px, which is large text needing 3:1: **4.10:1**, up from
  2.61:1 — clearing the normal-text bar too, so it is safe if the badge ever shrinks.

**A palette pairing that nothing renders is not a finding.** `info.contrast` on `info.main` is 4.03:1 and on
`info.light` 4.15:1, both short of 4.5:1 — and neither is reached, because `info.contrast` has no consumer
anywhere in the Playground. `info.light` is used, but as a foreground on `surface`, which is a different sum.
Worth knowing before that token is first used for text, and not worth changing on its own.

**Only the front faces can be picked, and the back's stripes are left alone.** A back face carries the same
index as its front, so it is flagged as picked at the same moment — but `backface-visibility` means a back is
visible exactly when its front has turned away, and a face that has turned away is not at the marker. The two
conditions cannot both hold, so nothing was needed to keep the highlight off the striped side.

**The marker is drawn by the Playground, not by the wheel, and it needs no arithmetic at all.** All three
demos put a `PageWheelPip` — a filled triangle — against the edge of the box that the wedge at rest fills, so
whatever the wheel has stopped on has the pip touching it. The wheel never has to say where that is, because
the resting position is fixed by the geometry already recorded above: `getIndexAngle` turns the chosen wedge
to zero degrees, and at zero degrees an overhead wheel's wedge is drawn straight up and a drum's face is the one
squarely in front. So the pip is a static piece of paint at a known edge, and nothing about it moves or is
measured.

**Which edge it sits on follows the direction of travel, not the variant.** Faces that travel sideways — a
overhead wheel's rim and a drum on the upright axis — take the pip above, pointing down; the reel's faces travel
up and over, so it takes the pip at the left, pointing in. `PageWheelPip` accepts that as `getSide`, one of
`"top"` or `"left"`, and the same class both places the box and turns the glyph. It hangs mostly outside the edge, so the tip crosses onto the wedge and the body reads as sitting outside it.

**The drums needed a box of their own to be measured against, and `PageWheelStack` could not be it.** The flat
demo's stack is a full-width block because `OverheadWheel` is `width: 100%` inside it, and a box that shrinks to
its content cannot give a percentage width anything to resolve against. A drum's own girth box is definite
pixels, so `PageWheelMount` is `width: fit-content` with automatic side margins: it ends up exactly the girth
box, whose top edge is the front face's top edge and whose left edge is the front face's left edge. That is
the whole difference between the two wrappers, and it is why there are two.

**The pip is outside the wheel's element, which is what keeps the drum's geometry assertion honest.** The
Playwright check compares the box a drum reserves against the boxes its faces occupy, reading both from inside
`[aria-roledescription="wheel"]`. The pip is a sibling of that element rather than a child, so it can hang over
the edge without the check reading the overhang as a drum painting outside its room.
