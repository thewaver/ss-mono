import type { Accessor, JSX } from "solid-js";

import type { SelectionMode } from "../../Abstracts/Selection/Selection.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type TableSortDirection = "ascending" | "descending";

export type TableSort = {
    columnId: string;
    direction: TableSortDirection;
};

export type TableSelectionMode = SelectionMode;

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

export type TableColumn<T> = {
    id: string;
    header: string;
    widthPx?: number;
    minWidthPx?: number;
    maxWidthPx?: number;
    isSortable?: boolean;
    isResizable?: boolean;
    isReorderable?: boolean;
    compare?: (a: T, b: T) => number;
    renderHeader: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
    renderCell: (getRow: Accessor<T>, getRenderProps: () => TableCellRenderProps) => JSX.Element;
};

export type TableProps<T> = AccessorProps<{
    /** Names the table for assistive technology. */
    ariaLabel?: string;
    /** Whether rows cannot be selected, one can be, or many can be. */
    selectionMode?: TableSelectionMode;
    /** How far one press of an arrow key resizes a column, for resizing without a pointer. */
    resizeStepPx?: number;
    /** How many rows Page Up and Page Down move by. */
    pageRows?: number;
    /**
     * How wide the grab area between two columns is. It is a hit target rather than a visible width, so it can be wider
     * than the line that is drawn.
     */
    resizerWidthPx?: number;
    /** Turns the table off, so nothing in it sorts, resizes, reorders or selects. */
    isDisabled?: boolean;
    /** Which column the table is sorted by and which way. It is the only thing that sorts it. */
    sortSignal?: SignalSource<TableSort | undefined>;
    /** How wide each column is, by column id. It is the only thing that resizes them. */
    widthsSignal?: SignalSource<Record<string, number>>;
    /** The order the columns are shown in, by column id. It is the only thing that reorders them. */
    orderSignal?: SignalSource<string[]>;
    /**
     * Guesses how tall a row will be before it is drawn, which is what lets a long table render only what is on screen.
     */
    computeEstimatedRowHeight?: (index: number) => number;
    /** Draws the grab handle between two columns. */
    renderResizer?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
    /** Draws the line showing where a dragged column would land. */
    renderMarker?: () => JSX.Element;
    /** Runs when the reader sorts by a different column, or reverses the one it is sorted by. */
    onSortChange?: (sort: TableSort | undefined) => void;
    /** Runs when the reader moves a column. */
    onOrderChange?: (order: string[]) => void;
}> & {
    /** The columns, each carrying its own id and how it is drawn. */
    columns: MaybeAccessor<TableColumn<T>[]>;
    /** The rows, in the order they are shown. */
    rows: MaybeAccessor<T[]>;
    /** Which rows are selected. It is the only thing that selects them. */
    selectionSignal?: SignalSource<T[]>;
    /** Names one row for assistive technology, so a reader hears what the row is rather than its number. */
    computeRowAriaLabel?: (row: T, index: number) => string;
    /** Runs when a row is activated, by pointer or by key. */
    onRowActivate?: (row: T, index: number) => void;
    /** Runs when the selection changes. */
    onSelectionChange?: (rows: T[]) => void;
};
