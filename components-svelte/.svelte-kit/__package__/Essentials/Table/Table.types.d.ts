import type { Snippet } from "svelte";
import type { SelectionMode, TableAnnouncements, TableCellRenderProps, TableColumnDefs, TableColumnRenderProps, TableHeaderContextType, TableSort } from "@thewaver/ss-components";
export type TableColumn<T> = TableColumnDefs<T> & {
    /**
     * Draws the column's header. A sortable column puts a `TableHeaderSort` in it and a reorderable one a
     * `TableHeaderReorder`, wherever they belong; without them the column can only be sorted from the keyboard, or
     * reordered by dragging, and the table warns about it.
     */
    renderHeader: Snippet<[renderProps: TableColumnRenderProps]>;
    /** Draws one of the column's cells, and is handed its row and where the cell sits. */
    renderCell: Snippet<[row: T, renderProps: TableCellRenderProps]>;
};
export type TableOrderProps = {
    /**
     * Everything the table says aloud while a column is reordered, and the key hints and place names those
     * announcements are built from. There is no default: every word a reader hears comes from here. It is
     * required exactly when `order` is given, because that is the only table that speaks any of it.
     */
    announcements: TableAnnouncements;
    /**
     * The order the columns are shown in, by column id. Bind it with `bind:order`: it is the only thing that
     * reorders them, and the table writes it when a column is moved.
     */
    order: string[];
} | {
    announcements?: undefined;
    order?: undefined;
};
export type TableProps<T> = TableOrderProps & {
    /**
     * Names the table for assistive technology. It is required because nothing else can name it, and a page with two
     * unnamed grids gives a reader no way to tell them apart.
     */
    ariaLabel: string;
    /** Whether rows cannot be selected, one can be, or many can be. */
    selectionMode?: SelectionMode;
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
    /**
     * Which column the table is sorted by and which way. Bind it with `bind:sort` to drive or follow it; the table
     * writes it when the reader sorts. Left unbound, the table keeps its own, starting unsorted.
     */
    sort?: TableSort;
    /**
     * How wide each column is, by column id. Bind it with `bind:widths`: it is the only thing that resizes them, and a
     * table without it has no resizable columns.
     */
    widths?: Record<string, number>;
    /**
     * Guesses how tall a row will be before it is drawn, which is what lets a long table render only what is on screen.
     */
    computeEstimatedRowHeight?: (index: number) => number;
    /** Draws the grab handle between two columns. */
    renderResizer?: Snippet<[renderProps: TableColumnRenderProps]>;
    /** Draws the line showing where a dragged column would land. */
    renderMarker?: Snippet;
    /** Runs when the reader sorts by a different column, or reverses the one it is sorted by. */
    onSortChange?: (sort: TableSort | undefined) => void;
    /** Runs when the reader moves a column. */
    onOrderChange?: (order: string[]) => void;
    /** The columns, each carrying its own id and how it is drawn. */
    columns: TableColumn<T>[];
    /** The rows, in the order they are shown. */
    rows: T[];
    /**
     * Which rows are selected. Bind it with `bind:selection`: it is the only thing that selects them, and a table
     * without it selects nothing unless `selectionMode` says otherwise, in which case it keeps its own.
     */
    selection?: T[];
    /** Names one row for assistive technology, so a reader hears what the row is rather than its number. */
    computeRowAriaLabel?: (row: T, index: number) => string;
    /** Runs when a row is activated, by pointer or by key. */
    onRowActivate?: (row: T, index: number) => void;
    /** Runs when the selection changes. */
    onSelectionChange?: (rows: T[]) => void;
};
export type TableHeaderCellProps<T> = {
    /** The column whose header this is. */
    column: TableColumn<T>;
    /** The cell's id, which is how the table focuses and measures it. */
    cellId: string;
    /** Where the column sits, counting on screen from the start. */
    columnIndex: number;
    /** Whether this is the last column, which also draws the marker for a drop past the end. */
    isLast: boolean;
    /** Whether this cell is the grid's one tab stop. */
    isRoving: boolean;
    /** Whether the table is turned off. */
    isDisabled: boolean;
    /** Whether the column can be moved. */
    isReorderable: boolean;
    /** Points at the hidden text saying how a column is moved from the keyboard, when columns can be moved. */
    hintId: string | undefined;
    /** Where a carried column would land, counting on screen, or `undefined` while none is carried here. */
    landingCol: number | undefined;
    /** How many columns there are. */
    columnCount: number;
    /** The column's state, handed to what the header draws. */
    renderProps: TableColumnRenderProps;
    /** What the header's sort and reorder controls call. */
    context: Omit<TableHeaderContextType, "registerSort" | "registerReorder">;
    /** Draws the resize handle, when the column is resizable. */
    renderResizer: Snippet<[column: TableColumn<T>, columnIndex: number, renderProps: TableColumnRenderProps]>;
    /** Draws the landing marker. */
    renderMarker: Snippet | undefined;
    /** Runs as a press goes down on the header, which is what a column drag starts from. */
    onPointerDown: (e: PointerEvent) => void;
    /** Runs when the header is clicked. */
    onClick: () => void;
    /** Runs as the pointer comes over the header. */
    onPointerEnter: () => void;
    /** Runs as the pointer leaves the header. */
    onPointerLeave: () => void;
};
export type TableHeaderControlProps = {
    /** Draws what sits inside the control, from the state of the column whose header it is in. */
    renderContent: Snippet<[renderProps: TableColumnRenderProps]>;
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
export type TableHeaderSortProps = TableHeaderControlProps;
/**
 * The control that picks a column up to move it, placed by the consumer anywhere inside the column's header.
 *
 * Tapping it picks the column up; tapping another header drops it there. That is the single-pointer route 2.5.7
 * asks for, and it is why reordering needs a control of its own — a tap on the header could not mean both "sort"
 * and "pick up". Dragging from anywhere on the header still works. It follows the same rules as the sort control,
 * and renders nothing in a column that is not reorderable.
 */
export type TableHeaderReorderProps = TableHeaderControlProps;
