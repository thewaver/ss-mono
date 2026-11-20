# Decisions: `PanZoom`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `PanZoom`: one window over content, shared by `Timeline`, `Bracket` and `PatchBoard`

**Timeline was the precedent, on the user's call**: the component owns the gestures and the arithmetic, and the consumer moves it by writing numbers it does not have to understand. Bracket's camera and PatchBoard's zoom and pan had both been left to the consumer — PatchBoard by a recorded decision, below, now reversed. **One shared block, with Timeline moved onto it too**, the user choosing less duplication over leaving a working component alone: `PanZoomUtils` in the core, `PanZoomSolidUtils.create` for Solid.

**The view is an area of the content in the content's own units, never a scale and an offset.** The user's choice over the alternative: the right scale depends on the window's size, so a helper would have to measure the window and its answer would go stale on every resize; an area does not. Pixels for Bracket, fractions of the width for PatchBoard, the range's own units for Timeline. The component fits the area to the window's shape about its middle (`fitView`), holds the size between `minWidth` and the whole range, then the position: in a direction where the view is no larger than the range it is slid back inside, and in one where it is larger the range is centered (`clampView`). So any area can be asked for, and the component is told numbers only: what a family is stays in `BracketUtils.computeFamilyView`, outside it.

**Zoom is the same both ways**, so a two-way view always has the window's shape. **A span is the one-direction case**: Timeline uses `SpanUtils.clamp`, `zoom`, `pan` and `reveal` — its own functions, moved to `ss-utils` — and a gesture tracker told it moves across only through `getAxes`, which also keeps a vertical wobble from counting towards the four-pixel slop or a pinch's gap.

**Gestures are on by default, as Timeline's are**, and either can be turned off with `isPannable` / `isZoomable`. The user's call; the two options differed only in the default and it can be flipped later. WCAG does not decide the default — no criterion covers a component taking the wheel — but it does decide what has to exist whatever the default: 2.5.1 Pointer Gestures (A), "All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential", so a pinch needs buttons; and 2.5.7 Dragging Movements (AA), "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential or the functionality is determined by the user agent and not modified by the author", so a drag-pan needs buttons. **So the controller is not optional** — `zoomBy`, `panBy` and `showArea`, handed out through `onMount` — and every Playground example that turns a view on draws buttons: PatchBoard's Zoom and Pan through `PagePanZoomControls`, Bracket's family example through its own toggle and stage buttons.

**Without a view there is no window and no gestures.** Bracket is drawn whole at its own size and PatchBoard as it always was; the window, the gestures and the controller's effect all wait for a `view`.

**A gesture lands at once; the consumer's and the controller's writes glide** over `transitionDurationMs`, eased by `TreemapUtils.easeZoom` on `TreemapUtils.createZoomClock`, which now has six users and still wants a neutral name. A drag that lagged behind the pointer would feel broken. A resize lands at once too, and a glide that starts mid-glide starts from what is on screen. Which write was which is told by value: a gesture records the view it wrote, and the change that arrives equal to it is not glided. Timeline has no glide; its writes land at once, as before.

**Focus never sits outside the window.** A node or a stop taking focus outside the view moves it just far enough (`showArea`), and a PatchBoard item carried from the keyboard brings it along the same way, where it used to scroll the consumer's container. Focus calls pass `preventScroll` while windowed and the window puts its own scroll back on `scroll`: the window clips, and the browser would otherwise scroll it to reveal a focused element, after which the transform and the scroll disagree about what is where.

**The window takes touch and selection.** `touch-action: none` while either gesture is on, since both directions pan — Timeline keeps `pan-y`, since it moves across only. `user-select: none` while panning is on: the first browser probe showed a drag selecting the node labels as it panned.

**PatchBoard pans only from empty board.** A press whose target is inside a node or a socket is left to the carry it already started; anywhere else it pans. The pointer is still converted against the board's measured box, which includes the window's transform, so a drag lands under the pointer at any zoom with nothing told the scale. The window keeps the board's shape (`aspect-ratio` from `heightRatio`), and `maxScale` counts how many times larger than the whole board the window may zoom, four by default; Bracket's counts window pixels per board pixel, one by default, so it never enlarges past its own size.

**PatchBoard can be laid out wider than its window, with `boardWidth`.** The user's call, sealed by Bracket working that way already. Every PatchBoard size is a fraction of the board's width, while a consumer's node content is sized in pixels — a label's font, a node's padding — so a patch drawn for a 1120px board, laid out at a 460px window, came out with its labels about 2.4 times too large for their boxes at every zoom, since zooming scales box and text together. Given `boardWidth`, the board is laid out at that width and scaled into the window; left out, it is laid out at the window's own width. Rejected: shrinking the content in the example with CSS `zoom`, which leaves every consumer with a dense board to find the same trick, and redrawing the patch with fewer, larger nodes, which loses the complexity the example is there to carry.

**The Playground's PatchBoard Zoom and Pan examples are one example**, on the user's call once both became the same mechanism. It keeps the Pan example's longer recording chain, laid out at its own 1120px with `boardWidth` and opening at that size, since the Zoom example's short chain was the simpler of the two and less likely to catch a fault. The zoom and arrow buttons sit below the board, as the Bracket example's do.

### A gesture with no single-pointer route warns when the consumer holds nothing to build one on

The user's call, applying _"An accessibility mistake the library can detect is warned about"_. Panning by drag,
zooming by pinch and sending a card by swipe each need a single-pointer route that is not a drag (2.5.7, 2.5.1), and
the settled route is buttons the consumer draws. A button can be built on the controller handed out through `onMount`
or by writing a value the consumer shares — `Bracket`'s family example moves its view with buttons and never takes the
controller. So the warning fires only when a gesture is on and the consumer holds **neither**:
`PanZoomUtils.warnIfNoControls` for `Timeline` (no `view`, no `onMount`) and `CardStackUtils.warnIfNoSendRoute` for
`CardStack` (no `topIndex`, no `onMount`), called once at setup. `Bracket` and `PatchBoard` never warn, since their
window and gestures exist only once a view is shared. A consumer who holds either and builds no buttons is not
caught; that is an accepted limit in `backlog.md`.

**Svelte's `CardStack` binds `topIndex` with no fallback** and applies `0` where it reads it, the shape `Timeline`
already has for `view`: with `$bindable(0)` an unbound prop and a bound one cannot be told apart.

### A view set from outside is held in by the rule for that view, not for the one it replaces

`getCanCenterEdges` (`computeCanCenterEdges` in React) says whether a requested view may hang past the content's
edges — `Bracket` allows it while the view frames a family, so a family at the edge of the draw can still be
centered. Each framework's `setView` used to ask it about the view currently held, while the clamp at render asked
about the view being set. Where the two disagreed, `setView` pushed a family view back inside the content and the
render kept it. Seen on the Bracket page's family example turned vertical: React, Vue and Svelte stopped 97 layout
pixels short of the family, and reached it only after a zoom out and in; Solid happened to start from a view that
already counted as framed. **`setView` now asks about the view it is setting**, in all four. The gestures still
compute their next view from the bounds of the current one.
