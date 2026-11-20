# Decisions: `TurnClock`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### The timing both turning abstracts share is `TurnClock`

`Rotator` and `Roller` stay two abstracts, because one turns an angle and the other a rotation; folding them together would make every wheel carry the 3D arithmetic or every helper ask which kind it was. What they share is time, and it lives once in `TurnClockUtils`: a timed turn on animation frames with a backstop timer that lands it anyway in a tab that stops painting; a frame loop for drift, which owes nobody an answer and has no backstop; the rest after a landing; a target request that ignores the answer to a request canceled while it was awaited; and the rule for when a thing at a standstill should be idling. Pausing while the page is hidden was already shared through each framework's `InteractionTracker`. `Rotator` moved onto `TurnClock` without a change of behavior, which the wheel specs and `noAnimationFrames.spec.ts` confirm.
