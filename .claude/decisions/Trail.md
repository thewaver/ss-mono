# Decisions: `Trail`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Playback is `playback` everywhere, and `Trail` lost its `play` and `pause`

**The carousels' `playingSignal` and `Trail`'s `isPlayingSignal` are both `playback`**, matching
CellAnimation, ScanlineAnimation, AudioSwitcher and ParticleSpawner. **`Trail`'s `play()` and `pause()` commands are
gone**, because each only wrote the playback state, and _"Playback is a two-way value; a rewind is a command"_ puts that
in the signal. `seek` stays as the rewind-shaped command, and the controller keeps `getIsPlaying` for reading. The
Playground's Play and Pause buttons write the signal directly.

### `Trail`: a path, one traveler, and a frame loop chosen over the CSS the platform already has

Asked for by the user as the traveling half of a sketch that had spaced a list evenly along a curve: the
distribution was not the point, the traveling was. Three shapes were put to them — the component places and
the consumer moves it, the component travels, or both — and they chose the component traveling, with a
controller that pauses, resumes and sets the position.

**The frames are the user's call, made against the platform's own answer.** `offset-path` with
`offset-distance` and `offset-rotate` has been widely available across browsers since March 2022, moves
ordinary elements rather than only SVG ones, and would have run the whole animation off a stylesheet with no
per-frame JavaScript. Their reason for `requestAnimationFrame` instead — "just like with wheel and
CellAnimation, precisely to answer questions like that" — is that a CSS animation's current position is not a
value anything can read, so a consumer wanting to hang a label off the traveler, spawn something where it is,
or ask which way it is facing has nowhere to ask. The frame loop makes the place an ordinary signal, and every
other question about the component follows from that.

**The component owns an invisible path and hands the visible one to the consumer.** `getPointAtLength` needs a
real `SVGPathElement`, so there is one in the component's own `<svg>` with no fill and no stroke, and
`renderTrack` is called with the same `d` string beside it for whoever wants the track drawn. Two paths for one
curve is redundant and was chosen over both alternatives: a detached element created with `createElementNS` is
a browser-support gamble on geometry the spec does not require to work unrendered, and measuring the
consumer's own painted path would make the arithmetic depend on what they happened to draw — a track drawn as
two strokes, or not drawn at all, would break the traveling.

**The direction is sampled either side of the point rather than ahead of it.** One pixel back and one pixel on,
clamped to the ends of the path, so a traveler parked at 0 or at 1 still has a direction — sampling only
forwards leaves the last point with nothing to compare against and the angle collapses to zero exactly where a
looping trail is most often seen.

**A lap carries its overshoot into the next one.** A frame that took longer than the whole duration would
otherwise be truncated to the end and the trail would lose ground every time the tab was busy; looping takes
the remainder, and not looping stops at the end and writes `isPlaying` false so the consumer's own button
reads the truth. The controller is `getPlace`, `getIsPlaying`, `play`, `pause` and `seek`, and both of the
signals behind it are `SignalMirrorSolidUtils.createOptional`, exactly as `Rotator` takes its index and its auto-spin —
pass nothing and the trail simply runs.

**The loop stops while the page is hidden**, through `InteractionTrackerUtils.trackPageHidden`, for the same reason
`Rotator` does it: frames in a background tab are throttled to something that reads as a stutter when the tab
comes back.

**Reduced motion is the consumer's, which is the house pattern rather than a new decision.** Nothing in the
component reads the media query; `WheelPage` and `ScrambleTextPage` both read it themselves and hand the
component a different number, and the Trail page does the same by starting the circuit stopped. **Checked
2.2.2 Pause, Stop, Hide** — "for any moving, blinking or scrolling information that starts automatically,
lasts more than five seconds, and is presented in parallel with other content, there is a mechanism for the
user to pause, stop, or hide it". A looping trail is exactly that, so the mechanism has to exist: the
controller is it, and the circuit example carries Play, Pause and Back to start rather than leaving the demo
without one. `isTurning` defaults to false, since an element that keeps its own orientation is the less
surprising of the two.

### `Trail`: followers are offsets on one clock

**A convoy is one progress and one track, and each traveler is that progress minus its offset.** `followerOffsets` lists every traveler, the lead being `0`. On a loop, a follower wraps round behind the lead from the start. On a path that stops, it waits at the start until the lead is its offset ahead, and the run lasts one path length plus the largest offset. `durationMs` is scaled by the same amount so every traveler moves at a lone traveler's speed, and `1` still means the run is over — everybody at the end, `onLap` fired, playback written false.
