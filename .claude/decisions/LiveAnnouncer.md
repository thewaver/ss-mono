# Decisions: `LiveAnnouncer`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `LiveAnnouncer`: the region that belongs to no component

Settled, on the user's call, for `Calendar`'s month change.

**A live region only announces content inserted after it is already in the document** — the rule `Toasts`
records — which is why a component cannot mount one when it needs to speak. Two module-level regions, polite
and assertive, created on first use and kept, sidestep that. They live on `document.body` rather than in the
`Viewport` portal: nothing about them is painted, so the scale factor is irrelevant, and they must outlive any
subtree that might announce through them.

**A region can be reserved before there is anything to say.** `reserve(politeness)` creates one without
announcing, for a consumer that knows it will speak later and cannot afford the first message to be the one
that creates the region — `Toasts` calls it for both politeness levels when its stack mounts. Nothing else
needs it: a `Calendar` cannot announce a month change until someone has already paged it, by which time the
region has existed for as long as the page.

**Each message is its own node, removed a second later.** Setting the text of one persistent node does not
re-announce an identical string, so paging back to a month you were just on would be silent. Appending a fresh
child is an addition every time, which is what `aria-relevant="additions"` tells a reader to watch. Radix's
per-toast announce arrangement and React Aria's shared announcer, from the same constraint.

**Visually hidden by the clip-rect idiom, not `display: none` or `visibility: hidden`**, either of which
would take the text out of the accessibility tree along with the paint. The styles are applied imperatively
because the element is the library's own and never reaches a stylesheet.

**`Calendar` is the first consumer, and it formats the month itself.** Paging swaps all 42 cells and changes
nothing else, so a screen reader user hears nothing until they move focus. The month title on the page is the
consumer's markup — `Calendar` renders no header — so the announcement cannot be read off it and goes through
the same `Intl` path the day labels use. Politely, because paging is something the reader just did rather
than news. The previous month arrives as the effect's own argument, so the first run has nothing to compare
against and a calendar never talks about itself as it mounts.
