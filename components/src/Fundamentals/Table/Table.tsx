import type { Accessor } from "solid-js";
import { For, Index, Show, createMemo, createSignal, createUniqueId } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { Virtualizer } from "../../Abstracts/Virtualizer/Virtualizer";
import type { VirtualizerRow } from "../../Abstracts/Virtualizer/Virtualizer.types";
import { access } from "../../Utils/propUtils";
import type {
    TableCellFlags,
    TableCellPosition,
    TableColumn,
    TableColumnFlags,
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
const EMPTY_SELECTION: never[] = [];

const INTERACTIVE_SELECTOR =
    "a[href], button, input, select, textarea, [role='button'], [role='checkbox'], [role='link'], [role='switch']";

export const Table = <T,>(props: TableProps<T>) => {
    const tableId = createUniqueId();

    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();
    const [getFocusedCell, setFocusedCell] = createSignal<TableCellPosition>({ x: 0, y: HEADER_ROW_INDEX });
    const [getHoveredRow, setHoveredRow] = createSignal<number>();
    const [getHoveredColumn, setHoveredColumn] = createSignal<number>();
    const [getResizingColumnId, setResizingColumnId] = createSignal(NO_RESIZING);

    const getColumns = createMemo(() => access(props.columns));

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

    const getRows = createMemo(() => TableUtils.getSortedRows(access(props.rows), getSortedColumn(), getSort()));

    const getTemplate = createMemo(() => TableUtils.getColumnTemplate(getColumns(), getWidths()));

    const getIsVirtualized = createMemo(() => props.computeEstimatedRowHeight !== undefined);

    const getGrid = createMemo(() => ({ width: getColumns().length, height: getRows().length + 1 }));

    const getRovingCell = createMemo(() => {
        const cell = getFocusedCell();
        const grid = getGrid();

        if (grid.width < 1) return cell;

        return {
            x: MathUtils.clamp(cell.x, 0, grid.width - 1),
            y: MathUtils.clamp(cell.y, HEADER_ROW_INDEX, grid.height - 1),
        };
    });

    const rowWindow = Virtualizer.createRowWindow(getBodyRef, () => getRows().length, {
        getIsEnabled: getIsVirtualized,
        computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
        getPinnedRows: () => {
            const cell = getRovingCell();

            return cell.y === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [cell.y - 1];
        },
    });

    const getCellId = (cell: TableCellPosition) => `${tableId}-cell-${cell.y}-${cell.x}`;

    const getIsRoving = (cell: TableCellPosition) => {
        const roving = getRovingCell();

        return roving.x === cell.x && roving.y === cell.y;
    };

    const focusCell = (cell: TableCellPosition) => {
        setFocusedCell(cell);

        if (cell.y > HEADER_ROW_INDEX && rowWindow.getIsLive()) rowWindow.scrollToRow(cell.y - 1);

        document.getElementById(getCellId(cell))?.focus();
    };

    const toggleSort = (column: TableColumn<T> | undefined) => {
        if (!column || column.isSortable !== true || getIsDisabled()) return;

        const next = TableUtils.getNextSort(getSort(), column.id);

        props.sortSignal?.[1](() => next);

        void props.onSortChange?.(next);
    };

    let anchorRowIndex = 0;

    const setSelection = (rows: T[]) => {
        props.selectionSignal?.[1](() => rows);

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
        document.getElementById(getCellId({ x: columnIndex, y: HEADER_ROW_INDEX }))?.offsetWidth ??
        0;

    const getIsResizable = (column: TableColumn<T>) =>
        (column.isResizable ?? false) && props.widthsSignal !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || getIsDisabled()) return;

        const next = TableUtils.getResizedWidth(column, width);

        props.widthsSignal?.[1]((prev) => ({ ...prev, [column.id]: next }));
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

    const handleKeyDown = (e: KeyboardEvent) => {
        const grid = getGrid();

        if (grid.width < 1 || getIsDisabled()) return;

        const from = getRovingCell();
        const column = getColumns()[from.x];

        if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();

            selectAllRows();

            return;
        }

        if (e.ctrlKey && (e.key === "Home" || e.key === "End")) {
            e.preventDefault();

            focusCell(e.key === "Home" ? { x: 0, y: HEADER_ROW_INDEX } : { x: grid.width - 1, y: grid.height - 1 });

            return;
        }

        if (from.y === HEADER_ROW_INDEX) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                toggleSort(column);

                return;
            }

            if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                e.preventDefault();

                const step = access(props.resizeStepPx) ?? DEFAULT_RESIZE_STEP_PX;

                resizeColumn(column, getCurrentWidth(column, from.x) + (e.key === "ArrowLeft" ? -step : step));

                return;
            }
        } else {
            const rowIndex = from.y - 1;

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

        const next = NavigatorUtils.computeNextCell(e.key, from, grid, {
            pageRows: access(props.pageRows) ?? DEFAULT_PAGE_ROWS,
        });

        if (next === undefined) return;

        e.preventDefault();

        const cell = {
            x: MathUtils.clamp(next.x, 0, grid.width - 1),
            y: MathUtils.clamp(next.y, HEADER_ROW_INDEX, grid.height - 1),
        };

        focusCell(cell);

        if (e.shiftKey && cell.y > HEADER_ROW_INDEX) selectRow(cell.y - 1, { isExtending: true });
    };

    const handleCellClick = (e: MouseEvent, cell: TableCellPosition) => {
        if (getIsDisabled()) return;

        const interactive = (e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);

        if (interactive && (e.currentTarget as HTMLElement).contains(interactive)) return;

        focusCell(cell);

        if (cell.y === HEADER_ROW_INDEX) {
            toggleSort(getColumns()[cell.x]);

            return;
        }

        selectRow(cell.y - 1, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey });
    };

    const getColumnFlags = (columnIndex: number): TableColumnFlags => {
        const column = getColumns()[columnIndex];
        const sort = getSort();
        const roving = getRovingCell();

        return {
            columnId: column.id,
            columnIndex,
            sortDirection: sort?.columnId === column.id ? sort.direction : undefined,
            isSortable: column.isSortable ?? false,
            isResizable: getIsResizable(column),
            isResizing: getResizingColumnId() === column.id,
            isFocused: roving.y === HEADER_ROW_INDEX && roving.x === columnIndex,
            isHovered: getHoveredColumn() === columnIndex,
            isDisabled: getIsDisabled(),
        };
    };

    const getCellFlags = (columnIndex: number, rowIndex: number): TableCellFlags => {
        const roving = getRovingCell();

        return {
            columnId: getColumns()[columnIndex].id,
            columnIndex,
            rowIndex,
            isSelected: getSelection().includes(getRows()[rowIndex]),
            isFocused: roving.y === rowIndex + 1 && roving.x === columnIndex,
            isHovered: getHoveredRow() === rowIndex,
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
            {props.renderResizer?.(() => getColumnFlags(columnIndex))}
        </div>
    );

    const renderHeaderCell = (getColumn: Accessor<TableColumn<T>>, columnIndex: number) => {
        const cell = { x: columnIndex, y: HEADER_ROW_INDEX };
        const getFlags = () => getColumnFlags(columnIndex);

        return (
            <div
                id={getCellId(cell)}
                class={styles.tableCell}
                role="columnheader"
                aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                aria-sort={getColumn().isSortable === true ? (getFlags().sortDirection ?? "none") : undefined}
                aria-disabled={getIsDisabled() || undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
                onClick={(e) => handleCellClick(e, cell)}
                onPointerEnter={() => setHoveredColumn(columnIndex)}
                onPointerLeave={() => setHoveredColumn(undefined)}
            >
                {getColumn().renderHeader(getFlags)}

                <Show when={getFlags().isResizable}>{renderResizer(getColumn, columnIndex)}</Show>
            </div>
        );
    };

    const renderCell = (
        getColumn: Accessor<TableColumn<T>>,
        getRow: Accessor<T>,
        columnIndex: number,
        rowIndex: number,
    ) => {
        const cell = { x: columnIndex, y: rowIndex + 1 };

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
                {getColumn().renderCell(getRow, () => getCellFlags(columnIndex, rowIndex))}
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
            <div class={styles.tableHeader} role="rowgroup">
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
