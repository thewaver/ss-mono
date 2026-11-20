# Decisions: `Elevation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Abstracts/Elevation`: a height an element has without carrying a z-index

Built after a tooltip added to the hint example's sliding button turned up blurred and grayed while the
spotlight was open on that very button — the one element the spotlight exists to keep readable.

**Anchor already worked out its own height, and the method was right.** `AnchorUtils.getStackingBase` walks
from the anchor to the root, takes the largest `z-index` it passes, and the popup sits one above it. That is
why a hovered button's tooltip lands at 3: `interactionRoot` goes to 2 on hover. What the walk cannot see is
an overlay that is **not on the walk** — `Spotlight` portals its layers into the `Viewport`'s portal, so they
are siblings of the tooltip rather than ancestors of the button, and nothing in the button's chain says the
page has been covered.

**So the height is published rather than discovered.** A module-level registry holds element-and-z-index
pairs, the `Dismisser` shape again: `ElevationUtils.createElevation` registers on an effect and drops the
entry on cleanup, and `ElevationUtils.getBase(element)` returns the largest registered height whose element
contains the one asked about. `Anchor`'s z-index is now the larger of the DOM walk and the registry, plus one.
`Spotlight` registers its highlighted element at `SPOTLIGHT_Z_INDEX` while it is open, which is the same
constant its four layers are styled with — it was a literal `10` written four times and is now one export, so
the paint and the registration cannot drift apart.

**Nothing is written onto the consumer's element.** The alternative was setting an inline `z-index` on the
highlighted element, which needs a `position` as well, mutates markup the library does not own, and — because
an element painting above the overlay is no longer part of its backdrop — would lift the element's own shadow
and focus ring out of the blur wherever they reach past the hole. The registry is a fact held beside the DOM
instead of a change made to it.

**The registry carries a revision signal, and that is not decoration.** The case that needs it is the ordinary
one: you hover the button, the tooltip opens, and _then_ you press it and the spotlight arrives. The z-index
memo has already run by that point, so without something reactive to depend on it would keep the height it
worked out before the page was covered. `spotlight.spec.ts` asserts the lift without hovering a second time
for exactly that reason.

**It is in `Anchor` rather than in `Tooltip`, so everything anchored to the highlighted element rises.** A
select's popup or a menu opened on it is as much part of "this element is still usable" as its tooltip, and
all of them come through `createPortalPosition`.

**The scale it lands in.** The house runs 1–2 for local lifts, 10 for overlays, 100 for a modal, 200 for
toasts. An elevated tooltip is 11, so it clears the spotlight and still sits under a modal opened over it —
confirmed as the wanted order by the user.

**Only the spotlight grants the lift; tooltips do not outrank overlays in general.** A `guide` seals the page
precisely so that nothing behind it can be read, and a blanket rule would have floated a sharp tooltip over
the elements it is sealing. The spec pins both halves: below the overlay's height on the plain page, above it
once the spotlight is on that element.
