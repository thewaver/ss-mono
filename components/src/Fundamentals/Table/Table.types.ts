import type { Accessor, JSX } from "solid-js";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type TableSortDirection = "ascending" | "descending";

export type TableSort = {
    columnId: string;
    direction: TableSortDirection;
};

export type TableSelectionMode = "none" | "single" | "multiple";

export type TableColumnRenderProps = {
    columnId: string;
    dataCol: number;
    layoutCol: number;
    sortDirection: TableSortDirection | undefined;
    isSortable: boolean;
    isReorderable: boolean;
    isResizable: boolean;
    isResizing: boolean;
    isCarried: boolean;
    isFocused: boolean;
    isHovered: boolean;
    isDisabled: boolean;
};

export type TableCellRenderProps = {
    columnId: string;
    dataCol: number;
    layoutCol: number;
    dataRow: number;
    layoutRow: number;
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
    isReorderable?: boolean;
    compare?: (a: T, b: T) => number;
    renderHeader: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
    renderCell: (getRow: Accessor<T>, getRenderProps: () => TableCellRenderProps) => JSX.Element;
};

export type TableProps<T> = AccessorProps<{
    ariaLabel?: string;
    selectionMode?: TableSelectionMode;
    resizeStepPx?: number;
    pageRows?: number;
    resizerWidthPx?: number;
    isDisabled?: boolean;
    sortSignal?: SignalSource<TableSort | undefined>;
    widthsSignal?: SignalSource<Record<string, number>>;
    orderSignal?: SignalSource<string[]>;
    computeEstimatedRowHeight?: (index: number) => number;
    renderResizer?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
    renderMarker?: () => JSX.Element;
    onSortChange?: (sort: TableSort | undefined) => void;
    onOrderChange?: (order: string[]) => void;
}> & {
    columns: MaybeAccessor<TableColumn<T>[]>;
    rows: MaybeAccessor<T[]>;
    selectionSignal?: SignalSource<T[]>;
    computeRowAriaLabel?: (row: T, index: number) => string;
    onRowActivate?: (row: T, index: number) => void;
    onSelectionChange?: (rows: T[]) => void;
};
