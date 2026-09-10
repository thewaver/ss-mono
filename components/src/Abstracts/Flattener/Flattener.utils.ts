import type { FlatRow, FlattenerDefs } from "./Flattener.types";

const EMPTY_ROWS: never[] = [];
const EMPTY_NODES: never[] = [];

/** Flattens a tree of nodes into the rows a list or a table draws, one row per visible node. */
export namespace FlattenerUtils {
    /**
     * Decides whether a node is a branch — something that can be opened — rather than a leaf.
     *
     * A caller that knows its own data can answer this directly through `computeIsBranch`, which is
     * what lets an unexpanded folder still show a twisty before its contents have been fetched.
     * Without that, having children is what makes a node a branch.
     *
     * @param node The node to judge.
     * @param defs The caller's accessors for the shape of its own tree.
     * @returns `true` when the node can be opened.
     */
    export const getIsBranch = <T>(node: T, defs: FlattenerDefs<T>) =>
        defs.computeIsBranch?.(node) ?? (defs.computeChildren(node)?.length ?? 0) > 0;

    /**
     * Walks a tree and numbers every visible node, keeping the nesting.
     *
     * The rows come back nested the same way the nodes were, but each one now carries what a list
     * needs and a bare node cannot say: where it sits in the whole run (`index`), which row holds it
     * (`parentIndex`), how deep it is, its place among its siblings (`position` of `setSize`) and
     * whether it is open. Those last two are what `aria-posinset`, `aria-setsize` and `aria-level`
     * want, so the accessibility attributes come out of this pass rather than being recounted later.
     *
     * `index` counts every row that was produced; `entryOffset` counts only the rows that are entries,
     * which is how a caller keeps a selection or a keyboard cursor addressed to real items while
     * headers and separators still take up rows of their own.
     *
     * Children of a closed node are not walked, so a collapsed branch costs nothing and its
     * descendants take no indices.
     *
     * @param nodes The roots, in the order they should appear.
     * @param defs The caller's accessors for children, branch-ness, expansion and entry-ness. Only
     * `computeChildren` is required; a node is treated as expanded and as an entry unless said
     * otherwise.
     * @returns The roots as rows, each holding its own children in `rows`.
     */
    export const getRows = <T>(nodes: T[], defs: FlattenerDefs<T>): FlatRow<T>[] => {
        let index = 0;
        let entryOffset = 0;

        const build = (siblings: T[], depth: number, parentIndex: number | undefined): FlatRow<T>[] =>
            siblings.map((node, position) => {
                const isExpanded = getIsBranch(node, defs) && (defs.computeIsExpanded?.(node) ?? true);
                const isEntry = defs.computeIsEntry?.(node) ?? true;
                const rowIndex = index++;
                const rowEntryOffset = entryOffset;

                if (isEntry) entryOffset++;

                return {
                    node,
                    index: rowIndex,
                    parentIndex,
                    depth,
                    position,
                    setSize: siblings.length,
                    isExpanded,
                    isEntry,
                    entryOffset: rowEntryOffset,
                    rows: isExpanded
                        ? build(defs.computeChildren(node) ?? EMPTY_NODES, depth + 1, rowIndex)
                        : EMPTY_ROWS,
                };
            });

        return build(nodes, 0, undefined);
    };

    /**
     * Unnests the rows into a single run, in the order they are drawn.
     *
     * Nesting is what a renderer wants; a flat run is what keyboard navigation, virtualisation and
     * `indexOf` want. This is the second view of the same rows, not a copy of the nodes.
     *
     * @param rows Rows from {@link FlattenerUtils.getRows}.
     * @returns Every row, parents before their children.
     */
    export const getFlatRows = <T>(rows: FlatRow<T>[]): FlatRow<T>[] =>
        rows.flatMap((row) => [row, ...getFlatRows(row.rows)]);

    /**
     * Finds which row holds a given entry.
     *
     * Entry numbers skip the rows that are not entries, so the two counts drift apart as soon as a
     * tree carries a header or a separator. A caller holding an entry number — the selected item, say —
     * uses this to get back to the row that draws it.
     *
     * @param rows A flat run from {@link FlattenerUtils.getFlatRows}.
     * @param entryIndex The entry's own number, counting only entries.
     * @returns The row's position in the run, or `-1` when no such entry exists.
     */
    export const getEntryRowIndex = <T>(rows: FlatRow<T>[], entryIndex: number) =>
        rows.findIndex((row) => row.isEntry && row.entryOffset === entryIndex);
}
