# Decisions: `Wraparound`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Wraparound`: one real copy that moves to wherever it is needed

Built from `backlog.md`'s decided item. The core is `WraparoundUtils` (`createPlane` plus the pure geometry it
uses); each framework draws the tiles from the plane's store.

**The content is drawn once for real and as inert copies everywhere else.** The grid's cell is the content's own
border box, measured; the window is the region. One offset moves a plane holding every tile, and the cells drawn
are whichever intersect the window, plus the original's wherever it is — so the original is never unmounted, and
whatever state it holds survives any amount of movement. Copies carry `inert` and `aria-hidden`, which is what
keeps them out of Tab and out of a screen reader, and they are keyed by their cell so a copy is only built when its
cell comes into view.

**Every visible cell keeps a copy, the original's included, and the one under the original is hidden.** The first
build left the original's cell without a copy, so moving the original under the pointer threw one copy away and built
another where the original had been; a copy built fresh needs a frame to draw, and shaking the pointer made tiles
blink. `computeTiles` now returns every cell in view, and the copy sharing the original's cell is `visibility:
hidden`, so a move changes which copy is hidden rather than which copies exist.

**The original is not tied to a cell, and that is the whole keyboard and pointer story.** Every cell looks the
same, so handing the original to another cell changes nothing on screen. Three things use that:

- **Hover.** While a mouse moves over the window, the original moves to the cell under it, so hover styling and
  clicks land on real elements. It does not do this while something inside the original shows a focus ring, since
  that would carry the ring off screen under a keyboard user's eyes.
- **A tap on a copy.** A press always moves the original under the pointer first; a tap that began on a copy
  (which, being inert, was never the event's target) then clicks the element now under the pointer, which is the
  matching real one. This is what makes touch work, where there is no hover.
- **Focus.** Tabbing to an item, or an inner control walking its own focus (a `Mosaic` does), brings the item into
  view: the original moves to whichever neighboring cell needs the least movement, then the plane glides just far
  enough. An item already wholly in view keeps its cell, so a focus ring never jumps from one tile to another. A
  focus that arrives from a press does not glide, since the pointer is already where the user is looking.

**The window is a region the keys move.** `role="region"` with a required `ariaLabel` and `tabindex="0"`, because
a moving area that only the pointer can move fails 2.1.1. With the window itself focused, the arrows move it the
way a scrolled page moves (the right arrow shows more of what is to the right), the page keys by most of its
height, and `Home` back to a tile's corner on the window's. Keys inside the content are left to the content.

**Motion.** A drag past a few pixels captures the pointer and suppresses the click it would end in; on release the
plane coasts on its speed just before release, decaying exponentially with `momentumMs` as the time constant, summed
exactly rather than per frame so the coast is the same on any frame rate. The wheel moves it without easing and
takes the scroll with it, which is the cost of a wheel route on something with no end. Keys and focus glide over
`glideDurationMs`. Both durations at `0` are the reduced-motion route, as elsewhere in the library: the component
reads no preference itself.

**Text entry is left alone.** A press on an input, textarea, select or editable element does not start a drag,
since dragging from one would take away selecting its text.

**Copies are capped (`maxCopies`, 400).** Content tiny next to its window would otherwise ask for thousands; past
the cap the far side is left uncovered.

**The content has to have a size of its own.** Each tile is `width: max-content`, so an arrangement that takes its
width from its parent — a `Mosaic` anchored by width — is given one by the consumer, as the Playground does. The
gap the arrangement leaves at its edges shows at every join; the Playground's mosaic pads its tile by half the
mosaic's gap so the joins match the gaps inside. `ImageMosaic`'s free side comes out flat, since every row is
scaled to fill the width exactly, which is why it is the showcase.

### `Wraparound`: it drifts by itself, and one switch turns off moving it by hand

A marquee is `Wraparound` moving by itself along one axis, so `Wraparound` gained a drift rather than a `Marquee` preset whose only difference would have been its defaults; the Playground's example is called "Marquee" so someone looking for the word finds it.

**The drift is the plane's, so the four frameworks share it.** `WraparoundUtils.computeDriftVelocity` turns `driftPxPerSecond` and `driftDegrees` into pixels per millisecond, and the plane's `setDrift` sets it going. The angle runs the way the screen's axes do: `0` moves the content right, `90` down, `180` (the default) left. Each frame moves the offset by the velocity times the time since the last frame, so the strip covers the same ground on any frame rate. Each view calls `setDrift` with nothing while `playback` is false, while the hold is on, or while the window is disabled, and stopping resets the clock so a drift that resumes does not make up the time it spent stopped.

**The drift gives way to everything a person does, and carries on from where they left it.** A press stops it from pointer-down to pointer-up, and a glide or a coast stops it while they run; after each it picks up from wherever the content now sits. It pauses under the pointer, under focus and while the page is hidden through `InteractionTrackerUtils.trackHold`, the same hold the carousels and `Toasts` call — which is also what keeps the original tile under the cursor long enough to be clicked.

**`isMovable` turns off dragging, the wheel and the keys together.** The user's call, over turning off dragging alone: a marquee that kept the wheel would catch the page's scrolling whenever the pointer passed over it, because the wheel route calls `preventDefault` to move the content. With `isMovable` off, the wheel returns before that, a press never becomes a drag, the arrow, page and `Home` keys are ignored, and `touch-action` returns to `auto` so a touch scrolls the page too. Hover handing the original to the tile under the pointer, a tap on a copy clicking the real item, and a focused item being brought into view all stay on, since none of them is a person moving the content.

**With hand moving off, the window is no longer a tab stop.** Checked 2.1.1 Keyboard, "All functionality of the content is operable through a keyboard interface": the window took focus only so its keys could move the content, so once moving by hand is off for every input a focused window would do nothing. Focusable content inside is still reached by Tab, and focus inside it is still a hold. The window keeps `role="region"` and its required name.

**The pause WCAG asks for is `playback`, and the library does not warn when it is missing.** Checked 2.2.2 Pause, Stop, Hide: a drift is moving content that starts automatically and lasts more than five seconds, so it needs a mechanism to pause it. The hold is not that mechanism, since it lasts only while the pointer or focus stays; `playback` wired to a control the user can reach is. Whether a consumer drew that control is something the component cannot see, so unlike _"An accessibility mistake the library can detect is warned about"_ there is no development warning; the prop docs say what is owed, and the Playground's Marquee carries a Play/Pause button. Reduced motion is the consumer's call: a speed of `0`, which the Playground passes under the media query.

**The offset is left to grow while drifting.** Bringing it back near zero would hand the original and every copy to different cells and rebuild every copy, which is the blinking the first build was corrected for. A strip drifting at tens of pixels a second takes hours to reach offsets where pixel precision starts to slip.
