# Decisions: `ColorArea`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `ColorArea`, and the value form a picker has to hold

The saturation-and-brightness surface replacing the OS color dialog, plus the
arithmetic under it.

**A string is the storage form and HSV the working one, and they do not round-trip.** `Color` in
`@thewaver/ss-utils` holds both plus the conversions. Eight bits per channel cannot carry hue at black or
saturation at gray, so a surface re-reading the string on every drag frame would drift and then stick — drag
brightness to zero and the hue is gone. `ColorArea` takes `hsv: SignalSource<Color.HSVA>` and never
touches a string; converting at the boundary is the consumer's, and `Color.isSame` exists so a caller can tell
whether the string it was handed still describes the HSV it holds, whatever notation either is spelled in.
Same shape as the timezone decision under `Calendar`: keep the lossless form in the working state, convert
only at the edges.

**The surface is a `role="group"` over two real range inputs, one per axis.** Both collapsed to a pixel and
taken out of hit-testing, so the drag on the group owns the pointer while the keyboard and assistive
technology get the native slider free — arrow keys, `aria-valuetext`, the lot. Collapsed rather than
`display: none`, because a hidden element is not focusable and the tab order is the point of them. **The surface itself is not a tab stop**: `InteractionWrapper` makes whatever it wraps tabbable, and here that is the group rather than a control, so `ColorArea` passes `isTabbable={false}` to it and the first Tab into the area lands on the saturation slider. The consumer's own `isTabbable` still reaches the two axis inputs. A single
`role="slider"` element was rejected: one slider cannot honestly carry two values, and it would mean
reimplementing key handling two native inputs already have.

Accepted cost: the axis inputs' own focus rings are invisible, so the painter draws focus from `focusedAxis`
in the flags — the arrangement `TextInput` uses for its caret color rather than the rejected
`:has(:focus-visible)` shape, because here the flag reaches the painter directly.

**`syncElement` returns for a fourth time.** Both axis inputs are pushed from state in a render effect, for
`BinarySwitch`'s reason: the browser moves a range input before it reports, so an owner that refuses or snaps
the write would leave the element holding a value state does not agree with.

**`PopoverRole` gained `"dialog"`.** `Select` brought `listbox` and `Menu` brought `menu`; a popup holding a
control surface rather than a list of choices is a dialog. The union grows as consumers arrive rather than
being a general string.

**`ColorInput` **is** the picker now, and the OS dialog is gone.** It was a native
`<input type="color">` behind a painter; it is now a field button plus a `Popover` with `ColorArea` and a hue
`Range` inside. The three open ownership questions:

- **The string boundary is the component's.** `value` stays `Signal<string>`, so no consumer changed,
  and the HSV working state lives inside where a drag cannot lose hue at black. Both directions of that sync
  guard with `Color.isSame` and read the far side `untrack`ed — a mirror that tracks both sides writes its
  stale half over the new value. The emitted spelling is the notation the value arrived in, which is argued
  under _"`ColorInput`, and a value the field cannot read"_ below.
- **Dismissal is the component's, and it needs a document listener.** `Select` closes on blur because its
  popup refuses focus; a color popup cannot, since the axis sliders and the hue slider must be focusable. So
  `ColorInput` listens for a `pointerdown` outside both popup and field while open, and `Escape` closes from
  either and returns focus to the field. The first popup here needing outside-click detection, and why
  `Popover` still has none — the need is the consumer's, not the layer's.
- **The paint is four slots**, following `Select`'s count: `renderContent` for the field, `renderArea` and
  `renderHue` for the two controls, and `renderPopup` for everything around them. `renderPopup` receives a
  thunk rendering the surface plus the HSV signal itself, which lets a consumer add a color-space toggle and
  channel inputs — paint and arithmetic over a value they now hold, not behavior the library owes them.

**There is no `renderAlpha`, and there will not be one — settled by the user.** Alpha is a
channel input in `renderPopup`. It was argued the other way first, on the grounds that alpha is judged by eye
and a number field makes you type-look-type; what defeated that is `NumberInput`'s press-and-hold, which
repeats while the stepper is held, so the field already gives continuous adjustment against a live preview. A
fourth slot would have bought the checkerboard track and nothing else, at the price of a permanent optional
prop and a mode on a shipped control.

The omission reads as a gap from outside: `renderArea` and `renderHue` are library-owned inputs and alpha has
no twin, so a consumer scanning the props concludes transparency is unsupported. It is not — the value is
`Color.HSVA` throughout and a hex value is written with eight digits whenever alpha is below opaque. The two slots exist
because those controls own a **gesture** the library implements, and alpha owns none.

**A native color input is no longer reachable through this control**, which is the cost: no form value and
no OS picker, and `FileInput` remains the only control where the UA owns activation. The suite got better for
it — every part of the picker is drivable, where the OS dialog could only be tested by writing the value.

**`Popover` refuses `mousedown` for a list, not for a dialog.** The `preventDefault` that makes `Select` work
also cancels the default action of pressing a native control, and a range thumb's drag **is** that default
action. So a `dialog` popover holding real controls skips it: the hue slider could be typed into but not
dragged, and nothing in the DOM showed it. The role already states the intent, so this is a branch on
`getRole()` rather than a new prop.

**Alpha is on the working form always, and a `0`–`1` fraction everywhere except in a hex string.**
`Color.HSVA` carries `a`, so `ColorArea` passes it through untouched. `HSVA.toHexa` always emits eight digits,
because a form that only sometimes carries alpha is a form you cannot type into; `Color.toNotation` is what
drops to six digits for an opaque hex, which is the spelling `ColorInput` writes back when a hex value arrived.

**The Playground's color mirrors cost two bugs.** The picker mirrors the hue into a `Signal<number>` for the
slider, and both directions originally read the other side's value inside the effect: picking a color elsewhere
re-ran the hue-to-picker direction, which wrote the previous hue over the new color — so typing a hex produced a
different color entirely. The same shape broke the hex field twice over: an effect refreshing the field's text
while tracking the picker overwrote what was being typed. The fourth mirror in the Playground and the first two to
go wrong, which is the argument for extracting it.

**A hex field owns its text until it is left.** Three and four digit hex forms parse, so a half-typed value
commits early; pushing the canonical spelling back in would replace the text under the caret and send the rest
of the keystrokes into the middle of it. Refreshing on the way out is `NumberInput`'s clamp-on-blur rule
applied to a different kind of incompleteness.

**`PageTextField` cannot be used for a field whose value is derived.** Its internal mirror lands one tick
behind the element, and `TextSync` then restores the caret to the offsets captured before the write, so every
character after the first is inserted one position early. The picker's hex field uses `TextInput` directly
with a signal it owns. Worth recording because the wrapper is used on nine other pages and works fine — the
difference is only that their values are not converted on the way through.
