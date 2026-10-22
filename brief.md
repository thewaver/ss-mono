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
| [Blockers and known issues](#blockers-and-known-issues) |    11 |
| [Deliberately not built](#deliberately-not-built)       |    24 |
| [Accessibility gaps](#accessibility-gaps)               |     9 |
| [Planned projects](#planned-projects)                   |     4 |

---

## Missing components

Whole controls the library does not have. Ordered by the user on 2026-08-15. A segmented control, a
rating input, `Skeleton`, `Avatar`, `Badge`, `Card` and `Icon` were dropped on the same day and are not listed
anywhere.

| #   | What                  | Standing                                                                                                                                             |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8   | **Eyedropper**        | **Postponed until browser support exists.** Picking a color by clicking anywhere on screen. Chromium-only, at 27%                                    |
| 4   | **A command palette** | **Bottom of the list.** A search over every action in the app, opened by a shortcut. `Select`'s autocomplete inside a modal                          |
| 4   | **A scroll area**     | **Bottom of the list.** Custom-drawn scrollbars. CSS `scrollbar-color` and `scrollbar-width` cover the theme case; only a fading overlay bar is left |

## Blockers and known issues

Something that misbehaves, or a cost nobody has paid down.

| #   | Where                            | What happens                                                                                                                                                                                                                                                                                              |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5   | **What the specs cannot see**    | A green run covers less than it looks: nothing checks appearance, motion-only pages such as `CellAnimation` and `ScanlineAnimation` have no spec, and a callback nothing on the page uses goes untested.                                                                                                  |
| 25  | **Native form submit**           | **Pending decision.** `Select` submits nothing, the date and time fields submit their display text, and `Form` hands `onSubmit` no values. One question, lofted, not discarded                                                                                                                            |
| 17  | **Every anchored layer**         | **Postponed until browser support exists.** A popup paints where its anchor was one frame ago, so it trails during a scroll                                                                                                                                                                               |
| 20  | **`GlassSurface`, ripple layer** | **Postponed until the platform catches up.** The rippled edge shows a defect under real GPU rendering that clipping it, however it's clipped, either reproduces or replaces with a different one — a known, unresolved gap in `backdrop-filter` plus `feDisplacementMap`, not particular to this codebase |
| 16  | **`OverheadWheel`**              | A press up to 70px outside the circle still counts as a press on the wheel, which can steal one aimed at a control in a wedge                                                                                                                                                                             |
| 16  | **`DrumWheel`**                  | Change the number of faces while it is turning and the faces sit outside the box it reserved until the turn stops                                                                                                                                                                                         |
| 21  | **Any placed control**           | A layout guesses each item's box, so content wider than the guess overflows it and, on a ring, overlaps a neighbor                                                                                                                                                                                        |
| 21  | **Any placed control**           | Nothing stops a layout outgrowing the room it is in — a ring can reach past the screen, and a placed toolbar has nothing to collapse into                                                                                                                                                                 |
| 21  | **`Stepper`, placed**            | `renderBody` is dropped without a word, a curve having nowhere to put a panel                                                                                                                                                                                                                             |
| 23  | **Anything turning in 3D**       | A component that turns under perspective sets aside room for the bulge, so its box stays bigger than its content even while it is standing still                                                                                                                                                          |
| 26  | **`Die`, stepping**              | Pressing the same arrow a few times sends the die back and forth between two or three faces, because each step spins the new face upright. No fix chosen; the three put were judged inadequate                                                                                                            |

## Deliberately not built

A capability a built control does not have, where the reason it does not is settled and written down.

| #   | Where               | What is not there                                                                                                                                                               |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Cell animation**  | **Postponed until browser support exists.** It can slice a picture but not the control's own children; one picture of the element would do it, and that waits on HTML-in-Canvas |
| 2   | **`Select`**        | The consumer paints a group's heading but never the box around it, so a group cannot be given a background or a border                                                          |
| 2   | **`Select`**        | The stress example measures the cost of building options, not of painting them; nothing addresses the painting half                                                             |
| 2   | **`Select`**        | Escape or clicking away clears what was typed rather than restoring the chosen option's text, which would need a string per option                                              |
| 3   | **`Menu`**          | No headings and no dividing lines, so a long menu cannot be broken into sections unless the consumer paints them                                                                |
| 7   | **`Calendar`**      | No week numbers down the side, and no showing two months at once                                                                                                                |
| 8   | **`ColorInput`**    | No native color field underneath, so a plain form submit carries no value and there is no way back to the OS picker                                                             |
| 9   | **`Tabs`**          | Wiring a tab to its panel is optional and silent, so a consumer who never does it gets no warning that the two are unconnected                                                  |
| 10  | **`Tree`**          | One press both opens a branch and selects it, because the arrow is drawn by the consumer and the component cannot tell the two apart                                            |
| 10  | **`Tree`**          | One row selected at a time: no ticking several, no shift-extended range, no parent going half-ticked when some of its children are                                              |
| 11  | **`SlideButton`**   | The thumb has to reach the end; there is no setting for a hair-trigger part-way along                                                                                           |
| 11  | **`SlideButton`**   | Slides sideways only — a vertical one needs the hit test, the arithmetic and the painter all redone on the other axis                                                           |
| 11  | **`SlideButton`**   | One hold duration for everybody, with no route to one that follows the person rather than the control                                                                           |
| 13  | **`Scroller`**      | Scrolls sideways only, for the same reason: every measurement in it reads one axis                                                                                              |
| 13  | **`Scroller`**      | A press moves as much as fits and there is no way to ask for less, so no lingering item of overlap for context                                                                  |
| 14  | **`Paginator`**     | Every page number is its own tab stop, so a wide row with both end jumps is fifteen stops to walk past                                                                          |
| 15  | **`Carousel`**      | One slide current at a time; a page of several would also change what a picker dot stands for                                                                                   |
| 16  | **`OverheadWheel`** | Its control goes in the hub and nowhere else; anywhere else means the consumer rendering their own                                                                              |
| 18  | **`Table`**         | A column cannot be held still while the rest scrolls, because that needs a settled pixel width per pinned column                                                                |
| 18  | **`Table`**         | Rows cannot be gathered under a heading, and there are no totals rows                                                                                                           |
| 18  | **`Table`**         | A row cannot open to show detail underneath it                                                                                                                                  |
| 18  | **`Table`**         | A cell cannot be edited where it sits; editing is whatever the consumer paints into it                                                                                          |
| 18  | **`Table`**         | No filtering — sorting is the component's job and narrowing the rows is the consumer's                                                                                          |
| 21  | **`Tree`, placed**  | No connector slot, so a radial tree's structure reads only from where its nodes sit                                                                                             |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where               | What is missing                                                                                                                                     |
| --- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 19  | **`Timeline`**      | It pans by dragging and zooms by pinching, and the library ships no pointer route that is neither — the consumer's buttons are the only answer      |
| 12  | **`Spotlight`**     | A prompt cannot hide the rest of the page from a screen reader: `inert` marks a subtree and cannot be lifted off one part of it                     |
| 15  | **`Carousel`**      | A carousel given no `renderControls` has no keyboard route into it whatsoever                                                                       |
| 18  | **`Table`**         | A cell holding two controls can be reached but not stepped into — there is no key that moves between them                                           |
| 13  | **`Scroller`**      | The buttons are the consumer's, so the library cannot promise one is named, reachable or in the tab order                                           |
| 16  | **`OverheadWheel`** | The same again for the hub's control, with the same promise unmade                                                                                  |
| 11  | **`SlideButton`**   | A fixed hold duration is itself an assumption about dexterity, in a control that exists partly to avoid one                                         |
| 24  | **`CardStack`**     | A card is sent by a swipe, and the library ships no pointer route that is neither a gesture nor a drag — the consumer's buttons are the only answer |
| 27  | **Playground**      | In Windows high-contrast mode, painters drawn only in background colors vanish — Range's track and fill go white on white                           |

## Planned projects

| #   | What                                          | Standing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20  | **`GlassSurface` follow-ups**                 | Built and working, defaults now unified. Outstanding: nothing adopting it yet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 21  | **Arbitrary placement across controls**       | Items placeable anywhere rather than along a line. Built: the `Placement` abstract with the placed box, the picking, the sector and link path builders, one home for every layout sample, and ten controls taking an optional layout — `Menu` with `WheelMenu` and `FanMenu` over it, `OverheadWheel`, `Paginator`, `RadioGroup`, `Tabs`, `Stepper`, `Toolbar`, `Sortable`, `Tree` and `Formation`, the hold-and-flick gesture with its click-open and keyboard routes, and the split of the one arc factory into a band of wedges and an arc of boxes spaced evenly along the curve, each stated in ratios rather than lengths. Left: the faults the proving pass found, and a travel threshold nobody has measured. |
| 22  | **Scanline page shape**                       | Twelve example boxes where eleven differ only by which compute function and which knobs. The knobs are derived already; collapsing the boxes into one example with a picker is what is left, and the readouts and the picker's shape need designing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 6   | **A consumer-facing layer above the library** | **Deferred to a near-future session of its own.** Painted, ready-to-use controls, as Magic UI sells templates. The `style.css` strip and the theme are both built                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
