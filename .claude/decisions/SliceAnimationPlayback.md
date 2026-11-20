# Decisions: `SliceAnimationPlayback`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `SliceAnimationPlayback`: which way a pass runs, and why the duration it is given is one-way

**Running a pass out and back is not a breakpoint, so it is not in `BreakpointOpts`.** `computeBreakpoints`
turns one cell's weight into the slice of the global timeline that cell animates in; playback direction decides
how that global timeline itself runs, before any cell's window is consulted. The two compose — reversing the
global timeline unwinds the whole staggered sequence, so the cell that arrived first is the last to leave — but
they answer different questions. The practical half of the argument is that `ScanlineAnimation` imports
`BreakpointOpts` for every one of its examples and has no use for playback, so widening it would have put inert
fields in front of every reader of that page. It is therefore its own namespace under `CellAnimation/Playback`,
and it composes at the Playground's call site rather than inside `computeAnimation`: the example transforms the
timeline it was handed and passes the result on, which leaves the keyframe helper's signature alone and puts
both halves of the pipeline in view together.

**The round trips are `stack` and `pipe`, and `alternate` was retired for them, on the user's call.** The first
build took all four of CSS's `animation-direction` names. Then the user asked for a second way back: under
`alternate` the cell that arrives first is the last to leave, and they wanted one where it is the first to leave
as well. With two round trips, `alternate` no longer said which one it meant, and CSS has no word for the new one,
so a second vocabulary was needed anyway. The user took the pair that names the difference directly: `stack`
(last in, first out, the old `alternate`) and `pipe` (first in, first out). Each has a `-reverse` form that
starts at the far end, as `alternate-reverse` did. `normal` and `reverse` keep their CSS names, since nothing
competes with them. The cost the user accepted is that a reader who knows CSS no longer recognizes `stack` as
their `alternate`.

**`pipe` is `stack` with the breakpoint direction flipped on the way back, and nothing else.** The shared
timeline runs identically under both. Running it backwards also reverses the cells' order, which is exactly
`stack`. For `pipe`, `computeBreakpointOpts` flips `asc`/`desc` while the pass is coming back. A cell's window
flipped end for end, read against a timeline running backwards, is that same cell's own trip played backwards.
So the cell that led the way out leads the way back too, and because the flip happens before easing, one cell
leaving under `pipe` moves exactly as the leading cell leaves under `stack`. The other approach was to have
playback return a second value and have `computeLocalTimeline` invert each cell's progress. It would have
changed the signatures of `computeLocalTimeline`, `computeAnimation` and every sample wrapper around them. This
keeps to the rule above: playback composes at the call site and the keyframe helper does not know about it. The
flip is decided at the loop's midpoint, which always falls inside the hold where every cell is resting at an
end, so it needs no duration and can never happen partway through a cell's trip.

**The Playground's duration field is the one-way trip, and the component is handed the whole cycle.**
`CellAnimation`'s `animationDurationMs` is the length of one iteration and still is; `computeCycleDurationMs`
turns the leg into that iteration — the leg unchanged when the direction is not a round trip, twice the leg plus
the hold when it does. The alternative, splitting the given duration between the two legs, makes the same
number mean two different speeds depending on a dropdown elsewhere: switching to `stack` would silently
double the pace of the part already being watched. The user set this one directly.

**The hold is milliseconds, not a share of the cycle.** A share is not a length — twenty per cent means one
thing at half a second and another at ten — so a ratio cannot be carried from one animation to the next, while
"park for four hundred milliseconds" survives every other change on the panel. It also sits beside two fields
already in milliseconds. Converting it to the ratio the timeline mapping actually needs takes both the hold and
the leg, which is why `computeCycleDurationMs` and `computeGlobalTimeline` both take the one-way duration as an
argument rather than reading a duration out of the options bag.

**The hold is at the far end only, because the near end already has a name.** `animationIterationDelayMs` is
the pause between iterations, and for a pass that returns to where it started, that pause falls exactly at the
near end. A second control for it would be two knobs over one gap.

**Two things are called direction, and the collision is accepted.**
`SliceAnimationBreakpoints.Direction` is `asc`/`desc` and says which cell goes first;
`SliceAnimationPlayback.Direction` says which way the pass runs and whether it comes back. Both are namespaced, and the
Playground labels them _Direction_ and _Playback direction_.

**The drawn gradient and pattern sources are timed to the cycle, not to the leg.** Those two examples serialize
`Shape`'s own gradients and patterns into a source with their animation written into the markup, timed so that
they run at the same length and rhythm as the cells — which is what their readout claims. Handing them the leg
would leave them looping at the old period while the cells take twice as long, so they take
`computeCycleDurationMs`'s answer too.
