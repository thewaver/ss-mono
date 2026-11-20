# Decisions: `Paginator`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Paginator` takes a layout, and the placed box moves into the abstract

The proving pass of `backlog.md` item 10, against the control the item named as the strongest candidate. A
paginator is arithmetic over a flat list, so a layout is the only thing that changes: the steps, the pages and
the ellipses go round a dial in the order they already had, and nothing about the counting, the addresses or
the labels is touched.

**`path` and `parentExtent` describe a level, so a control with no levels states neither.** Both are optional on
`PlacementLayoutDefs` now, and `createArc` defaults them to the root. They were required because `Menu` is the
only thing that had ever asked for a layout and a menu always knows which band it is drawing; a paginator has
no notion of either, and making it pass an empty path and a zero width would have been the caller's version of
the declare-and-ignore fault the one-aggregated-object rule exists to prevent. `path.length === 0` is still
what "root" means, so no layout had to learn a new spelling.

**The placed box is the abstract's, because the translation from fractions to CSS is.** `Menu` held four class
names and two functions that turned a `PlacementRect` into `left`/`top`/`width`/`height` in container-query
units; a second consumer would have had to import a sibling's internals or write the same thing again.
`PlacementBox` and `PlacementItem` came out of `Menu` for that reason, and `Barrel` is the precedent, because
lifting only the arithmetic leaves every consumer holding the same markup. The split is the same one `Barrel`
drew: the primitive owns the sizing box, the spacer that gives it its shape and each item's offset and turn;
the consumer owns what goes inside an item and everything said about it.

**Both wrappers carry `role="presentation"`**, which is the rule _"the wrapper between a container role and its
items is presentational"_ reaching the second wrapper of that kind. It matters more here than it did for
`InteractionWrapper`: `role="menu"` and `role="tablist"` own their items, and a laid-out control puts two
generic divs in between. Neither is focusable and neither carries global ARIA, so the role is honored rather
than ignored.

**`toContainerWidth` is `PlacementUtils`' now**, having been written by hand three times — in `Menu`, in
`Formation`, and again in the Playground's wheel painter. `Formation` is the one still holding its own copy of
the whole box, in its own vocabulary of insets rather than placements; whether it becomes a consumer of this
abstract has not been argued.

**A placement travels inside the painter's object where there is one, and as its own argument where there is
not.** `PaginatorPageRenderProps` and `PaginatorStepRenderProps` already carried a payload — a page number, a
target page — so a rect goes in beside them under the same rule that put one inside `WheelWedgeState`.
`renderGap` is the exception: a gap is not a control, has no flags object of its own, and takes the placement
as a second argument, which is the shape `Menu.renderItem` already has for the same reason.

**A placed item has to be told to fill the box the layout gave it, and that is the pass's one real correction
to a component.** `InteractionWrapper` sizes itself `fit-content` by default and the elements inside it ask for
`width: 100%`, so a painter with no intrinsic width resolves against a parent that is resolving against the
painter, and the whole chain comes out zero wide — a ring of wedges rendered as a ring of labels with no
wedges. `Menu` had always passed `sizing="fill"` and so had never seen it. `Paginator` picks per item: `fill`
where a placement exists, `fit-content` where one does not, because a page cell in a straight row is as wide as
its digits and a wedge is as wide as the layout says.

**The two demos make different claims on purpose.** The dial reads the sector off the placement and paints an
annulus wedge per element, which is `WheelMenu`'s painter applied to a second control. The ring hands the same
layout to the painter the straight rows already use, unchanged, which ignores the sector and draws its cell in
the box. So the sector is vocabulary a layout offers and a painter may decline, rather than something a placed
control has to understand.

**What the pass did not strain, which is worth knowing before the next consumer.** `PlacementUtils.pickIndex`
still has no caller — a paginator has no gesture that picks by direction, so the loose end item 10 records is
untouched. Nor did anything about levels move: a paginator is one level and always will be, so the concentric
machinery went unexercised.

**WCAG, checked rather than assumed.** 2.4.3 Focus Order (A) asks that "focusable components receive focus in
an order that preserves meaning and operability"; a ring is drawn from the document order outwards, so the
angular order and the tab order are the same walk, and `paginator.spec.ts` asserts exactly that rather than any
angle — each box sits further round than the one before it. 2.5.8 Target Size (Minimum) (AA) asks for "at least
24 by 24 CSS pixels", measured on "the smallest enclosing rectangle aligned to the horizontal axis within which
all the points of a shape lie", and the adjoining wedges of a ring cannot claim the Spacing exception. Measured
at the widest the Playground's knobs go — twenty-six elements round the dial — the smallest wedge's enclosing
rectangle is 53 by 57, so it conforms. The number that would break it is item count rather than any knob: past
roughly thirty elements an axis-aligned wedge's rectangle narrows below 24, and a root band divides its spread
evenly with no floor, unlike a deeper band which asks for a target arc length and grows its radius to get it.

### Controls: `Paginator`, where the arithmetic is the component

Built, at the user's request, from the `backlog.md` entry that had argued it out of the
"compositions" list: the visible page range, where the gaps fall and how many pages sit either side of the
current one is arithmetic, and arithmetic is the library's half of the contract.

**`PaginatorUtils.getEntries` is a pure function with its own unit tests, and the component is a thin wrapper
over it.** Same split as `TreeUtils.getVisibleRows` and `SelectUtils.getFlatOptions`. Sixteen cases cover both
ends, both knobs, a page beyond the end, and no pages at all.

**A gap carries the pages it stands for, rather than being a bare ellipsis.** `{ kind: "gap", from, to }`
against Ark UI's `{ type: "ellipsis" }`. The library has computed those numbers on its way to deciding a gap
belongs there, so throwing them away makes the consumer's painter unable to say anything true — a tooltip
reading "pages 5 to 19" is free here and impossible there.

**A gap that would hide one page is spelled as that page.** Replacing `4` with `…` saves no room and costs a
destination. Arithmetic rather than paint, so it belongs in the function.

**The window is exactly `2 × siblings + 1` wide, and the boundaries do not reserve a slot for an ellipsis that
would hide nothing.** MUI keeps a slot free next to each boundary, which is why its list at page 1 is a page
longer than the same call here. The wasted slot is only ever visible as an ellipsis standing between page 1 and
page 2.

**The gap is `aria-hidden`.** It is not a control, and the pages behind it cannot be reached by naming them, so
announcing "pages 5 to 19" tells a screen reader user about something they cannot act on. Ark UI hides its
ellipsis for the same reason.

**`computeHref` is a function, where `Tab<T>` has an `href` field, and the difference is who authors the
list.** A consumer writes their own tabs, so a field is reachable; here the library generates the entries, so a
field would have nowhere to come from. The consumer knows the address shape and the library knows the page
numbers.

**The page is one-way — `getPage` plus `onPageChange` — following `Tabs` rather than `Select`.** _"Signal tuples for two-way
state"_ in `conventions.md` takes the pair only where the component genuinely writes, and its recorded exception
is a value derived from a route with no setter to hand over. A page number is that value more often than not,
and pages that are links make it certain. A consumer who does hold a signal spends two props on it, the cheaper
direction to adapt.

**Every item is its own tab stop, with no roving.** `Accordion`'s position rather than `Tabs`': a tab list is
one control with several states, a paginator is a row of independent destinations. `aria-current="page"` marks
the one you are on.

**A step with nowhere to go is `aria-disabled` and carries no `href`.** The target is computed first and the
control is disabled when it equals the current page, so "previous on page one" needs no special case. Dropping
the address as well matters only for the link form, where an anchor would otherwise still be followable by
every route that is not a click.

**The painted number is `aria-hidden` and the name comes from `computePageLabel`.** Exactly `Calendar`'s day
cells: a painter drawing a bare digit gives a reader "7" with no idea what of. The default names are English,
and the compute hook is the escape from that rather than a locale the library pretends to know.

**The page's dial example is the eastern half of a ring, with the results panel against its flat edge.** The
user's layout: half a turn facing right runs clockwise from the top, so the order reads top to bottom without
the dial going against every other round control in the Playground. A ring's box is always the whole circle
(_"The band and the arc are two placers"_), so the half sits in a square whose left half is empty; the panel is
pulled into that half by a negative margin of half the dial's width and stacked above it, and its minimum height
is the dial's, so the flat edge is never taller than what it meets.

### `Paginator`: every page is its own Tab stop, and stays that way

Weighed when a fifteen-stop row looked like a lot to walk past, and settled by checking rather than arguing. Each
page is a separate destination, which is why each is a stop, and the references agree: MUI's documentation says
"The pagination items are in tab order, with a tabindex of "0""; GOV.UK's design system marks pagination up as a
`<nav>` of ordinary links; Ark UI renders each page as a `<button>` with no roving focus documented. WCAG has no
criterion asking for one stop, and the published patterns have no pagination pattern; what applies is 2.4.1 Bypass
Blocks, which the `<nav>` landmark meets. No opt-in single stop is built.

**Each page control is keyed by its page, not its place in the row** (`PaginatorUtils.getEntryKey`). Keyed by place,
Enter on "5" left focus on the same slot, which the redrawn row filled with "6" — a second Enter went to page 6 —
or, when the row grew shorter, on a removed control, dropping focus to the page. Keyed by page, the control pressed
is the same element after the redraw and keeps focus. Solid's row is a `<For>` over the keys, since the entries are
rebuilt on each change and `<For>` keys by reference.

### `Paginator` is a root and pieces, with the ready-made row on top

Built from the plan `backlog.md` carried for it, to give a page a layout the single component could not draw —
first, previous, a "3 of 20" label, next, last — and to count items rather than pages. A label sits wherever a page
wants it, which no slot inside one component can promise, so the paginator became pieces a page arranges itself, as
Ark UI's does.

**`PaginatorRoot` owns the numbers, the landmark and the layout; `PaginatorSteps` and `PaginatorPages` own their
rows.** The root takes `itemCount`, `pageSize` (defaulting to Ant Design's and Ark UI's), `page`, `onPageChange`,
`ariaLabel`, `isDisabled`, `computeLayout` and `computeEffect`, draws the one `<nav>` and nothing else — it has no
row style, because what sits inside it is the page's arrangement. The steps piece draws first and previous, its
`children`, then next and last; the pages piece draws the number row and alone works out the clusters and gaps.
`Paginator` is a wrapper with no logic, rendering the root around the steps with the pages in the slot, so its row
is unchanged. The step, page and gap controls are three internal building blocks shared by the pieces, never pieces
a page composes. `pageCount` is gone from every prop: it is `PaginatorUtils.computePageCount(itemCount, pageSize)`,
and `computeItemRange` hands back the first and last item on a page for a "showing 21 to 40 of 383" summary. "Jump
to page" and the "X of Y" label are the page's own, written against the same page signal.

**`computeHref` and `linkComponent` live on the root; `gap` on each piece.** The user's call, over putting all three
on the root or all three on each piece. Whether the controls are links or buttons is a decision about the whole
paginator, so the arrows and the numbers can never disagree about it; spacing belongs to a row, and only the pieces
have rows, so a composed "‹ 3 of 20 ›" can be spaced apart from a number row inside it. The wrapper passes its one
`gap` to both.

**A piece outside a `PaginatorRoot` warns and draws nothing.** The user's call, following `Table`'s header
builtins rather than `Radio`. An orphan radio is still a meaningful thing to draw — an unchecked button that the
group would have wired — but a step or a page number with no count behind it has nothing honest to show: every
arrow disabled and an empty row, which is drawing nothing with extra steps.

**Every control registers with the root, and the root orders them by document position.** Children arrive as
finished output in all four frameworks and cannot be taken apart, so registration is the only route; the layout
asks for as many places as there are controls and each takes the one at its own position in the document,
whichever piece it belongs to. **A control registers the moment it is made and asks the root to sort again once
it is in the document.** Both halves are forced. A detached element has no document position, so a control the
pages piece adds as the current page nears an end cannot be sorted until it is inserted, and
`PaginatorUtils.orderEntries` keeps the registration order while any element is missing or detached. Registering
only once mounted was tried and failed: under a layout a control then learned its place after it was already in
the page, and moving its element into the placed box threw. Registering at once means the place is known before
the first paint, and the sort on mount corrects it before anything is drawn.

**The ports keep the same two halves, each in its framework's terms.** React registers and asks for the re-sort
from a layout effect, which runs once the element is in the page and before it is painted; `register` and `reorder`
keep their identity, so the effect runs only when a control first appears and the re-sort cannot loop. Vue registers
in setup, re-sorts in `onMounted`, and removes the entry in `onScopeDispose`. **Svelte's root keeps its list in a
plain array and copies it into state on each change**, because a component being torn down reads state as it stood
before the current update: when one control was destroyed and others created in the same update, the destroyed
one's unregister filtered the old list and dropped the newcomers, and the dial drew four blank wedges after paging
forward. `RadioGroup` and `CheckboxGroup` unregister by filtering state the same way in Svelte and do not have the
fault, checked by swapping one option for another in a single update: their members register from an `$effect`,
which runs after the outgoing member's teardown rather than before it, so the teardown never filters a list that
already holds the newcomer. A paginator control registers the moment it is made, which is what put the newcomer
ahead of the teardown.

**With no items, every step is disabled.** `computeStepState` says so outright rather than relying on the target
happening to equal the page, so an empty list behaves the same whatever page the consumer is holding.

**WCAG, checked.** 2.4.3 Focus Order (A), "focusable components receive focus in an order that preserves meaning
and operability": a layout places controls in document order, which is the tab order, across every piece in the
arrangement. The Playground's go-to-page field is a `Label` around a visible "Go to page" caption with no
`aria-label`, so 3.3.2 Labels or Instructions (A), "labels or instructions are provided when content requires user
input", is met and 2.5.3 Label in Name (A) holds, the name being the visible text.
