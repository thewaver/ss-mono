import { type Index2d, MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { CarrierZone, CarryNudge, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { SelectionMode } from "../../Abstracts/Selection/Selection.types";
import type {
    TableCellRenderProps,
    TableColumnDefs,
    TableColumnPin,
    TableColumnRenderProps,
    TableEntry,
    TableFocus,
    TableGrid,
    TableKeyCommand,
    TableSort,
    TableSortDirection,
} from "./Table.types";

/** What puts a carried column back. */
const CANCEL_KEY = "Escape";
/** What a repeated press of a column header steps through: up, down, then unsorted. */
const SORT_CYCLE: (TableSortDirection | undefined)[] = ["ascending", "descending", undefined];
/** The open rows when none is open, one array so an unchanged answer is the same array. */
const NO_EXPANDED_ROWS: number[] = [];

/** How many of a sorted list of rows come before a row. */
const countBefore = (sortedRows: number[], row: number) => {
    let low = 0;
    let high = sortedRows.length;

    while (low < high) {
        const middle = (low + high) >>> 1;

        if (sortedRows[middle] < row) low = middle + 1;
        else high = middle;
    }

    return low;
};

/** The order a column's pin puts it in: held at the start first, then scrolling, then held at the end. */
const getPinRank = (pin: TableColumnPin | undefined) => (pin === "start" ? 0 : pin === "end" ? 2 : 1);

/**
 * Sorting, column ordering and sizing for a table.
 *
 * Rows and columns are reordered as lists of indices rather than by rearranging the data, so the
 * caller's own array is never touched and a row's identity survives a re-sort — which is what lets a
 * selection or a keyboard cursor stay on the row it was on.
 */
export namespace TableUtils {
    /**
     * The row order for a sort.
     *
     * @param rows The rows as given.
     * @param column The column being sorted by.
     * @param sort Which column and which direction.
     * @returns The row indices in sorted order, or `undefined` when there is no sort in effect, the
     * sort names a different column, or the column has no comparison — in which case the rows are drawn
     * as given.
     */
    export const getSortedOrder = <T>(
        rows: T[],
        column: TableColumnDefs<T> | undefined,
        sort: TableSort | undefined,
    ): number[] | undefined => {
        if (!column || !sort || !column.compare || column.id !== sort.columnId) return undefined;

        const sign = sort.direction === "ascending" ? 1 : -1;

        return rows.map((_unused, index) => index).sort((a, b) => sign * column.compare!(rows[a], rows[b]));
    };

    /**
     * The column order for a list of column ids.
     *
     * @param columns The columns as declared.
     * @param order The ids in the order they should appear. Columns the list does not mention keep their
     * declared order and go last.
     * @returns The column indices in order, or `undefined` when that would be the declared order
     * anyway — which spares the caller a pointless remapping.
     */
    export const getColumnOrder = <T>(
        columns: TableColumnDefs<T>[],
        order: string[] | undefined,
    ): number[] | undefined => {
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

    /**
     * The column order once pinned columns are gathered at their edges.
     *
     * Columns held at the start come first and columns held at the end come last, each keeping the order it had
     * among its own kind, so a pinned column can never sit among the scrolling ones.
     *
     * @param columns The columns as declared.
     * @param order The column indices in order, as {@link getColumnOrder} gives them; `undefined` is the declared
     * order.
     * @returns The column indices in order, or `undefined` when that would be the declared order anyway. With no
     * pinned column, `order` comes back as it was.
     */
    export const getPinnedOrder = <T>(columns: TableColumnDefs<T>[], order: number[] | undefined) => {
        if (!columns.some((column) => column.pin !== undefined)) return order;

        const placed = (order ?? columns.map((_unused, index) => index))
            .map((index, position) => ({ index, position, rank: getPinRank(columns[index].pin) }))
            .sort((a, b) => a.rank - b.rank || a.position - b.position)
            .map((entry) => entry.index);

        return placed.every((value, index) => value === index) ? undefined : placed;
    };

    /**
     * Where each column is held while the rest scroll sideways.
     *
     * A column held at the start sits after the start-pinned columns before it, and one held at the end before the
     * end-pinned columns after it, so the offset is the sum of their widths.
     *
     * @param columns The columns, in the order they are drawn, pinned ones already gathered at their edges.
     * @param widths Widths set by dragging, by column id.
     * @returns For each column, its distance in pixels from the edge it is held at, or `undefined` for a column that
     * scrolls.
     */
    export const computePinOffsets = <T>(columns: TableColumnDefs<T>[], widths: Record<string, number>) => {
        const offsets: (number | undefined)[] = columns.map(() => undefined);

        let start = 0;

        columns.forEach((column, index) => {
            if (column.pin !== "start") return;

            offsets[index] = start;
            start += getColumnWidth(column, widths) ?? 0;
        });

        let end = 0;

        for (let index = columns.length - 1; index >= 0; index--) {
            if (columns[index].pin !== "end") continue;

            offsets[index] = end;
            end += getColumnWidth(columns[index], widths) ?? 0;
        }

        return offsets;
    };

    /**
     * Holds a column's new place among the columns pinned the way it is, which is as far as it can be moved.
     *
     * @param columns The columns, in the order they are drawn, pinned ones already gathered at their edges.
     * @param sourceIndex Where the moving column sits now.
     * @param place Where it is asked to go.
     * @returns The nearest place inside its own run of columns: the start-pinned, the scrolling or the end-pinned.
     */
    export const clampToPinGroup = <T>(columns: TableColumnDefs<T>[], sourceIndex: number, place: number) => {
        const pin = columns[sourceIndex]?.pin;

        let first = sourceIndex;
        let last = sourceIndex;

        while (first > 0 && columns[first - 1].pin === pin) first--;
        while (last < columns.length - 1 && columns[last + 1].pin === pin) last++;

        return MathUtils.clamp(place, first, last);
    };

    /**
     * The narrowest a table can be before its columns overflow it: every fixed width, and every other column's
     * minimum.
     *
     * Holding the table at least this wide keeps each row as wide as its columns, which is what lets a pinned column
     * stay held across the whole of a sideways scroll rather than only the width of the scroller.
     *
     * @param columns The columns.
     * @param widths Widths set by dragging, by column id.
     */
    export const computeMinTableWidth = <T>(columns: TableColumnDefs<T>[], widths: Record<string, number>) =>
        columns.reduce((sum, column) => sum + (getColumnWidth(column, widths) ?? column.minWidthPx ?? 0), 0);

    /**
     * The rows whose detail is open, by where they sit on screen.
     *
     * @param rows The rows, in the order they are drawn.
     * @param expanded The rows whose detail the consumer or reader has opened.
     * @param computeIsExpandable Whether a row can open a detail; a row that cannot is never open, whatever
     * `expanded` holds.
     * @returns The positions, ascending — the same empty array whenever nothing is open, so a table with no open
     * detail does no work for one.
     */
    export const getExpandedRows = <T>(
        rows: T[],
        expanded: T[],
        computeIsExpandable: ((row: T) => boolean) | undefined,
    ) => {
        if (expanded.length < 1) return NO_EXPANDED_ROWS;

        const open = new Set(expanded);
        const found = rows.reduce<number[]>((acc, row, index) => {
            if (open.has(row) && (computeIsExpandable?.(row) ?? true)) acc.push(index);

            return acc;
        }, []);

        return found.length < 1 ? NO_EXPANDED_ROWS : found;
    };

    /**
     * The open list with one row's detail opened or closed.
     *
     * @param expanded The rows open now.
     * @param row The row to open or close.
     * @returns A new list.
     */
    export const getToggledExpanded = <T>(expanded: T[], row: T) =>
        expanded.includes(row) ? expanded.filter((value) => value !== row) : [...expanded, row];

    /**
     * How many entries the body draws: every row, and a detail under each open one.
     *
     * @param rowCount How many rows there are.
     * @param expandedRows The open rows, from {@link getExpandedRows}.
     */
    export const getEntryCount = (rowCount: number, expandedRows: number[]) => rowCount + expandedRows.length;

    /**
     * Where a row sits among the body's entries, once the details open above it are counted.
     *
     * @param layoutRow Where the row sits among the rows.
     * @param expandedRows The open rows, from {@link getExpandedRows}.
     */
    export const getEntryIndex = (layoutRow: number, expandedRows: number[]) =>
        layoutRow + countBefore(expandedRows, layoutRow);

    /**
     * What the body draws at a place among its entries: a row, or the detail under one.
     *
     * @param entryIndex The place, counting from zero below the header.
     * @param expandedRows The open rows, from {@link getExpandedRows}.
     * @returns The kind of entry and the row it belongs to. A place past the end answers with a row past the end,
     * which the caller holds inside the table.
     */
    export const getEntry = (entryIndex: number, expandedRows: number[]): TableEntry => {
        let low = 0;
        let high = expandedRows.length;

        while (low < high) {
            const middle = (low + high) >>> 1;

            if (expandedRows[middle] + middle + 1 <= entryIndex) low = middle + 1;
            else high = middle;
        }

        if (low > 0 && expandedRows[low - 1] + low === entryIndex) {
            return { kind: "detail", layoutRow: expandedRows[low - 1] };
        }

        return { kind: "row", layoutRow: entryIndex - low };
    };

    /**
     * The cell the roving walk stands on, from the cell focus is held on.
     *
     * Focus is held by row rather than by place in the walk, so opening or closing a detail above it does not move
     * it to another row. A detail that has closed hands focus back to its row.
     *
     * @param focus The held cell, with the header as row zero and each row counted once, and whether it is the
     * detail under that row.
     * @param expandedRows The open rows, from {@link getExpandedRows}.
     * @returns The cell in the walk, where an open detail counts as a row of its own.
     */
    export const computeWalkCell = (focus: TableFocus, expandedRows: number[]): Index2d => {
        if (focus.cell.row === HEADER_ROW_INDEX) return focus.cell;

        const layoutRow = focus.cell.row - 1;
        const isDetail = focus.isDetail && expandedRows[countBefore(expandedRows, layoutRow)] === layoutRow;

        return { row: getEntryIndex(layoutRow, expandedRows) + (isDetail ? 1 : 0) + 1, col: focus.cell.col };
    };

    /**
     * The cell focus is held on, from a cell in the roving walk. The inverse of {@link computeWalkCell}.
     *
     * @param cell The cell in the walk, with the header as row zero.
     * @param expandedRows The open rows, from {@link getExpandedRows}.
     */
    export const computeFocus = (cell: Index2d, expandedRows: number[]): TableFocus => {
        if (cell.row === HEADER_ROW_INDEX) return { cell, isDetail: false };

        const entry = getEntry(cell.row - 1, expandedRows);

        return { cell: { row: entry.layoutRow + 1, col: cell.col }, isDetail: entry.kind === "detail" };
    };

    /**
     * The id a detail's cell carries, so the grid can move focus to it.
     *
     * @param tableId The table's own id.
     * @param layoutRow Where the detail's row sits among the rows.
     */
    export const getDetailId = (tableId: string, layoutRow: number) => `${tableId}-detail-${layoutRow}`;

    /** The attribute every detail's cell carries, so a key pressed inside one can be told apart. */
    export const DETAIL_ATTRIBUTE = "data-table-detail";

    /**
     * Whether a key was pressed on something inside one of this table's details rather than on the detail's cell,
     * which the grid then leaves to whatever has focus — a field, a link, a table of its own.
     *
     * @param target The element the key was pressed on.
     * @param root The table's own element. A detail of a table nested inside it is that table's business.
     */
    export const getIsInsideDetail = (target: EventTarget | null, root: HTMLElement) => {
        const element = target as HTMLElement | null;
        const detail = element?.closest?.(`[${DETAIL_ATTRIBUTE}]`);

        return detail != null && detail !== element && root.contains(detail);
    };

    /**
     * Applies an order to a list.
     *
     * @param entries The rows or columns as given.
     * @param order The indices in the order wanted. `undefined` leaves the list alone.
     */
    export const getReordered = <T>(entries: T[], order: number[] | undefined) =>
        order === undefined ? entries : order.map((index) => entries[index]);

    /**
     * The sort that a press on a column header produces.
     *
     * Pressing the same header repeatedly goes up, down, then back to unsorted; pressing a different
     * header starts that column at ascending. The unsorted third state matters — without it there is no
     * way back to the order the rows arrived in.
     *
     * @param current The sort in effect, if any.
     * @param columnId The header pressed.
     * @returns The new sort, or `undefined` for unsorted.
     */
    export const getNextSort = (current: TableSort | undefined, columnId: string): TableSort | undefined => {
        const position = current?.columnId === columnId ? SORT_CYCLE.indexOf(current.direction) : -1;
        const direction = SORT_CYCLE[(position + 1) % SORT_CYCLE.length];

        return direction === undefined ? undefined : { columnId, direction };
    };

    /**
     * A column's width in pixels, if it has a fixed one.
     *
     * @param column The column.
     * @param widths Widths set by dragging, by column id. These win over the declared width, since the
     * user asked for them. Only a width stored under the column's own id counts, so an id such as `constructor`
     * never picks up something inherited.
     * @returns The width, or `undefined` for a column that should flex.
     */
    export const getColumnWidth = <T>(column: TableColumnDefs<T>, widths: Record<string, number>) =>
        (Object.hasOwn(widths, column.id) ? widths[column.id] : undefined) ?? column.widthPx;

    /**
     * A column's CSS grid track.
     *
     * @param column The column.
     * @param widths Widths set by dragging, by column id.
     * @returns A fixed length for a column with a width, otherwise a range between its minimum and
     * maximum — flexing to fill the leftover space where it has no maximum.
     */
    export const getColumnTrack = <T>(column: TableColumnDefs<T>, widths: Record<string, number>) => {
        const width = getColumnWidth(column, widths);

        if (width !== undefined) return `${width}px`;

        const min = column.minWidthPx ?? 0;
        const max = column.maxWidthPx;

        return `minmax(${min}px, ${max === undefined ? "1fr" : `${max}px`})`;
    };

    /**
     * The whole `grid-template-columns` value for a table.
     *
     * @param columns The columns, in the order they are drawn.
     * @param widths Widths set by dragging, by column id.
     */
    export const getColumnTemplate = <T>(columns: TableColumnDefs<T>[], widths: Record<string, number>) =>
        columns.map((column) => getColumnTrack(column, widths)).join(" ");

    /**
     * A dragged width, held inside the column's own limits.
     *
     * @param column The column being resized.
     * @param width The width the drag asks for.
     */
    export const getResizedWidth = <T>(column: TableColumnDefs<T>, width: number) =>
        MathUtils.clamp(width, column.minWidthPx ?? 0, column.maxWidthPx ?? Number.MAX_SAFE_INTEGER);

    /** The header row's index in the roving walk, which counts it as row zero above the body rows. */
    export const HEADER_ROW_INDEX = 0;

    /** What ARIA counts rows and columns from. */
    export const FIRST_ARIA_INDEX = 1;

    /**
     * The id a cell carries, so the grid can move focus to it by position.
     *
     * @param tableId The table's own id.
     * @param cell The cell, with the header row as row zero.
     */
    export const getCellId = (tableId: string, cell: Index2d) => `${tableId}-cell-${cell.row}-${cell.col}`;

    /**
     * Holds a cell inside the grid.
     *
     * @param cell The cell, which may have been asked for outside the grid.
     * @param grid How many rows, the header row included, and columns there are.
     * @returns The nearest cell inside the grid, or the cell as given when the grid has no columns.
     */
    export const clampCell = (cell: Index2d, grid: TableGrid): Index2d => {
        if (grid.colCount < 1) return cell;

        return {
            row: MathUtils.clamp(cell.row, HEADER_ROW_INDEX, grid.rowCount - 1),
            col: MathUtils.clamp(cell.col, 0, grid.colCount - 1),
        };
    };

    /**
     * Whether a table selects nothing, one row or many.
     *
     * @param mode The mode the consumer asked for, if any.
     * @param hasSelection Whether the consumer handed over a selection. Handing one over is what turns selection
     * on, so a table given a selection and no mode selects many.
     */
    export const getSelectionMode = (mode: SelectionMode | undefined, hasSelection: boolean): SelectionMode =>
        mode ?? (hasSelection ? "multiple" : "none");

    /**
     * What a key pressed inside the grid asks for.
     *
     * The decision tree, in the order it is checked: Ctrl or Cmd with A selects every row; Ctrl with Home or End
     * goes to the grid's first or last cell. On the header row, Enter or Space sorts, Ctrl with Left or Right
     * resizes, and Shift with Left or Right moves the column. On a body row, Enter on the first cell of a row that
     * can open a detail opens or closes it, Enter anywhere else activates the row, and Space picks it — toggling it,
     * or extending the run with Shift. On an open detail, which is one cell as wide as the row, only the walk up and
     * down applies. Anything else goes through the arrow, page and edge walk, held inside the grid, and a Shift-held
     * walk onto a row extends the selection to it. Left and right are read in reading order.
     *
     * @param e The key and the modifiers held with it.
     * @param from The roving cell, with the header row as row zero and each open detail a row of its own.
     * @param grid How many rows, the header row and open details included, and columns there are.
     * @param opts.direction The layout direction.
     * @param opts.pageRows How many rows Page Up and Page Down move by.
     * @param opts.expandedRows The open rows, from {@link getExpandedRows}. Leave it out when nothing can open.
     * @param opts.computeIsExpandable Whether the row at a screen position can open a detail. Leave it out when
     * nothing can, and Enter always activates.
     * @returns The command, or `undefined` for a key the grid leaves alone. Whether a command is allowed — the table
     * disabled, the column not sortable — is the caller's to decide.
     */
    export const computeKeyCommand = (
        e: { key: string; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean },
        from: Index2d,
        grid: TableGrid,
        opts: {
            direction: NavigatorDirection | undefined;
            pageRows: number;
            expandedRows?: number[];
            computeIsExpandable?: (layoutRow: number) => boolean;
        },
    ): TableKeyCommand | undefined => {
        if (grid.colCount < 1) return undefined;

        const expandedRows = opts.expandedRows ?? NO_EXPANDED_ROWS;

        if (e.key === "a" && (e.ctrlKey || e.metaKey)) return { kind: "select_all" };

        if (e.ctrlKey && (e.key === "Home" || e.key === "End")) {
            return {
                kind: "focus",
                cell:
                    e.key === "Home"
                        ? { row: HEADER_ROW_INDEX, col: 0 }
                        : { row: grid.rowCount - 1, col: grid.colCount - 1 },
                isExtending: false,
            };
        }

        const logicalKey = NavigatorUtils.computeLogicalKey(e.key, opts.direction);
        const isHorizontalArrow = logicalKey === "ArrowLeft" || logicalKey === "ArrowRight";

        if (from.row === HEADER_ROW_INDEX) {
            if (NavigatorUtils.getIsActivationKey(e.key)) return { kind: "sort" };
            if (e.ctrlKey && isHorizontalArrow) return { kind: "resize", step: logicalKey === "ArrowLeft" ? -1 : 1 };
            if (e.shiftKey && isHorizontalArrow) {
                return { kind: "move_column", to: from.col + (logicalKey === "ArrowLeft" ? -1 : 1) };
            }
        } else {
            const entry = getEntry(from.row - 1, expandedRows);

            if (entry.kind === "detail") {
                if (isHorizontalArrow || e.key === "Home" || e.key === "End") return undefined;
                if (NavigatorUtils.getIsActivationKey(e.key)) return undefined;
            } else {
                if (e.key === "Enter") {
                    return from.col === 0 && opts.computeIsExpandable?.(entry.layoutRow) === true
                        ? { kind: "toggle_row", rowIndex: entry.layoutRow }
                        : { kind: "activate_row", rowIndex: entry.layoutRow };
                }

                if (e.key === " ") {
                    return {
                        kind: "pick_row",
                        rowIndex: entry.layoutRow,
                        gesture: { isToggling: !e.shiftKey, isExtending: e.shiftKey },
                    };
                }
            }
        }

        const next = NavigatorUtils.computeNextCell(e.key, from, grid, {
            pageRows: opts.pageRows,
            direction: opts.direction,
        });

        if (next === undefined) return undefined;

        const cell = clampCell(next, grid);

        const isOnRow = cell.row > HEADER_ROW_INDEX && getEntry(cell.row - 1, expandedRows).kind === "row";

        return { kind: "focus", cell, isExtending: e.shiftKey && isOnRow };
    };

    /**
     * Puts a carried column back when Escape is pressed, wherever focus is, for as long as it listens.
     *
     * The grid's own keys never see a carry through: a column picked up by its grip leaves focus on its header
     * cell, but one being dragged may have left focus anywhere, so the key is listened for on the document. Only a
     * carry that began in `zone` is canceled, which returns the column to where it was and is announced in the
     * zone's own words, as every other carrier's cancel is; any other Escape is left alone.
     *
     * @param zone The table's carry zone.
     * @returns A function that stops listening. Listen while a carry from this table is in flight, and stop when it
     * ends.
     */
    export const observeCarryCancel = (zone: CarrierZone) => {
        const cancelOnEscape = (e: KeyboardEvent) => {
            if (e.key !== CANCEL_KEY || CarrierUtils.getSourceZone() !== zone) return;

            e.preventDefault();
            CarrierUtils.end("cancel");
        };

        document.addEventListener("keydown", cancelOnEscape);

        return () => document.removeEventListener("keydown", cancelOnEscape);
    };

    /**
     * The width a resize drag asks for, from where it started and how far the pointer has travelled.
     *
     * @param startWidth The column's width when the drag began.
     * @param travel How far the pointer has moved along the row, in client pixels, rightwards positive.
     * @param direction The layout direction; in right-to-left a column grows as the pointer moves left.
     * @returns The width, before the column's own limits are applied.
     */
    export const computeDraggedWidth = (
        startWidth: number,
        travel: number,
        direction: NavigatorDirection | undefined,
    ) => startWidth + (direction === "rtl" ? -travel : travel);

    /**
     * The width a press on a resizer asks for when it ends without a drag: one step towards the half of the handle
     * it landed on, which is the single-pointer route WCAG 2.5.7 asks for.
     *
     * @param params Where the press landed, the handle's client rect, the column's width, the step, and the layout
     * direction.
     * @returns The width, before the column's own limits are applied.
     */
    export const computePressedWidth = (params: {
        clientX: number;
        rect: DOMRect;
        width: number;
        step: number;
        direction: NavigatorDirection | undefined;
    }) => {
        const { clientX, rect, width, step, direction } = params;
        const isLeftHalf = clientX < rect.left + rect.width * 0.5;

        return width + (isLeftHalf === (direction === "rtl") ? step : -step);
    };

    /**
     * Where a carried column would land, from the pointer.
     *
     * @param headerRects The header cells' client rects, in layout order.
     * @param point The pointer's client position.
     * @param sourceIndex Where the carried column sits now.
     * @param direction The layout direction.
     * @returns The column index it would settle at once it has left its old place.
     */
    export const computeColumnPlaceAtPoint = (
        headerRects: DOMRect[],
        point: Point2d,
        sourceIndex: number,
        direction: NavigatorDirection | undefined,
    ) =>
        CarrierUtils.computeSettledIndex(
            CarrierUtils.computeDropIndex(headerRects, point.x, point.y, "horizontal", direction),
            sourceIndex,
            true,
        );

    /**
     * Where a keyboard nudge takes a carried column, held inside the row.
     *
     * @param place The column index it is aimed at now.
     * @param nudge The nudge; either axis steps it one column.
     * @param columnCount How many columns there are.
     * @returns The new column index, or `undefined` for a nudge that goes nowhere.
     */
    export const computeColumnNudgedPlace = (place: CarryPlace, nudge: CarryNudge, columnCount: number) => {
        const step = (nudge.x ?? 0) + (nudge.y ?? 0);

        if (step === 0) return undefined;

        return MathUtils.clamp((place as number) + step, 0, columnCount - 1);
    };

    /**
     * Which header cell draws the drop marker, from where a carried column is aimed.
     *
     * @param targetPlace The column index it would settle at.
     * @param sourceIndex Where it sits now.
     * @returns The cell whose leading edge the marker sits on; the column count means past the last cell.
     */
    export const computeLandingCol = (targetPlace: CarryPlace, sourceIndex: number) =>
        CarrierUtils.computeMarkerIndex(targetPlace as number, sourceIndex, true);

    /**
     * Whether a click inside a cell landed on a control of the consumer's inside it, which the cell then leaves
     * alone rather than selecting its row.
     *
     * @param target The element the click landed on.
     * @param cell The cell that heard it.
     */
    export const getIsInteractiveInCell = (target: EventTarget | null, cell: HTMLElement) => {
        const interactive = (target as HTMLElement | null)?.closest(CarrierUtils.INTERACTIVE_SELECTOR);

        return interactive != null && cell.contains(interactive);
    };

    /**
     * The `aria-sort` a header cell carries.
     *
     * @param column The column.
     * @param sortDirection Which way the table is sorted by it, if at all.
     * @returns The direction, `"none"` for a sortable column not sorted by, and `undefined` for one that cannot be
     * sorted, which takes no `aria-sort` at all.
     */
    export const computeAriaSort = <T>(column: TableColumnDefs<T>, sortDirection: TableSortDirection | undefined) =>
        column.isSortable === true ? (sortDirection ?? "none") : undefined;

    /**
     * What a header's painter is told about its column.
     *
     * @param params The column, where it sits in the data and on screen, the sort in effect, what the table allows of
     * it, and which column is being resized, carried, focused and hovered.
     */
    export const computeColumnRenderProps = <T>(params: {
        column: TableColumnDefs<T>;
        dataCol: number;
        layoutCol: number;
        sort: TableSort | undefined;
        roving: Index2d;
        isReorderable: boolean;
        isResizable: boolean;
        resizingColumnId: string;
        carriedColumnId: unknown;
        hoveredColumn: number | undefined;
        isDisabled: boolean;
    }): TableColumnRenderProps => {
        const { column, layoutCol, sort, roving } = params;

        return {
            columnId: column.id,
            dataCol: params.dataCol,
            layoutCol,
            sortDirection: sort?.columnId === column.id ? sort.direction : undefined,
            isSortable: column.isSortable ?? false,
            isReorderable: params.isReorderable,
            isResizable: params.isResizable,
            isResizing: params.resizingColumnId === column.id,
            isCarried: params.carriedColumnId === column.id,
            isFocused: roving.row === HEADER_ROW_INDEX && roving.col === layoutCol,
            isHovered: params.hoveredColumn === layoutCol,
            isDisabled: params.isDisabled,
            pin: column.pin,
        };
    };

    /**
     * What a body cell's painter is told about its cell.
     *
     * @param params The column's id, where the cell's column and row sit in the data and on screen, whether its row
     * is selected, the roving cell, the hovered row, whether the table is disabled, the edge the column is pinned
     * to, and whether the row can open a detail and has. `roving` names the cell by row, each row counted once, so
     * a detail open above it does not shift it; a roving detail is not a cell, and is left out of it.
     */
    export const computeCellRenderProps = (params: {
        columnId: string;
        dataCol: number;
        layoutCol: number;
        dataRow: number;
        layoutRow: number;
        isSelected: boolean;
        roving: Index2d;
        hoveredRow: number | undefined;
        isDisabled: boolean;
        pin?: TableColumnPin;
        isExpandable?: boolean;
        isExpanded?: boolean;
    }): TableCellRenderProps => ({
        columnId: params.columnId,
        dataCol: params.dataCol,
        layoutCol: params.layoutCol,
        dataRow: params.dataRow,
        layoutRow: params.layoutRow,
        isSelected: params.isSelected,
        isFocused: params.roving.row === params.layoutRow + 1 && params.roving.col === params.layoutCol,
        isHovered: params.hoveredRow === params.layoutRow,
        isDisabled: params.isDisabled,
        pin: params.pin,
        isExpandable: params.isExpandable ?? false,
        isExpanded: params.isExpanded ?? false,
    });

    /**
     * Warns about a header that gives a pointer no way to do what its column allows.
     *
     * A sortable column with no `TableHeaderSort` can only be sorted with Enter, and a reorderable one with no
     * `TableHeaderReorder` can only be reordered by dragging, which fails WCAG 2.5.7.
     *
     * @param column The column.
     * @param found Whether the column is reorderable, and which of the two controls its header rendered.
     */
    export const warnIfHeaderControlsMissing = <T>(
        column: TableColumnDefs<T>,
        found: { isReorderable: boolean; hasSortControl: boolean; hasReorderGrip: boolean },
    ) => {
        if (column.isSortable === true && !found.hasSortControl) {
            console.warn(
                `Table: column "${column.id}" is sortable but its header renders no TableHeaderSort, so a pointer cannot sort it — only Enter on the header cell can.`,
            );
        }

        if (found.isReorderable && !found.hasReorderGrip) {
            console.warn(
                `Table: column "${column.id}" is reorderable but its header renders no TableHeaderReorder, so the only pointer route is dragging, which fails WCAG 2.5.7 Dragging Movements.`,
            );
        }
    };

    /**
     * Warns about a table whose rows can open a detail while none of them renders a `TableRowExpander`, so a pointer
     * cannot open one and only Enter on a row's first cell can.
     */
    export const warnIfExpanderMissing = () => {
        console.warn(
            "Table: its rows can open a detail but no row renders a TableRowExpander, so a pointer cannot open one — only Enter on a row's first cell can.",
        );
    };

    /**
     * Warns about a row control rendered outside any body cell, where it has no row to act on.
     *
     * @param control The control's name, for the message.
     */
    export const warnOutsideCell = (control: string) => {
        console.warn(
            `${control}: no Table body cell around it — it has no row to act on and renders nothing. Render it from a column's renderCell.`,
        );
    };

    /**
     * Warns about a header control rendered outside any header cell, where it has no column to act on.
     *
     * @param control The control's name, for the message.
     */
    export const warnOutsideHeader = (control: string) => {
        console.warn(
            `${control}: no Table header cell around it — it has no column to act on and renders nothing. Render it from a column's renderHeader.`,
        );
    };
}
