# Decisions: `Shape`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `hectogon` is the near-circle, named for what it is

The built-in shapes are lists of corners, and a circle has none, which is why the set never had one. The
user's proposal: add a many-sided polygon and let it stand in for one.

**It is named for the polygon rather than the circle**, at the user's word, to avoid claiming to be something
it is not, and so that no shape name collides with a page's own idea of a circle.

**A hundred sides, so it does pass for a circle — the user's call, after trying it the other way.** A twelve-sided
polygon came first, kept coarse on purpose so its flats would always show and nobody would mistake it for a
circle. Seeing the hundred-sided one was what settled it: the near-circle was what was wanted, and the twelve-sided
one was dropped. The hectogon sits at most 0.05% of its radius inside the circle, which keeps a flat within half a
pixel of the true curve up to a radius of about a thousand pixels.

**An exact circle was already reachable and is still not a name.** `setupPaths` takes a join radius per
corner, and at the `round` exponent the corner is a plain circular arc; give a square radii of half its side
and all four arcs share the square's own center, closing into a true circle with no straight edge left. The
clamping tops out at exactly that value. What that cannot do is come from a shape _name_, because
`getDefaultShapePoints` answers with points and nothing else — a picker threading a name has no second
descriptor to carry the radii in. Closing that gap would touch every caller that builds points from a name;
the polygon touches none, which is why it won.

**The Reveal, Lens and ScratchCard pages have no `circle` entry of their own**, and start on `hectogon`. That
entry meant "pass no points and let the component draw a true circle", so those components' no-points path is
still in the library and simply has no picker entry showing it. The knob that grayed out the corner fields while
`circle` was picked went with it, since every remaining entry has corners to round. The pickers are
`ShapeConst.DEFAULT_SHAPES` unchanged, so a shape added there reaches them without anyone editing a page.

**`TileBoard` lays it at a pitch of `√3/2` with offset rows**, the hexagonal close packing, sharing the
pointy-top hexagon's neighborhood — six touching neighbors either way. It does not tile without gaps; the board
needs a layout for every name it accepts, so this was not optional.

**The Shape page caps its per-corner grid at six columns.** It lays one column per two corners, which is three
for a hexagon and would be fifty for the hectogon, overrunning the row and painting over its own label.

### Every built-in shape with more than three corners has a `_star` version

Asked for by the user: `square_star`, `lozenge_star`, `hexagon_pointy_top_star`, `hexagon_flat_top_star` and
`hectogon_star`. **`DEFAULT_SHAPES` is sorted alphabetically, the existing thirteen included** — the user's call, under the sample
rule: alphabetical, with exceptions at the top. It has no exception of its own; `ShapeReveals.const.ts` puts `circle`
ahead of it. **The triangles have none**, since three corners make no star worth the name; the corner-cut ones
are not regular in any case. **`hectogon_star` is included because the rule was "anything with more than three
points"**, which makes it a two-hundred-corner serrated disk; it is the first to go if the user finds it silly.

**The polygon's own corners are the tips, and a notch sits between each pair** on the line from the box's center
through the middle of the edge joining them. That is why a `square_star` points at the corners of its box and a
`lozenge_star` at the middle of its sides: they inherit their polygons' orientations, so the two are different
stars rather than one drawn twice. Built from the tip positions, not from angles, so a star in an oblong box is its
polygon's stretch and not a separate guess.

**The notch depth is one number for all five, `STAR_INNER_RATIO` in `shape.ts`, and it was a guess** — the user's
call to tune once seen. It is a share of the polygon's radius, so a hexagram would be about 0.58 and the default is
a little spikier. A per-shape depth is the next step if one number does not suit all five.

**`TileBoard` leaves them out**, by excluding any name ending in `_star` from `TileBoardTilingKind`: a star has no
lattice it tiles on, and the board needs a layout for every name it accepts. `Reveal`, `Lens` and `ScratchCard`
pickers are `DEFAULT_SHAPES` unchanged, so they gained the stars without an edit. `Reveal` grows a star until the
nearest part of its edge, which is a notch, reaches the viewport's far corner — so a star reveal ends much larger
than a polygon's, and every tip is far offscreen by then.

### `Shape`: the contour is also the float area

**`Shape` takes no class and no style for its outer box.** The user's call, when the add-ons round put it to them:
the text-wrap example floats a shape by reaching its outer box with a child selector from its own wrapper, and that
stays. A style prop was turned down as a source of trouble out of proportion to one example, and a class is already
ruled out library-wide.

**Shape writes `shape-outside: polygon(…) border-box` on its root, from the same outer contour the fill is drawn along.** A consumer who floats the Shape gets text wrapping to the painted edge and has nothing else to compute. The property does nothing on an element that is not floated, so every other Shape user, `GlassSurface` included, is unaffected. `border-box` is chosen over the default `margin-box` because the points are measured in the root's own box: a margin on the root would otherwise shift the contour off the paint. `shape-margin` is left to the consumer, since how far text keeps clear is paint. Fewer than three points writes nothing. MDN checked: it applies to floats only, accepts a shape followed by a box keyword, and has been Baseline widely available since January 2020.

### `Shape`: a morph is the consumer's signal read inside `computePoints`

**No morph prop exists; the Playground example is the whole feature.** `computePoints` already runs inside the memo that builds the contour, so a signal it reads re-runs the contour, and `joinRadii` and `lameExponents` are accessors blended the same way. The two point sets must be the same length, since blending pairs one point with one point. `Point2dUtils.lerp` is the per-pair step, in ss-utils beside `MathUtils.lerp`. Under reduced motion the example jumps straight to the other shape. It also rounds its value to 1/64 steps, because `ShapeUtils.getPaths` keeps every result forever: a smooth value would add one entry per frame on every press, while a stepped one reuses the same 65 contours.
