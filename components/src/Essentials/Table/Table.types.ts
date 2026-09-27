import type { Index2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";
import type { SelectionGesture, SelectionMode } from "../../Abstracts/Selection/Selection.types";

export type TableSortDirection = "ascending" | "descending";

export type TableSort = {
    columnId: string;
    direction: TableSortDirection;
};

export type TableSelectionMode = SelectionMode;

export type TableAnnouncements = CarrierAnnouncements & {
    /**
     * Describes every reorderable column header while nothing is picked up, telling a keyboard user that Enter picks
     * it up. Nothing else says the header can be moved.
     */
    restingKeyHint: string;
    /** Tells a keyboard user which keys drop and cancel a column that has been picked up. */
    keyHint: string;
    /**
     * Names a place in the column order, which is what the pick-up, move and drop announcements say the column is at.
     *
     * @param index The place, counting from zero.
     * @param count How many columns there are.
     */
    computePlaceLabel: (index: number, count: number) => string;
    /**
     * What is said when a column is moved one place with Shift and an arrow key, which moves it straight away
     * rather than picking it up.
     *
     * @param header The moved column's header.
     * @param index Where it now sits, counting from zero.
     * @param count How many columns there are.
     */
    computeColumnMoved: (header: string, index: number, count: number) => string;
};

export type TableColumnRenderProps = {
    /** Which column this is, by the id the consumer gave it. */
    columnId: string;
    /** Where this column sits in the data, which does not move when the reader reorders the table. */
    dataCol: number;
    /** Where this column sits on screen, which does move when the reader reorders the table. */
    layoutCol: number;
    /** Which way this column is sorted, or nothing if the table is not sorted by it. */
    sortDirection: TableSortDirection | undefined;
    /** Whether this column can be sorted by. */
    isSortable: boolean;
    /** Whether this column can be dragged to a new position. */
    isReorderable: boolean;
    /** Whether this column can be resized. */
    isResizable: boolean;
    /** Whether this column is being resized right now. */
    isResizing: boolean;
    /** Whether this column is being dragged to a new position right now. */
    isCarried: boolean;
    /** Whether this column's header holds focus. */
    isFocused: boolean;
    /** Whether the pointer is over this column's header. */
    isHovered: boolean;
    /** Whether this column is turned off. */
    isDisabled: boolean;
};

export type TableCellRenderProps = {
    /** Which column this cell is in, by the id the consumer gave it. */
    columnId: string;
    /** Where this cell's column sits in the data, which does not move when the reader reorders the table. */
    dataCol: number;
    /** Where this cell's column sits on screen, which does move when the reader reorders the table. */
    layoutCol: number;
    /** Where this cell's row sits in the data. */
    dataRow: number;
    /** Where this cell's row sits on screen. */
    layoutRow: number;
    /** Whether this cell's row is selected. */
    isSelected: boolean;
    /** Whether this cell holds focus. */
    isFocused: boolean;
    /** Whether the pointer is over this cell. */
    isHovered: boolean;
    /** Whether this cell is turned off. */
    isDisabled: boolean;
};

export type TableColumnDefs<T> = {
    id: string;
    header: string;
    widthPx?: number;
    minWidthPx?: number;
    maxWidthPx?: number;
    isSortable?: boolean;
    isResizable?: boolean;
    isReorderable?: boolean;
    compare?: (a: T, b: T) => number;
};

export type TableGrid = {
    rowCount: number;
    colCount: number;
};

export type TableKeyCommand =
    | { kind: "selectAll" }
    | { kind: "focus"; cell: Index2d; isExtending: boolean }
    | { kind: "sort" }
    | { kind: "resize"; step: -1 | 1 }
    | { kind: "moveColumn"; to: number }
    | { kind: "activateRow"; rowIndex: number }
    | { kind: "pickRow"; rowIndex: number; gesture: SelectionGesture };
