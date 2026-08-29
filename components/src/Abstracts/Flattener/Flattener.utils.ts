import type { FlatRow, FlattenerDefs } from "./Flattener.types";

const EMPTY_ROWS: never[] = [];
const EMPTY_NODES: never[] = [];

export namespace FlattenerUtils {
    export const getIsBranch = <T>(node: T, defs: FlattenerDefs<T>) =>
        defs.computeIsBranch?.(node) ?? (defs.computeChildren(node)?.length ?? 0) > 0;

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

    export const getFlatRows = <T>(rows: FlatRow<T>[]): FlatRow<T>[] =>
        rows.flatMap((row) => [row, ...getFlatRows(row.rows)]);

    export const getEntryRowIndex = <T>(rows: FlatRow<T>[], entryIndex: number) =>
        rows.findIndex((row) => row.isEntry && row.entryOffset === entryIndex);
}
