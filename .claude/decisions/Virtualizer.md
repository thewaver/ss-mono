# Decisions: `Virtualizer`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A list too long to mount: `computeEstimatedOptionHeight` and `Abstracts/Virtualizer`

Settled, on the second attempt. **On-demand loading answers a list that has not all arrived;
this answers a list that has all arrived and is too long to build.** They compose, and neither knows about the
other.

**Passing an estimated height is what turns it on, and a list short enough not to need it should not pass
one.** The user's rule: under a couple of hundred options there is nothing to win, and the cost is real — a
windowed list is placed from measurements that arrive late, so it accepts imprecision to buy back time that was
never being spent. No boolean and no automatic threshold, because a threshold would be the library guessing at
a row height it has never seen.

**The estimate belongs to the consumer because the height is a consequence of `renderOption`.** It is per index
rather than one number, so rows in two known shapes can be answered separately. It is consulted only for rows
nobody can see — every row on screen is measured for real — so what it buys is an honest scrollbar before
anything has been scrolled. TanStack's advice is to estimate the **largest** plausible row so the guess errs
one way and the list only ever settles upward.

**TanStack's virtualizer is a runtime dependency, marked external rather than bundled** — `@tanstack/virtual-core`
now, in both framework packages, where it was `@tanstack/solid-virtual` when this was argued. The first attempt
took a package out again; this one keeps it, on the user's call that a dependency is acceptable
for exactly this kind of functionality — the call `colorthief` already carries. External rather than bundled
follows `colorthief` too: a package both inlined into `dist` and declared in `dependencies` makes a consumer
install a copy they never load. `@internationalized/date` is still bundled while being declared, the older half
of that inconsistency, and has not been argued.

**The windower lives inside `Select`, and that is the whole difference from the attempt that failed.** The
design had the **consumer** window the list and hand over only the visible slice, so `Select` walked
the slice: `Home`, `End` and the arrows were confined to whatever happened to be mounted. Holding the whole
array and mounting a window onto it leaves `getFlatOptions`, the navigable set and the whole keyboard model
untouched — only what is in the document changes.

**A grouped list is not windowed, and that is a boundary rather than a preference.** A group's box wraps the
options inside it, so a window opening halfway down one would have to draw a box for a group whose header is
above the window and whose end is below it, and repeat the header as the reader scrolls. Passing an estimate
for a list containing a group mounts everything, silently and correctly.

**Row heights are taken as fractions, which is one line of the package's default replaced.** TanStack's own
`measureElement` rounds the observed border box to a whole pixel. A row is rarely a whole number of pixels
tall — a two-line option here measures 97.5 — so every rounded row gives its slot half a pixel the row does
not fill, and consecutive rows sit with a hairline between them: invisible against an unpainted row, obvious
the moment a consumer gives their options a background. The override returns the unrounded `blockSize` when a
`ResizeObserver` entry is present and delegates to the package's own function otherwise, so every fallback
path — the cache lookup, the estimate, the synchronous first measure — behaves exactly as before. The
observed box is in layout pixels, so this is also the one measurement `Viewport`'s scale cannot distort.

**Five things the package's documentation does not cover, all from one root: this library is a guest inside
somebody else's popup.**

- **Solid runs a `ref` while the element is still being built.** The measurer identifies a row by reading an
  index attribute off the node it is handed, and at `ref` time the attribute is not on it and the node is not
  in the document — so measuring from the `ref` reads an unnamed, unlaid-out element and silently keeps the
  estimate. Rows then tile on the estimate rather than their real heights, and a row taller than its slot
  paints over the one below. The index is written onto the element and the measurement deferred to mount.
  React's adapter never meets this because React runs refs after commit; nothing warns about it. **Vue meets it
  inside a group.** Vue calls a function ref as soon as the element is inserted into its parent, and the rows of a
  group whose box is new are inserted into that box before the box is in the document, so they measured `0`: the list
  took every row in the window to be empty, then scrolled itself by each real height as it arrived. The Vue half
  measures a row straight away only when it is already in the document, and otherwise once the render is done.
- **The rows' container does not start where the scrolling starts.** Row offsets are measured from the top of
  the container the library owns, a scroll position from the top of whatever is scrolling, and between them
  sits however much border and padding the consumer put on their popup. Unset, every scroll target lands short
  by that inset, which reads as an arrow key stopping one option early. `scrollMargin` is the package's own
  answer; the offset has to be worked out in layout space rather than off raw client rects, because `Viewport`
  scales the page. **The offset is live geometry**: anything above the list growing or appearing moves it, so
  `VirtualizerUtils.observeScrollMargin`, which all four adapters call, measures it again whenever an element before
  the list, or one of the list's ancestors below the scroller, resizes, appears or goes —
  measured once, an accordion opening above a `Table` left the window drawing rows where the list no longer was.
- **A highlighted row must be mounted whether or not it is in view.** `aria-activedescendant` names an element
  by id, and scrolling to a row is not the same instant as mounting it, so the name refers to nothing until the
  window catches up. The row carrying the highlight is pinned into the range.
- **An option can no longer scroll itself into view**, because until the window reaches it there is nothing to
  scroll. The move belongs to whatever owns the window, and it hangs off the highlight as an effect rather than
  off the key handler, so a highlight arriving any other way is carried the same way.

**What it is worth, measured on the Playground's stress card at 10,000 options**: 792 ms from click to the
first painted frame with every option mounted, against 71 ms with a window of four. Frame rate while open was
never the problem and is unchanged. The remaining cost at open is linear but has no DOM in it — building the
records, flattening them, finding the navigable ones — and that is the floor a windower cannot lower.

- **A row brought in from below is aligned against the box the content shows in, not the scroller's outer box.**
  TanStack's `observeElementRect` reports the scroller's border box, so a scroll lining a row's end up with the bottom
  counts the scroller's borders, and a horizontal scrollbar if it has one, as room. In the Playground's popup, with a
  2px border, every row the walk brought in from below and the selection a list opened onto stopped with its last 4px
  clipped, and a row already clipped by up to 4px counted as in view and was not scrolled to at all.
  `VirtualizerUtils.observeClientRect` reports `clientWidth` and `clientHeight` instead — the box the content is
  clipped to, which is what a native `scrollIntoView` aligns against — and all four row windows hand it over as
  `observeElementRect`. It is typed by the two fields of the virtualizer it reads, so the core package still does not
  depend on TanStack. `End` was never affected, since it scrolls to the furthest offset rather than aligning a row.
  `select.spec.ts`'s reopening case found it, in React and Vue as much as in Solid and Svelte.
- **A list given an estimate but no scroller draws every row, and only once the search has said so.** `Table` and
  `Tree` chose the windowed render because an estimate was passed, so in plain document flow, with no ancestor that
  scrolls, the window had nothing to measure and a 30-row table drew its header and nothing else (an outside
  review's finding). `isLive` could not decide it: it is also `false` for the frames before the scroller has been
  looked for, so a long list would mount every row and then drop them. Each row window therefore also returns
  `hasNoScroller` (`getHasNoScroller` in Solid and Svelte), `true` only once the search has run for the current
  element and found nothing; every frame before that answers `false`, which is the windowed render the lists
  always had. `Table` swaps its body's rows. `Tree` keeps the sizer element mounted and only drops its class,
  height and windowed rows — the search measures from the sizer, and a branch that replaced it with another element
  would make the search start again, find a new element, and flip back. `Listbox` does the same: its sizer stays,
  and holds the ordinary full list of options when there is no scroller, with the end marker and the hover
  handlers left to that list so neither runs twice.
- **A key that moves focus to a row not yet mounted waits for the render, in every list.** `Tree` always did this
  (a pending id, focused after the next commit); `Table` looked the cell up straight after asking the window to
  scroll, which in React, Vue and Svelte is before the row exists, so `Ctrl+End` in a long table left focus on
  `<body>` and the next arrow did nothing. `Table` now keeps the same pending id. Solid needs neither, because the
  roving row is pinned into the window and Solid mounts it the moment the signal is set.
- **`Tree` tests membership in its open branches against a `Set`**, rebuilt when the expanded list changes, rather
  than against the array the consumer holds: the walk asks once per visible branch, and `includes` made expanding a
  tree of 20,000 open branches take about 300 ms against about 2 ms.

### A windowed row is placed with `top`, not a transform, because the highlight measures layout

Found by the user on Select's virtualized example: the highlight that slides to the hovered option stayed at the top
of the list. Listbox and Tree placed each windowed row absolutely at `top: 0` and moved it with
`transform: translateY(…)`, and the floater measures its target by walking `offsetTop` up the offset parents
(`Floater.utils.ts`'s `measureOffset`) — layout space, which a transform does not move. So every row read as the top
of the list. **Rows are placed with `top` instead**, in all four frameworks, so the layout position is the drawn one;
the rows are already out of the flow, so placing one moves nothing else. The floater's measurement was not changed to
read transforms, since an item's own press or hover transform would then drag the highlight with it. Table keeps the
transform: it draws no floater. Pinned by `select.spec.ts`'s _"in a windowed list, the highlight lands on the option
under the pointer"_; Tree's own marker test drives the unwindowed menu.

### A scroll to a row is written in whole pixels

TanStack's `elementScroll` is replaced by `VirtualizerUtils.scrollToWholePixel` in all four frameworks. Inside a
scaled `Viewport`, a row's offset is built from measurements with the scale divided out, which leaves it a
ten-millionth of a pixel either side of where it should be. Chrome happened to land above the whole pixel and kept
it; Safari scrolls only by whole pixels, landed below and rounded down, so a picked row reopened at the bottom edge
had its last pixel clipped. Rounding to the nearest pixel takes the noise out and costs at most half a pixel where an
offset is genuinely fractional.
