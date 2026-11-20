# Decisions: `Range`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Range`'s pointer seam, and `RangeUtils`

`computeValueAtPoint?: (point: Point2d, rect: DOMRect) => number`, both in client coordinates as the pointer
event and `getBoundingClientRect` give them, on the user's call: one optional prop that turns a knob from a
component into a formula. When present, `Range` follows the pointer itself: it cancels `pointerdown`, captures the
pointer, and writes what the function answers on each move. That value is stepped from `min`, then clamped between
the neighboring thumb. With two thumbs, the one nearer in value at the press moves, and it takes focus. Keyboard,
role, bounds, `computeValueText` and `onChangeEnd` are untouched; `onChangeEnd` is reported on release.

**Native input events are ignored while a pointer is being tracked, and the element is put back to the held
value.** That is `syncElement`'s rule, so a browser that drags the native thumb anyway cannot win. A native `change`
arriving afterwards finds no recorded starting values and says nothing; keyboard changes still report through
`change` as before. `e2e/range.spec.ts` drags the knob round in Chromium and pins that the native thumb never takes over.

**`RangeUtils.computeAngularValue` is the knob formula**: angle about the box's center, degrees with 0 pointing
right and increasing clockwise, as in `AngleUtils`. The caller gives a start angle and a sweep; a negative sweep
runs the other way, and a point in the gap goes to the nearer end. It is kept separate from stepping, which is
`RangeUtils.computeSteppedValue`.

### Controls: `Range`

`backlog.md` predicted this would be the most architecturally novel control left
and got the central call wrong, which is the most useful thing to record.

**A two-thumb range _is_ two native `<input type="range">` elements, one per thumb.** The prediction was
that two thumbs had nowhere to go under overlay geometry, so both thumb counts would be custom. Each thumb
is its own input, absolutely positioned `inset: 0` over the same painter, so a pair is the single case
rendered twice and the two modes cannot diverge in paint, keyboard or ARIA. Native also keeps `step`,
`Home`/`End`, `PageUp`/`PageDown`, drag and the track-click jump.

`Range` therefore did **not** need the pointer primitive `backlog.md` asked for. What did was a two-dimensional
color surface, which has no native equivalent; `ColorArea` is built over `trackDrag` and that item is closed.

**Crossing is prevented by the inputs' own `min` and `max`, not by JS.** Thumb `n`'s `min` is thumb
`n-1`'s value and its `max` is thumb `n+1`'s, so the browser clamps drag and keypress identically and no
guard can be forgotten. The cost is the tie: two thumbs on the same value cannot move through each other,
so which one you grab decides which way you can go. `raiseNearestThumb` resolves that on `pointermove` —
the input nearest the pointer gets `z-index: 1`, and on an exact tie the side of the pointer decides.
Verified in a browser with both thumbs at 80.

**Ranking has to happen on `pointermove`, before the press.** `pointerdown` is too late — the browser has
already picked the event target and begun its native drag. The move handler is skipped while a button is
held (`e.buttons === 0`) so a drag in progress cannot be stolen.

**The library owns the thumb's hit size; the painter owns its appearance.** `appearance: none` leaves the
thumb with no size in Chromium, which kills dragging, so `Range.css.ts` styles
`::-webkit-slider-thumb` and `::-moz-range-thumb` — transparent, sized from `getThumbSize`. That number
and the painter's visible thumb must agree and nothing enforces it: exactly `TextInput`'s
padding-versus-inset cost, paid the same way with one shared `RANGE_THUMB_SIZE` constant.

It is also why the painter is handed `ratios` rather than percentages. A thumb's center travels between
`thumbSize / 2` and `length - thumbSize / 2`, never the full track, so `left: ratio%` would overhang both
ends. The painter positions with `calc(ratio * (100% - thumbSize))`, which it can only write because it
knows the thumb size.

**One prop per mode, and giving neither or both warns.** `value: Signal<number>` drives one thumb;
`range: Signal<RangeValues>` drives a pair. A single `Signal<number | RangeValues>` would force
every plain-slider consumer to narrow a union on every read, and a generic would hit the `AccessorProps`
hole. Mode is structural rather than a `getMode` prop because the value's shape carries it.

**The selection is `{ start, end }`, and the scale keeps `min` / `max`.** The pair's fields were `min` /
`max` for one draft, which collided badly: `getMin` would be the floor of the track while
`range[0]().min` was the floor of the selected band. `getMin` / `getMax` match the native attributes
and `TextInputState` already uses them.

`start` / `end` over `from` / `to` on published precedent rather than taste. Adobe's React Spectrum
`RangeSlider` takes `{ start, end }`; MUI's prose describes its array as "the start and end of a range";
Radix is `number[]` and offers no names. The only major library with other names is Ionic's
`{ lower, upper }`, whose type is the single union this component avoided. Nothing checked uses `from` /
`to` for a slider — that reads as a date-range and filter idiom.

A range's selection and `flags.fill` are both a `Span`: the selection in scale units, `flags.fill` as 0..1 ratios.

**Disabled refuses the write and pushes the element back.** A range has no `readonly`, so the guard is
the `BinarySwitch` shape: the browser moves the thumb before firing `input`, so a refused value is
overwritten by `syncElement`. Both paths run it, since the accepted path is also where an owner may clamp.

**Vertical is `writing-mode: vertical-lr` plus `direction: rtl`, with no fallback — accepted.**
The `direction` puts the low value at the bottom. Per MDN, vertical form controls via `writing-mode` "only
gained full browser support in 2024", and this is `components/src`, so the baseline was put to the user and taken.
The older routes could not have been layered underneath anyway: `appearance: slider-vertical` cannot
combine with the `appearance: none` that strips UA paint, and Firefox's `orient="vertical"` is
non-standard. On an older engine a vertical `Range` renders horizontal rather than degrading.

The first hard modern-CSS dependency in `components/src` with no fallback, so it is the precedent
_"Compatibility arguments"_ will be cited against. It is a real one: argued from a dated support claim and
sanctioned explicitly, not inferred from the Playground.

### Controls: `Range`'s value text, its end-of-change callback, and ids per thumb

**A thumb's value text is `computeValueText(value, index)`, written to that thumb's `aria-valuetext`.** It is a
`compute*` function rather than `Progress`'s `ariaValueText` string, because the text has parts only the library
knows: the value, and which thumb holds it. A price range reads "$100" and "$350" rather than two bare numbers. The
library supplies the number and the index and never the wording, which is the Language of Parts rule. Left out, no
attribute is written and the number is read as it is.

**`onChangeEnd` rides on the native `change` event.** A range input fires it when a drag lets go and after every
key press, so each key press is its own change and its own end without any bookkeeping of the pointer. A copy of
the values is taken on `pointerdown` and `keydown`, and the callback stays silent when the values at `change` match
it, so a drag that ends where it began reports nothing. A key that meets an end of the track fires no `change` at
all. It is refused while disabled, like every other write.

**The consumer's `id` is suffixed per thumb, as `name` already was.** A pair's thumbs are `<id>-start` and
`<id>-end`, and a single thumb keeps the bare id, the two-field rule `DateRangePicker` and `ColorArea` follow.
Before this the id went on the first thumb only, so a `<label for>` could name one end and never the other. The
suffix is documented on `range`, the prop that makes a pair, rather than by redeclaring `id` to document it.
