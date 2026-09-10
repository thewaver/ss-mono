import { MathUtils } from "@thewaver/ss-utils";

import type { TableColumn, TableSort, TableSortDirection } from "./Table.types";

/** What a repeated press of a column header steps through: up, down, then unsorted. */
const SORT_CYCLE: (TableSortDirection | undefined)[] = ["ascending", "descending", undefined];

/**
 * Sorting, column ordering, sizing and selection for a table.
 *
 * Rows and columns are reordered as lists of indices rather than by rearranging the data, so the
 * caller's own array is never touched and a row's identity survives a re-sort — which is what lets a
 * selection or a keyboard cursor stay on the row it was on.
 */
export namespace TableUtils {
    /**
     * The row order for a sort.
     *
     * @param rows The rows as given.
     * @param column The column being sorted by.
     * @param sort Which column and which direction.
     * @returns The row indices in sorted order, or `undefined` when there is no sort in effect, the
     * sort names a different column, or the column has no comparison — in which case the rows are drawn
     * as given.
     */
    export const getSortedOrder = <T>(
        rows: T[],
        column: TableColumn<T> | undefined,
        sort: TableSort | undefined,
    ): number[] | undefined => {
        if (!column || !sort || !column.compare || column.id !== sort.columnId) return undefined;

        const sign = sort.direction === "ascending" ? 1 : -1;

        return rows.map((_unused, index) => index).sort((a, b) => sign * column.compare!(rows[a], rows[b]));
    };

    /**
     * The column order for a list of column ids.
     *
     * @param columns The columns as declared.
     * @param order The ids in the order they should appear. Columns the list does not mention keep their
     * declared order and go last.
     * @returns The column indices in order, or `undefined` when that would be the declared order
     * anyway — which spares the caller a pointless remapping.
     */
    export const getColumnOrder = <T>(columns: TableColumn<T>[], order: string[] | undefined): number[] | undefined => {
        if (!order || order.length < 1) return undefined;

        const rank = new Map(order.map((id, index) => [id, index]));
        const placed = columns
            .map((_unused, index) => index)
            .sort(
                (a, b) =>
                    (rank.get(columns[a].id) ?? Number.MAX_SAFE_INTEGER) -
                    (rank.get(columns[b].id) ?? Number.MAX_SAFE_INTEGER),
            );

        return placed.every((value, index) => value === index) ? undefined : placed;
    };

    /**
     * Applies an order to a list.
     *
     * @param entries The rows or columns as given.
     * @param order The indices in the order wanted. `undefined` leaves the list alone.
     */
    export const getReordered = <T>(entries: T[], order: number[] | undefined) =>
        order === undefined ? entries : order.map((index) => entries[index]);

    /**
     * The sort that a press on a column header produces.
     *
     * Pressing the same header repeatedly goes up, down, then back to unsorted; pressing a different
     * header starts that column at ascending. The unsorted third state matters — without it there is no
     * way back to the order the rows arrived in.
     *
     * @param current The sort in effect, if any.
     * @param columnId The header pressed.
     * @returns The new sort, or `undefined` for unsorted.
     */
    export const getNextSort = (current: TableSort | undefined, columnId: string): TableSort | undefined => {
        const position = current?.columnId === columnId ? SORT_CYCLE.indexOf(current.direction) : -1;
        const direction = SORT_CYCLE[(position + 1) % SORT_CYCLE.length];

        return direction === undefined ? undefined : { columnId, direction };
    };

    /**
     * A column's width in pixels, if it has a fixed one.
     *
     * @param column The column.
     * @param widths Widths set by dragging, by column id. These win over the declared width, since the
     * user asked for them.
     * @returns The width, or `undefined` for a column that should flex.
     */
    export const getColumnWidth = <T>(column: TableColumn<T>, widths: Record<string, number>) =>
        widths[column.id] ?? column.widthPx;

    /**
     * A column's CSS grid track.
     *
     * @param column The column.
     * @param widths Widths set by dragging, by column id.
     * @returns A fixed length for a column with a width, otherwise a range between its minimum and
     * maximum — flexing to fill the leftover space where it has no maximum.
     */
    export const getColumnTrack = <T>(column: TableColumn<T>, widths: Record<string, number>) => {
        const width = getColumnWidth(column, widths);

        if (width !== undefined) return `${width}px`;

        const min = column.minWidthPx ?? 0;
        const max = column.maxWidthPx;

        return `minmax(${min}px, ${max === undefined ? "1fr" : `${max}px`})`;
    };

    /**
     * The whole `grid-template-columns` value for a table.
     *
     * @param columns The columns, in the order they are drawn.
     * @param widths Widths set by dragging, by column id.
     */
    export const getColumnTemplate = <T>(columns: TableColumn<T>[], widths: Record<string, number>) =>
        columns.map((column) => getColumnTrack(column, widths)).join(" ");

    /**
     * A dragged width, held inside the column's own limits.
     *
     * @param column The column being resized.
     * @param width The width the drag asks for.
     */
    export const getResizedWidth = <T>(column: TableColumn<T>, width: number) =>
        MathUtils.clamp(width, column.minWidthPx ?? 0, column.maxWidthPx ?? Number.MAX_SAFE_INTEGER);

    /**
     * Every index between two, both included, whichever way round they were given.
     *
     * For a shift-click, which selects from the last clicked row to this one in either direction.
     */
    export const getRangeIndices = (from: number, to: number) => {
        const start = Math.min(from, to);
        const end = Math.max(from, to);

        return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
    };

    /**
     * The selection after a row is toggled.
     *
     * @param selection The current selection.
     * @param row The row clicked.
     * @returns A new list with the row added or removed.
     */
    export const getToggledSelection = <T>(selection: T[], row: T) =>
        selection.includes(row) ? selection.filter((entry) => entry !== row) : [...selection, row];

    /**
     * The selection after a range is added to it.
     *
     * Rows already selected are not duplicated, and the existing selection keeps its order, so a
     * shift-click extending a selection does not disturb what was there.
     *
     * @param selection The current selection.
     * @param added The rows to add.
     */
    export const getMergedSelection = <T>(selection: T[], added: T[]) => [
        ...selection,
        ...added.filter((row) => !selection.includes(row)),
    ];
}
