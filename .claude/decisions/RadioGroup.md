# Decisions: `RadioGroup`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `RadioGroup` and `Tabs` take a layout too, and the floater stops being measured

The rest of the proving pass. Three controls now take a `computeLayout` and are unchanged without one, and
each of the three arrived at it from a different direction, which is what the pass was for.

**A group takes children, not records, so the placement travels down the context.** `RadioGroup` is the
awkward one: `Menu`, `Paginator` and `Tabs` all hold their items as data and can wrap each one, and a group
holds an opaque `props.children` and learns what is inside it only when each `Radio` registers itself. The
alternatives were an `items` / `renderItem` group beside the existing one — a second component to keep in
step, and `Tabs` is the record-shaped group already — or the group placing children it cannot see. So
`RadioGroupContextType` gained `computePlacement`, keyed on the entry the radio registered rather than on its
value, and `Radio` wraps itself. The ordering was already solved: the group sorts its entries by
`compareDocumentPosition`, which is what the floater has always relied on, so the index a placement is looked
up by is the document order rather than the registration order.

**A placed floater is derived rather than observed, and the bug that forced it is worth recording.** Both
floaters found their box by reading `offsetTop` and `offsetLeft` off the selected item's `offsetParent` under
a `ResizeObserver`. A placed item is absolutely positioned, so it _becomes_ that `offsetParent`, and every
offset came back zero — the marker would have sat in the corner of the list. The replacement is better than
what it replaces rather than a patch on it: the layout already knows where the selected item is, in shares of
its own width, so a placed floater multiplies that by the layout's width and observes nothing at all. The
`ResizeObserver` is now skipped outright when a layout is in play. **The turn travels with the box**, so a
floater behind an item the layout tilted is tilted with it.

**`stackAt` is optional now.** Absolutely positioned siblings already paint in document order, so a control
with no notion of depth states none and `PlacementItem` writes no `z-index` at all; a rect's own `depth`
still overrides. `Menu` and `Paginator` keep passing an index, which is what they did before.

**A placement reaches `Tabs`' painter as a third argument, and `Paginator`'s inside the object.** The
difference is not a taste one: `Tabs.renderTab` is handed a bare `InteractionFlags`, all booleans, and a rect
inside it would make the name a lie — the rule `Menu.renderItem` already follows. A paginator's painters
receive `*RenderProps` carrying a page number, so theirs goes in beside it.

**A placed tab list still declares an axis, deliberately.** `dir` stops laying anything out under a layout —
so does `tabGap`, and so does a group's `gap` — but it still decides `aria-orientation` and which pair of
arrows walks the list, and the consumer is the one who knows whether their arrangement reads as a row or a
column. A group's walk was already `orientation: "both"` and stays that way. Neither was changed to match the
other, because the two controls disagreed before any of this and for reasons of their own.

**The honeycomb is the first layout with no angle in it, which is the point of building it.** Everything
shipped until now is a radius and a bearing, so nothing had ever tested whether a placement's vocabulary is
general or quietly polar. It is general: a honeycomb is rows of hexagons, staggered by half a column and
stepping down by three quarters of a cell so the rows interlock, and it needs nothing the ring did not already
have — plus one field, below. It picks by `"nearest"`, there being no center to take a bearing from.

**A placement carries the shape it occupies, because otherwise the target and the drawing disagree.** A
hexagon drawn inside a rectangular box leaves the corners of that box live, and two interlocking rows overlap
in exactly those corners — so a press in a notch would activate whichever cell came later in the document
rather than the one under the pointer. The painter cannot fix it, because the element that takes the press is
the library's `<button>`. So `PlacementRect` gained `clipPath` and `PlacementItem` applies it: CSS Masking 1
says "pointer-events must not be dispatched on the clipped-out (non-visible) regions of a shape", so the hit
area follows the drawing. This is `TileBoard`'s conclusion — _"the shape is worn by a hit layer, so the
pointer follows the drawing"_ — reached again from the other end, and it is the same line `getSectorPath`
already drew: the contour of the space an item occupies is geometry, and fill, stroke and transition remain
paint. Only the honeycomb asks for one; a wedge's painter draws outside its box on purpose and must not be
clipped.

**WCAG, checked.** 2.5.8 Target Size (Minimum) (AA) is measured on "the smallest enclosing rectangle aligned
to the horizontal axis": an arc star's box is 44 by 40 and a honeycomb cell's is 84 by 97, so both clear 24 by
24 with room. The clip narrows what answers a press but not the rectangle the criterion measures, and the
hexagons no longer overlap each other's targets, so the Spacing exception is not needed either way. 2.4.3
Focus Order (A) holds for the same reason it does round the dial — the walk is the document order and the
arrangement is drawn from it — and both suites assert the walk rather than any position.

### A group's radios are ordered by the document, and only once every one of them has reported

`RadioGroup` sorts its registered entries by `compareDocumentPosition`, which is how the roving walk and the
floater find their order. The comparator answered "equal" for any pair whose element had not arrived yet,
which makes it inconsistent.

**It stayed invisible until a placement was looked up by that order.** A walk and a floater recover on the
next render; a placement does not, because the index is what decides which radio is drawn where. The user saw
a rating arc fill from the wrong end. The memo now returns the registration order until every entry has an
element and sorts only then.

**"Has an element" became "has an element in the document"**, after the WebKit run. Solid makes each radio's element
before putting it in the page, so the group sorted elements that were not yet in any document, and two detached
elements compare in an order each engine picks for itself: Chrome's happened to match the page, WebKit's was the
reverse, so the tab stop sat on the last radio and End went to the first. The sort now also waits for `isConnected`,
as `PaginatorUtils.orderEntries` already did, and each Solid radio asks the group to sort again once it has mounted
(`reorder` on the context, beside `register`, the Paginator's shape). React, Vue and Svelte register a radio only
after it is in the page, so they need no second sort and their contexts carry no `reorder`.

### `RadioGroup` takes a floater, and both floater observers are guarded

Settled, straight after the segmented control below. A sliding indicator behind the chosen
segment cannot be painted from inside one radio: it needs the selected item's **box**, and a painter only
knows its own.

**The objection this had to clear was purity, and it does not survive.** `RadioGroup` already takes `dir` and
`gap` — it already decides where its children sit, so handing that measurement back out exposes something it
owns rather than teaching it something new.

**The mechanism was `Tabs`', copied deliberately rather than generalized**: a root ref, a `ResizeObserver`
watching the root and the selected item's `offsetParent`, the box written as inline `top` / `left` / `width` /
`height`, and `ElementFader` for entry and exit. Two consumers was not yet an `Abstract`; `Menu` was the third,
and the copies are now the `Floater` abstract — see _"Floaters are an `Abstract`, and follow the highlight as
well as the selection"_ below.

**The observer is now guarded on the prop, in both controls.** It previously ran for every `Tabs` on the
page, measuring for a floater nobody asked to render, and copying it unguarded into `RadioGroup` would have
put a `ResizeObserver` inside every radio group in every form. The effect returns early when `renderFloater`
is absent. Not guarded: `Tabs` keeps its item refs regardless, because arrow keys focus through them — only
the measuring is optional, and confusing the two would break the keyboard.

**Both roots carry `isolation: isolate`, and without it the floater escapes the control.** The floater sits
at `z-index: -1` so the items paint over it. A negative index resolves against the nearest ancestor that
starts a **stacking context**, and `position: relative` alone does not start one — so the floater traveled up
the ancestor chain until it found one, and any background painted on the way covered it. Exactly what happened
when the Playground put a background on the box wrapping the segmented strip: measured correctly, positioned
correctly, painted underneath the wrapper. `isolation: isolate` starts a stacking context and nothing else;
`z-index: 0` would work too but says something about the control's own order among its siblings, which is the
consumer's business. `Tabs` had the same latent fault and now carries the same line.

Worth knowing for the next painter: this class of fault is invisible to `e2e/`. The floater spec asserts the
measured box, which was right the whole time.

**The preset route was considered and rejected.** A segmented preset over `RadioGroup` owning the floater
privately resurrects as a component the thing just decided to be paint, for one optional prop's worth of
surface — and a preset existing to hide a prop the base already needs is a worse trade than the prop.

### A segmented control is `RadioGroup` paint, and the Radio page proves it

Settled, closing a `backlog.md` entry. A row of joined buttons with exactly one pressed reads
like `Tabs` and is not: `Tabs` is navigation and swaps which region is shown, while a segmented control holds
a **value** that is part of a form's answer. Same appearance, different meaning, and the role reflects the
meaning.

So it needs no component. `RadioPage`'s **Segmented** variant is the demonstration: `RadioGroup` with
`getDir` row and `getGap` zero, painted by `RadioSegmentContent` instead of `RadioContent`. **A segment paints almost nothing** — no
dot, no border, no background, only padding and a text color that flips when checked.

**The strip's own look belongs to a wrapper, not to the segments.** `PageRadioSegmentGroup` is a plain
`<div>` around the whole `RadioGroup` carrying the border, background and outer radius, and the fill behind
the chosen segment is the floater. Segments drawing their own borders was tried first: it needed an `isFirst`
/ `isLast` pair so the ends could round and the inner dividers collapse, it made every segment opaque —
hiding the floater completely, since it sits behind at `z-index: -1` — and it put the strip's appearance in
three places. A container can round its own corners without knowing which child is first.

The library cannot be that wrapper: `RadioGroup` accepts no class name, so the page supplies its own box.
Library owns the roles and the geometry, page owns the paint.

**A rating input went the same way on the same day, and it is the more interesting of the two** because one
part genuinely is not `RadioGroup`. Five stars are five radios; the **preview** is not — hovering the third
star fills the first three. A painter cannot do that alone, because `isHovered` is its own and star two would
have to know star three's. The page holds it: a `hoveredRatingSignal` written from each `Radio`'s
`onMouseEnter` / `onMouseLeave`, each star filled when its number is at or below the hovered one, falling
back to the value. Nothing was added to the library — the preview was the argument for a `Rating` component
being more than paint, and it turned out to be **eight lines in the consumer**; a radio group's arrow keys
move the value itself, so the keyboard case needs no preview.
