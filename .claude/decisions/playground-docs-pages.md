# Decisions: playground-docs-pages

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### A docs example's code sits below its box, and the accordion examples share one width

**The "Show code" accordion is drawn below the example box, not inside it.** The example is a column
(`docsExampleStack`): first the box with the demo and its knobs, carrying `docsExample`
and the `data-docs-example` marker; then the accordion on its own, at level 0, since it sits on the page background
like the box rather than in it (the user's correction — it first carried the box's level 1), inside a `docsExampleCode` box that gives it the box's shadow and the header's rounding. Specs find an
example by the marker on the box, so the code — which repeats an example's text — can never match a locator built
from that text.

**Every accordion and collapsible in the Docs examples sits in a box of capped width** (the shared `docsAccordion`
class; Collapsible's Side example composes it into `sideExample`, which also centers), and takes the shared
`DOCS_GAP` as its gap, except Accordion's Basic, whose gap is a knob. A readout beside an accordion (Deferred's
"Built so far") sits outside the capped box, so the demo's own spacing separates the two.

**Accordion's Orientation example has no branching in its code.** The look is all in the shared `Accordions.css.ts`,
driven by two attributes: the box around the accordion carries `data-orientation`, each panel carries `data-move`
set to the move direction `renderPanel` is handed, and each header and panel has one fixed class. The stylesheet
turns the attributes into an axis and a move, and one animation slides the panel from them — sideways when
horizontal, from above or below when vertical — so the code a visitor reads is the same for both.

**A vanilla-extract variable set inline goes through `assignInlineVars`** (or each framework's equivalent), as
`PageDocsAlert` sets its colors. Written raw as a style key, a vanilla-extract variable's name is `var(--…)`, which
the browser drops without a word.

### A docs example puts its own controls below the component

The user's rule, stated as "always": when a Docs example carries controls of its own — the "Open all" and "Close all" buttons that write an accordion's list, say — they sit below the component, never above or beside it. The first draft of the accordion's controlled example had them above. This is about controls that belong to the example itself and show in its code. The knobs are a separate thing: they are the column beside the demo, at the user's 60 to 40 split. A control that is part of the component's own markup, such as the "Add a line" buttons inside a growing panel, stays where the component puts it. The one placement the user chose by hand, `SlideButton`'s reset to the right of the button in its held example, was set before the rule and has not been revisited.

### A docs example has no knob that exists only for the Playground

The user's rule, "for now, at least", given together with the exclusion of a reset button: a knob whose only purpose is to let a visitor put the demo into a state is not wanted in a docs example. A knob stays when it sets a real prop of the component (`isDisabled`, `renderSeparator`, `linkComponent`) and goes when it only adjusts the fixture. The case that set the rule was Breadcrumbs' **Depth**, a number field that cut the example trail to a given length, and that the trail itself also set by shortening when a crumb was pressed. Now the examples always start from the whole constant trail, trimmed to four crumbs (`TRAIL` in `BreadcrumbsPage.const.ts`). Pressing a crumb still shortens the trail, because that is what a real app does and the example's code should read like one: each example keeps its own depth and slices the trail to it, with a restore button below (the `replay` glyph, as in `SlideButton`'s held example) that brings the crumbs back. The user chose this over a readout that left the trail alone, accepting a restore button as the one control the example needs, which is not the Playground-only kind this rule is about. Not a standing ban on fixture-sized controls elsewhere; the user's wording was "for now, at least".

### The open/closed arrow follows the side the panel opens on

The user left the choice to Claude ("your guess is as good as mine"), after saying the arrow should depend on orientation. The rule chosen: **the arrow of an open header points at the panel, and a closed one is that arrow turned a quarter turn counterclockwise**, so opening is always a quarter turn clockwise. For the usual panel below, that is the familiar disclosure triangle (closed `▶`, open `▼`), unchanged. For a panel above: closed `◀`, open `▲`. To the right: closed `▲`, open `▶`. To the left: closed `▼`, open `◀`. The other reading weighed was "an arrow points where the panel will go when closed and back when open" (closed `▼` below, open `▲`), which suits a drawer but would have changed every accordion header in the Playground. Only the Collapsible's Side example passes `side` to `PageAccordionHeader`; the Accordion's horizontal orientation draws no arrow, and everything else keeps the bottom behavior. The right and left cases read oddly (a closed arrow pointing up) and are the first thing to revisit if the user dislikes it; their word was that either guess is as good as the other.

### On a docs demo, the Disabled knob is last

The user's rule, given while the Breadcrumbs examples were being built: in a docs example's knob column, `isDisabled` goes after every other knob. Applied at once to the three pages built so far: `Button`'s two examples (in the Tooltip one, "Reachable when disabled" now sits above "Disabled", though its hint says it only matters while Disabled is on, which is the one place the literal reading cuts against the natural order), `SlideButton`'s first example (after Error) and `Breadcrumbs`' first (after Separators). All four Playgrounds follow it.

### A section's knob starts on the behavior the section is about

The user's rule, given after it was missed twice (Carousel's Looping knob, EdgeFader's Scroll-aware knob): in a
docs example that illustrates one feature, the knob for that feature starts in the state that shows the feature,
whatever the library's default is. A section about scroll-aware fading opens with the fade scroll-aware; a section
about looping opens looping. Starting at the library's default was the wrong reading of the first correction — the
default happened to be the showing state there and not here. Knobs that only tune a feature (a size, a duration)
still start at the library's default.

### A docs box's severity says what skipping it costs

Settled with the user over Form's box. **`alert`** marks something whose neglect ships a fault the author will not see
themselves — one only a screen reader, a keyboard user or the console shows (SlideButton's `ariaDescription`,
Carousel's buttons). **`info`** marks scope: skipping it only leaves the reader knowing less (Breadcrumbs' and
Carousel's "only examples", Form's "validates nothing" — a form with no checks shows it the first time it is tried).
So the warning sign keeps one meaning: this fails someone you are not testing with.

### A docs section's text never opens with a prop name

The user's rule, for every Docs page: a prop name is lower-case, so a paragraph starting with one reads as a sentence
with no capital. Open with a word of the sentence and bring the prop in after it ("Every change also runs onInput",
"Pass edges any mix of…", "Set side to choose…"). It applies to section text, alert and info boxes alike.

### Six calls taken at the end of the Essentials Docs conversion

The user's answers, given one at a time once the five conversion agents had reported:

- **A popup carries its anchor's direction, and its default placement follows it.** Popups are portalled to the end of
  the document, so one opened from a right-to-left box laid itself out left to right (a calendar's week ran from the
  left), and only `Menu` chose its default placement by direction. Now every portalled layer — `Select`'s list,
  `ColorInput`'s picker, the date and time pickers, `HoverCard`, `FlyoutMenu`'s panel, a `Modal`'s contents, the fan's
  and wheel's items — writes the direction of the element it belongs to, and every anchored default placement is
  chosen per direction, as `MENU_DEFAULTS.placement[direction]` already is.
- **`ColorArea`'s axes stay left to right.** The surface is a picture and does not mirror; its two hidden axis inputs
  are `dir="ltr"`, so the right arrow always moves the handle right, as it did on screen, rather than following the
  text and working against the picture.
- **`SegmentedInput`'s cells always run left to right.** One-time and recovery codes are digits and Latin letters, and
  in right-to-left text the cells had filled from the right, so "123" read "321".
- **A typed date the calendar refuses is an error, not a value.** `DateInput` takes the same refused-day option the
  calendar does; a typed refused day is kept as typed, marked as an error, and does not move the value — a refused
  weekday has no nearest bound, so it is enforced like a format, under _"A field keeps the text it shows apart from
  the value it holds"_.
- **`ImageSwitcher` keeps the old picture when the new one fails**, as its intro promised, and reports the failure
  through `onError`.
- **A two-field picker shows one tooltip**: `DateRangePicker` and `DateTimePicker` anchor a single tooltip on the
  pair, shown while either field is hovered or focused, rather than one copy per field.

**A `Modal` reads its direction from whatever opened it** — the user's call, over a marker left where it is written
(an empty text node in Solid, a hidden element in React, which can disturb a consumer's `:last-child`) and over a
prop: the element that held focus when it opened, the one focus returns to on closing, so nothing is added to the
consumer's markup and all four frameworks behave alike. A modal opened with nothing focused takes the document's
direction, which is right on a page that is right to left throughout — the real-world case, since a right-to-left
site sets `dir` on `<html>`.

**`Label` names its control by the caption alone** — the user's call, once a picker's calendar button gained its own
name and the `<label>` element folded it into the field's ("Arrival Open the calendar"). The caption gets a
generated id and the control `aria-labelledby` pointing at it, which overrides the name a `<label>` computes from all
its text; the `<label>` element stays, so pressing the caption still focuses the control. It is the same mechanism
`FormField`'s caption uses.

### The Essentials Docs conversion: what each page settled

Thirty-four Essentials pages became Docs pages in Solid, by five agents working from the playbook above; every page
holds its own state, the old global panels became knobs on the examples they change, and readouts appear only where
the example holds something the screen does not show (`data-readout` on each, so specs find them). Per page, what is
not obvious from the code:

- **Dates and times.** The old Calendar, Week starts on and First week holds knobs moved onto the examples they
  change; "Other calendar systems" is a section on every page that had the knob, starting on `hebrew`
  (`OTHER_CALENDAR`). DateRangePicker and DateTimePicker draw their fields at `PAIR_FIELD_WIDTH` (160) to fit the demo
  column. DateInput's day-first section carries a Format knob over the exported `DATE_INPUT_FORMATS`. Calendar keeps
  month and year picking as two sections although both are values of `precision` (`CALENDAR_PRECISIONS`).
- **ColorInput**: a swatch alone, with a value readout; a correcting setter. **ColorArea**: the surface with a
  readout of the HSV numbers, then a picker built around it, closing through `Popover`'s `onDismiss`; its trigger
  states `ariaHasPopup="dialog"` and `ariaExpanded`. A press without movement moves the handle, which is the
  single-pointer route WCAG 2.5.7 asks of the drag. **FileInput**: one section per way files arrive; the 2.5.7 alert
  sits in the drop section, since only the drop is a drag; "Refusing a pick" refuses a name with a space, a rule only
  the consumer can make, since type, size and count need no code. **SegmentedInput** and **TagInput** gained the field
  template's knobs, tooltip and Label sections; TagInput's examples name each tag "word, remove" through
  `computeTagAriaLabel` (WCAG 2.4.6, with the word first per 2.5.3).
- **CheckboxGroup**: the boxes draw their own words. **Label**: the one page where controls draw no words and a
  `PageLabelCaption` sits beside them; Orientation is a knob over `LABEL_ORIENTATIONS`. **FormField** and
  **FormSection**: every submit button stays enabled, with a status line reading `isValid`, as on Form's page;
  FormField's Required knob starts off, at the library default.
- **Modal**: four sections; "A dialog that must be answered" has its two dismissal props as knobs starting off and a
  WCAG 2.1.2 alert, since with both off only the consumer's own control lets a keyboard user out; Alignment is a knob
  over `MODAL_ALIGNMENTS`. **Drawer**: one example with an Edge knob, and swiping cites 2.5.7 inline rather than in an
  alert, because the overlay tap the library always provides is the alternative. **Sidebar**: push, overlay and
  hover as three sections, the hover readout showing `expanded` stays false while hovering opens the panel.
  **HoverCard**: Basic only, without a Skip window knob, since one card has nothing to skip between.
- **Menubar** and **Toolbar** take a width knob for the overflow, under the Select precedent: the size is what the
  section shows. **FanMenu** and **WheelMenu** keep their painters in the page's `Solid.const.tsx`; WheelMenu's half
  wheel and tuning became knobs, its hole and band starting at the page's 64 and 84.
- **Progress**: Value and Error knobs on Basic, every bar filling its container; the live examples read out the
  spoken value text. **Preview**: the held example became "Opening and closing from outside" with a toggle below,
  as on Collapsible. **TableOfContents** builds its heading ids per instance, since a second outline shares the page.
  **AudioSwitcher** carries a WCAG 1.4.2 alert for auto-played sound. **Sortable**: an info box, since the three
  routes are built in; Orientation is a knob over `SORTABLE_ORIENTATIONS`; lists that can empty keep
  `LIST_MIN_WIDTH`. The ring's `itemHeightRatio` (0.3692) is the card's height over its slot width, re-measured once
  the locked card's label lost "— locked" (the user's call: it is drawn disabled already) and the ring stopped
  overflowing by a pixel. **SplitPane**: an alert for unnamed dividers, which also warn in development; Orientation
  is a knob over `SPLIT_PANE_ORIENTATIONS`; ratio readouts stay, since a share is not readable off the screen.

### The sweep after the conversion: names, direction and the gaps the pages exposed

- **A portalled layer takes the direction of the element it belongs to.** `AnchorSolidUtils.createPortalPosition`
  reads the anchor's direction through `NavigatorSolidUtils.createDirectionSignal`, only while visible, and writes
  it as `dir` on the content, so `Popover` and everything on it, `Tooltip`, `FlyoutMenu`'s panel and `Spotlight`'s
  popup inherit it. `Modal` reads `FocusManagerUtils.getFocusOrigin()` before focus moves in, and writes `dir` on its
  overlay and container, never its root, whose alignment must stay physical for `Drawer`. The carried copies of
  `Sortable` and `SortableGrid` take their list's direction. The direction watcher keeps the last direction it read
  once it stops, so a closing popup keeps its side through the fade. Every non-centered anchored default is keyed by
  direction: `POPOVER_DEFAULTS`, `COLOR_INPUT_DEFAULTS`, `FLYOUT_MENU_DEFAULTS` and the date and time pickers'.
  Toasts and Spotlight's overlay are left alone: neither belongs to an element. Checked against WCAG 1.3.2.
- **Pictures, not text, stay left to right**: `ColorArea`'s axis inputs, and `ColorInput`'s hue `Range`, wrapped in a
  `display: contents` box with `dir="ltr"` so the slider's own direction reading and its painter agree.
  `SegmentedInput` sets `TextField`'s internal `isLeftToRight` (kept out of the preset props) and a `ltr` cell row.
- **A name is the caption's words alone.** `FormField` publishes `getCaptionId` beside `getDescriptionId`, and every
  registered control writes `aria-labelledby` through `FormFieldSolidUtils.resolveAriaName`; a control's own
  `ariaLabel` under a caption is dropped and warned about, as inside a `Label`; inside a `Label`, the Label's caption
  wins as the nearer one; a `Range` thumb with its own `thumbLabels` entry keeps it; `Select`'s listbox points at the
  caption directly, since ARIA does not follow `aria-labelledby` twice. A `Label` learns its caption because the
  caption registers itself (`LabelSolidUtils.registerCaptionId`); one that does not leaves the `<label>` to name the
  control natively. `PopupTrigger` keeps its own `triggerAriaLabel` inside a Label (WCAG 4.1.2).
- **`ColorInput` says its color through a description**: a visually hidden, `aria-hidden` span pointed at by
  `aria-describedby`, with words from `computeValueText(value, hsv)` and the value as written by default — React Aria
  names a swatch with a generated color name instead, which a library shipping no words cannot do.
- **`Button` states the popup it opens** with `ariaHasPopup` (the ARIA popup roles) and `ariaExpanded`, independently.
- **`ImageSwitcher`'s text travels with its picture**: the store carries each layer's `alt`, so the picture left on
  screen after a failure or during a load is read with its own words (WCAG 1.1.1); the leaving layer is hidden.
- **The date pickers**: `DateInput` takes `disabledDays` and `computeIsDayDisabled`, and `parseDigits` answers
  `undefined` for a day `CalendarUtils.getIsDayRefused` refuses (WCAG 3.3.1); the pickers inherit both rather than
  redeclaring them. A read-only picker's trigger is disabled, as React Aria's is, since `aria-readonly` is not allowed
  on a button. The popup's month is converted with `withCalendar` when the picker starts, opens, or changes calendar.
  A two-field picker draws one `Tooltip` with `isAnchorGroup` on its root — focus anywhere inside counts, and the
  focused control is the one described — and hands the painter `TextFieldUtils.mergeFlags` of both fields.
- **Warnings added under the warn-don't-block rule**: `SplitPaneUtils.warnIfGutterUnnamed` (4.1.2) and
  `TagInputUtils.warnIfTagsUnnamed` (2.4.6).
- **`TableOfContents` reports a section already current on load, once**, and never `undefined` before anything has
  been current; the Playground's API view skips that first report so it does not overwrite a deep link.
- **`Drawer`'s `left` and `right` are `justify-items: left` and `right`**, so its edges stay physical in
  right-to-left text.

### The last Essentials pages: how their examples map, settled before building

The user's calls and the playbook's, for Menu, Tree, Range, Tabs, Paginator, Scroller and the three Spotlights.
**Scroller's three plain button layouts** (one at each end, both at the end, both at the start) are one example, a
button at each end, with the text saying the buttons are the consumer's to place anywhere — the user's call, on the
condition that the unusual layouts keep sections of their own: the short track between the step buttons and the
arched bar. Elsewhere the playbook decides: state examples become knobs on Basic; "Links" and "Links through a
component" become one section with a component knob, as on Breadcrumbs; placement examples become a Placement knob;
the shared panels move onto the examples they change, a count that sizes the data staying where the size is what the
section shows (Tree's virtualized example, Paginator's item count); Tree's "Everything collapsed" folds into
"Collapsed from outside"; Tabs' "A direction switched while on screen" becomes a button under its right-to-left
example. Toasts, ViewportWrapper and CommandPalette are left for a session of their own, and Table stays last.

**`Scroller` draws no buttons and places none: it hands over a controller** — the user's call, reversing
`renderButton` and `buttonPlacement`, which were a slot drawing controls inside the component's box and the layout
decision that slot forced, against _"A component hands out a controller and renders no controls of its own"_. A box
scrolling both ways showed the cost: two fixed positions per direction had nowhere sensible for four buttons. Now
`onMount` hands one stepper per direction — at the start, at the end, step back, step forward, each step reporting
whether it acted — and the consumer lays the buttons out wherever, pointing them at the box with `aria-controls`, as
`Carousel`'s consumer does. The Docs page carries the same alert as Carousel's: a strip given no buttons has no
keyboard route (WCAG 2.1.1).

### The last Essentials Docs pages: what each settled

- **Menu**: eighteen examples into Basic and thirteen sections. Disabled is Basic's only knob (Menu has no error
  look); Disabled with Reachable when disabled sits on a Tooltip section, as on Button. "Placed above" and "Submenus
  placed on the right, right to left" became one Placement example over `ANCHOR_H_PLACEMENTS` and
  `ANCHOR_V_PLACEMENTS`, down starting on `top_out`. The two disabled-item examples became one with a Reachable knob;
  Paste and Duplicate are both disabled, so the knob changes reachability alone. "A gliding highlight" gained a knob
  passing or leaving out `renderHighlightFloater`, as Select's Group boxes knob does. The cascader writes the path on
  every `onActivate`, since a branch only opens its submenu. **Right to left keeps two examples**, the button's menu
  and the right-click region, because each picks its default side differently: one hangs from its button's right
  edge, the other spreads left from the pointer. Every example running commands reads out its last run. Props no old
  example showed (`submenuOpensOn`, `opensOnHold`, `submenuMode`, `triggerRole`) are left to the API tables.
- **Tree**: Basic is the unheld tree, the shortest code to copy. "Default" and "Everything collapsed" folded into
  "Opening and closing from outside", starting on `src` and Lib, with Expand all, Collapse all and a delayed
  collapse below it; the delayed one is the only way a reader sees focus move off a branch closed from outside.
  Disabled and reachable are one example over `createFilesWithDisabled(isReachable)`, so the knob never changes the
  tree's shape. The windowed tree keeps a Node count knob under Select's precedent, through
  `createStressFiles(nodeCount)`. The painter indents with `padding-inline-start`, or depth vanished in right-to-left
  text, and **mirrors its branch arrow there** (◀ closed, ▼ open) — Claude's call, after Material's guidance that
  arrows pointing a direction are mirrored. The painter reads each row's direction through
  `NavigatorSolidUtils.createDirectionSignal` rather than `:dir(rtl)`: in Chromium the `role="group"` box a tree
  inserts when a branch opens did not match `:dir(rtl)` under a right-to-left ancestor although its computed
  direction was `rtl`. The cost is one reader per mounted row, sharing one observer.
- **Range**: Basic with Orientation (over `RANGE_ORIENTATIONS`), Error and Disabled; stepping and limits with Min,
  Max and Step; two thumbs, the disabled pair as its Disabled knob; right to left; read as prices, keeping the
  `onChangeEnd` readout; drawn as a knob, where a press sets the value, which meets 2.5.7 without a separate
  control; the tooltip. Readouts stay except on the knob, which prints its value.
- **Tabs**: Basic with Orientation (over `TABS_ORIENTATIONS`) and Disabled, every tab enabled on its own
  `BASIC_TABS`, as on Radio; right to left with a button below switching the box's direction; automatic activation
  as a section, since the prop needs its reason told; the hover marker; a disabled tab with a Reachable knob; links
  with a component knob; clearing; the honeycomb.
- **Paginator**: Basic carries the old panel's knobs — Item count, since the count is what a paginator shows, Page
  size, Sibling count, Boundary count, Disabled last. Ends, the counted arrows, the go-to-page field and the dial are
  fixed at 60 items, 3 to a page. Links are one section with a component knob. No alert: every name the paginator
  needs is a required prop.
- **The Spotlights**: each preset is its own page, each Basic carrying knobs for its real props (padding starting at
  the Playground's 20). Each page's alert names what only a screen reader shows: the guide's asks for `announcement`
  (4.1.3), the hint's says a hint is only drawn, so what it points at must be said in text (1.3.1), and the prompt's
  carries backlog item 4's gap and asks for a lit control whose name states the question (2.4.6). Hint and prompt
  show no right-to-left example: each draws a hole at a measured rectangle and nothing with a direction.
  **`SpotlightGuide` requires `ariaLabel`**, its popup being a dialog (4.1.2), while the base `Spotlight` keeps it
  optional for the two with no popup; **a guide shown with no `announcement` warns once**
  (`SpotlightUtils.warnIfUnannounced`). `onShow` and `onHide` fire when the fade begins, as everywhere built on
  `ElementFader`, so the tour's hand-overs between guide and prompt are written in `batch`.

**What the Scroller controller settled in building.** `ScrollerController` is `getBoxId` plus an `x` and a `y`
`ScrollerStepper`; a `hidden` direction reads as at both ends and refuses its steps (`ScrollerUtils.getCanStep`).
**`gap` went with the buttons**: it only ever spaced them from the box, whatever its doc block said; spacing between
items would be new work. **Buttons no longer leave when everything fits** — they are the consumer's, so hiding them is
the consumer's choice: the Docs examples show them disabled, and the site's source viewer hides its pair while its
stepper is at both ends, as it looked before. `Button` gained `ariaControls` so a button built on the controller can
name the box. **A step back that would land on the first item goes all the way to the start**, padding included,
mirroring the forward rule; it used to stop two pixels short and leave the back button live. This supersedes the
"It renders no `<button>`" paragraph and `getButtonPlacement` under _"Controls: `Scroller`"_.
