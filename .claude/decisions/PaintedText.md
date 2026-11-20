# Decisions: `PaintedText`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `PaintedText`: along a path, set by the browser and slid by `progress`

From Magic UI's Spinning Text, text set round a circle and turning. **`PaintedText` takes a `path`, the user's pick over letters riding `Trail`.** SVG already lays text along any path with `<textPath>`, and `PaintedText` is SVG, so the browser places every letter, kerning stays right, and every kind of paint works as it does on lines. A circle is one helper away, `PaintedTextUtils.computeCirclePath`, which starts at the top and runs clockwise so the letters stand on the outside.

**On a path there is one line, and the line machinery stands idle.** Nothing wraps, line breaks are left out, and whole elements are not drawn, since SVG cannot place an image in a `<textPath>`; a console warning names what was left out. Letters never push each other along on a path: `ProximityText`'s letters swell where they sit.

**The path is in pixels and drawn as written, and the box is the path's own box grown by how far the letters reach.** The core measures each letter's height above and below its baseline and grows every side of the path's box by the larger, since which side the letters' tops point to changes round a curve. The drawing's coordinates start at that box's corner, reported as `origin`, and the paint area, the mask and the boxes reported to a wrapper are measured from it.

**Turning is the text sliding along its path, through `progress` and `playback`**, in the shape `Trail` and `Typewriter` use, with `lapDurationMs` for one lap and `TrailUtils.run` as the clock. **`playback` is off unless asked for, unlike `Trail`'s**: text on a path is a layout first, so adding a path does not set anything moving. The slide always loops.

**Text that slides past the end comes round from the start because the path it is set on is the consumer's path traced twice**, `PaintedTextUtils.computeLapPath`, and every layer is drawn once along it. The second lap is the same line on the page, so a letter passing the end of the first carries straight on along the second. The first build drew every layer twice instead, the second copy one path length behind; the browser draws a letter only while its middle is on the path, and at the seam between the two copies there was a pixel or so neither copy counted as on, so a letter crossing it vanished for a frame. On an open path the jump back between laps sends the text in at the near end as it leaves at the far one, which reads as a ticker; a text longer than one lap overlaps itself.

**`isFittedToPath` stretches or squeezes the spacing so the text runs the path's whole length once**, through `textLength` and `lengthAdjust="spacing"` on the `<text>` (Solid's types do not offer it on `<textPath>`). On a closed path the text's end meets its own start, so a trailing space or separator is asked for in the docs.

**The spacing is read from the browser by laying the same text along a straight line**: a hidden SVG in the layout host sets the runs on a `<textPath>` along a long straight track with the same `textLength`, and each letter's distance and advance are read back, so a wrapper's letters are placed by the browser's own spacing.

**`Typewriter` and `ProximityText` still drive the letters.** `placeAlongPath` puts each letter where `<textPath>` would — the middle of its advance on the path, turned to the path's direction there — as a `<text>` inside a group carrying the place and the turn, so a wrapper's keyframes still scale and slide it about its own center. While the text slides the letters move every frame and the reported boxes move with them. The caret turns to stand on the letter beside it and is rebuilt on every move, so it does not blink while the text slides. No Playground example drives a path text with `Typewriter` or `ProximityText` yet.

**Checked 2.2.2 Pause, Stop, Hide**: the Playground's circle and wave both start moving, so each has a Pause/Play button writing `playback`; under reduced motion the page starts both stopped, and the component never reads the media query.

### `PaintedText`: SVG text, wrapped by `Typewriter`'s utility and placed by the browser

**The text is SVG `<text>`, because CSS can only paint HTML text with an image.** `background-clip: text` takes a
`background-image`, so a def would have to be serialized first, the way `SVGDefsSources` does it: SMIL samples keep
moving inside a data URI, but pointer-tracked samples freeze on their resting frame, and a hollow stroke cannot be
had at all — the known trick paints the inside of the letters in the page's background color. `-moz-element()`
would let a live element be a background, and it is Firefox only. Masking the paint by the text instead does not
help either: the mask has to hold SVG `<text>` anyway. So the letters are SVG, painted by `fill` and `stroke`
exactly as `Shape` paints its path, and every sample works, timed, tracked and patterned.

**Line breaks come from `JSXTextParserUtils.getInlinedSegments`, which is `Typewriter`'s.** SVG 2's `inline-size`
wraps in no browser, and Chromium's request for it has been open since 2014. The user named `Typewriter` the
baseline: **where something can be improved for both, `Typewriter` moves to the better approach with it**, and that
rule is why several changes below landed in `Typewriter` and in `ss-utils` as well.

**Positions are read from the browser, not computed.** The core lays the wrapped segments out as HTML — the same
spans and `<br>`s `Typewriter` draws — in a layout host that stays in the flow, invisible, and gives the component
its height. Each run's left edge is its span's box, and its baseline is the top of a zero-sized inline block placed
inside it, since such a block sits exactly on the line's baseline. Vertical alignment, line height and text
alignment are therefore the browser's own, and none of it is reimplemented. The host is built by the core with
plain DOM calls rather than by each framework, because it is invisible scaffolding and building it four times would
only add places for the four to disagree.

**Every rect is divided by the page's scale before it becomes a coordinate.** `getBoundingClientRect` answers in
screen pixels, after any ancestor's transform, while an SVG coordinate is in layout pixels; inside the Playground's
`Viewport` the two differ by the window's scale, so the first build placed every run at three quarters of its
position on a window scaled to 75% and the words ran into each other. The scale is the host's on-screen width over
its `offsetWidth`, and `ss-utils` divides an inline element's size by the same ratio, since it is compared with
canvas widths that never saw the transform. The `offset*` family is in layout pixels already and was not used
because SVG elements do not have it. It is _"A measured rect and a written offset are in different spaces inside a
`Viewport`"_ in `conventions.md`, missed the first time.

**Lines end only at the breaks the utility inserted.** The host, and `Typewriter`'s output, carry
`white-space: pre`. Without it a line filled to the edge, trailing space included, measured a fraction of a pixel
over the box once laid out, and the browser broke it a second time at the next inline block — the paragraph
example showed every line ending near half the width.

**`white-space: pre` sits on every `<text>` itself, not on the `<svg>`.** Chromium's own stylesheet gives `<text>`
`white-space: nowrap`, so a value inherited from the `<svg>` never arrives, and a run's leading space was collapsed
— the run after an image or an icon started flush against it while the space before it survived, which read as the
icon sitting off-center. The class goes on the mask's `<text>` too, since a mask drawn without the space would
cut a stroke one space-width off.

**One `<text>` per def, strokes drawn over fills**, the same order `Shape` uses. Only one copy may reach a screen
reader or the tab order: the first fill, or the first stroke when there is no fill
(`PaintedTextUtils.getIsReadableLayer`). The others are `aria-hidden`, and only the readable one carries the links
as SVG `<a>` and the titles as `<title>`. A run is drawn with its font properties alone; the colors and decorations
the source carried are left behind, since paint is the defs' job and a `fill` or `color` would fight them.

**Each run's `<a>` and `<title>` sit inside a `<tspan>` root, and that is a Solid constraint, not taste.** Solid
builds JSX inside an `{expression}` as a template of its own, and a template whose root is `a` or `title` — both
names HTML shares with SVG — is created in the HTML namespace and draws nothing inside an `<svg>`. With a `<tspan>`
at the root the template is parsed inside SVG and both come out right.

**`strokeAlignment` is a prop, the user's pick over a fixed default**, with `outside` as the default. SVG strokes
are centered on the edge; `outside` and `inside` draw the stroke twice as wide and mask away the other half, so the
width the consumer asked for is the width they see in all three (`PaintedTextUtils.computeStrokePaint`). One mask
serves every stroke layer, since it depends only on the letters: a white rectangle with the letters in black for
`outside`, the letters in white for `inside`. It is in user space and padded by the drawn width, because the default
mask region is the text's box plus ten percent and a thick stroke on a short word reaches past it.

**No paint at all draws the text in `currentColor`; a stroke alone draws hollow letters.** An empty fill list
counts as none, so a consumer switching a fill off does not make the text vanish.

**Whole elements keep their place: `<img>` becomes `<image>`, `<svg>` is copied in whole, anything else goes into a
`<foreignObject>`.** The first and last are the user's calls — the `<foreignObject>` because it matches what
`Typewriter` already renders, a copy of the element, with the same limit: a style that depended on where the
original sat does not reach the copy. The two that decide its place in the line are carried over by hand — `ss-utils`
pins an inline copy to the original's measured size and its `vertical-align` — because an icon sized by its
parent's class otherwise came back at its own `800px` attributes, in both components. An `<image>` takes the original's `alt` as its name, or is hidden when there
is none.

**`ss-utils` copies an `<svg>`, media, frames, `<select>` and `<textarea>` whole.** Their children are not text a
reader sees: the walk used to go into an inline icon and carry each `<path>` out on its own, where it drew nothing,
and a `<select>` would have been spelled out as its options. The copy also carries the original's size now, read
before it is cloned — a detached copy has no size, so every image used to count as zero wide when lines were broken.

**Elements a copy cannot reproduce are warned about, in both components** — the user's call. A `<canvas>` copy is
blank, media starts over, a frame reloads, and a form control loses its value and is no longer the control the
consumer holds. `JSXTextParserUtils.findUnsupportedElements` finds them and each component names them in its own
warning, on the first measurement and on every content change, never on a resize, so dragging a window does not
repeat it.

**Fonts and images loading lay the text out again, in both.** Either moves line breaks without moving the box, so
neither the size observer nor anything else would notice: a `load` listener on the source, set to capture since the
event does not bubble, and `document.fonts`' `loadingdone`.

**The Heading example's font controls style a `<div>` inside the text, not the box around it.** The component
re-lays its text out when the text changes, its box changes size, or a font or image finishes loading. A style
change on an ancestor is none of those: a heavier weight on a one-line heading moves every glyph without changing a
single box size, so nothing would tell the component to measure again. Styling an element inside the text is a
change to the text, which the mutation observer below sees.

**For a change from outside, the component hands out `update` on mount, as `Typewriter` does.** The user's call
over leaving the gap documented or watching every ancestor's attributes, which would cost an observer per ancestor
and still miss a stylesheet rule changing underneath. React, Vue and Svelte take the measurement once the
framework has applied the update the call arrives in, so a consumer may change the style and ask in the same
breath; each declares its own `PaintedTextController` for that wording and its barrel exports it by name, so it
wins over the core's, which Solid uses as it is.

**Content changes are followed by a `MutationObserver`, in both.** `Typewriter` used to wait for the consumer to
call `update("content")`, on the grounds that every change restarts its typing and a consumer typing into the
source would want to wait for a pause. The user's answer: a consumer who wants that debounces the value they pass
in, as the Custom Input example now does, and nobody is left showing stale text for want of a call. The controller's
`update` stays, for a change the component cannot see from inside its own copy — a class on an ancestor, say.
