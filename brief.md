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
| [Missing components](#missing-components)               |     2 |
| [Blockers and known issues](#blockers-and-known-issues) |    11 |
| [Deliberately not built](#deliberately-not-built)       |    28 |
| [Accessibility gaps](#accessibility-gaps)               |     6 |
| [Planned projects](#planned-projects)                   |     1 |

---

## Missing components

Whole controls the library does not have. Ordered by the user on 2026-08-15. A segmented control, a
rating input, `Skeleton`, `Avatar`, `Badge`, `Card` and `Icon` were dropped on the same day and are not listed
anywhere.

| #   | What                  | Standing                                                                                                                    |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 9   | **Eyedropper**        | **Postponed until browser support exists.** Picking a colour by clicking anywhere on screen. Chromium-only, at 27%          |
| 4   | **A command palette** | **Bottom of the list.** A search over every action in the app, opened by a shortcut. `Select`'s autocomplete inside a modal |

## Blockers and known issues

Something that misbehaves, or a cost nobody has paid down.

| #   | Where                    | What happens                                                                                                                                          |
| --- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5   | **`AudioSwitcher`**      | **Deprioritised.** It has no Playground page, so its `playbackSignal` has never once been run                                                         |
| 20  | **Every anchored layer** | **Postponed until browser support exists.** A popup paints where its anchor was one frame ago, so it trails during a scroll                           |
| 12  | **`Viewport`, nested**   | Put one inside a box with no height of its own and it draws nothing at all, with no warning to say why                                                |
| 2   | **`Select`, filtered**   | While filtering, the highlight goes to the first option — so a filter that keeps an option that did not match highlights that one                     |
| 3   | **`Menu`**               | `Tab` closes the menu and puts focus back on the button, where the published pattern moves past it                                                    |
| 8   | **`Calendar`**           | The consumer's "is this date disabled" function is called once per cell, so 42 times for every render of a month                                      |
| 18  | **Carousels**            | Every slide is constructed whether or not it is on screen, so a hundred slides cost a hundred — forced, since a track has to be as wide as its slides |
| 16  | **`Scroller`**           | Press the button again before the first scroll has finished and the second press covers less than a page                                              |
| 7   | **`Toasts`**             | Re-adding an id while that toast is still fading out fades it back in, rather than starting it over                                                   |
| 19  | **`OverheadWheel`**      | A press up to 70px outside the circle still counts as a press on the wheel, which can steal one aimed at a control in a wedge                         |
| 19  | **`DrumWheel`**          | Change the number of faces while it is turning and the faces sit outside the box it reserved until the turn stops                                     |

## Deliberately not built

A capability a built control does not have, where the reason it does not is settled and written down.

| #   | Where               | What is not there                                                                                                                    |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Cell animation**  | It can slice a picture but not the control's own children, so nothing can be revealed from behind itself. Called too costly          |
| 2   | **`Select`**        | The consumer paints a group's heading but never the box around it, so a group cannot be given a background or a border               |
| 2   | **`Select`**        | The stress example measures the cost of building options, not of painting them; nothing addresses the painting half                  |
| 2   | **`Select`**        | Escape or clicking away clears what was typed rather than restoring the chosen option's text, which would need a string per option   |
| 3   | **`Menu`**          | No headings and no dividing lines, so a long menu cannot be broken into sections unless the consumer paints them                     |
| 8   | **`Calendar`**      | No week numbers down the side, and no showing two months at once                                                                     |
| 9   | **`ColorInput`**    | No native colour field underneath, so a plain form submit carries no value and there is no way back to the OS picker                 |
| 10  | **`Accordion`**     | Only the panel's height animates, so a panel cannot be made to slide in from the side                                                |
| 11  | **`Tabs`**          | Wiring a tab to its panel is optional and silent, so a consumer who never does it gets no warning that the two are unconnected       |
| 13  | **`Tree`**          | One press both opens a branch and selects it, because the arrow is drawn by the consumer and the component cannot tell the two apart |
| 13  | **`Tree`**          | One row selected at a time: no ticking several, no shift-extended range, no parent going half-ticked when some of its children are   |
| 14  | **`SlideButton`**   | The thumb has to reach the end; there is no setting for a hair-trigger part-way along                                                |
| 14  | **`SlideButton`**   | Slides sideways only — a vertical one needs the hit test, the arithmetic and the painter all redone on the other axis                |
| 14  | **`SlideButton`**   | One hold duration for everybody, with no route to one that follows the person rather than the control                                |
| 16  | **`Scroller`**      | Scrolls sideways only, for the same reason: every measurement in it reads one axis                                                   |
| 16  | **`Scroller`**      | A press moves as much as fits and there is no way to ask for less, so no lingering item of overlap for context                       |
| 17  | **`Paginator`**     | It takes a page count, not an item count, so the consumer divides and decides what an uneven last page means                         |
| 17  | **`Paginator`**     | Nothing hands back which rows the current page covers, so "showing 21 to 40 of 383" is the consumer's arithmetic                     |
| 17  | **`Paginator`**     | No "go to page" field to type into, which is the first thing a few hundred pages makes you want                                      |
| 17  | **`Paginator`**     | Every page number is its own tab stop, so a wide row with both end jumps is fifteen stops to walk past                               |
| 18  | **Carousels**       | One slide at a time; a page of several would also change what a picker dot stands for                                                |
| 18  | **Carousels**       | The library owns the movement, so one slide cannot be made to dissolve into the next                                                 |
| 19  | **`OverheadWheel`** | Its control goes in the hub and nowhere else; anywhere else means the consumer rendering their own                                   |
| 21  | **`Table`**         | A column cannot be held still while the rest scrolls, because that needs a settled pixel width per pinned column                     |
| 21  | **`Table`**         | Rows cannot be gathered under a heading, and there are no totals rows                                                                |
| 21  | **`Table`**         | A row cannot open to show detail underneath it                                                                                       |
| 21  | **`Table`**         | A cell cannot be edited where it sits; editing is whatever the consumer paints into it                                               |
| 21  | **`Table`**         | No filtering — sorting is the component's job and narrowing the rows is the consumer's                                               |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where               | What is missing                                                                                                                 |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 15  | **`Spotlight`**     | A prompt cannot hide the rest of the page from a screen reader: `inert` marks a subtree and cannot be lifted off one part of it |
| 18  | **Carousels**       | A carousel given no `renderControls` has no keyboard route into it whatsoever                                                   |
| 21  | **`Table`**         | A cell holding two controls can be reached but not stepped into — there is no key that moves between them                       |
| 16  | **`Scroller`**      | The buttons are the consumer's, so the library cannot promise one is named, reachable or in the tab order                       |
| 19  | **`OverheadWheel`** | The same again for the hub's control, with the same promise unmade                                                              |
| 14  | **`SlideButton`**   | A fixed hold duration is itself an assumption about dexterity, in a control that exists partly to avoid one                     |

## Planned projects

| #   | What                                          | Standing                                                                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 6   | **A consumer-facing layer above the library** | **Deferred indefinitely, not a focus, do not raise it.** The `style.css` strip and the theme are both built |
