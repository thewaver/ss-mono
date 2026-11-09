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

# Conventions: shared state and timing

Two-way values, fields, popups, stacking, playback and timers. The library-wide rules are in `conventions.md`.

### A frequently changing value is passed as a getter, and read only after a cheap test says it is needed

In a framework that updates only what read a value — Solid, Svelte, Vue's computed values — every instance that
reads a value changing on each pointer move is subscribed to every move, even when only one uses it, and a helper
taking the value as an argument has already read it at the call site. **Hand over a getter and call it only once a
cheap test has passed** — is this the item on top, the item under the pointer. React re-renders anyway, so it
passes a getter returning the value it already has and loses nothing.

### A timer that must survive its effect re-running is armed in the effect and settled in its cleanup

An effect re-runs whenever anything it depends on changes, so a countdown cleared and restarted at the top of the
effect restarts from full on every unrelated change and can be postponed indefinitely. **Arm it for the time that
is left, and in the effect's cleanup clear it and subtract the time that passed since it was armed.** The effect
then depends only on what changes the countdown — its duration and whether it is paused.

- Solid: `onCleanup`, called inside the effect.
- React: the function returned from `useEffect`.
- Vue: `onWatcherCleanup`, called inside the watcher.
- Svelte: the function returned from `$effect`.

### A control whose value is a pair holds one composite value, not two

The user's decision. A range's two ends, or a date with a time, is **one value**, never two the consumer keeps in
step: a date range is `{ start, end }` (the fields `Range` ships), with the half-picked state held by the
component, and a date-time is a value type in `Abstracts`, not a `{ date, time }` assembled at the call site. It
was settled before either was built because a date-time **range** would otherwise inherit two shapes. React Aria
answers both the same way.

### A text field corrects a value only when it is committed, never on each keystroke

Correcting while typing makes values untypeable — with a minimum of 40, the `5` that begins `50` becomes `40`. The
same happens when the owner corrects what a field reports and writes it back. **A correction happens on commit —
blur, Enter — or not at all**; until then a refused half-typed value stays in the text and is not reported. A step
from an arrow key or a button is a whole gesture and is corrected at once. **A control that can be handed a value
it refuses refuses it itself**, so no owner has to remember not to correct.

### A field keeps the text it shows apart from the value it holds, and only the reader moves the value

The user's model, replacing an earlier "show nothing" rule that hid from the reader what was wrong. Every input holds
two things: **the text it shows**, which the reader may edit into anything, invalid included ("#FFCCGG", "25:61"),
and **the value it holds**, which changes only when the reader's edit makes the text valid — until then it stays at
the last valid value, or none. Invalid text raises the error and nothing else.

- **Only the reader's edits change the value.** A field never writes a value it produced itself: not by rewriting its
  text under new settings and reading that text back, not by clamping, rounding, snapping to a step or picking the
  nearest option on mount or when a prop changes — the one exception being a limit's correction on blur, below. Each of those turns a value nobody chose
  into one that survives a round trip — `CurrencyInput` turned a held −250 into 250 when its sign was switched off.
- **A value handed in that the field may not hold under its current settings is shown as its text, marked as an
  error, and kept as it is**: −250 with no sign allowed shows "−250.00", flagged, and the consumer still holds −250.
  The reader can edit it like any invalid text; the value moves only once the edit is valid. When the settings allow
  it again, the same text is simply valid again — nothing is remembered or restored.
- **A format is enforced by an error; a limit is enforced by a correction on blur** — the user's split. A format is
  what the value is (a sign, a number of decimals, a date or time pattern, a colour notation): breaking it raises the
  error and moves nothing. A limit is where the value sits (a `min` and `max`, an earliest and latest date or time):
  a value outside one is kept as typed or as handed in, and pulled to the nearest bound when the field loses focus,
  edited or not, as `NumberInput` always did. It holds for every input with a limit — `NumberInput`, `CurrencyInput`,
  `DateInput`, `TimeInput`. The user took it with low certainty; it is to be revisited once lived with.

**The user widened the old rule, and that part stands**: any conversion into a form that cannot hold the value — a
storage format, a payload, a file, a serialized string — fails loudly rather than approximating. The one accepted
exception is `DateValueUtils.withCalendar`, which clamps silently; it is in `backlog.md` under _"Accepted limits"_.

### A popup's open state is private until a consumer asks for it

The user's call. `Select`, `MultiSelect`, `Menu`, `ColorInput` and `DatePicker` take an optional `visibility`,
`Modal`'s prop under its name and rules. **One value, both sides write**: a popup opens and closes for its own
reasons, so a one-way "obey this boolean" prop would fight it.

- Solid: a signal pair, `visibility={[getIsOpen, setIsOpen]}`.
- React: a `[value, setValue]` pair, `visibility={[isOpen, setIsOpen]}`.
- Vue: `v-model:visibility`.
- Svelte: `bind:visibility`.

**Left unshared, the component keeps its own, through one code path** — a helper answering with the consumer's
value when shared and the component's own otherwise, so no use site branches:

- Solid: `SignalMirrorSolidUtils.createOptional(() => props.visibility, false)`.
- React: `SignalMirrorReactUtils.useOptionalState(props.visibility, false)`.
- Vue: `useTwoWay(props, "visibility", false)`, from the package's `propUtils`.
- Svelte: `visibility = $bindable(false)` in `$props()`; an unbound bindable is already the component's own.

**Where a write can be refused, the component holds no copy.** A copy that already flipped never hears about the
refusal — an `Accordion` section required to stay open showed closed in its header while the list said open. So the
shared value is handed straight through:

- Solid: `SignalMirrorSolidUtils.createPassThrough(getValue, setValue)`. A `T` that is itself a function can only be
  written through an updater.
- React: hand the `[value, setValue]` pair on as it is.
- Vue: bind the value and its `onUpdate:` listener to the source; `useTwoWay` then shows only what the consumer holds.
- Svelte: a function binding, `bind:expanded={() => value, (next) => …}`.

**Every side effect of opening or closing hangs off the state, not off the path that changed it** — clearing a
highlight, moving a calendar to the value's month, placing the initial highlight all run in an effect keyed on the
open state, so a popup closed from outside ends where a click outside would leave it. **An invariant the component
owns is enforced against the state**: a disabled `Select` or `Menu` written open writes `false` back.

### A popup's anchor is also its dismiss root, which is what lets a consumer's own button toggle it

`Popover`'s dismiss roots are `[the popup, the anchor]`, so a press on the anchor is not an outside press. A
consumer's own toggle button is made the anchor (`Menu`'s optional anchor ref), or pressing it while open would
dismiss the popup and the handler re-open it. A split button is then a composition: the arrow half is the anchor.
A context menu opened at the pointer anchors to a rect (`anchorRect`), which nobody can press, so its dismiss root
is the component's own region.

### A popup opened from inside a popup is not outside it

Popups are portalled to the end of the document, so a `Select` list opened inside a `DatePicker` calendar is a
sibling, not a descendant, and `contains` calls a press on it outside. `DismisserUtils.getIsWithinOwnedLayer`
walks up from the target and, at any element something points at with `aria-controls`, jumps to that controller
and keeps going. **Ownership is already in the markup** for screen readers, so nothing is registered on open. This
fixes containment only; it is not the layer stack `backlog.md` asks for.

### A portalled layer's z-index is one above its anchor's

The number comes from the anchor, not a register of layers: `AnchorUtils.getStackingBase` takes the highest numeric
`z-index` on the anchor's ancestors and the layer uses that plus one, recomputed each time it becomes visible — so a
chain of popups orders itself. Not an open-order stack, because a `Modal` opened from a menu should still cover that
menu, and the library should not invent a number that competes with the consumer's stacking. `Tooltip` takes the
same number; a portalled layer cannot paint under its own anchor.

### A component that sets `z-index` on its own parts makes its own stacking context

A `z-index` is compared only within one stacking context, and `position: relative` does not start one, so indices a
component gives its parts escape and compete with a dialog's counter or a consumer's header. **The component's root
starts a stacking context with `isolation: isolate`** (`z-index: 0` would also place the root among its siblings,
which is the consumer's business). **A layer painting behind the content sits at a negative `z-index` inside it**,
or it takes presses meant for the content. **A `backdrop-filter` layer is the exception**: `isolation`, `clip-path`
and `mask` each make a Backdrop Root that blinds the filter, so there the context is `position: relative; z-index: 0`
and a layer needing clipping clips itself.

### Playback is a two-way value; a rewind is a command

The user's call. **Whether a thing is playing is state, so it arrives as an optional two-way `playback`**
(`CellAnimation`, `ScanlineAnimation`, `AudioSwitcher`), shared and kept private exactly like `visibility`: a signal
pair in Solid, a `[value, setValue]` pair in React, `v-model:playback` in Vue, `bind:playback` in Svelte. A page
writes one shared value instead of collecting controllers.

**A value shared across a page governs whatever mounts later**, so anything mounted into a different lifetime — a
modal, a portal, a route — gets its own value, or it inherits a state nobody decided for it (a stress-test modal's
animations mounted into "stopped" and never ran).

**A command that is not a state stays a handle handed over through `onMount`**: `Typewriter`'s `restartAnimation`,
`AudioSwitcher`'s `reset`. A restart cannot be faked by toggling a value, because the element must be painted in its
starting state for a frame before the animation re-applies, and the browser may fold an off-and-on into one paint.
**The test is whether a consumer can meaningfully read it**: playing, open, selected, expanded are values; restart,
rewind, re-measure are commands.

### An animation something waits on is backed by a timer, and a transition's end is asked of the browser

A page that is not painting stops delivering animation frames while timers keep running. Where something waits on
an animation — a dialog handing focus back when its fade ends, a spin announcing its result — frames alone leave the
state half-changed. **So what must finish also runs on a timer, whichever arrives first completes it**, the
completion is safe to run twice and the loser is canceled. Pure decoration gets no timer.

**A CSS transition's end is asked of the browser**: it is over when every animation in
`element.getAnimations({ subtree: true })` has finished (the subtree, since the animating element is often the
consumer's), awaited with `Promise.allSettled` because cancellation rejects. A timer for the duration plus a margin
stays as the backstop, for an element animating nothing or an endless animation. A transition reversed part-way
starts a second wait; a counter stops the older wait from declaring the newer one done.
