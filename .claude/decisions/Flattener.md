# Decisions: `Flattener`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Abstracts/Flattener`: one walk, and the counter that is what `Select` and `Tree` disagreed about

Settled on the user's instruction, closing the extraction `backlog.md` held open under `Tree`. Flattening a
nested list into the flat one a keyboard walks existed twice — `SelectUtils.getRows` with `getItemOffsets`
beside it, and `TreeUtils.getVisibleRows` — and the entry above argued the two were "less alike than they
look" because a group header is a row and is not an option, so `Select` has two index spaces and `Tree` has
one. **That difference is what the shared walk now expresses rather than what stops it being shared.**

**`FlattenerUtils.getRows(nodes, defs)` walks depth first and hands back a `FlatRow<T>` per node**, carrying
`index` (position in the flat walk), `depth`, `position` and `setSize` among its siblings, `isExpanded`, the
nested `rows`, and the two fields the merge turned on: `isEntry` and `entryOffset`.

**`isEntry` is "does this row take a number", and `entryOffset` is how many entries precede it.** `Select`
passes `computeIsEntry: (item) => !getIsGroup(item)`, so a header row is not an entry and the options keep
counting past it — `entryOffset` on an option is its flat option index, and `entryOffset` on a header is
where its run starts, which is exactly what `getItemOffsets` used to compute in its own loop. `Tree` passes
nothing, so every row is an entry and `entryOffset === index`. **The "two index spaces or one" difference is
one default**, and `FlattenerUtils.getEntryRowIndex` is the bridge `getRowIndexOfOption` used to be.

**Four defs, and each earned its place from a consumer.** `computeChildren` is the walk itself.
`computeIsExpanded` gates descent, defaulting to always-open, which is why `Select` — whose groups are never
collapsed — passes none. `computeIsBranch` defaults to "has children" but is overridable, because `Tree`'s
`hasMoreChildren` makes a node with an empty child list still openable, and because `Select` counts an empty
group as a group so its header still renders. `computeIsEntry` is above.

**`parentIndex` is the field neither had and both wanted.** `Tree.findParentRow` was a backwards scan for the
first row of lower depth; `Select`'s windowed path needed each option's group in order to cut the visible
rows into runs of one group. Both are now a lookup. It is an **index rather than a reference** so the row
structure stays acyclic — a parent's `rows` already holds the child, and a back-reference would make the
structure impossible to compare in a spec or to serialize.

**`TreeRow<T>` is `FlatRow<TreeNode<T>>` and `SelectRow<T>` is `FlatRow<SelectItem<T>>`**, both plain
aliases, so neither component's vocabulary changed at its call sites. What `Select` gave up is the projected
row record with `group` / `groupIndex` / `option` / `optionIndex`: it read as four fields where two were
always `undefined`, and the code around it was already casting `row.option as SelectOption<T>`, so the record
was not buying the safety its shape implied. `SelectUtils.getGroupRowIndex` replaces `groupIndex` and answers
"which row is this row's group header" — itself for a header, `parentIndex` for an option.

**One number kept its old meaning deliberately.** `computeEstimatedGroupHeight` is still called with the
group's **written item index**, which is a group row's `position` at depth 0, not its row index. Changing
which number a consumer's callback receives would be an API change riding along inside a refactor.

**The tests moved with the behavior rather than being dropped.** `Flattener.utils.test.ts` holds the walk's
own assertions — the depth-first order, the numbering, `parentIndex`, and that an empty uncounted branch
leaves no hole in `entryOffset` — and `Select.utils.test.ts` keeps the ones that are about `Select`'s
numbering in particular, which is what the entry above called the agreement that used to be implicit.
