import type { Index2d } from "@thewaver/ss-utils";

import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";
import type { SelectionGesture, SelectionMode } from "../../Abstracts/Selection/Selection.types";

export type TableSortDirection = "ascending" | "descending";

export type TableSort = {
    columnId: string;
    direction: TableSortDirection;
};

export type TableSelectionMode = SelectionMode;

export type TableColumnPin = "start" | "end";

export type TableEntryKind = "row" | "detail";

export type TableEntry = {
    kind: TableEntryKind;
    layoutRow: number;
};

export type TableFocus = {
    cell: Index2d;
    isDetail: boolean;
};

export type TableAnnouncements = CarrierAnnouncements & {
    /**
     * Describes every reorderable column header while nothing is picked up, telling a keyboard user that Shift with
     * the left or right arrow moves it. Nothing else says the header can be moved.
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
    /** Which edge this column is held at while the rest scroll sideways, or nothing if it scrolls with them. */
    pin: TableColumnPin | undefined;
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
    /** Where this cell's row sits on screen, counting rows only and not the details open between them. */
    layoutRow: number;
    /** Whether this cell's row is selected. */
    isSelected: boolean;
    /** Whether this cell holds focus. */
    isFocused: boolean;
    /** Whether the pointer is over this cell. */
    isHovered: boolean;
    /** Whether this cell is turned off. */
    isDisabled: boolean;
    /** Which edge this cell's column is held at while the rest scroll sideways, or nothing if it scrolls with them. */
    pin: TableColumnPin | undefined;
    /** Whether this cell's row can open a detail beneath it. */
    isExpandable: boolean;
    /** Whether this cell's row has its detail open. */
    isExpanded: boolean;
};

export type TableDetailRenderProps = {
    /** Where the detail's row sits in the data. */
    dataRow: number;
    /** Where the detail's row sits on screen, counting rows only and not the details open between them. */
    layoutRow: number;
    /** Whether the detail's row is selected. */
    isSelected: boolean;
    /** Whether the detail holds focus. */
    isFocused: boolean;
    /** Whether the table is turned off. */
    isDisabled: boolean;
};

export type TableColumnPinDefs =
    | {
          /**
           * Holds the column still at the start or the end of the row while the other columns scroll sideways.
           * Pinned columns gather at their edge whatever `order` says, and a reader can reorder them only among
           * themselves. A pinned column needs `widthPx`, since where each pinned column is held is the sum of the
           * widths of the pinned columns before it.
           */
          pin: TableColumnPin;
          /** How wide the column is, in pixels. A width the reader sets by resizing wins over it. */
          widthPx: number;
      }
    | {
          pin?: undefined;
          /**
           * How wide the column is, in pixels. A width the reader sets by resizing wins over it. Without either, the
           * column shares out the room left over, between its minimum and maximum.
           */
          widthPx?: number;
      };

export type TableColumnDefs<T> = TableColumnPinDefs & {
    /** Names the column. It is what `sort`, `widths` and `order` refer to it by, so it is unique in the table. */
    id: string;
    /** The column's name in words, which is what a reader hears when the column is moved. */
    header: string;
    /** The narrowest the column can be, in pixels, by resizing or by sharing out room. Zero when left out. */
    minWidthPx?: number;
    /** The widest the column can be, in pixels, by resizing or by sharing out room. */
    maxWidthPx?: number;
    /** Whether the column can be sorted by. */
    isSortable?: boolean;
    /** Whether the column can be resized, which also needs the table's `widths`. */
    isResizable?: boolean;
    /** Whether the column can be moved, which also needs the table's `order`. */
    isReorderable?: boolean;
    /**
     * Orders two rows for this column, ascending. With it the table sorts the rows itself; without it a sortable
     * column only reports the sort, and the rows are left for the consumer to order.
     */
    compare?: (a: T, b: T) => number;
};

export type TableGrid = {
    rowCount: number;
    colCount: number;
};

export type TableKeyCommand =
    | { kind: "select_all" }
    | { kind: "focus"; cell: Index2d; isExtending: boolean }
    | { kind: "sort" }
    | { kind: "resize"; step: -1 | 1 }
    | { kind: "move_column"; to: number }
    | { kind: "activate_row"; rowIndex: number }
    | { kind: "toggle_row"; rowIndex: number }
    | { kind: "pick_row"; rowIndex: number; gesture: SelectionGesture };

export type BaseTableValues<T> = {
    /**
     * Names the table for assistive technology. It is required because nothing else can name it, and a page with two
     * unnamed grids gives a reader no way to tell them apart.
     */
    ariaLabel: string;
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
    /** Turns the table off, so nothing in it sorts, resizes, reorders, selects, or opens or closes a detail. */
    isDisabled?: boolean;
    /** The rows, in the order they are shown. */
    rows: T[];
};

export type BaseTableCbs<T> = {
    /**
     * Guesses how tall a row will be before it is drawn, which is what lets a long table render only what is on screen.
     * An open detail is guessed at its row's height until it has been drawn and measured.
     */
    computeEstimatedRowHeight?: (index: number) => number;
    /** Runs when the reader sorts by a different column, or reverses the one it is sorted by. */
    onSortChange?: (sort: TableSort | undefined) => void;
    /** Runs when the reader moves a column. */
    onOrderChange?: (order: string[]) => void;
    /** Names one row for assistive technology, so a reader hears what the row is rather than its number. */
    computeRowAriaLabel?: (row: T, index: number) => string;
    /** Runs when a row is activated, by pointer or by key. */
    onRowActivate?: (row: T, index: number) => void;
    /** Runs when the selection changes. */
    onSelectionChange?: (rows: T[]) => void;
    /**
     * Whether a row can open a detail beneath it. Every row can when it is left out, as long as the table draws
     * details at all.
     */
    computeIsExpandable?: (row: T) => boolean;
    /** Runs when a row's detail is opened or closed, with every row whose detail is now open. */
    onExpandedChange?: (rows: T[]) => void;
};

export type BaseTableProps<T> = BaseTableValues<T> & BaseTableCbs<T>;
