# Decisions: `Accordion`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Accordion`, `Collapsible`, `Preview`, `Tree`: two-way state is optional

**`expanded` on all four, and `value` on `Tree`, follow the carousels' index and the popups'
visibility**: `SignalMirrorSolidUtils.createOptional` returns the consumer's signal when one is passed and the
component's own when not. Nothing in these four needed the consumer to hold the state, and they were the only
two-way props left required; a navigation tree nobody selects from still had to supply a selection signal. Left
alone, the tree still marks the activated node selected, still makes it the single tab stop and still calls
`onSelectionChange`. The internal signals start closed, collapsed and with nothing selected.

### Controls: `Accordion`, and where auto-height measurement lives

The first component whose geometry cannot be expressed in CSS at all, which decides
the division of labor.

**The height animation is the library's, and that is not a contradiction of "a control paints nothing".**
CSS cannot transition to `auto`, so animating a panel open requires measuring the content and animating to a
pixel value. Measurement is not paint — same category as `Modal`'s alignment and `Label`'s gap — and a
painter cannot do it because the element being constrained is the library's. The painter still owns
everything visible: `renderPanel` receives `getVisibilityTarget` and `getTransitionDurationMs` in `Modal`'s
shape, so a fade or slide inside the panel is the consumer's, layered on a height the library drives.

**Three boxes, each for a reason.** The section wraps a heading and a panel; the panel carries
`overflow: hidden` and the animated height; inside it an unconstrained content div is what gets measured.
Measuring the constrained box would need the height released and restored on every pass — `TextField`'s trick
on an absolutely positioned overlay — and would fight the transition it is feeding.

**`ElementObserverUtils.createBorderBoxHeightObserver` is the extracted half, and `TextField` was deliberately not
migrated onto it.** `backlog.md` asked for the shared piece so the measurement would not be written twice; on
reading both, they share less than that implied — `TextField` clamps to a row count derived from
`line-height`, releases `bottom` to measure a `scrollHeight`, and republishes the result as the wrapper's
`getMinHeight`. What is genuinely common is "observe an element and republish its own height", which is all
the new observer is. Its name follows the coordinate-space rule — border box, layout pixels, so `Viewport`'s
scale never enters.

**The panel stays mounted and goes `inert` rather than being unmounted or hidden.** Unmounting or
`display: none` would make the content unmeasurable and the animation impossible. `inert` takes the subtree
out of the tab order and the accessibility tree while leaving it laid out, as `Popover` does with its root.
The cost is that a collapsed panel's content is still built, so an accordion of a hundred expensive panels
builds all hundred — which `isPanelBuiltOnExpand` now lets a consumer opt out of; see _"A panel built on
first expansion"_, which also corrects what this paragraph implied about the animation.

**"Always exactly one open" is a second boolean, not a third state on the first one.** `isSingleExpand`
allows zero expanded — pressing the open header closes it — and `isExpandRequired` is what refuses that last
close. Two flags rather than a mode string, which is Radix's spelling of the same pair and the shape that
does not break a prop already shipped. It reads on its own terms in either mode: with single expansion it
means the only way out of a section is into another one, and with several open at once it means the last one
standing stays.

**A refused press changes nothing and says nothing.** The header is still a real button, still reports
`aria-expanded="true"`, and is not marked disabled — the same arrangement as pressing the radio that is
already selected, which is also a no-op nobody labels. Marking it disabled would make the one open section
look like the unavailable one, and the parity rule says disabled and disabled-but-reachable must look
identical.

**Headers are all in the tab order, and the arrows are an extra rather than a roving order.** The published
accordion pattern, and the opposite of `Tabs` and `RadioGroup`. The difference is what the collection means: a
tab list or radio group is one control with several states, so it gets one stop; an accordion is several
independent disclosures. Arrow, `Home` and `End` come from `NavigatorUtils.computeNextPosition` unchanged,
moving focus without selecting.

**Each header is wrapped in a real heading element, and its level is a prop.** `getHeadingLevel` defaults to
3 and picks `h1`..`h6` from a fixed list rather than building a tag name, so it stays typed. The level is
document structure, which only the consumer knows; the library owning it would either invent an outline or
force `role="heading"` with `aria-level`, and a real element is better for both AT and outline. The heading
gets `margin: 0; font: inherit` — a reset in the same category as `interactionRoot > * { margin: 0
!important }`, not paint.

**`getSizing` defaults to `"fill"`, following `Progress` rather than `InteractionWrapper`.** Found by driving
it: with the root shrink-wrapping its content, opening one section changed the widest section and re-wrapped
the text in every other one. An accordion's natural width is its container's. The type is declared on
`Accordion` rather than imported, for `Progress`'s reason.

**The header leaf must re-enable pointer events, and forgetting to is invisible to types.** The first
`Accordion.css.ts` did not, so a header looked perfect and could not be clicked — the hit test landed on the
heading above it. `Button.css.ts` and `BinarySwitch.css.ts` are the precedent. Nothing in the type system or
in a DOM assertion catches it; only a real click does.

**Scrolling a newly opened section into view is `Collapsible`'s, and it is opt-in.** `getIsScrolledIntoViewOnExpand`
defaults to off; `Accordion` passes it straight through, since the section that opened is a disclosure rather
than anything the set knows about. Off by default because the library cannot tell whether the disclosure **is**
the page — where taking the scroll position is a kindness — or one widget in a column beside other content,
where taking it steals the reader's place in something they were not touching. The consumer is the only one who
knows which, and the expensive half, knowing when the growing has stopped, stays library-side either way.
Nothing published ships it on: it is an open request against Base UI and MUI, and `backlog.md` recorded the
recipe everyone agrees on.

**It waits for the growth to finish, because the panel's size is what it has to aim at.** Scrolling when the
click lands would aim at a panel still at zero height and leave the page in the wrong place. `ElementFader`
already exposes `getHasTransitionFinished` beside its target — the completion signal `backlog.md` assumed did
not exist — so the wait is a latch armed when the section expands and read when the fader reports the
transition over. The latch is `on(..., { defer: true })`, so a section that starts life expanded does not
scroll the page as the app loads.

**Two calls, and each answers a different failure.** `scrollIntoView({ block: "nearest" })` on the whole
section brings it up by the smallest amount that shows it, and does nothing at all when it is already visible;
the same call on the **header** immediately afterwards is the clamp for a panel with more in it than the
window can hold, where reaching the panel's far edge would push the header that was just pressed off the top.
The second call gives back the least amount that puts the header back, so the panel is cut at the bottom
instead. Chromium's own reading of `"nearest"` happens to keep the header for that case already, but the
behavior is stated rather than inherited from one engine's reading.

**And each call happens twice, once on the finish and once on the frame after it.** The fader's completion is
a timer started a frame before the CSS transition does, so it can report "over" while the last few pixels of
growth are still to paint; scrolling on that frame alone lands a few pixels short. A second pass on the next
frame corrects it. It is not a frame **instead** of the immediate call: a frame may be a long time coming on a
loaded machine, and the suite failed exactly that way while the whole of it ran at once.

### `Accordion` in a row: `orientation`, and which way the open section moved

Asked for by the user from Made With GSAP's two-way accordion panels: a row of panels, one open and the rest narrow
strips with a rotated label, the opening panel's content sliding in from the side the person came from.

**`orientation` is the library's axis word** (`conventions.md`), defaulting to `vertical`. A row lays the sections
out with `flex-direction: row` and gives every section's `Collapsible` `side: "right"`, so the panel opens beside its
header and animates its width. A section in a row sizes its one grid column to its content, overriding the
`Collapsible` root's `minmax(0, 1fr)`: with no floor from its content, every section came out the same width and the
open panel was cut off. The backlog expected the height observer to need a twin for width; it did not,
because `Collapsible` already measured the content's border box on both axes and animated whichever its side named,
for its own sideways example — so the row is a layout and a side, not new measuring. The arrows that walk the
headers follow the orientation through `NavigatorUtils.computeNextPosition`, and a row reads the text's direction so
right-to-left reverses left and right, as `Tabs` does.

**Which way the open section moved is handed to `renderPanel` as a fourth argument, `getMoveDirection`**, beside the
visibility target it already took: `forward` when a section later in the list opened than the one left, `backward`
when earlier, `undefined` before anything has moved. Order rather than screen side, so it means the same in a column,
in a row, and under right-to-left text. It is worked out from the open set changing — `AccordionUtils.computeMoveDirection`
compares the section that opened with the one that closed, or with the nearest open one when nothing closed — in an
effect on the state, so a consumer opening a section from outside gets the same answer as a click. The motion stays
the consumer's; the Playground's row example slides the entering content in from that side.

**"Always one open" is `isSingleExpand` with `isExpandRequired`**, both already there, and the rotated strip label is
the example's own painting rather than anything the component draws.

### `Accordion` in a row: an open width per item

From Skiper UI's expanding panels, where each panel opens to a width of its own. A panel's content cannot give that
width, since text wraps to whatever width it is handed — the user's point — so **the width is a property of one item,
`openWidthShare`, beside `isDisabled` on the item record.** It is a share of the accordion's own width, header strip
included, so it holds when the window is resized; an open item without one splits what the closed strips, the gaps and
the shared items leave. Shares that ask for more than the row has are scaled down together until they fit.

**It needs a row with a width of its own, so it is read only under `orientation: "horizontal"` with `sizing:
"fill"`.** A row sized to its content would be asking its panels how wide to be while they asked it; a column grows
its panels in height. Everywhere else a panel is as wide as its content, as before, so `sizing` keeps its one job of
deciding whether the whole accordion fills its container.

**The accordion measures, and the panel is told.** `AccordionUtils.computeOpenWidths` takes the items, the open set,
the row's width, each header strip's width and the gap, and answers a panel width per item; each framework measures
the row and the strips with the border-box observers. A section in a row wraps its panel's content in a box of that
width (`accordionPanelSizer`), and `Collapsible` — which already animates a sideways panel to its content's measured
width — animates to it, so `Collapsible` learned nothing. A closed item keeps the width it last had, so its text does
not reflow while it folds away.

**A section in a row is now as wide as its strip and its panel, whatever `sizing` says.** Each section's `Collapsible`
used to take its default `sizing: "fill"`, which a row sized to its content never showed, and which spread four closed
strips evenly across a row that fills its box. A section in a row now asks for `fit-content`; a column is unchanged.

### A panel built on first expansion, and why the animation survives it

Settled with the user, on their call between keeping a lazily built panel afterwards and unmounting it again
on close. **`isPanelBuiltOnExpand` withholds `renderPanel`'s output until the first expansion and keeps it
from then on**, so a section nobody opens costs nothing and a section opened once keeps whatever is inside
it. It lives on `Collapsible`, so `Accordion` passes it through and both get one behavior.

**Discarding state was the whole of the argument against unmounting on close.** The alternative — track what
is open right now — is the smaller footprint, and it silently throws away a half-filled form, a scroll
position, a part-written comment, every time a section closes. A saving nobody asked for cannot be worth a
loss nobody was warned about. What is left of the cost is honest and stated: open all hundred sections and
all hundred are built.

**The recorded reason against building this at all was wrong, and the correction is the interesting part.**
`backlog.md` held that withholding the panel would cost the animation on that first expansion, "since there
would be nothing to measure yet" — which assumes the measuring and the opening happen at the same instant.
They do not. `ElementFaderUtils.setTarget` already defers the flip of `transitionTarget` to a `requestAnimationFrame`,
with the timer fallback recorded above, precisely so the browser paints a start value before a transition
begins. **That deferral is a gap, and the measurement lands inside it.**

In order: the press writes `expanded`; in the same update the latch memo turns true and the content
mounts inside a panel box still at `height: 0`; still in that update the height observer re-runs and reads
`offsetHeight` synchronously; a frame later the fader flips the target and the height animates from zero to
the number already published. Driven in `accordion.spec.ts`, which asserts that the height read immediately
after the press is above zero and below where it ends up — a gradual growth rather than a jump, without
pinning a pixel.

**The latch is a `createMemo` carrying its own previous value, not an effect.** `Toasts` has the same shape
for holding the last known record. A memo settles during the update phase, ahead of the render effect that
mounts the content, where an effect would run after it and cost an extra pass; and it cannot be got into a
state where the content is mounted but the latch says otherwise.

**The measurement is gated on the latch rather than on the ref.** `createBorderBoxHeightObserver` takes the
latch's inverse as its `getIsDisabled` — `Collapsible` passes `() => !getHasPanelContent()`, since every
observer in `ElementObserver` is switched off by a disabled flag rather than on by an enabled one — so the flip
re-runs the observer's effect and its synchronous
`offsetWidth`/`offsetHeight` read is what publishes the first height — the `ResizeObserver` alone would not
do, because the content wrapper is mounted from the start and only its children change, and a resize
observation is broadcast _after_ animation-frame callbacks in the same frame. It would arrive a beat late,
after the fader had already flipped against a height of zero.

**What is unchanged is the default.** With the prop off, the panel is built and mounted exactly as before —
`inert` at zero height, measurable, animatable — because that is what a consumer with four sections wants and
they should not have to ask for it. The prop is for the accordion with a hundred expensive panels, which is
the case `backlog.md` had recorded as the unpaid cost.
