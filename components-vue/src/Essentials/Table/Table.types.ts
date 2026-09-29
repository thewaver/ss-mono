import type { VNodeChild } from "vue";

import type {
    SelectionMode,
    TableAnnouncements,
    TableCellRenderProps,
    TableColumnDefs,
    TableColumnRenderProps,
    TableSort,
} from "@thewaver/ss-components";

export type TableColumn<T> = TableColumnDefs<T> & {
    /**
     * Draws the column's header. A sortable column puts a `TableHeaderSort` in it and a reorderable one a
     * `TableHeaderReorder`, wherever they belong; without them the column can only be sorted from the keyboard, or
     * reordered by dragging, and the table warns about it.
     */
    renderHeader: (renderProps: TableColumnRenderProps) => VNodeChild;
    /** Draws one of the column's cells, and is handed its row and where the cell sits. */
    renderCell: (props: { row: T; renderProps: TableCellRenderProps }) => VNodeChild;
};

export type TableOrderProps =
    | {
          /**
           * Everything the table says aloud while a column is reordered, and the key hints and place names those
           * announcements are built from. There is no default: every word a reader hears comes from here. It is
           * required exactly when `order` is given, because that is the only table that speaks any of it.
           */
          "announcements": TableAnnouncements;
          /** The order the columns are shown in, by column id. It is the only thing that reorders them. */
          "order": string[];
          /** Receives the new order as a column is moved, which is what `v-model:order` binds. */
          "onUpdate:order"?: (order: string[]) => void;
      }
    | {
          "announcements"?: undefined;
          "order"?: undefined;
          "onUpdate:order"?: undefined;
      };

export type TableProps<T> = TableOrderProps & {
    /**
     * Names the table for assistive technology. It is required because nothing else can name it, and a page with two
     * unnamed grids gives a reader no way to tell them apart.
     */
    "ariaLabel": string;
    /** Whether rows cannot be selected, one can be, or many can be. */
    "selectionMode"?: SelectionMode;
    /** How far one press of an arrow key resizes a column, for resizing without a pointer. */
    "resizeStepPx"?: number;
    /** How many rows Page Up and Page Down move by. */
    "pageRows"?: number;
    /**
     * How wide the grab area between two columns is. It is a hit target rather than a visible width, so it can be wider
     * than the line that is drawn.
     */
    "resizerWidthPx"?: number;
    /** Turns the table off, so nothing in it sorts, resizes, reorders or selects. */
    "isDisabled"?: boolean;
    /** Which column the table is sorted by and which way. It is the only thing that sorts it. */
    "sort"?: TableSort;
    /** Receives the sort the reader asks for, which is what `v-model:sort` binds. */
    "onUpdate:sort"?: (sort: TableSort | undefined) => void;
    /** How wide each column is, by column id. It is the only thing that resizes them. */
    "widths"?: Record<string, number>;
    /** Receives the widths as a column is resized, which is what `v-model:widths` binds. */
    "onUpdate:widths"?: (widths: Record<string, number>) => void;
    /**
     * Guesses how tall a row will be before it is drawn, which is what lets a long table render only what is on screen.
     */
    "computeEstimatedRowHeight"?: (index: number) => number;
    /** Runs when the reader sorts by a different column, or reverses the one it is sorted by. */
    "onSortChange"?: (sort: TableSort | undefined) => void;
    /** Runs when the reader moves a column. */
    "onOrderChange"?: (order: string[]) => void;
    /** The columns, each carrying its own id and how it is drawn. */
    "columns": TableColumn<T>[];
    /** The rows, in the order they are shown. */
    "rows": T[];
    /** Which rows are selected. It is the only thing that selects them. */
    "selection"?: T[];
    /** Receives the rows the reader selects, which is what `v-model:selection` binds. */
    "onUpdate:selection"?: (rows: T[]) => void;
    /** Names one row for assistive technology, so a reader hears what the row is rather than its number. */
    "computeRowAriaLabel"?: (row: T, index: number) => string;
    /** Runs when a row is activated, by pointer or by key. */
    "onRowActivate"?: (row: T, index: number) => void;
    /** Runs when the selection changes. */
    "onSelectionChange"?: (rows: T[]) => void;
};

export type TableSlots = {
    /** Draws the grab handle between two columns. */
    renderResizer?: (renderProps: TableColumnRenderProps) => VNodeChild;
    /** Draws the line showing where a dragged column would land. */
    renderMarker?: () => VNodeChild;
};

export type TableHeaderControlSlots = {
    /** Draws what sits inside the control, from the state of the column whose header it is in. */
    renderContent: (renderProps: TableColumnRenderProps) => VNodeChild;
};

/**
 * The control that sorts a column, placed by the consumer anywhere inside the column's header.
 *
 * A header cell is not a target of its own: sorting and reordering each have their own control, so a tap can only
 * ever mean one of them. The control keeps a press from reaching the header, so it never starts a column drag,
 * focuses its own cell before acting, and stays out of the tab order and hidden from screen readers — the cell is
 * the one tab stop, and Enter on it sorts. Three targets can share a header cell, and 2.5.8 Target Size wants a 24
 * CSS pixel circle centered on each undersized one to clear the others, so painting each control at 24 pixels is
 * the simple way to meet it. It renders nothing in a column that is not sortable.
 */
export type TableHeaderSortSlots = TableHeaderControlSlots;

/**
 * The control that picks a column up to move it, placed by the consumer anywhere inside the column's header.
 *
 * Tapping it picks the column up; tapping another header drops it there. That is the single-pointer route 2.5.7
 * asks for, and it is why reordering needs a control of its own — a tap on the header could not mean both "sort"
 * and "pick up". Dragging from anywhere on the header still works. It follows the same rules as the sort control,
 * and renders nothing in a column that is not reorderable.
 */
export type TableHeaderReorderSlots = TableHeaderControlSlots;
