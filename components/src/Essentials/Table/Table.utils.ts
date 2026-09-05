import { MathUtils } from "@thewaver/ss-utils";

import type { TableColumn, TableSort, TableSortDirection } from "./Table.types";

const SORT_CYCLE: (TableSortDirection | undefined)[] = ["ascending", "descending", undefined];

export namespace TableUtils {
    export const getSortedOrder = <T>(
        rows: T[],
        column: TableColumn<T> | undefined,
        sort: TableSort | undefined,
    ): number[] | undefined => {
        if (!column || !sort || !column.compare || column.id !== sort.columnId) return undefined;

        const sign = sort.direction === "ascending" ? 1 : -1;

        return rows.map((_unused, index) => index).sort((a, b) => sign * column.compare!(rows[a], rows[b]));
    };

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

    export const getReordered = <T>(entries: T[], order: number[] | undefined) =>
        order === undefined ? entries : order.map((index) => entries[index]);

    export const getNextSort = (current: TableSort | undefined, columnId: string): TableSort | undefined => {
        const position = current?.columnId === columnId ? SORT_CYCLE.indexOf(current.direction) : -1;
        const direction = SORT_CYCLE[(position + 1) % SORT_CYCLE.length];

        return direction === undefined ? undefined : { columnId, direction };
    };

    export const getColumnWidth = <T>(column: TableColumn<T>, widths: Record<string, number>) =>
        widths[column.id] ?? column.widthPx;

    export const getColumnTrack = <T>(column: TableColumn<T>, widths: Record<string, number>) => {
        const width = getColumnWidth(column, widths);

        if (width !== undefined) return `${width}px`;

        const min = column.minWidthPx ?? 0;
        const max = column.maxWidthPx;

        return `minmax(${min}px, ${max === undefined ? "1fr" : `${max}px`})`;
    };

    export const getColumnTemplate = <T>(columns: TableColumn<T>[], widths: Record<string, number>) =>
        columns.map((column) => getColumnTrack(column, widths)).join(" ");

    export const getResizedWidth = <T>(column: TableColumn<T>, width: number) =>
        MathUtils.clamp(width, column.minWidthPx ?? 0, column.maxWidthPx ?? Number.MAX_SAFE_INTEGER);

    export const getRangeIndices = (from: number, to: number) => {
        const start = Math.min(from, to);
        const end = Math.max(from, to);

        return Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
    };

    export const getToggledSelection = <T>(selection: T[], row: T) =>
        selection.includes(row) ? selection.filter((entry) => entry !== row) : [...selection, row];

    export const getMergedSelection = <T>(selection: T[], added: T[]) => [
        ...selection,
        ...added.filter((row) => !selection.includes(row)),
    ];
}
