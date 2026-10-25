# Lib brief

Everything outstanding in `components/src`, one line per fault, grouped by kind rather than by component. The
number after each line is its item in `backlog.md`, which holds the reasoning; this file holds none. The two
are edited together, and where they disagree this one is what gets corrected.

**Accepted limits are not here**, for the same reason they are not in the numbered items: they are not
outstanding work. They are at the end of `backlog.md`. **Neither is open discussion** — ideas nobody has
committed to building, in their own section beside the accepted limits. Both are excluded from this file on
purpose: it answers "what is outstanding", and neither of them is.

| Section                                                   | Count |
| --------------------------------------------------------- | ----: |
| [Blockers and known issues](#blockers-and-known-issues)   |     7 |
| [Deliberately not built](#deliberately-not-built)         |     1 |
| [Accessibility gaps](#accessibility-gaps)                 |     5 |
| [Planned projects](#planned-projects)                     |     4 |
| [Waiting on browser support](#waiting-on-browser-support) |     4 |

---

## Blockers and known issues

Something that misbehaves, or a cost nobody has paid down.

| #   | Where                      | What happens                                                                                                                                                                                                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11  | **Native form submit**     | **Pending decision.** `Select`, `MultiSelect` and `ColorInput` submit nothing, the date and time fields submit their display text, and `Form` hands `onSubmit` no values. One question, lofted, not discarded |
| 10  | **Any placed control**     | A layout guesses each item's box, so content wider than the guess overflows it and, on a ring, overlaps a neighbor                                                                                            |
| 10  | **Any placed control**     | Nothing stops a layout outgrowing the room it is in — a ring can reach past the screen, and a placed toolbar has nothing to collapse into                                                                     |
| 10  | **`Menu`, hold and flick** | How far a flick must travel to pick an item is a guess — about 30px on the demo wheel — not a measured number                                                                                                 |
| 12  | **`Die`, stepping**        | Pressing the same arrow a few times sends the die back and forth between two or three faces, because each step spins the new face upright. No fix chosen; the three put were judged inadequate                |
| 17  | **Every text field**       | In right-to-left text the leading and trailing slots stay on the physical left and right, the wrong way round                                                                                                 |
| 14  | **`Select`, long lists**   | Drawing the options on screen costs as much as it ever did; windowing only removed the cost of creating them. No fix known                                                                                    |

## Deliberately not built

A capability a built control does not have, where the reason it does not is settled and written down.

| #   | Where       | What is not there                                                     |
| --- | ----------- | --------------------------------------------------------------------- |
| 8   | **`Table`** | Rows cannot be gathered under a heading, and there are no totals rows |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where           | What is missing                                                                                                                 |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 4   | **`Spotlight`** | A prompt cannot hide the rest of the page from a screen reader: `inert` marks a subtree and cannot be lifted off one part of it |
| 6   | **`Carousel`**  | A carousel whose consumer builds no buttons on its controller has no keyboard route into it whatsoever                          |
| 8   | **`Table`**     | A cell holding two controls can be reached but not stepped into — there is no key that moves between them                       |
| 5   | **`Scroller`**  | The buttons are the consumer's, so the library cannot promise one is named, reachable or in the tab order                       |
| 13  | **Playground**  | In Windows high-contrast mode, painters drawn only in background colors vanish — Range's track and fill go white on white       |

## Planned projects

| #   | What                                          | Standing                                                                                                      |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 2   | **A consumer-facing layer above the library** | **Deferred to a near-future session of its own.** Painted, ready-to-use controls, as Magic UI sells templates |
| 18  | **Checkbox and Toggle text**                  | Their painters draw only the box; they should draw their text as Radio's does, and lose their Label sections  |
| 16  | **Docs pages awaiting ports and specs**       | Carousel, EdgeFader, Form, five text fields and four choice inputs have Docs pages in Solid only; specs lag   |
| 15  | **WCAG links and prop names in the docs**     | Intros, section text and the API tables name criteria and props as plain text; only the alerts link criteria  |

## Waiting on browser support

Work that is designed or understood and cannot be done well until browsers catch up. Each backlog item names what
to watch; nothing here is worth starting before then.

| #   | Where                            | What is waiting                                                                                                                                                                                                                                              |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3   | **`ColorInput`, eyedropper**     | Picking a color by clicking anywhere on screen. Chromium-only, at 27%. Waits on Firefox and Safari, or Baseline                                                                                                                                              |
| 1   | **Cell animation**               | It can slice a picture but not the control's own children; one picture of the element would do it, and that waits on HTML-in-Canvas                                                                                                                          |
| 7   | **Every anchored layer**         | A popup paints where its anchor was one frame ago, so it trails during a scroll. Waits on CSS anchor positioning reaching Baseline                                                                                                                           |
| 9   | **`GlassSurface`, ripple layer** | The rippled edge shows a defect under real GPU rendering that clipping it, however it's clipped, either reproduces or replaces with a different one — a known, unresolved gap in `backdrop-filter` plus `feDisplacementMap`, not particular to this codebase |
