# Decisions: `Bracket`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Bracket`: a layered tree with connectors, and a knockout draw is one arrangement of it

**The props describe a tree, not a tournament, and that is the user's decision.** It was put to them as
bracket-shaped versus tree-shaped — a bracket-shaped API is a subset of a tree-shaped one and the two do not
converge later — and they took the tree. So the same component draws a knockout draw, an org chart and a
skill tree, and `root` is a node with children rather than a list of rounds.

**The name stays `Bracket`, and that is the user's call rather than an oversight.** It names the arrangement
it was asked for rather than the thing that got built, which was put to them along with five alternatives —
`LayerTree`, `Lineage`, `Cascade`, `Trellis` and keeping it — and they rejected all five and kept the name
for now. Recorded so the same list is not put to them twice; a better name is still welcome, but it has to be
one nobody has already turned down.

**A node sits centered between the outermost of the nodes that feed it, and that propagates upward.** The mean
of the first and last child rather than of all of them, so an uneven fan-out still lands the parent between
the ends instead of being dragged toward whichever side has more children — the org chart example is three
children under one node, two under another and one leaf, and exists to show exactly that. A node with one
child sits level with it, which is what a bye looks like and costs nothing extra.

**Rows are counted in leaves and layers in depth, both before any pixel exists.** `computeLayout` returns a
row per leaf and a layer per depth as plain numbers; the component multiplies by the node size and the two
gaps. That is what lets the node size, the layer gap and the row gap all be the consumer's without the
arithmetic knowing about any of them, and it is what the unit tests can check without a browser.

**`orientation` and `rootSide` between them cover four boards, and the layout is computed once.** The
arithmetic runs in layers and rows; `orientation` decides which screen axis each of those two is, and
`rootSide` decides which end of the layer axis the root sits at. So a knockout draw is horizontal with the
root at the end, an org chart is vertical with the root at the start, and nothing about the tree walk or the
centering changes between them. The Playground's org chart is **pinned** upright rather than following the
page's controls, because that is what an org chart is; the other two examples follow the controls, which is
what makes the pair of them worth having. Only two functions know about the screen at all — the one that turns a layer
and a row into a `left` and a `top`, and the one that writes a connector point.

**The connectors are one SVG overlay rather than bordered divs.** The case for CSS boxes over SVG is
animation: several hundred independent transforms composite better than one viewport-sized drawing, because
SVG has no per-element compositing. A bracket has one path per node and no animation, so that argument does not
reach it and a path is far less plumbing
than three positioned divs per connector. The overlay carries `aria-hidden` and no pointer events: it is a
picture of a relationship the list already states.

**The consumer draws the connectors, and the component only says where they go.** The first build took a
width and a color and drew a plain stroke itself, which is the one place this component departed from the
rest of the library — `renderNode` sits beside it, `ScratchCard` takes a `renderCell`, `Shape` takes its fill
and stroke defs. `renderConnector` now receives one `BracketConnectorDefs` per edge and returns whatever SVG
it likes inside the component's overlay, and the two color and width props are gone.

**The defs stop at the two endpoints and the axis, and deliberately do not name the bend.** Each one carries
the parent's facing edge point, the child's facing edge point, which orientation the board is in, and the two
node ids. Where the line turns is nobody's business but the painter's: the middle of the gap is simply the
midpoint of those two points along the layer axis, because a child is always exactly one layer away. Handing
over a spine position instead would have made the elbow a contract, and an elbow is a drawing rather than a
layout.

**The elbow is therefore sample vocabulary, not behavior**, which is the rule the SVG defs move already
settled. `Samples/Bracket/Connectors` holds `BracketConnectorPaths` — `elbow`, `rounded_elbow` and `curve`,
pure functions returning a `d` string, in a file with no JSX so the unit tests can reach them — and
`BracketConnectors`, the painters built on top: `flat`, `rounded`, `curved` and `ball_and_arrow`. A consumer
who wants the usual thing calls one of those; a consumer who wants something else has the numbers.

**A painter is called inside a JSX expression, and getting that wrong looks like a dead control.** The call
was first made straight from the `Index` callback, which runs once per row — so a consumer choosing between
painters from a signal got the first one forever and nothing re-rendered. Wrapping the call in a fragment puts
it in a tracking scope. Worth recording because every other painter in the library is already called from
inside markup and so never showed the problem.

**A gradient stroke needs an id that is unique in the document, and the defs carry one.** Each painter emits
its own `<linearGradient>`, and the first build keyed it on the two node ids — which are unique within a tree
and identical across three of them, so every board on the page resolved `url(#…)` to the **first** board's
gradient and inherited geometry belonging to a picture somewhere else entirely. Thirty gradients, sixteen
distinct ids. `BracketConnectorDefs.id` is now the component's own `createUniqueId` joined to the two node
ids, so a painter has something document-unique to key on without inventing it.

**The gradient runs corner to corner, along the connector's own diagonal.** Anchoring it to the layer axis
alone is also correct, but the axis then spans only the gap between two layers while most of a connector's
length is the run across it — so nine tenths of every line sits at one flat mid-color. Anchoring it from the
parent's edge point to the child's makes each connector ramp along its whole length, and stays consistent
between siblings because every connector's axis is anchored to its own two ends.

**The stops set `stop-color` through `style` rather than as an attribute**, because a presentation attribute
does not resolve a CSS custom property and the Playground's colors are theme tokens. And the two colors are
one family's `dark` and `light`, which is the recorded rule for a gradient in the Playground rather than
anything about this component.

**The ball marks where the line starts and the arrow where it arrives, which is at the parent.** Children feed
a node, so the arrow points the way the tree reads — a seed advancing to the final, a report reporting to a
manager — and the component's own vocabulary already says so with `childIds` and `to_root`.

**A connector stops at the edge of the box it joins, and getting that backwards is invisible until a node
fades.** The first build asked for a node's facing edge with the test inverted, so a parent's line began at
the edge pointing away from its children and a child's ended at the edge pointing away from the root: every
line ran the full width of both boxes it joined. Nothing showed, because a node's own background hid it — the
user found it on the one node drawn at half opacity, where the line was visible straight through it. The test
is now `BracketUtils.getFacingEdge`, which is where a unit test can reach it, and `bracket.spec.ts` walks
every point of every path against every node's rectangle so the same mistake cannot hide behind an opaque
box again.

**The nodes are a list, and the connectors are not in it.** Every node is an `li` positioned absolutely, so
what a screen reader gets is the nodes in layer order with nothing about the lines. A bracket read out line by
line is meaningless; the structure is the content.

**One tab stop, with the arrows walking two axes, and which arrow does what follows the picture.** The two
keys along the layer axis step between layers and the two across it move within one, so turning the board
upright turns the keys with it and the arrow always matches what the reader sees. Moving within a layer stops
at the ends rather than wrapping into another one — wrapping there would land focus somewhere visually
unrelated. Stepping toward the leaves lands on the middle of the nodes that feed this one, which is the one
the eye is already on. `Home` and `End` jump to the ends of the layer, and disabled nodes are skipped as
everywhere else in the library.

**Ids are the path through the tree.** A node's id is its index path — `0.1.0` — so the layout is a pure
function of the tree with no identity injected by the consumer and no map to keep in step. The cost is that
reordering a node's children renames it, which matters only if a consumer holds an id across such a change;
nothing in the component does.

### `Bracket`: the focused route is the focused node and everything between it and the root

**A node is on the route when its id is the focused id or a leading part of it that ends at a separator.** Ids are already paths through the tree, so the whole test is `BracketUtils.getIsOnRoute`: no walk, no map. The separator matters, because `0.1` is a prefix of `0.10` without being its parent. A connector is on the route when its child is, since the parent of anything on the route is on it too. With nothing focused there is no route, so a board nobody has touched lights nothing.

**`isFocused` and the route both mean "holds focus", and the node Tab returns to is remembered apart from that.** One signal cannot do both jobs: set on click and on arrow keys and never cleared, it goes on reporting focus after the person has clicked away, and reports nothing when the board is tabbed into, because Tab sets no signal. So nodes report focus and blur for themselves. The remembered node survives blur so the roving tab stop still returns to it.

**`computeConnectors` lists the route's connectors last.** Every connector is drawn into one SVG, and SVG has no stacking order — whatever is painted later sits on top — so a plain connector painted after a route connector covered it where they crossed, and a consumer styling the route could not fix that from outside. The order is otherwise meaningless, so the route goes to the end and every renderer that paints in order draws it on top.

**In the Playground the focused node is styled as one more node on the route, and nothing else.** The user's call: stacking a `primary` "focused" border and text under the route's `secondary` ring gave a node with two borders in two colors. The keyboard focus ring still marks focus; after a click, the route starting there is the mark.

### Traveling beams on `Bracket` and `PatchBoard` are Playground paint

From Magic UI's Animated Beam, a pulse of light running along the line between two elements. Both components already
hand every line to the consumer to draw, so the library learned nothing: every example on both pages carries beams,
and a beam is a second path laid over the line with the same `d`.

**A beam measures its length on screen and moves at one speed.** The dash is `BEAM_DASH_PX` long and travels at
`BEAM_SPEED_PX_PER_SECOND`, so a pulse looks the same on a short line as on a long one and takes longer on the long
one. The length is the path's own times the scale it is drawn at (`computeBeamLengthPx`), and a `ResizeObserver` on
its drawing measures again when the board is scaled, as `PatchBoard`'s zoomed example is. The first build used
`pathLength="1"`, which gave every line one lap of the same duration: a pulse then raced along a long cable and
crawled along a short one, which is what was replaced. The dash moves toward the path's end or its start: a
`PatchBoard` cable runs from the output to the input it feeds, so it moves toward whichever end is the input; a
`Bracket` connector is drawn from the parent to the child, so it moves back toward the parent, which is the way to the
final.

**Each beam is one Web Animations API animation, set to the page's clock** — its `currentTime` is the page's time
modulo its period. Two beams of the same period are therefore always at the same point of it, a beam put on the page
later carries on in step rather than starting over, and pausing one leaves it where the clock had it. A CSS animation
could not be set that way: it starts when it is applied.

**On `Bracket` the beams along one route are one pulse.** Every beam reports its length (`onLengthPx`) to the page,
which adds up each route's lines by the board they are on (`computeRouteSpan`, keyed by `toConnectorBoard`); each beam
is then given the route's whole length as its period and the length of the lines below it as its start. So one dash
leaves the focused node and runs to the final across every line in turn, rather than each line running its own.

**On `Bracket` the beam runs only along the focused node's route to the root**, through `isOnFocusedRoute`, which the
connector defs already carried. **Both pages carry a "Beams moving" box among their page-wide props**, starting off
under reduced motion, and that is the stop WCAG 2.2.2 asks of anything moving for more than five seconds: one press
away, in force across every example, and in force for a route focused afterwards. The separate beam examples went
with it.

**The beam is a styled component, `PageBeam`, in each Playground**, painted from one shared stylesheet, and the cable's
curve moved into `PatchBoardContent.const.ts` in the shared Playground so the cable and its beam are the same curve in
all four apps; it had been written out once per app. On `Bracket` the beam follows the page's connector knob through a
lookup from each connector sample to the path it draws (`BEAM_PATHS`), since the samples themselves only return
markup.

### `Bracket`: a family is three rows the consumer frames with a view

From Skiper UI's knockout bracket, which shows a window of the tree and pages through it.

**A family is three rows, named by the node the focused one feeds.** The user's definition: the focused node's parent, the focused node with every sibling it has, and every node that feeds any of those siblings — so focusing a semi-finalist shows the four quarter-finalists, the two semi-finalists and the final. A row that does not exist is absent: a leaf shows its parent and itself among its siblings; the root shows itself and the nodes that feed it, never what comes after it; nothing focused shows the root's family. The rule is one function, `BracketUtils.getFamilyAnchorId`, and membership is `getIsInFamily`, read off the ids the way the route is.

**The family is a two-way prop, `family`, written by the board as focus moves and by the consumer from outside.** It is named by the node its middle row feeds, `undefined` for the root's own. It replaced an `onFamilyChange` callback: the Playground's stage buttons page through families without focus ever entering the board, which a callback cannot do. `BracketUtils.computeFamilyStep` finds the family a step away and answers the family itself when there is none, so a button can disable itself by comparing the two.

**The board does not know what a family looks like on screen; a view does.** The board takes a `view` — an area of itself in pixels — and draws inside a window that fills its container (see `PanZoom` below). `BracketUtils.computeFamilyView` answers the area around a family's members, with a margin and room for the header strip along its edge; `computeWholeView` answers the whole board. The consumer connects the two: when `family` changes, it writes the family's view. **This replaced a folding view, `view: "family"`, which was dead code**: the Playground's family example had moved to a camera over the whole tree and nothing set it any more. The camera then turned out to be the component's job, since everything it worked out came from `BracketUtils` and from props the board already had — so it moved in, as the pan-and-zoom window, and the folding went.

**Bracket keeps `family` and the view in step when `isFollowingFamily` is on, reversing the narrower half of "the board does not know what a family looks like on screen".** The user's call, after a drag to the entrants left `family` on the final, so the lit round and the stage buttons still answered for a family no longer in the window. The two are values of the board's own that have to agree, the board already writes one of them on focus, and only the board can tell a change a gesture made from one the consumer made — left to the consumer, every one would write the same two-way sync and the same guard against the two chasing each other. The framing itself stays out of the component: Bracket calls `BracketUtils.computeFamilyView` and `computeFamilyInView`, which stay public. A family that changes is framed, gliding; a gesture that moves the view writes the family it now shows, live, without moving the view again, which is what keeps a drag from being pulled. **Off by default**, since a window over a large draw with no family behavior is a reasonable thing to want, and ignored without a view.

**The family in view is the one whose framed view has its middle nearest the window's middle.** The family follows whatever the window is centered on, at any zoom, the way it follows keyboard focus, and a view framed on a family reads back as that family, so a snapped family stays put when nudged. Every family at every depth is a candidate, so a window centered on one pair of entrants finds that pair's — the user asked for that, since within one round there are several families side by side to pan between — and the board's own geometry carries both orientations and both root sides. **The first build compared areas instead**, the family sharing the most with the window against what the two covered between them, and the user's first test broke it: zoomed in, the window is small, the families around the final are large and always scored poorly against it, so a drag towards the final never left the quarter-finals. A rule tried in between, the family of the match nearest the window's middle, followed correctly but did not read a framed family back as itself.

**With `isFollowingFamily`, the window may pan until any edge of the board sits in its middle** (`canCenterEdges` on the shared bounds), the user's choice over keeping it inside the board and reading the position off how far it had panned. Held inside the board, a zoomed-in window stopped against the edge with its middle over the semi-finals, so the final could never be centered, framed or followed. The cost, empty space past the edge, is what the user asked to see. **Only while a family is in view**: zoomed out, the window is held inside the board as before, so the whole draw cannot be dragged off center with nothing to frame — the user's call over snapping it back on release, which would have left it free to drift with snapping off. Zooming out past the family level from a view parked past an edge pulls the window back inside as it crosses that line.

**A framed family is centered on its middle round**, also the user's call: along the rounds the view is centered on the middle row and reaches as far each way as the family's furthest row. For every family but the root's own the two coincide; the root's own middle row is the final itself, so it is framed with the final dead center, the semi-finals to one side and room where a further round would be.

**Zoomed out, the family is kept and no round is current.** A view wider than every family's framed view is showing no family; `family` stays as it was, so zooming back in returns to it — the user's call, who found that desirable — and `isCurrent` is false on every layer while it lasts, which is what unlights the round names.

**`familyMargin` is a prop, defaulting to `0`.** The user's rule: a headless library does not make a layout guess, and twelve pixels of room around a family was one. The Playground passes its own.

**`isSnappingToFamily` glides the view to the family in it once a gesture is over, or to the whole board when the gesture left the view wider than any family**, so a snapped board only ever rests on one of two levels. The user first asked whether the wheel should simply toggle between the two; keeping the live zoom during the gesture and landing on one of the two afterwards was taken instead, since a toggle leaves a pinch with nothing moving under the fingers and needs a threshold against the stream of small wheel events a trackpad sends. It was first built to leave a view wider than any family where it was, which let a zoom stop halfway between the two. A gesture is over when a drag or a pinch is let go, and for the wheel after it has rested for 200ms, since a wheel has no release. The 200ms is a feel value, not a measurement. The shared gesture tracker reports the end of a gesture through `onSettle` and every view move a gesture makes through `onGestureMove`; neither knows what a family is. A general "snap this view" function for PatchBoard was not built, since nobody asked for one there.

**The keyboard walk is not confined to what is on screen.** Walking to a node outside the window moves the window just far enough to show it, as any focus outside it does; a consumer following `family` with its view moves it on to the whole family a moment later.

**`renderLayerHeader` is handed whether its layer is the current round**, `isCurrent`, which is the layer holding the family's middle row (`BracketUtils.getFamilyLayer`) — the focused node's own layer, since the family is named by its parent — and the root's layer for the root's own family, whose middle the root is. Vue's slot takes one value, so there it is `{ layer, state }`, the shape its `renderNode` already had.

**With a view, the round names are pinned to the window's leading edge**: the header strip's cross position follows the shown view's start, its top while the rounds run across and its left while they run down. A pinned name sits above the nodes, so a node the window shows at its very edge can sit under its round's name; **a pinned header lets the pointer through** (`pointer-events: none`), since it is not something to press. This was the Playground's own CSS before the camera moved in.

### `Bracket`: the Playground's family example writes a view

**It keeps the whole draw mounted, hands the board a view and turns `isFollowingFamily` on**, so the stage buttons only write `family` and the board frames it. Zoom out writes `computeWholeView`; Zoom in writes `computeFamilyView` for the family the board kept, since writing `family` its own value would change nothing. Whether it is zoomed in is read off the view with `computeFamilyInView`, so a wheel zoom flips the toggle as well as the button. A "Snap to family" knob switches `isSnappingToFamily`, on by default. The frame it gives the board is the size `computeFamilyExtent` answers for the largest family, so the page never shifts as the family changes. Nothing is folded, so every node stays where the tree puts it, reachable and in the accessibility tree.

**The glide is the board's `transitionDurationMs`**, which the page's Glide knob sets and which reduced motion turns to `0`. **Zoom out fits the whole draw and Zoom in goes back to the family**; the stage buttons are disabled while zoomed out, since paging families the window is not framing would change nothing anyone can see. Those buttons and the zoom toggle are the example's route for anyone who cannot drag or pinch (2.5.1, 2.5.7): together they reach every family.

**What WCAG said.** 2.4.3 Focus Order: the walk keeps its order and the window moves ahead of it. 2.4.11 Focus Not Obscured (Minimum): a node taking focus outside the window brings the window to it. 3.2.1 On Focus, "When any user interface component receives focus, it does not initiate a change of context": checked, moving the window is a change of content inside the widget, not of context. 2.3.3 Animation from Interactions: the glide is started by the person and turned off with `0`, which the Playground passes under reduced motion.

### `Bracket`: round headers make each layer its own list

**Given `renderLayerHeader`, each layer becomes a `ul` named by its header through `aria-labelledby`, and the board becomes a group carrying `ariaLabel`.** A reader then hears "Semifinals, list, two items" rather than seven nodes in a row with no sense of where one round ends. Without headers the board keeps its single list. Several unnamed lists would be worse than one named one, so the structure only splits when there is something to name the pieces with.

**The strip sits along the board's leading edge, and each header is one layer long.** When the rounds run across the page the strip is along the top, and each header is as wide as a node and sits in its layer's column. When they run down the page the strip is down the left, and each header is as tall as a node. Header positions come from the same layer-start arithmetic as the nodes, so `rootSide` moves them along with their layers. `layerHeaderSize` is the strip's thickness and nothing else: the connectors and nodes are offset by it in the one coordinate space the overlay already uses, so a connector's points and a node's box never disagree. The header is handed the layer counted from the root, so `0` is the final, which is how a knockout names its rounds.

**`onActivate` passes the placement alongside the value**, the same `BracketPlacement` that `renderNode` receives, because two nodes can carry equal values — a winner appears in every round it advances through — and the value alone cannot tell them apart.
