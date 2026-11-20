# Decisions: `MediaQueryMonitor`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `MediaQueryMonitor`: a media query as an accessor, shared per query

Extracted on the user's call, from the flag `PointerTracker` briefly published and the ten lines `WheelPage`
briefly held: the reduced-motion preference should be reachable from plain JavaScript by anything that needs
it, rather than riding on an abstract that measures something else.

**It is a media query rather than a preference, because the mechanism is the general one.**
`MediaQueryMonitorUtils.create(query)` returns an accessor of whether the query matches, and
`createReducedMotion()` is the one named shortcut over it, so the query string is written once in the library
and nowhere else. Naming the general thing was the choice over a `ReducedMotionMonitor`: the next preference
worth reading — forced colors, reduced transparency, a color scheme — is the same code with a different
string, and a monitor per preference would be a file each.

**One `MediaQueryList` and one listener per distinct query, however many consumers ask.** A module-level map
keyed by the query string holds the signal and a subscriber count; the first consumer opens the listener and
the last closes it, the `Dismisser` shape again. Twelve consumers on one page is the case that makes it
matter — which as a listener each is what `Rotator` used to do with one wheel and would have done badly with
twelve. The signal stays in the map after the last consumer leaves, so a page mounting
the same query again reuses it rather than flickering from a stale `false`.

**Nothing in the library reads it internally.** `Rotator` stopped consulting the preference when the wheel's
enforcement was removed, and `PointerTracker` never did anything with it. Every consumer is a Playground page
or example, which is the point: the library reports, the consumer decides.
