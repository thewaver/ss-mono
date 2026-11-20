# Decisions: `Tabs`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Tabs` as records, and the shape a data-driven group has to take

Settled, as the rehearsal for `Select`. `Tabs` predated the control model and was the last
component contradicting it: it hand-rolled its `<button>` / `<a>` and set native `disabled`. It is now
`InteractionWrapper` per item plus an unexported `TabsItem` leaf, in the `Button` shape.

**Parallel arrays became one array of records.** `getTabCount` + `getHrefs` + `computeIsDisabled` were
three sources indexed against each other; now `getTabs: Accessor<Tab<T>[]>` with
`Tab<T> = { value, href?, isDisabled? }`. This answers the objection recorded under `RadioGroup` — that
data-driven groups "grow a `compute*` prop per capability and re-expose all of them per index". True of
_indexed callbacks_, not of data: a capability is a field, and adding one costs nothing at the call site.
The earlier entry rules out the callback form only.

**Identity is the value, never the position.** `getSelectedIndex` / `onSelectionChange(index)` became
`getSelectedValue` / `onSelectionChange(value)`. An index is stable only while the list is, and a filtered
or searchable group changes exactly that. Everything internal resolves through the value and treats the
index as a lookup result.

**`<Index>`, not `<For>`, and that is why `renderTab` takes an accessor.** Records are rebuilt on every
filter keystroke, so `<For>`'s by-reference keying would remount every row, losing focus and every ref.
`<Index>` keys by position and lets the record change under a stable node, so the painter must subscribe:
`renderTab(getTab, getFlags)`. The one place the choice of list primitive dictates a prop's shape.

**Refs replace `querySelectorAll`.** The old `:scope > a, :scope > button` walk could not survive the
wrapper, option groups or a painter rendering a `Button`. Each slot reports its control element through
`InteractionWrapper`'s `ref`, so the element list is keyed by the same index as the data. Registration in
the `RadioGroup` sense is unnecessary: the group already owns the array.

**Selection stays one-way, and this is where `Tabs` and `RadioGroup` legitimately differ.** `RadioGroup`
takes `value` because it owns its value; a `Tabs` with `hrefs` does not — selection is derived from
the route, the case _"Signal tuples for two-way state"_ in `conventions.md` records as the shape's cost. `getSelectedValue`
plus `onSelectionChange` keeps the router as owner.

**The floater measures the wrapper, not the control.** `interactionRoot` is `position: relative`, so
wrapping each item reparented the control's `offsetParent` and `offsetTop` / `offsetLeft` reported `0`.
The observer hops one level to `control.offsetParent`, which is exact: the wrapper's box equals the painted
box by construction, and `offset*` is unaffected by `Viewport`'s `transform: scale()`.

**`tooltipDefs` is not on the record yet, for a real hazard rather than YAGNI.** `InteractionWrapper`
branches on prop _presence_, so a record field would be forwarded conditionally and a tab gaining or
losing a tooltip mid-life under `<Index>` reuse would not pick it up. Solid's props getters do make the
conditional reactive, so it can be made to work; it is left out because `Tabs` has no use for it and
untested API is worse than absent API. `Select` will want it.

**A consumer selecting on `:disabled` breaks when a control stops lying about it.** The Playground's
`tabCategory` reset the cursor through `:disabled &` and silently stopped applying; it became
`[aria-disabled='true'] &`. The visible tail of the mechanism decision: consumer stylesheets written
against native disabled do not fail loudly.

**Verified by headless dump**: `role="tablist"`, one `tabindex="0"` across the list with the rest at `-1`,
`aria-selected` on the right item, a floater at a real offset — also the proof that the `offsetParent` hop
resolves and that `ref` forwards through the router's `A`. The disabled-tab half of that proof now lives
on `TabsPage`, since the category item it used no longer exists.

**The list names itself and states its axis.** Added, when `TabsPage` put five tab lists on
one page. `getAriaLabel` lands on the `role="tablist"` element, `RadioGroup`'s arrangement for the same
problem. `aria-orientation="vertical"` is set whenever `dir` is `column`: a tab list is horizontal by
default, so a stacked one that does not say so tells a screen reader user to press the wrong arrows. Not a
general rule about `dir` — it is stated here because `tablist` has a published default a column
contradicts.

**Arrows move the focus and `hasAutoActivation` makes them move the selection too, off by default.** The
published pattern allows both, and calls the second one automatic activation. Manual stays the default
because the cost of guessing wrong is asymmetric: a panel that fetches or builds something expensive is
built once per tab arrowed _past_ under automatic, and the person walking a list to reach the far end pays
for every stop on the way. Automatic is the better behavior for a panel already in the document, which is
why it is a prop rather than a rejection — and it is one flag rather than a mode string, because there are
exactly two behaviors and no third one is coming.

**The flag rides on the same key handler and changes nothing else.** The arrow already sets the focused
value and moves focus; automatic activation reports that value through `onSelectionChange` afterwards, so
selection still travels the one road, and a consumer who ignores the callback still gets the focus walk.
Nothing new is announced, because the selection change is what a screen reader is already told about.

### `Tabs` warns about a tab nobody wired to a panel

`TabsUtils.warnIfUnpaired` prints one warning naming the tabs that lack `id` or `panelId`, once at setup, by the house
rule that an accessibility mistake the library can detect is warned about. **A tab with an `href` is not counted**: its
panel may be a routed page mounted elsewhere, and `tabs.spec.ts` pins that the link examples write no `aria-controls`.
A disabled tab still counts, since it needs its panel the moment it is enabled. The Playground examples that warned
were wired with real panels rather than excused.

### `TabPanel`: the pairing is written on the record, and read from both ends

A tab must name the panel it opens and the panel must name the tab back, and the
two elements have different owners — the library owns the tab, the consumer owns the panel — so neither
can complete the link alone.

**Both ids are fields on the record, and neither is generated.** `Tab<T>` gains `id` and `panelId`;
`Tabs` writes them as the tab's `id` and its `aria-controls`, and writes nothing when absent. Radix and
React Aria generate the tab's id privately, which they can only do because their panels are enclosed by
their root. Here a panel may be a page the router mounts elsewhere — the Playground's left menu is that —
so a generated id would have no route to the element that must quote it.

**`TabPanel` is the other end, a wrapper in the `Label` sense**: `getId` and `getTabId` become the panel's
id, `role="tabpanel"` and an `aria-labelledby`. Two strings rather than the record, since two strings are
all it reads. It holds no state and does not decide whether it is mounted. `tabindex="0"` is
unconditional, matching Radix, because a panel of plain prose offers a reader arriving from the tab list
nothing else to land on, and testing for focusable descendants would mean measuring consumer content on
every render.

**It carries no class**, so a consumer's flex or grid child would become this element rather than their own
box. Copy the Playground: `PageTabPanel` holds the `TabPanel` and puts `PageTabPanelContent` inside it, so the
library element is absorbed by the page component and layout stays outside both.

**Driven by `tabs.spec.ts` against `TabsPage`, not the Playground's left menu.** The menu is app
furniture — adding a page or renaming a category used to break the keyboard spec and read as a `Tabs`
regression, which happened once. The page carries a row, a column, links, a consumer link component and an
all-disabled list.

### `Tabs`, `Accordion`, `Toolbar`, `Breadcrumbs`, `Stepper`: a disabled item can be kept reachable

**Each item type takes `isReachableWhenDisabled`**, following the WAI-ARIA Authoring Practices on the focusability
of disabled controls. A reachable disabled item stays in the arrow walk (or the tab order, where there is no walk),
takes focus with its ring, announces `aria-disabled`, and still refuses activation. `Tabs` with `hasAutoActivation`
does not select a disabled tab the arrows land on. The default is still to skip, so nothing changes for an item
that does not set it.

**The tooltip stopped being a condition, on the user's call.** `Menu`, `Select`, `Tree` and `Sortable` items used
to stay reachable only when they also had a tooltip, on the argument that a reachable disabled item should be able
to explain itself. The five new item types have no tooltip slot, so the same prop would have meant two things. One
rule now: the flag keeps the item reachable, full stop. The published guidance asks that disabled items be
discoverable, not explained, and a reader hearing the name and "disabled" is better served than one who never
learns the item exists. The tooltip is welcome where an item has one, and the wrapper's warning that the flag did
nothing without one is gone. `isFocusableWhenDisabled` remains as a component's own insistence for an item its
container walks (`Calendar`, `Clock`, `TileBoard`, `PatchBoard`), and now means the same thing from the inside.
With the condition gone, `Toolbar`'s overflow menu carries the flag into the `Menu` it builds, so an action stays
reachable whether it is in the row or has been collapsed.
