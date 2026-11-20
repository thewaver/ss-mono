# Decisions: `LightCatcher`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `LightCatcher`: the lamp grid, on one element at a time

Asked for by the user after the other two were up, and named to pair with `ShadowCaster` on the metaphor
already written into it: the pointer is the light in the room, so one thing throws a shadow away from it and
the other catches it. The effect it replaces was the lamp grid on the pruned `PointerTracker` page, which the
user was sorry to lose — this is that, made general enough to wrap anything.

**Its falloff is `Tilter`'s and not `ShadowCaster`'s, and the two are different on purpose.** `ShadowCaster`
measures from the center, because a shadow's length is about how far away the light is and that is a
center-to-center question. Brightness is about how near the pointer is to the surface, so the ramp runs from
the surface's edge — full brightness anywhere on the content, fading to resting out at `lightRangePx`. A wide
panel and a narrow one therefore reach full brightness where they are actually pointed at rather than at a
distance that depends on their size.

**`restingBrightness` is what turns a row of them into a spotlight.** At its default of `1` the content is
exactly as the consumer painted it and the pointer only ever adds. Below `1` everything not being pointed at
is dimmed, so a row stops being a row of lamps that light up and becomes one lamp moving along a dark row —
the same components, a different idea, and no new prop to express it.

**Lightness sits beside brightness as a second pair of amounts, with no switch choosing between them.** The
user asked for a toggle between brightness, lightness or both, and chose this over a mode prop once the two
were set side by side. Brightness scales every channel, so black stays black and bright colors clip; lightness
fades toward white, so the dark parts lift most. They are on different scales — a multiplier untouched at `1`,
a fraction untouched at `0` — so they cannot share one pair of numbers, and once each has its own pair, "off" is
already expressible as leaving that pair untouched. A mode prop would have said the same thing a second time
and allowed the two to contradict each other, such as a lightness-only mode with a `maxBrightness` that is
silently ignored. The cost accepted is that lightness alone means also passing `maxBrightness={1}`.

**Lightness is a filter chain, not an overlay.** CSS has no `lightness()` function, but
`invert(1) brightness(1 − l) invert(1)` computes `c + l(1 − c)` on every channel, which is exactly a fade
toward white by `l`. It keeps the effect on the one `filter` property the family is defined by, needs no extra
element over the content, and the chain is left off entirely while lightness is at `0`, so a consumer who
never touches it pays for no inverts.
