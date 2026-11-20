# Decisions: `Table`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Table`, a grid rather than a table, and why the markup could not be `<table>`

Built at the user's request, off the `backlog.md` entry that had put it last. That entry named the scope and
the build kept to it exactly: **sorting, selection, column sizing, sticky headers and virtualization**, plus
the keyboard and ARIA layer without which none of the five is conformant. Nothing outside that list was
added — see the gaps at the foot of this entry.

**The five features are what a `Table` component is _for_, and the argument is worth stating once.** A
`<table>` gives the semantics free: the row and column relationships are in the elements, so a reader
announces "column 3 of 7, Price, row 12" without being told. It gives no behavior, and its layout is
auto-computed, which resizing and pinning fight. A `display: grid` of divs is the mirror image: total layout
control, and no semantics at all — `role="table"`, `role="row"`, `role="columnheader"`, `aria-rowcount` and
`aria-colindex` all have to be written by hand and kept correct as rows come and go. **The component is the
thing that reconciles the two**, and that reconciliation, not any single feature, is the work.

**Divs won, because virtualization decides it.** A virtualized row is absolutely positioned inside a sizer of
the total height, and a `<tr>` cannot be. Two consequences follow and both are load-bearing. The row element
is _itself_ the positioned element — no wrapper between `rowgroup` and `row`, because `role="row"` must be a
child of `role="rowgroup"` and a positioned div in between would break the tree. And every index a reader
would otherwise count is published instead: `aria-rowcount` on the grid, `aria-rowindex` on each row,
`aria-colcount` and `aria-colindex` on each cell. **Fifty thousand rows with thirty in the document is the
case those attributes exist for**, and it is why they are not optional here the way they are in a small table.

**Column widths are one CSS variable and one grid template.** `TableUtils.getColumnTemplate` builds a
`grid-template-columns` string from the columns and the stored widths; the root carries it as a variable
through `assignInlineVars`, and the header row and every body row read it. So header and body cannot drift
apart — they are laid out by the same string — and a resize is one signal write rather than a sweep of cells.
A column with a stored or declared width is a fixed `px` track; one without is `minmax(min, 1fr)` or
`minmax(min, max)`. **The root sets no `overflow` of its own**, deliberately: a non-visible overflow on one
axis forces the other, so `overflow-x` on the root would make the root the scroll parent and take both the
sticky header and the `Virtualizer`'s scroll element away from the consumer's own scrolling box.

**The header is a sticky rowgroup, which is why the consumer's box has to be the thing that scrolls.** Sticky
resolves against the nearest scrolling ancestor, and `VirtualizerUtils.createScrollParent` walks up looking for the
same element, so both land on the consumer's container and stay in step. A consumer wanting horizontal scroll
puts it on that same box; scrolling both ways in one element is the arrangement everything here is built for.

**One tab stop for the whole grid, and the header row is row zero of the walk.** This is what separates a grid
from a list of focusable cells: sixty cells in the tab order would take sixty presses of Tab to pass. The
roving cell is a `{ x, y }` signal, clamped against the current column and row counts by a memo rather than
written back — so a table whose rows shrink under it still has exactly one tabbable cell and never traps a
reader outside the grid. `NavigatorUtils.computeNextCell` already carried the arithmetic, including the carry
at a row's end and the page keys, so no second implementation was written.

**Putting the header in the walk is what makes sorting reachable without a mouse.** The `columnheader` is
itself the control — `aria-sort` on the cell, Enter or Space to cycle it — rather than a `<button>` inside the
cell, because a button inside would be a second tab stop in a pattern whose whole point is having one. This is
the ARIA data-grid arrangement rather than the sortable-table one, and the two differ precisely on that.

**Sorting cycles ascending, descending, then off.** Three states rather than two: without the third, the order
the rows arrived in is unreachable once anything has been sorted, and that order is often the meaningful one.
`TableUtils.getNextSort` is pure and tested.

**Whether the table sorts is decided by the comparator, not by a mode prop.** A column with `compare` is
sorted by the component; a column marked `isSortable` without one has its sort _reported_ through
`sort` and `onSortChange` and its rows left alone, which is the server-side case. The alternative —
an `isServerSorted` switch — puts the same fact in two places and lets them disagree. `getSortedRows` returns
**the very same array** when there is nothing to do, so an unsorted table hands no new reference downstream.

**Selection lives on the row and is painted by the cells.** `aria-selected` goes on `role="row"`, because a
row is the thing being picked; the cells only show it, which is why `isSelected` is on the cell flags. Space
toggles the focused row, Shift with an arrow extends from the anchor, Ctrl or Cmd with a click toggles one,
Shift with a click extends, and Ctrl-A takes everything. The anchor is a plain `let` rather than a signal —
nothing paints from it.

**One component for both selection modes, where `Select` and `MultiSelect` are two.** The split there exists
because the _trigger_ paints differently — one option against a row of chips — so `renderContent` has a
different signature in each. A table row's paint does not change with the mode; only which rows carry
`aria-selected` changes. So `selectionMode` is a prop, defaulting to `"multiple"` when a `selection` is
given and `"none"` when it is not — the presence of the signal is what turns selection on, so a consumer
cannot hand over a selection and silently get nothing.

**Resizing is pointer-dragged on a handle and keyboard-driven from the cell, and the handle is
`aria-hidden`.** A focusable handle would be the second tab stop the pattern cannot have, so the handle is a
pointer affordance and `Ctrl` with the left and right arrows on the focused header cell is its keyboard
equal — 2.1.1 is met without the tab order growing by one per column. The handle takes no paint of its own:
`renderResizer` hands it to the consumer, the way `SplitPane` hands over its gutter. Widths are clamped to the
column's own `minWidthPx` / `maxWidthPx` by `TableUtils.getResizedWidth`, and a drag that starts on a column
with no stored width reads the header cell's `offsetWidth` as its starting point.

**`InteractionWrapper` is not used, and this is the one control where that is right.** Its root is a real
element, and inside a row laid out by `grid-template-columns` the grid item has to be the `gridcell` itself —
a wrapper would become the item and the template would place the wrappers instead of the cells. The flags a
painter needs are computed directly instead: hover is tracked per row and per header column, focus comes from
the roving cell, and selection comes from the signal.

**A click inside a cell that lands on a control does not select the row.** The handler asks whether the click
target has an interactive ancestor within the cell — anchors, buttons, form fields and the ARIA roles that
stand for them — and stands down if so. Not a heuristic about what the consumer probably meant: it is the
same test the platform uses to decide what a click is for.

**Disabled is `aria-disabled` on the grid, and nothing else changes.** Cells keep their roles, their indices
and their tab stop, so the table still reads; sorting, selection and resizing all return early. Same mechanism
as everywhere else here.

**What was deliberately left out.** No grouping or aggregate rows, and no `F2`-style interaction mode for a cell
whose contents are focusable — the one with an accessibility cost: a cell containing several controls can be
reached, but there is no defined key that steps _into_ it; controls inside an open detail row sit in the normal
tab order, outside the grid's management, for the same reason. Pinned columns and expandable rows were left out at
first and later built, below; filtering and editing in place are the consumer's, below.

**The one gap inside the built scope is the resizer's discoverability, and the user chose to keep it.** The
handle is `aria-hidden`, so nothing announces that a column can be resized; a reader who does not already know
to try `Ctrl` with an arrow on a header cell will not find it. Two ways out were put to them and both were
declined: injecting a word like "resizable" into the header's accessible name, which the library cannot do
without writing into content the consumer paints, and React Aria's visually-hidden slider, which buys the
announcement at the price of one extra tab stop per resizable column — the exact cost the single-tab-stop grid
exists to avoid. **Their call was to leave it**, on the grounds that 2.1.1 is met and the tab order stays one
stop. It is recorded in `backlog.md` under _"Accepted limits"_ so it is not rediscovered as an oversight.

### `Table` pinned columns

The user widened the scope to take them. A column is `{ pin: "start" | "end"; widthPx: number }` or unpinned, a union,
so a pinned column without a set width fails to compile — the offsets are the sum of the pinned widths before it, and
a pin on an unsized column would silently do nothing. Pinned columns gather at their edge whatever `order` says and
reorder only among their own kind, by drag, carry or Shift+arrow; they stick by `inset-inline-*`, so right-to-left
holds, and follow resizing. **The table is held at least as wide as its columns** (`computeMinTableWidth`: every set
width plus every other column's minimum), on every table, since without it a pinned column stops sticking after one
screen of scroll. **The root isolates its stacking**, the sticky header sits at 2 and pinned body cells at 1, so they
pass under it; the header's `z-index` used to escape. Render props carry `pin` for the painter's opaque base and edge.

### `Table` expandable rows

The user widened the scope to take them. `renderDetail` turns them on; `expanded` is the usual optional two-way list
of row values; `computeIsExpandable` and `onExpandedChange` sit beside them. **The table becomes a `treegrid`**: ARIA
1.2's row role says "authors MUST NOT apply aria-expanded … to a row that descends from a table or grid", and a
cell's `aria-expanded` "is not a proxy for the container row". Rows carry `aria-level=1` and `aria-expanded` where
they can open; details are `aria-level=2`, one cell spanning every column. **Keys follow the APG treegrid's cell-only
focus**: Enter on the first on-screen cell of a row that can open toggles it (and no longer runs `onRowActivate`
there), Enter elsewhere activates; the arrows keep walking cells, Down into and out of an open detail; on a detail,
Left, Right, Home and End do nothing in the grid ("If focus is on the right-most cell in a row, focus does not move")
and are left to the browser, and keys pressed on something inside a detail are the content's. A detail is not
selectable. **Focus is held by row**, so opening a detail above it moves nothing, and a detail closed from outside
while holding focus hands it back to its row (2.4.3). **`TableRowExpander`** is a builtin the consumer places in any
cell, as `TableHeaderSort` is; it takes no tab stop, focuses its own cell before acting, draws nothing in a row that
cannot open, and its doc asks for a 24px target (2.5.8); a table whose rows never render one warns once. Under
windowing, details are entries of their own, guessed at their row's height until measured.

**Per framework, for expandable rows.** A context can only be handed down by a component in Vue and Svelte, so each
body cell is a small private component there (`TableBodyCell` in Vue, `TableCell.svelte`), the counterpart of
`TableHeaderCell`, and it is how `TableRowExpander` finds its row. The missing-expander warning is checked as each row
mounts in Solid, after the table renders in React and Vue, and from an attachment in `untrack` in Svelte — at most once
per table everywhere. Vue's `renderDetail` is a slot taking `{ row, renderProps }`, and expandability keys on the slot
being present, which Vue does not track after the first render. React keys window slots `row-N` / `detail-N` so a slot
turning from a row into a detail is rebuilt, as Solid's keyed entries are. Svelte's `expanded` is a `$bindable` with no
fallback, read through `createHeldValue` like `selection`, so rows still match by identity.

### `Table` leaves filtering and in-place editing to the consumer

The user's calls. **Filtering**: sorting is the component's and filtering is not, so a consumer narrows the rows
before handing them over — the split `Select` makes with its query. **Editing in place**: "It's a table, not a
spreadsheet." A cell's content is the consumer's paint, and a piece of text that turns into a field when clicked is
already something a consumer builds without the grid's help; the grid has no editing state and no key that starts
one. Neither is a gap. A cell holding two controls is a separate matter — the keyboard reaching inside a cell — and
stays open in `backlog.md`.

### `Table` columns reorder, and the carry engine became `Abstracts/Carrier` to do it

**The engine was already separate from `Sortable`'s paint, so the work was a move rather than an
extraction.** `SortableStack` and the three drop-index functions knew nothing about JSX,
`InteractionWrapper` or items; `SortableZone` was a plain interface of getters and three mutators. They now
live in `Abstracts/Carrier` as `Carrier`, `Carrier` and `CarrierZone`, beside `Dismisser`,
which is the same shape of thing — a module-level registry many components sign up to. The names changed
with the move because `Sortable*` inside an abstract that `Table` also uses reads as the component's
private property, and there is no precedent here for an abstract sharing a name with a control.
`Sortable` keeps its own public types; `SortableDir` is an alias of `CarryDir`.

**One thing genuinely was extracted: `CarrierUtils.dragFromPointer`.** The press-move-release loop that
waits four pixels before deciding a press is a drag, captures the pointer and feeds `aimAtPoint` was inline
in `Sortable` and `Table`'s header needed exactly it. `GestureUtils` in `ss-utils` was checked first and
covers swipes only — progress, direction, offset — so this is not a re-implementation of something that
already existed.

**The keyboard did not extract, and that is the design rather than a shortfall.** `Sortable`'s keys assume
every item is focusable and that `Tab` walks between lists. A grid is one tab stop, so `Table` drives the
stack from its own header handler. It also means the two controls answer the same question differently and
both are right: `Sortable` enters a carry mode, `Table` moves directly.

**`Shift` with an arrow, because the header cell's other two keys were taken.** Enter and Space cycle the
sort and `Ctrl` with the arrows resizes, both already on that cell. `Shift` with an arrow moves the focused
column one place immediately — no mode to enter or leave — which mirrors the resize idiom rather than
`Sortable`'s pick-up-and-place one. Focus follows the column, since the cell id is positional. **The move
announces itself through `LiveAnnouncer`**: order is what a reader navigates by, so moving a column silently
would be a worse omission than resizing one silently.

**Escape puts a picked-up column back, and it is heard on the document.** A carry that began in the table, by a
tap on a grip or by a drag, is canceled by Escape: the column returns and the zone's `computeReturned` announces
it, as every other carrier's cancel is announced. `TableUtils.observeCarryCancel` listens on the document, and
only while the table is the carry's source, because a drag leaves focus wherever the press found it and the grid
has one tab stop and no item of its own to hear the key on. `Sortable`, `SortableGrid` and `PatchBoard` take
Escape on their focused items instead and leave a drag to the pointer.

**Reordering turns on when an `order` is handed over, and a column opts in with `isReorderable`.**
Same presence-turns-it-on rule as `selection`, so a consumer cannot hand over an order and silently
get nothing. The signal holds column ids rather than indices, which is what lets it survive a change to the
column list — `TableUtils.getColumnOrder` ranks the declared columns by that list and leaves any column the
order does not name in its declared place, after the ones it does.

**The drop marker is painted inside a header cell, not positioned by measurement.** `Sortable` computes a
marker offset from item rects and has to divide out the `Viewport` scale to do it — the failure that
`conventions.md` records under measured rects and written offsets. A grid cell _is_ the grid item, so the
boundary the marker wants is that cell's own leading edge: the marker renders inside the cell at the
landing index, and inside the last cell for the place past the end. No rects, no scale, no chance of the
two spaces disagreeing.

**Both index spaces are now published, which is what the naming rule in `conventions.md` demanded.** A
column can sit somewhere other than where it was declared and a row somewhere other than where it arrived,
so the render props carry `dataCol`, `layoutCol`, `dataRow` and `layoutRow`. Making that honest meant
`getSortedRows` becoming `getSortedOrder`, which sorts an array of indices so the original position survives
the sort; `getReordered` then reads either list through either order and hands back **the very same array**
when there is no order to apply, which is the property the old function had and had to keep. The roving cell
is an `Index2d` from `ss-utils` rather than an `x` / `y` pair, and `NavigatorUtils.computeNextCell` is adapted
at the one call site rather than changed, since other controls read it.

### `Table`, and why a header cell stopped being a target

Settled by the user, on 2.5.7 Dragging Movements. Resizing was press-capture-move and reordering was a drag,
with no single-pointer route to either.

**Resize is unambiguous and needed no new target**: the resizer is already its own element, so a press there
that ends without a drag steps the width by `resizeStepPx` toward the half of the handle pressed.

**Reorder and sort were the collision.** The reorder drag started on the whole header cell and a click on the
whole header cell sorted, so a tap could not mean both. `Sortable` gets away with tapping the whole item only
because a sortable item has no competing click.

**The user's call was that both get their own target and the header stops being one** — over the reviewer's
suggestion of a single reorder grip. Their argument: two render slots are not dead weight, because a consumer
wants to paint a sortable indicator with its direction and a reorder affordance anyway, so the slots are where
those already belong.

**It improves the 2.5.8 position rather than worsening it.** Target Size (Minimum) is also Level AA and wants a
24 CSS pixel circle centered on each undersized target to clear the others. The resizer is 8px wide and sat
inside a clickable header, so **2.5.8 failed before this**. Taking the header out of the target set is what
makes the resizer defensible. The three targets now sharing a cell are a spacing constraint the consumer owns,
documented on the builtins.

**The keyboard stays on the cell.** Both new controls are `tabindex="-1"` and `aria-hidden`, so they are
pointer affordances and nothing else — one tab stop per cell, which is what the grid pattern wants, and all
2.5.7 asks for. Enter and Space on the header still sort.

**They focus their own cell before acting**, which the decision did not anticipate: each stops propagation so
the cell's own click never runs, and without the explicit focus a press left the grid with focus nowhere and
the next key press went nowhere.

**The two controls are builtins the consumer places, not slots the library places.** The user's design. The
first build rendered both as library `<button>`s after the header content, each with a `renderSortControl` or
`renderReorderGrip` painter, which left their placement to a consumer who had no way to reach it: the buttons
stacked under the title and doubled the header's height in every Playground example. Pinning them from the
library fixed the look and took the placement away instead. So they became `TableHeaderSort` and
`TableHeaderReorder`, components the consumer puts inside `renderHeader` wherever they belong, each taking a
`renderContent` painter. The builtin owns every rule the old buttons carried — keeping its press from starting
the header's drag, focusing its cell first, `tabindex="-1"` and `aria-hidden` — so placing one is all the
consumer does. It finds its column through a context the header cell provides, and renders nothing in a column
that is not sortable or reorderable, so one header renderer serves every column. The resizer stays the library's:
it is a drag surface measured against the column, and where it sits is not a matter of taste.

**No raw `sort()` or `pickUp()` is exported.** `sort` and `order` are already the programmatic route,
so a custom trigger — a menu item that sorts — writes the signal, and nothing that skips the rules is left
around to be used by mistake.

**A missing builtin is warned about**, per _"An accessibility mistake the library can detect is warned about"_ in
`conventions.md`. Each builtin registers with its cell as it is created, and the cell checks on mount: a sortable
column with no `TableHeaderSort` can only be sorted with Enter, and a reorderable column with no
`TableHeaderReorder` can only be reordered by dragging, which fails 2.5.7. Both warnings name the column. A
builtin rendered outside a header cell warns and renders nothing, as an orphan `Radio` does.

**The guarantee this gave up**: under the slots, a consumer who painted nothing still had a working, invisible
target, so sorting could not die silently. With builtins, a consumer who renders none gets no pointer route, and
the warning is what stands in for the guarantee.

### `Table`'s Docs page: ten examples into Basic and seven sections

Selection is one prop with a list of values, so "One row at a time" became Basic's Selection knob over
`TABLE_SELECTION_MODES` (exported from the core for it), starting on `multiple`; Disabled is Basic's other knob, last.
Resizable, reorderable, right to left, sorted by the page, many rows, pinned and expandable are a section each, in the
old page's order — right to left after reordering, since its example relies on both. "Many rows" keeps a Row count
knob under Select's precedent (`TableKnobs`, starting at the old 50,000) through `createStressParts(count)`, and shows
no timing, since the old page had none. "Reorderable columns" carries a WCAG 2.5.7 alert asking for a
`TableHeaderReorder` in every movable header. No example has a readout: sort, selection, widths, order and open rows
all show on screen. The pinned example sits in a box of capped width (`tableFrameCapped`, composing `docsAccordion`),
so its columns overflow and the pinned ones visibly hold. In a reorderable header Category and In stock are wider
than elsewhere, by what the grip, sort marker, gaps and padding take around their titles, rounded up to the next ten. The closed row expander mirrors in right-to-left text (◂), read through
`NavigatorSolidUtils.createDirectionSignal` as Tree's arrow is.
