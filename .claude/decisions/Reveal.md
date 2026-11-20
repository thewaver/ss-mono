# Decisions: `Reveal`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Reveal`: a cover with a hole where the pointer is

The user's suggestion, made while looking at the `PointerTracker` example that does the same thing by hand.
Both now exist and that is deliberate: the example on the abstract's page shows the reading is enough to build
this yourself, and the `Exotic` is the packaged one.

**The cover is the consumer's and the hole is the component's.** `renderContent` is what is hidden,
`renderCover` is what hides it, and the component contributes only the mask that cuts the hole and the
positioning that lays one over the other. The mask is computed here and applied there — see _"The mask is
handed to `renderCover`"_ below. This follows `Spotlight`'s split — that component owns the hole in an
overlay and hands the overlay's paint to `renderOverlay` — and it is why the frosted, opaque and text-carrying
covers on the Playground page are all the same component with nothing switched. The two now share the mask
builder as well as the shape of the handout: see _"`Spotlight`'s overlay is one masked layer and one clipped
layer"_ for `Abstracts/Cutout` and for what a mask cannot do about the pointer.

**`renderCover` is handed whether a reveal is happening.** A cover that says "nothing to see here" until the
pointer arrives needs to know, and the alternative — the consumer tracking the pointer a second time to find
out — would make the component the harder way to do it. The flag is true only while the pointer is inside the
element or keyboard focus has opened the hole, which is also what the reduced-motion path keys off.

**The cover takes no pointer events.** Its text was selectable, which is wrong twice over: a cover is paint
rather than content, and a caret dragged across it is a pointer interaction the thing has no business
answering. `pointer-events: none` on the cover layer settles it. The content underneath once took those events
instead, so a determined visitor could select the hidden text through the cover; it no longer can, since the
content is now `inert` (see _"`ScratchCard` and `Reveal`: what is under the cover cannot be reached until it is
uncovered"_ in `ScratchCard.md`). The content is still in the document either way.

**The hole is a small SVG image, not a gradient.** A `radial-gradient` can only be a circle or an ellipse,
which is what shut the door on every other shape, so the hole is drawn as an SVG blurred by `softness` and
composited against a full-coverage layer with `mask-composite: exclude`, which is Baseline widely available
since December 2023. **The image depends only on the three shape props, never on the position**, so it is
built once per shape change and moved with `mask-position`; regenerating a data URI every frame would have
been an image decode per pointer move. Following the pointer in pixels needs the element's own size, which the
reading deliberately does not carry, so the component observes it with `ElementObserver` — visible now in the
page's derived dependency row, which is the mechanism working as intended.

**`radius` and `softness` rather than a gradient string.** Softness is how much of the radius the fade takes up,
so `0` is a hard-edged hole at the full radius and `1` is all fade — the drawn shape shrinks as the blur grows,
until only the very center comes close to fully clear. **It ran the other way at first**, as the fraction left
clear, so `1` was the hard edge and the Playground labeled the field _Clear fraction_; the descriptions drifted to
say `0` was hard while the arithmetic did not. The user's call was that the name must mean what it says, so the
arithmetic was flipped across all three Reveals — `Reveal`, `Lens` and `ScratchCard` — and each default moved to
keep its look: `Reveal` from `0.45` to `0.55`, `Lens` from `1` to `0`, `ScratchCard` from `0.8` to `0.2`. A
consumer who had set a value of their own gets the opposite edge, which they accepted as the price.
Handing the consumer the gradient instead would have made the hole's geometry their arithmetic rather
than the component's, and `radius` and `softness` name the effect where a gradient string names the mechanism.
That the hole is a mask is no longer hidden — the paragraph below says why — but building it is still the
component's job and only the finished style crosses the boundary.

**An arbitrary hole is `computePoints`, the same callback `Shape` takes**, and `joinRadii` and
`lameExponents` come with it. The component passes the points to `ShapeUtils.getPaths` — which lives in
`@thewaver/ss-utils` rather than inside `Shape`, so nothing had to be extracted to reach it — and drops the
resulting contour into the mask image in place of the built-in shape. A consumer who wants a hexagon writes
the callback every `Shape` consumer already writes, and rounded or bevelled or scooped corners are the same
two props they would use there.

**`roundness` was deleted rather than kept beside it.** It ran the hole from a square to a circle, which is
a four-point contour with a join radius said a second way — and the second way only worked while no points
were given, so a page carrying both would have shown a control that silently stopped mattering. A rounded
square now comes from four points and a `joinRadii`, and the Playground's _Corner radius_ and _Corner style_
fields are disabled while the shape is the default circle, which is the honest form of the same fact.

**With no `computePoints`, the hole is a circle drawn as a `<circle>`**, decided by the user. The alternative
was a polygon standing in for one, which is worse at every count the component cares about: more points to
blur, a visible facet count at large radii, and arithmetic in the common case that the SVG element does
exactly. The points are computed in the image's inner box rather than its full square — the blur needs room
inside the image or it clips at the edges — and the contour is then translated by that same inset.

**The mask is handed to `renderCover`, not applied by the component.** The signature is
`renderCover(getIsRevealing, getMaskStyle)` and the consumer spreads that style onto its own cover element;
the component's cover layer keeps only its positioning and `pointer-events: none`. The idiom already existed
one component over — `Shape` hands `renderChildren` a `getClipPath` for the consumer to put on its own
element, and `Surface` is the in-library consumer that does exactly that.

**What forced the change is a browser rule about filters.** An element carrying a mask becomes a _backdrop
root_: it seals whatever is painted behind it off from `backdrop-filter` on anything inside it. While the
component owned the mask, a frosted cover — the consumer's element, sitting inside the component's masked
layer — had nothing left to blur the moment the pointer arrived and the mask appeared. So the blur existed
only at rest and vanished on the first pointer move, which is the opposite of the effect the example claimed.
Mask and filter on the same element and both hold together. This is what makes the whole family reachable:
content grayed or blurred everywhere with color and detail restored inside the hole is a `backdrop-filter`
on the cover and nothing else.

**The cost, accepted rather than mitigated.** `Shape`'s handout is optional — ignore `getClipPath` and the
shape still draws correctly, since the clip only matters to children that must sit inside the contour.
`Reveal`'s is the entire product: a cover that never applies the style shows no hole at all, and nothing can
detect the omission to warn about it. The alternative weighed against it was keeping the mask on the
component's layer _and_ handing it out, which masks a filtering cover twice and makes one `softness` value
produce two different edges depending on which path the consumer took. A silent divergence in what a prop
means was judged worse than a silent omission, and the user took the call on the grounds that nothing here is
irreversible yet.

**It reads no preference of any kind, and reduced motion is the consumer's to answer.** The first build had
the component substituting for itself — under reduce, no traveling hole and the whole cover fading instead —
on the argument that the motion is not incidental here but is the entire component. The user rejected it: the
rule set with the wheel holds for a component too, so the library reports and the consumer decides.

**What made that answerable rather than a refusal is `radius`.** A radius of zero cuts no hole while the
tracking carries on, so `getIsRevealing` still reports whether the pointer is inside. A consumer answering the
preference therefore writes one expression — zero radius under reduce — and fades its own cover on the flag it
is already handed, which is the substitution the preference actually asks for rather than the deletion
`isDisabled` would give. **The general rule this settled: a component or abstract that reports rather than
enforces has to leave the consumer a way to express the answer, or "the consumer decides" is a refusal wearing
a rule's clothes.** A Playground example demonstrating exactly that was built and then cut on the user's call,
so the door is recorded here rather than shown there.

**`transitionDurationMs` went with the substitution.** It existed to time the cover's fade; with the fade now
the consumer's, the transition belongs in the consumer's own stylesheet, and a prop timing a transition the
component no longer performs is dead API.

### `Reveal`: one Tab stop, the hole opened by keyboard focus and moved by the arrows

**WCAG 2.1.1 made this a gap rather than an option.** The reveal depends on where the pointer is, not on the path it took, so the exception for path-dependent input does not apply, and without a keyboard route a sighted keyboard user has no way to see under the cover. Reveal is `role="group"` with a required `ariaLabel`, because a focusable element with no name is announced as nothing. **The hole opens at the center only when the browser reports `:focus-visible`.** A click that focuses the element must not throw the hole to the center while the pointer is elsewhere. The arrow keys move it by `stepSize` pixels, held inside the box, and blur closes it. **The pointer and the keyboard hand the hole back and forth rather than competing.** Moving the pointer over the element takes the hole back. An arrow pressed while the pointer is inside picks it up from where the pointer left it. `getIsRevealing` covers both, so a cover that changes what it says still does so for a keyboard user. Arrows with Alt, Ctrl or Meta are left to the browser.
