import type { Accessor, JSX } from "solid-js";

import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";
import type { SelectionMode } from "../../Abstracts/Selection/Selection.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

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

export type TableOrderProps =
    | (AccessorProps<{
          /**
           * Everything the table says aloud while a column is reordered, and the key hints and place names those
           * announcements are built from. There is no default: every word a reader hears comes from here. It is
           * required exactly when `orderSignal` is given, because that is the only table that speaks any of it.
           */
          announcements: TableAnnouncements;
      }> & {
          /** The order the columns are shown in, by column id. It is the only thing that reorders them. */
          orderSignal: SignalSource<string[]>;
      })
    | {
          announcements?: undefined;
          orderSignal?: undefined;
      };

export type TableProps<T> = TableOrderProps &
    AccessorProps<{
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
        /** Turns the table off, so nothing in it sorts, resizes, reorders or selects. */
        isDisabled?: boolean;
        /** Which column the table is sorted by and which way. It is the only thing that sorts it. */
        sortSignal?: SignalSource<TableSort | undefined>;
        /** How wide each column is, by column id. It is the only thing that resizes them. */
        widthsSignal?: SignalSource<Record<string, number>>;
        /**
         * Guesses how tall a row will be before it is drawn, which is what lets a long table render only what is on screen.
         */
        computeEstimatedRowHeight?: (index: number) => number;
        /** Draws the grab handle between two columns. */
        renderResizer?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
        /**
         * Draws what sits inside the control that sorts a column.
         *
         * A header cell is no longer a target of its own: sorting and reordering each have their own control, so
         * a tap can only ever mean one of them. The component renders both boxes and the consumer paints inside,
         * exactly as {@link TableProps.renderResizer} already works — so an unpainted control is invisible but
         * still hit-testable, and sorting does not quietly stop working for a consumer who never drew an arrow.
         *
         * **Three targets now share a header cell**, and 2.5.8 Target Size wants a 24 CSS pixel circle centered on
         * each undersized one to clear the others — so their centers need roughly that much space between them,
         * which is the consumer's to arrange.
         */
        renderSortControl?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
        /**
         * Draws what sits inside the control that picks a column up to move it.
         *
         * Tapping it picks the column up; tapping another header drops it there. That is the single-pointer route
         * 2.5.7 asks for, and it is why reordering needed a control of its own — a tap on the header could not
         * mean both "sort" and "pick up". Dragging from anywhere on the header still works and is unchanged.
         */
        renderReorderGrip?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
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
