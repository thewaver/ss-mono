# Decisions: `ParticleSpawner`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ParticleSpawner`: every engine shares one frame, measures first, and only while a round is in flight

From the same profiling, under the user's rule above. Each spawner used to run two measuring loops, its own box and its targets', on every frame for as long as the page was visible, paused or not; and its engine read those measurements after adding and removing particles, so each spawner's reads made the browser lay the page out again after the spawner before it had changed it — about eight forced layouts a frame at 96 spawners.

- **One animation frame for every engine on the page**, private to `ParticleSpawner.utils.ts`. In it every engine first calls `getFrame`, then every engine moves its particles, so measuring costs at most one layout a frame however many spawners there are. **An engine takes part only while something of its own moves** — a running played round or a sent one — so a paused or idle spawner does no work at all.
- **The view measures inside `getFrame`** rather than keeping observers, since the engine calls it only in the frame's reading half. `getCanSpawn` asks whether the spawner is on the page rather than whether it has been measured, and `drawParticle` places a particle against the boxes the last frame read, so a view drawing from a ref callback does not measure in the middle of its own commit.
- Measured at 96 spawners with the popup blur off: forced layouts 8.4 → 1.4 a frame, main thread 17–20 → 16 ms, 44–47 → 49 frames a second. Measuring calls went from about 250 to 194 a frame, two per active spawner, because the page's own examples paused behind the popup stopped measuring.
- **Targets are measured every frame a round is in flight, and no prop says they hold still** — the user's call, for the
  reason popovers measure their anchors: a consumer cannot be trusted to know a target is truly static, and a CSS
  animation moving one reports nothing. Measuring is about 8% of the 72-spawner stress test and nothing on an ordinary
  page.
- **A view drawing on the graphics card says so through `getIsDrawingElements`**, and the engine then asks for no element and writes no position: each view used to hand it stand-in objects to receive a CSS `translate` per particle per frame that nothing showed, 7% of the spawner stress test's work. Target centers are worked out once a frame, not once per particle.

### `ParticleSpawner`: `emit` sends a round alongside playback, and that is what makes a relay

**A pressed burst and a timed spawn are the same round, started by different things.** The frame loop animates a set of rounds, not the one round the playback effect owns. So `emit(count)` adds a round beside whatever is playing, on its own clock: pausing does not stop it and `progress` does not move it. An emitted particle finishes its trip. **That is what lets two spawners chain without drifting**: `onParticleArrive={() => relay.emit(1)}` starts the return trip at the exact frame of arrival, for a pressed spawn as much as a timed one. That is why neither a `ParticleRepeater` nor a `sources` prop exists, and that was the owner's call. A trip out and back from one spawner is no longer a relay but a route (below), which a scrubber can move. Many sources is many spawners. Timed chaining still belongs to `spawnIterationPatterns[].beginDelayMs`. **An emitted round is not a round of the pattern**, so it never calls `onIterationEnd` or `onAnimationEnd`. A consumer counting a pattern's rounds must not have presses mixed into the count. It returns `false` when it cannot act: nothing to send, no targets, not measured yet, or the page hidden. **A burst on press needs no library change at all**: give the spawner its own playback signal and one round, have the press write `true` and `onAnimationEnd` write `false`, and a press during a burst is a no-op because the signal already holds `true`. The Playground showed this as an example until the user removed it.

### `ParticleSpawner`: a round is worked out from its progress, so it pauses and scrubs

The user's call: each particle is evaluated from a timeline, as a cell is. **A played round makes every particle as it
starts** — its id, its route through `computeRoute` or `computeTarget`, the moment it sets off — and from then on which particles are
out and where each one is follows from `progress` alone, written by the engine while running and by a consumer to
scrub, as `CellAnimation`'s is. So `computeTarget` is asked for a whole round at its start rather than as each
particle sets off, and `computeParticlePos` must give the same point for the same particle, leg and `t` (the scatter
path keeps its random draws per id). Scrubbing never leaves the round, so nothing beyond the round needs to be
drawn the same twice.

- **Pausing freezes the round where it stands**; it used to take the round back. Playing again carries on. **Once the
  last round is done, playback switching back on starts the rounds over**, unlike `CellAnimation`, which stays ended:
  a burst on press writes playback on for each press and off at `onAnimationEnd`.
- **A spawner that has never played shows nothing until it is played or scrubbed**, unlike `CellAnimation`'s first
  frame: a burst on press before its first press, and a relay's return spawner, must stay empty. Only running, or a `progress` that
  differs from what the engine last wrote, makes a round, so a knob change while paused clears the spawner.
- **Callbacks run only from the running clock** — arrivals, round ends, the end — so a scrub runs none, as in
  `CellAnimation`. A relay therefore chains only while playing.
- **Rounds sent with `emit` keep their own clock and ignore playback**, because a relay's return spawner sits at
  `playback={false}` and only emits.
- **The Playground gives every example a pause button and scrubber except the stress test.** Round trip had none
  while it was a relay, since a scrubber would have moved the outbound round while the return particles kept their
  own clock; as a route inside one spawner it scrubs like the rest.
- **A `progress` shared by several spawners would advance once per spawner per frame**, since each adds its own elapsed
  time. **A read-only copy for the others was tried and dropped**: when the first spawner started its next round and
  wrote `0`, a follower still on its old round redrew that round from its start, so its last particles vanished
  before landing. So in the Playground's Grid and Many to one every spawner advances its own `progress`, and the
  scrubber shows the first one's and writes to all of them — the user's call. While running, a spawner leaves a
  `progress` written from outside to its next frame rather than drawing at once.

### `ParticleSpawner`: a route is a list of stops, and modifiers move a particle after its path

The user's calls, taken together so a particle's whole path can be traced and scrubbed however it is moved.

- **A route lives inside one spawner** rather than chaining spawners: `computeRoute(index, targetCount)` lists the
  stops a particle visits, each a target index or `"spawner"`. Left out, the route is the one stop `computeTarget`
  picks, so `computeTarget` stays as the short form. An empty route sends nothing; an index with no target behind it
  sends that leg to the spawner, as a missing target always did.
- **Each leg is one travel and one rest, with the spawner's own durations.** Stops carry no timing of their own; that
  was the plain reading of the user's "each leg with its own travel and rest", not a separate decision, and stops
  that time themselves would turn a stop into an object. A round lasts until its last particle's last leg ends, so
  `progress` covers the whole route.
- **`ParticleTravelDefs` describes one leg**: `from` and `to` are the leg's ends, `stop` is where it heads, `legIndex`
  and `legCount` place it in the route, and `origin` is the spawner's center whatever the leg. `targetIndex` became
  `stop` because a stop may be the spawner; `ParticleSpawnerParticle.targetIndex` became `route`.
  `computeParticleAnimation` gets the same leg, so the Playground's glow fades in only on the
  first leg and grows only on the last.
- **`onParticleArrive` runs once, at the end of the route**, as it did at the end of the only leg.
- **The tint is asked again on each leg**, so a route can change color at a stop — the user wanted Round trip's return
  in another color, as the relay had. The Playground's Round trip draws a white dot and tints it from the theme per
  leg; a tint is a multiply, so a colored picture could only darken toward the second color.
- **The Playground marks what a modifier does**: Attraction's dashed ring is the `modMarkers` element it pulls toward, and Wind's dashed
  arrow starts at the middle of the leg, points where the wind blows and is as long as `strengthPixels`, which is how
  far a particle is pushed there between gusts.
- **`particleModifiers` is a list of functions applied in order after `computeParticlePos`**, each taking the point,
  the leg, the leg's `t` and the milliseconds since the particle set off — the user's pick over a modifier per path or
  a force field the engine integrates. Integrating would make a position depend on every frame before it, which a
  scrub cannot replay; so a modifier, like a path, answers from its arguments alone. The list is read at every
  placement, so a knob changing a modifier shows on the next frame.
- **The factories are the library's, in `Generators/ParticleModifiers`** — the user's call. Both fade to nothing at
  each end of a leg (a sine over `t`), so a pushed particle still sets off from and lands on its stops and does not
  drift while resting; and both return the point unchanged under reduced motion. Checked 2.3.3 Animation from
  Interactions: "Motion animation triggered by interaction can be disabled", Level AAA; the spawner's motion is not
  triggered by an interaction, so it is outside that criterion, and honoring the preference is the library's habit
  rather than a requirement here.
- **Attraction pulls toward a fixed offset from the spawner's center, or toward one of `modMarkers`.** A modifier
  measures nothing itself, since it runs per particle per frame; `modMarkers` are elements the spawner measures every
  frame beside its targets and hands to modifiers as points — the user's pick, and the user's name (`landmarks` was
  dropped because ARIA already means a page region by it). A target nobody aims at was the other way, and rejected:
  random picking would send particles to it, and "target" should mean where particles go. Like Moving target, a
  marker moved by CSS is followed only while the spawner draws, so a paused or scrubbed spawner draws against wherever
  the marker is now. The Playground's ring bobs on a CSS animation; the wind's and attraction's defaults are guesses
  in `ParticleModifierDefaults` and the user's to tune.

### `ParticleSpawner`'s travel paths, easings and iteration patterns are library samples

The user's call. `Samples/ParticleSpawner/TravelPaths`, `TravelEasings` and `IterationPatterns` hold what the
Playground used to: the eight path factories with their registry and default options, the easings with
`applyOvershoot`, and the three iteration patterns. **The knobs' ranges, labels and hints stay in the Playground**, per
_"A default is stated once"_. Two helpers went to code the library already had a place for:
`SliceAnimationKeyframeUtils.createEnvelope`, which `ParticleField`'s examples use to hold a keyframe animation at its
ends, and `ParticleDissolveKeyframes.createAsh`, the dissolve's ash sample.

### `ParticleSpawner`: a stage waits before it begins, as the SVG animations do

**`beginDelayMs` is the wait before its own stage begins, the first stage included** — the user's call, taking the
SVG animation engine as the original and the guide, where the same field names mean "wait before this stage". The
spawner used to wait after a stage, by the finished stage's delay, and its first stage never waited. A `nextIndex`
past the end of the list counts as the end: the animation stops and `onAnimationEnd` runs once, where it used to
leave the spawner stopped without ever calling it.
