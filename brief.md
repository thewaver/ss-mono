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
| [Pending abstractions](#pending-abstractions)           |     4 |
| [Blockers and known issues](#blockers-and-known-issues) |    11 |
| [Deliberately not built](#deliberately-not-built)       |    28 |
| [Accessibility gaps](#accessibility-gaps)               |     6 |
| [Planned projects](#planned-projects)                   |     1 |

---

## Missing components

Whole controls the library does not have. Ordered by the user on 2026-08-15. A toolbar, a segmented control, a
rating input, `Skeleton`, `Avatar`, `Badge`, `Card` and `Icon` were dropped on the same day and are not listed
anywhere.

| #   | What                  | Standing                                                                                                                    |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 11  | **Eyedropper**        | **Postponed until browser support exists.** Picking a colour by clicking anywhere on screen. Chromium-only, at 27%          |
| 5   | **A command palette** | **Bottom of the list.** A search over every action in the app, opened by a shortcut. `Select`'s autocomplete inside a modal |

## Pending abstractions

Something two or more controls each want, that nothing owns yet.

| #    | What                                     | What it would serve                                                                                         |
| ---- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1, 6 | **Where on a control a press landed**    | A ripple has to start from the point pressed; a painter is told what state the control is in, never where   |
| 9    | **Measuring the element in front**       | A toast can measure itself but not its neighbour, so a pile cannot overlap by the real heights of its cards |
| 15   | **One list-flattener instead of two**    | Turning a nested list into the flat one the keyboard walks. `Select` has one, `Tree` has another            |
| 6    | **A control taking a getter and setter** | Controls take a `Signal`; a consumer holding the two halves separately wraps them in a `SignalMirror` first |

## Blockers and known issues

Something that misbehaves, or a cost nobody has paid down.

| #      | Where                      | What happens                                                                                                                      |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 7      | **`AudioSwitcher`**        | **Deprioritised.** It has no Playground page, so its `playbackSignal` has never once been run                                     |
| 22     | **Every anchored layer**   | **Postponed until browser support exists.** A popup paints where its anchor was one frame ago, so it trails during a scroll       |
| 14     | **`Viewport`, nested**     | Put one inside a box with no height of its own and it draws nothing at all, with no warning to say why                            |
| 3      | **`Select`, filtered**     | While filtering, the highlight goes to the first option — so a filter that keeps an option that did not match highlights that one |
| 4      | **`Menu`**                 | `Tab` closes the menu and puts focus back on the button, where the published pattern moves past it                                |
| 10     | **`Calendar`**             | The consumer's "is this date disabled" function is called once per cell, so 42 times for every render of a month                  |
| 12, 20 | **`Accordion`, carousels** | A collapsed panel and an off-screen slide are both fully built, so a hundred of them cost a hundred                               |
| 18     | **`Scroller`**             | Press the button again before the first scroll has finished and the second press covers less than a page                          |
| 9      | **`Toasts`**               | Re-adding an id while that toast is still fading out fades it back in, rather than starting it over                               |
| 21     | **`OverheadWheel`**        | A press up to 70px outside the circle still counts as a press on the wheel, which can steal one aimed at a control in a wedge     |
| 21     | **`DrumWheel`**            | Change the number of faces while it is turning and the faces sit outside the box it reserved until the turn stops                 |

## Deliberately not built

A capability a built control does not have, where the reason it does not is settled and written down.

| #   | Where               | What is not there                                                                                                                    |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2   | **Cell animation**  | It can slice a picture but not the control's own children, so nothing can be revealed from behind itself. Called too costly          |
| 3   | **`Select`**        | The consumer paints a group's heading but never the box around it, so a group cannot be given a background or a border               |
| 3   | **`Select`**        | The stress example measures the cost of building options, not of painting them; nothing addresses the painting half                  |
| 3   | **`Select`**        | Escape or clicking away clears what was typed rather than restoring the chosen option's text, which would need a string per option   |
| 4   | **`Menu`**          | No headings and no dividing lines, so a long menu cannot be broken into sections unless the consumer paints them                     |
| 10  | **`Calendar`**      | No week numbers down the side, and no showing two months at once                                                                     |
| 11  | **`ColorInput`**    | No native colour field underneath, so a plain form submit carries no value and there is no way back to the OS picker                 |
| 12  | **`Accordion`**     | Only the panel's height animates, so a panel cannot be made to slide in from the side                                                |
| 13  | **`Tabs`**          | Wiring a tab to its panel is optional and silent, so a consumer who never does it gets no warning that the two are unconnected       |
| 15  | **`Tree`**          | One press both opens a branch and selects it, because the arrow is drawn by the consumer and the component cannot tell the two apart |
| 15  | **`Tree`**          | One row selected at a time: no ticking several, no shift-extended range, no parent going half-ticked when some of its children are   |
| 16  | **`SlideButton`**   | The thumb has to reach the end; there is no setting for a hair-trigger part-way along                                                |
| 16  | **`SlideButton`**   | Slides sideways only — a vertical one needs the hit test, the arithmetic and the painter all redone on the other axis                |
| 16  | **`SlideButton`**   | One hold duration for everybody, with no route to one that follows the person rather than the control                                |
| 18  | **`Scroller`**      | Scrolls sideways only, for the same reason: every measurement in it reads one axis                                                   |
| 18  | **`Scroller`**      | A press moves as much as fits and there is no way to ask for less, so no lingering item of overlap for context                       |
| 19  | **`Paginator`**     | It takes a page count, not an item count, so the consumer divides and decides what an uneven last page means                         |
| 19  | **`Paginator`**     | Nothing hands back which rows the current page covers, so "showing 21 to 40 of 383" is the consumer's arithmetic                     |
| 19  | **`Paginator`**     | No "go to page" field to type into, which is the first thing a few hundred pages makes you want                                      |
| 19  | **`Paginator`**     | Every page number is its own tab stop, so a wide row with both end jumps is fifteen stops to walk past                               |
| 20  | **Carousels**       | One slide at a time; a page of several would also change what a picker dot stands for                                                |
| 20  | **Carousels**       | The library owns the movement, so one slide cannot be made to dissolve into the next                                                 |
| 21  | **`OverheadWheel`** | Its control goes in the hub and nowhere else; anywhere else means the consumer rendering their own                                   |
| 23  | **`Table`**         | A column cannot be held still while the rest scrolls, because that needs a settled pixel width per pinned column                     |
| 23  | **`Table`**         | Rows cannot be gathered under a heading, and there are no totals rows                                                                |
| 23  | **`Table`**         | A row cannot open to show detail underneath it                                                                                       |
| 23  | **`Table`**         | A cell cannot be edited where it sits; editing is whatever the consumer paints into it                                               |
| 23  | **`Table`**         | No filtering — sorting is the component's job and narrowing the rows is the consumer's                                               |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where               | What is missing                                                                                                                 |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 17  | **`Spotlight`**     | A prompt cannot hide the rest of the page from a screen reader: `inert` marks a subtree and cannot be lifted off one part of it |
| 20  | **Carousels**       | A carousel given no `renderControls` has no keyboard route into it whatsoever                                                   |
| 23  | **`Table`**         | A cell holding two controls can be reached but not stepped into — there is no key that moves between them                       |
| 18  | **`Scroller`**      | The buttons are the consumer's, so the library cannot promise one is named, reachable or in the tab order                       |
| 21  | **`OverheadWheel`** | The same again for the hub's control, with the same promise unmade                                                              |
| 16  | **`SlideButton`**   | A fixed hold duration is itself an assumption about dexterity, in a control that exists partly to avoid one                     |

## Planned projects

| #   | What                                          | Standing                                                                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 8   | **A consumer-facing layer above the library** | **Deferred indefinitely, not a focus, do not raise it.** The `style.css` strip and the theme are both built |
