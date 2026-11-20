# Decisions: `ElementFader`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The floater appears and disappears through `ElementFader`, like every other library element that comes and goes

Settled, at the user's request, back when the left menu was several tab lists and a floater could be
stranded on a list that had lost its selection. The menu is a `Tree` now and no longer a consumer, but the
rule this settled is `Tabs`' and `RadioGroup`'s and still holds. A tab list with no selection has no
marker, and that was a hard cut: in the document one frame, gone the next, with no way for a consumer to
fade, shrink or slide it.

**`renderFloater` now takes the same pair every appearing element's painter takes** — a visibility target
of `0` or `1` and the transition duration — which is `Tooltip`, `Popover`, `Modal`, `Toasts` and
`Spotlight`'s signature, transition pair first. `ElementFaderUtils.createFader` is driven by "is there a
selected tab whose position we have measured", and the element is mounted while the fader says visible
**or** still transitioning.

**The duration is `getTransitionDurationMs`, the knob the floater already had**, rather than a second one
beside it: a list that slides in 300ms and fades in 80ms describes two animations to one eye. A consumer
who wants them apart puts a CSS `transition` in their painter.

**The stored bounds outlive the selection and die with the element, and both halves are load bearing.**
They are the last place the marker was, which is where the exit is drawn, so clearing them when the
selection goes unmounts the element with nothing to play out. Keeping them past the exit is the other
error and the one that shipped first: a list still holding a position starts its next entrance there, so
the marker returned where it had left and slid across to the new tab over the deliberately long duration.
A second effect watches the fader and clears them once the element is genuinely gone; the positioning
effect re-fills them on a selection change, and the render is gated on having bounds at all, so an entrance
cannot precede a fresh measurement.

The tail of `tabs.spec.ts` measures the rendered box rather than waiting for the entrance to settle — a
slide and an entrance take the same duration, so anything polling until the painter reaches its shown state
has already let the slide finish and passes either way. Checked by putting the fault back and watching the
assertion fail by 106 pixels.

**`TabsPage` grew a variant whose selection can be cleared**, since none of the other five can lose theirs.
It sets a longer duration on purpose: the middle of a 200ms transition is neither watchable by eye nor
readable by a spec without a race.

### `ElementFader`: the frame that starts a transition needs a fallback

`setTarget` flips `transitionTarget` inside a `requestAnimationFrame` so the browser
paints the pre-transition state first — without that the CSS transition has no start value. The bug was that
the frame was the _only_ path: `setHasTransitionFinished(false)` happens immediately,
`getIsVisible` is `transitionTarget === 1 || !hasTransitionFinished`, and the duration timer was armed only
inside the callback. So on a page that stops producing frames — a backgrounded tab — a dismissed `Modal`
never leaves: `getIsVisible` stays true, the `<Show>` stays mounted, and the focus trap stays with it.

It now schedules the same idempotent `commit` from both a frame and a timer, whichever arrives first,
canceling the loser.

### `ElementFader`: the end of a transition is the browser's answer, not the duration

**The duration was doing two jobs and was only right for one of them.** It says how long the stylesheet
animates for, which is what decides when the element may be unmounted — and it was also being used to decide
when the element has _stopped moving_, which is a different question.

**`Collapsible` is where it surfaced and where it was worst.** It waits for the flag, then scrolls the opened
section into view — and the two `scrollIntoView` calls a frame apart are what an earlier session added when
one call turned out not to be enough, which is the same bug seen from the other side. On a loaded machine the
section came to rest a few pixels short of being fully visible, and sometimes did not scroll at all. The
scroll position it settled on differed between runs of the same click.

**`getRef` is now given the outermost element the library owns, and the transition is over when
`element.getAnimations({ subtree: true })` all report finished.** The subtree matters because the animated
element is usually not the library's: a popup's shell belongs to the library and the thing that fades belongs
to whoever painted it.

**The timer stays, as the backstop rather than the decision.** While real animations are being watched it is
armed for the duration plus `BACKSTOP_GRACE_MS`; with nothing to watch it is armed for exactly the duration,
which is what every caller had before. A generation counter guards the settle against a fade reversed
mid-flight.

**Every consumer was given a ref rather than only the one that showed the fault.** The user's call, and the
reason is that the flag decides when a `Modal` unmounts and hands focus back, when a `Toasts` item is removed,
when a `Tabs` or `RadioGroup` floater stops being measured, and when a `Popover`, `Tooltip` or `Spotlight`
leaves the document — every one of which is the same question the accordion was getting wrong, just with a
less visible consequence. `Modal` grew a ref on its root; `ToastsItem` keeps its own beside the one it
forwards; the two floaters grew one each; `Popover`, `Preview` and `Spotlight` already had one to give.
