import type { Accessor, JSX, Signal } from "solid-js";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type TableSortDirection = "ascending" | "descending";

export type TableSort = {
    columnId: string;
    direction: TableSortDirection;
};

export type TableSelectionMode = "none" | "single" | "multiple";

export type TableCellPosition = {
    x: number;
    y: number;
};

export type TableColumnFlags = {
    columnId: string;
    columnIndex: number;
    sortDirection: TableSortDirection | undefined;
    isSortable: boolean;
    isResizable: boolean;
    isResizing: boolean;
    isFocused: boolean;
    isHovered: boolean;
    isDisabled: boolean;
};

export type TableCellFlags = {
    columnId: string;
    columnIndex: number;
    rowIndex: number;
    isSelected: boolean;
    isFocused: boolean;
    isHovered: boolean;
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
    compare?: (a: T, b: T) => number;
    renderHeader: (getFlags: () => TableColumnFlags) => JSX.Element;
    renderCell: (getRow: Accessor<T>, getFlags: () => TableCellFlags) => JSX.Element;
};

export type TableProps<T> = AccessorProps<{
    ariaLabel?: string;
    selectionMode?: TableSelectionMode;
    resizeStepPx?: number;
    pageRows?: number;
    resizerWidthPx?: number;
    isDisabled?: boolean;
    sortSignal?: Signal<TableSort | undefined>;
    widthsSignal?: Signal<Record<string, number>>;
    computeEstimatedRowHeight?: (index: number) => number;
    renderResizer?: (getFlags: () => TableColumnFlags) => JSX.Element;
    onSortChange?: (sort: TableSort | undefined) => void;
}> & {
    columns: MaybeAccessor<TableColumn<T>[]>;
    rows: MaybeAccessor<T[]>;
    selectionSignal?: Signal<T[]>;
    computeRowAriaLabel?: (row: T, index: number) => string;
    onRowActivate?: (row: T, index: number) => void;
    onSelectionChange?: (rows: T[]) => void;
};
