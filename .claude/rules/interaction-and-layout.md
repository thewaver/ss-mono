---
paths:
    - "components/src/**"
    - "components-solid/src/**"
    - "components-react/src/**"
    - "components-vue/src/**"
    - "components-svelte/src/**"
    - "playground/src/**"
    - "playground-solid/src/**"
    - "playground-react/src/**"
    - "playground-vue/src/**"
    - "playground-svelte/src/**"
---

# Conventions: pointer, focus and layout

How a control responds to a pointer or keyboard, handles focus, and measures and places things. The library-wide rules are in `conventions.md`.

### A rotation and a centering offset on one element have to be ordered, or the element leaves its point

A transform list applies right to left, so `translate(x, y) rotate(a) translate(-50%, -50%)` rotates the
centering shift along with the element and leaves it half its own size off the point, in whatever direction it
faces. Write `translate(x, y) translate(-50%, -50%) rotate(a)`. It looks right at nought degrees and on any square
element, which is why it survives review; an oblong shows it.

### A component that turns in 3D takes the room of its content at rest, and a turn spills past it

The user's rule. Something turning under perspective is drawn larger on its near side part-way through a turn, so
it reaches past its own box; that spill is allowed. **What the box is sized to is the content at rest**, and room set
aside only for the bulge of a turn stands empty whenever nothing moves. A solid that shows several faces at rest — a
drum of three faces or more, a die — is sized to that silhouette, since it is content at rest. Where which face rests
in front varies, the faces the box is sized for are decided once rather than followed (a cuboid is sized to its front
face), so the page never moves as it turns.

### `isFocused` is focus and `isFocusVisible` is the ring

Both reach every painter, and confusing them rings a control somebody clicked.

- **`isFocused`** — does this hold focus. What a text field wants: clicked into, it has a caret and should look it.
- **`isFocusVisible`** — should focus be advertised, and it is the browser's answer: `wrapElement` reads
  `element.matches(":focus-visible")` on `focus` and on `keydown` (a pointer-focused control becomes
  focus-visible once somebody types), and clears it on `blur`. Nothing reimplements the heuristic; the browser
  already keeps the keyboard verdict across a roving widget's programmatic `.focus()`.

**A ring, outline or halo reads `isFocusVisible`; anything else about being focused reads `isFocused`** — the
user's call, applied to every painter.

**A control that focuses something itself must check what the browser then says.** A programmatic `.focus()`
inherits the last input modality, which is right for arrow keys and wrong for a drag: `ColorArea` focuses an axis
from its drag handler after `preventDefault()`, the browser cannot see the pointer and reports focus-visible, so
the component suppresses it while dragging.

**Where real focus is on a descendant, the component publishes its own focus-visible state**, named for it
(`focusVisibleThumb`, `focusVisibleAxis`) and re-read on `keydown` — a prop saying "focused" and meaning
"focus-visible" is the confusion this entry exists to prevent.

**Not gated on disabled.** `isHovered` and `isActive` are forced false while disabled; focus is not, because a
disabled item that is still reachable must keep its ring or focus lands somewhere invisible.

### An accessibility mistake the library can detect is warned about, never blocked or filled in

The user's rule, in two parts. **The library always ships the accessible way**: for every affordance a criterion
needs there is a builtin that gets it right with nothing from the consumer but where to put it and how it looks.
**When a consumer's choice leaves a control failing a criterion and the library can tell, it warns loudly in
development**, naming what is missing — it does not refuse to render and does not draw a fallback. The consumer
owns the product and may decide looks outweigh a criterion, as they can by hiding a focus ring; the library makes
sure that is never decided by accident. **No option silences the warning.** A fallback is also refused because
placing it is exactly the layout decision the slot existed to hand over.

### Moving a focused element in the document drops its focus, so put it back

Moving a node — `insertBefore`, `append` — removes it first, and removing the focused element sends focus to the
body; the next key goes nowhere. **A component that reorders its own children notes which holds focus and focuses
it again afterwards**, with `preventScroll`.

### A box that scrolls with nothing focusable inside is itself focusable while it overflows

WCAG 2.1.1: a keyboard user scrolls a box by focusing something in it, and a box of only text and images has
nothing to focus. Copying recent Chrome's rule: **while it overflows and holds nothing focusable, it takes
`tabindex="0"`**, kept current by observing both conditions. **It takes `role="region"` only when it has a name**,
since a region requires one.

### A subtree is disabled with `inert`, not `pointer-events: none`

`pointer-events: none` is inherited, so any descendant that sets the property itself takes presses again, and it
leaves focus and the accessibility tree untouched. **`inert` disables the subtree for pointer, focus and the
accessibility tree whatever its descendants declare** — use it for anything present but not operable right now.

### Text meant only for screen readers is transparent or visually hidden, never `visibility: hidden` or `display: none`

Those two remove the element from the accessibility tree too. Text that must be heard and not seen is either
`color: transparent` (in layout and tree) or the visually-hidden pattern (a one-pixel clipped box out of the flow,
in the tree only). What is drawn over it carries `aria-hidden="true"`, so the two are not read together.

### An item is revealed by scrolling only the scrollers between it and its container, never with `scrollIntoView`

`scrollIntoView` scrolls every scrollable ancestor, the document and `overflow: hidden` containers included — so
revealing a row of an unpositioned popup jumps the page. **Walk from the item up to the container that owns it,
scrolling each scroller by the least that shows the item, and stop there**, in each scroller's layout pixels so a
scaled ancestor does not skew it. The exception is an item that holds focus among scrollers the component does not
own: there `scrollIntoView` does what the platform would have done had focus not used `preventScroll`.

### A pointer gesture swallows the click that ends a drag, and takes pointer capture only past a small movement

Press, move and release is still a `click`, so a drag ends by also doing what a tap does. **Swallow exactly one click
after a gesture that moved**, with a capture-phase `click` listener on the gesture's root. **Take pointer capture
only past a few pixels of movement**: capture on `pointerdown` would send every click to the capturing element, so a
plain press would never reach its target.

### A hover the pointer did not cause is ignored

The browser fires a fresh `mouseenter`/`mouseover` whenever the layout moves under a resting pointer — a popup
opening, a list scrolling — so a control acting on enters moves its highlight or opens a submenu by itself. **A hover
counts only from `pointermove`**, which a still pointer never sends. (Comparing an enter's point with the last move
fails for slow movement, since enters report whole pixels; `movementX` reads zero either way.) The item a popup
opens on top of still sees the smallest twitch as movement, so where that matters it ignores the pointer until it
has left and come back, as a desktop context menu does (`MenuUtils.createOpeningHoverGuard`).

### The 1D walk is a pure function, not a hook

`NavigatorUtils.computeNextPosition(key, from, length, opts)` takes positions and returns one, knowing nothing
about what is walked, because every control already owns its cursor, each differently (`RadioGroup` starts from
`document.activeElement`). `orientation` chooses which arrows step and defaults to `"vertical"`, the narrowest —
**when unsure, a default does less**, since one that steals `ArrowLeft` from a text field breaks something nobody
asked about. `hasEdgeKeys` gates `Home`/`End`. The abstract answers _which position is next_; the control answers
_whether to go there_. A second axis arrives as a sibling function, not a mode.

**A factory is right when the state it would own belongs to nobody else.** A walker's cursor is already held by every
consumer, so a factory would be a second copy; `SelectionUtils.create` passes because the anchor a shifted pick
measures from lives in no consumer's data. **Transient state is held as the thing, not its position**: an anchor
kept as an index silently addresses whatever arrives at that index after a sort or filter; kept as the item and
resolved with `indexOf`, it moves with its row and resolves to nothing once the row is gone.

### What a component reports runs at its own rate, never at the gesture's

The user's rule. A control driven by a continuous gesture has two jobs — change the thing, and tell the consumer
what it now is — and the second is rarely wanted at the first's rate. **Throttle the report, don't debounce it**: a
debounce waits for a pause the person may never make; a throttle reports at once, then at a bounded rate, with a
trailing call so the final value lands. Anything watching the report inherits the delay, so check it before choosing
the interval. A value derived from accumulated state is measured on a clock the input cannot move.

### An element positioned from a measurement is kept out of the layout the measurement reads

A marker placed by measuring its neighbors must not move them: in the flow, it pushes them, the next measurement
moves it, and it oscillates. The same loop forms when an element moves the box its own reading comes from. **Position
it out of the flow** (`position: absolute`, offset from the measured rects), **or measure something it cannot move**
— the layout at rest, or a still container rather than the element transformed inside it.

### A mask changes what is painted, not what can be clicked

Hit testing ignores `mask`, so a masked hole still swallows clicks; `clip-path` removes the clipped region from hit
testing. **A layer letting presses through a hole uses `clip-path`**, or pairs a masked painted layer carrying
`pointer-events: none` with a transparent layer clipped to the same hole.

### A data URI in a CSS `url()` is quoted

An unquoted `url(…)` cannot hold an unescaped parenthesis, and an SVG data URI almost always has one (`hsl(…)`,
`url(#id)`) that `encodeURIComponent` leaves alone; the browser drops the declaration silently. **Write `url("…")`**
with the value's own double quotes encoded.

### A measured rect and a written offset are in different spaces inside a `Viewport`

`getBoundingClientRect` is on-screen; an inline `top`/`left` is layout. Inside a `Viewport` they differ by its scale,
which is 1 whenever the window matches the design size — and always in a default headless browser, so a spec passes
while the code is misplaced on every real machine. **Divide by `viewportContext.getScale()` on the way from a
measurement to a written offset, or measure in layout space** (`offsetWidth`, `offsetTop`,
`ViewportUtils.getAdjustedBoundingClientRect`). Never convert a measurement compared against the pointer's own
coordinates: `clientX` and a client rect are both on-screen. `ElementObserver`, `Anchor`, `Range`, `Scroller`,
`SlideButton`, the drum and `Sortable` each record their instance of this.

**The user widened it for specs**: wherever the test environment differs from a real one in a way the code depends
on — scale, timezone, locale, screen size, input device — the spec forces the real-world condition, because the
default is exactly where the bug cannot show.
