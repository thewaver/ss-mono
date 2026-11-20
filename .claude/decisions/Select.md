# Decisions: `Select`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Select`, and who owns a floating list

This and the two `Select` headings after it are what remains of a design brief
deleted once it shipped; `backlog.md` carries what was left out, under `Select`.

**One `mousedown` `preventDefault()` on the popup root is what makes the whole model work.** The options
live in the `Viewport` portal, so clicking one would blur the field. Refusing the default action of
`mousedown` means focus never leaves the field. Three things fall out, and they are why `Tooltip` could not
have been the dropdown: an option click cannot dismiss the popup before the click resolves;
`aria-activedescendant` is honest, because focus really is on the field; and **close-on-blur becomes correct
rather than fatal**, so there is no document-level outside-click listener.

**The field is a `<button role="combobox">`.** The APG select-only pattern uses `<div tabindex="0">`, which
means re-implementing focusability and activation a button has for free, and the house rule is that the leaf
is a real element with real semantics. `Enter` and `Space` are handled in `keydown` with `preventDefault()`,
which suppresses the button's synthesised click — otherwise every keyboard activation toggles twice.

**Options are `role="option"` divs, never buttons, never tab stops.** `getIsTabbable={() => false}` puts
them at `tabIndex -1`; a button inside a listbox breaks option semantics. The consequence a painter must
know: **`isFocused` is never true for an option**, because focus is on the field. Hence their own extras.

**`isHighlighted`, not `isActive`.** `SelectOptionFlags = { isHighlighted, isSelected }`.
`InteractionFlags.isActive` already means "held down" across every control.

**The highlight is a value resolved to an index — never a stored index.** Same shape as `Tabs`' roving
entry: a `highlightedValue` signal and a memo resolving it against the navigable indexes, falling back to
the selected option then the first navigable one. Opening therefore highlights the selection with no
imperative set, and a list changing under a filter cannot leave the highlight pointing elsewhere.

**The painter owns the panel, so the option list arrives as a thunk.**
`renderPopup(renderOptions, getVisibilityTarget, getTransitionDurationMs, getPlacement, getFlags)` — the
consumer returns their own bordered, scrolling, animating box with `{renderOptions()}` inside. The
`renderDecoration` shape (an absolutely-positioned painter behind a library-owned list) was rejected: a
decoration cannot scroll with the content, which would force `max-height` and `overflow` into library props.
`role="listbox"` stays on the library's positioned root and options are descendants at whatever depth the
painter nests them, which ARIA allows as long as nothing between carries a conflicting role.

**Geometry is the library's, including the width floor.** `createPortalPosition` also returns
`getAnchorRect`, and the popup root sets `min-width` from it. A painter cannot compute this — it is portalled
away from the field — and a dropdown narrower than its control is a positioning artifact, not a style choice.
Everything above the floor stays the painter's, exactly as `getMinWidth` draws that line for adornment insets.

**`pointer-events` is switched off for the closing fade**, since `ElementFader` keeps the popup mounted for
the transition and a click during those 200ms would select a second time from a list visually leaving. The
inline style overrides the `pointer-events: all` the class needs while open.

**Single-select first, and no shared private composite yet.** `value: Signal<T | undefined>` is what a
consumer already holds; `Signal<T[]>` for both cases would tax the common one and make "nothing selected"
representable twice. Multi differs in behavior, so the `BinarySwitch` shape is the likely end state, but
erecting it before a second consumer would be guessing at the seam.

**The keyboard walk stops on reachable-disabled options and refuses to select them**, matching `RadioGroup`.
`getNavigableIndexes` calls `InteractionTrackerUtils.computeIsReachable` with the option's own three fields rather
than re-deriving the rule.

**`scrollIntoView({ block: "nearest" })` on the highlighted option** is the only way the library reaches a
scroll container the painter owns. It runs from an effect on the highlight, so it covers opening onto a
selection far down the list as well as the walk.

**The popup list is always named, and exactly named only when the consumer asks for it.** ARIA requires a listbox
to have a name, and `Select`'s popup list had none. `listAriaLabel` gives it an exact one, on the user's call; left
out, the list's `aria-labelledby` points at the `<label>` element of the `Label` the field sits in, or at the field
itself when there is no `Label`. Neither fallback is exact: a reference to the `<label>` reads everything inside
it, the field's current text included, so it gives "Country Portugal"; a reference to the field gives the field's
`aria-label` if it has one and its content if it does not, because the name computation does not follow a
referenced element's own labelling. Two alternatives were rejected. Pointing at the `Label`'s caption would be
exact but needs `Label` to know which child is its caption, which would change its API and every call site. A
required list name would put a second name on every `Select` whose field is already named. What was built costs
`Label` one generated id, published through its context as `getLabelId`, and nothing else.

### Controls: `Select` and `MultiSelect` clear slot

**`renderClear` paints a library-owned `Button` laid over the field's end edge.** The button sits beside the field,
not inside it, because a `<button>` field cannot contain another interactive element. It is drawn only while
something is picked, and is its own tab stop straight after the field. Escape and the arrows do nothing on it,
because the field's key handling is on the field element and never reaches its sibling. The painter receives the
button's own flags (`ButtonFlags`) rather than the field's, so it can paint its own hover and press.

**Pressing it empties the value, runs the change callback, closes the list, and returns focus to the field.** The
value becomes `undefined` for `Select` and `[]` for `MultiSelect`. Focus has to return to the field because the
control disappears the moment there is nothing left to clear. `Select`'s `onSelectionChange` widened to
`T | undefined` for this. `clearAriaLabel` names the control optionally, as `Button`'s `ariaLabel` does; an
icon-only painter needs it. The control is not measured: it sits at the field's end padding, so the consumer's
`padding` has to leave room for it, the same padding agreement `TextInput` records.

### Controls: `Select`'s autocomplete, and why the consumer filters

The question was whether `Select` owns a default matcher with a `computeIsMatch`
escape hatch, or owns only the query string.

**The consumer filters, and the precedent is the Playground's own left menu.** `Tabs` has no filtering API:
`AppContent` owns the search box, the query, and derives each list's tabs. Its rules are the argument — it
decides what a fully-filtered category does, and it **keeps the currently selected item even when it does
not match**. Neither is expressible by a library matcher over an unknown `T`, and the second silently breaks
a select whose matcher would filter the selected option away. The `Select` page makes the point from the
other end: it matches an airport on **either its city or its IATA code**, two fields the library cannot know
exist. Ownership follows knowledge.

**`Select` owns the query, because the query is the field's text.** `query: SignalSource<string>` is a
two-way signal by the existing rule, since the component writes it on every keystroke and the consumer reads it
to derive `getOptions`. The loop through the consumer is a plain memo, not a cycle.

**"No matches" stopped being a flag.** The candidate `hasNoMatches` is gone rather than deferred: the consumer filtered, so it already knows the result is empty, and
its empty state is its own JSX inside `renderPopup`. A flag would be the library telling the consumer
something they just computed.

**The mode is `query`'s presence, and this is the one sanctioned use of that.** No `getIsAutoComplete` boolean beside it. _"Presence as a
trigger fails invisibly"_ warns about a prop whose real purpose is something else quietly changing
semantics; a query string has exactly one purpose, an editable field with nowhere to put its text is
incoherent, and forgetting the prop yields a working non-editable select — so it fails toward the safe
default. Precedent: `Tab<T>`'s `href` choosing `<a>` over `<button>`.

**One leaf, two elements, in the `TabsItem` shape.** `SelectField` holds a `commonProps` object of getters
for the shared ARIA and a `<Show>` rendering either a `<button>` or an `<input>`. The `<input>` follows
overlay geometry, and `getPadding` plus `computeTextStyle` are the same two props `TextInput` uses.
`TextInputTextStyle` is imported rather than re-declared: same concept, and duplicating a twelve-key `Pick`
to avoid a sibling import is the worse trade.

**The painter draws the selection, the input draws the query, and `isFiltering` decides which is visible.**
The two texts are stacked by the overlay geometry, so the painter fades its value text out while the query
is non-empty and back in when it clears — so no option ever needs a `label` field for the field to display a
selection.

**The component clears the query, and waits for the fade to finish.** Closing ends the interaction, so the
query is the component's to reset; doing it in `close()` repopulated the consumer's list mid-fade and
visibly re-grew the box. It now runs off `ElementFader`'s `getHasTransitionFinished`, guarded on the query
already being empty so it never writes on mount.

**An editable field takes the keyboard back.** `Space` types a space instead of selecting, and `Home` /
`End` move the caret instead of jumping to the first or last option — both gated on the mode, because
hijacking either in a text field is a bug rather than a shortcut. `Enter`, `Escape`, `Tab` and the arrows
are unchanged. Typing opens the popup and resets the highlight, so each keystroke re-highlights the first
option of the new list.

**While filtering, the highlight prefers the first option over the selection.** Otherwise typing `lis` with
`Oslo` selected leaves the highlight on `Oslo` and `Enter` re-picks it. The limit is inherent to the consumer
owning the filter: the component knows which options are _present_, not which _matched_, so a consumer
injecting a non-matching option can still see the highlight land on it. That is theirs to fix in their own
filter, and it is why the left menu's keep-the-selected-item rule must not be copied into a select.

**`TextSync` came out of `TextInput` because a second consumer arrived.** `Abstracts/TextSync/` holds
`createValueSync(ref, value, opts)` — the element/value sync, the caret restore after a transforming setter,
the IME composition gating. Exactly `TextInput.syncElement`'s code; extracting beat duplicating fifteen
lines of caret arithmetic.

### One walk numbers the options, and both of `Select`'s rendering paths read it

`Select` renders a grouped list two ways — mounted, which walks the written items and nests a `role="group"`
box per group, and windowed, which walks a flat row list because a window cannot draw a box whose ends are
outside it. Both need the same number for each option: **its flat index among all options**, which is what the
highlight, `aria-activedescendant`, typeahead and the keyboard all index by.

**That number used to be worked out twice, once per path**, by two walks that had to agree and nothing checked:
a `getItemOffsets` memo inside `Select.tsx` counting options per written item for the mounted path, and a
running counter inside `SelectUtils.getRows` for the windowed one. Two walks producing one number is the shape
of a bug that only shows on one of the two paths, which is also the harder of the two to look at.

**`getItemOffsets` is now in `SelectUtils` and `getRows` is built on it**, so there is one definition of how
many options precede a written item and the row list reads its `optionIndex` from that. Neither rendering path
changed. `Select.utils.test.ts` pins the walk directly — including that an empty group contributes nothing, so
the offsets repeat rather than leaving a hole — and that the option indexes on the rows are the same sequence
`getFlatOptions` produces, which is the agreement that used to be implicit.

**Note what is not shared: the row index and the option index are different numbers**, and the bridge from
one to the other is what `getRowIndexOfOption` was. A group header is a row and is not an option, so the two
spaces diverge the moment a list is grouped. `Tree` has no such split — every row is a node — and that
difference was read at the time as what made the two components' flatteners less alike than they look. It
turned out to be one default on a shared walk instead; see _"`Abstracts/Flattener`"_ below, which is where
`getItemOffsets`, `getRows` and `getRowIndexOfOption` went and which now holds the numbering these
paragraphs describe.

### Grouping and windowing compose, and the group box is what makes it possible

**The window runs over rows, not options.** `SelectUtils.getRows` flattens the item list into one row per group
header and one per option, each carrying the option's flat index so the highlight, the ids, typeahead and the
keyboard walk keep counting options the way they always did. `getIsVirtualized` no longer refuses a grouped
list; the only condition left is that the consumer supplied an estimate.

**A `role="group"` box holds whatever slice of its group is in the window, and that is correct rather than a
compromise.** The obstacle recorded against this was that a box wraps its options, so a window opening halfway
down a group would have to draw a box whose header is above the window and whose end is below it. It dissolves
once the box's own entry above is taken seriously: the box is **not paintable** — the library owns
`<div role="group" aria-label>` and the consumer fills only the header. A box with no paint has no visual
extent to preserve, so wrapping only the mounted rows changes nothing a reader can see, and the group's name
travels on `aria-label`, which is present whether or not the header row is in the window.

**Visible rows are cut into runs of one group.** Consecutive rows sharing a group get one box; a run beginning
mid-group is ordinary. The box is a static element, so the rows inside keep resolving their `position:
absolute` against the sizer and their transforms are untouched — wrapping them costs no layout.

**The header is not sticky, and that is not a taste call.** Windowing is an optimization, so the windowed list
must look like the mounted one, and in the mounted list a header scrolls away with its group. Repeating or
pinning a header would make the two renderings differ by whether the consumer happened to pass an estimate.
If sticky headers are ever wanted they belong to both renderings at once.

**The pinned row keeps its own box.** `getPinnedRows` already held the highlighted option mounted so typeahead
and the active-descendant id survive scrolling; converted to a row index it now also pulls that option's group
box along, which is why a scrolled list can show two boxes — the group under the window and the one holding the
pinned row.

**An option keeps its element while the window slides, which is why ungrouped rows are not wrapped.** A wrapper
round a run of ungrouped rows would need a key, and the only key such a run has is where it starts, which moves
every time the window does — so every option in it, the focused one included, would be built again and focus
would fall to the page. Each ungrouped row is therefore a direct child of the sizer keyed by its row index, and a
group's box is keyed by its heading's row index, which does not move. Solid holds the same by identity: its loop
runs over the rows themselves and over group indexes, never over run objects made afresh on each change.

**An option is focusable from the moment it is drawn.** It carries `tabindex="-1"` in its own markup, which is
what the interaction tracker writes for it anyway, because the tracker's write arrives a commit later. A
highlight that jumps to an option drawn in that same commit — End, Home, or a step into a group whose heading
took the one overscan row — has to be able to take focus then, before the option it left is taken out of the
window.

**Solid can still detach the focused option, and the list puts focus back when it does.** Its array diff
replaces rather than moves a lone row when rows arrive in front of it — a pinned option whose group heading
enters the window above it — and a detached element loses focus even though it is back a moment later. So the
windowed list notes whether focus was inside it before each window change and, when the change left focus
outside, focuses the highlighted option again.

**Vue needs the same repair, for a different reason.** A window that has not yet heard about its own last scroll —
arrows pressed faster than the scroller reports — can drop the row that holds focus when the highlight moves on, in
React as well. React does not notice, because its `onBlur` is never delivered for a removed element, so the list still
believes it has focus and the next highlight takes it. Vue's `focusout` is the native event and bubbles to the list
while the row is being removed, so the list recorded focus as gone and the new option was never focused. The Vue list
notes focus before each window change and puts it back, as Solid's does.

**`computeEstimatedGroupHeight` is optional and falls back to the option estimate.** A header is usually
shorter than an option, and an estimate that is wrong only shifts the scrollbar until the row is measured, so
requiring it would be ceremony; getting it right is worth doing when the headers are tall.

### Controls: option groups, and `Select` / `MultiSelect` as presets

Settled, completing the brief. Both landed together because they answer the same question
from opposite ends: what the option list is a list _of_, and what a selection is.

**A group is a record with children, in the same array as ungrouped options.**
`SelectItem<T> = SelectOption<T> | SelectOptionGroup<T>`, discriminated by `SelectUtils.getIsGroup`
(`"options" in item`), so a list can mix both and a group cannot be malformed — no sibling marker to get out
of order, no second prop to keep in step. `SelectOption<T>` is a closed record shape, so the `in` check
cannot be fooled by a `T` with its own `options` field.

**The tree is a rendering concern only; everything else works off the flat list.**
`SelectUtils.getFlatOptions` gives traversal order, and the keyboard, highlight, ids and selection all index
into it — so the arrow walk crosses group boundaries without knowing groups exist, and `Home` / `End` reach
the ends of the whole list. The one piece of bookkeeping is `getItemOffsets`, mapping each top-level item to
where its options start in the flat list, which lets a nested `<Index>` hand each slot its flat index.

**The library owns `role="group"` and its name; the consumer paints the header.** The wrapper is a bare
`<div role="group" aria-label={label}>` and `renderGroupHeader(getGroup)` fills in the visible header. Two
rejections: `display: contents`, because Chromium has historically dropped such elements from the
accessibility tree and the role is the point of the element; and a thunk handing the consumer the group element
itself, which would put the ARIA role in consumer markup.

**The box around a group is a second painter, `renderGroupBox`, inside the library's group element.** It is handed
the heading and options as a thunk, in `renderPopup`'s shape, and wraps them in whatever it draws; the role stays
on the library's element outside it, so the rejection above still holds. The user chose a separate prop over
widening the header painter's signature, which would have changed every existing header, and renamed
`renderGroup` to `renderGroupHeader` in the same change so the two names say which part each draws. **It is
refused for a windowed list** (`SelectGroupBoxExcludesWindowing`, plus `SelectUtils.warnIfGroupBoxIgnored`):
there each row is absolutely placed on its own, the group element has no height, and a box drawn around it would
cover nothing — the `Stepper` pattern of a type refusing the pair and a warning for whatever slips past.

**Option refs are gone, and each option scrolls itself into view.** An array keyed by index cannot survive a
tree, since a flat index shifts when a preceding group is filtered. `SelectOptionItem` watches its own
`isHighlighted` and calls `scrollIntoView({ block: "nearest" })` on its own element, correct at any depth.

**`SelectComposite` is private, `Select` and `MultiSelect` are thin presets over it** — the `BinarySwitch`
shape, down to `SelectPresetProps<T>` being an `Omit` of the composite's props. `index.ts` exports the two
presets and the types but not the composite. The seam is four props: `getSelectedOptions`,
`computeIsSelected`, `onPick`, `getIsMultiple`. Everything else is written once.

**Multi is a preset rather than a mode flag because the value's _type_ changes.**
`Signal<T | undefined>` versus `Signal<T[]>` cannot be reconciled by a boolean, and a single `Signal<T[]>`
would tax the common case and give "nothing selected" two spellings. The composite never sees a value: it
asks the preset which options are selected and tells it what was picked. `MultiSelect` toggles membership;
`Select` replaces. That is why `renderContent` takes `getSelectedOptions` plural and `Select`'s preset
narrows it to `getSelectedOptions()[0]`.

**Picking in a multi list keeps it open, and moves the highlight to what was picked.** The second half was
found by driving it: with the highlight left alone, arrowing after a mouse pick continued from the _first
selected_ option. `aria-multiselectable="true"` goes on the listbox, and `isSelected` on an option stays a
boolean — an option is selected or it is not. The three-way value belongs to the group header, below.

**A group header is told how much of its group is selected, through a second argument rather than a new prop.**
`renderGroupHeader` (then `renderGroup`) was `(getGroup) => JSX.Element` and is now `(getGroup, getFlags) => JSX.Element`, where
`SelectGroupFlags` carries one field, `checkedState`. Adding an argument rather than a prop keeps every
existing header working untouched — a consumer who does not want the state simply never names the second
parameter — and it matches `renderOption`, which has taken `(getOption, getFlags)` all along. The field is
a record rather than a bare accessor so that a second thing about a group has somewhere to go.

**The state is computed the same way in both presets, and is degenerate in one of them.** `Select` and
`MultiSelect` differ only in `computeIsSelected`, which the header folds over the group's own options, so a
single-select group holding the selected option reports `"mixed"` — accurate, since some of its options are
selected and some are not, but never useful, because a single-select group can only reach `true` when it
holds exactly one option. Gating the computation on `isMultiple` was rejected: it would make one field mean
two different things depending on which preset was mounted, and the consumer paints the header anyway, so a
single-select consumer simply does not ask for the flags. The Playground does exactly that — only the
grouped multi-select passes them through to `PageSelectGroupContent`.

**A disabled option is still a member of its group.** The Playground's Nordics group holds a disabled Finland,
so picking Denmark and Sweden leaves that header at `"mixed"` for good. Excluding unpickable options was
rejected because it would let a header say _everything here is selected_ while an option sat there unselected,
which is worse than a header that never fills in. The rule is that the header describes the group's options
against the current selection, and nothing else.

**Nothing about this reaches the accessibility tree, and that is not an omission.** A `role="group"` has no
checked state in ARIA — `aria-checked` is not among the attributes it supports — and each option already
announces its own through `aria-selected`. So `checkedState` is paint input and nothing more, and the library
still draws no header of its own.

**`inert` is what disables a closing popup, not `pointer-events`.** A real bug: the fading popup carried
`pointer-events: none` on its root, which looked sufficient and was not — `pointer-events` is inherited, but
every option sets `pointer-events: all` explicitly (it has to, to beat `interactionRoot`'s `none`), and an
explicit value on a descendant beats an inherited one. So a click aimed at whatever sat under a closing
popup was swallowed by an option of a list already visually gone. `FocusManagerUtils.isReachable` already
tests `[inert]`, so support was assumed all along.

**Behaviors a `Select` guarantees, to re-check after touching it** — none visible in markup, and the last
two were wrong once: `Enter` on a reachable-disabled option changes nothing and leaves the popup open;
clicking an option leaves `document.activeElement` on the field; a disabled field neither opens nor takes
focus while its reachable twin stays at `tabIndex 0`; the arrow walk skips a disabled option _inside_ a group
and crosses into the next; a multi list stays open across a pick and moves its highlight to the row picked;
and a closing popup lets a click through.

### `Select`: a typed-into field carries the picked text

**A screen reader read nothing as an autocomplete's value.** After a pick the field showed "Lisbon", but the text box
was empty and "Lisbon" was the consumer's paint beside it, hidden from assistive technology — so the combobox
announced its name and no value, which fails WCAG 4.1.2 (Name, Role, Value). The non-typing `Select` was always right,
since its value is its button's own text. The fix is the one the backlog had recorded as a taste question — restore the
picked option's text on Escape — which turned out to be the accessibility fix.

**Where the text comes from was the user's choice among three**: `computeCustomText` when given, otherwise the text the
consumer painted for the picked option, read off the paint with `SelectUtils.computePaintedText` (every text node,
hidden ones included, since the paint is usually hidden precisely because the field is meant to carry the value).
Rejected: making `computeCustomText` required for a typed-into field, and a warning for non-text values.

**The field shows what was typed only while the reader is typing.** `isEditing` turns on with the first input and off
whenever the popup closes; otherwise the box holds the picked text in transparent ink, so the paint is what is seen and
the box is what is read. Opening still shows every option — the query, which the consumer filters on, is untouched by
the picked text, as in React Aria's combobox. Focus or a click selects the box's text so a keystroke replaces it.
**The two writes on input are one update**: written separately, the box resynced to the empty query between them and
the caret jumped to the start ("Por" typed as "orP"). A multi-select keeps an empty box.

### `Select`: what the reference libraries do

Checked against Radix, React Aria and Kobalte, which is the SolidJS one.

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
- **Virtualization is nobody's library code.** Kobalte's select has a `virtualized` boolean and a docs
  example handing the list to `@tanstack/solid-virtual` with a hundred thousand options; React Aria has
  a `Virtualizer` wrapper; Radix has neither, and its docs cover long lists only with scroll buttons.
  So the seam is a flag plus a documented integration rather than an `Abstract`, and the flag exists
  precisely so the library stops managing its own scrolling — which is the loose end this bullet names.
- **Open state is controlled-or-uncontrolled in all three**, under the same three names: `open`,
  `defaultOpen`, `onOpenChange`. The consumer can always close it programmatically and the library
  still owns the default.

### A list the consumer has not finished handing over: `getHasMoreOptions`, `onReachEnd`, and a marker

Settled, after the published virtualization design was tried and reverted (`backlog.md` item
5). This is the other half of the same problem with a different answer, so both are worth stating together:
**virtualization keeps the whole list and mounts a window onto it; this keeps only what has arrived and mounts
all of it.**

**`Select` takes `getHasMoreOptions` and `onReachEnd`, and never a batch size.** A batch size would put the
library in charge of slicing the consumer's data, and the floor a batch size wants — "at least as many as fit"
— is not computable here anyway: the element that scrolls is the **consumer's** popup surface, since the
`max-height` and `overflow-y` live in their paint, and `Select` holds no ref to it. So the library reports an
event and reads a flag; the consumer decides what a batch is, where it comes from, and when there is no more.
An in-memory array sliced by the consumer and a paged HTTP endpoint become the same mechanism.

**The end is marked by a one-pixel element and watched with an intersection observer, not measured.** The
alternative — a `scroll` listener comparing `scrollTop + clientHeight` against `scrollHeight` — loses on three
counts: it needs the scrolling element, which is the consumer's; it needs a "how close counts" threshold,
which is wrong for some row height; and it is silent when the first batch does not fill the box, because
nothing has scrolled. `ElementObserverUtils.createViewportIntersectionObserver` observes against the viewport, and
an observer computes intersection through every ancestor's overflow clip, so it reports the marker hidden
without being told what is hiding it. "The list is too short to scroll" and "you have scrolled to the bottom"
become the same condition, which is what makes it converge with no startup path.

**The marker overlaps the last option rather than following it, and the keyboard is the reason.** A negative
top margin equal to its own height puts it on the last pixel _of_ the list instead of the first pixel _after_
it, so it costs no layout. It shipped as a plain trailing element, which does not work for
anyone not using a mouse: an option scrolls itself into view with `block: "nearest"`, which stops the moment
that option is fully visible, so a marker beyond the last option is exactly what `End` and the last
`ArrowDown` can never reveal — the highlight lands on the last option held and no batch is ever asked for.
Overlapping makes "the last option is on screen" and "the marker is on screen" the same fact, and the mouse
path is unchanged.

Why the suite missed it: at a scale of exactly 1 the marker's top edge lands on the scroll box's bottom edge to
the pixel, and Chrome reports that zero-area contact as an intersection, so the batch arrives and the spec
passes. The Playground is scaled by `Viewport` and is almost never at 1, and at any other scale the contact
misses by a fraction. **A behavior that depends on two edges being equal is not a behavior**, so the spec now
asserts the overlap itself rather than the batch that follows.

**The Playground does not skip painting off-screen options, because it moves the list under the reader.** The
option paint carried `content-visibility: auto` with an estimated row height behind a panel switch. The
estimate is a single number and the rows are not one height — a title alone is short, a title with a wrapped
description is not — so the moment a jump to the end forces the skipped rows to be laid out for real, every
height above the highlight is corrected at once and the scroll offset no longer points where it did. `End` then
leaves the highlighted option below the visible box. The user removed the switch. What it
bought was the cost of _painting_ options, which is a different and smaller cost than _mounting_ them;
The painting cost left over is under _Accepted limits_ in `backlog.md`.

**The marker is keyed on the options array, and that is load-bearing.** An intersection observer reports only
_changes_, so a batch too small to push the marker off screen would deliver no callback and the list would
stall. Rebuilding the marker whenever the array identity changes forces a fresh observation of fresh geometry;
`createViewportIntersectionObserver` sets its flag back to `false` on every re-registration for the same
reason, so the answer is never carried over from an element that no longer exists. Reading the flag
synchronously after a batch arrives — what the earlier attempt did — fetched one batch more than it needed
every time.

**The guard holds the options array itself, not its length, and it is a plain variable rather than a signal.**
Nothing renders from it. Its job is to stop a marker that leaves and re-enters while a request is in flight
from asking twice for the same list, and the array's identity is exactly what "the same list" means. Length is
not: a **filtered** list is replaced rather than appended to, so a new query whose result happens to be as long
as the last would be read as already asked and the list would never load. Reachable the moment autocomplete
and batches are combined, which the Playground now demonstrates. The guard clears when the popup closes.

**Filtering and batching compose without either knowing about the other.** The query is the consumer's, the
batches are the consumer's, and the library only reports that the end of what it holds is on screen. A
consumer wanting the server to filter runs a new search on a query change and replaces the array; `onReachEnd`
then pages within that query. Note that `Home` and `End` are already suppressed on a filterable field, so the
wrap rule below is the only keyboard behavior applying to a fetched autocomplete.

**An incomplete list does not wrap, and that is `Select`'s call rather than `NavigatorUtils`'s.** The 1D walk
still answers _which position is next_ and still wraps; `Select` answers _whether to go there_, and refuses
when the step would carry off either end while more options exist. No option was added to
`computeNextPosition`, because three of its four callers are closed rings and would gain a mode they can never
use. `Home` and `End` needed no change — they resolve against the array the library was handed, which is
exactly "the first and last held".

**What this does not do is make a complete list cheap.** A consumer holding 100,000 options in memory and
slicing them gets a list that opens quickly and grows as it is read, at the cost of `End` meaning "the last one
loaded" — the library declining to know something it knows. The user took that trade for the
incomplete case, which is the case this is built for.

### `Select`'s Docs page: nineteen examples into twelve sections, and the large list keeps its count and its timing

The old page's state examples became knobs (Error and Disabled on Basic; the tooltip section as on the text fields),
"Preselected" became a sentence (an opening list highlights the pick), "Option groups" and "Group boxes" became one
example with a Group boxes knob passing or leaving out `renderGroupBox`, and the two disabled-option examples one
with a Reachable knob. The pretend server (`fetchRoutes`, `searchRoutes`) moved beside the sample builders in the
shared `SelectOptions.const.ts`, so each on-demand example holds its own loading.

**The large list keeps its Option count knob** — the user's call, against _"A docs example has no knob that exists
only for the Playground"_: that rule is about knobs that only put a demo into a state a reader could reach by using
it; a count is the claim virtualization makes, and the knob is how a reader tests it. **A knob that sizes the data
stays where the size is what the section demonstrates.** **Its timing stays too, measured from outside the
example** — also the user's call: the Docs page watches the list open through Select's own `visibility`, times two
animation frames from there, and runs the frame-rate monitor while open, so the example's code is a plain Select.
The old grouped variant of the large list was dropped; groups have their own section.

**`Select` has no read-only mode, by the user's choice.** Raised while building its Docs page: ARIA defines
`aria-readonly` for `combobox` and `listbox` as "not editable, but is otherwise operable", and the browser's own
`<select>` has none. The user chose to leave it as it is, so it is not a gap to raise again.

**The list's height is the popup's, not a Select setting** — the user's call "for now", over a most-options-shown
setting like `<select size>`: the popup is the consumer's painter, and with options of different heights or groups a
count of options has no single height. The Docs page's "A long list" section went with it; Home and End and the
highlight on opening moved into the intro.
