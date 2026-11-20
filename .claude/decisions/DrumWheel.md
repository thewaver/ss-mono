# Decisions: `DrumWheel`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `DrumWheel` page: three reels take one result through `computeSpinTarget`

**The example is gone; the user removed it because `Odometer`'s pull-to-spin reels already show a slot machine.**
What it established still holds for anyone building one out of wheels. **One press fetches one result, and each wheel's `computeSpinTarget` returns its own part of it.** Writing `targetIndex` instead would move a wheel without a spin's turns and easing. **The stop order comes from `spinDurationMs` alone**, 600ms more for each reel, because the settle that follows is the same length for all three. **"All stopped" is a countdown of `onSpinEnd` from the number of `spin()` calls that returned true**, so a wheel that declined is never waited for.
