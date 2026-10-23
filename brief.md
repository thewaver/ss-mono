# Lib brief

Everything outstanding in `components/src`, one line per fault, grouped by kind rather than by component. The
number after each line is its item in `backlog.md`, which holds the reasoning; this file holds none. The two
are edited together, and where they disagree this one is what gets corrected.

**Accepted limits are not here**, for the same reason they are not in the numbered items: they are not
outstanding work. They are at the end of `backlog.md`. **Neither is open discussion** — ideas nobody has
committed to building, in their own section beside the accepted limits. Both are excluded from this file on
purpose: it answers "what is outstanding", and neither of them is.

| Section                                                 | Count |
| ------------------------------------------------------- | ----: |
| [Missing components](#missing-components)               |     3 |
| [Blockers and known issues](#blockers-and-known-issues) |     7 |
| [Deliberately not built](#deliberately-not-built)       |    14 |
| [Accessibility gaps](#accessibility-gaps)               |     9 |
| [Planned projects](#planned-projects)                   |     4 |

---

## Missing components

Whole controls the library does not have. Ordered by the user on 2026-08-15. A segmented control, a
rating input, `Skeleton`, `Avatar`, `Badge`, `Card` and `Icon` were dropped on the same day and are not listed
anywhere.

| #   | What                  | Standing                                                                                                                                             |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6   | **Eyedropper**        | **Postponed until browser support exists.** Picking a color by clicking anywhere on screen. Chromium-only, at 27%                                    |
| 3   | **A command palette** | **Bottom of the list.** A search over every action in the app, opened by a shortcut. `Select`'s autocomplete inside a modal                          |
| 3   | **A scroll area**     | **Bottom of the list.** Custom-drawn scrollbars. CSS `scrollbar-color` and `scrollbar-width` cover the theme case; only a fading overlay bar is left |

## Blockers and known issues

Something that misbehaves, or a cost nobody has paid down.

| #   | Where                            | What happens                                                                                                                                                                                                                                                                                              |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4   | **What the specs cannot see**    | A green run covers less than it looks: nothing checks appearance, motion-only pages such as `CellAnimation` and `ScanlineAnimation` have no spec, and a callback nothing on the page uses goes untested.                                                                                                  |
| 19  | **Native form submit**           | **Pending decision.** `Select` submits nothing, the date and time fields submit their display text, and `Form` hands `onSubmit` no values. One question, lofted, not discarded                                                                                                                            |
| 13  | **Every anchored layer**         | **Postponed until browser support exists.** A popup paints where its anchor was one frame ago, so it trails during a scroll                                                                                                                                                                               |
| 16  | **`GlassSurface`, ripple layer** | **Postponed until the platform catches up.** The rippled edge shows a defect under real GPU rendering that clipping it, however it's clipped, either reproduces or replaces with a different one — a known, unresolved gap in `backdrop-filter` plus `feDisplacementMap`, not particular to this codebase |
| 17  | **Any placed control**           | A layout guesses each item's box, so content wider than the guess overflows it and, on a ring, overlaps a neighbor                                                                                                                                                                                        |
| 17  | **Any placed control**           | Nothing stops a layout outgrowing the room it is in — a ring can reach past the screen, and a placed toolbar has nothing to collapse into                                                                                                                                                                 |
| 20  | **`Die`, stepping**              | Pressing the same arrow a few times sends the die back and forth between two or three faces, because each step spins the new face upright. No fix chosen; the three put were judged inadequate                                                                                                            |

## Deliberately not built

A capability a built control does not have, where the reason it does not is settled and written down.

| #   | Where               | What is not there                                                                                                                                                               |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Cell animation**  | **Postponed until browser support exists.** It can slice a picture but not the control's own children; one picture of the element would do it, and that waits on HTML-in-Canvas |
| 2   | **`Select`**        | The stress example measures the cost of building options, not of painting them; nothing addresses the painting half                                                             |
| 6   | **`ColorInput`**    | No native color field underneath, so a plain form submit carries no value and there is no way back to the OS picker                                                             |
| 7   | **`SlideButton`**   | Slides sideways only — a vertical one needs the hit test, the arithmetic and the painter all redone on the other axis                                                           |
| 7   | **`SlideButton`**   | One hold duration for everybody, with no route to one that follows the person rather than the control                                                                           |
| 9   | **`Scroller`**      | Scrolls sideways only, for the same reason: every measurement in it reads one axis                                                                                              |
| 10  | **`Paginator`**     | Every page number is its own tab stop, so a wide row with both end jumps is fifteen stops to walk past                                                                          |
| 11  | **`Carousel`**      | One slide current at a time; a page of several would also change what a picker dot stands for                                                                                   |
| 12  | **`OverheadWheel`** | Its control goes in the hub and nowhere else; anywhere else means the consumer rendering their own                                                                              |
| 14  | **`Table`**         | A column cannot be held still while the rest scrolls, because that needs a settled pixel width per pinned column                                                                |
| 14  | **`Table`**         | Rows cannot be gathered under a heading, and there are no totals rows                                                                                                           |
| 14  | **`Table`**         | A row cannot open to show detail underneath it                                                                                                                                  |
| 14  | **`Table`**         | A cell cannot be edited where it sits; editing is whatever the consumer paints into it                                                                                          |
| 14  | **`Table`**         | No filtering — sorting is the component's job and narrowing the rows is the consumer's                                                                                          |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where               | What is missing                                                                                                                                     |
| --- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15  | **`Timeline`**      | It pans by dragging and zooms by pinching, and the library ships no pointer route that is neither — the consumer's buttons are the only answer      |
| 8   | **`Spotlight`**     | A prompt cannot hide the rest of the page from a screen reader: `inert` marks a subtree and cannot be lifted off one part of it                     |
| 11  | **`Carousel`**      | A carousel whose consumer builds no buttons on its controller has no keyboard route into it whatsoever                                              |
| 14  | **`Table`**         | A cell holding two controls can be reached but not stepped into — there is no key that moves between them                                           |
| 9   | **`Scroller`**      | The buttons are the consumer's, so the library cannot promise one is named, reachable or in the tab order                                           |
| 12  | **`OverheadWheel`** | The same again for the hub's control, with the same promise unmade                                                                                  |
| 7   | **`SlideButton`**   | A fixed hold duration is itself an assumption about dexterity, in a control that exists partly to avoid one                                         |
| 18  | **`CardStack`**     | A card is sent by a swipe, and the library ships no pointer route that is neither a gesture nor a drag — the consumer's buttons are the only answer |
| 21  | **Playground**      | In Windows high-contrast mode, painters drawn only in background colors vanish — Range's track and fill go white on white                           |

## Planned projects

| #   | What                                          | Standing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16  | **`GlassSurface` follow-ups**                 | Built and working, defaults now unified. Outstanding: nothing adopting it yet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 17  | **Arbitrary placement across controls**       | Items placeable anywhere rather than along a line. Built: the `Placement` abstract with the placed box, the picking, the sector and link path builders, one home for every layout sample, and ten controls taking an optional layout — `Menu` with `WheelMenu` and `FanMenu` over it, `OverheadWheel`, `Paginator`, `RadioGroup`, `Tabs`, `Stepper`, `Toolbar`, `Sortable`, `Tree` and `Formation`, the hold-and-flick gesture with its click-open and keyboard routes, and the split of the one arc factory into a band of wedges and an arc of boxes spaced evenly along the curve, each stated in ratios rather than lengths. Left: the faults the proving pass found, and a travel threshold nobody has measured. |
| 5   | **A consumer-facing layer above the library** | **Deferred to a near-future session of its own.** Painted, ready-to-use controls, as Magic UI sells templates. The `style.css` strip and the theme are both built                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
