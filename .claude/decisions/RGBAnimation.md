# Decisions: `RGBAnimation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `RGBAnimation`: `CellAnimation` by channel instead of by cell

It began as `RGBSplitter`, a pointer effect asked for by the user that split an element into its red, green and blue as
the pointer neared its center. They then moved it out of `PointerEffects` into a looping animation, and finally gave
it the shape of its siblings: `CellAnimation` animates cells, `ScanlineAnimation` lines, and this animates channels —
`computeSliceAnimation(defs, timeline)` returns the same transform-and-filter values, so a channel moving, scaling,
turning, fading or changing hue is the consumer's function and nothing in the library is specific to splitting. The
rename to `RGBAnimation` was theirs, since a channel that only fades is not a split.

**It takes a picture, `src`, for parity with its siblings** — the user's choice once it was clear the siblings do not
take live content either: a picture's address, a drawn SVG serialized into one (the _Swell_ headline, as
`CellAnimation`'s gradient examples do), `ariaLabel` and `sizeAnchor` as `CellAnimation` has them. The alternative
was any content rendered three times; it was turned down because the content would run three times over (its own
animations, video, effects), any `id` inside would appear three times and break what referred to it, and Solid can
only render a child three times if it is a function. What it gave up is what `RGBSplitter` did beyond its siblings:
live text and markup.

**Three stacked copies, not one SVG filter, because SVG filters cannot scale or turn.** The Filter Effects primitives
([W3C](https://www.w3.org/TR/filter-effects-1/)) move pixels only by offset or displacement map. So each channel is a
full-size copy of the picture, filtered down to its channel by `feColorMatrix`
(`SVGFilterDefsUtils.computeRGBSplitMatrix`, shared with the builder's split step), animated with ordinary CSS on the
element around it, and blended back with `mix-blend-mode` inside an isolated container. At rest the three blend back
into the picture exactly. **The container does not clip**: what drifts past the picture spills past its box, which is
the rule for anything that moves at rest-size.

**It runs on `SliceAnimationUtils.runPasses` and takes `CellAnimation`'s timing props by their names**, with `playback`
and `progress` as two-way values exactly as `CellAnimation` has them, and `computeRootAnimation` for the whole
picture. Its defaults in `RGB_ANIMATION_DEFAULTS` are round guesses, not measured, and differ from `CellAnimation`'s
on purpose: a glitch wants a short pass and a long rest. Once every pass is done, each channel stays as last drawn.

**WCAG 2.2.2 Pause, Stop, Hide applies**: the motion starts by itself, loops for longer than five seconds by default
and sits beside other content. `playback` is the mechanism, wired by the consumer, as for `CellAnimation`; the
Playground puts a play/pause scrubber under each example, each with its own `playback` and `progress`, since two
animations sharing one `progress` would each advance it and run the pass at double speed. 2.3.1 _Three Flashes_ is
the consumer's to keep through their own animation.

**`color-scheme` is read only once the root is in the page.** Solid hands a `ref` the element before it is
attached, and a detached element computes `color-scheme` as nothing, which reads as light: a dark page's first pass
blended subtractively until the next pass read it again. Solid reads it after `onMount`; React in a layout effect,
Vue in `watchAfterRender` and Svelte in an `$effect` already run after attachment. `rgbAnimation.spec.ts` pins it on
a dark page.

**`colorMixing` exists because a copy cannot see the ground behind it.** Where one copy has drifted away from the
other two, the blend has to invent the missing channels. Screening copies that hold one channel on black invents
zeros: red, green and blue fringes, right on a dark ground and dark smudges on a light one. Multiplying copies that
hold one channel on white invents ones: cyan, magenta and yellow fringes, right on a light ground and pale glows on a
dark one. Found by rendering the first `RGBSplitter`, which only screened, on a white page. The user named the values
`"additive"` and `"subtractive"` over `"light"` / `"pigment"` and `"RGB"` / `"CMY"`.

**Left out, the mixing follows `color-scheme`, as a smarter baseline than a fixed default.** The user's call, with the
prop still there to override it: `dark` is additive, `light` subtractive, `light dark` follows the system setting
through `prefers-color-scheme`, and `normal` — what a page that sets nothing has — is subtractive, because the browser
then draws its default light colors. The system setting is read only where the page itself declared it follows it, so
this does not cut across the reduced-motion entry's rule that the library leaves preferences to the consumer. The
computed value is the declared one, not the resolved one, which is why `light dark` needs the media query at all
([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)). It is read at the start of each pass, through
`RGBAnimationUtils.readColorMixing`, because nothing announces a change to `color-scheme`, and a theme switched
mid-pass is then picked up by the next one. Its cost is a dark site that never
declares `color-scheme` getting the light-ground look — the case the prop is for.

**The page's examples start and end each pass with the picture whole.** A channel holds its last frame through the
rest between passes, so an effect still mid-way at the end of its pass would freeze there; every example's function
returns to rest at both ends (an envelope, a staggered window, or a whole number of turns). **Which picture they show is
one global Source knob** (`knight` or `text`), the user's call over a knob per example; the box takes the chosen
picture's width from `SOURCE_WIDTHS`.

**Examples tried and dropped by the user, so not to be offered again**: a channel fading out in turn (Channel drop), a
random per-channel brightness stutter (Flicker — capped at three changes a second for WCAG 2.3.1, and too tame at the
page's pass length), a fast per-channel zoom (Punch — read as Swell), a per-axis stretch (Stretch) and a split-flap flip
over the horizontal axis (Flip). A per-channel slant (Wobble) was offered and not taken.

**Hue swap holds a different channel still each pass** — the user's design. CSS `hue-rotate()` is the fixed matrix in
Filter Effects 1 (`feColorMatrix` `hueRotate`), weighted toward green for brightness, so a pure red or blue copy turned
part-way becomes a dim green and loses what is clipped below zero, while a turned green stays bright. Holding green still
every pass made the whole picture green; rotating which channel is held spreads that over three passes of unequal
strength (a strong green pass, a moderate magenta one, a nearly still one), which the user accepted as variety.
