import type { Accessor } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";

import {
    CarrierUtils,
    type CarrierZone,
    type CarryPlace,
    LiveAnnouncerUtils,
    type SelectionGesture,
    TABLE_DEFAULTS,
    type TableCellContextType,
    type TableCellRenderProps,
    type TableColumnRenderProps,
    type TableDetailRenderProps,
    type TableEntry,
    type TableFocus,
    type TableHeaderContextType,
    TableUtils,
    type VirtualizerRow,
    TableStyles as styles,
} from "@thewaver/ss-components";
import { TableConst } from "@thewaver/ss-components/internal";
import { type Index2d, ObjectUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { CarrierSolidUtils } from "../../Abstracts/Carrier/CarrierSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { SelectionSolidUtils } from "../../Abstracts/Selection/SelectionSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { VirtualizerSolidUtils } from "../../Abstracts/Virtualizer/VirtualizerSolid.utils";
import { access } from "../../Utils/propUtils";
import {
    TableCellContextProvider,
    TableHeaderContextProvider,
    useTableCellContext,
    useTableHeaderContext,
} from "./Table.context";
import type {
    TableColumn,
    TableHeaderReorderProps,
    TableHeaderSortProps,
    TableProps,
    TableRowExpanderProps,
} from "./TableSolid.types";

export const Table = <T,>(props: TableProps<T>) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const tableId = createUniqueId();
    const hintId = createUniqueId();

    const getAnnouncements = () => access(props.announcements)!;

    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();
    const [getHeaderRef, setHeaderRef] = createSignal<HTMLElement>();
    const [getFocus, setFocus] = createSignal<TableFocus>({
        cell: { row: TableConst.HEADER_ROW_INDEX, col: 0 },
        isDetail: false,
    });
    const [getHoveredRow, setHoveredRow] = createSignal<number>();
    const [getHoveredColumn, setHoveredColumn] = createSignal<number>();
    const [getResizingColumnId, setResizingColumnId] = createSignal(TableConst.NO_RESIZING);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getHeaderRef);

    const getDeclaredColumns = createMemo(() => access(props.columns));

    const getColumnOrder = createMemo(() =>
        TableUtils.getPinnedOrder(
            getDeclaredColumns(),
            TableUtils.getColumnOrder(getDeclaredColumns(), props.order?.[0]() ?? TableConst.EMPTY_ORDER),
        ),
    );

    const getColumns = createMemo(() => TableUtils.getReordered(getDeclaredColumns(), getColumnOrder()));

    const getDataCol = (layoutCol: number) => getColumnOrder()?.[layoutCol] ?? layoutCol;

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getWidths = createMemo(() => props.widths?.[0]() ?? TableConst.EMPTY_WIDTHS);

    const getPinOffsets = createMemo(() => TableUtils.computePinOffsets(getColumns(), getWidths()));

    const getSort = createMemo(() => props.sort?.[0]());

    const getSelection = createMemo(() => props.selection?.[0]() ?? TableConst.EMPTY_SELECTION);

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

    const getIsExpandable = createMemo(() => props.renderDetail !== undefined);

    const expandedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.expanded, []);

    const getIsRowExpandable = (row: T | undefined) =>
        row !== undefined && getIsExpandable() && (props.computeIsExpandable?.(row) ?? true);

    const getExpandedRows = createMemo(() =>
        getIsExpandable()
            ? TableUtils.getExpandedRows(getRows(), expandedSignal[0](), props.computeIsExpandable)
            : TableConst.EMPTY_EXPANDED_ROWS,
    );

    const getExpandedRowSet = createMemo(() => new Set(getExpandedRows()));

    const getWalkRow = (layoutRow: number) => TableUtils.getEntryIndex(layoutRow, getExpandedRows()) + 1;

    const getGrid = createMemo(() => ({
        rowCount: TableUtils.getEntryCount(getRows().length, getExpandedRows()) + 1,
        colCount: getColumns().length,
    }));

    const getRovingCell = createMemo(() =>
        TableUtils.clampCell(TableUtils.computeWalkCell(getFocus(), getExpandedRows()), getGrid()),
    );

    const getRovingFocus = createMemo(() => TableUtils.computeFocus(getRovingCell(), getExpandedRows()));

    const rowWindow = VirtualizerSolidUtils.createRowWindow(
        getBodyRef,
        () => TableUtils.getEntryCount(getRows().length, getExpandedRows()),
        {
            getIsDisabled: () => !getIsVirtualized(),
            computeEstimatedSize: (index) =>
                props.computeEstimatedRowHeight?.(TableUtils.getEntry(index, getExpandedRows()).layoutRow) ?? 0,
            getPinnedRows: () => {
                const cell = getRovingCell();

                return cell.row === TableConst.HEADER_ROW_INDEX ? TableConst.EMPTY_PINNED_ROWS : [cell.row - 1];
            },
        },
    );

    const getIsWindowed = createMemo(() => getIsVirtualized() && !rowWindow.getHasNoScroller());

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

    const getDetailId = (layoutRow: number) => TableUtils.getDetailId(tableId, layoutRow);

    const getIsRoving = (cell: Index2d) => {
        const roving = getRovingFocus();

        return !roving.isDetail && roving.cell.col === cell.col && roving.cell.row === cell.row;
    };

    const getIsDetailRoving = (layoutRow: number) => {
        const roving = getRovingFocus();

        return roving.isDetail && roving.cell.row === layoutRow + 1;
    };

    const focusAt = (focus: TableFocus) => {
        setFocus(focus);

        const walkCell = TableUtils.computeWalkCell(focus, getExpandedRows());

        if (walkCell.row > TableConst.HEADER_ROW_INDEX && rowWindow.getIsLive())
            rowWindow.scrollToRow(walkCell.row - 1);

        document.getElementById(focus.isDetail ? getDetailId(focus.cell.row - 1) : getCellId(focus.cell))?.focus();
    };

    const focusCell = (cell: Index2d) => focusAt({ cell, isDetail: false });

    const toggleExpanded = (layoutRow: number) => {
        const row = getRows()[layoutRow];

        if (getIsDisabled() || !getIsRowExpandable(row)) return;

        const next = TableUtils.getToggledExpanded(expandedSignal[0](), row);

        expandedSignal[1](() => next);

        void props.onExpandedChange?.(next);
    };

    createEffect(() => {
        const focus = getFocus();
        const expandedRowSet = getExpandedRowSet();

        if (!focus.isDetail || expandedRowSet.has(focus.cell.row - 1)) return;

        setFocus({ cell: focus.cell, isDetail: false });

        if (document.activeElement === document.body) document.getElementById(getCellId(focus.cell))?.focus();
    });

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
        document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
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

        setResizingColumnId(TableConst.NO_RESIZING);

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

        setResizingColumnId(TableConst.NO_RESIZING);
    };

    const getIsReorderable = (column: TableColumn<T> | undefined) =>
        column !== undefined && (column.isReorderable ?? false) && props.order !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        const columns = getColumns();

        if (!getIsReorderable(columns[fromIndex]) || getIsDisabled()) return false;
        if (toIndex < 0 || toIndex >= columns.length) return false;
        if (TableUtils.clampToPinGroup(columns, fromIndex, toIndex) !== toIndex) return false;

        const next = ObjectUtils.moveArrayElement(
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
            const element = document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }));

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
        computePlaceAtPoint: (point) => {
            const source = getSourceColumnIndex() ?? 0;

            return TableUtils.clampToPinGroup(
                getColumns(),
                source,
                TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, source, getDirection()),
            );
        },
        computeNudgedPlace: (place, nudge) => {
            const nudged = TableUtils.computeColumnNudgedPlace(place, nudge, getColumns().length);

            return nudged === undefined
                ? undefined
                : TableUtils.clampToPinGroup(getColumns(), getSourceColumnIndex() ?? 0, nudged);
        },
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
        if (TableUtils.getIsInsideDetail(e.target, e.currentTarget as HTMLElement)) return;

        const from = getRovingCell();
        const column = getColumns()[from.col];
        const command = TableUtils.computeKeyCommand(e, from, getGrid(), {
            direction: getDirection(),
            pageRows: access(props.pageRows) ?? TABLE_DEFAULTS.pageRows,
            expandedRows: getExpandedRows(),
            computeIsExpandable: getIsExpandable()
                ? (layoutRow) => getIsRowExpandable(getRows()[layoutRow])
                : undefined,
        });

        if (command === undefined) return;

        e.preventDefault();

        if (command.kind === "select_all") {
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

        if (command.kind === "move_column") {
            if (!moveColumn(from.col, command.to)) return;

            focusCell({ row: TableConst.HEADER_ROW_INDEX, col: command.to });

            LiveAnnouncerUtils.announce(
                getAnnouncements().computeColumnMoved(column.header, command.to, getGrid().colCount),
            );

            return;
        }

        if (command.kind === "toggle_row") {
            toggleExpanded(command.rowIndex);

            return;
        }

        if (command.kind === "activate_row") {
            if (!getIsDisabled()) void props.onRowActivate?.(getRows()[command.rowIndex], command.rowIndex);

            return;
        }

        if (command.kind === "pick_row") {
            selectRow(command.rowIndex, command.gesture);

            return;
        }

        const focus = TableUtils.computeFocus(command.cell, getExpandedRows());

        focusAt(focus);

        if (command.isExtending) selectRow(focus.cell.row - 1, { isExtending: true });
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

    const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps => {
        const roving = getRovingFocus();

        return TableUtils.computeCellRenderProps({
            columnId: getColumns()[layoutCol].id,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            dataRow: getDataRow(layoutRow),
            layoutRow,
            isSelected: getSelectedRows().has(getRows()[layoutRow]),
            roving: roving.isDetail ? TableConst.NO_CELL : roving.cell,
            hoveredRow: getHoveredRow(),
            isDisabled: getIsDisabled(),
            pin: getColumns()[layoutCol].pin,
            isExpandable: getIsRowExpandable(getRows()[layoutRow]),
            isExpanded: getExpandedRowSet().has(layoutRow),
        });
    };

    const getDetailRenderProps = (layoutRow: number): TableDetailRenderProps => ({
        dataRow: getDataRow(layoutRow),
        layoutRow,
        isSelected: getSelectedRows().has(getRows()[layoutRow]),
        isFocused: getIsDetailRoving(layoutRow),
        isDisabled: getIsDisabled(),
    });

    const getPinClassList = (layoutCol: number) => {
        const pin = getColumns()[layoutCol]?.pin;

        return { [styles.tablePinnedStart]: pin === "start", [styles.tablePinnedEnd]: pin === "end" };
    };

    const getPinStyle = (layoutCol: number) => {
        const offset = getPinOffsets()[layoutCol];

        return offset === undefined ? undefined : assignInlineVars({ [styles.tablePinOffsetVar]: `${offset}px` });
    };

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
            focusCell({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex });

            return;
        }

        if (CarrierSolidUtils.getCarryMode() === "drag") return;

        const rect = document
            .getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))
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
        const cell = { row: TableConst.HEADER_ROW_INDEX, col: columnIndex };
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
                classList={getPinClassList(columnIndex)}
                style={getPinStyle(columnIndex)}
                role="columnheader"
                aria-colindex={columnIndex + TableConst.FIRST_ARIA_INDEX}
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

    let hasExpander = false;
    let hasWarnedExpander = false;

    const renderCell = (
        getColumn: Accessor<TableColumn<T>>,
        getRow: Accessor<T>,
        columnIndex: number,
        rowIndex: number,
    ) => {
        const cell = { row: rowIndex + 1, col: columnIndex };
        const getRenderProps = () => getCellRenderProps(columnIndex, rowIndex);

        const cellContext: TableCellContextType = {
            getRenderProps,
            toggle: () => {
                focusCell(cell);
                toggleExpanded(rowIndex);
            },
            registerExpander: () => {
                hasExpander = true;
            },
        };

        return (
            <div
                id={getCellId(cell)}
                class={styles.tableCell}
                classList={getPinClassList(columnIndex)}
                style={getPinStyle(columnIndex)}
                role="gridcell"
                aria-colindex={columnIndex + TableConst.FIRST_ARIA_INDEX}
                aria-disabled={getIsDisabled() || undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
                onClick={(e) => handleCellClick(e, cell)}
            >
                <TableCellContextProvider value={cellContext}>
                    {getColumn().renderCell(getRow, getRenderProps)}
                </TableCellContextProvider>
            </div>
        );
    };

    const getRowClass = (virtualRow: VirtualizerRow | undefined) =>
        virtualRow ? [styles.tableRow, styles.tableWindowedRow].join(" ") : styles.tableRow;

    const getRowStyle = (virtualRow: VirtualizerRow | undefined) =>
        virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined;

    const renderRow = (getRow: Accessor<T>, rowIndex: number, virtualRow?: VirtualizerRow) => {
        onMount(() => {
            if (hasExpander || hasWarnedExpander || !getIsRowExpandable(getRow())) return;

            hasWarnedExpander = true;

            TableUtils.warnIfExpanderMissing();
        });

        return (
            <div
                class={getRowClass(virtualRow)}
                role="row"
                aria-rowindex={getWalkRow(rowIndex) + TableConst.FIRST_ARIA_INDEX}
                aria-level={getIsExpandable() ? TableConst.ROW_LEVEL : undefined}
                aria-expanded={getIsRowExpandable(getRow()) ? getExpandedRowSet().has(rowIndex) : undefined}
                aria-selected={getSelectionMode() === "none" ? undefined : getSelectedRows().has(getRow())}
                aria-label={props.computeRowAriaLabel?.(getRow(), rowIndex)}
                style={getRowStyle(virtualRow)}
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
    };

    const handleDetailClick = (e: MouseEvent, layoutRow: number) => {
        if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget as HTMLElement)) return;

        focusAt({ cell: { row: layoutRow + 1, col: getRovingCell().col }, isDetail: true });
    };

    const renderDetailRow = (getRow: Accessor<T>, layoutRow: number, virtualRow?: VirtualizerRow) => (
        <div
            class={getRowClass(virtualRow)}
            role="row"
            aria-rowindex={getWalkRow(layoutRow) + 1 + TableConst.FIRST_ARIA_INDEX}
            aria-level={TableConst.DETAIL_LEVEL}
            style={getRowStyle(virtualRow)}
            ref={(element: HTMLElement) => {
                if (virtualRow) rowWindow.measureRow(element, virtualRow.index);
            }}
        >
            <div
                {...{ [TableUtils.DETAIL_ATTRIBUTE]: "true" }}
                id={getDetailId(layoutRow)}
                class={styles.tableDetailCell}
                role="gridcell"
                aria-colindex={TableConst.FIRST_ARIA_INDEX}
                aria-colspan={getColumns().length}
                aria-disabled={getIsDisabled() || undefined}
                tabindex={getIsDetailRoving(layoutRow) ? 0 : -1}
                onClick={(e) => handleDetailClick(e, layoutRow)}
            >
                {props.renderDetail?.(getRow, () => getDetailRenderProps(layoutRow))}
            </div>
        </div>
    );

    const renderRows = () => (
        <Index each={getRows()}>
            {(getRow, rowIndex) => (
                <>
                    {renderRow(getRow, rowIndex)}

                    <Show when={getExpandedRowSet().has(rowIndex)}>{renderDetailRow(getRow, rowIndex)}</Show>
                </>
            )}
        </Index>
    );

    const renderWindowedEntry = (virtualRow: VirtualizerRow) => {
        const getEntry = createMemo(
            (): TableEntry => TableUtils.getEntry(virtualRow.index, getExpandedRows()),
            undefined,
            {
                equals: (a, b) => a.kind === b.kind && a.layoutRow === b.layoutRow,
            },
        );

        return (
            <Show when={getEntry()} keyed>
                {(entry) =>
                    entry.kind === "detail"
                        ? renderDetailRow(() => getRows()[entry.layoutRow], entry.layoutRow, virtualRow)
                        : renderRow(() => getRows()[entry.layoutRow], entry.layoutRow, virtualRow)
                }
            </Show>
        );
    };

    const renderWindowedRows = () => <For each={rowWindow.getRows()}>{renderWindowedEntry}</For>;

    return (
        <div
            class={styles.tableRoot}
            role={getIsExpandable() ? "treegrid" : "grid"}
            aria-label={access(props.ariaLabel)}
            aria-rowcount={getGrid().rowCount}
            aria-colcount={getGrid().colCount}
            aria-multiselectable={getSelectionMode() === "multiple" || undefined}
            aria-disabled={getIsDisabled() || undefined}
            style={assignInlineVars({
                [styles.tableTemplateVar]: getTemplate(),
                [styles.tableResizerWidthVar]: `${access(props.resizerWidthPx) ?? TABLE_DEFAULTS.resizerWidthPx}px`,
                [styles.tableMinWidthVar]: `${TableUtils.computeMinTableWidth(getColumns(), getWidths())}px`,
            })}
            onKeyDown={handleKeyDown}
        >
            <div ref={setHeaderRef} class={styles.tableHeader} role="rowgroup">
                <div class={styles.tableRow} role="row" aria-rowindex={TableConst.FIRST_ARIA_INDEX}>
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
                style={{ height: getIsWindowed() ? `${rowWindow.getTotalSize()}px` : undefined }}
            >
                <Show when={getIsWindowed()} fallback={renderRows()}>
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

export const TableRowExpander = (props: TableRowExpanderProps) => {
    const context = useTableCellContext("TableRowExpander");

    context?.registerExpander();

    return (
        <Show when={context?.getRenderProps().isExpandable}>
            <button
                type="button"
                class={styles.tableRowExpander}
                tabindex={-1}
                aria-hidden="true"
                onClick={(e) => {
                    e.stopPropagation();

                    context!.toggle();
                }}
            >
                {props.renderContent(context!.getRenderProps)}
            </button>
        </Show>
    );
};
