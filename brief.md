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
| [Missing components](#missing-components)               |     4 |
| [Pending abstractions](#pending-abstractions)           |     6 |
| [Blockers and known issues](#blockers-and-known-issues) |    10 |
| [Accessibility gaps](#accessibility-gaps)               |     2 |
| [Planned projects](#planned-projects)                   |     1 |

---

## Missing components

Ordered by the user on 2026-08-15. A toolbar, a segmented control, a rating input, `Skeleton`, `Avatar`,
`Badge`, `Card` and `Icon` were dropped on the same day and are not listed anywhere.

| #   | What                                     | Standing                                                                                                  |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 11  | **Eyedropper**                           | **Postponed until browser support exists.** Chromium-only at 27%; re-open when Firefox or Safari ships it |
| 4   | **`menuitemcheckbox` / `menuitemradio`** | Stateful items are the line `Menu` sits on the other side of                                              |
| 5   | **`Table` / data grid**                  | **Bottom of the list.** A project rather than a component                                                 |
| 5   | **A command palette**                    | **Bottom of the list.** `Select`'s autocomplete in a `Modal`, plus grouped sources and a page-wide hotkey |

## Pending abstractions

| #     | What                               | What it would serve                                         |
| ----- | ---------------------------------- | ----------------------------------------------------------- |
| 1, 6  | **One-shot pointer geometry**      | Where a single activation landed, for ripples               |
| 9     | **A shared measuring abstract**    | Neighbour heights for a toast pile, auto-height elsewhere   |
| 15    | **One flattener instead of two**   | `SelectUtils.getFlatOptions` and `TreeUtils.getVisibleRows` |
| 3, 15 | **Shared `CheckedState`**          | `Select`'s group header and a multi-select `Tree`           |
| 3, 15 | **Windowing over nested lists**    | A group box straddling the window edge, unanswered for both |
| 6     | **Getter-plus-setter on controls** | Today a consumer wraps one in a `SignalMirror` first        |

## Blockers and known issues

| #      | Where                      | What happens                                                                                 |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------- |
| 7      | **`AudioSwitcher`**        | **Deprioritised.** No Playground page; its `playbackSignal` has never been run               |
| 22     | **Every anchored layer**   | **Postponed until browser support exists.** The fix is CSS anchor positioning, at 84%        |
| 14     | **`Viewport`, nested**     | An unsized host renders nothing and says nothing                                             |
| 3      | **`Select`, filtered**     | A filter injecting a non-matching option lands the highlight on it                           |
| 4      | **`Menu`**                 | `Tab` returns to the trigger rather than moving past it                                      |
| 10     | **`Calendar`**             | A consumer's disabled predicate is called once per cell, so 42 times per render              |
| 12, 20 | **`Accordion`, carousels** | Every panel and every slide is built, on the track by its width and on the drum by its faces |
| 18     | **`Scroller`**             | A second press mid-scroll advances less than a page                                          |
| 9      | **`Toasts`**               | An id re-added while leaving fades back in instead of restarting                             |
| 21     | **`OverheadWheel`**        | Hit-tests up to 70px outside its circle; nothing visible, a trap for a control in a wedge    |

## Accessibility gaps

They cluster, and no single item owns them.

| #   | Where           | What is missing                                                                                |
| --- | --------------- | ---------------------------------------------------------------------------------------------- |
| 17  | **`Spotlight`** | `prompt` cannot hide the page from a screen reader — `inert` cannot be lifted off a descendant |
| 20  | **Carousels**   | With no `renderControls` there is no keyboard route at all                                     |

## Planned projects

| #   | What                                          | Standing                                                                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 8   | **A consumer-facing layer above the library** | **Deferred indefinitely, not a focus, do not raise it.** The `style.css` strip and the theme are both built |
