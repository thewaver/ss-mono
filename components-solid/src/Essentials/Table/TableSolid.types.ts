import type { Accessor, JSX } from "solid-js";

import type {
    BaseTableCbs,
    BaseTableValues,
    TableAnnouncements,
    TableCellRenderProps,
    TableColumnDefs,
    TableColumnRenderProps,
    TableDetailRenderProps,
    TableSort,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type TableColumn<T> = TableColumnDefs<T> & {
    /**
     * Draws the column's header. A sortable column puts a `TableHeaderSort` in it and a reorderable one a
     * `TableHeaderReorder`, wherever they belong; without them the column can only be sorted from the keyboard, or
     * reordered by dragging, and the table warns about it.
     */
    renderHeader: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
    /**
     * Draws one of the column's cells. In a table whose rows open a detail, a `TableRowExpander` goes in one of the
     * row's cells, usually the first; without one a pointer cannot open a detail, and the table warns about it.
     */
    renderCell: (getRow: Accessor<T>, getRenderProps: () => TableCellRenderProps) => JSX.Element;
};

export type TableOrderProps =
    | (AccessorProps<{
          /**
           * Everything the table says aloud while a column is reordered, and the key hints and place names those
           * announcements are built from. There is no default: every word a reader hears comes from here. It is
           * required exactly when `order` is given, because that is the only table that speaks any of it.
           */
          announcements: TableAnnouncements;
      }> & {
          /** The order the columns are shown in, by column id. It is the only thing that reorders them. */
          order: SignalSource<string[]>;
      })
    | {
          announcements?: undefined;
          order?: undefined;
      };

export type TableProps<T> = TableOrderProps &
    AccessorValues<BaseTableValues<T>> &
    BaseTableCbs<T> &
    AccessorProps<{
        /** Which column the table is sorted by and which way. It is the only thing that sorts it. */
        sort?: SignalSource<TableSort | undefined>;
        /** How wide each column is, by column id. It is the only thing that resizes them. */
        widths?: SignalSource<Record<string, number>>;
        /** Draws the grab handle between two columns. */
        renderResizer?: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
        /** Draws the line showing where a dragged column would land. */
        renderMarker?: () => JSX.Element;
    }> & {
        /** The columns, each carrying its own id and how it is drawn. */
        columns: MaybeAccessor<TableColumn<T>[]>;
        /** Which rows are selected. It is the only thing that selects them. */
        selection?: SignalSource<T[]>;
        /**
         * Draws the detail a row opens beneath it, as wide as the row. Giving it is what lets rows open, and makes
         * the table a tree grid, whose rows say whether they are open. A reader opens and closes a row with Enter on
         * its first cell, which then no longer activates the row, and walks down into the open detail with the down
         * arrow.
         */
        renderDetail?: (getRow: Accessor<T>, getRenderProps: () => TableDetailRenderProps) => JSX.Element;
        /**
         * Which rows have their detail open. Both sides write it: the table when a reader opens or closes a row, the
         * consumer to open or close rows from outside. Leave it out and the table keeps the state itself, starting
         * with every row closed.
         */
        expanded?: SignalSource<T[]>;
    };

export type TableHeaderControlProps = {
    /** Draws what sits inside the control, from the state of the column whose header it is in. */
    renderContent: (getRenderProps: () => TableColumnRenderProps) => JSX.Element;
};

/**
 * The control that sorts a column, placed by the consumer anywhere inside the column's header.
 *
 * A header cell is not a target of its own: sorting and reordering each have their own control, so a tap can only ever
 * mean one of them. The control keeps a press from reaching the header, so it never starts a column drag, focuses its
 * own cell before acting, and stays out of the tab order and hidden from screen readers — the cell is the one tab stop,
 * and Enter on it sorts. Three targets can share a header cell, and
 * {@link https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html 2.5.8 Target Size} wants a 24 CSS pixel
 * circle centered on each undersized one to clear the others, so painting each control at 24 pixels is the simple way
 * to meet it. It renders nothing in a column that is not sortable.
 */
export type TableHeaderSortProps = TableHeaderControlProps;

/**
 * The control that picks a column up to move it, placed by the consumer anywhere inside the column's header.
 *
 * Tapping it picks the column up; tapping another header drops it there. That is the single-pointer route
 * {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html 2.5.7} asks for, and it is why reordering
 * needs a control of its own — a tap on the header could not mean both "sort" and "pick up". Dragging from anywhere on
 * the header still works. It follows the same rules as the sort control, and renders nothing in a column that is not
 * reorderable.
 */
export type TableHeaderReorderProps = TableHeaderControlProps;

/**
 * The control that opens and closes a row's detail, placed by the consumer anywhere inside one of the row's cells.
 *
 * It is the pointer's way to open a detail; a keyboard opens one with Enter on the row's first cell. It focuses its own
 * cell before acting and stays out of the tab order and hidden from screen readers, since the cell is the tab stop and
 * the row says whether it is open.
 * {@link https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html 2.5.8 Target Size} wants it at least 24
 * CSS pixels across, or with room around it. It renders nothing in a row that cannot open.
 */
export type TableRowExpanderProps = {
    /** Draws what sits inside the control, from the state of the cell it is in, which says whether the row is open. */
    renderContent: (getRenderProps: () => TableCellRenderProps) => JSX.Element;
};
