# Lib backlog

Outstanding work in `components/src` — bugs, code and architectural smells, missing implementation, pending
decisions. Nothing else belongs here. Once an item is done or dropped it is deleted outright rather
than marked resolved, and the remaining items are renumbered to stay contiguous from 1.

**`brief.md` beside this file lists the same faults one line each, grouped by kind, and the two are
edited together.** Anything opened, closed or renumbered here is reflected there in the same change. If closing it
settled a decision that drives future work, that decision moves to `conventions.md` when it is a rule the
whole library follows and to `decisions.md` when it is about one component; the record of having done the
work does not go anywhere.

**Accepted limits are not outstanding work, and live in their own section at the end.** Asked for by the user
on **2026-08-11**: a fault that has been looked at and consciously left alone should not be re-read and
re-weighed every time the question is "what is left". They are unnumbered, they are not in the index, and a
report on the state of the library does not list them unless something has changed about one. Moving an item
there is a **decision the user takes**, not a way of retiring an item that has merely gone stale — an item
nobody has argued about is still open.

**Two sections at the end hold things that are not outstanding work, and neither is part of the answer to
"what is next".** **_Accepted limits_** is above; **_Open discussion_** is the second. Both are unnumbered and
neither is in the index. The difference is what they hold: an accepted limit is a real fault, consciously left
alone, and an open-discussion entry is an idea nobody has committed to building. Asked for by the user, so that
a sketch can be written down and argued over without ever competing with real work for attention.

Most items now carry an **_Elsewhere_** block: what other component libraries do about the same
question, read off their own documentation and source on **2026-08-10**. It is evidence for decisions
that have not been taken — not a recommendation, and not a decision. Where a published answer
contradicts something already settled in `conventions.md` or `decisions.md`, the settled entry stands until
someone argues it down; where it names a mechanism this repo had not considered, that is the part worth
reading.

### Index

1. Neither animation component can reveal its own children — _open_
2. `Select` — four things deliberately not built — _open_
3. `Menu` — two things deliberately not built — _open_
4. Other core controls the library does not have — _open, ordered by the user_
5. What the verification suite still cannot see — _open_
6. Planned: a consumer-facing layer of controls above the library — _planned, not a focus_
7. `Toasts` — one thing deliberately not built — _open_
8. `Calendar` — two things deliberately not built — _open_
9. `ColorInput` — two things deliberately not built — _open_
10. `Accordion` — one thing deliberately not built — _open_
11. `Tabs` — a pairing the consumer can still skip — _open_
12. `Viewport` as a region: what is settled and what is not — _open_
13. `Tree` — two things deliberately not built — _open_
14. `SlideButton` — three things deliberately not built — _open_
15. `Spotlight` — one thing deliberately not built — _open_
16. `Scroller` — four things deliberately not built — _open_
17. `Paginator` — four things deliberately not built — _open_
18. The carousels — four things deliberately not built — _open_
19. The four components ported from React — what did not settle — _open_
20. An anchored layer is always a frame behind — _postponed until the platform catches up_
21. `Table` — six things deliberately not built — _open_

### Build order

Covers the unbuilt controls in item 4. The ordering principle is **how much of the existing base
a thing reuses**: anything that is a preset or a composition of what already works comes before anything
that needs a new primitive, and anything blocked on an architectural decision comes last, so the
decision is made once with several consumers in view rather than inferred from the first one.

**Blocked on a primitive that has to be designed first.** Do not start these by inventing the primitive
privately inside them.

1. **Nothing is blocked on a primitive any more.** The date and time family was the last entry here: the mask
   covers fixed patterns and growing groups, `MaskedField` holds the shared field, `CurrencyInput` was the third
   consumer that proved the seam, and the range variants, the date-and-time value, the typed sign and the
   locale's own grouping have all since been built. See `decisions.md`; that item is closed.

**Out of the cost ordering, deliberately:**

- **The form story is settled, wired and finished.** `Form`, `FormField` and `FormSection` ship and every
  control reads the description context; see `decisions.md`. This entry used to say the opposite — that it
  was the one item whose cost _grew_ with delay, because every control built without it grew its own half of
  the error plumbing — and nothing of it is outstanding now.
- **Dismissal, open state and openers are all settled.** All five layers dismiss through `DismisserStack`, all
  five take a `visibilitySignal`, and `Menu` takes an anchor while `ContextMenu` opens at a point; see
  `decisions.md`. Nothing in this family is outstanding.
- **`Table` / data grid stays out of scope**, and specifically must not arrive as a by-product of
  `Tree` or of virtualization.

---

## 1. Neither animation component can reveal its own children

**The half this item used to be mostly about is closed.** A fill that is not a photograph — a gradient, a
solid, a pattern — is a source like any other: an SVG string as a `data:image/svg+xml,` URI, which the
component slices exactly as it slices a photograph. It needed one library fix, quoting the cell's background
URL, and no new machinery; see `decisions.md`. `PageComponents/SVGDefsSources` goes further and serialises
`Shape`'s own gradients and patterns into sources, so the two drawn examples pick from the same registry the
Shape page uses.

What is left is the other half. The React-era component could fill each cell over **its own children**, which
is what made a reveal-over-content effect possible — an animated button, a wipe over a card. The mechanism
that would be analogous to what the component does now is a copy of the content per cell, offset by minus its
own position and clipped by the cell box, so a slice flies as a unit the way an image slice does. That forces
three things: the content arrives as a render callback rather than a slot, since Solid children are real nodes
and cannot be placed in forty-two boxes at once; the content is built once per cell, forty-two times at the
default grid and a hundred and twenty-one in the stress case; and nothing inside can be interactive, because
every copy is a duplicate. **The user called that too costly.** A single copy with per-cell windows is not an
alternative — transforming a window moves the window over static content, which is a different effect.

**_Elsewhere._** There is nothing to compare against, and that is the finding: no headless library
ships anything in this family. Ark UI's set is the widest of them at forty-seven components and has no
cell, scanline or wipe animation; Radix and React Aria own no animation component at all. What the
motion libraries do instead is animate a property over whatever children they were handed, with no
source image anywhere in the contract — which is the arrangement this item is asking for rather than
the one both components have.

---

## 2. `Select` — four things deliberately not built

The decisions behind what exists are in `decisions.md` under the three `Select` headings. These are
the gaps, each with the reason it is still a gap.

- **A consumer whose filter injects a non-matching option can see the highlight land on it.** While
  filtering, the highlight goes to the first option rather than to the selection, because the component
  knows which options are _present_, not which ones _matched_. The fix belongs in the consumer's
  filter; the trade-off is recorded in `decisions.md`.
- **The group box is not paintable, only its header is.** The library owns
  `<div role="group" aria-label>` so the role cannot end up in consumer markup; the consumer fills the
  header via `renderGroup`. Handing it a `renderOptions` thunk in `renderPopup`'s shape would give it
  the whole box, and is available if something needs it.
- **What the stress variant reports is the cost of mounting options**, which is a separate cost from painting
  them. Windowing removed the mounting cost for lists that opt in; nothing addresses the painting half, and the
  cheap answer to it was `content-visibility` on the option paint, which is gone — see `decisions.md`.
- **Dismissal does not restore the query.** Escape and blur clear it rather than restoring the selected option's
  text, because restoring it would need the per-option string this design does not have. The open state itself is
  no longer private — `visibilitySignal` ships; see `decisions.md`.

**_Elsewhere._** Checked against Radix, React Aria and Kobalte, which is the SolidJS one.

- **Typeahead is a string per option in all three, and two of them derive it rather than asking.**
  Radix's `Select.Item` takes an optional `textValue`, and when it is absent typeahead uses the item's
  own rendered text content. React Aria's list items take `textValue` and require it only when the
  children are not plain text. Kobalte takes `optionTextValue`, a field name or getter on the option
  record, documented as being for typeahead. This is the reading that closed the gap: the option element
  is the library's here, so its text is reachable without a prop, and `computeCustomText` is the way out
  for the cases that need one. See `decisions.md`.
- **A filterable list is a separate component everywhere.** Radix has no autocomplete primitive at all,
  so the injected-non-matching-option case cannot arise there; and where a library does own the filter
  it necessarily knows which options matched, which is the knowledge this design trades away by
  choice.
- **The group box is styleable everywhere else because everything is styleable everywhere else.**
  Radix's `Select.Group` and React Aria's `Section` are library elements that carry the role and accept
  the consumer's class name; neither hands over a thunk. That route is closed here by the rule that the
  library accepts no class names, so the thunk really is the only shape left — worth stating, because
  from outside the omission reads as an oversight rather than a consequence.
- **Virtualization is nobody's library code.** Kobalte's select has a `virtualized` boolean and a docs
  example handing the list to `@tanstack/solid-virtual` with a hundred thousand options; React Aria has
  a `Virtualizer` wrapper; Radix has neither, and its docs cover long lists only with scroll buttons.
  So the seam is a flag plus a documented integration rather than an `Abstract`, and the flag exists
  precisely so the library stops managing its own scrolling — which is the loose end this bullet names.
- **Open state is controlled-or-uncontrolled in all three**, under the same three names: `open`,
  `defaultOpen`, `onOpenChange`. The consumer can always close it programmatically and the library
  still owns the default.

---

## 3. `Menu` — two things deliberately not built

The decisions behind what exists are in `decisions.md` under _"`Popover` extracted, and `Menu` as the
second consumer"_ and _"`Menu` submenus: a level per popup, focus moving between them"_. These are the
gaps, each with the reason it is still a gap.

- **There are no groups and no separators.** `SelectItem<T>`'s discriminated record would carry them
  unchanged, and the walk that would number them is no longer a thing to write: `Abstracts/Flattener` owns it
  and `Select` and `Tree` both read it, so a grouped menu is a `computeChildren` and a `computeIsEntry` rather
  than a third copy. What that does **not** decide is the paint and the keyboard — whether a separator is a
  row the walk emits or a thing the painter draws between runs, and whether a group header is reachable.
  A consumer that needs sections today paints them into `renderPopup` around a flat list.
- **`Tab` closes the menu and returns focus to the trigger rather than moving past it.** APG says move
  to the next element after the trigger. The menu is portalled to the end of the document, so letting
  `Tab` through lands focus wherever the portal sits, which is worse than not moving. The cost is one
  extra `Tab`; fixing it properly means computing the trigger's next tab stop by hand.
  **_Elsewhere._**

- **Groups, separators and stateful items all live inside the menu component.** Radix ships `Group`,
  `Label` and `Separator`, plus `CheckboxItem` and `RadioGroup` / `RadioItem` — which is where the stateful
  rows landed here too, on the user's call. The separators and labels are the first bullet above and are
  still missing.
- **Nothing does the `Tab` behaviour APG asks for.** Radix's menu does nothing at all on `Tab`, and
  that is filed against it as a spec-compliance bug (radix#1934) which is still open. Closing and
  returning focus to the trigger is therefore ahead of the field rather than behind it.
- **Right-click is a separate opener, never a separate menu.** Radix ships a whole `ContextMenu`
  component with the same menu inside it; Ark UI and Zag instead add a `ContextTrigger` part to the
  same menu, and open it on a roughly 700ms long press when the pointer is pen or touch. Both keep one
  menu and vary the opener, which is the shape `ContextMenu` took here — see `decisions.md`. The long
  press for pen and touch is the half nobody has asked for yet: a `contextmenu` event is all that is
  listened for, so a touch device gets whatever its browser synthesises.

---

## 4. Other core controls the library does not have

`Fundamentals/Input` covers `TextInput`, `TextArea`, `NumberInput`, `CurrencyInput`, `Checkbox`, `Toggle`, `Radio`,
`RadioGroup`, `Select`, `MultiSelect`, `FileInput`, `ColorInput`, `Label`, `Calendar`, `DateInput`,
`DatePicker`, `TagInput` and `TimeInput`; `Fundamentals` adds `Accordion`, `Breadcrumbs`, `Button`,
`TrackCarousel`, `DrumCarousel`, `FlipCard`,
`SlideButton`, `Scroller`, `Paginator`, `Sortable`, `SplitPane`, `Stepper`, `Tabs`, `Toolbar`, `Tooltip`, `Popover`, `Menu`, `Modal`, `Drawer`, `Progress`,
`Range`, `Toasts` and `Tree`.
Beyond the date and time family, this is what is missing. **The order below is the user's, taken on 2026-08-15 after reading a
worked example of each**, and it replaces the old ordering by architectural cost — that principle still
explains what a thing would need, but it no longer decides what comes first.

**This list cannot be inferred from the Playground**, and reading it as the evidence for what is missing
is the trap: every control on every page and in every props panel is now a library control, so the
Playground has nothing left to say about what the library lacks.

**The library is the HTML layer, and that is what decides whether a thing belongs here at all.** The user's
statement of scope: accessibility, layout and structure — the half that Canvas and WebGL game engines neglect.
Anything that wants a drawing surface is the consumer's, and which one they reach for is theirs to choose. So a
sprite sheet, a particle system and a renderer are all out of scope by construction rather than by priority,
and a proposal that begins "the library could draw…" has already answered itself.

**What was dropped on 2026-08-15, so it is not re-proposed:** a segmented control, a rating input,
and the pure-paint family of `Skeleton`, `Avatar`, `Badge`, `Card` and `Icon`. The paint family was never a
component question — the Playground already builds three of them as `Surface` examples. **The toolbar was
dropped with them and has since been reopened by the user and built**: what changed is that the part worth
having turned out to be the overflow rather than the row, and `decisions.md` records the cut, the roving
walk and the two paintings of one action. The segmented control and the rating
are now the **Segmented** and **Rating** variants on the Radio page, which is the whole of what each was;
see `decisions.md`, which also records why the rating's hover preview needed no library change. None of
these is an accepted limit, because none is a fault; they are simply not wanted.

### Next up, in the user's order

**Nothing is queued here.** `Stepper` was the last of them and shipped on **2026-08-15**.

**`Breadcrumbs`, `TagInput`, `SplitPane` and `Stepper` were all built on 2026-08-15** and are no longer here; their decisions are in
`decisions.md`. What each left behind as a gap is recorded there rather than reopened as an item: a
breadcrumb trail cannot collapse when it is too long, a tag input has no cap, no in-place editing, no
paste-a-delimited-list and no reordering, a split pane cannot collapse a pane or reset on a double-click, and a stepper draws no connector of its own
and does not enforce that a linear flow stays linear.

### Bottom of the list

Placed last by the user on **2026-08-15**, after the difference between it and its nearest existing control
had been argued. It is not dropped; it is not next.

**`Table` / data grid was the other one, and it is built** — asked for directly, out of turn, so the ordering
here was overtaken rather than wrong. Its decisions are in `decisions.md`. What it left behind as a gap is
recorded there rather than reopened as an item: no column pinning, no grouping or aggregate rows, no
expandable rows, no inline cell editing, no filtering, and no key that steps into a cell holding more than one
control.

- **A command palette.** Mostly assembled already — `Select`'s autocomplete inside a `Modal`, since typing to
  narrow a list is what the autocomplete does. What separates it from `Menu` is that it is opened by a
  shortcut rather than by a button, and holds every action in the application rather than the few that relate
  to one element. Two pieces are missing: results gathered from several sources and shown in labelled groups,
  which is the grouped-and-windowed case item 2 leaves open, and a document-level hotkey, which wants the
  register-and-stack shape `DismisserStack` has rather than a listener per consumer.

**_Elsewhere._** Ark UI's set is the widest of the headless libraries and is the most useful scope check
available: it has a tree view, a pagination component, a **segment group** — a segmented control as its
own component, distinct from both tabs and toggle group — and a `Field` plus a `Fieldset`. It has no
table and no data grid. TanStack Table is what that gap gets filled with, and it is a separate project
with its own release cycle, which is this item's call arrived at independently — the reasoning that put the
table last, kept here because it is the scope check for what a data grid is, not because the table is still
outstanding.

- **Breadcrumbs is owned by at least one of them:** React Aria ships `Breadcrumbs`.
- **Pagination is owned because it is arithmetic, not paint.** Ark UI's takes `page`, `pageSize`,
  `count`, `siblingCount` and `boundaryCount`, computes the visible page range and where the gaps fall,
  and switches between buttons and links with a `type` prop. That is more than a composition of `Button`,
  which is the argument this item lost — `Paginator` is built, and where it departs from that shape is in
  `decisions.md`.
- **Worked examples of each, read on 2026-08-15**, which is what the user's ordering above was taken from:
  [TanStack Table](https://tanstack.com/table/latest/docs/overview),
  [React Aria Breadcrumbs](https://react-aria.adobe.com/Breadcrumbs/useBreadcrumbs.html),
  [Ark UI Segment Group](https://ark-ui.com/docs/components/segment-group),
  [Ark UI Splitter](https://ark-ui.com/docs/components/splitter),
  [cmdk](https://cmdk.paco.me),
  [Ark UI Tags Input](https://ark-ui.com/docs/components/tags-input),
  [Ark UI Rating Group](https://ark-ui.com/docs/components/rating-group) and
  [Ark UI Steps](https://ark-ui.com/docs/components/steps). Ark UI carries five of the eight, which is the
  scope check this item already leaned on. Two details from those pages are worth keeping: the splitter
  admits non-panel children such as toolbars and status bars inside its root, so it is not simply two boxes
  and a drag; and the tags input sets the mobile keyboard's Enter key to read "Done", which is the kind of
  thing only found by using one on a phone.

---

## 5. What the verification suite still cannot see

`e2e/` drives real clicks and keystrokes in a real browser through Playwright, and `npm run verify:dom`
runs it. What is worth stating is the shape of its blind spots, because a green run reads as broader
coverage than it is.

**Nothing checks appearance, and nothing will** — screenshot baselines are an accepted limit rather than a
pending decision; see the section at the end of this file. So the parity rule that forced
`aria-disabled`-everywhere — that disabled and disabled-but-reachable must look _identical_ — is checked by eye,
permanently, and the same goes for `CellAnimation`, `ScanlineAnimation` and `ScreenWiper`, which have a
Playground page and no spec because what they produce is motion over time. A DOM-reading spec over those three
would assert structure and call it coverage; nothing else here will reach them.

**A callback nothing on the page consumes is invisible to a suite that drives the page**, and `onMount`
handoffs are in the same position. `ImageSwitcher`'s `onLoad` was the standing example and is now covered —
the page grew a readout, `ExampleDefs` grew the optional `readout` field `VariantDefs` already had, and the
spec asserts both that a successful load is reported and that the two swap paths without one (a failed
source, a cleared source) report nothing. The shape is what to keep: reaching a callback means giving the
page a reason to consume it first.

**Components with no Playground page at all**, so nothing can drive them until one exists: `AudioSwitcher`
alone, still commented out of `CATEGORY_CONFIGS` in `playground/src/App/App.tsx`. Its play and pause moved from
a mount handle to a `playbackSignal` and that change has never been run, because there is nothing to run it. The
fades it drives are the part most likely to be wrong.

**Deprioritised by the user**, after being offered as the next piece of work and passed over. It stays here
because the exposure is real and unchanged; it is not next, and it is not to be proposed as next.

**`RichText` has left both groups.** It has a page and now a spec, and the prop that had nowhere to be
driven from is driven. `RichTextPage` mounts three examples — a legend naming the five tags the component
paints, an inline diff over two tags the page named itself, and a `TextArea` holding a source string with
the parsed result underneath it — with `removeOtherTags` as the page's one global prop, so both answers to
an unrecognised tag can be seen. `richText.spec.ts` reads computed styles rather than class names, since a
vanilla-extract class name is hashed and reading one back would only prove a string had been copied around.
See `decisions.md` for what the diff example settled.

**Covered only through a consumer**, which is worth distinguishing from uncovered because it decides
whether a spec is worth writing: `Popover` through `Select` and `Menu`, `Radio` through
`radioGroup.spec.ts`, `Checkbox` through `binarySwitch.spec.ts`, `MultiSelect` through
`select.spec.ts`, `Corners` and `Viewport` through whatever page happens to mount them,
`InteractionWrapper` through every control.

**What a page that stops painting costs is now measured rather than guessed, and the answer split the two
rAF consumers apart.** `e2e/noAnimationFrames.spec.ts` replaces `requestAnimationFrame` with a function that
never calls back, before any application code runs — a frozen clock cannot express this, because Playwright
fakes frames as a 16ms timer and advancing time to reach a fallback fires the frame first. Two findings:

- **`ElementFader`'s 100ms fallback is real and is now driven.** With no frames at all a `Modal` still
  reaches its visible target, which is the whole reason the fallback was written.
- **Starving the frames showed the positioner opening a layer a frame behind, and that is item 20.** What
  the test proves is narrower than the sentence it first produced: with no frames, a layer opens 30px out on
  `ViewportPage`'s scrolled anchor and the first scroll still lands it exactly, so the capture-phase
  listener carries a scroll on its own. It does **not** prove the poll has no other job — the test only ever
  opens a layer and then scrolls, and the poll is the only thing watching for an anchor that moves with no
  event to announce it. The fear this item used to record, of a popup drifting further and further from its
  field, is what was actually ruled out.

**Time is no longer a blind spot, and the mechanism is worth knowing before the next timing bug.**
Playwright's clock API fakes `Date`, `setTimeout`, `setInterval`, `requestAnimationFrame`,
`requestIdleCallback`, `performance` and `Event.timeStamp`, with `install`, `pauseAt`, `fastForward` and
`runFor`. `install` freezes time until it is advanced, so a duration becomes a stepped quantity rather
than a wait — which is what let the toast pause arithmetic be asserted at all, since the question is not
_whether_ four seconds elapse but _which_ four. `toasts.spec.ts` uses it in one describe block, and that
is the pattern for anything else of this shape. What the clock does **not** reach is two things: the three
motion components, whose time is CSS's rather than the page's, and the absence of frames, which needs the
stub above rather than a fake clock — the two look interchangeable and are not.

---

## 6. Planned: a consumer-facing layer of controls above the library — _not a focus_

**Deferred indefinitely by the user on 2026-08-15, and it is the lowest-priority item in this file.** Nothing
is blocked on it, nothing is missing because of it, and it is very doubtful it becomes a focus any time soon.
It stays numbered rather than moving to _Accepted limits_ because the packaging question inside it is a real
decision nobody has taken — not because the work is queued. **Do not propose starting it, do not weigh it
against anything else, and do not list it when asked what is next.**

The reason it survived a review that nearly dropped it: every control is fully consumable today and the
Playground proves it, so what this layer would buy is **less repetition, not more capability**. A page pairs a
control with its painter at every call site — `ButtonPage` imports `Button` and `PageButtonContent` and writes
the same threading closure five times — and about forty painters across thirty pages do the same. That is the
entire cost, and in a repo with one author it is small.

Recorded **2026-08-07** as advance notice in three parts. Two of them are built and are no longer
outstanding: there is no `style.css` anywhere in `src/`, and `App/Theme.css.ts` is the theme — a
vanilla-extract contract over colour, spacing, font size, radius, shadow, the hover / active / disabled
filters and one animation duration, with a small global block for the reset, the focus ring, the
scrollbars, links and `body`. The `--clr-*` custom properties this item used to call the de facto theme
are gone, and the theme's token shape deliberately carries no reasoning — see `decisions.md`.

What is left is the third part.

**A more final-consumer-like layer of controls — `MyButton` and friends — that trade API surface for
decided behaviour.** The stated example: no `renderContent` tooltip renderer, just tooltip content as
a string. This is the opposite direction from every argument recorded in `conventions.md` about slots
and flags, and deliberately so: those arguments are about what a **library** owes a consumer who has
not been met yet, and this layer is what a consumer who has been met actually writes. Worth knowing
because a narrowing that is correct here would be wrong one level down, and the two layers will sit in
the same repo.

**`App/StyledComponents` is not this layer and should not be mistaken for it.** Those forty-odd files are
painters — each named `<LibComponent>Content` after the slot it fills, per `decisions.md` — so they are
handed to a library control by the page that mounts it. Nothing there narrows an API: a page still passes
every prop the library takes. This layer is the opposite move, and it would consume those painters rather
than replace them.

The open question, when it starts: whether this layer lives in `playground/src` as the demo it
currently is, or becomes a second published entry point. That decides whether it needs a support
contract, which decides everything else about it.

**_Elsewhere._** The two-layer arrangement is the norm, and in every case checked the layers are two
**published packages** rather than one package with two entry points: Radix Primitives under Radix
Themes, Base UI (by MUI's own team) under MUI's styled components, Ark UI under Park UI — which is now
inside the same organisation. shadcn/ui is the third answer and the interesting one, because nothing is
published at all: the styled source is copied into the consumer's repo, so the support-contract question
is settled by there not being one.

**The narrowing this item predicts is exactly where those layers draw the line.** Radix Themes' `Tooltip`
takes `content` as a required prop and wraps its child as the trigger; the primitive underneath makes you
compose a `Trigger` and a `Content`. So "no `renderContent` tooltip renderer, just tooltip content as a
string" is not a departure from how the industry splits these two layers — it is the split, stated in the
same example.

---

## 7. `Toasts` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under the two `Toasts` headings. This is the
gap, with the reason it is still a gap.

- **An id re-added while it is leaving fades back in** rather than restarting as a new entry, because the
  id never left the rendered list. It is the reasonable behaviour and it is not obvious, so it is written
  down rather than left to be rediscovered.

A hidden tab now holds every countdown, so that gap is closed — see `decisions.md`, and note the signal is
`document.hidden` rather than window focus, which is the narrower of the two published choices. The pause
arithmetic is covered on a fake clock too, per item 5, so what is left in this item is the gap above
and nothing about verification.

**_Elsewhere._** Every bullet above has a published answer, and two of them are answers this item did not
have.

- **Per-toast urgency does not go through the region at all**, and that is the arrangement now built here —
  see `decisions.md`. Radix announces through a throwaway element per toast, outside the viewport region,
  with `aria-live` from that toast's own type; the text is inserted after two animation frames so that NVDA
  picks it up. This library reserves the two shared announcer regions when the stack mounts instead, which
  answers the same hazard without a per-message frame delay. `role="status"` in both cases rather than
  `role="alert"`, to stop screen readers stuttering.
- **The keyboard route is a hotkey, and it is `F8` rather than `F6`.** Radix's viewport takes a `hotkey`
  prop defaulting to `["F8"]`; from there it is `Tab` within the region and `Escape` on a focused toast.
  Built, with `Escape` returning focus to wherever the hotkey was pressed rather than acting on a toast.
- **Both mainstream toasts stop the clock when you look away.** sonner pauses while the document is
  hidden; Radix pauses on window `blur` alongside pointer and focus, which covers switching windows but
  not a hidden tab inside a focused window. So neither treats this as a product decision to be deferred —
  they both took it, by different events.
- **Why an entry left is reported as two callbacks rather than one field.** sonner gives each toast
  `onDismiss` and `onAutoClose`. That is still unanswered here: `onShow` and `onHide` report the two
  transition boundaries, not the reason for the second one. Splitting the callback rather than widening the
  state a painter reads is the shape to copy if anything ever asks.
- **The pause arithmetic is the same arithmetic.** Radix subtracts elapsed from remaining on each pause,
  exactly as here — and per item 5, Playwright's clock API is what would let the remainder be asserted
  rather than eyeballed.

---

## 8. `Calendar` — two things deliberately not built

Item 8 covers the missing components. These are `Calendar`'s own gaps, each with the reason it is still
one. The decisions behind what exists are in `decisions.md` under _"Controls: `Calendar`, and the date
value the library owns"_.

- **No week numbers and no multi-month view.** Both are extra columns or extra grids around the same
  `DateValueUtils.getMonthGrid`, so neither needs new library machinery; they need a decision about
  whether `Calendar` grows a mode or a consumer composes two of them.
- **The disabled predicate runs per cell per render.** `computeIsDayDisabled` is called for each of the
  42 cells inside a reactive read, so a consumer whose predicate hits a network cache will do it 42
  times a month change. Memoising is the consumer's to do today; whether the library should batch it
  into one call per grid is open.

**_Elsewhere._**

- **A range is a second component or a mode, and both ship.** React Aria has a separate `RangeCalendar`;
  react-day-picker has `mode="range"` on the same component. Both shapes were weighed before `RangeCalendar`
  was built; see `decisions.md`.
- **Month and year jumping is a caption layout, not a keyboard shortcut.** react-day-picker's
  `captionLayout` takes `"dropdown"`, `"dropdown-months"` or `"dropdown-years"`, with `startMonth` and
  `endMonth` bounding the lists and defaulting to a hundred years back. Selects inside the header are
  what everyone ships; `Shift+PageUp` is nobody's headline feature, which is why it stayed unbuilt for as
  long as it did. It is built now — the caption is still where the field goes, and the key costs three
  lines beside the month step it already had.
- **Week numbers and multiple months are props on the same component**, not a second one:
  `showWeekNumber` and `numberOfMonths`, plus a callback for a click on the week number itself.
- **The per-cell predicate is answered by widening the input rather than memoising the call.**
  react-day-picker's `disabled` accepts a matcher or an array of them — a single date, an interval, a
  day-of-week set, a before/after bound — and a function is only one of the accepted forms. So the
  common cases never call anything forty-two times, and the expensive form is visibly the expensive one.
- **The month announcement belongs to a shared announcer that is nobody's component**, which is the shape
  this library settled on. React Aria announces a visible-range change through `@react-aria/live-announcer`:
  a live region created on first use, appended outside the component tree, with the message cleared after a
  timeout. `LiveAnnouncer` is that, and `Calendar` was its first consumer — the announcer belongs to neither
  the consumer's title nor the calendar. Nothing here is outstanding.
- **One real focusable element per day is normal**, so forty-two of something was never the anomaly:
  react-day-picker renders a `<button>` per day and MUI a day component per day. What this library adds on top
  is its own wrapper per cell, and that has now been measured — see `decisions.md`.

---

## 9. `ColorInput` — two things deliberately not built

`ColorInput` is the custom picker now; the decisions are in `decisions.md` under the `ColorArea` heading.
These are the gaps.

- **No native colour input anywhere, so no form value and no OS picker.** Deliberate, and the cost of
  owning the surface. A consumer who wants the OS dialog has nothing to fall back on.
- **No eyedropper — _postponed until the platform catches up_, decided by the user on 2026-08-15.** Swatch
  presets and recent colours were dropped the same day and are not coming back. The eyedropper is not
  declined, it is waiting: the work is trivial and the support is not there. **Do not propose building it,
  and do not re-argue the design** — that part is settled and recorded below.

    **The trigger is browser support, and it is checkable rather than a matter of judgement.** Re-open this
    when Firefox or Safari ships `EyeDropper`, or when it reaches Baseline. Until then the only thing worth
    doing is reading [caniuse](https://caniuse.com/mdn-api_eyedropper) — do not re-derive the design, the cost
    or the options, all of which are below and were settled on **2026-08-15**.

    **What it would take, for when that day comes:** almost nothing in `components/src`. `valueSignal` is already a
    hex string and `open()` resolves to `{ sRGBHex }`, so a consumer constructs an `EyeDropper`, awaits it, and
    writes the result into the signal — the component syncs hex into its HSV working state itself, and
    `renderPopup` already provides the space for a trigger. The two pieces that would be library-owned are the
    TypeScript declaration, since `EyeDropper` is absent from the DOM lib and every consumer currently writes
    their own `declare global`, and a feature-detection helper, because a consumer who forgets
    `"EyeDropper" in window` ships a dead button to most of their users. A `renderEyedropper` slot was weighed
    and rejected: a prop that does nothing in three browsers out of four is the thing this item exists to
    avoid.

**Nothing about dismissal or open state is outstanding.** `ColorInput` dismisses through `DismisserStack` like
every other layer and takes a `visibilitySignal` like every other popup; both are in `decisions.md`.

**_Elsewhere._**

- **Owning the surface is the mainstream trade.** React Aria's colour suite — `ColorArea`,
  `ColorSlider`, `ColorWheel`, `ColorField`, `ColorSwatch` and `ColorSwatchPicker`, synchronised by a
  `ColorPicker` around one colour value object — has no native `<input type="color">` path either, and
  Ark UI's is custom too. Nobody keeps the OS dialog as a fallback, so the cost recorded in the first
  bullet is the cost everyone pays.
- **The eyedropper is absent because the platform is, and re-checked on 2026-08-15 rather than assumed.**
  `EyeDropper` is Chromium-only: Chrome and Edge from 95, Opera from 81, no Firefox, no Safari, **26.83%
  global support**. MDN marks it experimental and explicitly not Baseline, needing a secure context and a
  user gesture. `open()` resolves to `{ sRGBHex }`, accepts an `AbortSignal`, and Escape cancels it. React
  Aria's colour documentation shows no eyedropper at all, so there is nothing to copy — and a library-owned
  prop for it would do nothing in three browsers out of four.
- **Dismissal is one mechanism for every layer, and it is a document listener plus a stack.** Radix's
  `DismissableLayer` keeps every open layer in an ordered set; on a pointer press each layer marks
  itself during the capture phase if the press began inside it, and on the bubble phase only the topmost
  layer that was pressed outside dismisses. `onPointerDownOutside` and `onFocusOutside` are both
  cancellable by the consumer. One implementation serves select, menu, popover, dialog and colour picker
  together, which is the "settle it once" this bullet asks for — and it is worth noting that it answers
  the question as a **mechanism** before it answers it as an `openSignal`: the ordered stack is what
  stops an inner popup's press from closing the dialog around it, and that is the part four separate
  listeners cannot get right.

---

## 10. `Accordion` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Accordion`, and where
auto-height measurement lives"_ and _"A panel built on first expansion"_.

- **The height animates, and nothing else can.** A consumer wanting the panel to slide in from the side
  gets it from `renderPanel`'s visibility target, but the panel box itself only ever animates `height`.
  Animating width instead — a horizontal accordion — would need the observer's twin and a direction prop.

**_Elsewhere._**

- **React Aria's `DisclosureGroup` keeps the panel in the DOM** but uses `hidden="until-found"` where
  supported, so find-in-page can reveal a collapsed section. That is the one thing the built panel does not
  do, and it is orthogonal to whether the content is there — worth knowing if a collapsed section ever needs
  to be findable.
- **A horizontal accordion is an `orientation` prop plus a second CSS variable.** Radix's
  `orientation="horizontal"` swaps the arrow-key axis and exposes the content _width_ beside the height,
  which is the direction prop this bullet describes, with the measurement doubled rather than generalised.
- **"Always exactly one open" is the default elsewhere, and the second state is a second boolean.**
  Radix's `type="single"` _requires_ one item to stay expanded; `collapsible`, default `false`, is what
  permits zero. Built here as `isExpandRequired` beside `isSingleExpand` — two booleans, as there, rather
  than a third state on the first prop.

---

## 11. `Tabs` — a pairing the consumer can still skip

The decisions behind what exists are in `decisions.md` under _"Controls: `Tabs` as records"_ and
_"`TabPanel`: the pairing is written on the record"_.

- **Nothing makes a consumer wire the panel.** `id` and `panelId` are optional fields, so a tab list with
  no pairing at all is still a valid one. The cost is that the omission is silent: a consumer who paints
  their own panel box and never reaches for `TabPanel` gets no warning, the way one who nests a
  `getAriaLabel` inside a `Label` does. The Playground's own left menu was that consumer for four months
  and nothing said so; it is wired now, which removes the example rather than the gap.

**_Elsewhere_**, read off the two libraries' own documentation on **2026-08-11**.

- **The panel is part of the component in both, and it is mandatory.** Radix has `Tabs.Root` / `List` /
  `Trigger` / `Content`, where `Trigger` and `Content` carry the same `value`; React Aria has `Tabs` /
  `TabList` / `Tab` / `TabPanels` / `TabPanel`, matched on `id`, and a panel per tab is required. Both
  enclose the panels in the root, which is what lets the ids be generated privately — and what this
  library cannot do while a panel may be a routed page mounted elsewhere in the tree. Writing the pair of
  ids on the record is the price of that, and the optional-ness in the first bullet is its tail.
- **Automatic activation is the default in both**, spelled `activationMode="automatic"` in Radix and
  `keyboardActivation="automatic"` in React Aria. Both modes now exist here under `hasAutoActivation`, with
  manual still the default — the inversion is deliberate and the reasoning is in `decisions.md`.

---

---

## 12. `Viewport` as a region: what is settled and what is not

A viewport now fits its design size into the box the page gives it, clips everything inside it, and keeps
its own layers within its own bounds; see `decisions.md`. `ViewportPage` is two 400px squares — a control
that roams one of them at a scale you can change, and an anchor inside a scrolling area in the other — and
`viewport.spec.ts` drives both, including that the two scales multiply and that a stack of toasts raised
inside a nested viewport stays inside it. What is left:

- **A nested viewport needs a sized host, and says nothing when it does not get one.** It measures its own
  box, so a container with no height gives it a zero-sized region and it renders nothing visible. A warning
  would be the obvious kindness; whether the library should warn at all is the same question `Label` already
  answered for itself, and it went the other way.
- **A fast scroll can still show a frame of drift — see item 20**, which now holds it. It is not a
  `Viewport` fault: the same frame is lost by every anchored layer on the page, and the scrolled anchor here
  is only where it is easiest to see. `viewport.spec.ts` asserts the layer lands exactly on its anchor once
  the scroll settles, which is what a spec can see.

---

## 13. `Tree` — two things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Tree`, and the group box that
could not be a child"_. These are the gaps, each with the reason it is still one.

- **The marker cannot own the toggle.** One press both selects a node and opens it, because the branch
  marker is drawn inside `renderNode` and the component cannot tell a press on it from a press on the label.
  A consumer who wants the published desktop behaviour — the chevron opens, the label selects — has no route
  to it. Giving them one means either a second render slot the library positions, or a flag saying where the
  press landed, and neither has been argued.
- **One selected value, and no checkboxes.** `valueSignal` is `Signal<T | undefined>`, so there is no
  `aria-multiselectable`, no `Shift`-extended range, and no tri-state parent following its children. That
  last one is the only part with nothing left to decide: `CheckedState` and `CheckedStateUtils.fromMembers`
  are a shared abstract already, built for `Select`'s group header, so a tri-state parent here is a call to
  a function that exists rather than a type to argue about.

**The focus rescue was wired to a function nothing could reach, and is now a guard over the visible rows.**
It used to sit inside `collapse`, checking whether focus was on a descendant before removing the subtree — but
both routes into `collapse` act on the branch itself, which is already the focused element and stays mounted,
so the check was never true. A **consumer** writing `expandedSignal` from their own code, which is the only
way to collapse a branch out from under a focused row, never passes through `collapse` at all. The guard now
watches the visible rows and fires when a remembered focused row leaves the set while focus has fallen to the
document body; `tree.spec.ts` drives it through a Playground button that defers the collapse, since a button
that collapsed on the spot would be holding focus itself.

**_Elsewhere_**, read off the published documentation on **2026-08-13**.

- **Typeahead is in the pattern itself, not just in the libraries.** The published tree pattern lists it as a
  keyboard requirement — type a character, focus moves to the next node whose name starts with it. Ark UI has
  it on by **default** behind a `typeahead` prop; React Aria drives it off the same `textValue` its lists use.
  This is what made the tree the strongest of the three arguments for building it.
- **Lazy branches are a named feature with a completion callback.** Ark UI takes `loadChildren` plus
  `onLoadChildrenComplete`; React Aria has a `TreeLoadMoreItem` element and a `renderEmptyState` for the
  spinner. Both answered the half this item called hard — where "loading" is painted — by making it an element
  the consumer supplies, and that is the shape the group box grew. Built as `hasMoreChildren` plus
  `renderPendingChildren`, with no load callback, because `expandedSignal` is the consumer's already; see
  `decisions.md`.
- **Multi-select and checkboxes are one feature, and both libraries ship it.** `selectionMode="multiple"` in
  each, with Ark UI adding `NodeCheckbox` and a `checkedValue` list carrying `indeterminate`. So the tri-state
  parent is not an extra: it is what a multi-select tree is expected to include.
- **A windowed tree is done by handing the visible list out.** Ark UI virtualizes through `getVisibleNodes()`
  plus a `scrollToIndexFn`, which is precisely `getVisibleRows` and `scrollToRow` — the same two pieces this
  library already has, arranged so the consumer owns the window. React Aria's tree documents no virtualization
  at all. Worth knowing before the group-box boundary above is treated as the only way in.
- **The indent guide is a part in one of them.** Ark UI ships `BranchIndentGuide` alongside `BranchControl`,
  `BranchIndicator` and `BranchText`, so the depth line a consumer draws here from the `depth` flag is
  something at least one library thought worth owning.
- **Drag and drop is React Aria's, and nobody else's.** It arrives through the same `useDragAndDrop` hook its
  lists use rather than as anything tree-specific. Nothing here has asked for it, and it is recorded so the
  omission is not re-derived as an oversight.

---

## 14. `SlideButton` — three things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `SlideButton`, and why the gesture
is the only thing it owns"_, including which WCAG criteria were read and what they decided. These are the
gaps, each with the reason it is still one.

- **The thumb has to reach the end, and there is no threshold.** Overshooting clamps, so a drag past the end
  is enough and reaching it is easy — but a consumer who wants a hair-trigger at 90%, or a longer travel than
  the paint suggests, has nothing to set. It is not a prop because a tuned value with no consumer behind it is
  a guess, and the rule about measured values says those are the user's to set rather than the library's to
  invent.
- **Horizontal only.** `Range` grew an `orientation` and this did not: the hit test and the progress
  arithmetic both read one axis, and the painter's `calc` does too. A vertical slide-to-activate is a real
  shape on a phone lock screen and nowhere else, which is why it was not built rather than why it could not
  be.
- **The hold duration is one number for everyone.** `getHoldDurationMs` defaults to 1000 and a consumer can
  change it, which is the right shape — but there is no route to a duration that follows the person rather
  than the control, and `prefers-reduced-motion` is not the signal for it either. Recorded because a fixed
  hold is itself a dexterity assumption, and the control exists partly to avoid one.

**_Elsewhere_**, read on **2026-08-13**, after the keyboard decision had already been taken.

- **No headless library ships one, so there is nothing to copy either way.** Radix's thirty-odd primitives,
  Base UI's thirty-five at its December 2025 stable release, React Aria and Ark UI all have a slider and a
  button and nothing between them. That is the same finding as the animation components in item 1: the
  omission is the field's, not this library's.
- **The packages that do ship one have no keyboard route at all**, which is worse than the decision taken here
  rather than different from it. `react-swipeable-button`'s whole documented surface is `onSuccess`,
  `onFailure` and colours — no role, no `tabindex`, no key handling; `react-slide-button` is built on
  `react-swipeable`, which is pointer-only by construction.
- **Apple, whose lock screen is where the pattern comes from, answers exactly the decision taken here.** Asked
  on the developer forum whether a swipe-to-confirm harms VoiceOver users, the guidance is to override
  `accessibilityActivate` so that a single activation runs the same confirm logic **without** the swipe, or to
  expose the confirmation as an `accessibilityCustomActions` entry. The lock screen itself behaves that way:
  a VoiceOver user selects the caption and double-taps, and the gesture collapses to one activation. So "the
  assistive route is a plain activation, not a reproduced gesture" is the platform's own answer and not a
  convenience.
- **The standard that decides it is 2.5.7 Dragging Movements, and it is newer than the pattern**, which is
  most likely why none of the packages above answer it. What it asks for — a single-pointer route that is not
  a drag — is what the hold is; see `decisions.md`.

---

## 15. `Spotlight` — one thing deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Spotlight`, and three presets
because a mode cannot move at runtime"_. These are the gaps, each with the reason it is still one.

- **`prompt` cannot hide the page from a screen reader.** `inert` is inherited and cannot be lifted off a
  descendant, so a mode that keeps one element live cannot seal the rest — the overlay stops the pointer and
  the `focusin` guard stops the tab order, but a virtual cursor still reads everything behind. The only escape
  is portalling the highlighted element into the overlay for the duration, which is far more invasive than the
  mode is worth. Recorded as a limit of the mechanism rather than an oversight.

---

## 16. `Scroller` — four things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Scroller`, and why it renders no
button of its own"_. These are the gaps, each with the reason it is still one.

- **Horizontal only.** The whole component is one axis of arithmetic — `scrollLeft`, `clientWidth`,
  `offsetLeft` — and a vertical twin is those three swapped plus a direction prop, which is `Accordion`'s
  recorded position on its own axis question. Nothing has asked for a column, and the Playground's own left
  menu, which is the obvious candidate, scrolls natively today and nobody has complained.
- **The step is a page, and there is no way to ask for less.** Paging lands on the last item boundary inside
  the next page, so the step is "as much as fits" rather than a tuned fraction. A consumer wanting a lingering
  item of overlap for context has nothing to set. It is not a prop because the overlap would be a measured
  value with no consumer behind it, and the rule about tuned numbers says those are the user's to set.
- **A second press landing mid-scroll moves less than a page.** The step is measured from where the track is
  at the moment the button is pressed, and the scroll that follows is smooth, so pressing quickly five times
  does not advance five pages. It is self-correcting — every press still moves forward and the end is still
  reachable — and every implementation built on `scroll-behavior: smooth` behaves this way. Holding the
  intended target and stepping from that instead is the fix if it ever matters; nothing has asked.
- **The buttons are the consumer's, so their keyboard story is too.** The component renders no button, which
  means it cannot guarantee one is reachable, named, or in the tab order — a consumer who paints them as bare
  divs gets a control no keyboard can reach. The library's answer is that the scrolling itself is still
  operable, because focus moving through the strip drags the track along, so the function survives even when
  the buttons do not. Recorded because it is a real consequence of the ownership line rather than an oversight.

---

## 17. `Paginator` — four things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Paginator`, where the arithmetic
is the component"_. These are the gaps, each with the reason it is still one.

- **It counts pages, not items.** Ark UI takes `count` and `pageSize` and divides; this takes `pageCount` and
  leaves the division to the consumer. The arithmetic is one line, but the two spellings disagree about what
  happens when items do not divide evenly, and about whether a zero-item list has no pages or one empty one.
  Those are the consumer's answers, and taking `pageCount` is what stops the library from picking for them.
- **Nothing hands back the slice bounds.** A consumer showing "showing 21 to 40 of 383" computes it
  themselves, and it is the same arithmetic the point above declined to own. Worth revisiting together with
  it, since either both belong here or neither does.
- **There is no page field to type into.** A paginator over hundreds of pages wants "go to page ▢" beside the
  numbers, and nothing composes one — the consumer builds it from a `NumberInput` and their own page signal.
  Probably right; recorded because it is the first thing a large page count makes you want.
- **The whole row is in the tab order, and there is no way to ask for one stop.** Every page and every step is
  its own tab stop, which is the accordion's rule and is defended in `decisions.md`. A paginator with a wide
  window and both end jumps is fifteen tab stops in a row, which is a lot to walk past to reach the content it
  pages. Nothing has asked, and the alternative — a roving order over a list of independent destinations —
  contradicts the reasoning rather than extending it.

---

## 18. The carousels — four things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Carousel`, and the first component
that acts without being asked"_ and _"`TrackCarousel` and `DrumCarousel`: one behaviour, two ways of showing
it"_. These are the gaps, each with the reason it is still one. They are the shared shell's, so both presets
have them unless the entry says otherwise.

- **One slide at a time; a page of several is not built.** The description this came from allowed either, and
  one slide is the reading with a published pattern behind it. A page of several needs the arithmetic to start
  asking how many fit, which is `Scroller`'s question and the boundary the two were separated along. Building
  it would also make the picker ambiguous — a dot per slide or a dot per page — and that is a design question
  rather than a missing line.
- **The keyboard is whatever the controls are.** There is no arrow-key handling on the region, so a carousel
  rendered with no `renderControls` has no keyboard route at all. The published pattern puts the arrows on the
  buttons rather than on the region, so this matches it — but a consumer who skips the controls gets a control
  a keyboard cannot move, which is worth knowing before it is called a bug.
- **The motion is the library's; a fade is not expressible.** A track slides and a drum turns, and neither
  can be swapped for anything else — the library owns the transform, so a consumer cannot
  make one slide dissolve into the next. `ImageSwitcher` is the component that already does that for a single
  image, and the two would be one only if the motion became the consumer's — which would mean handing out a
  visibility target per slide, the way `Tabs`' floater now does. That is a real design, not an oversight, and
  nothing has asked for it.
- **Every slide is built, always.** All of them are in the document from the first render, `inert` and hidden
  when away. This is `Accordion`'s trade rather than `Tree`'s, and here it is forced rather than chosen: the
  track has to be as wide as the slides to translate across them, and a drum has a face for each. A carousel of
  a hundred expensive slides builds all hundred — two hundred elements on a drum, which prints a back for each
  face — and windowing it is the same boundary `Select` and `Tree` already record.

---

## 19. The four components ported from React — what did not settle

`Satellite`, `Staircase`, `Formation`, `OverheadWheel` and `DrumWheel` came in from a React codebase; what the port
settled is in `decisions.md`. What did not settle is below, and both entries are decisions taken rather than
work waiting.

**The drum's girth arithmetic was wrong twice, is now measured rather than argued, and the user has retested
it.** What it reserves and why is in `decisions.md` under _"A drum reserves the room it paints in"_; both wrong
answers are recorded there too, since the shape of the mistake repeated. The errors they remembered from the
original codebase were accounted for by those two fixes. One consequence is recorded rather than fixed:

- **A wedge count that changes mid-turn interpolates the radius, and is left alone.** The user's call. A face
  carries its angle and its distance from the axis in one `transform`, and that property is transitioned, so
  changing the count while the drum is turning animates the radius over the rotation's duration while the barrel
  jumps to the new one at once. For those few seconds the faces sit outside the box the component reserved. At
  rest the transition duration is zero and the change applies instantly, so this needs a live count change
  **during** a rotation to appear — which is exactly what a Playground knob does and what a fixed prize list
  never will. Recorded rather than fixed because the fix costs an element per face, up to 48 on a doubled reel,
  for a transient nothing outside a props panel produces.
- **What the fix would be, if it is ever wanted.** Splitting the rotation onto an outer element and the radius
  onto an inner one gives `rotate × translate` in that order with the radius untransitioned, which is the same
  matrix as today. The individual `rotate` and `translate` CSS properties cannot do it: they compose as
  `translate × rotate`, and this needs the translation to happen in the face's own turned frame, which is the
  opposite order.

**An overhead wheel hit-tests outside its visible circle, and is left that way for now.** The user's call, to be
revisited. Each wedge is a full-size square div carrying the rotation, so a rotated square's corners point at the
middles of the axis-aligned edges — measured, a press 40px clear of the wheel at mid-height lands on a wedge,
while the same distance past a corner lands outside it. Nothing paints there and nothing in a wedge is
interactive, so there is no visible effect; the exposure is a consumer who paints a control into a wedge, or an
outside-click layer that would read such a press as inside the wheel.

**What was measured, so the next attempt starts from evidence rather than from the three guesses that preceded
it.** `pointer-events: visiblePainted` on the wedge wrapper does nothing: MDN lists it as SVG-only and
experimental for HTML, and applying it across the whole wedge subtree left the hit chain identical. `none` on the
wrapper and on the `<svg>` root, with `visiblePainted` on the shapes, closes it exactly — a press outside the
wheel falls through and a press on the painted wedge lands on the `path` rather than on a div, so the hit area
becomes the pie itself. Better than clipping the root to its square or the wedge layer to a circle, both of which
were considered. **What stopped it is the consumer trap**: anything painted into a wedge silently stops being
pressable until it opts back in with `pointer-events: auto`.

**An overhead wheel has one slot for its controls and it is the hub, chosen by the user over two alternatives.** A
drum's controls sit under the barrel; an overhead wheel's sit in the middle of it, and there is no second slot. The
cost is the one item 16 already records for `Scroller`: a consumer who wants the control somewhere else renders
their own button, and a library that renders no button cannot promise it is named or reachable. The two
alternatives were a second slot beneath the wheel, rejected because the overhead wheel is a square and anything
under it changes the box it reserves, and a slot with a position prop, rejected because `Toasts` had already
settled that a component does not fully delegate position. Recorded so it is not re-proposed as an oversight.

---

## 20. An anchored layer is always a frame behind — _postponed until the platform catches up_

Folded together from item 5 and item 12 on the user's call, after they pointed out that the drag they see
while scrolling is the same inaccuracy the opening placement shows. It was written up as two faults — a layer
that opens a frame behind, and a fast scroll that shows a frame of drift — and it is one: **the position an
anchored layer paints at is the position its anchor was in one frame ago.** At rest the last frame catches up,
so it looks settled and only moves when something else does.

**Where it shows.** Opening a layer against `ViewportPage`'s scrolled anchor, measured with frames starved:
30px out, and it stays there until any event arrives. Scrolling a box with a layer open: the layer trails the
anchor while the scroll is moving and lands exactly when it stops. `viewport.spec.ts` and
`noAnimationFrames.spec.ts` both assert the settled position, which is what a spec can see; the intermediate
frames are checked by eye.

**What the layer is built on.** `Anchor.createPortalPosition` derives the position from two measured signals —
the anchor's rect from `ElementObserver.createViewportRectObserver`, the content's size from a
`ResizeObserver` — and the rect observer updates from three places: once on mount, from a capture-phase
`scroll` and a window `resize`, and from a `requestAnimationFrame` loop that runs for as long as the layer is
open. The poll is the only one of the three that catches an anchor moving with no event behind it: an ancestor
being transformed or animated, content above it growing, a font arriving and reflowing the page.

**Decided by the user: postponed, on the eyedropper's terms.** The fix is C, C needs a platform feature that
is not there yet, and the two cheap options turned out to be no options at all. **Do not propose building it**
until the trigger below fires. Everything under it is kept so that nobody measures any of it twice.

**The trigger is browser support, and it is checkable rather than a matter of judgement.** Re-open when CSS
anchor positioning reaches Baseline, or when the browsers this library supports have it far enough back that
the JS positioner can actually be retired rather than kept beside it. Until then the only thing worth doing is
reading [caniuse](https://caniuse.com/css-anchor-positioning). At the time of the decision it stood at 84%
global with all three engines shipped — Chrome 125, Safari 26, Firefox 147 — which is the awkward middle: new
enough that the JS path has to stay, established enough that it looks ready.

**Why 84% is the argument rather than the percentage.** A layer that fails to position is broken, not
degraded, so the JS positioner cannot be retired at that number. Both paths would ship, and the maintained-but-
never-run one would be whichever your own browser does not take. That is the cost that decided it, more than
the coverage did.

**The four ways out, and what happened to each.** The user was inclined towards B and asked for D first.

- **A — leave it.** Only visible while something is moving; at rest it always lands right. **This is what
  the postponement leaves in place.**
- **B — write the position straight from the handler that reads the rect**, skipping the reactive round-trip.
  **Ruled out by D: there is no round-trip.** The write already happens synchronously inside the scroll
  handler, so B would remove a delay that does not exist.
- **C — hand the tracking to CSS anchor positioning.** The fix, and the thing being postponed. The anchor
  takes an `anchor-name`, the layer a `position-anchor`, and the layer writes its edges against the anchor's
  with `anchor()`; the browser then keeps the two glued in its own layout pass, which is why no frame can be
  lost. Choosing another side when there is no room is `position-try-fallbacks` — alternatives in order, the
  browser takes the first that fits. The note in item 12 calling this Chromium-only was out of date.
- **D — measure where the frame is actually lost before choosing.** Done, and it is what ruled B out.

**What C would have to answer, worked out before the postponement so it is not re-derived.** Two shapes, and
neither was tried.

- **Replacing the positioner outright** is the version that pays: the browser owns placement and flipping and
  most of `AnchorUtils` goes. What blocks it is that the library's placement vocabulary is richer than
  `position-try` can state — band clamping and `reservedScreenSize` are arithmetic on numbers, and there is no
  CSS spelling for _"clamp into this band but keep the anchor's edge"_. Those semantics would have to be
  re-expressed or dropped.
- **Keeping the arithmetic and using CSS only for the glue** leaves every line of the placement logic alone
  and lets `anchor()` carry the layer along with its anchor between JS updates. Smaller, keeps the semantics,
  and puts two systems in charge of one number.
- **`Viewport` is what would decide between them, and the answer is not known.** A viewport scales its
  contents and positions layers in its own space through `getAdjustedBoundingClientRect`, while CSS anchor
  positioning works in the real layout. Whether those compose is the first thing to test when this re-opens.

**What D measured**, by probing the live page rather than by reading the code.

- **The style write is synchronous inside the scroll handler.** A `scroll` listener on `window` in the capture
  phase runs before the library's, one on `document` runs after it, and the layer's inline `transform` differs
  between the two on every event. There is no reactive round-trip to remove: Solid propagates the new rect
  through the memos and writes the style before the handler returns. **B would change nothing.**
- **A layer never opens in the wrong place, as long as frames are arriving.** `Popover` already paints
  `visibility: hidden` until `getPosition()` resolves. Sampled per frame from the moment the element is added:
  hidden at `translate(0px, 0px)` for two frames, then visible at its final transform, and unchanged for the
  next six. The 30px in `noAnimationFrames.spec.ts` is the starved case alone — with no poll to finish it, the
  mount reading is what becomes visible.
- **Frame by frame through a scroll, the gap between anchor and layer is constant**, under both a
  `scrollTop` scroll and a real wheel scroll: 528 while the list sits above the anchor, then 268 after it
  flips below. So on the main thread's own account the layer is never behind.
- **What the probe cannot see is the only place left for the lag to be.** Both numbers it compares — the
  anchor's `getBoundingClientRect` and the layer's `transform` — come from the main thread, so a frame where
  the compositor has already scrolled the box and the main thread has not been told yet reads as a constant
  gap while the screen shows otherwise. Ruling that in or out needs pixels rather than the DOM.
- **One movement it did see, which is by design rather than drift.** Mid-scroll the list flips from above the
  anchor to below it, and that is a 260px jump in one frame. `AnchorUtils.getSafeVPlacement` choosing a new
  placement is what it is for; it is noted here because it is the largest thing that moves in this demo.

---

## 21. `Table` — six things deliberately not built

The decisions behind what exists are in `decisions.md` under _"Controls: `Table`, a grid rather than a
table, and why the markup could not be `<table>`"_. These are the gaps, each with the reason it is still one.
The resizer's discoverability is **not** here: the user weighed it and chose to leave it, so it sits under
_Accepted limits_ instead.

- **A column cannot be pinned.** Holding a column still while the rest scrolls needs a resolved pixel width
  for every pinned column, so the sticky offsets can be added up. Without one, a pin silently does nothing on
  an unsized column — the "looks supported and is not" failure this repo has refused twice already. It was
  also outside the scope the user set for the component.
- **Rows cannot be grouped, and there are no aggregate rows.** A run of rows under a heading, with a totals
  row beneath them, is a second row kind the flattener and the roving cell would both have to know about.
- **A row cannot expand.** Nothing opens beneath a row to hold detail, which is the other shape a second row
  kind would take.
- **A cell cannot be edited in place.** Editing is the consumer's, in whatever they paint into the cell; the
  grid has no notion of a cell entering an editing state and no key that starts one.
- **There is no filtering.** Sorting is the component's and filtering is not, so a consumer narrows the rows
  themselves before handing them over — the same split `Select` makes with its query.
- **A cell holding more than one control cannot be stepped into, and this one has an accessibility cost.**
  The grid is a single tab stop with a roving cell, so a cell containing two buttons can be reached but there
  is no defined key that moves _inside_ it to choose between them. The published answer is an `F2`-style
  interaction mode, where a key swaps the grid between navigating cells and operating whatever is in one.

---

## Accepted limits

Faults that have been looked at and consciously left alone. Not outstanding work, not numbered, and not part
of the answer to "what is left" — see the note at the top of this file. Each one records what it is, how to
reach it, and why it was accepted, so that nobody has to re-derive the argument in order to leave it alone
again. An entry moves back up into the numbered items only if the user says so, or if something changes that
makes the reasoning wrong.

**Converting a date into a calendar that cannot hold it clamps, silently.** Accepted **2026-08-11**.
`DateValueUtils.withCalendar` is `toCalendar`, and 15 March 44 BC asked for in the Japanese calendar comes back
as Meiji 1 — 15 September 1868 — because that calendar's first era begins there. Nothing reports that the value
moved. Reachable in the Playground in two clicks: hold the Date picker page's historical date and switch the
calendar knob to `japanese`.

This is the same class of fault as a mask laying too many digits into too few slots, and it is the one place the
_"never approximate a value"_ rule in `conventions.md` is still broken — so the rule is stated there with this
exception, rather than pretending to be absolute. The fix itself is cheap, a round-trip comparison; what made it
not worth taking is that it forces `withCalendar` to return `undefined`, and then each of `Calendar`,
`DateInput` and the Playground's knob has to decide separately what to show instead. Three judgment calls and a
non-null assertion in `toIso`, to close a case only a deliberate calendar switch on an out-of-era date reaches.
The clamp is also `Intl`'s own behaviour, so what ships is at least consistent with the platform.

**Playground samples are not considered for export.** Accepted by the user when the SVG defs vocabulary moved
out of the library: seven tilings and four families of animation builder now live in `Samples/SVGDefs`, so a
consumer of the package can no longer import them and copies them from the Playground instead — the same trade
already taken for `CellAnimation`'s origins and weights. What this gives up is stated so it is not rediscovered
as an oversight: a consumer wanting animated hexagons gets a worked example rather than a function, and
anything that becomes worth publishing has to be moved back deliberately. Nothing in `components/src` depends on any
of it, and the arithmetic is now unit-tested where it sits, which is what closed the item this came from.

**A `Table` column can be resized without anything saying so.** Accepted by the user. The drag handle at a
column's right edge is `aria-hidden`, so a screen reader is never told the column can be resized; the keyboard
route exists — `Ctrl` with the left and right arrows on a focused header cell — but only somebody who already
knows it is there will use it. Reachable in the Playground on the Table page's _Resizable columns_ example.

Two fixes were offered and both were declined, and the reasons are worth keeping so neither is re-proposed.
Putting the word into the header's accessible name means the library writing into content the consumer paints,
which nothing else here does. React Aria's answer — a visually-hidden slider inside the header cell — is a
real named control with a real value, and costs one extra tab stop per resizable column, which is precisely
what a grid's single tab stop exists to prevent: a ten-column table would take eleven presses of Tab to cross
instead of one. Success criterion 2.1.1 is met either way, since the function is reachable from the keyboard;
what is given up is 3.3.2-style discoverability, and the user weighed that against the tab order and kept the
tab order. The reasoning behind the whole arrangement is in `decisions.md`.

**Screenshot baselines, and with them any automated check on appearance.** Accepted **2026-08-11**, by the
user, on two grounds: style in this project is far too fluid for a baseline image to mean anything for long,
and appearance is **not the library's responsibility** in the first place — `components/src` paints nothing, every
painter lives in the Playground, so a committed image would be asserting the demo's taste rather than the
package's contract.

What this permanently gives up is worth naming so nobody re-proposes it as a gap: the `aria-disabled`-parity
rule — that disabled and disabled-but-reachable look identical — is checked by eye and only by eye, and
`CellAnimation`, `ScanlineAnimation` and `ScreenWiper` will keep their Playground pages and no specs, because
motion over time is the one thing a DOM-reading suite cannot see. Item 10 records the blind spot; this is the
decision not to close it.

For the record, since it was researched and would otherwise be re-researched: there are two published
arrangements and they differ on where the image lives. Playwright's own screenshot assertion commits the
baseline beside the spec, one file per browser and platform, re-blessed with `--update-snapshots` — and its docs
are explicit that rendering varies with the host operating system, the browser build, headless mode, hardware
and even whether the machine is on battery, so a committed image is only stable in the environment that
produced it. The hosted services (Chromatic, Argos) keep baselines off the repo entirely and put the diff in the
pull request for approval, which is what libraries with a design system to protect generally use. Neither
arrangement survives the two grounds above.

---

## Open discussion

Ideas, sketches and things worth arguing about. **Not outstanding work, not numbered, and never part of the
answer to "what is next for development"** — see the note at the top of this file. Nothing here is a
commitment, and an entry that already carries the user's verdict is recorded here so that the same sketch is
not put to them twice. An entry leaves this section in one of two directions: upward into a numbered item, which is the user's
decision to take, or into `conventions.md` / `decisions.md` if building it settles something.

### `HoloCard` and `CardFan`, built and then deleted

Both were built as `Exotics` on the user's call and both were removed after they saw them. Recorded so the
same two sketches are not put to them again, and because each left one finding worth keeping.

**`HoloCard`: "doesn't really deserve to exist right now — it looks just like the example in PointerTracker."**
Their verdict, and it is the answer to the question that was left open when it was built: whether a page
example ever earns extraction is a decision for later, and this one did not. The tilt and the sheen live on
the PointerTracker page, which is where the effect can be read from source. **What it proved and what the
page kept**: the band of light has to travel against the tilt and further than it, because a reflection is of
something that is not moving — that is in `decisions.md` under the PointerTracker examples, and it survives
the component.

**`CardFan`: "ultra-specific. I would delete the component."** Their verdict. **What it proved is worth more
than the component was**, and is the part to reach for if a hand of overlapping things is ever built again:

- **The card a person is aiming at is not the card under the pointer.** Every card but the last shows only a
  strip, so the topmost rectangle at a point is the wrong answer; the index has to come from where the pointer
  falls along the row. That answer also survives a card being lifted, which changes the overlap.
- **A click handler per card is delivered to whichever box is on top**, so clicking the sliver you can see
  picks the neighbour — the same bug from the other side.
- **Picking from a `PointerTracker` reading fails a tap.** That reading is flushed on an animation frame after
  a `pointermove`, and a tap with no movement before it has nothing to read.
  `InteractionTracker.trackDrag` reports a ratio on the press itself, which is what a pick should use.

### `DrumCarousel` in `Exotics`, and the cost of splitting the carousels

`Cuboid` went to `Exotics` when it was built, and the user observed that `DrumCarousel` would fit there by the
same test — it turns elements in perspective and is not a composition of `Fundamentals`. **Their verdict was to
leave it where it is for now**, because moving it alone would put the two carousels in different folders while
they share one shell, one set of props and one page.

What would make this worth revisiting is a reason to separate them that is not about folders — a second drum
consumer, or a shell that stops being shared. Until then the pair stays in `Fundamentals` together, and the
inconsistency is known rather than overlooked.

### The animation sample collections: what to add instead of more entries

`CellAnimation` and `ScanlineAnimation` take their weights and their keyframes from
`components/src/Samples`, which now holds around sixty entries across two shapes. Two batches of new ones
were built and the user's verdict on most was that they look repetitive; `decisions.md` records why that is
structural — a weight that falls away from a point is always a wipe, a per-cell function ending in place is
always an entrance. So the ideas below are all machinery that recombines the collection rather than extending
it, and each was put to the user as a sketch. Their gradings, in their own terms:

**Rejected.** Two of them, and neither is to be re-proposed without a new argument.

- **The weight driving how far a cell travels rather than when it starts.** Every cell moves at once and a
  heavy one goes further, so a stagger becomes a depth field and any existing animation reads differently
  without being rewritten. It was one of the two the user picked out — dispatch by zone was the other, and is
  built as `fromZones` — and it is the one item here that was settled by building it rather than by argument:
  every cell was given the whole timeline and the weight was spent on how much of the move it made, taken as a
  blend between the animation's settled state and its current one. Their verdict on seeing it run was that it
  does not look good, and the code came out again in full.
- **Composing two animations in sequence inside one cell's own window** — fly in, then settle with a shake.
  Judged interesting in theory and likely too jarring in practice.

**Deferred as knobs rather than entries.** Quantising a weight into bands so a smooth wipe arrives as thick
blocks; jittering a weight so a machined edge becomes ragged; smoothing a weight so cells arrive in loose
clumps. Each applies to all of the weights at once, which is what makes them attractive, and each widens
`WeightOpts` — the user read that as adding behaviour to the API rather than extending a collection, which is a
different kind of change from a new dropdown entry and wants deciding on its own terms.

**Deferred as disproportionate.** All judged interesting, none judged worth the code for one effect:

- **Weights read off the source image** — reveal dark before light, or detail before flat, so the order comes
  from the picture and changes with every one. Singled out as the most code for the narrowest payoff: it needs
  a canvas pass over the source before the grid can be weighted at all. The component already allows it, since
  the weights callback belongs to the consumer, who holds the source.
- **Cells starting in each other's slots and sliding home**, so the picture arrives scrambled and resolves
  rather than assembling out of nothing. Needs each cell to know its partner's slot, which the defs carry.
- **The weight treated as height**, tilting the grid as one object in the perspective the container already
  sets, rather than staggering N independent cells.
- **The root animation moving against the cells** — the whole picture drifting one way while its cells move
  the other. `computeRootAnimation` exists and only the Glitch example on the ScanlineAnimation page uses it.

### Exotics put up as candidates, and what became of each

Four were sketched for the user. **`PatchBoard`** and **`Trail`** were chosen and are built; the reasoning
that fixed their shape is in `decisions.md`, and nothing about either is outstanding.

**Turned down, so do not re-propose either without a new argument.** **`Minimap`** — a shrunken picture of a
large area with a frame you drag to move the view, its machinery being the two-way sync between the frame and
the area. **`ExplodedView`** — an assembly separating along one axis with label lines that reach each part
without crossing.

**Named and not discussed: `Flipbook`**, a two-page spread that turns with a fold at the spine. The user said
they understood that one from its description, and it was not among the two they picked; it has never been
argued either way.
