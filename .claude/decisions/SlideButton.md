# Decisions: `SlideButton`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `SlideButton`, and why the gesture is the only thing it owns

Settled, when the user named a slide-to-activate control as a gap. It is a `Button` whose
activation is a drag from one end of a track to the other, for the case where an accidental press would be
expensive — send, arm, delete.

**It is a real `<button>`, and a click activates it only when no press made the click.** Taking every `click`
would defeat the control, because a press and a release is a click whether or not anything slid — a tap would
activate, and so would a slide dragged back and abandoned. Taking none, the first build's answer, left screen
reader users with no route at all: NVDA and JAWS in their reading mode swallow Enter and Space and send the
button a bare click instead, so neither the held key nor the pointer ever reaches the page (found by an outside
review against WCAG 2.1.1 and 4.1.2). So `createGesture` marks the button pressed when a pointer lands on it or
Enter or Space goes down, lifts the mark a task after the press ends — after the click that press produces has
been delivered — and ignores any click that arrives while it is marked. A click with no press behind it is an
activation from assistive technology or from script, and runs `onActivate` at once. The user's choice over
taking clicks only when `holdDurationMs` is `0`, which would have made every consumer opt in and given the tap
back to everyone at that setting.

**There are two routes, and neither is a tap: drag the thumb to the end, or hold a press until it fills.** The
hold drives the same `progressRatio`, so the paint is identical and a person who cannot drag sees what a person
who drags sees. It answers three things at once:

- **WCAG 2.2's 2.5.7 Dragging Movements**, Level AA: _"All functionality that uses a dragging movement for
  operation can be achieved by a single pointer without dragging, unless dragging is essential."_ A keyboard
  route does not satisfy it — 2.5.7 is about **pointers** — so a mouse or touch user who cannot drag needed
  their own route. The published list of conforming alternatives names long press explicitly, and it is the
  only entry that does not throw away the deliberateness the control exists for.
- **WCAG 2.1.1 Keyboard**, answered by the same hold starting on `Enter` or `Space` held down. A tap of either
  does nothing.
- **The reason the control exists.** A stray `Enter` on a focused button is the keyboard's version of the
  accidental press a slide resists.

What does **not** bite, though it looks as though it should: **2.5.1 Pointer Gestures** is about path-based
gestures, and its Understanding document is explicit that a slider using pointer capture — which is what
`trackDrag` does — counts as dragging only. So the drag route is on the right side of 2.5.1 by construction.

**Apple's own answer is the shape of this, arrived at from the other end.** Asked whether a swipe-to-confirm
harms VoiceOver users, Apple's guidance is to override `accessibilityActivate` so a single activation runs the
same logic **without** the swipe; the iOS lock screen behaves that way. What is built here is that answer with
the timing put back in — the part their platform gets from the assistive technology's own confirmation step and
a web control does not.

**What a screen reader is told is the field's hint, said once, and the library invents no words.** A person
who cannot see the fill hears the button's name and then nothing — so the gap was never a running commentary
on the bar, it was not being told what the control wants before starting. `SlideButton` reads the `FormField`
description context like every input does, so wrapping it in a field with "hold or slide to send" makes that
the button's description, read after its name when it takes focus. Nothing is announced during the gesture:
speech inside a one-second hold is the stutter `LiveAnnouncer` exists to avoid, and it would still be talking
when the action fired.

**Why that is the whole of what is owed here, rather than a compromise.** The gesture exists to resist an
_accidental_ activation, and a screen reader already supplies that protection by construction: reaching a
control and then activating it are two separate deliberate acts, which is not the case for a stray click or a
misplaced tap. Apple's guidance for the pattern says the same thing from the other end — collapse the swipe to
a single activation for VoiceOver — and the iOS lock screen does exactly that. So the assistive route wants
_less_ gesture, not a described one, and the bare click above is that route. It is told apart by what came
before it, not by guessing who sent it: detecting a screen reader is neither possible nor something to attempt.
`getHoldDurationMs` of `0` still makes the first frame complete the hold, for a consumer who wants a plain press
to activate for everyone.

**The progress is a flag and a signal, and the signal is optional.** `progress` is the ratio the fill
is drawn from, taken through `SignalMirrorSolidUtils.createOptional` exactly as a popup's `visibility` is: with no
prop the control keeps the number to itself, and with one the consumer holds the same variable the painter
reads. It exists because a flag only reaches `renderContent` — a readout beside the control, a second control
that reacts half-way, or a warning that appears at eighty per cent is outside that slot and had no route to
the number at all. A consumer write lands, and the next frame of a hold or a drag overwrites it, which is the
same bargain `Select` makes when it writes `false` back into a visibility signal it did not open.

**A press on the thumb starts both, and movement decides which.** A hold begins on every press; a press that
landed on the thumb converts to a drag once the pointer travels past a few pixels, and the abandoned hold snaps
back at that moment. Pressing the thumb and holding still therefore confirms, which matters because the thumb
is the obvious thing to press and a dead zone there would fail exactly the people 2.5.7 is for. The travel
threshold is a jitter guard rather than a tuned value and is a module constant; if it ever needs to move it
should become a prop.

**The press must land on the thumb for a drag.** `trackDrag` reports from `pointerdown` onward, which is what a
slider wants — press the track and the value jumps there — and is exactly wrong here, since pressing at 90% and
nudging right would be the shortcut the control exists to prevent. The first report of each drag is hit-tested
against the thumb's current span, and a drag that did not begin on the thumb is ignored for its whole length
rather than canceled part-way. The grab offset inside the thumb is kept and subtracted from every later report,
so the thumb does not jump under the pointer.

**The thumb's size is the library's to know and the painter's to draw, which is `Range`'s cost paid again.**
`getThumbSize` feeds the hit test and the painter positions its own thumb with
`calc(ratio * (100% - thumbSize))`; nothing enforces agreement, and the Playground keeps them honest with one
shared `SLIDE_BUTTON_THUMB_SIZE`. Handing the size out through the flags was dropped for consistency with
`Range`, which had the choice first.

**The track is measured with `clientWidth` rather than `getBoundingClientRect`.** The thumb size arrives in
plain CSS pixels, so the width it is divided by has to be in the same space; a client rect carries a
`Viewport`'s scale baked in. The same hazard the drag ratio avoids by being a fraction of two same-space
measurements — but the thumb size is not one of those measurements, so it has to be handled rather than divided
out.

**Releasing is what activates a drag, and releasing short of the end cancels the gesture.** Firing the moment
the thumb touches the end takes away the ability to change your mind mid-slide, which is worth more here than
the earlier feedback. **A hold is the other way round**: it fires the moment it fills, because there is nothing
to change your mind about once the bar is full and waiting for a release would leave a completed hold looking
broken.

**`getHoldDurationMs` is a prop because it is a tuned value.** Its default is meant to be long enough to be
deliberate, short enough not to feel stuck; nobody has measured it, and a consumer with a heavier consequence
should be able to set it without forking the control.

**The control returns to rest on release, always, including after a successful slide.** A slide is a way of
pressing a button, and a button is not still pressed while the consumer's handler runs; anything outliving the
gesture — in flight, succeeded, failed — is the consumer's state, exactly as for `Button`. A consumer wanting
the thumb to stay at the end already has the route without a new prop: pass `getIsPressed`, and the painter
reads `isPressed` and draws the thumb at 1. The Playground's second variant is that composition, so the
omission is not re-derived as a gap.

**A drag does not focus the control, a departure from a native button and the lesser evil.** `trackDrag` calls
`preventDefault` on `pointerdown` — it must, or the press starts a text selection — and that suppresses the
compatibility `mousedown` whose default action is the focus. Calling `focus()` back was tried and reverted the
same day: a scripted focus is not a pointer focus as far as the engine is concerned, so `:focus-visible`
matched and every mouse drag drew the ring. `ColorArea` does call `focus()` and should keep doing so — its axis
sliders are useless unless the arrow keys reach them — while here there is nothing focus enables that the drag
has not already done.

**`isDragging` and `isHolding` are two flags rather than one, and a painter almost always wants both.** They
are separate facts — one is a pointer carrying the thumb, the other a press filling it — and a painter that
wants to say "keep holding" needs to tell them apart. The Playground's painter takes the union and calls it
tracking, which is the common case: while either is true the value is being driven live and a CSS transition
would lag a frame behind.

**`isDragging` means the thumb is being dragged, not that a pointer is down.** `trackDrag`'s own signal turns
on for a press anywhere on the track, including one the hit test refused, so the flag a painter reads is that
signal and a live grab together. A painter keyed on the raw one would drop its transition on a press that moves
nothing.

### `SlideButton` takes an `orientation`

The user's call, following `Range`: `"horizontal" | "vertical"`, default `"horizontal"`, and a vertical button slides
upward, the lock screen's direction. All the axis handling is in the core — `SlideButtonUtils.computePointerRatio`
reads `x`, or `1 - y` when vertical, and `computeTrackLength` reads the track's width or height — so each framework
passes the drag tracker's `{ x, y }` and the track's size straight through. No `aria-orientation`: `role="button"`
does not support it, and the keyboard route, a held Enter or Space, is the same on both axes. **A horizontal button
turns round on a right-to-left page**, the user's call, as `Range` does: the thumb rests at the right and slides
leftward. A vertical one slides upward whatever the direction, as `Range`'s vertical counts up from the bottom. The
painter is told the `direction` in its flags rather than left to logical CSS, so its drawing can never disagree with
a gesture that is still left to right, as the other frameworks' stand-ins were for a while. `Range`'s Playground
painter goes the other way and places its thumbs and fill by `inset-inline-start`: it used `left` until the
SlideButton work turned up that the right-to-left example drew the value 20 at 20% from the left while the slider
measured from the right, so pressing the thumb that looked low moved the high one — invisible on the example only
because its values sit symmetrically. The Playground painter's long side is `length`, since it
is the height when vertical.

### `SlideButton`: what the reference libraries do

Read on **2026-08-13**, after the keyboard decision had already been taken.

- **No headless library ships one, so there is nothing to copy either way.** Radix's thirty-odd primitives,
  Base UI's thirty-five at its December 2025 stable release, React Aria and Ark UI all have a slider and a
  button and nothing between them. The omission is the field's, not this library's.
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

### `SlideButton` completes part-way along

`completionRatio`, defaulting to `1`, which is the old behavior exactly: how far along the track a released thumb has
to be for the slide to complete. It governs the drag alone — the hold, a held Enter or Space and a click from assistive
technology confirm as before. `SlideButtonUtils.computeCompletionRatio` holds it between `0.1` and `1`; **the `0.1`
floor keeps a barely moved thumb from ever completing, so that `0` cannot turn the slide into a plain press; it
started as a guess and the user kept it.**

### `SlideButton`'s `mode` closes a pointer route, and never the keyboard one

**The user's design, and the second form of it rather than the first.** Asked for as `"slide" | "hold" | "both"`,
first built gating both routes, then corrected: **`mode` governs the pointer and nothing else.** A held `Enter`
or `Space` confirms under every mode. That correction is the whole of what makes the prop safe, because the
hold is not merely _a_ keyboard route — it is the only one, there being no arrow-key walk along the track. A
version of this prop that gated the keyboard too would have let a consumer produce a button that focus reaches
and nothing operates.

**What it is for.** The two fears are opposite and a consumer usually has one of them: a stray drag across the
control, answered by `"hold"`, or a stray press on it, answered by `"slide"`. Both were reachable before only
by not using the control.

**A slide requires both halves of the gesture, and that is what `"slide"` names.** The press has to land on the
thumb and then travel past `DRAG_THRESHOLD_PX` before anything is grabbed. Both conditions were already in
`onDrag` before the prop existed; what the prop adds is that under `"slide"` there is no pointer hold to fall
back on when one of them is unmet, so a stray press anywhere on the control now does nothing at all rather than
starting to fill it. Each condition has a test of its own, since either alone would pass a gesture the other
refuses.

**`"slide"` gives up 2.5.7, and the user ruled that this is the consumer's to give up.** The entry above records
that the hold exists to answer **WCAG 2.5.7 Dragging Movements**, Level AA — anything operable by dragging must
also be operable by a single pointer without dragging — and that a keyboard route does not satisfy it, since
2.5.7 is about pointers. So a slide-only button has dragging as its only pointer route. Raised with the user
and settled by them: **the library ships a working path and `"both"` is the default; a consumer selecting
`"slide"` is choosing the violation, the same way they can choose unreadable contrast in a painter or nest a
button inside a button.** The library's job is to make the conformant configuration the one you get by
default and to say plainly what the others cost, which the prop's own documentation does. **`"hold"` gives up
nothing**: it removes the drag, which no criterion requires, and keeps the alternative that two of them do.

**The gates are two predicates rather than one.** `getCanDragThumb` guards the grab inside `onDrag`, and
`getCanHoldByPointer` guards the `startHold` call on the pointer path alone — the one in the key handler is
left ungated, which is what keeps the keyboard out of it. Writing it as a single "can hold" check was the first
version's mistake, because the same function served both callers.

**The hold-only demo sets a longer `holdDurationMs` than the default one**, and the reason is the spec rather
than the demo: under that mode a press _is_ a hold, so a drag that took a second on a loaded machine would
confirm the action, and the test asserting that a drag does nothing would have read that as the drag being let
through. Two seconds is past anything the drag takes and still a reasonable hold for a person.

### `SlideButton` describes its own gesture, through `ariaDescription` and a warning when it is missing

A slide-to-confirm button is operated by holding Enter or Space from the keyboard, and a plain tap of either does nothing. Nothing on the control said so to somebody who cannot see the thumb: it carried a name and a disabled state, and a description only when an enclosing `FormField` happened to supply one. The first Docs plan for it was a section on wiring a `FormField` hint to the button. The user refused it: a component should be self-sufficient through ARIA, not depend on being inside a form.

Three shapes were weighed. **A string prop** won, over a fixed English phrase inside the library (read in the wrong language on a non-English page, which breaks _"The library says what a component is, and nothing else a reader hears"_). The prop is `ariaDescription`, beside `ariaLabel`, written once in the core as `BaseSlideButtonValues`. **It was chosen required, and the user then made it optional with a console warning** (`SlideButtonUtils.warnIfUndescribed`, called once when the button is set up, the way `Label` warns), under _"An accessibility mistake the library can detect is warned about, never blocked or filled in"_. The Docs page also carries a box in the theme's alert colors under the intro saying so, since a warning in the console is only seen by somebody who opens it.

**It is rendered as the button's own visually hidden text, and the button points at it with `aria-describedby`**, joined to the form field's description when there is one, so both are read. The text is clipped rather than `display: none`, per _"Text meant only for screen readers is transparent or visually hidden"_, and its id is generated, per _"A component generates the id a relationship attribute needs"_. The `aria-description` attribute was not used; its support was not checked.

The Playground's examples describe the keyboard route only ("Hold Enter or Space to send."), since that is true under every mode and the Mode knob changes which pointer gestures work.

**It also says when it is held at the end.** The page keeps a confirmed button at its end through `isPressed`, and until now that state was drawn and never announced. WCAG 4.1.2 asks that states set by the user be programmatically determinable, with "notification of changes to these items … available to user agents, including assistive technologies", so the element writes `aria-pressed` from the flag, as `Button` does: present only when the consumer passes `isPressed`.
