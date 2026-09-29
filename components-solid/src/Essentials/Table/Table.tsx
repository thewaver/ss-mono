import type { Accessor } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";

import {
    CarrierUtils,
    type CarrierZone,
    type CarryPlace,
    LiveAnnouncerUtils,
    type SelectionGesture,
    TABLE_DEFAULTS,
    type TableCellRenderProps,
    type TableColumnRenderProps,
    type TableHeaderContextType,
    TableUtils,
    type VirtualizerRow,
    TableStyles as styles,
} from "@thewaver/ss-components";
import type { Index2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { CarrierSolidUtils } from "../../Abstracts/Carrier/CarrierSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { SelectionSolidUtils } from "../../Abstracts/Selection/SelectionSolid.utils";
import { VirtualizerSolidUtils } from "../../Abstracts/Virtualizer/VirtualizerSolid.utils";
import { access } from "../../Utils/propUtils";
import { TableHeaderContextProvider, useTableHeaderContext } from "./Table.context";
import type { TableColumn, TableHeaderReorderProps, TableHeaderSortProps, TableProps } from "./TableSolid.types";

const HEADER_ROW_INDEX = TableUtils.HEADER_ROW_INDEX;
const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;

const NO_RESIZING = "";

const EMPTY_PINNED_ROWS: number[] = [];
const EMPTY_WIDTHS: Record<string, number> = {};
const EMPTY_ORDER: string[] = [];
const EMPTY_SELECTION: never[] = [];

export const Table = <T,>(props: TableProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const tableId = createUniqueId();
    const hintId = createUniqueId();

    const getAnnouncements = () => access(props.announcements)!;

    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();
    const [getHeaderRef, setHeaderRef] = createSignal<HTMLElement>();
    const [getFocusedCell, setFocusedCell] = createSignal<Index2d>({ row: HEADER_ROW_INDEX, col: 0 });
    const [getHoveredRow, setHoveredRow] = createSignal<number>();
    const [getHoveredColumn, setHoveredColumn] = createSignal<number>();
    const [getResizingColumnId, setResizingColumnId] = createSignal(NO_RESIZING);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getHeaderRef);

    const getDeclaredColumns = createMemo(() => access(props.columns));

    const getColumnOrder = createMemo(() =>
        TableUtils.getColumnOrder(getDeclaredColumns(), props.order?.[0]() ?? EMPTY_ORDER),
    );

    const getColumns = createMemo(() => TableUtils.getReordered(getDeclaredColumns(), getColumnOrder()));

    const getDataCol = (layoutCol: number) => getColumnOrder()?.[layoutCol] ?? layoutCol;

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getWidths = createMemo(() => props.widths?.[0]() ?? EMPTY_WIDTHS);

    const getSort = createMemo(() => props.sort?.[0]());

    const getSelection = createMemo(() => props.selection?.[0]() ?? EMPTY_SELECTION);

    const getSelectedRows = createMemo(() => new Set(getSelection()));

    const getSelectionMode = createMemo(() =>
        TableUtils.getSelectionMode(access(props.selectionMode), props.selection !== undefined),
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

    const getGrid = createMemo(() => ({ rowCount: getRows().length + 1, colCount: getColumns().length }));

    const getRovingCell = createMemo(() => TableUtils.clampCell(getFocusedCell(), getGrid()));

    const rowWindow = VirtualizerSolidUtils.createRowWindow(getBodyRef, () => getRows().length, {
        getIsDisabled: () => !getIsVirtualized(),
        computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
        getPinnedRows: () => {
            const cell = getRovingCell();

            return cell.row === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [cell.row - 1];
        },
    });

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

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

        props.sort?.[1](next);

        void props.onSortChange?.(next);
    };

    const selection = SelectionSolidUtils.create(getIsDisabled, {
        getMode: getSelectionMode,
        getItems: getRows,
        selection: [
            getSelection,
            (rows) => {
                props.selection?.[1](rows);

                void props.onSelectionChange?.(rows);
            },
        ],
    });

    const selectRow = (rowIndex: number, gesture?: SelectionGesture) => {
        const row = getRows()[rowIndex];

        if (row !== undefined) selection.pick(row, gesture);
    };

    const getCurrentWidth = (column: TableColumn<T>, columnIndex: number) =>
        TableUtils.getColumnWidth(column, getWidths()) ??
        document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
        0;

    const getIsResizable = (column: TableColumn<T>) => (column.isResizable ?? false) && props.widths !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || getIsDisabled()) return;

        const next = TableUtils.getResizedWidth(column, width);

        props.widths?.[1]({ ...getWidths(), [column.id]: next });
    };

    let resizeStartX = 0;
    let resizeStartWidth = 0;

    let hasResizeDragged = false;

    const handleResizerPointerDown = (e: PointerEvent, column: TableColumn<T>, columnIndex: number) => {
        if (e.button !== 0 || getIsDisabled()) return;

        e.preventDefault();
        e.stopPropagation();

        hasResizeDragged = false;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

        resizeStartX = e.clientX;
        resizeStartWidth = getCurrentWidth(column, columnIndex);

        setResizingColumnId(column.id);
    };

    const handleResizerPointerMove = (e: PointerEvent, column: TableColumn<T>) => {
        if (getResizingColumnId() !== column.id) return;

        if (e.clientX !== resizeStartX) hasResizeDragged = true;

        const travel = e.clientX - resizeStartX;

        resizeColumn(column, TableUtils.computeDraggedWidth(resizeStartWidth, travel, getDirection()));
    };

    const handleResizerPointerUp = (e: PointerEvent, column: TableColumn<T>, columnIndex: number) => {
        if (getResizingColumnId() !== column.id) return;

        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

        setResizingColumnId(NO_RESIZING);

        if (hasResizeDragged) return;

        resizeColumn(
            column,
            TableUtils.computePressedWidth({
                clientX: e.clientX,
                rect: (e.currentTarget as HTMLElement).getBoundingClientRect(),
                width: getCurrentWidth(column, columnIndex),
                step: access(props.resizeStepPx) ?? TABLE_DEFAULTS.resizeStepPx,
                direction: getDirection(),
            }),
        );
    };

    const handleResizerPointerCancel = (column: TableColumn<T>) => {
        if (getResizingColumnId() !== column.id) return;

        setResizingColumnId(NO_RESIZING);
    };

    const getIsReorderable = (column: TableColumn<T> | undefined) =>
        column !== undefined && (column.isReorderable ?? false) && props.order !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        const columns = getColumns();

        if (!getIsReorderable(columns[fromIndex]) || getIsDisabled()) return false;
        if (toIndex < 0 || toIndex >= columns.length) return false;

        const next = CarrierUtils.computeMovedOrder(
            columns.map((column) => column.id),
            fromIndex,
            toIndex,
        );

        props.order?.[1](next);

        void props.onOrderChange?.(next);

        return true;
    };

    const asColumnIndex = (place: CarryPlace) => place as number;

    const getHeaderRects = () =>
        getColumns().reduce<DOMRect[]>((acc, _unused, columnIndex) => {
            const element = document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }));

            if (element) acc.push(element.getBoundingClientRect());

            return acc;
        }, []);

    const getSourceColumnIndex = () => {
        const place = CarrierSolidUtils.getSourcePlace();

        return CarrierSolidUtils.getSourceZone() === zone && place !== undefined ? asColumnIndex(place) : undefined;
    };

    const zone: CarrierZone = {
        getGroupId: () => tableId,
        getLabel: () => access(props.ariaLabel),
        getRootRef: getHeaderRef,
        getIsDisabled: () => getIsDisabled() || props.order === undefined,
        getKeyHint: () => getAnnouncements().keyHint,
        getAnnouncements,
        computeCanAccept: () => !getIsDisabled() && props.order !== undefined,
        computePlaceAtPoint: (point) =>
            TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, getSourceColumnIndex() ?? 0, getDirection()),
        computeNudgedPlace: (place, nudge) => TableUtils.computeColumnNudgedPlace(place, nudge, getColumns().length),
        computeEntryPlace: () => getSourceColumnIndex() ?? 0,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => getAnnouncements().computePlaceLabel(asColumnIndex(place), getColumns().length),
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: (fromPlace, toPlace) => moveColumn(asColumnIndex(fromPlace), asColumnIndex(toPlace)),
    };

    CarrierSolidUtils.registerZone(zone);

    createEffect(() => {
        if (CarrierSolidUtils.getSourceZone() !== zone) return;

        onCleanup(TableUtils.observeCarryCancel(zone));
    });

    const getCarriedColumnId = createMemo(() =>
        CarrierSolidUtils.getSourceZone() === zone ? CarrierSolidUtils.getCarry()?.key : undefined,
    );

    const getLandingCol = createMemo(() => {
        const place = CarrierSolidUtils.getTargetPlace();

        if (CarrierSolidUtils.getTargetZone() !== zone || place === undefined) return;

        return TableUtils.computeLandingCol(place, getSourceColumnIndex() ?? 0);
    });

    let hasCarriedClick = false;

    const handleHeaderPointerDown = (e: PointerEvent, columnIndex: number) => {
        const column = getColumns()[columnIndex];

        if (e.button !== 0 || getIsDisabled() || !getIsReorderable(column)) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
        if (CarrierSolidUtils.getCarry()) return;

        CarrierSolidUtils.dragFromPointer(
            e.currentTarget as HTMLElement,
            e,
            () =>
                CarrierUtils.start(
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
        const from = getRovingCell();
        const column = getColumns()[from.col];
        const command = TableUtils.computeKeyCommand(e, from, getGrid(), {
            direction: getDirection(),
            pageRows: access(props.pageRows) ?? TABLE_DEFAULTS.pageRows,
        });

        if (command === undefined) return;

        e.preventDefault();

        if (command.kind === "selectAll") {
            selection.selectAll();

            return;
        }

        if (command.kind === "sort") {
            toggleSort(column);

            return;
        }

        if (command.kind === "resize") {
            const step = access(props.resizeStepPx) ?? TABLE_DEFAULTS.resizeStepPx;

            resizeColumn(column, getCurrentWidth(column, from.col) + command.step * step);

            return;
        }

        if (command.kind === "moveColumn") {
            if (!moveColumn(from.col, command.to)) return;

            focusCell({ row: HEADER_ROW_INDEX, col: command.to });

            LiveAnnouncerUtils.announce(
                getAnnouncements().computeColumnMoved(column.header, command.to, getGrid().colCount),
            );

            return;
        }

        if (command.kind === "activateRow") {
            if (!getIsDisabled()) void props.onRowActivate?.(getRows()[command.rowIndex], command.rowIndex);

            return;
        }

        if (command.kind === "pickRow") {
            selectRow(command.rowIndex, command.gesture);

            return;
        }

        focusCell(command.cell);

        if (command.isExtending) selectRow(command.cell.row - 1, { isExtending: true });
    };

    const handleCellClick = (e: MouseEvent, cell: Index2d) => {
        if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget as HTMLElement)) return;

        focusCell(cell);

        if (getIsDisabled()) return;

        selectRow(cell.row - 1, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey });
    };

    const getColumnRenderProps = (layoutCol: number): TableColumnRenderProps => {
        const column = getColumns()[layoutCol];

        return TableUtils.computeColumnRenderProps({
            column,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            sort: getSort(),
            roving: getRovingCell(),
            isReorderable: getIsReorderable(column),
            isResizable: getIsResizable(column),
            resizingColumnId: getResizingColumnId(),
            carriedColumnId: getCarriedColumnId(),
            hoveredColumn: getHoveredColumn(),
            isDisabled: getIsDisabled(),
        });
    };

    const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps =>
        TableUtils.computeCellRenderProps({
            columnId: getColumns()[layoutCol].id,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            dataRow: getDataRow(layoutRow),
            layoutRow,
            isSelected: getSelectedRows().has(getRows()[layoutRow]),
            roving: getRovingCell(),
            hoveredRow: getHoveredRow(),
            isDisabled: getIsDisabled(),
        });

    const renderResizer = (getColumn: Accessor<TableColumn<T>>, columnIndex: number) => (
        <div
            class={styles.tableResizer}
            aria-hidden="true"
            onPointerDown={(e) => handleResizerPointerDown(e, getColumn(), columnIndex)}
            onPointerMove={(e) => handleResizerPointerMove(e, getColumn())}
            onPointerUp={(e) => handleResizerPointerUp(e, getColumn(), columnIndex)}
            onPointerCancel={() => handleResizerPointerCancel(getColumn())}
            onClick={(e) => e.stopPropagation()}
        >
            {props.renderResizer?.(() => getColumnRenderProps(columnIndex))}
        </div>
    );

    const handleGripClick = (columnIndex: number) => {
        const carry = CarrierSolidUtils.getCarry();

        if (!carry) {
            const column = getColumns()[columnIndex];

            if (!getIsReorderable(column)) return;

            CarrierUtils.start(
                zone,
                columnIndex,
                { groupId: tableId, key: column.id, label: column.header, value: column.id },
                "tap",
            );
            focusCell({ row: HEADER_ROW_INDEX, col: columnIndex });

            return;
        }

        if (CarrierSolidUtils.getCarryMode() === "drag") return;

        const rect = document
            .getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))
            ?.getBoundingClientRect();

        if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);

        CarrierSolidUtils.end("drop");
    };

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

        let hasSortControl = false;
        let hasReorderGrip = false;

        const headerContext: TableHeaderContextType = {
            getRenderProps,
            sort: () => {
                focusCell(cell);

                if (getIsDisabled()) return;

                toggleSort(getColumn());
            },
            pickUp: () => {
                focusCell(cell);

                if (getIsDisabled()) return;

                handleGripClick(columnIndex);
            },
            registerSort: () => {
                hasSortControl = true;
            },
            registerReorder: () => {
                hasReorderGrip = true;
            },
        };

        onMount(() => {
            const column = getColumn();

            TableUtils.warnIfHeaderControlsMissing(column, {
                isReorderable: getIsReorderable(column),
                hasSortControl,
                hasReorderGrip,
            });
        });

        return (
            <div
                id={getCellId(cell)}
                class={styles.tableCell}
                role="columnheader"
                aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                aria-sort={TableUtils.computeAriaSort(getColumn(), getRenderProps().sortDirection)}
                aria-disabled={getIsDisabled() || undefined}
                aria-describedby={getIsReorderable(getColumn()) ? hintId : undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
                onPointerDown={(e) => handleHeaderPointerDown(e, columnIndex)}
                onClick={() => {
                    if (hasCarriedClick) {
                        hasCarriedClick = false;

                        return;
                    }

                    focusCell(cell);
                }}
                onPointerEnter={() => setHoveredColumn(columnIndex)}
                onPointerLeave={() => setHoveredColumn(undefined)}
            >
                <TableHeaderContextProvider value={headerContext}>
                    {getColumn().renderHeader(getRenderProps)}
                </TableHeaderContextProvider>

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
            aria-selected={getSelectionMode() === "none" ? undefined : getSelectedRows().has(getRow())}
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
            aria-rowcount={getGrid().rowCount}
            aria-colcount={getGrid().colCount}
            aria-multiselectable={getSelectionMode() === "multiple" || undefined}
            aria-disabled={getIsDisabled() || undefined}
            style={assignInlineVars({
                [styles.tableTemplateVar]: getTemplate(),
                [styles.tableResizerWidthVar]: `${access(props.resizerWidthPx) ?? TABLE_DEFAULTS.resizerWidthPx}px`,
            })}
            onKeyDown={handleKeyDown}
        >
            <div ref={setHeaderRef} class={styles.tableHeader} role="rowgroup">
                <div class={styles.tableRow} role="row" aria-rowindex={FIRST_ARIA_INDEX}>
                    <Index each={getColumns()}>{renderHeaderCell}</Index>
                </div>
            </div>

            <Show when={props.order !== undefined}>
                <div id={hintId} class={styles.tableHint}>
                    {getAnnouncements().restingKeyHint}
                </div>
            </Show>

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

export const TableHeaderSort = (props: TableHeaderSortProps) => {
    const context = useTableHeaderContext("TableHeaderSort");

    context?.registerSort();

    return (
        <Show when={context?.getRenderProps().isSortable}>
            <button
                type="button"
                class={styles.tableSortControl}
                tabindex={-1}
                aria-hidden="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();

                    context!.sort();
                }}
            >
                {props.renderContent(context!.getRenderProps)}
            </button>
        </Show>
    );
};

export const TableHeaderReorder = (props: TableHeaderReorderProps) => {
    const context = useTableHeaderContext("TableHeaderReorder");

    context?.registerReorder();

    return (
        <Show when={context?.getRenderProps().isReorderable}>
            <button
                type="button"
                class={styles.tableReorderGrip}
                tabindex={-1}
                aria-hidden="true"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();

                    context!.pickUp();
                }}
            >
                {props.renderContent(context!.getRenderProps)}
            </button>
        </Show>
    );
};
