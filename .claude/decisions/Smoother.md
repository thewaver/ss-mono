# Decisions: `Smoother`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Smoother`: trailing a value is measured in time, and the pointer effects ease what they paint

**`smoothingMs` is a time constant, not a per-frame factor.** A factor applied each frame follows twice as fast on a 120Hz screen as on a 60Hz one. `SmootherUtils.getStep` closes the same share of the gap in the same milliseconds, whatever the frame rate. After one `smoothingMs` a value has closed about 63% of the gap. **The effects ease their output, not the pointer reading.** Easing the reading would leave every change into and out of rest as a snap: the pointer leaving the window, or crossing `activeRangePx`. Those are exactly where a trailing surface is expected to glide. So Tilter eases its leaning offset and strength, ShadowCaster its throw, blur and alpha, and LightCatcher its strength. Tilter's `boxRatio` stays where the pointer really is. The owner accepted refactoring this into the shared tracker in `backlog.md`'s _Open discussion_ later, and that move will have to answer the rest transitions again. **It adds no motion of its own**, so it reads no preference. `0` is the default and `isDisabled` stays the reduced-motion route.
