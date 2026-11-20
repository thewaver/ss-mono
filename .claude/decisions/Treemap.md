# Decisions: `Treemap`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Treemap`: one level at a time, following D3's zoomable treemap

Chosen by the user from a round of Exotics candidates, and shaped by one ruling: of three ways to show more
than one level — zoom one level at a time, nest every level inside its parent, or nest to a chosen depth and
zoom — they took the first, pointing at D3's zoomable treemap (`observablehq.com/@d3/zoomable-treemap`), and
said that every question the example answers is answered by following it. So the tiling, the sort, which tiles
respond, the length and shape of the zoom and the bar across the top are all the example's, and the entries
below are the places where the library had to decide something the example does not.

**The tiling is D3's `treemapBinary`, and every level is tiled across the whole box.** A run of children sorted
heaviest first is cut in two where the weight on each side comes closest to half, across the longer side, and
each half again. The example's own trick is kept: a level is tiled as though it filled the treemap, then
scaled into its parent's tile. That is what makes the zoom honest — the picture inside a tile before the zoom
is exactly the picture that fills the box after it — and it means the component only ever tiles the level on
show, working out where a deeper level sits (`computeDescendantRect`) by projecting down the path one tile at a
time. A leaf's area is its `weight`; a branch's is the total of its children, and a weight set on a branch is
ignored, which is `d3.hierarchy().sum()` in the example's data where only leaves carry values. A child weighing
nothing gets no tile, because a zero-area button would be a tab stop nobody can see.

**The bar is the page's, not the component's.** The example draws a strip across the top showing the path and
zooming out when pressed. `conventions.md`'s _"A component hands out a controller and renders no controls of
its own"_ decides this over the example: the strip is a control, so the component publishes the branch in view
as `branch` and `TreemapUtils.findPath` for the path, and the Playground draws the strip as a `Button`
above the treemap — same place, same content, same behavior. Escape inside the treemap also goes up a level,
because a keyboard user inside should not have to leave to come back out.

**The branch is held as the node, not as a path of indices.** `conventions.md`'s rule about transient state
applies: a path of positions silently addresses a different branch once the tree changes, while a node that has
left the tree resolves to nothing — and the component then shows the root. A held node that has nothing to zoom
into shows the root for the same reason.

**Only branches are buttons, which is the example's "only branches respond".** A leaf is a list item with the
painter's content in it and nothing to press, so a screen reader reads it in the list and the arrow walk skips
it. The branches are one tab stop with a roving index; the order is the tiling's heaviest-first order rather
than anything spatial, since the tiles do not form rows. Checked against WCAG: 2.1.1 Keyboard ("All
functionality of the content is operable through a keyboard interface…") is met by Enter or Space on a branch
and Escape, with the page's bar as a second way up; 2.4.3 Focus Order ("…focusable components receive focus in
an order that preserves meaning and operability") is why focus is moved rather than lost when the focused tile
is removed by a zoom — into the new level's first branch going in, back onto the branch it came out of going
out, and onto the level's list when a level has no branches at all. Focus is only moved when it was inside the
treemap before the zoom, so pressing the page's bar leaves focus on the bar.

**The zoom is the example's, run through the Web Animations API**, on an ease-in-out cubic, which is
D3's default transition easing. Going in, the level being left is enlarged around the chosen tile until that
tile fills the box, while the new level grows out of the tile and fades in on top; going out is the reverse,
with the level being left shrinking into its tile and fading out on top. Tiles animate their `left`, `top`,
`width` and `height` rather than a scale, because the example resizes the rectangles and leaves the text
unscaled, and a transform would have stretched every label mid-zoom. `element.animate` is used rather than CSS
transitions because it starts from a stated first frame on an element that has only just been inserted, which
a transition cannot do without the new element first being painted in its start position — the frame hazard
`conventions.md` records under _"Playback is a two-way value; a rewind is a command"_. The leaving level runs with
`fill: "forwards"` so it cannot flash back to its resting layout in the frame between finishing and being
removed. The root clips only while a zoom runs, so at rest a focus ring on an edge tile is not cut off.

**Reduced motion is the page's to answer, as with `ScrambleText`.** `zoomDurationMs={0}` jumps straight to the
new level with nothing animated; the Playground reads the preference and passes it, and disables its duration
field while it does. WCAG 2.3.3 Animation from Interactions ("Motion animation triggered by interaction can be
disabled…") is AAA, and this is the route that satisfies it.

**The Playground's data is this library.** The example uses the source of a software package sized by code;
the page uses `components/src` itself, layer by folder, sized by lines of source excluding tests, generated
once and written out as a table. The numbers are a snapshot and will drift as the library grows, which does not
matter for a demo.
