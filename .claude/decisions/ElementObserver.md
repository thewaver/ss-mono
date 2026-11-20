# Decisions: `ElementObserver`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ElementObserver` is the one place that watches an element's size

The user's call, made while weighing a size helper for `ss-utils`: anything in the library doing its own resize
watching uses `ElementObserverUtils` instead. `Anchor`, `Floater`, `TextField`, `Shape`, ProximityText's resting copy
and Solid's CellAnimation and ParticleField moved onto `observeBorderBoxSize` / `observeBorderBoxSizes`, which report
once on the spot and then only on a change. The four text layouts (FittedText, PaintedText, ProximityText, Typewriter)
needed more than size — a change to their text, an image or web font finishing loading — so `observeContent` wires
those three reactions, each only when given; FittedText now also re-measures when an image inside it loads.

**Left on their own watching, deliberately.** `ViewportWrapper` measures the inner size without a scrollbar, which a
border-box watcher cannot see change. `Virtualizer` must use the observer TanStack hands it. `EdgeFader` and `Scroller`
watch their children too, adding each child as it arrives, which `ElementObserver` does not do.

### `ElementObserver`: the current-index helper

`createViewportCurrentIndexObserver(getRefs, getIsDisabled?, { getOffsetRatio? })` answers the index of the last
element whose top has passed a line at `offsetRatio` of the viewport's height, or `undefined` while none has. It is
what a table of contents that follows the scroll needs, and it is an abstract rather than a component, on the
user's call: the `nav` of links and the `aria-current` mark are the consumer's markup. The rule itself is the pure
`computeCurrentIndex(tops, line)`, so it is tested without a DOM. `offsetRatio` is a tuned value, so its default
lives in `CURRENT_INDEX_OBSERVER_DEFAULTS` (0.2) and is the user's.

It re-reads on capture-phase `scroll` anywhere in the document and on `resize`, with no frame loop, because
nothing about the answer changes without one of those. It measures through
`ViewportUtils.getAdjustedBoundingClientRect` against the viewport context's height, which is the space its name
claims. A last section shorter than the stretch below the line can never become current; that is the consumer's
layout, and the doc block says so. The abstract-only call was later reversed by the user: `TableOfContents` is
now the component built over this helper (_"Controls: `TableOfContents`, where the article is the consumer's"_),
and the example that used to sit on the Scroller page lives on its page.

### `ElementObserver` reports a size, and the height observer is a view of it

`createBorderBoxSizeObserver` was added for `Satellite`, which needs both axes of both of its elements.
`createBorderBoxHeightObserver` stays exported — it is published API and `Collapsible` uses it — and is now
two lines over the new one, with a `createMemo` so a width-only change does not wake a height consumer. Border
box rather than a client rect, deliberately: a rect measured inside a `Viewport` is the layout value times the
scale factor, and layout numbers are what a positioner has to write back out.

`createBorderBoxSizeListObserver` joined them for a set of elements rather than one; the entry below it is
why, and it is the same coordinate space for the same reason.

### Measuring the element in front: a list observer, and the whole list handed to the painter

Settled on the user's instruction. `Toasts` was the one consumer asking, and the standing rule is that an
`Abstract` waits for the second; the user's call was to extract it anyway, so the rule is not repealed —
this is an exception taken deliberately rather than a precedent.

**The gap.** A painter drawing an overlapping pile wants each card offset by the real height of the one in
front of it. `index` and `count` are enough for a fixed peek distance, and everything else a painter can
measure is itself — a card cannot reach its neighbor's height, and the flow layout has already positioned
it using exactly those heights.

**`ElementObserverUtils.createBorderBoxSizeListObserver(refs, enabled)` is the observer for a set rather than one
element.** It takes an accessor of the element list, publishes a `Size2d` per position in the same order, and
re-observes when the list changes. Border box, layout pixels, so the name carries the coordinate space like
its siblings and `Viewport`'s scale never enters. **The caller owns the keying**: `Toasts` holds a ref per
entry id and hands the observer that list in queue order, because ids are what survives an entry being
removed from the middle; `Accordion` keys its header refs by position. An abstract that picked one would have
served one of them.

**Any change re-reads every element rather than threading the observer's entries through.** A pile's
arithmetic needs the whole list anyway, so a partial update would be assembled back into a whole one at the
only call site. The published signal compares element-wise, so a resize that changes nothing notifies nobody.

**`ToastState` gains `sizes`, and it is the whole array rather than a computed offset.** The stacking rule is
the painter's — that is what _"`Toasts`: what the painter gets, and why position is not fully delegated"_
settled when it kept flow stacking as geometry and an overlapping pile as paint — so the component's job is to hand over the measurements a painter cannot take,
not to decide what they mean. sonner holds the same numbers at the same level, one above the card.
`ToastsItem` reports its own root element up, and the Playground's `stacking` prop is what shows it working:
`flow` is the flex layout untouched, `pile` cancels each card's flow offset from the summed extents in front
of it and replaces it with a peek and a scale, which lands every card of differing height on the front one.

### `ElementObserver`: progress through the viewport

**`createViewportProgressObserver` gives 0 while an element's top is at or below the viewport's bottom edge, 1 once its bottom has passed the top, and a straight line between.** That is the whole passage across the screen, the same range a CSS view timeline calls "cover". It re-reads on any scroll and on resize, like the current-index observer, and measures in the viewport's coordinates. It is meant as the getter half of a `progress` with playback off, and how CellAnimation's scrub can use it.

**`createScrollContainerProgressObserver` is the same passage measured against a scrolling box.** The user's call,
after Trail's scroll example did almost nothing: the page it sat on scrolled 211 pixels at most, so the marker crossed
a fifth of its curve and stopped, and on a taller screen the page did not scroll at all. A demo whose range depends on
how long the rest of the page is cannot be relied on, and a consumer driving something from a panel's scroll had no
helper either. Both observers are one private core handed a different span — the viewport's height, or the box's
client area measured through the viewport's scale — so the arithmetic is written once and
`computeViewportProgress` is published from it. They are siblings named for their space, per _"When a function
grows a sibling"_. Trail's example now holds its own box: the trail pinned at the top with `position: sticky`, and
beneath it an invisible runway with a box's height of room before and after, which is what lets the runway start
below the box and leave above it, so a full scroll is exactly `0` to `1`.
