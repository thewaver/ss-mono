# Decisions: `SplitPane`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `SplitPane`, where CSS grid is the arithmetic

Resizable panes with a draggable gutter between each pair.

**The stated objection to building it was wrong**: `backlog.md` held that this would be the first control to
write a dimension, against a rule that the library leaves layout to the consumer. `Collapsible` already
writes a measured pixel height, the `Tabs` and `RadioGroup` floaters write a full box, `Viewport` scales its
contents, and the library already owns wrapper elements around consumer content (`Breadcrumbs`' `<li>`,
`Select`'s group box). The rule the objection appealed to does not exist in that form.

**The value is ratios, and pixels are never stored.** `ratios` is `Signal<number[]>`, one share per
pane. A container resize must not rewrite what the person chose: drag to 30/70 in a 1000px box, narrow the
window, and the stored `0.3` stands while the rendered widths clamp. Same shape as `ColorArea` keeping HSV
while emitting hex, and `DateValue` keeping the lossless form.

**The layout is one `grid-template` string and nothing else.** A pane is
`calc(ratio * (100% - totalGutterPx))`, and a pane with bounds is that share inside a `clamp()`; gutters are
fixed tracks between them. A window resize needs no observer and no code — the browser recomputes. That is
why this shape beat an `fr`-based one: `fr` cannot appear inside `clamp()` or `min()`, so a per-pane maximum
is not expressible alongside it, while percentages and pixels compose freely. N panes come free.

**When the minimums cannot all fit, it overflows — accepted by the user.** Two floors of 250px
and 400px in a 600px box do not shrink proportionally; grid honors both and the row spills. Chosen over
computing a proportional shrink, which needs a `ResizeObserver` and the library rewriting floors on every
resize. The user's reasoning: grid's behavior is consistent, expected and documented, a consumer declaring
floors that cannot fit is misusing the API, and inheriting the platform's answer beats inventing a second
one. `splitPane.spec.ts` pins it.

**A gutter moves its two neighbors and nothing else.** Their combined share is conserved, so ratios keep
summing to one without a normalization pass and dragging at one end never reflows the far side.

**The gutter is a `<button>` with `role="separator"`, and it carries a value.** `aria-valuenow` is the
boundary as a percentage over 0–100, `aria-orientation` states the axis, and the arrow keys for that axis
move it by `keyStep`. A drag-only splitter is unreachable without a pointer.

**The drag is local rather than `InteractionTrackerUtils.trackDrag`.** That helper measures the pointer against the
element it is attached to, right when the drag surface _is_ the measured surface (`Range`, `ColorArea`). Here
the drag surface is the gutter and the measured surface is the container. If a third consumer of that shape
appears, widening `trackDrag` to take a separate measuring ref is the change to argue then.

**A pixel bound has to be reconciled with a ratio value, and CSS alone cannot do it.** Fixed,
correcting the above. `minPx` / `maxPx` were only the `clamp()` around each track — correct for _rendering_,
useless for _dragging_: `moveBoundary` knew nothing about them, so a drag kept writing ratios the `clamp()`
refused. Past a pane's floor the pane stopped while the gutter carried on under the pointer, the far pane
went on growing, and the tracks summed to more than the container. The bound is now converted to a ratio
against the container's measured size and the drag clamped there.

Two non-obvious details. **The measurement is `offsetWidth` / `offsetHeight`, not `getBoundingClientRect`** —
`Viewport` scales its contents, so a client rect is layout size times a factor that is almost never 1, while
`minPx` is a layout-space number. `computePointerBoundary` keeps the client rect, with the gutters — a
layout-space number too — scaled into client pixels by the factor read off the root (`getLayoutExtent`, its
`offsetWidth` or `offsetHeight`, against the rect). Without that, both sides of the division carried the factor only
while there were no gutters, and a scaled split's divider drifted from the pointer by a share of each gutter (R50). **And the CSS `clamp()` stays**: the drag clamp holds while the
pointer moves, the `clamp()` holds when the _container_ resizes. When floors cannot all fit, the drag clamp's
window is empty and it pins to the floor, which is what `clamp(min, …, max)` does when `min > max` — so the
accepted overflow survives.

**Not built:** a double-click to reset and persisting the split. Both are the consumer's, since they own the
signal. Collapsing a pane to nothing and restoring it was on this list and is built now, as Enter on the gutter
— APG's window splitter specifies it, argued under _"`SplitPane`, and the three things a splitter was
missing"_.

**A before-and-after picture comparison is this control and no other, and the page proves it.** Put up as a
component of its own and answered by the user with the page example instead: two panes, a picture in each,
and the gutter is the wipe. What makes it work rather than merely look similar is that **each picture is
drawn at the width of the frame rather than the width of its pane** — `100cqw` against the frame as a
container, anchored to the left edge in the first pane and the right edge in the second — so the two halves
line up across the gutter and dragging reveals one picture under the other rather than squeezing two. The
frame carries the pictures' own aspect ratio instead of a fixed height, so nothing is cropped; both knights
are square, and a pair that were not would want the frame's ratio changed with them.

### `SplitPane`, and the three things a splitter was missing

Settled by the user, from a review item that was two-thirds right.

**2.5.7 Dragging Movements is Level AA and the gutter had no pointer route but dragging.** Both escapes were
checked against the Understanding document rather than recalled: a keyboard route does not satisfy it unless
that route "also provides controls that can be clicked or tapped with a pointer", and the "essential" exception
needs the functionality to be unachievable another way, which `Sortable`'s own tap route disproves. So a press
that ends without a drag steps the boundary by `keyStep` toward the half of the gutter it landed on. The gutter
is its own element with nothing else competing for a press, so there is no ambiguity to resolve.

**`role="separator"` on a `<button>` is conformant, and the review was wrong to flag it.** ARIA in HTML lists
`separator` among the roles explicitly allowed on `button`, beside `checkbox`, `slider`, `switch` and `tab`.
The gutter stays a button.

**Home, End and Enter were a feature choice rather than a gap.** APG marks Home and End optional and nothing in
WCAG asks for either — but the pattern also specifies **Enter** to collapse the primary pane and restore it,
which the review missed entirely and which is the useful one. All three are built.

**A collapsed boundary remembers where it came from, and forgets on any other move, whatever made it.** The
remembered position is stored beside the place the boundary collapsed to, and whenever the ratios change a
boundary no longer sitting there is forgotten — so a drag, an arrow key, a press on the gutter and the consumer
writing `ratios` from outside all count alike. `moveBoundary` also drops it, and `toggleCollapsed`
re-records it afterwards. A restore can therefore never put the divider back somewhere the boundary has since
been moved away from, and the consumer's own write is the case that matters most, since the component never
sees it happen and a check tied to its own handlers would miss it.
