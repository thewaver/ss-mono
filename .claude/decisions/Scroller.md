# Decisions: `Scroller`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Scroller`, and why it renders no button of its own

Settled with the user. A strip too wide for its box, paged by a previous and a next button
rather than a scrollbar. The user asked for it as a `Carousel`; the name was corrected before anything was
built, because **a carousel is a different pattern with an accessibility contract this does not implement** —
one slide at a time, wrapping, `aria-roledescription` of `carousel` and `slide`, and a pause control the moment
it rotates by itself. Naming a component after what it resembles is the trap already recorded for the segmented
control. The real carousel is `Carousel`, which has since been built.

**The track holds arbitrary children, and that is the user's call.** It renders nothing and types nothing: the
consumer's markup goes in as `children` and comes out untouched. A list of records — `Tabs`' shape — was
rejected because the first consumer is a `Tabs`, which would then have been rendered twice over, and because
everything the component needs it can measure. Focus centering works by watching for focus reaching **any**
descendant. Paging lands on item boundaries by reading the track's own child elements, and where there is only
one child — the `Tabs` case — the rule degrades to a full page with no special case, because there is no
boundary inside the page to prefer.

**It never claims the arrow keys.** A `Tabs` inside it already walks its tabs with them, and two owners of one
key is a bug found later rather than sooner. The component listens; it never moves focus itself.

**A focused child is revealed, not centered, and the pointer counts the same as the keyboard.** Settled with the
user after the first attempt centered on keyboard focus alone: an item already fully in view does not move the
strip, and one cut off by an edge scrolls by the least that shows it whole. Centering is worse in both
directions — it drags a half-clicked item out from under the cursor, and it moves the strip when nothing needed
moving. Distinguishing pointer from keyboard was my patch for the first of those and it bought a second
behavior to remember; revealing removes the cause instead, so one rule covers both. What it gives up is the
look-ahead a centered item has: a child revealed at an edge sits flush against it, with nothing of the next one
showing.

**The browser's own scroll to a focused element is overruled, not relied on.** Focus arriving scrolls the focused
element into view natively, after the component's `focusin` handler has run. Chrome moves it by the least, which
agreed with the reveal; Safari centers it, and its scroll replaced the component's, so in Safari a cut-off tab was
carried to the middle. `ScrollerUtils.reveal` measures as focus arrives, before the native scroll, and applies the
same target again in a microtask, once the native scroll has begun.

**It renders no `<button>`, which is the `NumberInput` shape rather than the `Tabs` one.** `renderButton` is
called once per button with which step it is and with a `ScrollerStepper` — `getIsAtStart`, `getIsAtEnd`,
`stepToPrevious`, `stepToNext` — exactly as `NumberInput` hands its steppers to `renderTrailing`. So the
consumer composes with `Button` and inherits naming, the focus ring, tooltips and the disabled treatment, and
the library owns only what nobody else can know: how far a step goes and whether there is anywhere left to go.
`getButtonPlacement` is `split`, `start` or `end`, since "together" cannot be placed without saying which side.

**The position is reported as a ratio, and a written ratio scrolls the strip.** `progress` is optional
and goes through `SignalMirrorSolidUtils.createOptional` like every other two-way prop, and it carries `scrollLeft` divided
by the distance there is to travel — zero when nothing overflows. Reporting it is what the stepper cannot do:
page dots, a progress bar or a "3 of 12" readout all sit outside `renderButton`, and none of them could reach
the number. Accepting a write is the other half of the same variable, and it is what makes those dots
pressable rather than decorative.

**Which way a change came from is remembered rather than inferred**, because the track scrolls smoothly and
every intermediate frame reports itself. The component keeps the last ratio it wrote and ignores exactly that
value coming back; anything else is the consumer's and is scrolled to. Without it a consumer's write would be
canceled by the first frame of its own animation — the report would land back in the signal, look like a new
instruction, and scroll to where the strip had got to instead of where it was sent.

**`getPadding` exists because a scroll container clips a focus ring, and only the consumer knows how big the
ring is.** A ring is drawn outside the border box and a scrolling box clips at its own edges, so a focused
child at either end loses part of its ring — and so does every child at the top and bottom, because a
horizontal scroller clips the cross axis too. The library paints no ring and cannot guess its width; the
Playground's is one exported constant, `FOCUS_RING_WIDTH`, used both by the `:focus-visible` rule and by every
`Scroller` that has to leave room for it.

Three things follow from that number, and all three are needed — leaving any one out clips a ring somewhere.
The track takes it as `padding-block` and `padding-inline-start`. **The end side cannot be padding**, because a
scroll container's end-side padding is still not interoperable — Firefox does not count `padding-right` as
scrollable space — so the component renders one element of its own after the consumer's children, sized to the
same number. And **the reveal leaves that room free**: a child is scrolled to sit the padding's width clear of
the edge rather than flush against it.

**`overflow-y: clip` with `overflow-clip-margin` is the purpose-built answer and cannot be used here.** Read on
MDN: when either axis is neither `visible` nor `clip`, a `clip` on the other axis computes to
`hidden`. The horizontal axis has to scroll, so the vertical `clip` would become `hidden` and
`overflow-clip-margin` would be ignored. Recorded so it is not re-proposed.

**The buttons leave when there is nothing to scroll; the track never does.** Asked for by the user on
as "just return the contents when there is nothing to scroll", and the smaller version shipped,
because the track is the only thing the component can measure. Whether there is anything to scroll is
`scrollWidth > clientWidth` **on the track**; unmount it and the children lay out in a box the component does
not own, so it can neither tell that they have started to overflow nor put itself back. A track with nothing
overflowing is also indistinguishable from a plain flex row — the scrollbar is hidden, nothing is clipped,
nothing is interactive — so the only visible things were two dead buttons and the gap they sat in.

**Removing them widens the track, and that is deliberate hysteresis rather than a loop.** With the buttons
present the content has the track's width to fit in; without them it has that plus their width and the gaps. So
content between those two widths settles wherever it currently is and stays there, instead of flickering
between the two states on every resize frame. The first measurement happens with no buttons rendered, so a
strip only gains them by genuinely exceeding its full width.

**The track hides its scrollbar and keeps its scrolling.** Wheel and touch still work — taking them away would
make the buttons the only route, worse than the scrollbar it replaced. `scroll-behavior` is smooth in CSS
rather than per call, so `prefers-reduced-motion` turns it off without the component asking.

**A press during a glide steps on from where the glide is heading.** A step was first measured from wherever the
track was when the button was pressed, so a second press landing mid-glide measured from a point partway through the
first and covered less than a page. The user asked for it fixed. `ScrollerUtils.stepTo` keeps each track's step in
flight — where it began and where it is heading — in a `WeakMap` keyed by the track, and measures the next press from
that destination while the track is still on the stretch between the two. Arriving, or being scrolled off that
stretch by a wheel, a drag or a focus reveal, drops the memory, so nothing has to listen for the glide ending; it is
read at the next press. It lives in the framework-free utilities because all four views already step through them.
`scroller.spec.ts` compares two quick presses with two slow ones on a fresh page.

**Both directions, and a drawn scrollbar.** CSS can theme the browser's own bar only with two plain colors and a
`thin` width everywhere; a width in pixels, a gradient or a grip icon on the thumb works through `::-webkit-scrollbar`
in Chrome, Edge and desktop Safari and nowhere else (Firefox and iOS honor only hiding it), and setting a size there
turns a Mac's floating bar into a permanent one. So `Scroller` grows into the scroll area: the browser's bars are hidden
with `scrollbar-width: none`, the content keeps its native scrolling — wheel, touch, keyboard, right-to-left all stay
the browser's — and a bar the consumer paints mirrors the position and adds dragging and track presses. A separate
`ScrollArea` was weighed and rejected: the step buttons and the bar are two controls over one position, and the user's
example — a short track between `<` and `>` — is one component.

The user's design, settled point by point before it was built:

- **Directions, as CSS writes them.** `overflowX` and `overflowY`, each `"auto" | "scroll" | "hidden"` — CSS's own
  values, written straight to the box's `overflow-x` and `overflow-y`. `visible` and `clip` are left out of the type,
  since the box would not scroll. Defaults `overflowX: "auto"`, `overflowY: "hidden"`, which is today's behavior.
  `"auto"` shows a direction's bar only while it overflows, `"scroll"` always, `"hidden"` never. Both directions at
  once is required — one wide-and-tall box keeps both bars pinned to its edges, which nesting two `Scroller`s cannot
  do. Nesting still works for separate regions.
- **The position is `progress: { x, y }`**, each 0 to 1, two-way as today. The single number it replaces is a breaking
  change, free before 0.1.0.
- **The bar is painted**: track and thumb, placed and sized however the painter likes — a short track between the
  step buttons, an arc. The painter hands the library its track element; the thumb's length is the visible share of
  the measured track.
- **Dragging is straight by default**, and `computeProgressAtPoint(axis, point, rect)` turns a pointer into how far
  along for any other shape — the pattern `Range`'s `computeValueAtPoint` set; an arc uses
  `RangeUtils.computeAngularValue`. Pointer capture only past the usual small movement, and the click that ends a
  drag is swallowed, per `conventions.md`.
- **A press on the track** moves one view toward the press, repeating while held as the step buttons do; with Alt
  (Option on a Mac) held it jumps to the spot pressed instead — Windows' behavior by default, macOS's switch on the
  same modifier. Either is the single-pointer, no-drag route WCAG 2.5.7 asks of the thumb's drag.
- **Screen readers**: each drawn bar is `role="scrollbar"` with `aria-controls` naming the box (an id generated when
  the consumer gives none), `aria-valuenow` and `aria-orientation`, the value throttled per _"What a component reports
  runs at its own rate"_. Not focusable: the keyboard scrolls the box, as Windows' standard scrollbar works. WCAG
  4.1.2 rules out hiding it, since a person operates it.
- **Fading**: `isAutoHiding`, default `false`. When on, the painter gets `isScrolling` — true while scrolling and for
  `hideDelayMs` after it stops — and whether the pointer is over the box (hover counted from real pointer
  movement only), plus one shown flag worked out from both. A faded bar stays in the page.
- **Space**: `isBarOverlaid`, default `false` — the bar keeps its own strip beside the content and never covers it;
  overlaid, it floats over the content's edge. Independent of `isAutoHiding`. With both bars in their own strips, the
  corner square where they meet is left empty.
- **Each bar sits on the end side by default** — the across bar below the content, the down bar on the inline end
  (the left on a right-to-left page) — and `barSideX` / `barSideY` (`"start" | "end"`) move it to the other side, as
  the arched example does to put its curve above the content.
- **Step buttons** gain the direction they step in: one pair per scrolling direction, `buttonPlacement` applying to
  each.
- **Target size**: WCAG 2.5.8 asks for 24 by 24 CSS pixels unless an exception applies; the browser's own bar is
  exempt as a user-agent control, a drawn one is not. The library holds the thumb's length at 24 or more; its
  thickness is the painter's and the props documentation says so. Nothing warns, since the spacing exception cannot be
  judged from inside.

What the build added on its own account:

- **The axis is `"x" | "y"`**, matching `progress` and `overflowX`/`overflowY`; only `aria-orientation` carries ARIA's
  words. `renderButton` takes the axis as a third argument and each pair's stepper is bound to it.
- **The bar painter gets two refs**, the track and the thumb: the track is measured and takes presses, the thumb is
  what decides a drag from a page, whatever the bar's shape. `role="scrollbar"` sits on the library's strip around
  the painter, not on the painter's track. `aria-valuenow` is reported at a throttled rate, `ScratchCard`'s.
- **A track press repeats after a delay, at a steady rate** — both guesses, private constants, the user's to tune. An Alt press
  jumps and then carries on as a drag if the pointer keeps moving, as macOS does.
- **The fading flag stays on while a thumb is held**, or a drag held still past the delay would fade its own bar.
- **Two grids.** The root's tracks are written only where step buttons are, so its `gap` never surrounds an empty
  track; the inner area has no gap, so a kept bar sits flush against the box and the corner stays empty. An overlaid
  bar shares the box's cell. One class for a kept strip and one for an overlaid bar, never both, since two classes
  setting `grid-area` would be decided by stylesheet order.
- **A box scrolling down only lays its children in a column**; scrolling both ways it keeps a row.
- **The bar painter's refs, per framework**: React's painters turn the `null` a ref callback hands them into
  `undefined` (inside a `useCallback`); Vue hands `setTrackRef` and `setThumbRef` as separate slot members typed for a
  template `:ref`, as `Tree`'s `setExpanderRef` is; Svelte's painters set them from an `{@attach}` and clear them on
  teardown.
- **A step never lands on the first item while the box has not scrolled past its start.** Leading padding puts that
  start a little way in, so a box holding one child stepped 2px on its first press; it now goes a full view, as the
  step's own rule says for a box with no boundary inside the page.
- **React and Vue write only the padding keys a direction uses.** A style object holding `paddingBlock` and also
  `paddingBlockStart: undefined` makes both frameworks clear `padding-block-start` after setting the shorthand, which
  wiped the box's top padding — the room a focus ring needs — and put every reveal 2px off. The keys are spread in per
  direction instead.
- **`barSideX` and `barSideY` choose the side each bar's strip sits on**, added when the user asked for the arched
  example's curve above its content. `ScrollerUtils.computeAreaTemplate` writes the inner grid from them; an overlaid
  bar aligns to the same side. Named per axis like `overflowX` / `overflowY`.
- **A starting `progress` from the consumer is honored**; the first measurement used to overwrite it with 0.
- **Right-to-left works on the horizontal axis.** `scrollLeft` is never above 0 there, so the position is read as its
  magnitude and written negated; before this the back button was always dead and progress always read 0.
- **The box is a tab stop while it overflows and holds nothing focusable**, through
  `FocusManagerUtils.observeHasFocusable`, which `EdgeFader` now shares — the conventions' rule, since only recent
  Chrome makes such a box focusable by itself.

### `Scroller` can keep some of the last view

`overlapCount`, defaulting to `0`, which is the old behavior exactly: how many fully visible items of the view just
left stay in view after a step. `ScrollerUtils.computeStepLanding` pulls the landing back one item boundary per unit
of overlap, never past the first boundary the step crosses, so a step always moves at least one item; a negative,
fractional or missing count is read as a whole number from zero.
