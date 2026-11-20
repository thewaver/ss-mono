# Decisions: `Rotator`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Rotator`: the behavior both wheels share, with no DOM of its own

**A wheel that spins to an index is arithmetic plus a small state machine, and neither is markup.** The
original had a `useRotationEffect` hook shared by its two wheels and left everything else — where to stop, how
far to overshoot, whether to idle — in a consumer hook beside the styled components. `Abstracts/Rotator` takes
the whole of it: `RotationUtils` is the pure angle maths with unit tests, and `createRotator(ref, disabled,
defs)` holds the phase, the timers and the holds.

**The angle only ever increases.** `getSpinAngle` rounds the current angle up to a whole turn, adds the turns
asked for and then the target index's angle, so a spin is always forward however many times the wheel has been
spun. Testable in one line, and the property a consumer would otherwise discover by watching a wheel unwind
backwards.

**A spin overshoots and then settles, which is two turns rather than one.** Landing dead center on the
wedge looks mechanical, so `computeSpinDefs` may return a `jitterRatio`: the wheel spins to the target plus
that fraction of a wedge, then corrects to the center over the settle duration. `getJitterAngle` clamps the
ratio to half a wedge, because past that the wheel would come to rest on a different wedge from the one the
index names — the clamp exists to protect that correspondence, not to be tasteful.

**Nothing random is in the library.** Turn counts and jitter are the consumer's, defaulting to three turns and
no jitter, which makes the component deterministic and its e2e spec possible. The lively version — random
turns, random jitter — is a Playground sample, the same line `CellAnimation` draws around its weights.

**The target is published as soon as it is known; the landing is marked by `onSpinEnd`.** `targetIndex`
is written the moment `computeSpinTarget` resolves, so a consumer bound to it learns the outcome before the
wheel arrives — the user chose that over protecting the surprise by default, argued under _"`Rotator`, and the
difference between where a wheel is and where it is going"_. A consumer who wants to wait for the landing
listens to `onSpinEnd`, which fires at the settle, and so does the announcement.

**Where the target comes from is the consumer's, and the wheel asks for it.** `computeSpinTarget` may return a
promise, because the real case fetches a prize from a server. While it is outstanding the wheel is not
spinnable and says so, or a second press would start a second fetch — the original guarded this with a
`canSpin` flag and the guard has to be reactive, since the spin control's disabled state is drawn from it.

**A spin is a command, not a state.** `spin()` arrives through the `onMount` handle, per _"Playback is a signal; a
rewind is a command"_ in `conventions.md`. Whether the wheel is turning by itself **is** state, so it is
`autoSpin`, and so is the target index.

**The abstract publishes no handle of its own.** `RotationController` existed and was passed straight
through by `Wheel`; it is gone, and `WheelController` is the only one. An abstract with no DOM has no
consumer to hand anything to — the component that owns the element owns the handle, and one handle in wheel
vocabulary beats two in two vocabularies for the same thing.

**The wheel computes its own angle every frame; CSS no longer interpolates anything.** This replaced the
original arrangement, in which `Rotator` set a target angle, published a duration and a timing-function name,
and let a `transition` on the wedge do the moving while a `setTimeout` of the same length stood in for "the
turn has finished". The user asked for the change, and the reason is that the browser was the only thing that
knew where the wheel actually was. Mid-transition the angle signal already held the destination, so nothing in
the library could answer "which wedge is under the marker right now" — the question only had an answer at the
two ends. Now `turnTo` walks the angle from where it is to where it is going, one `requestAnimationFrame` at a
time, through `EasingUtils.ease`, and the angle signal is the truth at every instant.

**Three things came out of it beyond the live index.** The spin no longer takes its starting angle from the
destination of an idle step that had not finished. The turn ends when the turn ends, rather than when a timer
guesses it has. And nothing on a wedge interpolates any more, so a change to any input the transform is built
from — the wedge count above all — applies on the next frame rather than being animated to. Measured on a
turning two-wedge drum, the faces now sit inside the width the component reserves at every angle of the turn.

**The idle turn became continuous rather than a step per delay.** It used to set the angle one wedge forward
and let a linear transition of `idleDelayMs` carry it there, which is a sawtooth of targets that happens to
look smooth. The frame loop advances by `stepAngle / idleDelayMs` degrees per elapsed millisecond, which is
the same motion described directly. `idleDelayMs` keeps its meaning exactly — how long one wedge takes to pass
— so the panel knob still reads the way it did. It also means the turn stops where it is when idling ends,
rather than running on to the step it had already committed to.

**The spin carries a starvation fallback and the idle turn does not, and the split is the point.** `turnTo` arms a `setTimeout` for the duration plus `FRAME_STARVATION_SLACK_MS` beside the frame
loop, and whichever arrives first lands the angle and runs the arrival. Without it a visitor who starts a spin
and switches tabs comes back to a wheel stopped part-way round, no prize announced, `onSpinEnd` never fired
and the spin control disabled for good. The idle turn gets no such fallback, deliberately: it owes nobody an
answer, it is already suppressed for a hidden page and for `prefers-reduced-motion`, and arming a timer to
shuffle a wheel nobody can see would be worse than doing nothing. `e2e/noAnimationFrames.spec.ts` drives both
halves.

**`isSelected` says the wheel has picked this wedge out, which is not the same as the wedge being at the
marker.** The user's sequence, and it is the one to keep: a wheel turning by itself has picked nothing, a
wheel spinning has picked whatever is passing the marker right now and moves the pick as it turns, a wheel
that has settled has picked the prize and holds it for the rest, and when the rest runs out and the turn
resumes the pick goes away again. So `isSelected` is the live index everywhere except while idling, where it
is nothing at all. Painting the passing wedge during an idle turn would tell a visitor the wheel had chosen
something it has not, and the first build had the opposite failure — `isSelected` was the settled index, so
one wedge was lit from page load and never moved, including all the way through a spin.

**That is deliberately not the same rule as `onSelectedWedgeChange`, which fires during the idle turn too.**
The two answer different questions. `isSelected` is paint, and a wheel with nothing selected must paint
nothing. The callback is position, and position exists whenever the wheel is moving — a consumer wanting a
tick per wedge as it passes needs it exactly while the wheel is idling, which is when a gated callback would
be silent.

**The drum's `aria-hidden` and `inert` stay on the target index rather than following the pick.** They mark
which face a screen reader may reach, and moving that with the turn would rewrite the accessibility tree
tens of times a second while the drum idles, for a face nobody is going to stop on. Paint may follow the
angle; what assistive technology is offered should not.

**The wedge under the marker is reported through a callback and a getter, not published as a signal, and it
is not the target.** The target is where a spin is heading, decided once. What the frame loop makes available
is a different quantity: which wedge happens to be at the marker at this instant, which during a spin is a
stream of values and none of them the result. It is `getCurrentIndex` on the handle for a consumer who asks,
and for one who wants to be told the user's call on its shape was `onStepChange` on the abstract, surfaced by
`Wheel` as `onSelectedWedgeChange` — a callback rather than a signal because the wheel reports and nothing
writes back, so there is no second owner for a two-way binding to serve. `RotationUtils.getAngleIndex` is the arithmetic, the exact inverse of
`getIndexAngle`, and it rounds, so a wedge holds the marker until the halfway point of the gap to the next.
It fires on every change including during the idle turn, which is what a consumer wanting a tick per wedge
needs.

**The idle turn runs indefinitely, and rests only after a spin. This replaced an arrangement built on holds,
and the replacement is the user's.** The first build stopped turning whenever the pointer was over the wheel,
whenever anything inside it had focus, and for good once a spin had settled. All of that is gone. The wheel now
turns by itself for as long as it is on the page, with one exception: a hidden tab stops it. **Reduced motion
was a second exception and is not any more** — see the entry below.

**After a user spin settles, the wheel rests for `restDurationMs` and then picks up again; `-1` rests for
good.** The rest is its own private state, deliberately not the same thing as the auto-spin switch, because the
two have different owners — the rest is the component saying "let them read the prize", the switch is the
consumer saying "not now". Folding them into one flag meant a consumer's pause being canceled by a rest timer
they never started. `DEFAULT_REST_DURATION_MS` is 3000 and is mine, not measured; change it freely.

**A pause on hover is now the consumer's to build, and `autoSpin` is the door.** This is the settled
`playback` rule applied again — whether the passive turn is running is state a consumer can read and
write, so it is a two-way signal rather than a `pause()` on the mount handle. A consumer wanting the old
behavior writes `false` on pointer enter and `true` on leave, over their own box, which is also the only way
to cover a control that sits **on top of** the wheel rather than inside it. The library cannot do that for
them: the hold it used to keep listened for the pointer arriving on the wheel's own element, and a button
overlapping the wheel is a neighbor rather than something nested inside, so it took the pointer away from the
wheel instead of holding it.

**`getIsHeld` is gone from the handle, and `getIsPlaying` is now two getters.** `isHeld` existed for one
purpose — deciding whether to suspend the idle turn — and with the holds gone it had no consumer. The
playing flag was doing two jobs at once, so it is split at the seam the user named: `getIsAutoSpinning` is true
while the wheel turns by itself, `getIsUserSpinning` while it is fetching a target, spinning to it or settling
on it. Both are views of `getPhase`, which remains for anyone wanting the four states apart.

**`createRotator` no longer takes an element.** The hold was its only use for one, so the abstract is now what
its own heading claimed: a state machine with no DOM whatsoever. `InteractionTrackerUtils.trackPageHidden` was split
out of `trackHold` so the page-visibility half could be used without the pointer and focus halves; `trackHold`
composes it and is unchanged for `Carousel` and `Toasts`.

**WCAG 2.2.2 Pause, Stop, Hide (Level A), and the user's answer to it.** The normative line: _"For any moving, blinking or scrolling information that (1) starts
automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a
mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an
activity where it is essential"_. All three conditions now hold with nothing to answer them. The earlier reading
recorded here — that the motion is essential to the control — was written when the wheel came to rest on a spin
and stopped under the pointer; an attract-mode turn that never ends is a harder thing to call essential, since
the essential activity is the spin and this is what happens while nobody is spinning. What is left is
`prefers-reduced-motion`, which is a real user-side control but is not among the criterion's sufficient
techniques, and `autoSpin`, which is a capability handed to the author rather than a mechanism offered to
the visitor.

**The user's position is that the criterion's own exemption applies: the motion is essential, because spinning
is what a wheel is, and "essential" is a subjective qualifier the criterion leaves to judgement.** Put to them
with the analysis above and answered directly; recorded as their reading, which is the standing the earlier
version of this note had too. A consumer who wants a pause control still has `autoSpin` to build one
against.

The user-initiated spin is outside the criterion in any case — it does not start automatically — and it is the
essential activity, which is what 2.3.3 Animation from Interactions exempts at AAA.

**The wheel no longer reads `prefers-reduced-motion` at all, and this is a deliberate reversal.** It used to be
one of the five conditions on the idle turn, so a visitor asking for less motion got a wheel that waited to be
spun. The user's call, taken when `PointerTracker` raised the same question: the library reports and the
consumer decides, and the door is already open — `autoSpin` and an absent `idleDelayMs` both stop the
idle turn, and either can be driven from the preference in a line at the call site. Nothing was resting on the
internal check: the analysis above already records that `prefers-reduced-motion` is not among 2.2.2's
sufficient techniques and that the user's answer to that criterion is the essential-activity exemption, so
removing it changes no conformance claim. **The Playground is now the consumer that answers it** — `WheelPage`
reads the query and returns no `idleDelayMs` under reduce, which is what keeps `e2e/wheel.spec.ts`'s
reduced-motion expectation true. That spec is testing the Playground's behavior, not the library's, and its
prose still reads correctly.

`Carousel` and `Toasts` keep the three-part hold; the wheel no longer has one at all, so what they share now is
only `trackPageHidden`.

**The result is announced through `LiveAnnouncer`, only on settling.** Same argument as `Carousel`: the wedges
are all still on the page, so a live region over them announces nothing, and narrating an idle wheel every few
seconds is the noise 2.2.2 exists to prevent.

### `Rotator`, and the difference between where a wheel is and where it is going

Settled by the user, on a fault that read as a stale doc block and turned out to be a missing distinction.

**A wheel has two "current wedge" numbers and only ever named one of them.** The wedge at the marker this
instant is derived from the angle and moves continuously while the wheel turns; the wedge the wheel is heading
for is decided once, when a spin's target is known. `index` held the second and was documented as the
first — "Which wedge is at the marker. It is the only thing that moves the wheel" — and writing it moved
nothing.

**The user's framing settled it: current and target.** So the signal is `targetIndex`, and the ambiguity
existed only because the prop said "index" and left a consumer unable to tell which of the two they were
holding. Their words: if the name explicitly announces "target", immediate reflection is the correct way.

**A consumer write turns the wheel, which is what a target means.** The behavior falls out of the name rather
than being bolted onto it, and the doc sentence becomes true as written instead of being corrected away.

**The target is published as soon as it is known, not when the spin lands.** The behavior change this cost:
`setTargetIndex` now runs when `computeSpinTarget` resolves, so a consumer reading the signal mid-spin learns
the outcome before the wheel arrives. The user chose that over protecting the surprise by default —
`onSpinEnd` is there for a consumer who wants to wait, and the Playground's overhead readout says "heading
for" rather than "settled on" because of it.

**`Rotator` publishes `getCurrentIndex` and `getTargetIndex`, and `WheelController.getIndex` became
`getCurrentIndex`.** That last one was the outright wrong doc of the three: it said "which wedge is at the
marker" and held the target.

**The drum's hidden faces were left alone, against the reviewer's suggestion and an earlier reading of mine.**
A drum un-hides exactly one face for assistive technology, and it reads the **target**. Under a driving target
that face really is the one at the marker once the wheel rests; and while the wheel idles the library's own
position is that nothing is selected, so exposing the last landing is stable where tracking the marker would
churn the accessibility tree once per idle step. `wheel.spec.ts:401` pins that resting face.

**`Carousel` was already target-driven** — you write `index` and an effect turns the drum to match — so
the two primitives run the same way round now. `Carousel`'s prop keeps the vaguer name; it has no separate
current to be confused with.
