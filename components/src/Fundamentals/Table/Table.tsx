import type { Accessor } from "solid-js";
import { For, Index, Show, createMemo, createSignal, createUniqueId } from "solid-js";

import { type Index2d, MathUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { CarrierZone } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { CarrierStack } from "../../Abstracts/Carrier/CarrierStack";
import { LiveAnnouncer } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { Virtualizer } from "../../Abstracts/Virtualizer/Virtualizer";
import type { VirtualizerRow } from "../../Abstracts/Virtualizer/Virtualizer.types";
import { access } from "../../Utils/propUtils";
import type {
    TableCellRenderProps,
    TableColumn,
    TableColumnRenderProps,
    TableProps,
    TableSelectionMode,
} from "./Table.types";
import { TableUtils } from "./Table.utils";

import * as styles from "./Table.css";

const HEADER_ROW_INDEX = 0;
const FIRST_ARIA_INDEX = 1;

const DEFAULT_RESIZE_STEP_PX = 8;
const DEFAULT_RESIZER_WIDTH_PX = 8;
const DEFAULT_PAGE_ROWS = 10;

const NO_RESIZING = "";

const EMPTY_PINNED_ROWS: number[] = [];
const EMPTY_WIDTHS: Record<string, number> = {};
const EMPTY_ORDER: string[] = [];
const EMPTY_SELECTION: never[] = [];

const INTERACTIVE_SELECTOR =
    "a[href], button, input, select, textarea, [role='button'], [role='checkbox'], [role='link'], [role='switch']";

export const Table = <T,>(props: TableProps<T>) => {
    const tableId = createUniqueId();

    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();
    const [getHeaderRef, setHeaderRef] = createSignal<HTMLElement>();
    const [getFocusedCell, setFocusedCell] = createSignal<Index2d>({ row: HEADER_ROW_INDEX, col: 0 });
    const [getHoveredRow, setHoveredRow] = createSignal<number>();
    const [getHoveredColumn, setHoveredColumn] = createSignal<number>();
    const [getResizingColumnId, setResizingColumnId] = createSignal(NO_RESIZING);

    const getDeclaredColumns = createMemo(() => access(props.columns));

    const getColumnOrder = createMemo(() =>
        TableUtils.getColumnOrder(getDeclaredColumns(), props.orderSignal?.[0]() ?? EMPTY_ORDER),
    );

    const getColumns = createMemo(() => TableUtils.getReordered(getDeclaredColumns(), getColumnOrder()));

    const getDataCol = (layoutCol: number) => getColumnOrder()?.[layoutCol] ?? layoutCol;

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getWidths = createMemo(() => props.widthsSignal?.[0]() ?? EMPTY_WIDTHS);

    const getSort = createMemo(() => props.sortSignal?.[0]());

    const getSelection = createMemo(() => props.selectionSignal?.[0]() ?? EMPTY_SELECTION);

    const getSelectionMode = createMemo(
        (): TableSelectionMode => access(props.selectionMode) ?? (props.selectionSignal ? "multiple" : "none"),
    );

    const getSortedColumn = createMemo(() => {
        const sort = getSort();

        return sort === undefined ? undefined : getColumns().find((column) => column.id === sort.columnId);
    });

    const getRowOrder = createMemo(() => TableUtils.getSortedOrder(access(props.rows), getSortedColumn(), getSort()));

    const getRows = createMemo(() => TableUtils.getReordered(access(props.rows), getRowOrder()));

    const getDataRow = (layoutRow: number) => getRowOrder()?.[layoutRow] ?? layoutRow;

    const getTemplate = createMemo(() => TableUtils.getColumnTemplate(getColumns(), getWidths()));

    const getIsVirtualized = createMemo(() => props.computeEstimatedRowHeight !== undefined);

    const getGrid = createMemo(() => ({ width: getColumns().length, height: getRows().length + 1 }));

    const getRovingCell = createMemo(() => {
        const cell = getFocusedCell();
        const grid = getGrid();

        if (grid.width < 1) return cell;

        return {
            row: MathUtils.clamp(cell.row, HEADER_ROW_INDEX, grid.height - 1),
            col: MathUtils.clamp(cell.col, 0, grid.width - 1),
        };
    });

    const rowWindow = Virtualizer.createRowWindow(getBodyRef, () => getRows().length, {
        getIsEnabled: getIsVirtualized,
        computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
        getPinnedRows: () => {
            const cell = getRovingCell();

            return cell.row === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [cell.row - 1];
        },
    });

    const getCellId = (cell: Index2d) => `${tableId}-cell-${cell.row}-${cell.col}`;

    const getIsRoving = (cell: Index2d) => {
        const roving = getRovingCell();

        return roving.col === cell.col && roving.row === cell.row;
    };

    const focusCell = (cell: Index2d) => {
        setFocusedCell(cell);

        if (cell.row > HEADER_ROW_INDEX && rowWindow.getIsLive()) rowWindow.scrollToRow(cell.row - 1);

        document.getElementById(getCellId(cell))?.focus();
    };

    const toggleSort = (column: TableColumn<T> | undefined) => {
        if (!column || column.isSortable !== true || getIsDisabled()) return;

        const next = TableUtils.getNextSort(getSort(), column.id);

        props.sortSignal?.[1](next);

        void props.onSortChange?.(next);
    };

    let anchorRowIndex = 0;

    const setSelection = (rows: T[]) => {
        props.selectionSignal?.[1](rows);

        void props.onSelectionChange?.(rows);
    };

    const selectRow = (rowIndex: number, opts?: { isToggling?: boolean; isExtending?: boolean }) => {
        const mode = getSelectionMode();

        if (mode === "none" || getIsDisabled()) return;

        const rows = getRows();
        const row = rows[rowIndex];

        if (row === undefined) return;

        if (mode === "single") {
            anchorRowIndex = rowIndex;

            setSelection(opts?.isToggling && getSelection().includes(row) ? [] : [row]);

            return;
        }

        if (opts?.isExtending) {
            const range = TableUtils.getRangeIndices(anchorRowIndex, rowIndex).map((position) => rows[position]);

            setSelection(TableUtils.getMergedSelection(getSelection(), range));

            return;
        }

        anchorRowIndex = rowIndex;

        setSelection(opts?.isToggling ? TableUtils.getToggledSelection(getSelection(), row) : [row]);
    };

    const selectAllRows = () => {
        if (getSelectionMode() !== "multiple" || getIsDisabled()) return;

        setSelection([...getRows()]);
    };

    const getCurrentWidth = (column: TableColumn<T>, columnIndex: number) =>
        TableUtils.getColumnWidth(column, getWidths()) ??
        document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
        0;

    const getIsResizable = (column: TableColumn<T>) =>
        (column.isResizable ?? false) && props.widthsSignal !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || getIsDisabled()) return;

        const next = TableUtils.getResizedWidth(column, width);

        props.widthsSignal?.[1]({ ...getWidths(), [column.id]: next });
    };

    let resizeStartX = 0;
    let resizeStartWidth = 0;

    const handleResizerPointerDown = (e: PointerEvent, column: TableColumn<T>, columnIndex: number) => {
        if (e.button !== 0 || getIsDisabled()) return;

        e.preventDefault();
        e.stopPropagation();

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

        resizeStartX = e.clientX;
        resizeStartWidth = getCurrentWidth(column, columnIndex);

        setResizingColumnId(column.id);
    };

    const handleResizerPointerMove = (e: PointerEvent, column: TableColumn<T>) => {
        if (getResizingColumnId() !== column.id) return;

        resizeColumn(column, resizeStartWidth + e.clientX - resizeStartX);
    };

    const handleResizerPointerUp = (e: PointerEvent, column: TableColumn<T>) => {
        if (getResizingColumnId() !== column.id) return;

        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

        setResizingColumnId(NO_RESIZING);
    };

    const getIsReorderable = (column: TableColumn<T> | undefined) =>
        column !== undefined && (column.isReorderable ?? false) && props.orderSignal !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        const columns = getColumns();

        if (!getIsReorderable(columns[fromIndex]) || getIsDisabled()) return;
        if (toIndex < 0 || toIndex >= columns.length) return;

        const next = CarrierUtils.computeMovedOrder(
            columns.map((column) => column.id),
            fromIndex,
            toIndex,
        );

        props.orderSignal?.[1](next);

        void props.onOrderChange?.(next);
    };

    const zone: CarrierZone = {
        getGroupId: () => tableId,
        getLabel: () => access(props.ariaLabel) ?? "",
        getRootRef: getHeaderRef,
        getDir: () => "row",
        getIsDisabled: () => getIsDisabled() || props.orderSignal === undefined,
        getLength: () => getColumns().length,
        getItemRects: () =>
            getColumns().reduce<DOMRect[]>((acc, _unused, columnIndex) => {
                const element = document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }));

                if (element) acc.push(element.getBoundingClientRect());

                return acc;
            }, []),
        computeCanAccept: () => !getIsDisabled() && props.orderSignal !== undefined,
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: moveColumn,
    };

    CarrierStack.registerZone(zone);

    const getCarriedColumnId = createMemo(() =>
        CarrierStack.getSourceZone() === zone ? CarrierStack.getCarry()?.key : undefined,
    );

    const getLandingCol = createMemo(() => {
        const settledIndex = CarrierStack.getTargetIndex();

        if (CarrierStack.getTargetZone() !== zone || settledIndex === undefined) return;

        return CarrierUtils.computeMarkerIndex(settledIndex, CarrierStack.getSourceIndex() ?? 0, true);
    });

    let hasCarriedClick = false;

    const handleHeaderPointerDown = (e: PointerEvent, columnIndex: number) => {
        const column = getColumns()[columnIndex];

        if (e.button !== 0 || getIsDisabled() || !getIsReorderable(column)) return;
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
        if (CarrierStack.getCarry()) return;

        CarrierStack.dragFromPointer(
            e.currentTarget as HTMLElement,
            e,
            () =>
                CarrierStack.start(
                    zone,
                    columnIndex,
                    { groupId: tableId, key: column.id, label: column.header, value: column.id },
                    "drag",
                ),
            () => {
                hasCarriedClick = true;
            },
        );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const grid = getGrid();

        if (grid.width < 1 || getIsDisabled()) return;

        const from = getRovingCell();
        const column = getColumns()[from.col];

        if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            selectAllRows();

            return;
        }

        if (e.ctrlKey && (e.key === "Home" || e.key === "End")) {
            e.preventDefault();

            focusCell(
                e.key === "Home" ? { row: HEADER_ROW_INDEX, col: 0 } : { row: grid.height - 1, col: grid.width - 1 },
            );

            return;
        }

        if (from.row === HEADER_ROW_INDEX) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                toggleSort(column);

                return;
            }

            if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                e.preventDefault();

                const step = access(props.resizeStepPx) ?? DEFAULT_RESIZE_STEP_PX;

                resizeColumn(column, getCurrentWidth(column, from.col) + (e.key === "ArrowLeft" ? -step : step));

                return;
            }

            if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                e.preventDefault();

                if (!getIsReorderable(column)) return;

                const to = from.col + (e.key === "ArrowLeft" ? -1 : 1);

                if (to < 0 || to >= grid.width) return;

                moveColumn(from.col, to);
                focusCell({ row: HEADER_ROW_INDEX, col: to });

                LiveAnnouncer.announce(`${column.header} moved to column ${to + FIRST_ARIA_INDEX} of ${grid.width}.`);

                return;
            }
        } else {
            const rowIndex = from.row - 1;

            if (e.key === "Enter") {
                e.preventDefault();

                void props.onRowActivate?.(getRows()[rowIndex], rowIndex);

                return;
            }

            if (e.key === " ") {
                e.preventDefault();

                selectRow(rowIndex, { isToggling: !e.shiftKey, isExtending: e.shiftKey });

                return;
            }
        }

        const next = NavigatorUtils.computeNextCell(e.key, { x: from.col, y: from.row }, grid, {
            pageRows: access(props.pageRows) ?? DEFAULT_PAGE_ROWS,
        });

        if (next === undefined) return;

        e.preventDefault();

        const cell = {
            row: MathUtils.clamp(next.y, HEADER_ROW_INDEX, grid.height - 1),
            col: MathUtils.clamp(next.x, 0, grid.width - 1),
        };

        focusCell(cell);

        if (e.shiftKey && cell.row > HEADER_ROW_INDEX) selectRow(cell.row - 1, { isExtending: true });
    };

    const handleCellClick = (e: MouseEvent, cell: Index2d) => {
        if (getIsDisabled()) return;

        const interactive = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);

        if (interactive && (e.currentTarget as HTMLElement).contains(interactive)) return;

        focusCell(cell);

        if (cell.row === HEADER_ROW_INDEX) {
            toggleSort(getColumns()[cell.col]);

            return;
        }

        selectRow(cell.row - 1, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey });
    };

    const getColumnRenderProps = (layoutCol: number): TableColumnRenderProps => {
        const column = getColumns()[layoutCol];
        const sort = getSort();
        const roving = getRovingCell();

        return {
            columnId: column.id,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            sortDirection: sort?.columnId === column.id ? sort.direction : undefined,
            isSortable: column.isSortable ?? false,
            isReorderable: getIsReorderable(column),
            isResizable: getIsResizable(column),
            isResizing: getResizingColumnId() === column.id,
            isCarried: getCarriedColumnId() === column.id,
            isFocused: roving.row === HEADER_ROW_INDEX && roving.col === layoutCol,
            isHovered: getHoveredColumn() === layoutCol,
            isDisabled: getIsDisabled(),
        };
    };

    const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps => {
        const roving = getRovingCell();

        return {
            columnId: getColumns()[layoutCol].id,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            dataRow: getDataRow(layoutRow),
            layoutRow,
            isSelected: getSelection().includes(getRows()[layoutRow]),
            isFocused: roving.row === layoutRow + 1 && roving.col === layoutCol,
            isHovered: getHoveredRow() === layoutRow,
            isDisabled: getIsDisabled(),
        };
    };

    const renderResizer = (getColumn: Accessor<TableColumn<T>>, columnIndex: number) => (
        <div
            class={styles.tableResizer}
            aria-hidden={"true"}
            onPointerDown={(e) => handleResizerPointerDown(e, getColumn(), columnIndex)}
            onPointerMove={(e) => handleResizerPointerMove(e, getColumn())}
            onPointerUp={(e) => handleResizerPointerUp(e, getColumn())}
            onPointerCancel={(e) => handleResizerPointerUp(e, getColumn())}
            onClick={(e) => e.stopPropagation()}
        >
            {props.renderResizer?.(() => getColumnRenderProps(columnIndex))}
        </div>
    );

    const renderMarker = (columnIndex: number) => (
        <Show when={getLandingCol() === columnIndex}>
            <div class={columnIndex < getColumns().length ? styles.tableMarkerBefore : styles.tableMarkerAfter}>
                {props.renderMarker?.()}
            </div>
        </Show>
    );

    const renderHeaderCell = (getColumn: Accessor<TableColumn<T>>, columnIndex: number) => {
        const cell = { row: HEADER_ROW_INDEX, col: columnIndex };
        const getRenderProps = () => getColumnRenderProps(columnIndex);

        return (
            <div
                id={getCellId(cell)}
                class={styles.tableCell}
                role="columnheader"
                aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                aria-sort={getColumn().isSortable === true ? (getRenderProps().sortDirection ?? "none") : undefined}
                aria-disabled={getIsDisabled() || undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
                onPointerDown={(e) => handleHeaderPointerDown(e, columnIndex)}
                onClick={(e) => {
                    if (hasCarriedClick) {
                        hasCarriedClick = false;

                        return;
                    }

                    handleCellClick(e, cell);
                }}
                onPointerEnter={() => setHoveredColumn(columnIndex)}
                onPointerLeave={() => setHoveredColumn(undefined)}
            >
                {getColumn().renderHeader(getRenderProps)}

                <Show when={getRenderProps().isResizable}>{renderResizer(getColumn, columnIndex)}</Show>

                {renderMarker(columnIndex)}

                <Show when={columnIndex === getColumns().length - 1}>{renderMarker(getColumns().length)}</Show>
            </div>
        );
    };

    const renderCell = (
        getColumn: Accessor<TableColumn<T>>,
        getRow: Accessor<T>,
        columnIndex: number,
        rowIndex: number,
    ) => {
        const cell = { row: rowIndex + 1, col: columnIndex };

        return (
            <div
                id={getCellId(cell)}
                class={styles.tableCell}
                role="gridcell"
                aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                aria-disabled={getIsDisabled() || undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
                onClick={(e) => handleCellClick(e, cell)}
            >
                {getColumn().renderCell(getRow, () => getCellRenderProps(columnIndex, rowIndex))}
            </div>
        );
    };

    const renderRow = (getRow: Accessor<T>, rowIndex: number, virtualRow?: VirtualizerRow) => (
        <div
            class={virtualRow ? [styles.tableRow, styles.tableWindowedRow].join(" ") : styles.tableRow}
            role="row"
            aria-rowindex={rowIndex + 1 + FIRST_ARIA_INDEX}
            aria-selected={getSelectionMode() === "none" ? undefined : getSelection().includes(getRow())}
            aria-label={props.computeRowAriaLabel?.(getRow(), rowIndex)}
            style={virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined}
            ref={(element: HTMLElement) => {
                if (virtualRow) rowWindow.measureRow(element, virtualRow.index);
            }}
            onPointerEnter={() => setHoveredRow(rowIndex)}
            onPointerLeave={() => setHoveredRow(undefined)}
        >
            <Index each={getColumns()}>
                {(getColumn, columnIndex) => renderCell(getColumn, getRow, columnIndex, rowIndex)}
            </Index>
        </div>
    );

    const renderRows = () => <Index each={getRows()}>{(getRow, rowIndex) => renderRow(getRow, rowIndex)}</Index>;

    const renderWindowedRows = () => (
        <For each={rowWindow.getRows()}>
            {(virtualRow) => renderRow(() => getRows()[virtualRow.index], virtualRow.index, virtualRow)}
        </For>
    );

    return (
        <div
            class={styles.tableRoot}
            role="grid"
            aria-label={access(props.ariaLabel)}
            aria-rowcount={getGrid().height}
            aria-colcount={getGrid().width}
            aria-multiselectable={getSelectionMode() === "multiple" || undefined}
            aria-disabled={getIsDisabled() || undefined}
            style={assignInlineVars({
                [styles.tableTemplateVar]: getTemplate(),
                [styles.tableResizerWidthVar]: `${access(props.resizerWidthPx) ?? DEFAULT_RESIZER_WIDTH_PX}px`,
            })}
            onKeyDown={handleKeyDown}
        >
            <div ref={setHeaderRef} class={styles.tableHeader} role="rowgroup">
                <div class={styles.tableRow} role="row" aria-rowindex={FIRST_ARIA_INDEX}>
                    <Index each={getColumns()}>{renderHeaderCell}</Index>
                </div>
            </div>

            <div
                ref={setBodyRef}
                class={styles.tableBody}
                role="rowgroup"
                style={{ height: getIsVirtualized() ? `${rowWindow.getTotalSize()}px` : undefined }}
            >
                <Show when={getIsVirtualized()} fallback={renderRows()}>
                    {renderWindowedRows()}
                </Show>
            </div>
        </div>
    );
};
