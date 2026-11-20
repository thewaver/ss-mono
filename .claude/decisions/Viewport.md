# Decisions: `Viewport`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The viewport split in two, and only the wrapper is a component

**The context and the arithmetic are `Abstracts/Viewport`; the element that establishes one is
`Exotics/ViewportWrapper`.** The split was forced by the dependency graph: five units below `Essentials`
were reaching up into an `Exotic` for the context — `Anchor`, `ElementObserver` and `PointerTracker` in
`Abstracts`, `Popover` and `Spotlight` in `Primitives` — and `ElementObserver` and `PointerTracker` were
reaching for `ViewportUtils` as well. The context imports nothing but solid-js, its own type and `Size2d`, and
the component imports the context rather than the other way about, so the whole lower half lifted cleanly and
every one of those edges now runs downward.

**The abstract keeps the plain name because it is the viewport.** `useViewportContext` answers with no
wrapper anywhere on the page, falling back to the window's size with no portal root and a scale of one —
which is why anchoring and measuring behave the same whether or not anything has scaled the page. The
component does not define a viewport so much as establish one, so it is the half that takes a suffix.

**Names weighed and rejected, because this took several passes.** `Screen` and `ScreenBox` died on nesting:
viewports stack, `getScale` is the parent's times its own and `composeScaledRect` exists only to carry a rect
up through a stack of them, and screens do not do that. `View` and `ViewBox` read best of all and `viewBox` is
even the right SVG term for scaling contents into a coordinate box — but the library writes `viewBox` as an
attribute fifteen times, in `Shape`, `Bracket`, `CornerHighlight` and `PatchBoard` among others, so a file could carry
both spellings a few lines apart. `ViewportBox` says the container twice, since a `-port` is already an
aperture. **`Wrapper` won on being ordinary**: it is standard component vocabulary, and `InteractionWrapper`
is already the library's suffix for a component whose whole job is to go round something and give it a
property.

**The wrapper is a component, and an `Exotic`.** It renders, it has a page, and what it needs inside it is content
rather than a host, which is the page test. It first sat in Essentials and moved to Exotics on the user's call:
Essentials are what an interface needs and Exotics what one might want, and scaling a whole app to one design size is
the second — every Essential reading the viewport works without a wrapper, through the abstract's fallback. The page moved with it and its route is
`/viewport-wrapper`; the abstract took a menu entry of its own under `Abstracts`, with no page, since
everything it does is already visible through the wrapper.

**The stylesheet's class names still say `viewport`.** `viewportRootHost`, `viewportNestedHost`,
`viewportRoot`, `viewportContent` and `viewportPortal` name the parts of the viewport being built rather than
the component building it, and renaming them would have bought nothing a reader can use.

### A `Viewport` is a region, and it is terminal for everything inside it

Settled, from `ViewportPage`. A viewport fits the size it is designed for into **the space it
is given**: the root's space is the window, a nested one's is the box the page puts it in. The app's own
viewport is not a special kind — it is the one whose region happens to be everything.

**The host is what clips.** Each viewport renders a host box (`overflow: hidden`, filling its container) with
the scaled design box inside. Since every layer opened inside a viewport is portalled into _that_ viewport's
own portal, one `overflow: hidden` is the whole of "nothing inside a viewport paints outside it": a dropdown
from a control in a nested viewport is clipped by that viewport, not by the window. A nested one measures its
host with a `ResizeObserver`, so the consumer sizes it with ordinary CSS and nothing is passed in.

**Scale multiplies through and the rect is carried into window pixels.** A child was handed the innermost
scale while the screen showed every enclosing scale multiplied, so `getAdjustedBoundingClientRect` — and
through it every anchored layer — was wrong by the outer factor. `getScale` is now the parent's times its own,
and `getScaledRect` composes the host's client rect with the local fit through
`ViewportUtils.composeScaledRect`, which is unit-tested as plain arithmetic on plain rects. That one is read
rather than memoised: the host moves whenever anything above it scrolls, and it is what every anchored layer
measures against, once per frame.

**The transform stays local.** CSS already composes an ancestor's transform, so each root writes its own
`translate` and `scale` in its host's coordinates and nothing accumulates twice.

**That the two factors multiply is now driven rather than only unit-tested**, and the trick is to shrink the
window. The Playground's own viewport is drawn at `1` whenever the window's height matches the size it
anchors to, which is every machine it has ever run on — its fit works out to the window's height over that
anchor whichever way the aspect ratio falls, because the design size is derived from the ratio too. So
`viewport.spec.ts` sets the inner square to half, halves the window, and reads a quarter back off both the
viewport's own report and a control measured two levels in: its painted height over its layout height.
Without the resize the outer factor is `1` and any product looks like the inner factor alone.

**A stack of toasts raised inside a nested viewport stays inside it**, examined rather than assumed. It
portals into that viewport's own portal like every other layer, is clipped by the same `overflow: hidden`,
and is the thing painted at its own position — so its fixed `z-index`, chosen against `Modal`'s and never put
through the anchor-relative rule the popups use, costs nothing here: the region is a child of the portal, and
what a portal paints over is decided by the portal's own place in the tree rather than by a number inside it.
`ViewportPage` raises one so the case stays driven.

**An earlier attempt had a nested viewport fill its parent instead**, mounted into the parent's content box by
a portal. It was wrong for the case that matters: a viewport you cannot place cannot be the boundary of
anything smaller than the window, and the boundary is the point.

### A nested `Viewport` with no room warns once

**A nested viewport whose host measures no width or no height says so in the console, once per viewport.** The
user's call. Such a viewport scales its design size to fit nothing and draws nothing, and before this the blank had
no explanation short of reading the source. The usual cause is a host sized only by its content, which here is the
viewport itself. The check is `ViewportWrapperUtils.warnIfUnsized`, run from `observeAvailableSize`'s
`ResizeObserver` until it has warned, so it is in the shared helper and every framework has it without a port.
**A host collapsed on purpose, such as a closed panel, warns too**; the user accepted that as the cost, the false
warning being rare and harmless next to a silent blank.

### The viewport is terminal, and an anchored layer tracks its anchor rather than polling for it

Settled, from three defects seen on `ViewportPage`.

**When perfect placement is impossible, the layer is clipped — never shrunk and never moved over the
anchor.** Three things could give: the layer's size, its distance from the anchor, or the part of it you can
see. The library gives up the last. `AnchorUtils.getBand` gives an `out` placement only the space between the
anchor and the edge it faces, and `clampToBand` pins the edge touching the anchor, letting the far edge run
past the viewport where `overflow: hidden` cuts it. An `in` or centered placement is deliberately over the
anchor and gets the whole viewport.

Pinning the other end — `Math.max(band.start, ...)` in both directions, the obvious clamp — is what makes a
list with nowhere to go slide down over the field it belongs to. Capping the layer's height to the band, tried
first, is the same mistake in the other axis: a list that quietly becomes a third of itself has answered a
question nobody asked. A layer keeps the size its painter chose.

**Scrolling is listened for as well as polled.** `createViewportRectObserver` measured once per animation
frame, leaving a portalled layer a frame behind an anchor being scrolled. It now also repositions from a
`scroll` listener in the capture phase — the event does not bubble, so capture is what hears a scrollable
ancestor — and from `resize`. The frame poll stays, because an anchor can also move under a CSS animation,
which no event reports.

**A portalled layer is placed by `transform`, not by `top` / `left`.** Writing offsets forced layout on every
frame of a scroll; a translate is composited. Both roots pin to `top: 0; left: 0` — an absolutely positioned
box with `auto` offsets would otherwise fall at its static position, which for the second layer in a portal is
not the first layer's.

**A nested viewport is opaque.** `viewportNestedRoot` carries a `z-index` above the parent's own portal layer,
so nothing behind a nested viewport paints through it or can be pointed at. Together with the root's
`overflow: hidden` and each viewport portalling into itself, that is the whole of "a viewport is a black box".
`viewport.spec.ts` drives all three.

### A popup with no `Viewport` is fixed to the window, and its highlighted row scrolls only the popup

Settled from a page with no `ViewportWrapper`, which is supported — _"a consumer with no `Viewport` still needs
dismissal"_ — and where every popup portals into `document.body`.

**`Popover`'s and `Tooltip`'s roots are `position: fixed`, inside a viewport or out of it.** The position they are
given is in window pixels, and an absolute root on `document.body` is placed against the top of the document, so a
popup opened on a scrolled page was drawn off by exactly the scroll. A fixed root is placed against the window, which
is the space the numbers are in. Inside a `Viewport` nothing moves: `viewportRoot` always carries a `transform`, and a
transformed element is the containing block of its fixed descendants, so the root is still placed against the same box
as the portal it sits in, and the host's `overflow: hidden` still clips it. One rule for both cases, and no branch on
whether a portal exists. A fixed root also stops a popup near the foot of a short page from lengthening the document.
**`Spotlight`'s four layers and the carried items of `Sortable` and `SortableGrid` are fixed for the same reason**:
each is portaled and placed from window pixels — the lit element's rect, the pointer — so on a scrolled page with no
`Viewport` the cover, the highlight, the guide's popup and the carried item were all drawn off by the scroll. Inside a
`Viewport` they measure the same to the pixel as before.

**A highlighted row is revealed by `DOMUtils.revealWithin`**, which lived in `PopoverUtils` until the fourth extraction round. A menu highlights its first or last item the moment
it opens, while the popup is still hidden at the portal's top-left corner waiting for its position, and
`scrollIntoView` there jumped the page to the top. `revealWithin(element, root)` needs no placement, so it runs as
early as the highlight does, and it leaves the viewport's own `overflow: hidden` host alone. `MenuUtils.revealItem` finds the item's `role="menu"` popup and calls it;
`Clock` calls it with its own root, since it is drawn both inline and inside `TimePicker`'s popup, and an inline clock
below the fold scrolled the page to itself on mount in the same way. **A `Listbox` option goes through
`ListboxUtils.revealOption`, which splits on where focus sits.** Under `"active_descendant"` — the lists `Select` and
`TextInput` open — focus stays in the field and the list is its popup, so only the scrollers up to the popup's
`role="listbox"` root move. Under `"roving"` — an inline `Listbox` — the option is itself the focused element, drawn
among the consumer's own scrollers, which sit outside the list's root, and it is only highlighted once the reader has
put focus in the list; it keeps `scrollIntoView`, which is what the browser would have done had focus not been moved
with `preventScroll`. Holding the scroll until the popup is placed, as focus waits, was
the alternative; it needed the placement handed down to every item, and still let a placed popup that runs past an
edge scroll whatever clipped it.

**`revealWithin` keeps a scroller's `scroll-padding` clear, as `scrollIntoView` does.** It first revealed only the
row's own box, so in the Playground's padded popup the last row scrolled the menu to just short of its end and the
first row brought it back to just short of its top, the padding still hidden. The user reported the second half.
Honoring `scroll-padding` is what the browser's own reveal does, so the helper's "as `block: "nearest"` does" is
now true; it is read rather than inferred from `padding`, because padding is not always room the reader should see.
The Playground's popover surface sets `scroll-padding` to its padding.
