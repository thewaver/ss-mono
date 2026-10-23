# Lib backlog

Outstanding work in `components/src` — bugs, code and architectural smells, missing implementation, pending
decisions. Nothing else belongs here. Once an item is done or dropped it is deleted outright rather
than marked resolved, and the remaining items are renumbered to stay contiguous from 1.

**`brief.md` beside this file lists the same faults one line each, grouped by kind, and the two are
edited together.** Anything opened, closed or renumbered here is reflected there in the same change. If closing it
settled a decision that drives future work, that decision moves to `conventions.md` when it is a rule the
whole library follows and to `decisions.md` when it is about one component; the record of having done the
work does not go anywhere.

**Accepted limits are not outstanding work, and live in their own section at the end.** Asked for by the user:
a fault that has been looked at and consciously left alone should not be re-read and
re-weighed every time the question is "what is left". They are unnumbered, they are not in the index, and a
report on the state of the library does not list them unless something has changed about one. Moving an item
there is a **decision the user takes**, not a way of retiring an item that has merely gone stale — an item
nobody has argued about is still open.

**Two sections at the end hold things that are not outstanding work, and neither is part of the answer to
"what is next".** **_Accepted limits_** is above; **_Open discussion_** is the second. Both are unnumbered and
neither is in the index. The difference is what they hold: an accepted limit is a real fault, consciously left
alone, and an open-discussion entry is an idea nobody has committed to building. Asked for by the user, so that
a sketch can be written down and argued over without ever competing with real work for attention.

Most items now carry an **_Elsewhere_** block: what other component libraries do about the same
question, read off their own documentation and source on **2026-08-10**. It is evidence for decisions
that have not been taken — not a recommendation, and not a decision. Where a published answer
contradicts something already settled in `conventions.md` or `decisions.md`, the settled entry stands until
someone argues it down; where it names a mechanism this repo had not considered, that is the part worth
reading.

### Index

1. Neither animation component can reveal its own children — _postponed until the platform catches up_
2. `Select` — one thing deliberately not built — _open_
3. Planned: a consumer-facing layer of controls above the library — _deferred to a session of its own_
4. `ColorInput` — two things deliberately not built — _open, one item postponed until the platform catches up_
5. `SlideButton` — two things deliberately not built — _open_
6. `Spotlight` — one thing deliberately not built — _open_
7. `Scroller` — one thing deliberately not built — _open_
8. `Paginator` — one thing deliberately not built — _open_
9. `Carousel` — two things deliberately not built — _open_
10. An anchored layer trails its anchor during a scroll — _postponed until the platform catches up_
11. `Table` — six things deliberately not built — _open_
12. `GlassSurface`'s ripple layer shows a defect at its edge — _postponed until the platform catches up_
13. Arbitrary placement — the gaps the trials left — _open_
14. The submit story — what a native submit carries, and what `Form` hands `onSubmit` — _pending decision_
15. `Die`'s step buttons and arrow keys fall into a loop of two or three faces — _open, no fix chosen_
16. The Playground's painters in Windows high-contrast mode — _open, decided, not yet built_

---

## 1. Neither animation component can reveal its own children

**The half this item used to be mostly about is closed.** A fill that is not a photograph — a gradient, a
solid, a pattern — is a source like any other: an SVG string as a `data:image/svg+xml,` URI, which the
component slices exactly as it slices a photograph. It needed one library fix, quoting the cell's background
URL, and no new machinery; see `decisions.md`. `PageComponents/SVGDefsSources` goes further and serializes
`Shape`'s own gradients and patterns into sources, so the two drawn examples pick from the same registry the
Shape page uses.

What is left is the other half. The React-era component could fill each cell over **its own children**, which
is what made a reveal-over-content effect possible — an animated button, a wipe over a card. The mechanism
that would be analogous to what the component does now is a copy of the content per cell, offset by minus its
own position and clipped by the cell box, so a slice flies as a unit the way an image slice does. That forces
three things: the content arrives as a render callback rather than a slot, since Solid children are real nodes
and cannot be placed in forty-two boxes at once; the content is built once per cell, forty-two times at the
default grid and a hundred and twenty-one in the stress case; and nothing inside can be interactive, because
every copy is a duplicate. **The user called that too costly.** A single copy with per-cell windows is not an
alternative — transforming a window moves the window over static content, which is a different effect.

**A single picture of the content would avoid that cost, and it is postponed until browser support exists.** Cut
one image of the element into cells and nothing has to be built per cell — a button vanishing into smoke, a card
wiped away. The platform's answer is HTML-in-Canvas, which draws a live element into a canvas; it is a trial in
Chrome alone and no other browser has committed to it
([Chrome's announcement](https://developer.chrome.com/blog/html-in-canvas-origin-trial)). Copying the element into
an SVG works everywhere today and was turned down by the user, because web fonts, images from other sites and some
effects do not travel with the copy and the picture comes out wrong without saying so. View Transitions can
photograph a single element but cannot hand the picture out as an image. Text alone can already be drawn into an
image exactly, since its string and font are known — Skiper UI's
[disintegrating text](https://skiper-ui.com/v1/skiper56) does that — but that does not reach a button with an
icon, which is the case that was asked for.

**_Elsewhere._** There is nothing to compare against, and that is the finding: no headless library
ships anything in this family. Ark UI's set is the widest of them at forty-seven components and has no
cell, scanline or wipe animation; Radix and React Aria own no animation component at all. What the
motion libraries do instead is animate a property over whatever children they were handed, with no
source image anywhere in the contract — which is the arrangement this item is asking for rather than
the one both components have.

---

## 2. `Select` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under the three `Select` headings. These are
the gaps, each with the reason it is still a gap.

- **What the stress variant reports is the cost of mounting options**, which is a separate cost from painting
  them. Windowing removed the mounting cost for lists that opt in; nothing addresses the painting half, and the
  cheap answer to it was `content-visibility` on the option paint, which is gone — see `decisions.md`.

**_Elsewhere._** Checked against Radix, React Aria and Kobalte, which is the SolidJS one.

- **Typeahead is a string per option in all three, and two of them derive it rather than asking.**
  Radix's `Select.Item` takes an optional `textValue`, and when it is absent typeahead uses the item's
  own rendered text content. React Aria's list items take `textValue` and require it only when the
  children are not plain text. Kobalte takes `optionTextValue`, a field name or getter on the option
  record, documented as being for typeahead. This is the reading that closed the gap: the option element
  is the library's here, so its text is reachable without a prop, and `computeCustomText` is the way out
  for the cases that need one. See `decisions.md`.
- **A filterable list is a separate component everywhere.** Radix has no autocomplete primitive at all,
  so the injected-non-matching-option case cannot arise there; and where a library does own the filter
  it necessarily knows which options matched, which is the knowledge this design trades away by
  choice.
- **Virtualization is nobody's library code.** Kobalte's select has a `virtualized` boolean and a docs
  example handing the list to `@tanstack/solid-virtual` with a hundred thousand options; React Aria has
  a `Virtualizer` wrapper; Radix has neither, and its docs cover long lists only with scroll buttons.
  So the seam is a flag plus a documented integration rather than an `Abstract`, and the flag exists
  precisely so the library stops managing its own scrolling — which is the loose end this bullet names.
- **Open state is controlled-or-uncontrolled in all three**, under the same three names: `open`,
  `defaultOpen`, `onOpenChange`. The consumer can always close it programmatically and the library
  still owns the default.

---

## 3. Planned: a consumer-facing layer of controls above the library — _deferred to a session of its own_

**Deferred to a near-future session of its own**, by the user, because bundling it with the components then in
progress would have been awkward. It is no longer deferred indefinitely. The packaging question inside it is a
real decision nobody has taken yet.

The reason it survived a review that nearly dropped it: every control is fully consumable today and the
Playground proves it, so what this layer would buy is **less repetition, not more capability**. A page pairs a
control with its painter at every call site — `ButtonPage` imports `Button` and `PageButtonContent` and writes
the same threading closure five times — and about forty painters across thirty pages do the same. That is the
entire cost, and in a repo with one author it is small.

**Magic UI sells exactly this, as templates**, and that is an argument the paragraph above did not weigh: for a
consumer, a painted set is the difference between an afternoon of painting and a page that works on install. Most
of the cost is packaging rather than drawing, since about forty painters already exist in the Playground and are in
use there.

**A more final-consumer-like layer of controls — `MyButton` and friends — that trade API surface for
decided behavior.** The stated example: no `renderContent` tooltip renderer, just tooltip content as
a string. This is the opposite direction from every argument recorded in `conventions.md` about slots
and flags, and deliberately so: those arguments are about what a **library** owes a consumer who has
not been met yet, and this layer is what a consumer who has been met actually writes. Worth knowing
because a narrowing that is correct here would be wrong one level down, and the two layers will sit in
the same repo.

**`App/StyledComponents` is not this layer and should not be mistaken for it.** Those forty-odd files are
painters — each named `<LibComponent>Content` after the slot it fills, per `decisions.md` — so they are
handed to a library control by the page that mounts it. Nothing there narrows an API: a page still passes
every prop the library takes. This layer is the opposite move, and it would consume those painters rather
than replace them.

The open question, when it starts: whether this layer lives in `playground/src` as the demo it
currently is, or becomes a second published entry point. That decides whether it needs a support
contract, which decides everything else about it.

**_Elsewhere._** The two-layer arrangement is the norm, and in every case checked the layers are two
**published packages** rather than one package with two entry points: Radix Primitives under Radix
Themes, Base UI (by MUI's own team) under MUI's styled components, Ark UI under Park UI — which is now
inside the same organization. shadcn/ui is the third answer and the interesting one, because nothing is
published at all: the styled source is copied into the consumer's repo, so the support-contract question
is settled by there not being one.

**The narrowing this item predicts is exactly where those layers draw the line.** Radix Themes' `Tooltip`
takes `content` as a required prop and wraps its child as the trigger; the primitive underneath makes you
compose a `Trigger` and a `Content`. So "no `renderContent` tooltip renderer, just tooltip content as a
string" is not a departure from how the industry splits these two layers — it is the split, stated in the
same example.

---

## 4. `ColorInput` — two things deliberately not built

`ColorInput` is the custom picker now; the decisions are in `decisions.md` under the `ColorArea` heading.
These are the gaps.

- **No native color input anywhere, so no form value and no OS picker.** Deliberate, and the cost of
  owning the surface. A consumer who wants the OS dialog has nothing to fall back on.
- **No eyedropper — _postponed until the platform catches up_, decided by the user.** Swatch
  presets and recent colors were dropped the same day and are not coming back. The eyedropper is not
  declined, it is waiting: the work is trivial and the support is not there. **Do not propose building it,
  and do not re-argue the design** — that part is settled and recorded below.

    **The trigger is browser support, and it is checkable rather than a matter of judgement.** Re-open this
    when Firefox or Safari ships `EyeDropper`, or when it reaches Baseline. Until then the only thing worth
    doing is reading [caniuse](https://caniuse.com/mdn-api_eyedropper) — do not re-derive the design, the cost
    or the options, all of which are below and are settled.

    **What it would take, for when that day comes:** almost nothing in `components/src`. `value` is already a
    hex string and `open()` resolves to `{ sRGBHex }`, so a consumer constructs an `EyeDropper`, awaits it, and
    writes the result into the signal — the component syncs hex into its HSV working state itself, and
    `renderPopup` already provides the space for a trigger. The two pieces that would be library-owned are the
    TypeScript declaration, since `EyeDropper` is absent from the DOM lib and every consumer currently writes
    their own `declare global`, and a feature-detection helper, because a consumer who forgets
    `"EyeDropper" in window` ships a dead button to most of their users. A `renderEyedropper` slot was weighed
    and rejected: a prop that does nothing in three browsers out of four is the thing this item exists to
    avoid.

**_Elsewhere._**

- **Owning the surface is the mainstream trade.** React Aria's color suite — `ColorArea`,
  `ColorSlider`, `ColorWheel`, `ColorField`, `ColorSwatch` and `ColorSwatchPicker`, synchronized by a
  `ColorPicker` around one color value object — has no native `<input type="color">` path either, and
  Ark UI's is custom too. Nobody keeps the OS dialog as a fallback, so the cost recorded in the first
  bullet is the cost everyone pays.
- **The eyedropper is absent because the platform is, and re-checked on 2026-08-15 rather than assumed.**
  `EyeDropper` is Chromium-only: Chrome and Edge from 95, Opera from 81, no Firefox, no Safari, **26.83%
  global support**. MDN marks it experimental and explicitly not Baseline, needing a secure context and a
  user gesture. `open()` resolves to `{ sRGBHex }`, accepts an `AbortSignal`, and Escape cancels it. React
  Aria's color documentation shows no eyedropper at all, so there is nothing to copy — and a library-owned
  prop for it would do nothing in three browsers out of four.
- **Dismissal is one mechanism for every layer, and it is a document listener plus a stack.** Radix's
  `DismissableLayer` keeps every open layer in an ordered set; on a pointer press each layer marks
  itself during the capture phase if the press began inside it, and on the bubble phase only the topmost
  layer that was pressed outside dismisses. `onPointerDownOutside` and `onFocusOutside` are both
  cancelable by the consumer. One implementation serves select, menu, popover, dialog and color picker
  together, which is the "settle it once" this bullet asks for — and it is worth noting that it answers
  the question as a **mechanism** before it answers it as an `openSignal`: the ordered stack is what
  stops an inner popup's press from closing the dialog around it, and that is the part four separate
  listeners cannot get right.

---

## 5. `SlideButton` — two things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `SlideButton`, and why the gesture
is the only thing it owns"_, including which WCAG criteria were read and what they decided. These are the
gaps, each with the reason it is still one.

- **Horizontal only.** `Range` grew an `orientation` and this did not: the hit test and the progress
  arithmetic both read one axis, and the painter's `calc` does too. A vertical slide-to-activate is a real
  shape on a phone lock screen and nowhere else, which is why it was not built rather than why it could not
  be.
- **The hold duration is one number for everyone.** `getHoldDurationMs` defaults to 1000 and a consumer can
  change it, which is the right shape — but there is no route to a duration that follows the person rather
  than the control, and `prefers-reduced-motion` is not the signal for it either. Recorded because a fixed
  hold is itself a dexterity assumption, and the control exists partly to avoid one.

**_Elsewhere_**, read on **2026-08-13**, after the keyboard decision had already been taken.

- **No headless library ships one, so there is nothing to copy either way.** Radix's thirty-odd primitives,
  Base UI's thirty-five at its December 2025 stable release, React Aria and Ark UI all have a slider and a
  button and nothing between them. That is the same finding as the animation components in item 1: the
  omission is the field's, not this library's.
- **The packages that do ship one have no keyboard route at all**, which is worse than the decision taken here
  rather than different from it. `react-swipeable-button`'s whole documented surface is `onSuccess`,
  `onFailure` and colors — no role, no `tabindex`, no key handling; `react-slide-button` is built on
  `react-swipeable`, which is pointer-only by construction.
- **Apple, whose lock screen is where the pattern comes from, answers exactly the decision taken here.** Asked
  on the developer forum whether a swipe-to-confirm harms VoiceOver users, the guidance is to override
  `accessibilityActivate` so that a single activation runs the same confirm logic **without** the swipe, or to
  expose the confirmation as an `accessibilityCustomActions` entry. The lock screen itself behaves that way:
  a VoiceOver user selects the caption and double-taps, and the gesture collapses to one activation. So "the
  assistive route is a plain activation, not a reproduced gesture" is the platform's own answer and not a
  convenience.
- **The standard that decides it is 2.5.7 Dragging Movements, and it is newer than the pattern**, which is
  most likely why none of the packages above answer it. What it asks for — a single-pointer route that is not
  a drag — is what the hold is; see `decisions.md`.

---

## 6. `Spotlight` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Spotlight`, and three presets
because a mode cannot move at runtime"_. These are the gaps, each with the reason it is still one.

- **`prompt` cannot hide the page from a screen reader.** `inert` is inherited and cannot be lifted off a
  descendant, so a mode that keeps one element live cannot seal the rest — the overlay stops the pointer and
  the `focusin` guard stops the tab order, but a virtual cursor still reads everything behind. The only escape
  is portalling the highlighted element into the overlay for the duration, which is far more invasive than the
  mode is worth. Recorded as a limit of the mechanism rather than an oversight.

---

## 7. `Scroller` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Scroller`, and why it renders no
button of its own"_. The gap, with the reason it is still one.

- **The buttons are the consumer's, so their keyboard story is too.** The component renders no button, which
  means it cannot guarantee one is reachable, named, or in the tab order — a consumer who paints them as bare
  divs gets a control no keyboard can reach. The library's answer is that the scrolling itself is still
  operable, because focus moving through the strip drags the track along, so the function survives even when
  the buttons do not. Recorded because it is a real consequence of the ownership line rather than an oversight.

---

## 8. `Paginator` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Paginator`, where the arithmetic
is the component"_ and _"`Paginator` is a root and pieces, with the ready-made row on top"_.

### Still deliberately not built

- **The whole row is in the tab order, and there is no way to ask for one stop.** Every page and every step is
  its own tab stop, which is the accordion's rule and is defended in `decisions.md`. A paginator with a wide
  window and both end jumps is fifteen tab stops in a row, which is a lot to walk past to reach the content it
  pages. Nothing has asked, and the alternative — a roving order over a list of independent destinations —
  contradicts the reasoning rather than extending it.

---

## 9. `Carousel` — two things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Carousel`, and the first component
that acts without being asked"_ and _"`Carousel`: one component, and how a slide sits is a placement rule"_. These
are the gaps, each with the reason it is still one.

- **One slide is current at a time; a page of several is not built.** A placement can show several slides at once,
  but only one is ever the current one — the one the controls step from, the one announced, the one not `inert`. A
  page of several current slides needs the arithmetic to start asking how many fit, which is `Scroller`'s question
  and the boundary the two were separated along. Building it would also make the picker ambiguous — a dot per slide
  or a dot per page — and that is a design question rather than a missing line.
- **The keyboard is whatever buttons the consumer builds.** There is no arrow-key handling on the region, and the
  carousel draws no controls of its own, so a consumer who builds no buttons on its controller has a carousel the
  keyboard cannot reach. The published pattern puts the arrows on the buttons rather than on the region, so this
  matches it — but it is worth knowing before it is called a bug.

---

## 10. An anchored layer trails its anchor during a scroll — _postponed until the platform catches up_

**While something is moving, the position an anchored layer paints at is the position its anchor was in one
frame ago.** At rest the last frame catches up, so it looks settled and only moves when something else does.
Opening is not part of it: the anchor is read once as the layer is shown, after layout and before paint, in all
four frameworks, so a layer opens on its anchor even when no animation frames arrive.

**Where it shows.** Scrolling a box with a layer open: the layer trails the anchor while the scroll is moving and
lands exactly when it stops. `viewport.spec.ts` asserts the settled position, which is what a spec can see, and
`noAnimationFrames.spec.ts` the opening one; the intermediate frames are checked by eye.

**What the layer is built on.** `AnchorUtils.createPortalPosition` derives the position from two measured signals —
the anchor's rect from `ElementObserverUtils.createViewportRectObserver`, the content's size from a
`ResizeObserver` — and the rect observer updates from four places: once on mount, once as the layer is shown,
from a capture-phase `scroll` and a window `resize`, and from a `requestAnimationFrame` loop that runs for as
long as the layer is open. The poll is the only one of the three that catches an anchor moving with no event behind it: an ancestor
being transformed or animated, content above it growing, a font arriving and reflowing the page.

**Decided by the user: postponed, on the eyedropper's terms.** The fix is C, C needs a platform feature that
is not there yet, and the two cheap options turned out to be no options at all. **Do not propose building it**
until the trigger below fires. Everything under it is kept so that nobody measures any of it twice.

**The trigger is browser support, and it is checkable rather than a matter of judgement.** Re-open when CSS
anchor positioning reaches Baseline, or when the browsers this library supports have it far enough back that
the JS positioner can actually be retired rather than kept beside it. Until then the only thing worth doing is
reading [caniuse](https://caniuse.com/css-anchor-positioning). At the time of the decision it stood at 84%
global with all three engines shipped — Chrome 125, Safari 26, Firefox 147 — which is the awkward middle: new
enough that the JS path has to stay, established enough that it looks ready.

**Why 84% is the argument rather than the percentage.** A layer that fails to position is broken, not
degraded, so the JS positioner cannot be retired at that number. Both paths would ship, and the maintained-but-
never-run one would be whichever your own browser does not take. That is the cost that decided it, more than
the coverage did.

**The four ways out, and what happened to each.** The user was inclined towards B and asked for D first.

- **A — leave it.** Only visible while something is moving; at rest it always lands right. **This is what
  the postponement leaves in place.**
- **B — write the position straight from the handler that reads the rect**, skipping the reactive round-trip.
  **Ruled out by D: there is no round-trip.** The write already happens synchronously inside the scroll
  handler, so B would remove a delay that does not exist.
- **C — hand the tracking to CSS anchor positioning.** The fix, and the thing being postponed. The anchor
  takes an `anchor-name`, the layer a `position-anchor`, and the layer writes its edges against the anchor's
  with `anchor()`; the browser then keeps the two glued in its own layout pass, which is why no frame can be
  lost. Choosing another side when there is no room is `position-try-fallbacks` — alternatives in order, the
  browser takes the first that fits. An earlier note calling this Chromium-only was out of date.
- **D — measure where the frame is actually lost before choosing.** Done, and it is what ruled B out.

**What C would have to answer, worked out before the postponement so it is not re-derived.** Two shapes, and
neither was tried.

- **Replacing the positioner outright** is the version that pays: the browser owns placement and flipping and
  most of `Anchor` goes. What blocks it is that the library's placement vocabulary is richer than
  `position-try` can state — band clamping and `reservedScreenSize` are arithmetic on numbers, and there is no
  CSS spelling for _"clamp into this band but keep the anchor's edge"_. Those semantics would have to be
  re-expressed or dropped.
- **Keeping the arithmetic and using CSS only for the glue** leaves every line of the placement logic alone
  and lets `anchor()` carry the layer along with its anchor between JS updates. Smaller, keeps the semantics,
  and puts two systems in charge of one number.
- **`Viewport` is what would decide between them, and the answer is not known.** A viewport scales its
  contents and positions layers in its own space through `getAdjustedBoundingClientRect`, while CSS anchor
  positioning works in the real layout. Whether those compose is the first thing to test when this re-opens.

**What D measured**, by probing the live page rather than by reading the code.

- **The style write is synchronous inside the scroll handler.** A `scroll` listener on `window` in the capture
  phase runs before the library's, one on `document` runs after it, and the layer's inline `transform` differs
  between the two on every event. There is no reactive round-trip to remove: Solid propagates the new rect
  through the memos and writes the style before the handler returns. **B would change nothing.**
- **A layer never opens in the wrong place, as long as frames are arriving.** `Popover` already paints
  `visibility: hidden` until `getPosition()` resolves. Sampled per frame from the moment the element is added:
  hidden at `translate(0px, 0px)` for two frames, then visible at its final transform, and unchanged for the
  next six.
- **Frame by frame through a scroll, the gap between anchor and layer is constant**, under both a
  `scrollTop` scroll and a real wheel scroll: 528 while the list sits above the anchor, then 268 after it
  flips below. So on the main thread's own account the layer is never behind.
- **What the probe cannot see is the only place left for the lag to be.** Both numbers it compares — the
  anchor's `getBoundingClientRect` and the layer's `transform` — come from the main thread, so a frame where
  the compositor has already scrolled the box and the main thread has not been told yet reads as a constant
  gap while the screen shows otherwise. Ruling that in or out needs pixels rather than the DOM.
- **One movement it did see, which is by design rather than drift.** Mid-scroll the list flips from above the
  anchor to below it, and that is a 260px jump in one frame. `AnchorUtils.getSafeVPlacement` choosing a new
  placement is what it is for; it is noted here because it is the largest thing that moves in this demo.

---

## 11. `Table` — six things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Table`, a grid rather than a
table, and why the markup could not be `<table>`"_. These are the gaps, each with the reason it is still one.
The resizer's discoverability is **not** here: the user weighed it and chose to leave it, so it sits under
_Accepted limits_ instead.

- **A column cannot be pinned.** Holding a column still while the rest scrolls needs a resolved pixel width
  for every pinned column, so the sticky offsets can be added up. Without one, a pin silently does nothing on
  an unsized column — the "looks supported and is not" failure this repo has refused twice already. It was
  also outside the scope the user set for the component.
- **Rows cannot be grouped, and there are no aggregate rows.** A run of rows under a heading, with a totals
  row beneath them, is a second row kind the flattener and the roving cell would both have to know about.
- **A row cannot expand.** Nothing opens beneath a row to hold detail, which is the other shape a second row
  kind would take.
- **A cell cannot be edited in place.** Editing is the consumer's, in whatever they paint into the cell; the
  grid has no notion of a cell entering an editing state and no key that starts one.
- **There is no filtering.** Sorting is the component's and filtering is not, so a consumer narrows the rows
  themselves before handing them over — the same split `Select` makes with its query.
- **A cell holding more than one control cannot be stepped into, and this one has an accessibility cost.**
  The grid is a single tab stop with a roving cell, so a cell containing two buttons can be reached but there
  is no defined key that moves _inside_ it to choose between them. The published answer is an `F2`-style
  interaction mode, where a key swaps the grid between navigating cells and operating whatever is in one.

---

## 12. `GlassSurface`'s ripple layer shows a defect at its edge — _postponed until the platform catches up_

The component is built and works; the reasoning is in `decisions.md` under _"`GlassSurface`, and the two things
that decide its shape"_. `GlassSurface` sits under `Composites`, which the Playground hides behind
`SHOW_COMPOSITES` — that flag is what decides visibility by design, so the page not being in the menu is not a gap.

**The ripple layer's edge shows a defect under real GPU rendering, and it is postponed rather than fixed.** Clipping
the ripple layer with `clip-path`, an ancestor's `overflow: hidden`, or a `feComposite` mask built into the filter
itself all either reproduce the fault or introduce a different one, a precise notch at two diagonally opposite
corners, confirmed in a real Microsoft Edge window and unaffected by curve resolution or device pixel ratio — see
`decisions.md` for the full investigation. This is not a bug particular to this codebase: the W3C SVG working group
has an open issue ([w3c/svgwg#1142](https://github.com/w3c/svgwg/issues/1142)) asking for an interoperable way to do
exactly this — backdrop displacement for "liquid glass" UI — because `backdrop-filter` combined with
`feDisplacementMap` is not currently reliable, and Safari does not implement the combination at all
([WebKit bug 245510](https://bugs.webkit.org/show_bug.cgi?id=245510)). **Do not propose a CSS-only or
filter-internal workaround** — every shape one could take was tried and is recorded in `decisions.md`. Re-open when
the platform actually supports this, which the W3C issue above is the thing to watch.

---

## 13. Arbitrary placement — the gaps the trials left

Built and in use: a control's items can be placed anywhere rather than along a line, through a layout it is handed —
a menu as a ring, page numbers round a dial, tabs as a honeycomb. The reasoning is in `decisions.md` under
_"Arbitrary item placement"_, _"Concentric submenus"_, _"A wheel of wedges"_, _"The wheel as the ring's second
consumer"_, _"`WheelMenu`: the wheel becomes a component"_, _"`Paginator` takes a layout"_, _"`RadioGroup` and
`Tabs` take a layout too"_, _"Every layout sample lives in one place"_, _"`Formation` is the abstract's"_, _"The band
and the arc are two placers"_, _"The arc can be flattened or stretched"_, _"The fan places tilted boxes"_, _"A hover
the pointer did not cause"_, _"A placed menu walks on all four arrows"_, _"A group's radios are ordered by the
document"_, _"Five more controls take a layout"_ and _"Hold and flick"_. What the trials left open:

- **A placed item's box is guessed rather than measured.** A layout picks each item's size from numbers it is
  given — `itemMaxWidthRatio`, `itemWidthRatio` — while the painter's content has an intrinsic width the
  layout never sees. Where the content is wider it simply overflows, and on a ring that means overlapping a
  neighbor. Every one of the four arrangements built for `Stepper`, `Toolbar`, `Sortable` and `Tree` had to be
  widened by hand until its labels fitted, which is what makes this the abstract's problem rather than each
  demo's tuning. One case of it is closed: a nested band's wedge is no longer allowed to be narrower than the
  item box the same layout says it will draw, which is a layout disagreeing with itself rather than with its
  content.
- **A laid-out control can overflow its container, and it is no longer only popups.** A ring is centered on its
  invoker and is as large as the box its consumer gave it, so nothing stops it reaching past the edge of the
  screen — pinning deliberately turned off the clamping that would have moved it, and concentric submenus make
  it louder, each level enclosing the one above it. **The mechanism changed** — a layout no longer sizes
  itself from its item count — but the question did not: nothing decides what happens when the box is too big
  for the room. In a page's flow the same thing bites differently: a placed `Toolbar` has
  nothing to collapse into, so a layout that outgrows its column spills rather than adapting. What should
  happen in either case has not been decided.
- **The flick's travel threshold is a guess, not a measurement.** `FLICK_TRAVEL_RATIO` is 0.1 of the layout's
  own width — about 30px on the demo wheel, and proportionally more on a bigger one. It reads well enough to
  build on, but every other tuned constant in the repo is the user's, backed by something they measured, and
  this one is not.

---

## 14. The submit story — what a native submit carries, and what `Form` hands `onSubmit`

Three findings from the survey against the reference libraries were lofted here rather than settled one by one,
because they are one question. **The user's word: lofted, not discarded.**

- `Select` and `MultiSelect` have no `name` and render no native element, so a plain `<form>` around them submits
  nothing. Radix, Kobalte and Ark render a hidden native input so `name` submits. `Checkbox` and `Toggle` got their
  `name` back separately, since they already render a native input.
- `DateInput`, `DatePicker` and `TimeInput` put `name` on the visible field, so a native submit sends the display
  text, `23/09/2026` or `09/23/2026` by format, rather than a value a server can parse. React Aria sends ISO through
  a hidden input. Inferred from the shared `TextField`, not traced.
- `Form` cancels the browser's own submit and hands `onSubmit` nothing, so today `name` matters only to a consumer
  who reads the fields themselves or uses a plain `<form>` without `Form`.

The first two are the same change, a hidden input carrying a machine-readable value, and both wait on the third:
whether the library's `Form` is ever going to carry values, or whether the native submit is the route a consumer
who wants values takes. _"The form story"_ in `decisions.md` says the library never computes a form's data, and
that entry is what this item would revisit. Focus moving to the first field in error on submit was built
separately and does not depend on this.

---

## 15. `Die`'s step buttons and arrow keys fall into a loop of two or three faces

Reachable on the Die page's icon cloud: pick the d20 and press down a few times. The die goes back and forth
between the same two faces. Every shape does it — a d20 pressed right goes between faces 1 and 2 from the first
press, and a cube pressed up visits three faces and repeats them, where a real cube rolled up visits four.

**The cause is the righting spin at the end of a step.** A step rolls the die about the screen axis until the next
face is in front, then settles that face the right way up (`getLandingQuaternion`, which depends only on the face).
That spin changes which side of the die is on top, so the next press does not continue the roll. And because each
face always lands the same way, the face a step reaches from a given face is fixed: pressing the same key repeats a
fixed path that soon loops, and a two-face loop happens wherever B's "right way up" points back towards A.

**No fix was taken; the user judged all three put to them inadequate.** Rolling straight across the die and landing
every face upright cannot both hold, so each option gives one up:

- **A step lands by the shortest roll, with no righting spin.** It rolls straight around the die like a real one,
  but faces end up at an angle, so a number or an icon may read sideways; it breaks _"The solid never stops
  crooked"_ (`decisions.md`, under _"`Roller`: the wheel's behavior with one more dimension"_) for steps.
- **The die remembers which way it has been rolling, and keeps the righting spin.** Faces land upright, but after
  the spin a press of up can move the front face sideways on screen, and the memory is extra state that a drag or
  another key clears.
- **A step never goes back to the face it came from.** Stops the two-face loop only; the cube's three-face loop and
  longer ones remain.

`Cuboid`'s upright mode has the same tension and accepted it, since a box has only six resting orientations
(`decisions.md`, _"`Cuboid`: upright mode keeps an orientation"_); a d20 has many more faces for the loop to skip.

---

## 16. The Playground's painters in Windows high-contrast mode

Reachable on the Range page with Windows' high-contrast mode on, or with Chrome's DevTools emulating
`forced-colors: active`: the track and the filled part of the range turn white on the white page, and only the
thumb's border is left, a circle floating on nothing. High-contrast mode replaces every color the page sets with a
few system colors of the user's choosing, and a part drawn only as a background color is repainted in the page's
own background. The track and fill measured 1:1 against the page there, where WCAG 1.4.11 asks parts of a control
for 3:1. Found by an outside review, which tested Range only.

**Decided by the user: every painter, not just Range, and later rather than now.** Nothing in the Playground or
the library mentions `forced-colors`, so any painter whose shapes are background colors alone will vanish the same
way; fixing Range by itself would leave the rest broken for the same reason. The work is to go through every
Playground painter with forced colors emulated and, for each that vanishes, give it a `@media (forced-colors:
active)` rule drawing its shapes in system colors (`CanvasText` for a track or an outline, `Highlight` for a
selected or filled part), with `forced-color-adjust` left alone unless a part has to keep its own color. **The
normal theme does not change**: this is the user's styling, and the rules apply only while high-contrast mode is
on.

---

## Accepted limits

Faults that have been looked at and consciously left alone. Not outstanding work, not numbered, and not part
of the answer to "what is left" — see the note at the top of this file. Each one records what it is, how to
reach it, and why it was accepted, so that nobody has to re-derive the argument in order to leave it alone
again. An entry moves back up into the numbered items only if the user says so, or if something changes that
makes the reasoning wrong.

**A `Timeline`, `Bracket`, `PatchBoard` or `CardStack` whose consumer draws no buttons can fail WCAG 2.5.7 and 2.5.1
without a warning.** Dragging to pan, pinching to zoom and swiping a card each need a way to do the same with one
pointer and no dragging, and only buttons the consumer draws give one. The library warns when the consumer holds
nothing a button could be built on — neither the controls handed out at mount nor the shared value (`view`,
`topIndex`) — but it cannot tell whether buttons were built from either. `Bracket` and `PatchBoard` never warn, since
their gestures only run once a view is shared. Reachable by giving a `Timeline` a `view` and no buttons. Accepted by
the user: buttons are the settled route, and a library that draws no controls cannot see whether they exist.

**A filter that keeps a non-matching option in `Select` can have the highlight land on it.** While filtering, the
highlight goes to the first option shown rather than to the selection, because the component knows which options are
_present_, not which ones _matched_. Reachable with a consumer filter that injects an option the query does not match.
Accepted by the user: the fix belongs in the consumer's filter, and the trade-off is recorded in `decisions.md` under
the `Select` headings.

**A `Toasts` entry re-added while it is leaving fades back in** rather than restarting as a new entry, because the id
never left the rendered list. Reachable by adding a toast, dismissing it, and adding the same id again before the fade
ends. Accepted by the user as the reasonable behavior; it is written down so it is not rediscovered as a fault.

**A copy of an item never shows what the original holds.** `Wraparound` repeats its content round the real tile, and
`InfiniteCorridor` and a looping `Carousel` repeat items round their ring; every copy is a separate instance, so text
typed into the original, a video's place or a checkbox ticked in it is not in its copies, and a `Wraparound` copy
starts fresh each time it scrolls back into view. Reachable on the Wraparound page with content that holds state.
Accepted by the user because the platform has no cross-browser way to draw one live element in two places — CSS
`element()` is experimental and Firefox-only, behind `-moz-`
([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/element)) — so a copy can match the original only when the
state lives in the consumer's data, which every copy then draws alike. The next entry is the one place the library
adds to it.

**In `InfiniteCorridor`, and in a looping `Carousel` with too few slides to fill its ring, a copy takes over as the
real item as the ring turns.** Both draw an item more than once round the ring, and the usable instance is always the
one nearest in front — for the carousel, the one showing. When the ring moves on, a different instance takes that
role, so whatever the person typed into an item or left playing in it stays with the instance that has just become an
inert copy, and the usable one in front starts empty. Reachable on the InfiniteCorridor page with an item holding a
field, by walking the corridor round its loop. Accepted by the user after a fix was argued: keeping one instance real
and moving it round would protect state only in the corridor, whose items are not expected to be interactive, and in
the carousel it breaks stepping — the real instance of the next slide can sit backwards round the ring, so Next would
sometimes glide the wrong way or the long way round. The carousel case also needs a looping carousel with fewer than
`2 × reach + 1` slides.

**No check runs the whole repository before a push.** The root `npm run build` builds the library packages and
not the Playgrounds, there is no CI, and the full browser suite takes about half an hour, so a commit can break
every Playground build and the first word of it is Vercel's site build failing after the push. Reachable by breaking an import in
`playground/src` and running `npm run build`, which passes. An outside review proposed a release gate — a
workflow on each push running the type-checks, the unit tests and both builds, or a check in the commit hook.
Accepted by the user: Vercel's site build already reports on each commit in GitHub and flagged this one, and with
every push going straight to `main` a workflow of the repository's own would report no sooner; a verifier that
makes each commit wait would be skipped with `--no-verify`, taking the small checks with it; and the browser specs
are already run for whatever a session changes. The one break that prompted
the review came from the commit hook itself rewriting a file, which `decisions.md` records and which can no
longer happen the same way.

**The page cannot be clicked while a `ShapeReveal` runs.** For the reveal's whole duration every click lands on
nothing, including in the part of the page already uncovered. Reachable on the ShapeReveal page: start the theme
cycle with a long duration and try to press anything. The browser refuses clicks to whatever takes part in a view
transition, and the reveal is one over the whole page; no CSS undoes it (the probes are in `decisions.md`, under
_"`ShapeReveal`: a change shown through a shape growing from a point"_). Accepted by the user until the platform can
forward clicks from the revealed picture to the real page — CSSWG issue 11596, open at the time of writing. Reopen
it when that ships, aiming for what was asked: the revealed area live, the rest still blocked.

**React faders report `onShow` twice in development.** React's strict mode runs every effect twice in a
development build, so a fader shows, cancels and shows again, and the cancel does not take back the `onShow`
already reported. A production build reports once. Reachable on any React page with a fader, such as toasts, by
counting `onShow` calls under `npm start`. Accepted by the user: React's own documentation calls a double report
in development acceptable, production is already right, and the alternative — holding `onShow` until the fade has
really begun — would delay it by a frame in both frameworks through the shared fader. The React toasts spec
asserts that an arrival was reported, not that it was reported exactly once, and should stay that way.

**A laid-out `Tree` renders every open node, windowing being a one-dimensional device.** A window mounts a run
of rows and moves them down a column; a layout places every visible node wherever it likes, so there is no run
to window. `Tree` turns virtualization off when it is given a layout, which means a placed tree of a thousand
open nodes mounts a thousand of them. Reachable by handing `computeEstimatedNodeHeight` and `computeLayout` to
the same tree: the first is ignored. Accepted because there is no fix, only a boundary — the two answer
different questions about the same list, and a layout is the one that was asked for.

**Converting a date into a calendar that cannot hold it clamps, silently.** Accepted by the user.
`DateValueUtils.withCalendar` is `toCalendar`, and 15 March 44 BC asked for in the Japanese calendar comes back
as Meiji 1 — 15 September 1868 — because that calendar's first era begins there. Nothing reports that the value
moved. Reachable in the Playground in two clicks: hold the Date picker page's historical date and switch the
calendar knob to `japanese`.

This is the same class of fault as a mask laying too many digits into too few slots, and it is the one place the
_"never approximate a value"_ rule in `conventions.md` is still broken — so the rule is stated there with this
exception, rather than pretending to be absolute. The fix itself is cheap, a round-trip comparison; what made it
not worth taking is that it forces `withCalendar` to return `undefined`, and then each of `Calendar`,
`DateInput` and the Playground's knob has to decide separately what to show instead. Three judgment calls and a
non-null assertion in `toIso`, to close a case only a deliberate calendar switch on an out-of-era date reaches.
The clamp is also `Intl`'s own behavior, so what ships is at least consistent with the platform.

**Playground samples are not considered for export.** Accepted by the user when the SVG defs vocabulary moved
out of the library: seven tilings and four families of animation builder now live in `Samples/SVGDefs`, so a
consumer of the package can no longer import them and copies them from the Playground instead — the same trade
already taken for `CellAnimation`'s origins and weights. What this gives up is stated so it is not rediscovered
as an oversight: a consumer wanting animated hexagons gets a worked example rather than a function, and
anything that becomes worth publishing has to be moved back deliberately. Nothing in `components/src` depends on any
of it, and the arithmetic is now unit-tested where it sits, which is what closed the item this came from.

**A `Table` column can be resized without anything saying so.** Accepted by the user. The drag handle at a
column's right edge is `aria-hidden`, so a screen reader is never told the column can be resized; the keyboard
route exists — `Ctrl` with the left and right arrows on a focused header cell — but only somebody who already
knows it is there will use it. Reachable in the Playground on the Table page's _Resizable columns_ example.

Two fixes were offered and both were declined, and the reasons are worth keeping so neither is re-proposed.
Putting the word into the header's accessible name means the library writing into content the consumer paints,
which nothing else here does. React Aria's answer — a visually-hidden slider inside the header cell — is a
real named control with a real value, and costs one extra tab stop per resizable column, which is precisely
what a grid's single tab stop exists to prevent: a ten-column table would take eleven presses of Tab to cross
instead of one. Success criterion 2.1.1 is met either way, since the function is reachable from the keyboard;
what is given up is 3.3.2-style discoverability, and the user weighed that against the tab order and kept the
tab order. The reasoning behind the whole arrangement is in `decisions.md`.

**Screenshot baselines, and with them any automated check on appearance.** Accepted by the user, on two
grounds: style in this project is far too fluid for a baseline image to mean anything for long,
and appearance is **not the library's responsibility** in the first place — `components/src` paints nothing, every
painter lives in the Playground, so a committed image would be asserting the demo's taste rather than the
package's contract.

What this permanently gives up is worth naming so nobody re-proposes it as a gap: the `aria-disabled`-parity
rule — that disabled and disabled-but-reachable look identical — is checked by eye and only by eye, and
`CellAnimation` and `ScanlineAnimation` will keep their Playground pages and no specs, because
motion over time is the one thing a DOM-reading suite cannot see. `decisions.md`, under _"What the verification
suite cannot see"_, records the blind spot; this is the decision not to close it.

For the record, since it was researched and would otherwise be re-researched: there are two published
arrangements and they differ on where the image lives. Playwright's own screenshot assertion commits the
baseline beside the spec, one file per browser and platform, re-blessed with `--update-snapshots` — and its docs
are explicit that rendering varies with the host operating system, the browser build, headless mode, hardware
and even whether the machine is on battery, so a committed image is only stable in the environment that
produced it. The hosted services (Chromatic, Argos) keep baselines off the repo entirely and put the diff in the
pull request for approval, which is what libraries with a design system to protect generally use. Neither
arrangement survives the two grounds above.

**`CellAnimation` draws a brighter line around every cell when the source is see-through.** Accepted by the
user. Each cell is drawn one pixel wider and taller than its slot so it laps over its right-hand and bottom
neighbor — the reasoning is in `decisions.md`, and the pixel went back after being removed once. Where the
source is partly transparent, that lapped strip is composited twice: 50% over 50% reads as 75%, and the result
is a grid of denser lines boxing in each cell. Reachable on the Playground's `CellAnimation` page, in the
gradient example with `sweep_diag_1` and in the pattern example with `hexagon_pt_2`. The two neighboring
samples show why it is about the artwork rather than the grid: `circle_hd_2` is solid circles on fully empty
gaps, so doubling either is invisible, and `orbit_async_2v1` lays an opaque gradient over its half-transparent
base, leaving nothing see-through to double.

Three fixes were put up and the user chose to leave it, so none should be re-proposed without new grounds.
Making the bleed a prop defaulting to 1 works but adds API surface whose only job is to name a rendering
compromise, plus a Playground knob for it. Dropping the bleed to zero brings back the hairline seams on opaque
sources, which is the fault the pixel exists for. Drawing every cell into one canvas removes the second paint
entirely and is the only fix with no trade, but the whole animation is per-cell CSS transforms and filters, so
it is a rewrite of how the component renders.

Worth knowing if this is ever reopened: the seams the pixel fixes come from the Playground drawing inside
`Viewport`'s scale transform, where whole-pixel layout edges land on fractional device pixels — while the
line it causes around each cell reaches any consumer with translucent artwork, scaled or not.

---

## Open discussion

Ideas, sketches and things worth arguing about. **Not outstanding work, not numbered, and never part of the
answer to "what is next for development"** — see the note at the top of this file. Nothing here is a
commitment, and an entry that already carries the user's verdict is recorded here so that the same sketch is
not put to them twice. An entry leaves this section in one of two directions: upward into a numbered item, which is the user's
decision to take, or into `conventions.md` / `decisions.md` if building it settles something.

### A button that burns away into ash or smoke

Raised by the user while looking at Framer's
[Particle Button](https://www.framer.com/marketplace/components/particle-button/), which draws its button into a 2D
canvas and scatters the pixels. Breaking a live element into pieces that look like it needs a picture of it, which is
what item 1 is waiting on. **The user's point: if the pieces are ash or smoke, nothing needs to know what the original
looks like.** So the effect becomes two layers, with no picture at all:

- **The content fades away behind a moving edge**, a mask swept across it in a chosen direction, as `Reveal`,
  `ShapeReveal` and the cell and scanline animations already sweep masks.
- **Particles are released along that edge as it passes** and drift off, as `ParticleSpawner` and `ParticleField`
  already release and move particles, with the moving edge as the place they come from.

**Particles come only from where the content is painted**, the user's addition, so none rise out of a transparent
corner. That too needs no picture, only the page's own structure: the browser reports the box of every line of text,
an element with a visible background or border paints its box less its rounded corners, an element painting nothing
is skipped, and an SVG shape can be asked whether a point lies inside its fill or stroke. It is approximate by
agreement — inside an image or a gradient transparency cannot be seen, so the whole box counts as painted.

What it leaves open: the particles are generic, taking at most a colour read from the content's computed style, so
they suit ash and smoke but not pieces that keep the label's shape; rebuilding is the same played backwards, the mask
closing and particles flying in to the edge; while dissolved the content has to be out of reach as well as out of
sight, and under reduced motion the particles are skipped and it simply fades. It would be a component of its own, a
wrapper, and item 1 still stands for effects that need the real picture. Nothing has been decided about building it.

### A scattered layout for `InfiniteCorridor`, done differently

The corridor first had a third layout that strewed items over both walls at different heights and sizes, each drawn
from the item's index and a seed. **The user's verdict: taken out, to be rethought later in a fairly different way.**
What that way is has not been discussed.

### Lines that stretch into shares of the height as the page scrolls

From Framer's [TypeShift](https://www.framer.com/marketplace/components/typeshift/) (live demo:
[periphi-typeshift.framer.website](https://periphi-typeshift.framer.website/)). A phrase is set one word per line, every
line stretched to the full width of the box, as `FittedText` does. The first word starts out filling the whole height,
its letters drawn tall and thin. As the page scrolls, the next word appears at the bottom almost flat and grows, while
the words above give up height to make room, until every word holds an equal share. The letters are stretched out of
shape rather than resized.

**What the library already has.** The width fitting is `FittedText`'s, and turning a scroll position into a number from
`0` to `1` is `ElementObserver`'s, both for the window and for a scrolling box. The new part is only the height shares
and the order in which each word arrives.

**How it would be built, if it were.** A text component of its own taking the lines and a `progress`, rather than a
setting on `FittedText`: `FittedText` promises that letters keep their shape, and stretching them is the opposite
promise.

**The user's verdict: deferred.** They lean towards a component of its own, but are not convinced the effect earns one.

### Publishing Exotics as a package of their own

The idea was that someone already using another library for everyday controls might want only the Exotics. **The
user's verdict was to keep one package per framework.** Splitting would not make anyone's app smaller: a bundler
already keeps only what is imported, so a single `CellAnimation` costs about 7 KB gzipped either way. What a split
would change is what gets installed. Against that, the Exotics still need the Abstracts, Primitives, Generators
and Samples, so those would become a third package or stay in Essentials. Each of the four framework packages
would split the same way, taking the count from six to about sixteen. And Menu and Tabs would keep their
advanced layout features in Essentials, so "Exotics" would not mean "everything advanced".

Worth reopening if someone actually asks to install the Exotics alone, or if the type definitions a consumer
installs grow large enough to slow their editor.

### One source for the Solid and React components, markup included

Raised by the user: Solid and React are close enough that their matching pieces — `createSignal` and `useState`,
`createMemo` and `useMemo`, `createEffect` and `useEffect` — could be hidden behind the library's own functions, so
that one component file serves both packages. Vue and Svelte were left out of the question on purpose. **The user's
verdict for now: not yet, but worth keeping** for the candidates below.

**How the markup could be shared.** Every shared component would be written in one dialect, which each package
compiles with its own JSX compiler and its own small set of helpers:

- **Our own `Show`, `For`, `Index`, `Dynamic` and `Portal`**, one version per framework.
- **Styles written once in camelCase**, converted to the kebab-case Solid wants by the helpers `ss-utils` already has.
- **Attributes whose names differ** — `class` and `className`, `for` and `htmlFor` — set through small typed helpers,
  one per framework. Installed Solid does not accept `className` at all. A spread with a computed key, such as
  `{...{ [getNameOfClassProp()]: getClassName() }}`, would also work, but it switches off type checking for that
  element.
- **Refs set by callback only**, since Solid's "assign to a variable" form has no React equivalent.
- **`onInput` rather than `onChange`**, which means different things in the two. React also wraps its events, so
  handlers are typed against what both have in common.
- **Every effect names what it depends on**, through Solid's `on(...)`, which turns one for one into React's
  dependency list. A forgotten dependency is then wrong in both frameworks at once, and shows in Solid, which is
  tested first — so there is no fault that exists only in React. Memos need the same list, or React recalculates them
  on every render, which is correct but slower.
- **A shim for children**, since reading `props.children` twice builds the content twice in Solid.
- **A helper at every call into a painter**, since Solid's painters receive getters and React's receive values. Each
  package's public props stay as they are.
- **No state created inside a `For` callback or an `if` statement**, which React forbids; those become small per-item
  components.

The Solid code is already most of the way to this dialect, so the work would be converting the Solid package to it
rather than rewriting both, with the React Playground's specs as the safety net.

**Why the dialect is needed at all.** Swapping the matching pieces one for one does not work on its own, because the
two frameworks run a component differently. React runs the component's whole body again on every change; Solid runs
it once and updates only what read a changed value. So shared code has to be written Solid's way, with every derived
value wrapped, and React then needs to be told what each wrapped value depends on — which is what the effect rule
above settles.

**What it costs:**

- **React fixes would have to be solved again inside the helpers**: `useStableList`, setting state while drawing, and
  `useLatest` exist because of faults met while porting.
- **A stranger build**: one folder compiled by two different JSX compilers, type-checked twice against two sets of
  JSX types, with an import alias choosing each package's helpers.
- **React code that does not read like React** to anyone debugging into the package.

**Routes looked at and set aside:**

- **Sharing only the logic** is already the plan, recorded in `decisions.md` under _"Porting beyond Solid: the shared
  logic is this library's own, not Zag's"_, and does not shrink the code by much: what is still written twice is the
  markup and the wiring around it, and those are most of what each framework package holds — about 40,000 lines each,
  beside about 53,000 shared.
- **Signals in React** help only a little. The Preact team publishes `@preact/signals-react` (and
  `@preact/signals-core`, with no framework at all); React has none of its own, and the proposal to add signals to
  JavaScript itself is at its earliest stage. They would let React work out what a value depends on by itself, but
  React still re-runs the whole component, a consumer's props still arrive as plain values that would have to be
  copied into signals while React is drawing, a component reacts only if a build plugin rewrites it or it opts in by
  hand, and the package would ship to every React consumer. They do nothing for the markup.
- **Generating the code from one source with a compiler** ([Mitosis](https://github.com/BuilderIO/mitosis)) removes
  the duplicated markup too, but is the most expensive: only a subset of each framework is supported, the output is
  hard to read and debug, and the whole library would be rebuilt around a new tool.

### A multipurpose set of animated SVG samples

Raised by the user while narrowing the page-change reveal to the default shapes: rather than one animated GIF as a
mask, a sample set of animated SVGs of the library's own, usable as a mask, a fill or a decoration wherever an SVG
fits. The reveal's mask would be its first use. Nothing about it is designed yet.

### Ready-made point sources: the phone's tilt, and a point that wanders by itself

How a point other than the pointer plugs in is settled, in `decisions.md` under _"`PointerTracker`: one reading of where the pointer is relative to one element"_: a fraction across a box, taken by every
component that reads the pointer tracker. What is left here are two sources nobody has committed to shipping
ready-made, each of which would be a helper producing that same shape:

- **The phone's tilt**, so the effects do something on a device with no pointer. The browser reports it through
  `deviceorientation` events. Per MDN, `DeviceOrientationEvent.requestPermission()` (Safari) needs a secure
  (HTTPS) page and has to be called from a user action such as a button press, so the page's own button asks.
  WCAG 2.5.4 Motion Actuation was checked: it covers functionality operated by moving the device, and a
  decorative tilt operates nothing.
- **A point that wanders by itself**, which was `Reveal`'s idea of a hole moving on its own as a demo.

### A tracked sample that rewards holding still

Every sample in `Gradient.Tracked` treats a motionless pointer as a motionless picture — that is what lets
their frame clocks stop. A charge-up inverts it: no movement for a moment, and then rings converging inward
onto the source while brightening, so holding the pointer somewhere reads as energy being drawn into it.

**The user's verdict, having seen it working: cut.** It was built, it did what it claimed, and nothing about
it was found wrong — it simply was not wanted. So this is not a gap and not outstanding work; it is here only
so the same sketch is not put to them a second time.

If it is ever wanted, the shape was: swap the ripples' start and end scales so a ring begins near the edge of
the box and ends at the source's size, drop the `1 -` from the alpha curve so a ring is faintest at birth and
brightest as it arrives, own slots by clock tick rather than by distance milestone since there is no travel to
measure, and wake the clock on the fade the way the `c` variants do.

### `CardFan`, built and then deleted

Built as an `Exotic` on the user's call and removed after they saw it. Recorded so the same sketch is not put
to them again, and because it left findings worth keeping.

**`CardFan`: "ultra-specific. I would delete the component."** Their verdict. **What it proved is worth more
than the component was**, and is the part to reach for if a hand of overlapping things is ever built again:

- **The card a person is aiming at is not the card under the pointer.** Every card but the last shows only a
  strip, so the topmost rectangle at a point is the wrong answer; the index has to come from where the pointer
  falls along the row. That answer also survives a card being lifted, which changes the overlap.
- **A click handler per card is delivered to whichever box is on top**, so clicking the sliver you can see
  picks the neighbor — the same bug from the other side.
- **Picking from a `PointerTracker` reading fails a tap.** That reading is flushed on an animation frame after
  a `pointermove`, and a tap with no movement before it has nothing to read.
  `InteractionTrackerUtils.trackDrag` reports a ratio on the press itself, which is what a pick should use.

### `DrumCarousel` in `Exotics`, and the cost of splitting the carousels

`Cuboid` went to `Exotics` when it was built, and the user observed that `DrumCarousel` would fit there by the
same test — it turns elements in perspective and is not a composition of `Essentials`. **Their verdict was to
leave it where it is for now**, because moving it alone would put the two carousels in different folders while
they share one shell, one set of props and one page.

What would make this worth revisiting is a reason to separate them that is not about folders — a second drum
consumer, or a shell that stops being shared. Until then the pair stays in `Essentials` together, and the
inconsistency is known rather than overlooked.

### The animation sample collections: what to add instead of more entries

`CellAnimation` and `ScanlineAnimation` take their weights and their keyframes from
`components/src/Samples`, which now holds around sixty entries across two shapes. Two batches of new ones
were built and the user's verdict on most was that they look repetitive; `decisions.md` records why that is
structural — a weight that falls away from a point is always a wipe, a per-cell function ending in place is
always an entrance. So the ideas below are all machinery that recombines the collection rather than extending
it, and each was put to the user as a sketch. Their gradings, in their own terms:

**Rejected.** Two of them, and neither is to be re-proposed without a new argument.

- **The weight driving how far a cell travels rather than when it starts.** Every cell moves at once and a
  heavy one goes further, so a stagger becomes a depth field and any existing animation reads differently
  without being rewritten. It was one of the two the user picked out — dispatch by zone was the other, and is
  built as `fromZones` — and it is the one item here that was settled by building it rather than by argument:
  every cell was given the whole timeline and the weight was spent on how much of the move it made, taken as a
  blend between the animation's settled state and its current one. Their verdict on seeing it run was that it
  does not look good, and the code came out again in full.
- **Composing two animations in sequence inside one cell's own window** — fly in, then settle with a shake.
  Judged interesting in theory and likely too jarring in practice.

**Deferred as knobs rather than entries.** Quantising a weight into bands so a smooth wipe arrives as thick
blocks; jittering a weight so a machined edge becomes ragged; smoothing a weight so cells arrive in loose
clumps. Each applies to all of the weights at once, which is what makes them attractive, and each widens
`WeightOpts` — the user read that as adding behavior to the API rather than extending a collection, which is a
different kind of change from a new dropdown entry and wants deciding on its own terms.

**Deferred as disproportionate.** All judged interesting, none judged worth the code for one effect:

- **Weights read off the source image** — reveal dark before light, or detail before flat, so the order comes
  from the picture and changes with every one. Singled out as the most code for the narrowest payoff: it needs
  a canvas pass over the source before the grid can be weighted at all. The component already allows it, since
  the weights callback belongs to the consumer, who holds the source. The ASCII picture deferred in the fifth
  round of Exotics candidates starts with the same step — the picture shrunk to a grid and each cell's
  brightness read — so whichever is built first gives the other that step.
- **Cells starting in each other's slots and sliding home**, so the picture arrives scrambled and resolves
  rather than assembling out of nothing. Needs each cell to know its partner's slot, which the defs carry.
- **The weight treated as height**, tilting the grid as one object in the perspective the container already
  sets, rather than staggering N independent cells.
- **The root animation moving against the cells** — the whole picture drifting one way while its cells move
  the other. `computeRootAnimation` exists and only the Glitch example on the ScanlineAnimation page uses it.

### Spheres, and the three things the word can mean

Raised by the user: the library has cubes and barrels and no spheres. A cube and a barrel work because their
surfaces are flat pieces the browser can turn in 3D; a sphere has none, so "a sphere" means one of three things.

- **Things placed on a sphere, with the browser doing the 3D.** Items at a latitude and longitude, a painted disk
  behind them, the browser hiding whatever goes round the back. Cheap and made of real elements, but there is nothing
  on the surface between the items, and lines between them cannot be drawn that way. Example: TagCloud.js.
- **A sphere computed by us and drawn flat.** Points, lines along the surface and arcs above it worked out every
  frame and drawn in SVG, the way the zoomable hierarchies draw — which is how D3's parabolic arcs example is made. A
  filled shape on the surface has to be cut exactly at the visible edge, and a picture wrapped round it needs canvas
  or WebGL.
- **A sphere built from many flat faces.** Built as `Die`, which the user wanted for dice first, with a test beside
  it: a d20 split into four up to four times. At 320 faces it froze the user's browser while every die ran fine, so
  this reading does not scale to a sphere, and the test was dropped. It also showed that painted light turns with the
  solid rather than staying put, since a face's shading is worked out once from which way it points. What survived is
  a hundred-sided die, which is as many faces as a die needs.

Whether the first two are wanted is the open question.

**The icon cloud took the solid rather than the sphere.** Magic UI's Icon Cloud is the first reading — items at
points on a sphere — and the user chose instead `Die` with transparent faces and an icon on each, turning freely,
accepting that the number of items is the solid's. The first two readings are still unasked for.

### A fifth round of Exotics candidates, and what became of each

Seven were put to the user from portfolio showcases, each with a published example. The user then went through
three whole catalogues, [Fancy Components](https://www.fancycomponents.dev),
[Made With GSAP](https://madewithgsap.com/effects) and [React Bits](https://reactbits.dev), which yielded more
than the single picks did. What was taken up has been built. The rest:

**Taken up through something else.** The scroll-lit paragraph is `Typewriter` driven from outside.
Codrops' list whose rows bring up a picture that follows the pointer
([Image Reveal Hover Effects](https://tympanus.net/codrops/2018/11/27/image-reveal-hover-effects/)) is already
`Tooltip`, in the user's judgment; only the page's reveal picker came of it.

**Turned down. Do not re-propose any of these without a new argument.**

- **A sticker that peels** when a corner is dragged ([GSAP Vault](https://gsapvault.com/effects/sticker-peel)).
  "Not interested."
- **A morphing pill**, a box changing size and rounding to fit what it holds, as the iPhone's Dynamic Island
  does ([Amelie Schlueter](https://www.amelieschlueter.com/interactions/dynamic-island)). "Just iOS' thingie."
- **A pluckable line**, a divider that bends under the pointer and wobbles back
  ([Fancy Components, Elastic Line](https://www.fancycomponents.dev/docs/components/physics/elastic-line)).
  Never wanted; it reached the list through a misunderstanding.
- **`Cuboid` turning freely**, staying at whatever angle it is let go at rather than settling on a face
  ([Fancy Components, 3D CSS Box](https://www.fancycomponents.dev/docs/components/blocks/css-box)). Left alone by
  the user.

**Deferred, not turned down: an ASCII picture**, an image redrawn live as text characters
([Codrops](https://tympanus.net/codrops/2026/09/04/beyond-the-luminance-ramp-a-shape-aware-ascii-renderer-in-three-js/)).
It shares its first step with _"Weights read off the source image"_ under the animation sample collections.

**What the comparison showed.** Most of Fancy Components is one of this library's components with a different
setting — about twenty of its text components are what `Typewriter` does — and the user's verdict on the whole
was that this library comes out well ahead. React Bits is large and leans on WebGL; what it had beyond that was
mostly reachable with what exists.

**The round went on through [Magic UI](https://magicui.design), [Animata](https://animata.design),
[Aceternity UI](https://ui.aceternity.com), [Motion Primitives](https://motion-primitives.com) and
[Skiper UI](https://skiper-ui.com)**, which is every catalogue it set out to browse. What was taken up from Magic UI
and Skiper UI is numbered. Animata, Aceternity UI and Motion Primitives gave nothing to take: the first had nothing
past what exists, the second is mostly graphics-card spectacle, and the third's dock is kept only as a reference for
how arrangements move. Element pictures, for cutting a live button into pieces, are postponed under item 1 until
browser support exists.

### A fourth round of Exotics candidates, and what became of each

Eight were sketched for the user, each with a published example. **`Sunburst`** and **`CirclePacking`** were
chosen and are built, and the user added **`Icicle`** from D3's gallery on top, which with `Treemap` completes its
zoomable hierarchies; the reasoning that fixed their shape is in `decisions.md`, and nothing about them is
outstanding.

**Not yet looked at.** The user had not seen the other six when the first two were picked, so none of them has a
verdict: **a Sankey diagram**, **a pan-and-zoom surface**, **a piano keyboard**, **an audio waveform**, **a
force-directed graph** and **a crossword**.

### A third round of Exotics candidates, and what became of each

Seven were sketched for the user, each with a published example to look at. **`Treemap`** was chosen and is
built, following D3's zoomable treemap; the reasoning that fixed its shape is in `decisions.md`, and nothing
about it is outstanding.

**Named and not discussed.** The other six have never been argued either way, so none of them is turned down:

- **A word cloud** — words sized by weight, packed around a center without overlapping.
- **A jigsaw** — a picture cut into interlocking pieces that snap together and then move as one group.
- **A picture with pinned markers** — markers at fractions of a picture's size, each opening a popup, which
  have to follow the visible part when the picture is cropped to fill its box.
- **A grid that glides when it changes** — filter or sort a list and every item slides to its new place. The
  user asked whether this is `Mosaic` with a transition on its pieces. Only partly: `Mosaic` does place pieces
  by position, so a transition would make them glide on a resize, but it keeps track of a piece by its place in
  the list rather than by which item it is, so filtering makes the wrong item appear to move, and it picks the
  arrangement itself rather than keeping the consumer's order. The idea is closer to an `Abstract` that gives
  motion to any layout than to a new layout.
- **A physics box** — real elements dropped into a box, falling, stacking and thrown.
- **A drawing pad** — freehand strokes, smoothed, handed back as an SVG path.

### A second round of Exotics candidates, and what became of each

Six were sketched for the user. **`Timeline`** was chosen and is built — items with a start and an end laid
on a window that zooms and moves; the reasoning that fixed its shape is in `decisions.md`, and nothing about
it is outstanding. **A before-and-after comparison slider** was answered by their own suggestion: it is
`SplitPane` with a picture in each pane rather than a component, and the SplitPane page now carries the
example, so nothing is pending there either.

**Turned down. Do not re-propose any of these without a new argument.**

- **A split-flap board**, the airport departure display whose characters flip through the alphabet one card
  at a time. Their verdict: the drum is already a component and this is that drum again, so it would be a
  second way to spell what `Odometer` and `DrumWheel` do. **Reopened by the user** once a hinge counterpart to
  `Barrel` was proposed: on a shared abstract it is a second consumer, not a second mechanism.
- **A magnifying strip**, the macOS dock's swell around the pointer. Their verdict: it already existed as a
  Playground example, so a component would be a second way to spell it. **That example has since gone with the
  `PointerTracker` page**, so the reason as recorded no longer holds — the verdict is still theirs, but it now
  rests on nothing a reader can go and look at.
- **A ticker**, a strip of content looping seamlessly past. Turned down at first because the carousels cover it,
  and reopened by the user once `Wraparound` existed: a marquee is `Wraparound` drifting along one axis.
- **A marquee selection layer**, dragging a rectangle across a board to pick up everything it touches.
  **This one was not turned down on its merits** — "interesting but can't think of a use" — so what it lacks
  is a use rather than an argument, and a real one would reopen it.

### Exotics put up as candidates, and what became of each

Four were sketched for the user. **`PatchBoard`** and **`Trail`** were chosen and are built; the reasoning
that fixed their shape is in `decisions.md`, and nothing about either is outstanding.

**Turned down, so do not re-propose either without a new argument.** **`Minimap`** — a shrunken picture of a
large area with a frame you drag to move the view, its machinery being the two-way sync between the frame and
the area. **`ExplodedView`** — an assembly separating along one axis with label lines that reach each part
without crossing.

**Named and not discussed: `Flipbook`**, a two-page spread that turns with a fold at the spine. The user said
they understood that one from its description, and it was not among the two they picked; it has never been
argued either way. It is now one of the consumers of the hinge counterpart to `Barrel`.
