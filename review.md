# Lib review

A review of `components/src` (the library) plus the package files beside it. **Section 1** is the brief list,
one line per item; **Section 2** carries the detail and the fix instructions for each. Items are numbered
once and the numbers do not move. Nothing here has been changed in code; every item waits for approval.

Tags: **BUG** a defect with a concrete failing scenario · **WCAG** an accessibility criterion the library's
own markup or behavior fails · **PERF** measurable wasted work · **INC** a departure from a convention or from
what the neighbors do · **PEC** a peculiarity (spelling, dead code, stray comments, formatting Prettier does not
govern, wrong docs).

Verification: every item was checked by reading the code at the cited lines. Items a reviewer raised that
turned out to be recorded as deliberate in `decisions.md` or `backlog.md` were dropped. Confidence is noted
where it is less than certain.

_Status: complete. Every folder of `components/src` plus the package files has been read; 170 items._

## How to work this list (for the session that applies the fixes)

- **Read each item's status in Section 1 first.** Most of this list is already done; the statuses are kept
  current as items land, and the legend under Section 1 says what each one means. Do not re-derive it from
  the code.
- **The 2.5.7 dragging items 62, 63, 65 and 66 joined the decision list** after being worked: each asks
  whether to build a single-pointer route or record the limit, which is the user's call rather than a defect.
- **Fix only the items the user has approved by number.** Nothing here is pre-approved.
- **Ask before fixing any item whose detail says "user's call", "user's word first", "behavior change", or offers
  two fixes (a) and (b).** Those are decisions, not defects: 23, 39 with 164 (decide together), 58, 77, 79, 108,
  109, 125, 131, 137, 144 (PlacementBox half), 147, 159, 162, 165. Present each as a lettered choice and wait.
- **Item 59 joined that list after being worked.** Its finding holds, but every route to a fix is an API-surface
  decision rather than a defect repair; the choices are written out in its detail.
- **Locate every site by the quoted code, never by the line number.** Numbers are as of the review and drift as
  fixes land.
- **Re-read the code before editing any item marked Medium.** Every BUG and WCAG item was verified against the
  code, but a Medium rests on one reading.
- **A spec that goes red after a fix is reported, not rewritten.** Items 22, 125 and any doc-versus-code item may
  turn an existing `e2e/` or unit assertion red on purpose. Say which assertion fails and what it expects, and
  stop; the user decides whether the spec or the code is right (CLAUDE.md, "A failing test is not evidence the
  code is wrong").
- **Do not bundle.** One item, one change. A judgment call found while fixing goes into the reply, not into the
  edit.
- **Fixes that touch `playground/src`** (12, 30, 90, 101, 142, 151, 152, 154) are in scope for the fix; say so in
  the reply since the user reviews by running the app.
- **Where an item says to record something in `decisions.md`**, write it in that file's voice, or into the
  staging file if two machines are running (CLAUDE.md, "Staging documents").
- **Update this file as each item closes**, per CLAUDE.md _"An itemized source of work is updated as items
  land"_ — the next session reads Section 1 to tell done from pending.
- After the approved items are done, delete `.scratch/review/` and, if the user agrees, this file.

---

## 1. Brief list

**Every item carries its status, kept up to date as the work lands.** `done` means the fix is in and its
specs pass; `partly done` means the mechanical half is in and what is left is a judgment call written up in
that item's detail; `closed with no code change` means the item was withdrawn, with the reason in its detail;
`waiting on the user` is the review's own list of decisions plus the four 2.5.7 items; `not started` is
untouched work anyone may pick up. Current count: 168 done, 2 closed, nothing outstanding.

**Every item on this list is closed.** The reasoning behind each decision is in its own entry in Section 2, and
the parts that outlived the review have moved to `conventions.md` and `decisions.md`.

**`backlog.md` item 26 closed** with item 102, and `brief.md` lost its line for it in the same change.

**Six `e2e/` specs were already red before any of this work began**, checked by running the suite against a
pristine copy of the starting commit: `accordion.spec.ts:255`, `slideButton.spec.ts:88`,
`wheel.spec.ts:295`, `wheel.spec.ts:470` and two of the three `scroller.spec.ts` position tests, which
rotate between themselves run to run. A session seeing those red has not broken them.

### Package files

1. **PEC** README usage example passes children to `Button`, which takes `renderContent`. — **done**
2. **PEC** README lists `MaskedField` as a form control; no such component exists. — **done**
3. **PEC** llms.txt calls the Abstracts "framework-agnostic"; 33 of their files import solid-js. — **done**
4. **INC** `index.ts` omits `spot_smear_1` while exporting every sibling sample. — **done**
5. **PEC** Six files fail `prettier --check`. — **done**
6. **INC** `index.ts` ordering drifts from alphabetical within folders in about a dozen places. — **done**

### Spelling (repo rule: US English)

7. **PEC** About 45 British spellings across the library, including two identifiers. — **done**

### Primitives and Composites

8. **BUG** `InteractionWrapper` tests `min-width` on the raw prop instead of its value. — **done**
9. **PEC** `InteractionWrapper`'s console warning names props by their old `get` names. — **done**
10. **PEC** Commented-out code in `PlacementItem.css.ts` and `Wheel.css.ts`. — **done**
11. **INC** `Barrel.utils` names `HALF` yet writes a bare `0.5` in the same file. — **done**
12. **INC** `Carousel` gives `computeSlideLabel` a 1-based index; `Wheel` gives `computeWedgeLabel` a 0-based one. — **done**
13. **INC** Only `Toasts` and `Spotlight` reserve their live region on mount; six other announcers do not. — **done**
14. **INC** `Spotlight` spells `Point2d` inline as `{ x; y }`. — **done**
15. **PEC** `WheelUtils` and `DRUM_PERSPECTIVE_PX` have no caller anywhere. — **done**
16. **INC** `BARREL_PERSPECTIVE_PX` is exported outside its namespace. — **done**
17. **PERF** `GlassSurface` builds the margined clip path twice per change. — **done**
18. **PERF** `MosaicUtils.packScaled` builds prefix sums with an O(n²) spread. — **done**
19. ~~`carouselControl` composes an empty style object.~~ Declined: that form is the house majority, and the built CSS is identical either way. — **closed with no code change, see the detail**
20. **PEC** The resting arrangement literal is duplicated in two `PlacementBox` files. — **done**
21. **INC** Render-callback state types are documented in some Primitives and not others. — **done**

### Abstracts, second half

22. **BUG** `getGapPlacement` throws on the end gaps of a two-item run (crashes a two-item laid-out `Sortable`). — **done**
23. **BUG** Writing `indexSignal` from outside does not turn the wheel (medium confidence on intent). — **done**
24. **BUG** A spin whose target resolves after unmount still runs and announces. — **done**
25. **BUG** Gradient stop count is frozen at first render, and each stop recomputes all stops per frame. — **done**
26. **BUG** A repeated non-BMP character (emoji) does not cycle in typeahead. — **done**
27. **BUG** Virtualizer `overscan` is read once although typed as an accessor. — **done**
28. **INC** `NavigatorCell` / `NavigatorGrid` name grid indices `x`/`y` against the row/col convention. — **done**
29. **INC** Two `.types.ts` files import ss-utils types as values. — **done**
30. **INC** `Virtualizer` takes `getIsEnabled` where the house prefers `getIsDisabled`. — **done**
31. **INC** Missing blank-line grouping in the two SVG `.utils.tsx` files. — **done**
32. **PEC** `SVGBaseFilterDefs` is an empty type intersected into eleven types. — **done**
33. **PEC** `{...{ in: srcIn }}` spread where `in={srcIn}` is used beside it. — **done**
34. **PEC** Bare `* 3` and `/ 1000` in files that name their other numbers. — **done**
35. **PEC** `computePattern` spells `Index2d` inline three times. — **done**
36. **PEC** `LiveAnnouncerUtils.clear` has no caller. — **done**

### Abstracts, first half

37. **BUG** Swipe tracking wedges after a mouse release outside the element; every later swipe is dropped. — **done**
38. **BUG** `Carrier` drag leaks listeners after an off-element release and then fires pick-up twice. — **done**
39. **BUG** `DateTimeValue.createSplit` ignores a whole-value clear, so both fields keep stale values. — **done**
40. **INC** `Glass.utils.tsx` contains no JSX and should be `.ts`. — **done**
41. **INC** A private helper is declared inside the `GlassUtils` namespace. — **done**
42. **INC** `DateValueUtils.getCellOf` returns an `x`/`y` pair for a row-and-column index. — **done**
43. **INC** Two utils files call their own namespace by name from inside. _Done, across all four._ — **done**
44. **INC** `ColorExtractor.context.ts` carries two inline numeric defaults instead of `DEFAULT_X` constants. — **done**
45. **INC** Three utils files leave their private helpers undocumented where eleven neighbors document theirs. — **done**
46. **PEC** `getYearsInEra` doc promises `Infinity` that never arrives, contradicting its test and conventions.md. — **done**
47. **PEC** `InteractionActivation.count` is documented as a burst count but only ever increments. — **done**
48. **PEC** Unnamed magic date and hour in `getWeekdayNames`. — **done**
49. **PEC** `FrameRateMonitor` re-implements `trackPageHidden`. — **done**
50. **PEC** Two redundant non-null assertions on exhaustive switches in `Anchor.utils`. — **done**

### Essentials/Input, second half (FormField … Toggle)

51. **WCAG** `TagInput`'s field ignores the `FormField` message and the `Label` caption (3.3.1, 1.3.1, 2.5.3). — **done**
52. **BUG** `TagInput` chips are all tab stops; the written `tabindex={-1}` is overwritten by the wrapper. — **done**
53. **BUG** `TimeInput` steps and flips am/pm while read-only, and flips am/pm while disabled. — **done**
54. **BUG** `NumberInput` fires `onInput` on blur and at a bound when the value did not change. — **done**
55. **INC** `NumberInputProps` hand-writes `MaybeAccessor` with no `AccessorProps` block. — **done**
56. **INC** `Radio` decides reachability from prop presence while its wrapper reads the value. — **done**
57. **WCAG** A vertical `Range` states no `aria-orientation` (4.1.2). — **done**
58. **BUG** `TimePicker` can be opened while disabled. — **done**
59. **BUG** `TimePicker`'s trigger cannot own its popup, so a press in the clock dismisses an enclosing layer. — **done**
60. **BUG** A click on `TagInput`'s padding focuses a disabled field. — **done**
61. **PEC** `Select.utils` documents an `aria-describedby` that nothing writes. — **done**

### Essentials, second half (Paginator … ViewportWrapper)

62. **WCAG** `SplitPane` gutter moves only by dragging or keyboard; no single-pointer route (2.5.7). — **done**
63. **WCAG** `Table` column resize and reorder are drag-only for a pointer (2.5.7). — **done**
64. **WCAG** A non-navigable `Stepper` step is a nameless, sometimes focusable `<span>` (4.1.2). — **done**
65. **WCAG** `SplitPane` splitter lacks Home/End, `aria-controls`, and puts `separator` on a `<button>`. — **done**
66. **WCAG** `Sortable` items are operable but announce as static list items (4.1.2). — **done**
67. **BUG** A disabled `Table` cannot be navigated with the arrow keys. — **done**
68. **BUG** Windowed `Tree` typeahead cannot find rows that are not rendered. — **done**
69. **PERF** `Table` selection membership is an array scan per cell and per row. — **done**
70. **INC** `Sortable` re-implements the 1D roving walk instead of `computeNextPosition`. — **done**
71. **PEC** `INTERACTIVE_SELECTOR` is copied verbatim into four components. — **done**
72. **PEC** Hand-written clamps where `MathUtils.clamp` / `clamp01` exist (Scroller, Sortable, Table). — **done**
73. **PEC** `Preview` prop documentation describes the wrong thing for `sizing` and `id`. — **done**
74. **PEC** `Tooltip` constant named `DEFAULT_…` holds an attribute name, not a default. — **done**
75. **PEC** `Stepper`'s `<ol>` carries `aria-orientation`, which the list role does not support. _Done._ — **done**
76. **PEC** Missing blank line between constant groups in `Sortable`. — **done**

### Essentials/Input, first half (Calendar … FileInput)

77. **BUG** `ColorInput` overwrites a non-hex starting value with black on mount. — **done**
78. **BUG** `ColorArea` drag writes the signal twice per move and fires `onInput` with a half-updated color. — **done**
79. **WCAG** Arrow-walking onto a day or time disabled by the consumer's predicate lands focus with no ring (2.4.7). — **done**
80. **PERF** `Clock` copies its ref record and scrolls every column once per option at mount. — **done**
81. **PERF** `DateInput` rebuilds the twelve-month day ceiling on every keystroke. — **done**
82. **INC** `DatePicker` and `DateRangePicker` redeclare `locale` without a doc block. — **done**
83. **WCAG** `ColorInput`'s popup dialog is named from the raw prop, so a `Label`-named field has an unnamed dialog. — **done**
84. **PEC** `ColorInput.types.ts` imports the same module on two consecutive lines. — **done**
85. **PEC** `Calendar.css.ts` names `WEEK_COLUMNS = 7` beside `Calendar.tsx`'s `DAYS_PER_WEEK = 7`. — **done**
86. **INC** `ColorArea.tsx` declares a helper above its `DEFAULT_` constants. — **done**

### Essentials, first half (Accordions … Modal)

87. **BUG** `Collapsible` calls the consumer's `ref` twice for one element. — **done**
88. **WCAG** A `Modal` with no focusable content never takes focus, so Tab walks the page behind it (2.4.3). — **done**
89. **WCAG** The current breadcrumb is a tab stop with a pointer cursor and no role (4.1.2, 2.4.3). — **done**
90. **WCAG** `ImageSwitcher` hardcodes `alt=""`; a meaningful picture can never carry an alternative (1.1.1). — **done**
91. **BUG** `ImageSwitcher`'s preloader requests with CORS while the visible `<img>` does not. — **done**
92. **PERF** Every mounted `Menu`/`ContextMenu` holds a document `pointermove` listener, open or closed. — **done**
93. **PEC** Four dead style exports in `Accordion.css.ts` ship unused CSS. — **done**
94. **INC** `Menu.css.ts` copies the button reset instead of composing `buttonElement` (7 of 8 compose). — **done**
95. **PEC** Four prop doc blocks describe something the prop does not do (Accordion, Collapsible, Form, Menu). — **done**
96. **PEC** `ContextMenu` duplicates `Menu`'s pick logic verbatim. — **done**
97. **BUG** `AudioSwitcher` drops a volume change made during a crossfade. — **done**
98. **BUG** A cancelled hold leaves `Menu`'s toggle latch set; the next trigger press does nothing. — **done**
99. **INC** `FanMenuProps.layoutDefs` sits in a bare intersection rather than an `AccessorProps` block. — **done**
100.    **PEC** `AudioSwitcher`: split imports and three guards that can never fail. — **done**
101.    **INC** `Breadcrumbs`' `<nav>` landmark can be left unnamed; `ContextMenu` requires its label. — **done**
102.    **WCAG** `ContextMenu` has no keyboard opener and anchors at a pointer coordinate (2.1.1). — **done**
103.    **PEC** `MenuTriggerProps` re-declares `ariaLabel` undocumented. — **done**

### Exotics, first half (Bracket … Odometer)

104. **BUG** `Bracket`'s toRoot/toLeaves steps land on disabled nodes and displace the roving stop. — **done**
105. **BUG** A clicked `Bracket` node takes the tab stop but not the focus (no `tabindex="-1"`). — **done**
106. **PERF** `Bracket` rebuilds every node element whenever the tree object changes. — **done**
107. **BUG** `Bracket` node refs are never cleared on unmount. — **done**
108. **PEC** The `Corners` prop docs describe a per-corner fade; the fade is the container's, by design. — **done**
109. **PEC** `CellAnimation`'s iteration-count doc claims zero is endless; the endless value is `Infinity`. — **done**
110. **PERF** `CellAnimation` root size has no equality check, so a sub-pixel resize restarts the pass. — **done**
111. **PEC** Bare `100` in `CellAnimation`'s z-index where the file names its numbers. — **done**
112. **WCAG** `Odometer`'s `ariaLabel` sits on a role-less div and produces no accessible name (1.3.1). — **done**
113. **PEC** `OdometerSlot.digitIndex` is computed and documented but read by nothing. — **done**
114. **PERF** `ElementMosaic` opens one `ResizeObserver` and runs one full re-pack per item. — **done**
115. **PERF** `ImageMosaic` runs one full re-pack per image as pictures load. — **done**
116. **BUG** Changing `ImageMosaic` sources mid-load re-downloads everything and lets dropped images write back. — **done**
117. **INC** `Cuboid` and `FlipCard` destructure a `*Signal` prop once at setup instead of `accessSignal`. — **done**
118. **PEC** `FormationInset` is exported and used nowhere. — **done**
119. **PEC** "centring" in `Bracket.utils.ts` (add to item 7's list). — **done**

### Exotics, second half (ParticleSpawner … Wheels)

120. **BUG** A `PatchBoard` whose first node is disabled has no tab stop at all (2.1.1). — **done**
121. **WCAG** A socket on a disabled `PatchBoard` node announces itself as enabled (4.1.2). — **done**
122. **PERF** `PatchBoard` rescans every socket for every socket on every pointer move (O(S²)). — **done**
123. **WCAG** `Timeline` puts `aria-posinset`/`aria-setsize` on a `button` role that ignores them (4.1.2). — **done**
124. **WCAG** `Timeline` and `Bracket` erase the focus outline unconditionally on the focusable element (2.4.7). — **done**
125. **BUG** `restartAnimation` refuses to restart a running `Typewriter`/`ScrambleText`, against conventions.md. — **done**
126. **PERF** `Typewriter` tears down and rebuilds every character on each resize callback. — **done**
127. **PERF** `ParticleSpawner` writes the particle list once per particle inside the frame loop. — **done**
128. **PERF** `Shape` recomputes every path on a resize callback that changed nothing. — **done**
129. **PERF** `Timeline` and `SortableGrid` copy their whole ref collection per item mount. — **done**
130. **INC** The one remaining `/ 2` in the library, beside a `HALF` constant (`TileBoard.utils.ts:20`). — **done**
131. **INC** `SortableGrid` and `CellAnimation` name grid coordinates and tallies `x`/`y`. — **done**
132. **BUG** `SortableGrid` calls the consumer's `ref` callback twice. — **done**
133. **WCAG** `ScratchCard` throws focus to the body when the cover clears (2.4.3). — **done**
134. **PEC** `RichText` has an unreachable `try`/`catch` holding the tree's only `console.error`. — **done**
135. **INC** A memo named `parsedTree` without the `get` prefix (`RichText`). — **done**
136. **INC** `aria-hidden={"true"}` in braces at three sites where the house writes `aria-hidden="true"`. — **done**
137. **WCAG** `PatchBoard` sockets sit loose inside `role="list"` without being list items (1.3.1). — **done**
138. **PERF** `ScrambleText` rolls a new glyph for every character every tick, settled ones included. — **done**

### Cross-cutting sweep (new items; other hits were folded into 7, 16, 29, 30, 40, 82, 116)

139. ~~44 namespace members in four `Samples` utils files carry no doc block.~~ Killed: the user has postponed the question of documenting `Samples` at all. — **closed with no code change, see the detail**
140. **INC** `Typewriter` writes one prop's default inline, twice, beside three named defaults. — **done**
141. **INC** `ScreenWiper`'s deferred `setTimeout` is never stored or cleared. — **done**
142. **INC** `ScanlineAnimationKeyframes.knobs.ts` exports `ScanlineAnimationKnobs`, dropping the stem. — **done**
143. **INC** `Clock.utils.ts` is the only `.utils.ts` missing from `index.ts`. — **done**
144. **INC** `RadioGroup` exports its context type but not its provider/hook; `PlacementBox` exports neither. — **done**
145. **INC** `SVGDefs.utils.ts` publishes a type (`CycleColorKey`) from inside its namespace. — **done**

### Samples

146. **PERF** Every trail stamp opens its own pointer tracker on the same element (35 per sample instance). — **done**
147. **BUG** A trail sample emits 35 `<filter>` defs sharing one DOM id once blur is above zero. — **done**
148. **INC** The two gradient knob modules drop the `SampleKnobs<T>` type check the design relies on. — **done**
149. **INC** The gradient step default is written in two places (`STEPS_DEFAULT` and `DEFAULT_GRADIENT_STEPS`). — **done**
150. **INC** A private constant sits inside the exported `TrackedGradientKnobs` namespace. — **done**
151. **INC** The `Bracket` registries are the only ones not named `SAMPLE_*` or publishing `SampleKey`/`SAMPLE_KEYS`. — **done**
152. **INC** `Iteration` and `Pattern` publish a key type but no `SAMPLE_KEYS` list; three pages cast instead. — **done**
153. **INC** Four Timed samples spell the transparent color by hand instead of `getTransparentColor`. — **done**
154. **INC** `whirlCurved_2` is the only camelCase key in the snake_case SVG registries. — **done**
155. **PEC** `encircle` writes thirds as `0.33` and `0.66`. — **done**
156. **PEC** `NOTHING + 1` as a one-unit threshold in the bracket connector paths. — **done**
157. **INC** `PlacementLayoutKnobs`' family maps and declaration runs are in three different orders. — **done**
158. **INC** The band gradient's five-stop ramp is written out twice and factored out once. — **done**
159. **INC** `radar` and `spiral` samples pass five bare numbers where the ripple samples name theirs. — **done**
160. **PEC** `NO_ITEMS` is `PlacementLayouts.utils.ts`'s general-purpose zero, in fourteen non-count uses. — **done**
161. **PEC** `SVGAnimations.const.tsx` mixes `Arr`/`Array` parameter names and bypasses its own `join` helper. — **done**
162. **PEC** `swarmCw` and `swarmCcw` disagree on one stop of an otherwise mirrored pair. — **done**

### Essentials/Input, first half (late report; adds to 77–86)

163. **BUG** `Clock`: Enter commits only the current column, throwing away the walk in the others. — **done**
164. **BUG** `DateRangePicker`: clear one field and retype it, and the range never comes back. — **done**
165. **WCAG** `ColorInput`'s picker cannot be reached with a keyboard; Tab leaves and closes it (2.1.1). — **done**
166. **BUG** `DateRangePicker` and `DateTimePicker` put one `id` and one `name` on two inputs. — **done**
167. **BUG** `RangeCalendar`: finishing a range jumps focus back to its start day. — **done**
168. **PEC** `["Enter", " "]` is declared in six files under three names. — **done**
169. **PERF** `Calendar` builds a new `Intl.DateTimeFormat` for every cell label, 42 per month page. — **done**
170. **PEC** `DateRangePicker`'s Escape lands on the start field, not the end field that holds the trigger. — **done**

---

## 2. Detail and fix instructions

Paths are relative to the repo root. Line numbers are as of this review.

### Package files

**1. README example uses children on `Button`.** `components/README.md` "Usage" shows
`<Button onClick={…}>Click me</Button>`. `ButtonProps` (`components/src/Essentials/Button/Button.types.ts`)
has no `children`; the label comes from `renderContent`. A consumer copying the example gets a type error.
_Fix:_ rewrite the example as `<Button onClick={() => …} renderContent={() => "Click me"} />` and keep the
import lines.

**2. README lists `MaskedField` as a form control.** Under "What's here → Form controls" the list names
`MaskedField`. There is no such component; `Abstracts/MaskedField` is a utility namespace behind
`DateInput`/`TimeInput`/`CurrencyInput`. _Fix:_ remove `MaskedField` from that list (or move the word into the
sentence describing the masked inputs).

**3. llms.txt calls Abstracts framework-agnostic.** `components/llms.txt:37` says "framework-agnostic
state/behavior hooks". Every abstract is built on `createSignal`/`createEffect`/`onCleanup` from solid-js (33
files import it). _Fix:_ change to "Solid-based state/behavior hooks (no markup of their own)".

**4. `spot_smear_1` missing from the barrel.** `components/src/index.ts:552-553` export `spot_smear_2` and
`spot_smear_3`; `spot_smear_1` (`Samples/SVGDefs/Gradient/Tracked/spot_smear_1.tsx`) is registered in
`SVGDefs.const.ts` and has knobs, but is not exported. _Fix:_ insert
`export * from "./Samples/SVGDefs/Gradient/Tracked/spot_smear_1";` before the `spot_smear_2` line.

**5. Prettier misses.** `npx prettier --check components/src` flags: `Abstracts/ElementObserver/ElementObserver.utils.ts`,
`Abstracts/Placement/Placement.utils.test.ts`, `Exotics/ParticleSpawner/ParticleSpawner.tsx`,
`Primitives/Wheel/Wheel.tsx`, `Samples/Proximity/Effects/ProximityEffects.types.ts`,
`Samples/Proximity/Effects/ProximityEffects.utils.test.ts`. All are line-wrapping differences. _Fix:_ run
`npx prettier --write` on those six files.

**6. Barrel ordering.** Within each folder block the lines are alphabetical except: Placement/Proximity sit after
Cutout (lines 11-14); Glass sits inside the InteractionTracker pair (28-32); Preview sits after Carousels (95-96);
RangeCalendar sits between Calendar and its types (106); the three date pickers' types are in reverse order
(123-125); Range precedes RadioGroup (147-151); Spotlights precede Menus (165-167); Breadcrumbs follows Modal
(177-178); TagInput sits among the non-Input Essentials (185-186); Mosaics precede FlipCard (227-228);
ScratchCard follows ScrambleText (255-257); `triangle_t_2` precedes `triangle_s_2` (567-568); the Samples types
are collected at the end (574-578) rather than beside their `.const`/`.utils`. _Fix:_ sort each block
alphabetically by path, keeping the folder blocks and blank lines between them; move each `export type *` to sit
directly under its folder's value export as the Abstracts block already does.

### Spelling

**7. British spellings.** The rule is in `conventions.md` "US English everywhere". Sites (file:line → fix):

- `Abstracts/Carrier/Carrier.utils.ts:25` "Capitalises" → "Capitalizes"
- `Abstracts/DateValue/DateValue.utils.ts:73` and `Essentials/Input/Clock/Clock.utils.ts:45` "localised" → "localized"
- `Abstracts/Flattener/Flattener.utils.ts:79` "virtualisation" → "virtualization"
- `Abstracts/Virtualizer/Virtualizer.utils.ts:25,62,67,74` "virtualising"/"virtualise" → "virtualizing"/"virtualize"
- `Abstracts/Proximity/Proximity.utils.ts:230` "travelling" → "traveling"
- `Abstracts/PointerTracker/PointerTracker.utils.ts:9` "centerd" → "centered" (typo)
- `Essentials/Input/Calendar/Calendar.types.ts:20` and `Samples/Placement/Layouts/PlacementLayouts.knobs.ts:104` "neighbouring" → "neighboring"
- `Exotics/CellAnimation/CellAnimation.utils.ts:7,55` "chequerboard" → "checkerboard"
- `Exotics/Timeline/Timeline.utils.ts:18` "labelling" → "labeling"
- `Exotics/Trail/Trail.types.ts:27,31,33,35,37,39,41,45,47` "traveller" → "traveler" (the repo already uses `traveler` elsewhere)
- `Primitives/Mosaic/Mosaic.types.ts:36` and `Primitives/Popover/Popover.types.ts:18` "honour" → "honor"
- "colour" → "color" in `Essentials/Input/ColorInput/ColorInput.types.ts:17,19,26,37,69`, `Essentials/Input/ColorArea/ColorArea.types.ts:12,21,45,63`, `Exotics/Corners/Corners.types.ts:8`
- `Samples/CellAnimation/Weights/Samples/rippleTraveling.ts:7,17` and `rippleDiamondTraveling.ts:7,17` identifier `TRAVELLING_RIPPLE` → `TRAVELING_RIPPLE`
- `Abstracts/Placement/Placement.utils.test.ts:534` "cancelling" → "canceling"
- `Samples/Proximity/Effects/ProximityEffects.knobs.ts:49` "neighbours" → "neighbors" (a hint string the Playground paints)
- `Samples/SVGDefs/Gradient/TrackedGradient.knobs.ts:177,257` "travelling" → "traveling"
- `Exotics/TileBoard/TileBoard.utils.ts:13` "centring" → "centering"
- `conventions.md:119` heading "a centring offset" (outside the library; the rule's own file)
- `Abstracts/Anchor/Anchor.utils.ts:206` and `Exotics/Bracket/Bracket.utils.ts:11` "centring" → "centering"
- `Abstracts/InteractionTracker/InteractionTracker.types.ts:3` "greyed" → "grayed"
- `Abstracts/ElementObserver/ElementObserver.utils.ts:235,238,245,301,304,311` local identifier `isCancelled` → `isCanceled` (the same file's neighbors already write `canceled`)
- Typo "centerd" → "centered" in `Abstracts/Anchor/Anchor.utils.test.ts:61`, `Exotics/Timeline/Timeline.utils.ts:101,137`, `Essentials/Toasts/Toasts.utils.test.ts:27`, `Samples/CellAnimation/Weights/CellAnimationWeights.const.test.ts:106`, `Samples/CellAnimation/Origins/CellAnimationOrigins.const.test.ts:21`
  _Fix:_ plain text edits at each site; rename the two identifiers with a find-and-replace in their files.

### Primitives and Composites

**8. `InteractionWrapper` min-width.** `Primitives/InteractionWrapper/InteractionWrapper.tsx:63`:
`"min-width": props.minWidth ? \`${access(props.minWidth)}px\` : undefined`tests the MaybeAccessor itself; line
64 does`access(props.minHeight) ? …`. An accessor is always truthy, so one returning `undefined`yields`min-width: undefinedpx`. _Fix:_ make line 63 mirror line 64: `access(props.minWidth) ? … : undefined`.

**9. Stale warning text.** Same file, lines 53-57: the message names `getIsReachableWhenDisabled` and
`getTooltipDefs`; the props are `isReachableWhenDisabled` and `tooltipDefs`. _Fix:_ reword the string.

**10. Commented-out code in `.css.ts`.** `Primitives/PlacementItem/PlacementItem.css.ts:3,10` and
`Primitives/Wheel/Wheel.css.ts:3,11` hold a `// const …_TRANSITION_MS` and a `// transition: …` each. Comments
are banned in `components/src` outside the two documented exceptions. _Fix:_ delete the four lines.

**11. `Barrel.utils` bare `0.5`.** `Primitives/Barrel/Barrel.utils.ts:68` `faceExtent * 0.5` while line 112
uses the file's own `HALF`. _Fix:_ `faceExtent * HALF`.

**12. Carousel/Wheel label index disagree.** `Primitives/Carousel/Carousel.tsx:151` passes `index + 1` to
`computeSlideLabel`; `Primitives/Wheel/Wheel.tsx:69` passes `index` to `computeWedgeLabel`. Both prop docs read
the same, and Carousel's own `renderPick`/`CarouselPickRenderProps.index` are 0-based. _Fix:_ pass `index` in
Carousel and keep the `${index + 1} of …` fallback; state "zero-based" in the doc of both props
(`Carousel.types.ts:95`, `Wheel.types.ts:50`); grep `computeSlideLabel` in `playground/src` and adjust any
consumer that relied on 1-based.

**13. Live region not reserved.** `LiveAnnouncerUtils.reserve` exists because a region created by its first
message can be silent (its own doc block, and `decisions.md`'s Spotlight entry). `Toasts.tsx:137-138` and
`Spotlight.tsx:175` call it; `Carousel.tsx`, `Calendar.tsx`, `Table.tsx`, `PatchBoard.tsx`, `Carrier.utils.ts`
and `Rotator.utils.ts` call `announce` and never reserve. _Fix:_ add `onMount(() => LiveAnnouncerUtils.reserve("polite"))`
in the four components; in the two abstracts call `reserve` at the top of the `create*` factory, matching the
politeness level each one announces with. Medium confidence that the hazard bites in practice; certain that the
pattern is inconsistent.

**14. Inline `Point2d`.** `Primitives/Spotlight/Spotlight.types.ts:52` `popupOffset?: { x: number; y: number }`;
`Popover.types.ts:26` types the same thing `Point2d`. _Fix:_ import `Point2d` from `@thewaver/ss-utils` and use it.

**15. Dead `WheelUtils`.** `Primitives/Wheel/Wheel.utils.ts` exports `DRUM_PERSPECTIVE_PX` and a `WheelUtils`
namespace whose five members alias `BarrelUtils`. No file in `components/src`, `playground/src` or `e2e` uses
either (only `Wheel.utils.test.ts`). _Fix:_ delete `Wheel.utils.ts` and `Wheel.utils.test.ts`; remove
`index.ts:83`.

**16. Export outside the namespace.** `Primitives/Barrel/Barrel.utils.ts:16` `export const BARREL_PERSPECTIVE_PX`
sits above `export namespace BarrelUtils`; imported bare by `Barrel.tsx:8` and `Exotics/Cuboid/Cuboid.tsx:3`.
`Exotics/Odometer/Odometer.utils.ts:15` `export const ODOMETER_DIGITS` is the third such export (used at `Odometer.tsx:6,105`).
Convention: the namespace is the whole published surface. _Fix:_ keep a private module-level `const`, publish
it as `BarrelUtils.PERSPECTIVE_PX = …` inside the namespace, update the two importers. Medium.

**17. `GlassSurface` clip path built twice.** `Composites/GlassSurface/GlassSurface.tsx:72-86`
`getBackdropStyle` is a plain function calling `GlassUtils.computeMarginedClipPath`; lines 98 and 106 call it
once each, so every size or defs change builds the superellipse path twice. _Fix:_ wrap it in `createMemo`.

**18. O(n²) prefix sums.** `Primitives/Mosaic/Mosaic.utils.ts:335`
`cells.reduce((sums, cell) => [...sums, …], [0])` copies the array per item and runs on every root resize.
_Fix:_ `const ratioSums = [0]; for (const cell of cells) ratioSums.push(ratioSums[ratioSums.length - 1] + cell.ratio);`

**19. Empty style composition.** _Declined; the item has it backwards._ `style([buttonElement, {}])` is the form
six of the seven `.css.ts` files that compose `buttonElement` use — `Breadcrumbs`, `TagInput`, `Paginator`,
`Stepper`, `Tabs` and `Toolbar` — and `Carousel` is the seventh, already matching them. Dropping the `{}` from
`Carousel` alone would create the inconsistency the item exists to remove. It also buys nothing: the built
`index.css` holds no empty rules at all, so vanilla-extract has already dropped the empty object. Either all
seven lose it or none do, which is taste with no measurable difference, so nothing moved. Item 94 quietly agrees —
it counts the same six as the pattern `Menu` should join.

**20. Duplicated literal.** `Primitives/PlacementBox/PlacementBox.context.ts:9` and `PlacementBox.tsx:15` both
write `{ spacing: 0, radius: 0, slack: Infinity }`. _Fix:_ one exported constant (a `PlacementBox.const.ts`, or
`ProximityUtils.RESTING_ARRANGEMENT`) used in both.

**21. Render-state types half documented.** `Carousel.types.ts:14-19` `CarouselSlideState` has no doc blocks
while `CarouselStepRenderProps` (21-32) in the same file does; likewise `WheelWedgeState`/`WheelController`
(`Wheel.types.ts:17-33`), `MosaicPlacement`/`MosaicPackDefs`/`MosaicItemState` (`Mosaic.types.ts:9-24`),
`BarrelFaceDefs` (`Barrel.types.ts:11-14`). These are what a consumer's `render*` callback receives. _Fix:_ add a
one-sentence `/** */` per member, in the neighbors' style. Medium: the convention's scope sentence covers
"what feeds" a props type, and these are on the edge of it; the inconsistency is the certain part.

### Abstracts, second half

**22. Two-item gap crash.** `Abstracts/Placement/Placement.utils.ts:592-611` `getGapPlacement` guards
`length < 2`, then for `index <= 0` calls `phantomOf(0, 1, 2)` (reads `placements[2]`) and for `index > last`
calls `phantomOf(last, last-1, last-2)` (reads `placements[-1]`). With exactly two placements both are
`undefined` and `getCenter(undefined)` throws. `Essentials/Sortable/Sortable.tsx:271` feeds it the landing index
over `0..n`, so a laid-out `Sortable` of two items crashes when a carry lands before the first or after the last.
Tests use three or more placements. _Fix:_ in `phantomOf`, when `at(beyond)` is undefined continue the straight
line: center = `2·center(from) − center(near)`; add tests for `([a, b], 0)` and `([a, b], 2)`.

**23. `indexSignal` write does not turn the wheel.** `Abstracts/Rotator/Rotator.utils.ts:78,120,171-177`:
`getIndex` comes from `createOptional(() => defs.indexSignal, 0)` and is only written in `settle`; nothing reads
it to drive the angle. A consumer writing `3` changes `getIndex()` only; the drum stays, and
`Primitives/Wheel/Wheel.tsx:203` un-hides face 3 for assistive tech while another face is at the marker. The doc
block (40-43) promises the marker reading holds "by the consumer setting the index directly". _Fix (if the
signal is meant to drive):_ add `createEffect(on(getIndex, (index) => { if (untrack(getSpinPhase) !== "still" || index === untrack(getSelectedIndex)) return; turnTo(RotationUtils.getSpinAngle(untrack(getAngle), index, untrack(getStepCount), 0), untrack(getSettleDurationMs), SPIN_EASING, () => {}); }, { defer: true }))`.
_Fix (if it is observe-only):_ correct the doc block and have `Wheel.tsx:203` read `rotation.getSelectedIndex()`.
Medium confidence on which is intended; the doc/behavior mismatch is certain.

**Settled by the user: the signal drives, and it is renamed to say so.** Their distinction is between a
_current_ index — the transient wedge at the marker, derived from the angle — and a _target_ index, the wedge
the wheel is heading for. `indexSignal` is the target, and the ambiguity only existed because the prop said
"index" and so left a consumer unable to tell which of the two they were holding. Their words: if the name
explicitly announces "target", immediate reflection is the correct way.

What that settles, in order:

- **The prop is renamed.** `RotatorDefs.indexSignal` and `WheelSlots.indexSignal` become `targetIndexSignal`.
- **A consumer write turns the wheel**, which is what a target means, so the existing doc sentence becomes true
  rather than being corrected away.
- **The component publishes the target as soon as it knows it** — when `computeSpinTarget` resolves, not when
  the spin lands. This is the behavior change: the outcome becomes readable while the wheel is still turning.
  The user's call, over protecting the surprise by default; a consumer who does not want to see it early reads
  `onSpinEnd`.
- **`Rotator` publishes `getCurrentIndex` (was `getSelectedIndex`) and `getTargetIndex` (was `getIndex`)**, so
  the two are named apart everywhere they surface.
- **`WheelController.getIndex` becomes `getCurrentIndex` and is wired to the current.** It is documented "which
  wedge is at the marker" and holds the target today, which is the outright wrong one of the three docs. No
  consumer reads it.
- **The drum's `isHidden` needs no change**, contrary to what this item and the first reply both assumed. Under
  a driving target, a consumer write moves the wheel, so the face it un-hides really is the one at the marker;
  and while the wheel idles the library's own position is that nothing is selected, so exposing the last landing
  is the stable answer rather than churning the accessibility tree once per idle step. `wheel.spec.ts:401`
  pins that resting face and would have gone red.

`Carousel.indexSignal` is the same concept under the vague name and is **not** covered by this — raised
separately.

**24. Spin resolves after unmount.** `Rotator.utils.ts:184-218,262`: `spin()` awaits `computeSpinTarget()`; the
`.then` re-arms a `requestAnimationFrame` loop and a `setTimeout`, and `settle` later writes `setIndex`, calls
`onSpinEnd` and announces. `onCleanup(stopSpinFrames)` runs at disposal but cannot stop a promise that resolves
afterwards, so a server-picked prize is spoken on whatever page the user is now on. _Fix:_ `let isDisposed = false;`
set in `onCleanup`; early-return from the `.then` and `.catch` when set.

**25. Gradient stops frozen and quadratic.** `Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils.tsx:33-63`:
`renderSmoothGradientStops` maps `untrack(getColors)` once, so the number of `<stop>`s never changes; each stop's
attribute calls `resolveStops(getColors())`, which is O(n²), so n stops cost O(n³) per update, and the tracked
samples update colors every frame. A colors accessor that grows adds no stop; one that shrinks throws reading
`.value` of `undefined`. _Fix:_ `const getStops = createMemo(() => resolveStops(getColors()))` inside each helper,
read `getStops()[i]`; render with `<Index each={getColors()}>` so the count follows the array.

**26. Emoji typeahead.** `Abstracts/Typeahead/Typeahead.utils.ts:74-75,102-103`: `getIsRepeat` iterates code
points but compares to `query[0]` (a code unit), and `computeNextIndex` tests `search.length === 1` on code units.
"🍎🍎" never registers as a repeat, so the highlight does not cycle among options starting with 🍎. _Fix:_
`const [first, ...rest] = [...query]; return rest.length > 0 && rest.every((c) => c === first);` and use
`[...search].length === 1` for the start offset; add an astral-query test.

**27. `overscan` read once.** `Abstracts/Virtualizer/Virtualizer.utils.ts:131` `overscan: opts.getOverscan?.()`
beside `get count()`, `get enabled()` getters; `Virtualizer.types.ts:13` types it `Accessor<number>`. _Fix:_
`get overscan() { return opts.getOverscan?.(); }`.

**28. `x`/`y` grid indices.** `Abstracts/Navigator/Navigator.types.ts:3-11` `NavigatorCell = { x, y }`,
`NavigatorGrid = { width, height }`; `Table.tsx:420-431` and `Calendar.tsx:222` translate row/col in and out.
Convention "A grid index names its space and its axis, never `x` and `y`" names `Index2d` (`row`/`col`). _Fix:_
retype as `Index2d` and `{ rowCount; colCount }`, rewrite the walk, drop the translations, update the tests.

**29. Value imports in type files.** `Abstracts/SVG/Defs/Gradient/SVGGradientDefs.types.ts:1` and
`Abstracts/Viewport/Viewport.context.types.ts:3` `import { … } from "@thewaver/ss-utils"` for names used only as
types; `Primitives/Popover/Popover.types.ts:3` likewise, and so do `Exotics/Corners/Corners.types.ts:1`,
`Essentials/ViewportWrapper/ViewportWrapper.types.ts:1`, `Essentials/Tooltip/Tooltip.types.ts:3`,
`Essentials/Input/Select/Select.types.ts:3` (mixed form) and `Essentials/Menus/Menu/Menu.types.ts:3`; eight in all,
none using the names as values. 44 other `.types.ts` write `import type`. With
`verbatimModuleSyntax` the runtime module is dragged in. _Fix:_ `import type` at each site. (The sweep may add
more sites.)

**30. `getIsEnabled` polarity.** `Abstracts/Virtualizer/Virtualizer.types.ts:10` and `Virtualizer.utils.ts:28,34,83,109,134-139`
use the enabled polarity; convention "Hook-like util arg order" prefers `getIsDisabled`, and 42 files do. `ElementObserver`
shares the holdout (`ElementObserver.utils.ts:43,85,127,144`, four factories whose optional `getIsEnabled?.() === false` reads as
a double negative), as does `Primitives/TextField/TextField.tsx:69` (`createAutoHeight`'s parameter). _Fix:_ rename to `getIsDisabled`, invert the checks, update `Select.tsx:257`, `Tree.tsx:138`,
`Table.tsx:105` and the Playground Virtualizer examples; do `ElementObserver` in the same pass.

**31. Blank-line grouping.** `SVGGradientDefs.utils.tsx:31-32,36-37,63-64` module-level declarations run into
the next doc block with no blank line, and `DEFAULT_RADIAL_ORIGIN` sits below the helpers;
`SVGAnimationDefs.utils.tsx:84-85,107-108` `const …; return …` with no separating line. _Fix:_ insert the blank
lines; move the default constant up beside the other constants.

**32. Empty base type.** `Abstracts/SVG/Defs/Filter/SVGFilterDefs.types.ts:5` `type SVGBaseFilterDefs = {}` is
intersected into eleven types and adds nothing. _Fix:_ delete it and the `SVGBaseFilterDefs & ` prefixes.

**33. Spread for `in`.** `Abstracts/SVG/Defs/Filter/SVGFilterDefs.factory.tsx:231,429,437,478` write
`{...{ in: srcIn }}` on `feMorphology`/`feComposite`, which Solid types `in` for; ten neighbors write `in={srcIn}`.
Line 145 (`feDropShadow`) is the one element Solid does not type it on. _Fix:_ `in={…}` at the four sites; keep 145.

**34. Unnamed numbers.** `SVGFilterDefs.factory.tsx:140,165` `defs.stdDeviation * 3` twice in a file naming
`EDGE_FADE_BLUR_RATIO`; `SVGAnimationDefs.utils.tsx:95,113` `/ 1000` twice where `DateTimeValue.utils.ts` names
`MS_PER_SECOND`. _Fix:_ `const BLUR_REACH_SIGMAS = 3;` and `const MS_PER_SECOND = 1000;` (division stays a division).

**35. Inline `Index2d`.** `Abstracts/SVG/Defs/Pattern/SVGPatternDefs.utils.tsx:24,26,29-30` write
`{ row: number; col: number }` three times and `{ rows; cols }` twice. _Fix:_ import `Index2d` from ss-utils.

**36. `LiveAnnouncerUtils.clear` unused.** `Abstracts/LiveAnnouncer/LiveAnnouncer.utils.ts:98-109` is documented
"for tests", but no test, page or spec calls it and the unit suite has no DOM. _Fix:_ delete `clear` and the
`POLITENESS` array, or reword the doc to a real use.

### Abstracts, first half

**37. Swipe tracker wedges.** `Abstracts/InteractionTracker/InteractionTracker.utils.ts:145-183` `trackPointer`
records `pointerId` on `pointerdown` and refuses every later press while it is set (line 147); it clears it only in
`onPointerEnd`, which is attached to `ref` (182-183). Pointer capture is taken only on `engage()`, which `trackSwipe`
calls after the travel passes its slop. A mouse has no implicit capture, so a press near the edge followed by a
release outside the element never reaches `ref`; `pointerId` stays set and every following swipe on that `Carousel`
or swipe-to-dismiss `Modal` is dropped until the ref or disabled state changes. Touch and pen capture implicitly and
are unaffected. _Fix:_ attach `onPointerEnd` for `pointerup`/`pointercancel` to `document` (and remove from
`document` in the cleanup); the `e.pointerId !== pointerId` guard already filters other pointers.

**38. `Carrier` listener leak and double pick-up.** `Abstracts/Carrier/Carrier.utils.ts:363-408` `dragFromPointer`
attaches move/up/cancel to `element` and captures only once the 4px slop is passed. A mouse release outside the
element before that leaves the three listeners attached. On the next press of the same item a fresh set is added; the
mouse `pointerId` is the same constant, so the stale `handleMove` passes its guard, sees its own `hasStarted === false`
and calls `onPickUp` again: `CarrierUtils.start` runs twice and the pick-up is announced twice. Each stranded press
adds one more set. _Fix:_ register `handleEnd` on `document` for `pointerup`/`pointercancel` and remove from `document`
in `handleEnd`; keep `pointermove` on `element`. Medium.

**39. Whole-value clear ignored.** `Abstracts/DateTimeValue/DateTimeValue.utils.ts:83-90`: the effect mirroring the
outer signal into the halves returns early on `undefined`, so a consumer's "Clear" button (or a form reset) leaves
the date and time fields showing the old values, and the next pick of only a time re-pairs it with the stale date and
writes the cleared value back. `decisions.md`'s "A pair with a half missing reports nothing" covers clearing through
a half, not from outside. _Fix, with a guard:_ the early return is also what keeps the other half when a half is
cleared from inside (`emit` writes `undefined` outward in that case), so a plain `setDate(value?.date)` would break
that deliberate behavior. Have `emit` remember what it last wrote (`let lastEmitted`) and, in the effect, clear both
halves only when `value === undefined` and `!isSame(value, lastEmitted)` — an outside clear, not the echo of an inside
one. Add a test writing `undefined` to the outer signal and expecting both halves `undefined`, and one clearing a half
from inside and expecting the other half kept. Medium.

**Settled by the user, together with item 164: option C — the remembered-emit rule, in one shared helper.**
Both splits get the same rule, and it lives in one place rather than being written twice:

- **The rule is "ignore my own echo".** A split remembers the value it last wrote outward; an incoming
  `undefined` clears both halves only when it is _not_ that remembered value. An outside clear — a consumer's
  Clear button, a form reset — therefore reaches both halves, where today it is swallowed; and clearing one half
  from inside still keeps the other, which is what `decisions.md`'s _"A pair with a half missing reports
  nothing"_ records and what the existing guard was protecting.
- **One helper, not two.** The generic split is `SignalMirrorUtils.createSplit`, beside `createOptional`,
  `createPassThrough` and `createValueMirror` — the same family, one signal in and signals out, and nothing in
  it is date-specific. It takes compose, decompose and an equality test, because the range's two halves are the
  same type and get ordered where the date-time pair's are not.
- **`DateTimeValueUtils.createSplit` stays as the named entry point** and becomes a thin wrapper supplying
  `of`, the decomposition and `isSame`, so its consumers are untouched.
- **`DateRangePicker` drops its three hand-written effects** and builds its halves through the helper, which is
  what fixes item 164.
- **The reason for one helper rather than two guards** is that the divergence is how 164 happened, and
  `conventions.md` names a date-time **range** as the composition coming next — it would have been the third
  hand-written split.

Tests to add: an outside clear leaving both halves `undefined`; an inside clear of one half leaving the other
held; and for the range, clear-then-retype bringing the range back.

**40. `.tsx` with no JSX.** `Abstracts/Glass/Glass.utils.tsx` builds objects and calls the filter factory; no element
anywhere. The other three `.utils.tsx` each contain JSX. `Samples/SVGDefs/SVGPatterns.const.tsx` is the same case
(its sibling `SVGAnimations.const.tsx` does render JSX). The twelve JSX-free gradient sample files are left alone as
one registered family. _Fix:_ rename both to `.ts`; update the one mention of `Glass.utils.tsx` in `decisions.md`.

**41. Private inside the namespace.** `Glass.utils.tsx:110-130` `computeTintFill` is an unexported `const` inside the
braces. Convention: privates sit above the namespace. _Fix:_ move it (and its doc block) above, after
`NO_EDGE_THICKNESSES`; it uses `getTintGradientId`, so move that to module level too and re-export it from the namespace.

**42. `getCellOf` returns `x`/`y`.** `Abstracts/DateValue/DateValue.utils.ts:335-343` returns `{ x, y }` for weekday
column and week row; `Calendar.tsx:176-182,207-215` computes `cell.y * DAYS_PER_WEEK + cell.x`. Same convention as
item 28; `Table` already converted to `Index2d`. _Fix:_ return `Index2d | undefined` (`{ row, col }`), adapt the two
`Calendar` sites. Do together with item 28.

**43. Namespace self-reference.** `Abstracts/FocusManager/FocusManager.utils.ts:129` calls
`FocusManagerUtils.getFocusableChildren` where line 173 calls a sibling bare; `Abstracts/Dismisser/Dismisser.utils.ts:9-10`
has a module-level private reaching into `DismisserUtils.getIsWithinOwnedLayer` (safe only because it is inside a
function body, the direction conventions warns about). Across 64 utils files only 7 lines do this (also `TileBoard` ×3,
`CellAnimationWeights` ×2). _Fix:_ drop the prefix in FocusManager; in Dismisser move the walk to a module-level
private under a different name and publish it from the namespace.

_Done, all four files._ FocusManager's call was inside the namespace, so the prefix simply went. The other three
each had a **module-level private** reading a published member, which the prefix was load-bearing for — dropping
it there does not compile. Each was fixed the way `conventions.md` prescribes instead: the value moves to module
level under a name of its own and the namespace publishes it from there. `Dismisser` got
`computeIsWithinOwnedLayer`, `TileBoard` got `computeIsShortRow` and `computeIsFlippedTile`, and
`CellAnimationWeights` got `WEIGHT_ROUNDING_PLACES`. No published name changed.

**44. Inline defaults.** `Abstracts/ColorExtractor/ColorExtractor.context.ts:19-20` `?? 1` and `?? 10`. _Fix:_
`const DEFAULT_COLOR_COUNT = 1;` and `const DEFAULT_SAMPLE_PERCENTILE = 10;` at module scope.

**45. Undocumented privates.** `Abstracts/Elevation/Elevation.utils.ts:3-16`, `Abstracts/Flattener/Flattener.utils.ts:3-4`,
`Abstracts/Cutout/Cutout.utils.ts:5-7` have bare module-level constants/helpers where 11 of the 14 utils files in the
folder document theirs. The rule requires docs on exports only, so this is a consistency point. _Fix:_ one-line blocks.

**46. `getYearsInEra` doc.** `Abstracts/DateValue/DateValue.utils.ts:208-214` says it returns `Infinity` for most eras;
its test asserts 9999 and conventions.md says every supported calendar bounds it at four digits. _Fix:_ reword the
`@returns` to "at most 9999; `Infinity` only if the calendar implementation does not answer".

**47. `InteractionActivation.count` doc.** `Abstracts/InteractionTracker/InteractionTracker.types.ts:34` says "in
quick succession, so a double click can be told from two clicks"; `InteractionTracker.utils.ts:514-525` only ever
increments a module-lifetime counter. _Fix:_ reword to "presses since mount, increasing by one each time; a change is
what lets a repeated press restart a running effect".

**48. Magic date.** `DateValue.utils.ts:466-470` `new Date(2021, 7, 1 + …, 12)` — 1 August 2021 is a Sunday, 12 is noon,
neither named in a file that names every other number. _Fix:_ `const A_SUNDAY = { year: 2021, month: 7, day: 1 };`
and `const MIDDAY_HOUR = 12;` with one-line docs.

**49. Duplicate page-visibility tracker.** `Abstracts/FrameRateMonitor/FrameRateMonitor.utils.ts:31,47,79-89` keeps
its own `visibilitychange` listener; `InteractionTrackerUtils.trackPageHidden` (InteractionTracker.utils.ts:434-448)
is the shared one, split out for exactly this reuse per `decisions.md`. _Fix:_ replace with
`const getIsPageHidden = InteractionTrackerUtils.trackPageHidden();`.

**50. Redundant `!`.** `Abstracts/Anchor/Anchor.utils.ts:260,295` assert non-null on the results of exhaustive
switches that lines 441/444 use unasserted. _Fix:_ delete the two `!`.

### Essentials/Input, second half

**51. `TagInput` bypasses the label and message wiring.** `Essentials/Input/TagInput/TagInput.tsx:182` writes
`aria-label={access(props.ariaLabel)}` straight from the prop and the `<input>` carries no `aria-describedby`.
Eleven other controls resolve both through `LabelUtils.resolveAriaLabel` and `FormFieldUtils.resolveAriaDescribedBy`.
Inside a `FormField` with an error message the text is on screen but not associated with the input (3.3.1 Error
Identification, 1.3.1 Info and Relationships); inside a `Label`, the control's own `aria-label` overrides the
caption so name and visible label disagree (2.5.3 Label in Name). _Fix:_ add the two resolver calls at the top of
the component as `Range.tsx:9-10` does, use `aria-label={getAriaLabel()}` and add
`aria-describedby={getAriaDescribedBy()}` on the `<input>`; leave the group div's label alone.

**52. Chips are tab stops.** `TagInput.tsx:143-153`: each chip `<button>` has `tabindex={-1}` but sits in its own
`InteractionWrapper` with no `isTabbable`, and `wrapElement` (`InteractionTracker.utils.ts:371-379`) sets
`tabIndex` to 0 after mount. Five tags means six tab stops, and Backspace on any of them removes a tag; the
recorded design is one entry point plus an arrow walk. `Select.tsx:432` and `Menu.tsx:477` do this right with
`isTabbable={false}`. _Fix:_ add `isTabbable={false}` to the chip's wrapper and delete the dead `tabindex` attribute.

**53. `TimeInput` writes while read-only.** `Essentials/Input/TimeInput/TimeInput.tsx:106-143`: `handleKeyDown`
steps the value on ArrowUp/Down with no `isReadOnly` check (`TextField` gates `onKeyDown` on disabled only), and
`meridiem.set`/`toggle` check neither disabled nor read-only before `field.commit`. `NumberInput` gates both paths
with `getIsWritable`. _Fix:_ add `const getIsWritable = () => !(access(props.isDisabled) ?? false) && !(access(props.isReadOnly) ?? false);`
and return early from `handleKeyDown` and `meridiem.set` when it is false.

**54. `NumberInput` reports an unchanged value.** `Essentials/Input/NumberInput/NumberInput.tsx:39-49,147-151`:
`applyValue` always calls `reportValue`, reached from every blur and every arrow press, including at a bound where
`computeStep` returns the current value. Tabbing through a field holding 5 fires `onInput(5)`. Convention
"Notifying the consumer counts as work". _Fix:_ in `applyValue`, write the text, then
`if (untrack(() => props.valueSignal[0]()) === value) return;` before `reportValue`. Medium.

**55. `NumberInputProps` shape.** `NumberInput.types.ts:26-43` is a plain intersection with two hand-written
`MaybeAccessor<number>` props and no `AccessorProps<{…}>` block; neither prop mentions `T` or has an
`undefined` "off" value, so neither is licensed. The four sibling presets use `Omit<…> & AccessorProps<{…}>`.
_Fix:_ move the five members into one `AccessorProps<{…}>` block, keep the doc blocks, import `AccessorProps`.

**56. `Radio` reachability from presence.** `Essentials/Input/Radio/Radio.tsx:23-28` computes `getIsReachable`
with `props.tooltipDefs !== undefined` and three arguments; the wrapper it spreads into uses
`access(props.tooltipDefs) !== undefined` plus `isFocusableWhenDisabled`. A group forwarding
`tooltipDefs={() => record.tooltipDefs}` gets a radio the arrow walk lands on but the wrapper treats as
unreachable: focus lands with no ring. _Fix:_ read the value and pass the fourth argument. Medium.

**57. Vertical `Range` orientation.** `Essentials/Input/Range/Range.tsx:87-140`, `Range.css.ts:48-54`: vertical
mode is `writing-mode` plus `direction` in CSS; nothing in the markup states the axis. APG slider: "If the slider
is vertical, it has `aria-orientation` set to vertical" (4.1.2). `Tabs` and `RadioGroup` already set it. _Fix:_
`aria-orientation={access(props.orientation) === "vertical" ? "vertical" : undefined}` on the `<input>`. Medium.

**58. `TimePicker` opens while disabled.** `Essentials/Input/TimePicker/TimePicker.tsx:29-36`: `open()` is
`setIsOpen(true)` with no disabled check and no effect writing `false` back. Convention "An invariant the component
owns is enforced against the state too" (`Select.tsx:292-301` does both). `DatePicker.tsx:36` (`open`) and `DateRangePicker.tsx:97` (inline `setIsOpen(true)`) share the shape.
_Fix:_ at all three sites refuse when disabled; add an effect closing an open popup when `isDisabled` turns true. Medium.

**Not a decision: `conventions.md` already settles it**, under _"An invariant the component owns is enforced
against the state too"_ — "A disabled control cannot be open: `open()` already refused, but a consumer writing
`true` bypassed it, so `Select` and `Menu` write `false` back." Five controls fail a rule that is already
written down, which is a defect rather than an open question, so it is taken with the sweep.

**It is wider than this item says.** Audited across every popup-owning control: `Select` and `Menu` guard both
ways and are correct. `DatePicker`, `TimePicker` and `DateRangePicker` guard neither way, as recorded here.
`ColorInput` is the fourth and was missed — its leaf gates the click on disabled, but `onToggle` is a bare
`setIsOpen((prev) => !prev)` and there is no effect writing `false` back, so a consumer's `visibilitySignal`
opens a disabled picker exactly as it does on the other three. `DateTimePicker` inherits whatever the two it
composes do.

The effect closes the popup without moving focus, which is what `Select` does — returning focus to a field that
has just been disabled would be the wrong place to put it.

**59. `TimePicker` trigger cannot claim `aria-controls`.** `TimePicker.tsx:33-36`, `TimePicker.types.ts:12-15`:
the popover has `id={popupId}` but `TimePickerTrigger` exposes only `getIsOpen` and `toggle`, so no consumer
trigger can write `aria-controls`. The dismissal ownership walk (`Dismisser.utils.ts:82-96`) relies on that
attribute, so a `TimePicker` inside any popover-driven layer opens its clock as a portal sibling and a press on an
hour dismisses the outer layer. _Fix:_ add `getPopupId: () => string` to the trigger handle (documented), set it,
and have the Playground painter write `aria-controls`/`aria-expanded`; same for `DatePicker.renderTrigger`. Medium.

_Re-read and confirmed, and it is a decision rather than a defect repair._ The finding holds: the walk in
`computeIsWithinOwnedLayer` looks for an element carrying `aria-controls="<popup id>"`, nothing in the repo
writes one for a picker, and the picker's trigger is painted entirely by the consumer. But the prescribed fix
cannot land as written, because `Button` — which is what both `PageDatePickerTrigger` and `PageTimePickerTrigger`
are built on — has no way to write an arbitrary ARIA attribute. `ButtonProps` picks `id`, `ariaLabel` and
`renderContent` off `InteractionControlProps` and nothing else, and `InteractionWrapperProps` carries only
`role`. So exposing `getPopupId` alone closes the library's half and leaves the only trigger in the repo unable
to use it. Three routes:

- **A.** `InteractionWrapper` grows an `ariaAttributes?: JSX.AriaAttributes` prop, the way `Popover` already
  has one, and the picker publishes `getPopupId` on its trigger handle. The consumer wires the two together.
- **B.** The pickers follow `ColorInput`'s precedent and own the trigger element themselves — a private leaf
  writing `aria-haspopup`, `aria-expanded` and `aria-controls` — with `renderTrigger` narrowed to painting the
  content inside it rather than the whole control. Matches the house's other popup owners; the largest change,
  and it moves what `renderTrigger` means.
- **C.** `Popover` registers its popup against its anchor directly rather than relying on the markup, so the
  dismisser no longer needs the attribute for this case. Contradicts _"A popup opened from inside a popup is not
  outside it"_ in `conventions.md`, which chose the markup route precisely so nothing has to be registered on
  open.

`DatePicker` and `DateRangePicker` have the same gap and whichever route is chosen covers all three.

**Settled by the user: route B — the picker owns the trigger element.** Their words: the library already uses
and abuses wrappers, and the thing that matters is that the aesthetics do not become limited. Checked against
`ColorInput`, which is the precedent, and the caveat holds by construction:

- **`ColorInput` wraps.** It renders an `InteractionWrapper` around a private `ColorInputField` leaf, and that
  leaf is the `<button>` carrying `aria-haspopup`, `aria-expanded` and `aria-controls`. So the consumer keeps
  the flags, the decoration slot, the tooltip, the sizing and the whole disabled-and-reachable machinery.
- **Its class is a pure reset, not paint** — `border: none`, `padding: 0`, `background: none`, and `font`,
  `color` and `text-align` inherited. Every pixel still comes from the consumer's `renderContent`, which is
  _"A control paints nothing"_ working as written. Nothing about the look is constrained.
- **The pickers differ in where the button sits.** `ColorInput`'s button _is_ the field; a picker's trigger is a
  trailing adornment inside a `DateInput` or `TimeInput`, which already has its own wrapper. So each picker
  renders a **second, nested** `InteractionWrapper` plus a private trigger leaf into the field's trailing slot —
  which is the shape `conventions.md` already blesses under _"Two rejected alternatives"_, where
  `renderTrailing` "routinely holds a real `Button` with its own wrapper — the Playground's password field".
- **`renderTrigger` narrows from painting the control to painting its content**, matching
  `ColorInput.renderContent`. That is the published-contract change this route costs, on `DatePicker`,
  `DateRangePicker` and `TimePicker`.

**What is genuinely given up** is structural rather than aesthetic: today a consumer may return anything at all
from `renderTrigger` — a link, a div, two controls — and afterwards they get one button-shaped control whose
paint is entirely theirs. Recorded because it is the only thing the route takes away.

**60. Padding click focuses a disabled `TagInput`.** `TagInput.tsx:134-139`: the root's `onPointerDown` calls
`focusField()` with no disabled check; `wrapElement` refuses `mousedown` on the input only. _Fix:_
`if (e.target !== e.currentTarget || getIsDisabled()) return;`. Medium.

**61. Stale `Select.utils` doc.** `Essentials/Input/Select/Select.utils.ts:25-33` `getGroupRowIndex`'s `@returns`
says it is "what an option's `aria-describedby` points at"; no option carries one, and the group name travels on
the group box's `aria-label`. _Fix:_ reword to describe the windowed-run cut it is actually used for.

### Essentials, second half

**62. `SplitPane` has no single-pointer route.** `Essentials/SplitPane/SplitPane.tsx:110-134,166-187`: the only
pointer route is press, capture, move. 2.5.7 Dragging Movements (AA): "All functionality that uses a dragging
movement for operation can be achieved by a single pointer without dragging"; the Understanding document says a
keyboard route does not satisfy it. `decisions.md` argues 2.1.1 only. _Fix:_ in `handleGutterPointerUp`, when no
drag happened (track a flag in the move handler), step the boundary by `keyStep` toward the side the press landed
on, through `moveBoundary`; record the check in `decisions.md`. If declined, it belongs in `backlog.md` beside
item 22 as the same unclosed criterion.

**Settled with item 63: the criterion is not optional, and the route is tapping the handle that already
exists.** 2.5.7 is Level AA, and both escapes were checked against the Understanding document rather than
recalled: a keyboard route does not satisfy it — "achieving keyboard equivalence for a dragging operation does
not automatically meet this success criterion, unless that equivalent keyboard operation also provides controls
that can be clicked or tapped with a pointer" — and the "essential" exception needs the functionality to be
unachievable another way, which `Sortable`'s own tap-to-pick-up route disproves. `decisions.md` argues 2.1.1
only, so it never reached this.

**For `SplitPane` there is no ambiguity to resolve**: the gutter is its own element with no competing press, so
a press that ends without a drag steps the boundary by `keyStep` toward the half of the gutter that was pressed.
Recorded in `decisions.md` with the criterion named.

**63. `Table` resize and reorder are drag-only.** `Essentials/Table/Table.tsx:204-230,314-335,493-505`: resizing is
press-capture-move and the resizer's `onClick` only stops propagation; reordering is `dragFromPointer` in `"drag"`
mode and a plain header click sorts. 2.5.7 again; the Accepted-limits entry on the resizer weighs discoverability
only and never names 2.5.7. `Sortable` already ships the conforming tap-to-pick-up, tap-to-drop shape. _Fix:_
reorder: in the no-drag branch start a `"tap"` carry and drop on the next header click (the `Sortable.handleClick`
branch), skipping the sort for that click; resize: on a click with no drag, step the width by `resizeStepPx`
toward the half of the handle pressed. Record in `decisions.md`; if declined, name 2.5.7 in the Accepted limit.

**Settled by the user: sort and reorder each get their own target, and the whole header stops being one.**
Their call, taken over the reviewer's single-grip suggestion, and argued: two render slots are not dead weight
here, because a consumer wants to paint a sortable indicator with its current direction and a reorder affordance
anyway, so the slots are where those already belong.

**Resize is unaffected** — `renderResizer` already paints into a dedicated box at the cell edge whose `onClick`
stops propagation, so a press there that ends without a drag steps the width by `resizeStepPx` toward the half
of the handle pressed. No new target.

**Reorder and sort were the collision.** The reorder drag starts on the whole header cell and a click on the
whole header cell sorts, so a tap cannot mean both. `Sortable` taps the whole item only because a sortable item
has no competing click; the Playground's `⠿` is paint, not a target.

So the header cell gains two slots beside `renderResizer`, and loses its own `onClick` sort. Three things that
decided along the way:

- **It improves the 2.5.8 position rather than worsening it.** Target Size (Minimum) is also Level AA and wants
  24×24 CSS px unless a 24px circle centred on each undersized target clears every other target. The resizer is
  8px wide by default (`DEFAULT_RESIZER_WIDTH_PX`) and sits inside a header that is itself clickable, so
  **2.5.8 fails today**. Removing the header from the target set is what makes the resizer defensible.
- **The three targets in one cell are a constraint the consumer owns.** Sort, grip and resizer all being under
  24px means their centres need roughly 24px of clearance from each other, and a narrow column cannot hold
  three. The library cannot enforce it, so it is documented on the slots.
- **The keyboard stays on the cell.** The header cell is the roving tab stop and Enter or Space sorts it today.
  Both new controls are `tabindex="-1"`, so they are pointer affordances and nothing else — one tab stop per
  cell, which is what the grid pattern wants, and all 2.5.7 asks for.

**Copy the resizer's box-and-paint split deliberately**: the library renders the target, the consumer paints
inside it, so an unpainted slot is invisible but still hit-testable. That is what stops sorting dying silently
for a consumer who never paints an arrow.

**64. Non-navigable `Stepper` step.** `Essentials/Stepper/Stepper.tsx:30-39,87-92`: renders
`<span aria-label aria-current aria-disabled>` with no role; with a tooltip it is reachable, so `wrapElement`
gives the span `tabIndex 0`. `aria-label` is prohibited on the generic role, so the consumer's state string is not
exposed, and a focusable element with no role announces as nothing (4.1.2). The Breadcrumbs precedent is neither
focusable nor labelled. WCAG outranks the decision. _Fix:_ render the non-navigable step as the same
`<button type="button">` with `aria-disabled="true"` and no click write; drop the `Show` split; amend the
`decisions.md` paragraph.

**65. `SplitPane` splitter pattern gaps.** `SplitPane.tsx:136-150,166-176`: (a) Home/End ignored; (b) no
`aria-controls` although panes can carry an `id`; (c) `role="separator"` on a `<button>`, which ARIA in HTML does
not allow. APG Window Splitter lists Home/End and `aria-controls`. Pattern completeness under 1.3.1/4.1.2 rather
than hard failures. _Fix:_ Home → `moveBoundary(index, 0)`, End → `moveBoundary(index, 1)`;
`aria-controls={panes[index - 1].id}` when present; make the gutter a `<div tabindex>` or record why the button
stays. Medium.

**Part (c) is a review error and there is nothing to do.** ARIA in HTML lists `separator` among the roles
explicitly allowed on `<button>`, beside `checkbox`, `slider`, `switch` and `tab`. `<button role="separator">`
is conformant; the gutter stays a button.

**Part (b) — settled by the user: the component generates the id when the consumer gives none.** `id` is
optional on `SplitPanePane`, so today a consumer who supplies none leaves the gutter with no `aria-controls` at
all — a property the Window Splitter pattern asks for, present or absent according to an unrelated optional
prop, with nothing telling the consumer it was lost. `SplitPane` therefore falls back to a `createUniqueId` per
pane, which is what `TimePicker`, `DatePicker` and `ColorInput` already do for their popups.

**The user generalised it: this is the rule everywhere an id is optional**, not a `SplitPane` fix. It is
library-wide and backbone-independent, so it belongs in `conventions.md` rather than here — write it there in
the sweep. The shape: where a component needs an element's id in order to write a relationship attribute
(`aria-controls`, `aria-describedby`, `aria-labelledby`, `aria-activedescendant`), an optional consumer `id` is
a preference rather than a precondition; the component falls back to `createUniqueId` so the relationship is
always expressed, and writes an id only onto an element the consumer left unnamed.

**Part (a) — settled by the user: build both Home/End and Enter.** Neither is a conformance gap — Home and End
are marked optional in the pattern and nothing in WCAG asks for either — so this is a feature call, taken on the
grounds that the splitter should match the published pattern in full while it is being worked.

- **Home and End** move the divider to the first pane's smallest and largest allowed size: `moveBoundary(index, 0)`
  and `moveBoundary(index, 1)`, which already clamp. Two branches in `handleGutterKeyDown`.
- **Enter** collapses the pane and, pressed again, restores the divider to where it was — the omission the review
  missed, and the more useful of the two, since it is how a sidebar is put away without dragging. It needs a
  remembered pre-collapse position per divider, which is state the component does not have today, and a ruling on
  what happens when the sizes change while a pane is collapsed. Settle that while building: the remembered
  position is dropped when the consumer moves that boundary by any other route, so a restore never puts the
  divider somewhere the consumer has since overridden.

**66. `Sortable` items announce as static list items.** `Essentials/Sortable/Sortable.tsx:59-72,399-466`: a
focusable `<div role="listitem">` with Enter/arrow/click handlers. `listitem` is structural, so a screen reader
gives no hint that Enter does anything until after pick-up (4.1.2). _Fix:_ smallest: keep the list roles and add
`aria-roledescription` plus an `aria-describedby` pointing at a hidden element holding `zone.getKeyHint(false)`;
fuller: `listbox`/`option` with `aria-selected` on the carried item. Record in `decisions.md`. Medium.

**Settled by the user: the smaller route — rename the role and describe the keys.** `list` and `listitem` stay;
the item gains `aria-roledescription` and an `aria-describedby` pointing at hidden text holding the key hint.

**The gap is narrower than the item implies, which is what decided it.** `Carrier` already announces pick-up,
each move, the drop and the cancel through a polite live region, so once Enter is pressed the whole carry is
covered. What is missing is only the advertisement on a _resting_ item — that Enter does anything at all. A
discovery gap, not a silent control.

Why not `listbox`/`option`: `option` means selectable and reordering is not selecting, so `aria-selected` on the
carried item would claim a selection nobody made, and the role brings selection-follows-focus expectations the
component does not implement. Against that, `aria-roledescription` is already the house idiom — `Wheel`,
`Carousel`, `Cuboid`, `FlipCard` and `Barrel` all carry one — and keeping the list roles means the set still
announces with its position and size, which is what a reorderable list is.

**One thing to build that the item did not name:** `zone.getKeyHint` produces only the _carrying_ sentence
("Arrow keys choose a place, Enter drops, Escape cancels"). A resting item needs its own, so `CarrierZone` grows
a second hint for the not-yet-picked-up state.

**67. Disabled `Table` arrow keys.** `Table.tsx:340` returns from the whole key handler when disabled, and
`handleCellClick` (439) likewise, so a disabled table can be tabbed into but not walked. `decisions.md` says
"Disabled is `aria-disabled` on the grid, and nothing else changes … sorting, selection and resizing all return
early"; the writes already refuse individually. _Fix:_ line 340 → `if (grid.width < 1) return;`; add a disabled
guard inside the `onRowActivate` branch (406); move the click-handler return to just before `toggleSort`/`selectRow`
so a click still moves the roving cell. Medium.

**68. Windowed `Tree` typeahead.** `Essentials/Tree/Tree.tsx:157-158,263-278`: `computeRowText` reads text from
`document.getElementById(getRowId(row))`; in a windowed tree only visible rows exist, so typing "z" for a node 400
rows down does nothing. `Select.tsx:280-282` has the same shape. _Fix:_ either warn at setup when
`computeEstimatedNodeHeight` is given without `computeCustomText`, or fall back to `String(row.node.value)` when
the element is missing and the window is live. Record under the Tree windowing entry. Medium.

**69. Selection scan per cell.** `Table.tsx:68,486,580`: `getSelection().includes(row)` in `getCellRenderProps`
and `renderRow`, O(selection) each, re-run per field read. Ctrl+A on 2000 rows × 10 columns is 40M comparisons.
_Fix:_ `const getSelectedSet = createMemo(() => new Set(getSelection()));` and `.has(...)` at both reads. Medium.

**70. Hand-written roving walk.** `Sortable.tsx:39-49,449-465` duplicates `NEXT_KEYS`/`PREVIOUS_KEYS` and the
wrap-around arithmetic that conventions "The 1D walk is a pure function" extracted; nine other callers use
`NavigatorUtils.computeNextPosition`. _Fix:_ replace the walk with
`computeNextPosition(e.key, navigable.indexOf(index), navigable.length, { orientation: isPlaced ? "both" : getDir() })`;
keep the key tables only for the carry-mode nudge branch, or derive the nudge direction from the answer.

**71. `INTERACTIVE_SELECTOR` ×4.** Identical string in `Sortable.tsx:52-53`, `Table.tsx:39-40`, `Exotics/PatchBoard/PatchBoard.tsx:35`,
`Exotics/SortableGrid/SortableGrid.tsx:48`. _Fix:_ one documented export on `CarrierUtils` (all four already import
it) and delete the copies.

**72. Hand-written clamps.** `Scroller.tsx:28` `Math.min(Math.max(x, RATIO_MIN), 1)`; `Sortable.tsx:196` and
`Table.tsx:287` `Math.min(Math.max(x, 0), n - 1)`. `MathUtils.clamp`/`clamp01` are used 65 times elsewhere.
_Fix:_ `MathUtils.clamp01(...)` and `MathUtils.clamp(x, 0, n - 1)`.

**73. `Preview` docs wrong.** `Essentials/Preview/Preview.types.ts:39-42`: `sizing` is documented as an animation
choice but is the width mode (`"fit-content" | "fill"`); `id` is documented as what parts compose ids from, but only
the trigger gets it and the content id is a separate `createUniqueId()`. _Fix:_ reword both, or derive `contentId`
from the prop.

**74. `DEFAULT_ARIA_DESCRIBED_BY`.** `Essentials/Tooltip/Tooltip.tsx:18` names an attribute string `DEFAULT_…`,
the prefix the house reserves for prop defaults. _Fix:_ rename to `ARIA_DESCRIBED_BY_ATTRIBUTE` or inline the literal.

**75. `aria-orientation` on a list.** _Done._ The attribute is off the `<ol>`, the `decisions.md` sentence that
recorded the placement now records the opposite, and `e2e/stepper.spec.ts` asks about the layout instead — a
column strip stacks its steps and a row strip lays them side by side, compared against each other in layout
space. The user confirmed the code is right and the spec was the thing to change.

**76. Blank line.** `Sortable.tsx:49-50`: `BACKWARD_KEYS`'s `};` runs straight into `const PLACED_SIZING`. _Fix:_
insert one blank line.

### Essentials/Input, first half

**77. `ColorInput` replaces a non-hex value with black.** `Essentials/Input/ColorInput/ColorInput.tsx:83-104`:
the first effect skips values that are not hex (`if (!Color.Hexa.isHexa(value)) return;`), leaving `hsv` at
`STARTING_COLOR` (black); the second effect then sees `toHexValue(getHsv())` differ from the consumer's value and
writes `#000000` into `valueSignal` and calls `onInput`. A consumer mounting with `"red"` or `"rgb(…)"` has it
overwritten on the first render, though the render-props doc says "in whatever notation the consumer handed in".
_Fix:_ either parse other notations (`Color` in ss-utils, if it has a general parser) into HSVA in the first
effect, or make the second effect skip while the current value is not hex and `hsv` has not been moved by the user
(a `hasUserMoved` flag set in the surface's `onInput`). Update the doc to say which notations are read. Medium on
which fix; the overwrite is certain from the code.

**Settled by the user: option C, widened.** A value the picker cannot read is refused visibly — nothing shown,
the error flag raised, the consumer's value left alone — which is `conventions.md`'s _"A masked field never
spells a value approximately"_ applied to colour. Two additions of theirs on top:

- **What counts as readable is widened by adopting a parsing library** rather than by hand-writing one, so the
  refusal is rare instead of routine.
- **The value is emitted in the notation it arrived in.** Hand in `hsl(...)` and `hsl(...)` comes back, rather
  than everything collapsing to hex as it does today. This is what makes the render-props doc's "in whatever
  notation the consumer handed in" true, where every other route would have meant deleting that sentence.

**The library is `colord`, not `tinycolor2`.** The user named `tinycolor2` and asked for an alternative if there
was a better one; the deciding facts, checked against the registry rather than recalled:

- `tinycolor2` is at 1.6.0, last published 2023-07-08 — three years stale, and pre-dates the modern CSS colour
  syntaxes.
- `colord` is at 2.10.0, published within the last month, **zero dependencies**, ~1.8 KB brotli for the core,
  written in TypeScript. Decisively, it publishes **`getFormat()`**, which reports which notation an input string
  was in — that is exactly the round-trip requirement above, and it is the one capability the choice turns on.
  Named colours and LAB/LCH/HWB/CMYK are opt-in plugins, so only the notations actually read are paid for.
- `culori` 4.0.2 is the more complete library — full CSS Color 4, `oklch`, and what Tailwind v4 uses — but it is
  1.1 MB unpacked and is built for colour science rather than for round-tripping a notation, which is what this
  needs.

**Scope: parsing and formatting only.** `Color` in `ss-utils` stays. It is the companion-type pattern the
conventions describe, its algebra is used by `ColorArea` and every tracked gradient sample, and none of that is
what is broken. What it lacks is reading a string that is not hex and writing one back in a chosen notation, and
that is the whole of what `colord` is brought in for. The dependency therefore lands on `ss-utils`, beside the
`Color` namespace, not on `components`.

**Two consequences to settle while building, not now.** `ColorInput` has to remember the notation it was handed,
and there is none to remember when the consumer starts empty — hex is the fallback. And installing `colord` needs
the user's go-ahead at that point; nothing is installed on the strength of this entry.

**`colord` becomes the engine, not just the parser — the user's call, taken against the recommendation and
insisted on when it was argued.** The accounting they were answering: of `Color`'s ~40 exports, 32 are things
`colord` covers (about 20 conversions, 8 `toCss`, the two hex guards, the two colour-equality helpers) and 8 are
not (the `interpolate` family — `colord`'s `mix` travels LAB by default or RGB on request, and has no
hue-shortest-arc path in HSL or HSV, which is the documented point of ours). The case put against going this far
was that the 32 cannot be deleted so much as re-wrapped, because `colord` reports saturation, value and lightness
as 0–100 where `Color` uses 0–1 fractions, and because a conversion becomes an instance allocation on a path that
runs per frame per ripple in the tracked gradient samples. The user overruled it.

So: **the conversions, the `toCss` family, the hex guards and the colour-equality helpers go**, and `Color` keeps
the record types, the eight `interpolate` functions and `getClampedAlpha`.

**Settle first, before any of it is built: whether `Color`'s 0–1 fractions should become `colord`'s 0–100.** The
user raised the doubt themselves — "I'm not even sure that we were right to shape our type with 0-1" — and it
decides how much this costs. Aligning to 0–100 removes the rescaling adapters entirely and makes the deletion a
real deletion; keeping 0–1 means 20 adapters. It also reaches a published prop type, `ColorArea`'s
`hsvSignal: Signal<Color.HSVA>`, and `ColorArea` reads `hsv.s` straight as a 0–1 ratio, so it is a behavior
change rather than a rename. Parked at the user's request rather than resolved here.

**78. `ColorArea` double write per drag move.** `Essentials/Input/ColorArea/ColorArea.tsx:39-44` `onDrag` calls
`props.setAxis("saturation", …)` then `props.setAxis("brightness", …)`; each writes `hsvSignal` and calls
`props.onInput`, so every pointer move produces two signal writes and two `onInput` calls, the first with the old
brightness. _Fix:_ add a `setAxes(saturation, brightness)` that builds one `next` and writes once; keep `setAxis`
for the keyboard path.

**79. Focus lands on a disabled day or option without a ring.** `Calendar.tsx:117-155,181-190` and
`Clock.tsx:126-173`: the roving walk (`moveTo` / arrow handling) may land on a cell disabled by
`computeIsDayDisabled` / `computeIsTimeDisabled` (min/max are clamped, the predicate is not); the focus effect
then calls `.focus()` on it. Its `InteractionWrapper` is disabled and not `isFocusableWhenDisabled`, so
`wrapElement` attaches no focus listeners and the painter never sees `isFocusVisible`: focus is somewhere
invisible (2.4.7 Focus Visible). This is the exact case `isFocusableWhenDisabled` was added for (`TileBoard`,
conventions "The second of those two showed up"). _Fix:_ pass `isFocusableWhenDisabled={() => !(access(props.isDisabled) ?? false)}`
on the day and option wrappers, as `TileBoard` does; alternatively skip disabled cells in the walk. Medium: verify
against the Playground's disabled-days example before changing.

**Not a decision: 2.4.7 requires the fix and `conventions.md` already chose which one.** Verified against the
code as the Medium note asked. `getIsDayDisabled` folds the whole-calendar flag, the min/max range and the
consumer's predicate together; the day wrapper takes it as `isDisabled` with no `isFocusableWhenDisabled`; the
arrow walk checks nothing (only `pickDay` does), so `moveTo` lands the roving day on a disabled cell and the
focus effect calls `.focus()` on it. With no focus listeners attached the painter never sees `isFocusVisible`,
so there is no ring — and `tabIndex` is forced to `-1` on every disabled element, so a calendar whose roving day
is disabled has no tab stop at all. Both halves of the `TileBoard` case, on a calendar.

**It is observable, not latent.** `CalendarPage`'s _Weekdays_ example and `DatePickerPage` both pass a weekend
predicate, so arrowing onto a Saturday on either loses the ring today. The `Clock` half has the identical shape
(`isDisabled` and `isTabbable`, no `isFocusableWhenDisabled`) but no Playground example passes
`computeIsTimeDisabled`, so that one is latent.

**The skip-the-walk alternative is already ruled out**, under _"The second of those two showed up, and
`isFocusableWhenDisabled` is the prop it earned"_: a walk that skips disabled items leaves somebody reading with
a screen reader unable to find out what shape the set is. On a calendar it would also break arrowing off the end
of the grid to page to the next month.

So the fix is `isFocusableWhenDisabled` on the day and option wrappers, gated on the composite itself being
enabled, exactly as `TileBoard` and `PatchBoard` already pass it.

**80. `Clock` ref churn.** `Clock.tsx:137-139,157-163`: `setOptionRef` spreads the whole record per option
(`{ ...prev, [key]: element }`), 146 times for a seconds-and-meridiem clock, and the `scrollIntoView` effect
tracks `getOptionRefs()`, so it runs once per ref set and scrolls every column each time (about 600 forced
layouts at mount). _Fix:_ keep refs in a non-reactive `Map` and key the scroll effect on the roving index/unit
only. `Calendar.tsx:99-107` has the same array-copy shape at 42 cells; its effect is guarded, so lower cost.

**81. `DateInput` bounds per keystroke.** `DateInput.tsx:60-72,74-83`: `getHasImpossibleDigits` calls
`computeBounds(anchor)`, which builds a twelve-entry array and calls `getDaysInMonth` twelve times, on every
digit typed. `getAnchor` is already a memo keyed on era/year/calendar. _Fix:_ `const getBounds = createMemo(() => computeBounds(getAnchor()))`
and pass `getBounds()` in.

**82. Undocumented props members.** `DatePicker.types.ts:21` and `DateRangePicker.types.ts:24` list `locale?: string;`
with no `/** */` while every neighbor has one; `DateInputProps` (which both extend) already declares and documents
`locale`. The sweep found the only other bare members of exported `*Props` types: `ariaLabel` in
`Calendar.types.ts:41` (`CalendarDayProps`), `Clock.types.ts:41` (`ClockOptionProps`), `Select.types.ts:57`
(`SelectFieldProps`) and `Menu.types.ts:50` (`MenuTriggerProps`, item 103). _Fix:_ delete the two `locale`
redeclarations (or document them); give the four `ariaLabel`s `/** Names the … for assistive technology. */`.

**83. Popup dialog name.** `ColorInput.tsx:184` `ariaAttributes={() => ({ "aria-label": access(props.ariaLabel) })}`
names the dialog from the raw prop, while the field resolves its name through `LabelUtils.resolveAriaLabel`. A
`ColorInput` named by a `Label` has a nameless dialog (4.1.2). `DatePicker` avoids this with a defaulted
`calendarLabel`. _Fix:_ add a `pickerLabel?: string` prop with a default (`"Choose a color"`), or use the resolved
label. Medium.

**84. Split imports.** `ColorInput.types.ts:3-4` `import type { Color }` and `import type { Point2d }` from
`@thewaver/ss-utils` on consecutive lines; the sort-imports plugin does not merge them. _Fix:_ one import.

**85. Two names for seven.** `Calendar.css.ts:3` `WEEK_COLUMNS = 7` and `Calendar.tsx:19` `DAYS_PER_WEEK = 7`.
_Fix:_ export `DAYS_PER_WEEK` from the `.css.ts` (it already exports constants the component reads elsewhere in
the tree) or from a `Calendar.const.ts`, and import it in the component.

**86. Helper above constants.** `ColorArea.tsx:13-14` `readFocusVisibleAxis` sits between the imports and the
`DEFAULT_` block; every other component puts constants first, helpers after. _Fix:_ move it below `PERCENT`.

### Essentials, first half

**87. `Collapsible` double `ref`.** `Essentials/Accordions/Collapsible/Collapsible.tsx:109-120`: `{...props}`
hands the consumer's `ref` to `InteractionWrapper`, whose `setElementRef` already calls `props.ref`; the trigger's
own ref callback then calls `props.ref?.(element)` again. `Button` and `Menu` pass `ref={setElementRef}` alone.
Measurable inside the library: `Accordion`'s `setHeaderRef` copies its array per call, so N sections do 2N copies.
_Fix:_ delete line 119.

**88. Empty `Modal` never takes focus.** `Modal.tsx:59,140-147`, `FocusManager.utils.ts:172`: `autoFocus` focuses
`initialRef ?? getFirstFocusableChild(ref)`, descendants only, and the container has no `tabIndex`. A dialog
whose body holds only text leaves focus on the trigger behind the overlay; the trap is bound to the portalled root,
so Tab never reaches it and walks the page. `ModalProps.initialFocusRef`'s doc says the opposite ("the dialog
focuses itself"). _Fix:_ `tabIndex={-1}` on the container (as `Popover.tsx:107` does) and fall back to `ref`
itself in `autoFocus`: `(initialRef ?? getFirstFocusableChild(ref) ?? ref)?.focus(...)`; add a spec case.

**89. Current breadcrumb is focusable.** `Breadcrumbs.tsx:38-45,84`, `Breadcrumbs.css.ts:27`: the last crumb is a
`<span aria-current="page">` but is still the wrapped element, so `wrapElement` gives it `tabindex="0"`, and its
class composes `buttonElement` (`cursor: pointer`). `decisions.md`'s Breadcrumbs entry rules out exactly "stay in
the tab order and look pressable". _Fix:_ `isTabbable={() => index !== getLastIndex()}` on the wrapper; a
`breadcrumbsCurrent` style with `cursor: default`; extend `e2e/breadcrumbs.spec.ts` to assert it is out of the
tab order.

**90. `ImageSwitcher` alt.** `ImageSwitcher.tsx:70,80` literal `alt=""` and no `alt` prop. `decisions.md`'s
`ImageMosaic` entry settles 1.1.1 for the other image component ("the criterion leaves no room"). _Fix:_ add
`alt: string | undefined` to `ImageSwitcherProps` (required-but-nullable so the consumer states the decision),
bind `alt={access(props.alt) ?? ""}` on both images, update the Playground page.

**91. CORS-split preload.** `ImageSwitcher.tsx:48` `img.crossOrigin = "anonymous"` on the preloader while the
rendered images carry no `crossorigin`. Separate cache entries, and on a cross-origin server without CORS
headers the preload errors, warns, and `swap()` runs against an unloaded image. Nothing reads pixels. _Fix:_
delete line 48.

**92. Permanent `pointermove` listener.** `Menu.tsx:57-69,631,788`: `createPointerPointReader` attaches a
`document` listener at construction and allocates a point per move, for every mounted menu, read only from
`hoverIndex` on an open level. `Dismisser` already models "a page with nothing open pays nothing". _Fix:_ gate the
listener on `getIsOpen` inside a `createEffect` (like the flick effect at lines 354-385), or share one
module-level reader with a reference count.

**93. Dead styles.** `Accordion.css.ts:17-42` `accordionSection`, `accordionHeader`, `accordionHeading`,
`accordionPanel` are referenced nowhere; `Accordion` paints through `Collapsible`'s classes. vanilla-extract emits
them anyway. _Fix:_ delete lines 17-42.

**94. Copied button reset.** `Menu.css.ts:3-23` repeats all thirteen `buttonElement` declarations; seven other
`.css.ts` compose `style([buttonElement, {}])`. _Fix:_ import `buttonElement` and compose.

**95. Wrong prop docs.** `Accordion.types.ts:52-53` and `Collapsible.types.ts:44-48` document `sizing` as a
height-animation choice (it is the width mode); `Form.types.ts:23` says `renderContent` is told "whether it is
currently submitting" (it gets `{ isValid, hasSubmitted }`); `Menu.types.ts:66-70` lists "a separator" among
`MenuItemKind`, which has none. _Fix:_ `sizing` (both) → "Whether the accordion takes only the room its content needs, or fills what it is given.";
`Form.renderContent` → "Draws the form's contents, and is told whether the form validates and whether it has been
submitted."; `MenuItemViewProps.kind` → drop ", a separator".

**96. Duplicated pick.** `Menu.tsx:663-684` and `799-826`: `getCheckedValues`, the twenty-line checkbox/radio
`pick`, and the disabled-closes effect are identical in `Menu` and `ContextMenu`. _Fix:_
`MenuUtils.computeNextChecked(checked, item, radioGroupValues)` in `Menu.utils.ts`, called from both.

**97. Volume change lost mid-fade.** `AudioSwitcher.tsx:62-72,137-145`: `fadeIn` captures `volume` at call time
and ticks toward it; the `on(getVolume)` effect refuses to write during a fade; nothing reconciles after. Moving
the slider during a 500ms crossfade leaves the track at the old level. _Fix:_ read `getVolume()`/`getStep()`
inside the tick instead of capturing. Medium.

**98. Toggle latch never cleared.** `Menu.tsx:638,686-704,371-374`: `isTogglePrevented` is set on a hold press
and cleared only by the trigger's `click`; a `pointercancel`, or a release off the trigger after a short drag,
produces no click, so the next press is swallowed. _Fix:_ clear it in the `onFlickEnd` handler (line 775), which
both `handleUp` and `handleCancel` call. Medium.

**99. `FanMenuProps.layoutDefs`.** `FanMenu.types.ts:4-7` `& { layoutDefs?: ArcDefs }` as a bare object; `Drawer`
and `WheelMenu` use `& AccessorProps<{…}>`. Neither hole applies. _Fix:_ wrap in `AccessorProps<{…}>` and read
`access(props.layoutDefs)` in `FanMenu.tsx:17`. Medium.

**100. `AudioSwitcher` nits.** Lines 3-4 two imports from `@thewaver/ss-utils`; `getActiveElement` can never be
falsy (two `new Audio()` at construction) yet is guarded at 113, 128-133, 141, and `reset` returns a `boolean`
only to report the impossible. _Fix:_ merge the import; drop the guards; `reset: () => void`.

**101. Unnamed `<nav>`.** `Breadcrumbs.tsx:79`, `Breadcrumbs.types.ts:34-35`: `ariaLabel` optional with no
default on a navigation landmark; `ContextMenuProps.ariaLabel` is required for the same reason ("nothing else can
name it"). _Fix:_ make it required and say why in the doc; the Playground page needs one. Medium.

**102. `ContextMenu` keyboard.** `Menu.tsx:828-848`: opens only on the `contextmenu` event and anchors at
`clientX/Y`. A region with no focusable descendant has no keyboard route (2.1.1, Level A); a keyboard-invoked
`contextmenu` anchors at a meaningless point. _Fix:_ add a `keydown` listener for `ContextMenu`/Shift+F10 and
anchor at `document.activeElement`'s adjusted rect when the opener was a key; detect the keyboard case in
`handleContextMenu` too. Check MDN for the keyboard-invocation shape before writing the detection. Medium.

**The mechanical half is in and the open half was already logged — `backlog.md` item 26 carries it.** The
ContextMenu key and Shift+F10 open the menu on the region's `keydown`, anchored at whatever inside the region
holds focus, and a `contextmenu` event arriving at the origin is treated the same way. What does not work is
that a `keydown` only reaches the region once focus is inside it: `regionRef` is the consumer's element, so a
region that is a plain box of text has no tab stop and can never receive the key. The Playground's own
`ContextArea` example is exactly that shape, so the keyboard route it gained does not fire at all. 2.1.1,
Level A. Item 26 records the user having weighed it and left it, and refused pushing it onto the consumer as
the "approximation plus a note" shape. This item's status claimed a pending decision without saying which; the
cross-reference to item 26 was the thing missing.

**Settled by the user: `ContextMenu` renders the region.** `backlog.md` item 26 says what would settle it is a
ruling on whether a component may write attributes onto a ref a consumer handed it, and that nothing else
needed that answer yet. Item 59 changed that: faced with the same problem — the library needing to write ARIA
onto a control the consumer painted — the answer taken there was that the **library owns the element**. Applied
here, the consumer paints into a region `ContextMenu` renders, so the component owns the `tabindex`, the role
and the name, and item 26's blocking question stops arising rather than being answered.

- `regionRef` gives way to a render slot. That is a published API change on `ContextMenu`.
- `regionRef` is already the anchor and the dismiss root as well, and all three keep working once the library
  owns the element.
- **The role-and-name half is part of this**, not a follow-up: a focusable box that announces as nothing is the
  same fault as item 64's `Stepper` span.

**`backlog.md` item 26 closes with this**, so the numbered list renumbers and `brief.md` loses its line for it —
both in the same change, per `CLAUDE.md`. The reasoning above is what moves to `decisions.md`.

**103. Redundant `ariaLabel`.** `Menu.types.ts:50` re-declares `ariaLabel?: string` that `InteractionControlProps`
already supplies with its doc; it is the one undocumented member in the type. _Fix:_ delete the line.

### Exotics, first half

**104. Cross-layer steps ignore disabled nodes.** `Exotics/Bracket/Bracket.utils.ts:116-127`: `computeStepId` is
handed the enabled placements, and first/last/previous/next walk that list, but `"toRoot"` returns `from.parentId`
and `"toLeaves"` picks from `from.childIds`, both recorded from the whole tree. Stepping toward a disabled parent
stores its id, `.focus()` does nothing (a disabled node has no `tabindex`), `getRovingId` falls back to `stops[0]`,
and the next arrow jumps to the top of the board. `decisions.md` says disabled nodes are skipped. _Fix:_ resolve
both against the passed list: `findPlacement(placements, from.parentId)?.id`, and filter `childIds` to ids present
before taking the middle one. Whether to step past to the grandparent is a separate question for the user.

**105. Non-roving nodes are unfocusable.** `Bracket.tsx:204` `tabindex={disabled || id !== roving ? undefined : 0}`
leaves every non-current node with no attribute, so a click sets `focusedId` (painter shows focused) while DOM focus
lands on `<body>` and the board's keydown handler no longer receives arrows. House pattern is `-1` (`Table.tsx:527`,
`InteractionTracker.utils.ts:379`). _Fix:_ `placement.isDisabled ? undefined : placement.id === getRovingId() ? 0 : -1`.

**106. `<For>` keyed on fresh placement objects.** `Bracket.tsx:189-220`: `computeLayout` allocates new
`BracketPlacement`s per run, so a consumer whose `root` is re-derived (live scores) gets every node and painter
destroyed and recreated, dropping focus. `decisions.md`'s Mosaic entry records the same trap and its remedy. _Fix:_
iterate `getNodeIds()` (stable string ids) and resolve each placement through a `Map` memo, as `Mosaic.tsx:80-83` does.

**107. Node refs leak.** `Bracket.tsx:130-132` `setNodeRef` adds and never removes; `Timeline.tsx:183-188` registers
`onCleanup` for the same shape. _Fix:_ add `onCleanup(() => setNodeRefs((prev) => ({ ...prev, [id]: undefined })))`
in the ref callback. Medium.

**108. `Corners` fade does not exist.** `Corners.tsx:40-62`, `Corners.types.ts:14-17`: `visibleCorners` is
documented "Leaving one out fades it away" and `transitionDurationMs` "How long a corner takes to fade in or out";
the corners render through `<For each={getVisibleCorners()}>`, so a dropped key removes the `<svg>` at once, and
no style carries `opacity` or a `transition` on the corner (only color/filter on the shared glow). The Playground's
"Fade (ms)" knob visibly does nothing for that case. _Fix (user's choice):_ (a) render all four always and drive
`opacity` per corner with `transition: opacity …ms`; or (b) correct the two doc blocks and the page hint to say the
duration times the color and glow change only.

**Settled by the user: (b), and their reasoning replaces the reviewer's.** The fade was designed for the
corners **container**, not for individual corners, and at that level it works today: the container transitions
`color` and `filter`, so a consumer fades the whole set by moving `color` toward transparent and the glow
follows on the same duration. Nothing is missing — the documentation describes the wrong level.

**Per-corner opacity is not merely unnecessary, it would misrender.** The user's objection, and it holds. The
glow is a `drop-shadow` filter on the container, and a filter is computed from the composited group beneath it
— so a corner carrying its own opacity has its shadow computed from an already half-transparent shape, and the
glow fades at a different rate than the corner. A child `opacity` below 1 also opens its own stacking context
inside the parent's filter context, giving a group within a group whose mid-transition rendering matches
neither endpoint. Both artifacts appear only while something is changing.

So two sentences change and no behavior does:

- **`visibleCorners`** loses "Leaving one out fades it away rather than removing it at once" and says only which
  corners are drawn. A dropped corner does disappear at once, and by this design that is correct.
- **`transitionDurationMs`** says it times the container's color and glow change, which is how the set fades as
  a whole, rather than claiming a per-corner fade.

The Playground's "Fade (ms)" label stays as it is — it does time a real fade, the container's.

**Recorded for later rather than proposed:** if per-corner fading is ever wanted, `opacity` is the wrong lever
for the reason above, but animating each corner's arm length to zero sidesteps the compositing entirely.

**109. Zero iterations.** `CellAnimation.types.ts:29` "Zero means it never stops"; `CellAnimation.tsx:27-33,108`
treat `0` as "ended before the first frame" (`getCurrentIteration() >= 0`). The endless value is `Infinity`, the
default when absent; the Playground converts its own `0` sentinel before passing. _Fix:_ correct the doc to "Left
out, it never stops", or adopt the sentinel in the component (behavior change, user's call).

**Settled by the user: correct the library's doc, and move the Playground's sentinel from `0` to `-1`.** The
component is left alone — absent means `Infinity`, and `0` iterations meaning zero iterations is what every
animation API means by it, CSS and Web Animations included. Only the sentence is wrong.

**The sentinel moves because `0` was doing two jobs.** The page currently converts its own `0` to `Infinity`, so
the knob cannot express "run no passes" at all and its label contradicts the component. The user's call is `-1`
for endless, on the Unix convention — `poll()` and `epoll_wait()` both read a `-1` timeout as "block forever",
and `RLIM_INFINITY` is the same idea. That frees `0` to mean what the component means, and a count of `0` is a
demonstrable state rather than a lie: `getHasEnded` is `getCurrentIteration() >= getAnimationIterationCount()`,
so zero passes shows the `finalFrame` immediately.

What changes:

- **`CellAnimation.types.ts`** — `animationIterationCount`'s block becomes "How many passes to run. Left out, it
  never stops." No code moves.
- **`CellAnimationPage.tsx`** — `ENDLESS_ITERATION_COUNT` becomes `-1` and `MIN_ITERATION_COUNT` becomes `-1`
  (both are `0` today; the step is already `1`, so `-1` is reachable). The `PageProp` label becomes
  "Iteration count (-1 = endless)" and its `hint` says so — a knob's hint is part of the knob under
  `conventions.md`.
- **`-1` stays a Playground spelling and does not enter the library.** A typed `number` prop already has
  `Infinity`, and two spellings for one value is what the doc fault was.

**110. Size signal without `equals`.** `CellAnimation.tsx:45` `createSignal<Size2d>` with reference equality, written
with a fresh object per `ResizeObserver` notification; a sub-pixel change re-derives every edge, rebuilds
`count.x * count.y` defs, rewrites four styles per cell and restarts the animation from `t = 0`.
`createBorderBoxSizeObserver` de-duplicates with `Size2d.isSame` for exactly this. _Fix:_ `{ equals: Size2d.isSame }`
(import `Size2d` as a value).

**111. Bare `100`.** `CellAnimation.tsx:259` `"z-index": Math.floor((1 - defs.weight) * 100)`. _Fix:_
`const CELL_ANIMATION_DEPTH_STEPS = 100;` beside the other module constants. Medium.

**112. `Odometer` name discarded.** `Odometer.tsx:74` puts `aria-label` on a bare `<div>`; ARIA prohibits an author
name on the generic role, so "Score" never reaches a reader. `FlipCard`/`Cuboid` use `role="group"`,
`CellAnimation` `role="img"`. _Fix:_ add `role="group"` (or `role="img"` if the label should replace the value).

**113. Dead `digitIndex`.** `Odometer.utils.ts:35-49`, `Odometer.types.ts:9-13`: computed onto every slot and
documented as what the cascade is keyed on; nothing reads it except the test's helper. _Fix:_ drop it from the type,
the builder and the test, or key the cascade on it so the doc becomes true.

**114. Per-item observer and re-pack.** `Exotics/Mosaics/ElementMosaic/ElementMosaic.tsx:20-44`: one ref signal, one
`createBorderBoxSizeObserver` and one effect per item; each `setSizeAt` copies the array and triggers a full
`Mosaic` layout, so N items mean N packs at mount and per resize. `createBorderBoxSizeListObserver` exists for
this (used by `Toolbar`, `Toasts`). _Fix:_ one refs array signal plus the list observer; keep the `getSizes` padding
memo so unmeasured items still render.

**115. Re-pack per image load.** `ImageMosaic.tsx:19,37-42`: each `load` replaces the whole size record, invalidating
the layout; N images means N `packScaled` runs at startup. _Fix:_ buffer sizes in a plain object and flush once per
`requestAnimationFrame`, cancelled in `onCleanup`.

**116. Sources change mid-load.** `ImageMosaic.tsx:21-43`: the effect asks "is the size known" rather than "was it
requested", so a `sources` change while loads are in flight creates a second `Image` for every unresolved source
(each resolving twice), and a pruned source's late `load` writes its entry back. _Fix:_ a non-reactive
`requested: Map<string, HTMLImageElement>`; skip requested sources; on prune, detach handlers and delete; handlers
return early when their src is no longer requested; clear in `onCleanup`. The sweep adds: today no `onCleanup`
exists at all for these images (`ImageMosaic.tsx:34-41`), while `ImageSwitcher.tsx:42-46` and
`ColorExtractor.context.ts:28-32` null their handlers and set `img.src = ""`; the same shape belongs here.

**117. Destructured `*Signal` props.** `Cuboid.tsx:29-30` and `FlipCard.tsx:25` `const [getYaw] = props.yawSignal`
read the prop once; a consumer swapping the signal is ignored. 64 sites use `accessSignal`/`createOptional`; these
three are the only direct destructures (`CellAnimation.tsx:43` in the same folder does it right). _Fix:_
`accessSignal(() => props.xSignal)`.

**118. Dead alias.** `Formation.types.ts:7` `export type FormationInset = PlacementRect;` referenced nowhere.
_Fix:_ delete.

**119. Spelling.** `Bracket.utils.ts:11` "centring" → "centering" (folded into item 7's list).

### Exotics, second half

**120. `PatchBoard` with a disabled first node.** `Exotics/PatchBoard/PatchBoard.tsx:357-362,761-765`:
`getRovingStop` falls back to `getStopKeys()[0]` whether or not it is disabled; every other stop is
`isTabbable={false}`, and no wrapper passes `isFocusableWhenDisabled`, so a disabled first node gives every node
and socket `tabindex="-1"` and Tab skips the board (2.1.1). On an enabled board, arrowing onto a disabled node
focuses it with no ring (same as item 79). `TileBoard.tsx:161` is the precedent. _Fix:_
`isFocusableWhenDisabled={() => !getIsDisabled()}` on the node and socket wrappers (761-765, 834-848).

**121. Socket disabled state.** `PatchBoard.tsx:858-862`: the socket's `aria-disabled` reads the socket's own flag
and the lock, not the node's `isDisabled`; the socket holder is a sibling of the node element, so the node's
attribute cannot cover it, while `getPlacedSockets` and `pickUpPlug` do honor it. _Fix:_ read
`getPlaced()?.isDisabled || getIsLocked() || undefined`, which already merges the two.

**122. Quadratic socket lookup.** `PatchBoard.tsx:746-748,794-796`, `PatchBoard.utils.ts:110-111`: while carrying,
each socket's `getPlaced` runs `findSocket` (a linear `find`) over all sockets, and each node's placement lookup
likewise, on every pointer move. _Fix:_ `Map` memos keyed by end key and placement key, read by the per-item memos
and by `getCableDefs`.

**123. `posinset` on a button.** `Timeline.tsx:60-70,376-380`: `aria-posinset`/`aria-setsize` sit on the
`role="button"` item; ARIA supports them on `listitem` and kin, not `button`, so the windowed list's "4 of 10" is
dropped, which is the stated reason the attributes are there. _Fix:_ move both onto the wrapping `<li>` (line 357),
drop `posInSet`/`setSize` from `TimelineItemProps`, and add `role="list"` to the `<ul>` (427) since
`list-style: none` makes Safari drop list semantics.

**124. Unconditional `outline: 0 none`.** `Timeline.css.ts:38` on `timelineControl` (the focusable button div) and
`Bracket.css.ts:27` on `bracketNode`. The library paints no ring, so this removes the UA indicator and relies on a
consumer rule at equal specificity winning on source order; a consumer with no focus rule gets no visible focus
(2.4.7). _Fix:_ scope it: `selectors: { "&:focus:not(:focus-visible)": { outline: "0 none" } }` at both sites. Medium.

**125. Restart refused while running.** `Typewriter.tsx:108-119`, `ScrambleText.tsx:91-97`: both controllers
return `false` and do nothing when already animating. conventions.md "Asking for a state a thing is already in
does nothing" names `Typewriter`'s explicit restart as the exception: "restarting something already running is
exactly when it means something". Code and convention disagree. _Fix:_ confirm which is current, then either
restart unconditionally (both already clear their timers first) or correct the convention.

**Settled by the user: restart unconditionally — the convention was right and the code is wrong. The boolean
stays.** Both controllers drop their guard and always restart; `clearAnimation()` already runs first in each, so
there is nothing to protect against.

**What decided it:** the _internal_ `restartAnimation` has no such guard, and `update()` calls it unconditionally,
so a window resize mid-animation already restarts the thing. Only the controller wrapper refused, which reads as
incidental rather than designed — and it made the consumer's explicit request the one route that was denied.

**The user's second ruling is a new library-wide convention: every controller callback returns whether it
succeeded or failed.** That is why the boolean stays rather than collapsing to `void` once it can only be `true`
— a restart that is now always honored still reports that it was. The convention is backbone-independent and
belongs in **`conventions.md`**, written there in the sweep.

It is the readable counterpart to _"Asking for a state a thing is already in does nothing"_: that rule says a
redundant request changes nothing, and this one is how the caller finds out that is what happened.
`WheelController.spin` is the clearest case — it is already documented "Does nothing while one is already under
way" and returns `void`, so today there is no way to learn that.

**Audit to run in the same sweep — 14 commands across 7 controller types return `void` and must return
`boolean`.** The `get*` members are reads, not callbacks, and are untouched.

- `TrailController` — `play`, `pause`, `seek`
- `TimelineController` — `zoomBy`, `panBy`, `showSpan`
- `ScratchCardController` — `reset`, `clear`
- `SortableGridController` — `turnCw`, `turnCcw`
- `TypewriterController` — `update`
- `WheelController` — `spin`
- `AudioSwitcherController` — `reset`

Already conforming: `ScrambleTextController.restartAnimation` and `TypewriterController.restartAnimation`.
Each one's implementation and its Playground call sites move with it, and the members need `/** */` blocks
saying what `false` means — a controller type feeds an `onMount` prop, so it is inside the documented surface,
and none of these carry a block today.

**126. `Typewriter` resize churn.** `Typewriter.tsx:81-106,136-137`: the `ResizeObserver` calls `update("layout")`
unthrottled and with no width check; `update` writes the segments to empty and count to zero, then re-parses and
writes them back, unbatched, so every character span and every `<a>` is destroyed and rebuilt twice per resize
frame, dropping focus from a link in the text. _Fix:_ return early when `clientWidth` equals the last parsed
width; delete the two clearing writes (lines 87-88 are overwritten by 103-104) or wrap in `batch`.

**127. Per-particle writes in the frame loop.** `ParticleSpawner.tsx:114-166`: `spawnNext` and the arrival branch
each call `setLiveParticles` per particle inside `tick`, unbatched: N array copies and N `<For>` reconciliations
in one frame when N spawn together. _Fix:_ wrap the body of `tick` in `batch(...)` or accumulate and write once
per frame; hoist `getTargetRects()` (line 142) out of the per-particle loop.

**128. `Shape` size without `equals`.** `Shape.tsx:14,70-73`: `createSignal<Size2d>` with reference equality,
written with a fresh object per observer callback, so a sub-pixel reflow recomputes every superellipse path and
rewrites both SVGs' `width`/`height`/`viewBox`; `Surface` is built on it. _Fix:_ `{ equals: Size2d.isSame }`, or
replace the hand-rolled observer with `ElementObserverUtils.createBorderBoxSizeObserver` as five siblings do.

**129. Ref collections as signals.** `Timeline.tsx:174-182`, `SortableGrid.tsx:146-154`: refs kept in a signal
holding a record/array, rebuilt per write, read only imperatively; `Timeline` mounts and unmounts items as the
window pans, each waking the focus effect. `PatchBoard.tsx:56` holds a plain `Map` with an `onCleanup`. _Fix:_
plain `Map<number, HTMLElement>` with `set` in the ref callback and a guarded `delete` in `onCleanup`;
`SortableGrid`'s array also leaks stale entries when the list shrinks.

**130. The last `/ 2`.** `TileBoard.utils.ts:20` `Math.sqrt(3) / 2` while line 14 declares `HALF`. The only
power-of-two division left in the library. _Fix:_ `Math.sqrt(3) * HALF` (bit-identical).

**131. `SortableGridSpot = { x, y }`.** `SortableGrid.types.ts:12-51` and throughout: a cell index named `x`/`y`
reaches the consumer in `spot`, `fromSpot`/`toSpot`, `renderCell(getSpot)`; the component translates back to
"column, row" in `computePlaceLabel`. `TileBoard` uses `Index2d`. Public type change, so the user's word first.
_Fix:_ `Index2d` (`.x` → `.col`, `.y` → `.row`) across types, utils, component, test and Playground page. Medium.

**Settled by the user, and widened twice.** The item's reason for holding this back — "public type change, so the
user's word first" — was inconsistent with the review's own treatment of items 28 and 42, both of which were
public (`NavigatorCell` was deleted from the barrel outright and `DateValueUtils.getCellOf`'s return type
changed) and neither of which was flagged. The convention is explicit and `TileBoard` already speaks `Index2d`.

**`SortableGridSize` converts too, and the user gave the general rule:** _width and height are reserved for
pixel sizes, not counts._ So `SortableGridSize` becomes `{ rowCount, colCount }`, matching what `NavigatorGrid`
became under item 28. `SortableGridRect` then holds a `{ row, col }` spot beside genuine pixel `width`/`height`,
which is clearer rather than muddier, because only one of the two is still named for pixels.

**That rule belongs in `conventions.md`**, written in the sweep, as the tally-side companion to _"A grid index
names its space and its axis, never `x` and `y`"_: a pair counting rows and columns is `{ rowCount, colCount }`
or an `Index2d` named for what it tallies; `width` and `height` mean pixels.

**`CellAnimation` converts in the same pass — the user's call on scope.** It has the same fault one layer
deeper and worse: `cellCount`, the cell's own `pos` and the `count` handed to every weight function are all
`Point2d`, so a grid position and a grid tally are both `{ x, y }` in one file. That is exactly the silent swap
the convention exists to stop, and it is live rather than theoretical — `isEvenRow` reads `dist.y` and
`isEvenColumn` reads `dist.x`. It reaches `CellAnimationCellState`, `computeCellWeights`, the thirty-seven
weight functions, `ScanlineAnimation`, `Mosaic.utils` and two Playground pages.

**`SVGPatternCellCount` is left alone.** It is already `{ rows, cols }`, so it carries no ambiguity; it just
spells the idea differently from `{ rowCount, colCount }`. Not worth a third pass through the pattern family.

**One check for the build:** this is a rename, not an arithmetic change, so
`CellAnimation.utils.test.ts`'s pinned known-broken weight values must come out **identical**. `conventions.md`
records those as deliberately pinned and re-blessed only as part of fixing `backlog.md`'s weight bug — so if any
of them moves during this conversion, the conversion is wrong, not the test.

**132. `SortableGrid` double `ref`.** `SortableGrid.tsx:645-662`: `{...props}` hands `ref` to the wrapper, which
calls it; `renderControl` calls `props.ref?.(element)` again (line 661). Same as item 87. _Fix:_ delete line 661.

**133. `ScratchCard` focus loss.** `ScratchCard.tsx:118-121,224-255`: Enter on the cover starts the fade; the
timeout sets `isCleared`, and `{!getIsCleared() && …}` removes the focused element, so focus falls to `<body>` and
the next Tab restarts at the top of the page (2.4.3). _Fix:_ give the root a ref and `tabindex="-1"`, and move
focus to it before `setIsCleared(true)` when the cover holds `document.activeElement`. Medium.

**134. Unreachable `try`/`catch`.** `RichText.tsx:49-56`: wraps `parseContent`, whose contract is that nothing is
ever rejected and which has no throw path (tests cover the malformed shapes); the `catch` logs the tree's one
`console.error` (eleven other diagnostics are `console.warn` with a `"Component: …"` shape). _Fix:_ reduce to
`const getParsedTree = createMemo(() => RichTextUtils.parseContent(access(props.content)));`. Medium.

**135. `parsedTree` memo name.** `RichText.tsx:49,61`: 516 memos are `getX`; this is the only unprefixed one that is
not a `controller` handle or the switchers' `isEven`. _Fix:_ rename to `getParsedTree` (with item 134).

**136. Braced `aria-hidden`.** `TileBoard.tsx:51`, `Timeline.tsx:417`, `Table.tsx:496` write `aria-hidden={"true"}`;
29 sites write `aria-hidden="true"`. _Fix:_ unbrace.

**137. Loose sockets in a list.** `PatchBoard.tsx:729,751-760,825-856`: root `role="list"`, nodes `role="listitem"`,
sockets `role="button"` as siblings of the node holder inside `patchBoardSlot`, with two plain divs between list
and item. A reader hears three items and eight loose buttons with no socket-to-node relationship (1.3.1). _Fix:_
`role="presentation"` on `patchBoardSlot` and `patchBoardNodeHolder`, and move `role="listitem"` up onto the slot
so a node and its sockets are one item. Changes what the board announces, so the user's word first. Medium.

**Settled by the user: drop the list semantics — the board becomes a group of groups.**

**The item overstates one half.** A socket's `aria-label` is built from `getEndLabel`, which is the node's own
label plus the socket's, so a socket already announces as "Oscillator out 1, output, connected". The
socket-to-node relationship is carried by name today; what is missing is only the structural one.

**What is genuinely wrong is the ownership.** `role="list"` has `patchBoardSlot` and `patchBoardNodeHolder`
beneath it before reaching `role="listitem"`, so the list does not own its items; and the sockets are
`role="button"` sitting inside that list rather than inside any item. A list whose children are not list items
is invalid, and that is the 1.3.1 part.

**The item's own fix was incomplete**, which is worth recording so it is not half-applied: it moves
`role="listitem"` onto the slot without saying what the node div becomes, and that div is the focusable roving
stop with click and key handlers, so it cannot be left with no role.

**Why C rather than regrouping the list.** A patch board is a node graph, not a list — the nodes are positioned
freely, there is no order to them, and nothing sets `aria-posinset` or `aria-setsize`, so the list role never
delivered what a list is for. Keeping it would have meant renaming what a node _is_ (from "list item" to
"button") purely to satisfy a role that was the wrong shape to begin with. Dropping it makes the
invalid-ownership problem stop existing rather than papering it.

The shape to build:

- **The board root** keeps its `aria-label` and becomes `role="group"`.
- **Each slot** becomes `role="group"` named after its node, holding the node control and that node's sockets —
  so the relationship is structural as well as in the name.
- **The node div** becomes `role="button"`, which it already behaves as.
- **The sockets** are unchanged.
- **`patchBoardNodeHolder` needs no role.** A `group` has no required owned elements, so intervening generic
  divs are harmless — which is a second reason this route is cleaner than the list.

**Settle while building:** whether the slot group carries the node's name when the node button inside it
already does. Labelling both means a reader hears the name twice; leaving the group unnamed is normal for a
pure container and costs nothing, since the node and socket names already identify themselves.

**138. `ScrambleText` rolls everything.** `ScrambleText.tsx:57-61`, `ScrambleText.utils.ts:92-98`: `rollNoise` maps
over all characters every tick (about 22 a second), including settled, pending and whitespace ones whose noise is
never shown, and `pickGlyph` allocates a filtered copy of the glyph set per call. _Fix:_ roll only indices that are
churning (keep `previous[index]` otherwise); replace the `filter` with index arithmetic that skips the excluded
glyph. Medium.

### Cross-cutting sweep, new items

**139. Undocumented `Samples` utils members.** _Killed by the user._ Whether anything under `Samples` should
carry documentation at all is a discussion they had already postponed, so the item was never open; the review
picked it up from the convention without knowing that. Do not raise it again, and do not write the doc blocks.

**140. `Typewriter` inline default.** `Typewriter.tsx:46,61` `access(props.initialAnimationDelayMs) ?? 0` written
twice beside three `DEFAULT_TYPEWRITER_*` constants with memos; the only inline numeric prop defaults in the tree
besides item 44. _Fix:_ `const DEFAULT_TYPEWRITER_INITIAL_ANIMATION_DELAY_MS = 0;` and a memo, read at both sites.

**141. Uncleared `setTimeout`.** `ScreenWiper.tsx:57-59` `setTimeout(() => setTarget(newTarget), 0)` with no
stored handle and no `onCleanup`; of eighteen `setTimeout`s in the tree every component-owned one is cleared.
Solid swallows the write, so the cost is consistency. _Fix:_ store the handle and clear it in `onCleanup`
(`Typewriter.tsx:24-28` shape). Separately: why the write is deferred is recorded nowhere; worth a `decisions.md`
sentence.

**142. Knobs namespace name.** `Samples/ScanlineAnimation/Keyframes/ScanlineAnimationKeyframes.knobs.ts:4` exports
`ScanlineAnimationKnobs`; its four peers keep the singularized stem (`PlacementLayoutKnobs`, `TimedGradientKnobs`,
…). _Fix:_ rename to `ScanlineAnimationKeyframeKnobs`; update the import and nine uses in
`playground/src/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.tsx`.

**143. `ClockUtils` not exported.** `index.ts:110-111` export `Clock` and its types but not `Clock.utils`; every other
`.utils.ts` is in the barrel, and a consumer painting their own column needs `getReadings`/`getUnitName`. _Fix:_
add `export * from "./Essentials/Input/Clock/Clock.utils";` beside them.

**144. Context export pairs.** Five context folders export `.context` and `.context.types` together; `RadioGroup`
exports only the types (index.ts:150), so a consumer gets `RadioGroupContextType` with no provider or hook;
`PlacementBox` exports neither. _Fix:_ for `RadioGroup`, add the `.context` export or drop the types line (they
move together). For `PlacementBox`, leaving both private is defensible if no exported signature names
`PlacementBoxContextType`; confirm and decide. Medium on the second.

**The `RadioGroup` half is already done** — the barrel exports both `RadioGroup.context` and
`RadioGroup.context.types`.

**Settled by the user: export `PlacementBox`'s pair too.** Confirmed first that nothing forced it — no exported
signature names `PlacementBoxContextType`, and its only consumers are `PlacementBox.tsx` and
`PlacementItem.tsx`. The user exported it anyway, and gave the reason as a general preference rather than a
`PlacementBox` judgement: _providing consumers with more tooling is the preferred approach for anything
non-local._

**That is a convention and belongs in `conventions.md`**, written in the sweep. The shape: **what crosses a
folder boundary between two public components is exported; only what stays inside one folder is private.** It
generalises a rule the library already follows without having stated it — `InteractionWrapper` is public
precisely because `Button`, `Checkbox` and the rest are built on it from other folders, while `ButtonElement`
stays private because it never leaves `Button`'s. `PlacementBox`'s context crosses from `PlacementBox` to
`PlacementItem`, so by that test it was always on the public side.

**After this the rule is uniform with nothing left to audit**: all seven `.context.ts` files export their pair,
`PlacementBox` having been the only one missing.

**One thing the export obliges.** `usePlacementBoxContext` falls back to `UNTRACKED_BOX_CONTEXT` rather than
throwing, so outside a `PlacementBox` it returns an inert context — right for `PlacementItem`, and a trap for a
consumer who does not expect it. Its `/** */` block has to say so, since publishing the hook publishes that
behavior.

**145. Type in a utils namespace.** `Samples/SVGDefs/SVGDefs.utils.ts:32` `export type CycleColorKey` derived from a
module-private `CYCLE_COLOR_KEYS`; the only `.utils.ts` exporting a type, and it appears in two published
signatures. Convention: types live in `.types.ts`. _Fix:_ move the tuple constant and the type into
`SVGDefs.types.ts` (the `NO_SAMPLE_KEY`/`WithNoSample` shape) and import them back. Medium.

### Samples

**146. One tracker per stamp.** `Samples/SVGDefs/Gradient/Tracked/spot_trail_1.tsx:18,49,109` (and `spot_trail_2..3`,
`spot_smear_1..3`, `hand_trail_1..3`, `spot_ripple_1..3`): `STAMP_COUNT` is 34 and the per-stamp factory calls
`PointerTrackerUtils.create(getRef)`, so one sample instance runs 35 trackers on one element, each calling
`getAdjustedBoundingClientRect` and `computeReading` per frame for identical readings. On the tracked-gradients
page that is about 420 rect reads per frame instead of 19. _Fix:_ create once at the top of `computeSVGDefs` and
pass `getReading`/`getIsPointerPresent` into the stamp factory. Confirm `computeSVGDefs` always runs under an
owner first (`create` uses `createEffect`/`onCleanup`).

**147. Duplicate filter ids.** `spot_trail_1.tsx:120,137`, `SVGDefs.utils.ts:42-57`: `getBaseBlur(id, defs)` builds
`border-blur-filter-${id}` with nothing per entry, and the sample attaches it to the main def and to each of the
34 stamp entries; `Shape` renders one `<filter>` per def, so raising blur above 0 puts 35 same-id filters in one
`<defs>`. `url(#…)` resolves to the first, so paint is right and the fault invisible. Same in the eight sibling
files and `band_1v1.tsx:73`. _Fix:_ drop the per-stamp filter (the main def's covers the box) or suffix the id
with the entry index. Medium.

**Settled by the user, and neither of the two fixes offered above is the one taken.** The sample calls
`getBaseBlur` once into a const, uses it for the main def, and gives every array entry
`{ id: sharedFilter.id, renderDefsElement: FunctionUtils.noop }` — so one `<filter>` is declared and all 35
entries reference it.

**Why this beats both.** Suffixing the id turns 34 inert declarations into 34 real ones, which is strictly more
work than today. Dropping the per-stamp filter changes what is painted, because the stamps lose their blur.
Sharing one declaration changes nothing about the paint at all — the browser was only ever using the first of
the 35, so the other 34 are dead DOM and this is a pure deletion.

**It also needs no type change.** The route the reviewer could not see was that `renderDefsElement` does not
have to be made optional on `SVGDefs.filter`: Solid's `JSX.Element` includes `undefined`, so a no-op returning
`void` satisfies it and `Shape` emits nothing for that entry. Both facts checked rather than recalled —
`FunctionUtils.noop` is in `utils/src/Abstracts/function.ts` and documented for exactly this use, and
`JSX.Element` is `Node | ArrayElement | string | number | boolean | null | undefined`.

**One wrinkle to handle.** `getBaseBlur` returns `undefined` when `blurWidth` is zero or absent, so the const is
optional and the entries need `sharedFilter && { id: sharedFilter.id, renderDefsElement: FunctionUtils.noop }`
rather than reaching for `.id`. That also preserves today's behavior, where no blur means no filter reference.

**Scope:** `spot_trail_1.tsx` and its eight sibling trail and ripple files, plus `band_1v1.tsx:73`.
Single-entry samples call `getBaseBlur` once and are already correct.

**Not fixed by this, and left as a separate question:** the per-frame cost is unchanged — 35 elements are still
blurred, through one declaration instead of 35. Only dropping the stamps' blur buys frames, and that wants
looking at with the blur knob up before anyone decides it.

**148. Untyped knob maps.** `TimedGradient.knobs.ts:35,71`, `TrackedGradient.knobs.ts:280,549`: `KNOBS_BY_FAMILY`
has no annotation and `DEFAULTS_BY_FAMILY` is `Record<string, Record<string, number>>`; the other three knob
modules type every entry `SampleKnobs<XDefs>` / `Required<XDefs>`, which `decisions.md` names as the mechanism
that makes a renamed option break the build. Nothing is mis-keyed today. _Fix:_ key both maps on the family
union and type each value `SampleKnobs<…>` against its `Gradient*Opts`.

**149. Step default in two places.** `TimedGradient.knobs.ts:30` `STEPS_DEFAULT = { steps: 12 }` and
`SVGDefs.utils.ts:15` `DEFAULT_GRADIENT_STEPS = 12`; ten Timed samples read the utils one, the panel seeds from
the knobs one. Convention: a `.utils.ts` never exports a defaults object. The Tracked samples read their knobs'
`DEFAULTS`. _Fix:_ delete `DEFAULT_GRADIENT_STEPS`; the ten samples read `TimedGradientKnobs.STEPS_DEFAULT.steps`.

**150. Private inside the namespace.** `TrackedGradient.knobs.ts:489` `const RIPPLE_SOURCE_SCALE = 0.25;`
unexported inside `export namespace TrackedGradientKnobs`. Same rule as item 41. _Fix:_ move above the namespace.

**151. `Bracket` registries.** `Samples/Bracket/Connectors/BracketConnectors.const.tsx:111` and
`BracketConnectorPaths.const.ts:70` export `ALL: Record<string, …>` with no `SampleKey`/`SAMPLE_KEYS`; every
other registry is `SAMPLE_*` with both, and `playground/.../BracketPage.tsx:22` hand-writes the key list because
of it, so a fifth connector would not reach the picker. _Fix:_ rename to `SAMPLE_CONNECTORS`/`SAMPLE_PATHS`, use
`satisfies` instead of the widening annotation, add `SampleKey` and `SAMPLE_KEYS`, read them in `BracketPage`.

**152. Missing `SAMPLE_KEYS`.** `SVGDefs.const.ts:100,117`: `Iteration` and `Pattern` export `SAMPLE_CONFIGS` and
`SampleKey` but not `SAMPLE_KEYS`, which both Gradient sub-registries do; `ShapePage.tsx:542`,
`TimedGradientsPage.tsx:125`, `SVGPatternsPage.tsx:155` re-derive it with a cast. _Fix:_ add the export to both
namespaces and replace the three casts.

**153. Hand-spelled transparency.** `Timed/orbit_async_3.tsx:21,23,43,45,76,78`, `orbit_async_2v1.tsx:38`,
`snake_async_3.tsx:21,64,121`, `merge_diag_async_4.tsx:20,49,78,107` write `` `rgb(from ${c} r g b / 0)` ``; the other
nineteen Timed samples call `SVGDefsUtils.getTransparentColor`, which emits `rgba()` for hex input (the samples'
colors are all hex) and falls back to relative-color syntax only when it cannot parse. _Fix:_ call the helper
at each site (already imported). The Tracked samples' `rgb(from …)` with a computed alpha are correct as is.

**154. `whirlCurved_2`.** `Pattern/whirlCurved_2.tsx:8`, `SVGDefs.const.ts:65,113`: every other key in the three
SVG registries separates qualifiers with underscores (`circle_hd_2`, `band_diag_1`); this one is camelCase beside
`whirl_2`. The picker groups it correctly by accident (`/^[a-z]+/` stops at the capital). _Fix:_ rename file,
export, registry entries and the `index.ts` line to `whirl_curved_2`.

**155. Thirds as decimals.** `Keyframes/Samples/encircleCw.ts:6-7` and `encircleCcw.ts:6-7` `at: 0.33`, `at: 0.66`
for four evenly spaced corners: the last leg is 0.34. conventions.md names this exact case. _Fix:_ `1 / 3` and
`2 / 3`. The `shoot*` samples' lone `0.66` is a tuned overshoot among `0, 0.25, 0.66, 1` and stays.

**156. `NOTHING + 1`.** `Bracket/Connectors/BracketConnectorPaths.const.ts:7,43` `if (Math.abs(drop) < NOTHING + 1)`
is the constant's only use. _Fix:_ `const MIN_BEND_DROP = 1;` and `< MIN_BEND_DROP`.

**157. Three orders.** `Placement/Layouts/PlacementLayouts.knobs.ts:65-74,300-309`: `KNOBS_BY_FAMILY` alphabetical
(matching `SAMPLE_LAYOUTS`), `DEFAULTS_BY_FAMILY` in another order, and the two declaration runs in a third.
`ProximityEffectKnobs` keeps its two maps aligned. _Fix:_ alphabetical everywhere.

**158. Band ramp thrice.** `Tracked/band_1.tsx:34-53`, `band_diag_1.tsx:34-53` inline the five-stop falloff ramp
that `band_1v1.tsx:15-27` factors into `getBandColors`; the copies have already drifted in shape. `decisions.md`
keeps a sample's shape explicit but lets small shared helpers be shared. _Fix:_ move it into `SVGDefsUtils` as
`getFalloffStops(color, { coreStop, coreAlpha, falloffSpread, falloffAlpha })`, documented, called from all three;
verify the paint is unchanged. Medium.

**Not a decision, and the item's premise is wrong in the direction that makes it safe.** "The copies have
already drifted in shape" is true of the _code_ and not of the arithmetic. All three write the same five stops
by the same formula — transparent at 0, `falloffAlpha` at `coreStop - falloffSpread`, `coreAlpha` at `coreStop`,
`falloffAlpha` at `coreStop + falloffSpread`, transparent at 100. What differs is only which defaults object
supplies the fallbacks: `BAND_DEFAULTS`, `BAND_BLEND_DEFAULTS` (which overrides `coreAlpha` to 0.5 and
`falloffAlpha` to 0.15) and `BAND_DIAGONAL_DEFAULTS` (which changes only `bandTravel` and `bandAngle`, so it
ramps identically to `band_1`). The drift is that `band_1v1` factored it into nine lines while the other two
spell it across twenty verbose ones each.

So the extraction is **provably** paint-neutral rather than needing a visual check — on one condition: the
helper takes the **resolved** numbers, not the `opts` object. Each sample resolves against its own defaults and
hands the four values over, which satisfies `CLAUDE.md`'s _"when merging two implementations that disagree on a
constant, keep both behaviors — a parameter with per-call-site defaults"_ by construction rather than as a
special case.

Built as `SVGDefsUtils.getFalloffStops(color, { coreStop, coreAlpha, falloffSpread, falloffAlpha })`, documented
in the `*.utils.ts` style, called from all three.

**159. Five bare numbers.** `Weights/Samples/radarSingle.ts:5`, `spiralSingle.ts:5` and seven siblings call
`radar(pos, count, origin, 4, 0, 1, 2, 3)`; the trailing numbers land on `quadrantsPerSection, cdoMul, croMul,
cuoMul, cloMul`, while the ripple samples name theirs (`RIPPLE_PERIOD_CELLS`). Values checked and coherent.
_Fix:_ name them per sample, or collapse the five positionals into one defs object with spelled-out names
(nine call sites and two published signatures, so the user's word first). Medium.

**Settled by the user: the defs object, and the shape is to be followed by the rest.**
`radar(pos, count, origin, { quadrantsPerSection, clockDownMul, clockRightMul, clockUpMul, clockLeftMul })`,
and `spiral` the same. The four `*Mul` names get spelled out properly on the way — `cdoMul` through `cloMul` are
unreadable at the definition, which is where they matter most. It is also the house shape already:
_"SVG / factory arg order — primary args → defs → opts"_.

**The allocation worry is answered by hoisting, not by declining.** These run per cell per frame, so a defs
object built at the call site would allocate per cell. Each sample declares its defs as a module-level `const`
and passes it by reference, so nothing is allocated per call and the pinned weight tests cannot move.

**The boundary for "the rest", since the rule is not "every numeric parameter".** A run of **tuning numbers**
becomes a defs object; genuine **operands** stay positional. Applied across the weights file:

- **`radar` and `spiral`** — five tuning numbers each. Converted; nine sample call sites.
- **`ripple(spread, maxSpread, periodCells, travelRatio)`** — mixed. `spread` and `maxSpread` are computed
  operands and stay positional; `periodCells` and `travelRatio` are tuning and become
  `{ periodCells, travelRatio }`. Eight sample files, which already hoist those two as local consts, so they
  gain a wrapper rather than new names.
- **`hashToUnit`, `interleaveBits`, `stride`, `fromOrderedIndex`, `greatestCommonDivisor`** — untouched. These
  take operands with self-describing names, and `greatestCommonDivisor({ a, b })` would be worse than what is
  there.

**That boundary belongs in `conventions.md`**, written in the sweep, beside _"One aggregated object per painter"_
— it is the same argument applied to a utility rather than a render callback.

**160. `NO_ITEMS` as zero.** `PlacementLayouts.utils.ts:23,114-136,181,249-269,345,457,462`: seventeen uses, one
meaning "no items" (line 110); the rest are an arc length, a loop index, degrees, an offset, a share. Line 153's
reduce seeds with a bare `0` where line 40 uses `NO_ITEMS`. Constants are also split across two blocks (20-38 and
144-149). _Fix:_ add `const NOTHING = 0;` (the name `Barrel`/`Bracket`/`SortableGrid` use) for the non-count
uses; merge the constant blocks. Medium.

**161. `SVGAnimations` parameter names.** `SVGDefs/SVGAnimations.const.tsx:9,13,25,50,89,102,108,134,145,166,183`:
`sArr`, `oArr`, `aArray`, `rArr`, `vArr`, `sArray` for the same role, `s` meaning scales in one and stops in
another; `Radial.grow` (105) and `Radial.sweepOrthogonal` (111) call `.join(";")` directly past the file's own
`join`. A `.const.tsx` carries no comments, so the names are the only documentation. _Fix:_ full words (`scales`,
`offsets`, `angles`, `radii`, `values`, `colorTracks`); route the two sites through `join` or delete it. Medium.

**162. `swarm` mirror mismatch.** `Keyframes/Samples/swarmCw.ts:11` `scaleX: 30, scaleY: 30` versus
`swarmCcw.ts:11` `35`, in a pair that mirrors exactly at every other stop; the `35` gives the smoother ramp
(5,5,5,5,5,10,10,15,20,20). It changes paint, so the user picks. _Fix:_ make both match. Medium.

**Settled by the user: take the `35`.** `swarmCw`'s `scaleX: 30, scaleY: 30` at `at: 0.6` becomes `35`, matching
`swarmCcw`. The step sizes decide it rather than the values: with `35` the ramp steps 5, 5, 5, 5, 5, 10, 10, 15,
20, 20 and never decreases, while `30` holds at 5 for one stop too long and then jumps to 15, skipping the 10.
Every other field in the pair mirrors exactly, so the odd number reads as a typo rather than a choice — which is
what the user concluded too, having written it years ago.

### Essentials/Input, first half (late report)

**163. `Clock` commits the base, not the walk.** `Clock.tsx:92-115,141-147,184-189`: every option's `time` is
built from `getBase()` (the committed value) with only its own column replaced, and Enter does
`pick(column.options[index])`. Walk the hour from 09 to 14, move right, walk minutes to 30, press Enter: the value
becomes 09:30. `decisions.md`'s Clock entry says a walk across three columns writes once, which is exactly what
fails; `e2e/timePicker.spec.ts:133` presses Enter in each column in turn and so never sees it. _Fix:_ in the
`SELECT_KEYS` branch commit `ClockUtils.withReading(column.unit, column.readings[index], getRovingTime(), …)`;
cleanest is `pick(time, unit)` with the click path passing `option.time`. Keep the option objects for the
per-option disabled reading.

**164. Range lost after clearing a half.** `DateRangePicker.tsx:38-62`: clearing the end field writes `undefined`
outward (correct), but the two mirroring effects then see `range === undefined` and write `undefined` into the
held start half too; the start field keeps its text with no value behind it, and retyping the end produces
`isSameRange(undefined, undefined)` so nothing is written. `DateTimeValueUtils.createSplit` guards this with
`if (!value) return;`; this hand-written split left the guard out. _Fix:_ add `if (!range) return;` to both
effects (or build the halves through a range flavor of `createSplit`); add a spec that clears, retypes and
expects the range back. Note item 39 asks the opposite guard question for `createSplit`; the two should be
decided together.

**Settled with item 39: build the halves through the shared `SignalMirrorUtils.createSplit`** rather than
adding a guard here. The behavior this item asks for was already recorded in `decisions.md`, so only the
mechanism was ever open; item 39 carries it.

**165. `ColorInput` picker unreachable.** `ColorInput.tsx:182-195`: the `Popover` has no `hasAutoFocus`, so focus
stays on the field button; the popup is portalled to the end of the document, so Tab moves to the next page
control and the dismisser's `focusout` closes the popup. A keyboard user can open the picker but never reach its
three sliders (2.1.1, 2.4.3). `DatePicker`, `TimePicker`, `DateRangePicker` and `Menu` all pass `hasAutoFocus`.
_Fix:_ `hasAutoFocus={true}`; add a spec that presses Enter then Tab and expects the saturation slider focused.

**Not a decision: 2.1.1 is Level A and the house already has the answer.** Confirmed against the code —
`TimePicker`, `DatePicker`, `DateRangePicker` and `Menu` all pass `hasAutoFocus={true}` on their popup, and
`ColorInput` is the only popup owner in the library that does not. So this is one component failing a pattern
the other four follow, not a trade-off: a keyboard user can open the picker and then never reach its sliders,
because Tab leaves the portalled popup and the dismisser's `focusout` shuts it.

Taken with the sweep: `hasAutoFocus={true}` on the `Popover`, plus the spec described above.

**166. Duplicate `id`/`name`.** `DateRangePicker.tsx:97-110`, `DateTimePicker.tsx:17-34`: both `<DateInput {...props}>`
(and `DatePicker`/`TimePicker`) receive the consumer's `id` and `name` unchanged, so one id lands on two inputs
and one name submits two fields. `ColorArea` composes `-saturation`/`-brightness` for the same reason. _Fix:_
compose `-start`/`-end` and `-date`/`-time` per half; document the suffixes on the `id` member. Medium.

**167. Focus jumps to range start.** `Calendar.tsx:148-154,175-182`, `RangeCalendar.tsx:42`: the second press
completes the range, `computeAnchorDay` now returns `range.start`, the anchor effect overwrites the highlight and
the focus effect moves focus there. Enter on the 10th, arrow to the 20th, Enter: the ring jumps back to the 10th.
_Fix:_ remember the last pressed day in `RangeCalendar` and return it from `computeAnchorDay` while it is one end
of the completed range; fall back to `range.start` for values arriving from outside. Medium.

**168. Activation keys ×6.** `Calendar.tsx:24`, `Clock.tsx:18`, `TileBoard.tsx:18` (`SELECT_KEYS`),
`ScratchCard.tsx:20` (`CLEAR_KEYS`), `Bracket.tsx:25`, `Timeline.tsx:46` (`ACTIVATION_KEYS`), plus
`trackActivation`'s own copy. _Fix:_ one documented `ACTIVATION_KEYS` (or `getIsActivationKey`) on
`NavigatorUtils` or `InteractionTrackerUtils`. Medium.

**169. Formatter per cell.** `Calendar.tsx:270-276`, `DateValue.utils.ts:481-486`: each of 42 labels calls
`DateValueUtils.format`, which constructs a fresh `Intl.DateTimeFormat`; construction is the expensive half.
_Fix:_ `DateValueUtils.createFormatter(value, options, locale)` returning a bound formatter; build two in a memo
keyed on locale and calendar id. Medium.

**170. Escape lands on the wrong field.** `DateRangePicker.tsx:64-69,105-110`: `dismiss` focuses
`querySelector("input")`, the start field, while the trigger lives in the end field's trailing slot. _Fix:_ hold a
ref to the end input and focus that. Medium.
