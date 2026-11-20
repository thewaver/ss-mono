# Decisions: `Selection`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `Abstracts/Selection`: the anchor is the abstract's, and the selection is the consumer's

**Three components had written the same toggle before this existed** — `Table`'s `getToggledSelection`,
`MenuUtils.computeNextChecked`'s checkbox branch and `MultiSelect`'s `onPick`, each spelling "drop it if it
is in the list, add it at the end if it is not" in its own words. That much is `SelectionUtils.getToggled`,
with `getMerged` and `getRange` beside it, and it is the same kind of extraction the 1D walk was.

**What is new is that this one owns state, and `conventions.md`'s walk entry is the reason that needed
arguing.** The walk refused to be a factory because the cursor is already owned by each control and owned
differently, and the selection is owned differently in exactly the same way: `Table` reads a consumer's
`selection`, `Menu` holds a list of checked values, `MultiSelect` has a `values`. So the
selection does not move — `SelectionUtils.create` is handed a getter and a setter for it and never holds one.
**The anchor is the opposite case: no control has a home for it**, because it is not part of any consumer's
data and nobody wants it back. It is the memory of where the last plain pick landed, and it exists only so
that the next shifted pick knows where to measure from. That is what makes a factory right here and wrong
there, and the rule the two cases produce is in `conventions.md`.

**The anchor is the item, not its position, and that is the whole return on holding it.** `Table`'s was a
`let anchorRowIndex = 0`, so sorting a column while a run was anchored left the anchor pointing at whichever
row had since arrived at that index — the run would extend from a row the reader never picked. Holding the
row itself and resolving it through `indexOf` at the moment a run is taken means the anchor moves with its
row, and `getRange` takes items rather than indices for the same reason. An anchor whose item has left the
list resolves to nothing, and the run starts where the gesture landed.

**A write that would leave the same items in the same order does not happen.** Extending a run back over
ground it already covers produces an equal-but-new array, which `accessSignal`'s `Object.is` check cannot
see, so `onSelectionChange` used to fire announcing a change that had not occurred. The handle compares
members before writing, which is _"Asking for a state a thing is already in does nothing"_ applied to a list.

**The branch trio is for a tree, and has no consumer yet.** `getBranchItems`, `getBranchState` and
`getBranchSelection` are the recursive form of what `Select`'s group header already does with
`CheckedStateUtils.fromMembers` — a folder that reports ticked, empty or half-ticked by asking what is under
it, and a press that moves the folder and every descendant together. Two rules are fixed here rather than in
whatever consumes it first: **a branch's own place in the selection is not read** when deciding what its box
shows, because a folder follows its contents rather than competing with them, and **a half-ticked box fills
rather than empties** on the first press. A multi-select `Tree` is the consumer this is waiting for (no `backlog.md` item is open for it), and building
it ahead of that was the user's call, taken on the grounds that the tri-state parent is the one part of a
multi-select `Tree` with nothing left to argue about.

**`TableSelectionMode` is now an alias of `SelectionMode`.** The three modes were `Table`'s own string union
and are the abstract's vocabulary now, but the name is published, so it stays as an alias rather than being
renamed out from under a consumer — the same move `SortableDir` made over `CarryDir`.
