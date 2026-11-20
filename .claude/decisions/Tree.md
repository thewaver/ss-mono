# Decisions: `Tree`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### Controls: `Tree`, and the group box that could not be a child

`Tree` is `role="tree"` with expand and collapse, one selected value, and a keyboard
where the two axes mean different things. Most of it is `Select`'s model applied a second time; the parts that
are not are here.

**A node is one record with optional children, and a branch is a node that has at least one — or one that
says it will.** `TreeNode<T>` carries `value`, `children`, and the same `isDisabled` /
`isReachableWhenDisabled` / `tooltipDefs` trio every other item record carries. `TreeUtils.getIsBranch` was
`(node.children?.length ?? 0) > 0`, `Menu`'s test for a submenu character for character; it is now that **or**
`hasMoreChildren`. See the next section for why the second field turned out not to be the contradiction this
entry once predicted.

**Render from the nesting, walk the flat order.** `TreeUtils.getVisibleRows` takes the nodes and a predicate
and returns a rendering tree with collapsed branches already removed; `getFlatRows` collapses that into walking
order. Same split as `SelectUtils.getFlatOptions`, for the same reason: the arrows, the edge keys and the
roving tab stop index into the flat list and never learn that nesting happened. Each row carries its own flat
`index`, so the two views agree without anything being kept in step.

**The `role="group"` box is a sibling of the branch's row, not its child, and that is forced rather than
preferred.** The published markup puts the group inside the `treeitem` it belongs to. Here every row is an
`InteractionWrapper`, which listens for `mouseenter`, `mousedown` and `keydown` on the element it was handed —
all three of which reach an ancestor. A row nested inside another row would report its ancestor as hovered
while the pointer was over the child, and as pressed while the child was being clicked. Fixing that means
teaching `wrapElement` that a descendant's hover is not its own, which is false for every other control, where
the descendants are the painter's own markup.

So the groups nest but the rows do not. Depth still computes correctly from the markup — one group per level —
and `aria-level`, `aria-posinset` and `aria-setsize` are written on every row as well, which the published
pattern asks for whenever the DOM is not the whole hierarchy. The one thing given up is the formal ownership of
a group by the `treeitem` above it; `aria-owns` would restore it on paper and was rejected for the reason
recorded under the presentational wrapper.

**A roving tab stop, not `aria-activedescendant`, because there is no second element to put it on.** `Select`
can name its highlighted option from the combobox because the combobox is a separate, always-present element
holding real focus. A tree has only its rows, so the focused row is the focused element and the tab order has
to be roving — `Tabs`' arrangement, down to the roving position falling back to the selection and then to the
first navigable row.

**Focus moves by id rather than through a ref array, because a tree's indexes move under it.** `Tabs` and
`Accordion` keep an array of refs indexed by position, which works because their lists are flat and fixed.
Expanding a branch renumbers every row below it while the elements stay put, and a `ref` callback does not run
again to say so — so an array keyed by index would silently point at the wrong rows. Each row carries
`${treeId}-node-${index}` as its id and moving focus is a `getElementById`. The same id tells the key handler
which row is focused, which is how a click and an arrow key end up on the same footing.

**The focus rescue on a collapse is a guard over the visible rows, not a step inside `collapse`.** Corrected
. It began as a check inside `collapse` — is focus on a descendant, and if so move it to the
branch — and that check could never be true: `ArrowLeft` and a click both act on the branch, which is already
focused and stays mounted. The case it was written for is a **consumer** writing `expanded` themselves,
the only way a focused row can vanish, and which never enters `collapse`. So the guard watches the visible
rows: it remembers the last row focused inside this tree from a `focusin` on the root, and when a collapse
leaves that row out of the visible set **and** focus has fallen to the document body, it moves focus to the
branch that closed.

All three conditions carry weight. Without the remembered row, a tree nobody has touched would steal focus
whenever a consumer collapsed anything. Without checking that the row actually left, a collapse elsewhere in
the tree would do the same. And without focus genuinely sitting on the body, the guard would fight a consumer
who moved focus on purpose — which is why a button that collapses on the spot cannot exercise it: the button
holds focus, so there is nothing to rescue.

**One press both selects and toggles, because the library paints no twisty.** A consumer draws the branch
marker inside `renderNode`, so the component cannot tell a press on the marker from a press on the label — and
if a press did not toggle, a mouse user could not open a branch at all. `Enter` and `Space` do exactly what a
click does. A consumer wanting "the chevron opens, the label selects" has no route to it; see `backlog.md`.

**A disabled node is not a disabled subtree.** The arrows skip it and nothing selects or opens it, but its
children stay navigable if it was already open. A disabled branch is a statement about that node; a consumer
who means the whole subtree disables the nodes in it.

**A collapsed branch's children are not built**, the opposite of `Accordion`, because nothing needs measuring:
an accordion panel animates to a height it can only learn by building the content, while a tree's rows just
appear.

**Not windowed, and it is the same boundary a grouped `Select` hits.** A window opening halfway down a subtree
would have to draw a `role="group"` whose start is above the window and whose end is below it. The flat walking
order is exactly what a windower wants and the row records already carry it, so the missing half is the markup
rather than the arithmetic.

**The walk wraps, as every other list in this library does.** The published tree pattern stops at the ends.
Wrapping is what `Select`, `Menu`, `Tabs` and `RadioGroup` all do through `computeNextPosition`, and a tree
that stopped would be the one list here behaving differently — consistency inside the library won over the
published behavior, recorded here rather than being discoverable only by pressing `ArrowUp` on the first row.

### `Tree`: the arrow opens, the name selects

One press on a folder used to both select it and open it, because the arrow is the consumer's paint and the tree
could not tell a press on it from a press on the name. The user chose, over a press handler for a tick box and over a
library-drawn arrow slot (which would break the rule that a component draws no controls), to hand the painter a
`setExpanderRef` as `renderNode`'s third argument: a press inside that element opens or closes the folder and does
nothing else, a press elsewhere selects. **With no expander registered, a press does both, exactly as before**, so no
consumer's behavior changes until they opt in — and the library cannot tell an unwired arrow from a tree with none, so
there is nothing to warn about. The element is held per row, not keyed by value, which is what keeps it right under
`<Index>`. How each framework holds it:

- Solid: a `let` inside the row's render, set by the callback.
- React: the same `let` inside `renderRow`. The callback is a new function each render, so React re-attaches it on
  every commit; a consumer wrapping it in a `useCallback` that never re-runs would leave the row with no expander, and
  a press would select and toggle. Typed `(element: HTMLElement | null) => void` so it can be a `ref` as it is.
- Vue: a closure made fresh each time a row is drawn; Vue calls the old ref with `null` and the new one with the
  element on each update, and the press reads the latest render's closure. Typed like `setElementRef`, so it can be a
  template `:ref`.
- Svelte: `{@const expander = createExpanderHold()}` in the row snippet compiles to a derived value with no
  dependencies, built once per row; the painter attaches it with `{@attach setExpanderRef}`.

### `MultiTree` is a checkbox tree

The user chose a checkbox tree over a plain multi-select and over offering both: ticking a folder ticks everything
inside it, and a folder whose contents are partly ticked reads `"mixed"`, because the half-ticked folder is the reason
to put multi-select in a tree at all. So the state is `aria-checked`, the only one with a mixed value, and the tree is
`aria-multiselectable`. **It is a preset beside `Tree`, not a mode**, for the reason `MultiSelect` is: the value's type
changes, from one value to a list (`checked`). The arithmetic is `Abstracts/Selection`'s; `TreeUtils.createBranchDefs`
keys it by value and leaves disabled nodes out of every folder, so ticking a folder never changes one and it never counts
toward the folder's state.

**The keys are the published tree pattern's recommended multi-select model** — Space ticks, Shift with an arrow moves
and ticks, Shift with Space ticks a run from the last node ticked, Control with Shift and Home or End ticks to an end,
Control with A ticks everything (or clears it all when everything already is) — in `TreeUtils.computeMultiKeyAction`,
which runs before the ordinary handling. Enter keeps its pattern meaning, the node's own action: a folder opens or
closes, a leaf ticks. The selection marker is not drawn, since there is no one selected node.

### A branch whose children have not arrived: `hasMoreChildren`, and where the waiting is painted

The gap this closes was recorded as hard for two reasons, and only one of them survived contact.

**The field cannot contradict the children, because it can only add.** The objection on record was that the
fix would be "a second field whose only job is to contradict the first" — which is what `isBranch?: boolean`
would have been, since `isBranch: false` on a node with children is a state the component would have to pick a
winner for. `hasMoreChildren` is the other shape: `getIsBranch` is `children.length > 0 || hasMoreChildren`, so
setting it on a node that already has children changes nothing and there is no disagreement to resolve. The
name is `Select`'s — `getHasMoreOptions` says the same thing about a list, and this says it about a node's
children, so a consumer meeting the second has already met the first.

**Nothing new tells the consumer to fetch, and that is deliberate.** No `loadChildren` prop and no
`onExpandBranch`. Opening a branch writes its value into `expanded`, which is the **consumer's** signal —
they already see every expansion, so a callback would report a change they were handed anyway. Ark UI takes
`loadChildren` plus `onLoadChildrenComplete` and React Aria has a loading item, but both of those own the list;
here the nodes are a prop, so the arrival is a new `nodes` value and nothing else. The library reports and the
consumer decides, which is the same split `getHasMoreOptions` / `onReachEnd` took for `Select`.

**Where "loading" is painted was the half this was blocked on, and the answer is a render prop into the box the
library owns.** `renderPendingChildren` is called for a branch that is expanded and has no rows, and it is
given the branch's node and **the depth its children would have had** — without that second argument a consumer
cannot line the placeholder up with the rows it stands in for, since the indent is theirs to draw. It is
optional, and a tree that does not pass it renders no group box at all rather than an empty one.

**A branch reports `aria-busy`, not a fabricated child row.** `aria-busy` is global, so it is valid on a
`treeitem`, and it says exactly what is true: this element's contents are being updated. The alternative was a
placeholder row carrying `role="treeitem"`, React Aria's shape — rejected because a row that is not a node
would have to be given an `aria-posinset` and an `aria-setsize` it does not have, and would land in the
walking order the arrows and typeahead use. **The consequence to know:** a consumer who sets `hasMoreChildren`
and never delivers leaves a branch permanently busy. That is the consumer stating something untrue rather than
something for the library to time out.

**It works in a windowed tree, which took one extra placement rather than a second design.** A windowed tree
emits no `role="group"` boxes at all, so the placeholder is rendered inside the branch row's own positioned box
instead, after the row. The virtualizer measures each row rather than trusting the estimate, so a row that grows
by a placeholder is measured at its new height and the ones below it move down. `isPending` is on
`TreeNodeFlags` besides, so a painter can put a spinner on the twisty itself in either rendering.

### A windowed `Tree` is flat, and that is the opposite of a windowed `Select`

**`computeEstimatedNodeHeight` opts a tree into windowing**, over the flat walking order `TreeUtils.getFlatRows`
already produced for the keyboard. Both renderings share one `renderRow`, so a windowed tree and a mounted one
differ only in what wraps the rows.

**The windowed rendering emits no `role="group"` at all.** This is the reverse of the grouped `Select`
decision recorded above, and the difference is worth holding onto. A `Select` group box is a sibling of
nothing — it carries the group's name on `aria-label`, so a box around part of a group is still a correct,
named box. A tree's group box means something only as the child of the treeitem that owns it; a box for a
subtree whose parent is outside the window would be **detached** rather than partial, which is worse than
having none. The published pattern answers this case directly: when the nodes are not all in the DOM because
the reader is scrolling, every node states `aria-level`, `aria-posinset` and `aria-setsize`. Every treeitem
here already did, for the keyboard's sake, so windowing needed no new attribute.

**The roving row is pinned, and focus scrolls before it moves.** `focusRow` asks the window to bring the row
in before calling `focus`, and the roving row is in `getPinnedRows` so it stays mounted once reached —
otherwise arrowing to a row outside the window would call `focus` on an element that does not exist and
silently drop focus to the body.

### `Tree` nodes can be links, on `Tab<T>`'s terms

Added, at the user's request, after the left menu was weighed as a tree. A hierarchical menu is
the obvious use for a tree and the rows were `div`s: a consumer could route from `onSelectionChange`, but the
entries would not have been links — no middle-click, no open-in-new-tab, no copy-link-address, no destination
in the status bar. None of that is reachable from a click handler.

**`href` is a field on the node and it chooses the element**, exactly as `Tab<T>`'s does. A row with one
renders an `<a role="treeitem">` through `Dynamic`, a row without one stays a `div`, and both take the same
`commonProps` object of getters so the ARIA cannot drift. `TreeProps` also takes a `linkComponent`, for the
reason `Tabs` takes one: an `<a>` reloads the application.

**`TreeLinkProps` is declared in `Tree.types.ts` rather than imported from `Tabs.types.ts`.** The two are the
same shape today, but they are two components' public prop types, and importing one control's type into
another's surface would mean a consumer of `Tree` reading `Tabs`' documentation, and would make a future
divergence a breaking change for the wrong component.

**Keyboard: a link row hands its activation to the element.** `Enter` is left alone, because an anchor fires
its own click from `Enter` and that click already runs the row's activation — so selecting, toggling and
navigating happen through one path, and calling `preventDefault` would have selected the row while refusing to
go anywhere. `Space` is the case an anchor does not answer: the row cancels the page scroll and clicks the
element itself, so the two keys stay interchangeable.

**A disabled link row cancels the navigation rather than just skipping the callback.** The click handler calls
`preventDefault` before returning, which is `TabsItem`'s arrangement and is not optional here: on a `div` an
early return is enough, while an anchor would have followed its `href` regardless.

### A placed `Tree` draws the line to each node's parent through `renderConnector`

Recorded in `backlog.md` as the one gap left by the radial tree: a child sat inside its parent's angular slice, which
is enough to see and not enough to state. `Stepper` already had both halves — a connector slot and
`PlacementUtils.getLinkPath` — so this is the same answer given to a second control.

**Only a laid-out tree draws connectors.** An indented tree has no placements to run a line between, and its guide
lines, if a consumer wants them, are a painter's business from `depth`. So `renderConnector` without `computeLayout`
is refused by `TreeConnectorNeedsLayout` and warned about by `TreeUtils.warnIfConnectorIgnored` — `Stepper`'s pattern
of a type that refuses the pair plus a warning for whatever slips past it.

**One connector per node that has a parent, drawn across the whole box, behind everything.** Each is an
`aria-hidden` span stretched over the placement box, handed `TreeConnectorDefs`: the two nodes' values, both
placements, and the layout's `origin` and `radii`, so a consumer can draw a straight line or bend it round the
middle. **It sits at `z-index: -2` inside the tree's own stacking context**, below the selection and highlight
markers at `-1`. The first build relied on document order, which put each connector after its parent's row and so
over the parent node; the user asked for them underneath.

### A placed `Tree` can be given rings without `Tree` knowing, and what that costs

The user's question: can a consumer already draw the rings a radial tree implies, or does everything that is
not a node need a slot first. The answer is that it can, from outside the control, and the example now does
it.

**The subject changed because the rings made the old one assert something false.** The example was a solar
system, and `createRadialTree`'s rule is that depth decides radius — so every node at depth two shared one
circle whatever it hung from, which put Phobos, Deimos and the Moon on a single orbit round the Sun. Drawing
the ring is what turned a layout convention into a claim, and the claim was wrong. The user's call was to
change the subject rather than the layout, since the layout is a **generation ring** diagram and was only
ever badly cast. It is now a taxonomy — Animalia, then phyla, then classes — where everything on a ring
genuinely shares a rank no matter which parent it hangs from.

**The layout puts the box's center where the tree's root is, and the box is square.** `createRadialTree`
reports `origin` at the middle and `heightRatio` of one, so a page that centers its own rings and the `Tree`
in the same box has them line up with no measuring and no library change. The rings are plain divs with a
`border-radius` of 50%, sized in pixels from the radii the page itself chose, and they sit before the tree in
the document so they paint behind it.

**What it costs is that the page restates the radius rule.** `innerRadiusPx + ringGapPx * depth` is the
layout's formula and the example now spells it a second time, along with a walk of its own data to work out
which depths are showing — because a ring must disappear when its generation collapses, and only the layout
knows that today. So the escape hatch is real and the duplication is real with it, which is the argument for a
slot for such decorations rather than a reason to think nothing is missing. `renderConnector` (below) answered the
links between nodes; the rings still have none.

**The user's stated position on where this should land**, taken as their framing rather than as a rule
anything has been changed to follow: a thing that belongs in a particular place should have a render slot of
its own, and having one should not stop a consumer drawing other things beside it. The rings are the second
half of that working; the first half, a named slot for the connector a radial tree wants, is still open.

**A round painter inside a square focusable element gets a square focus ring, and the fix is the page's.**
The rounded bodies exposed it: the outline is the Playground's global `:focus-visible` rule and an outline
follows the radius of the element it is drawn on, which is the `treeitem` rather than the painter inside it.
`TileBoard` had already met this and answered it the same way — a `globalStyle` selecting the role that
`:has()` the painter. Nothing about it is the library's: the control owns focus and the page owns paint, so a
page that paints a circle owns making the ring round.

**The same square also catches presses meant for whatever is drawn beside the circle, so rounding it is not only
about the ring.** The Sunburst page's center button is a square box around a round hub, and the first ring's arcs
reach into its corners: a press on the inner edge of an arc landed on the button instead, which at any level below
the root went back out rather than in. The page now rounds both the button (a `globalStyle` on the `button` that
`:has()` the hub painter) and its own positioned wrapper, since an element with a `border-radius` takes no presses
outside its curve. The Sunburst spec caught it, because a click on an arc aims at the middle of the arc's bounding
box, and for an arc of the first ring that point falls in the button's corner.
