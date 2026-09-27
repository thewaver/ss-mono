import {
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import type {
    CarrierZone,
    CarryPlace,
    SelectionGesture,
    TableCellRenderProps,
    TableColumnRenderProps,
    TableHeaderContextType,
    VirtualizerRow,
} from "@thewaver/ss-components";
import { CarrierUtils, LiveAnnouncerUtils, TABLE_DEFAULTS, TableStyles, TableUtils } from "@thewaver/ss-components";
import type { Index2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { CarrierReactUtils } from "../../Abstracts/Carrier/CarrierReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { SelectionReactUtils } from "../../Abstracts/Selection/SelectionReact.utils";
import { VirtualizerReactUtils } from "../../Abstracts/Virtualizer/VirtualizerReact.utils";
import { TableHeaderContextProvider, useTableHeaderContext } from "./Table.context";
import type { TableColumn, TableHeaderReorderProps, TableHeaderSortProps, TableProps } from "./Table.types";

const HEADER_ROW_INDEX = TableUtils.HEADER_ROW_INDEX;
const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;

const NO_RESIZING = "";

const EMPTY_PINNED_ROWS: number[] = [];
const EMPTY_WIDTHS: Record<string, number> = {};
const EMPTY_ORDER: string[] = [];
const EMPTY_SELECTION: never[] = [];

type TableHeaderCellProps<T> = {
    column: TableColumn<T>;
    cellId: string;
    columnIndex: number;
    isLast: boolean;
    isRoving: boolean;
    isDisabled: boolean;
    isReorderable: boolean;
    hintId: string | undefined;
    landingCol: number | undefined;
    columnCount: number;
    renderProps: TableColumnRenderProps;
    context: Omit<TableHeaderContextType, "registerSort" | "registerReorder">;
    renderResizer: () => ReactNode;
    renderMarker: (() => ReactNode) | undefined;
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onClick: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
};

const TableHeaderCell = <T,>(props: TableHeaderCellProps<T>) => {
    const hasSortControlRef = useRef(false);
    const hasReorderGripRef = useRef(false);
    const latestRef = useRef(props);

    latestRef.current = props;

    useEffect(() => {
        TableUtils.warnIfHeaderControlsMissing(latestRef.current.column, {
            isReorderable: latestRef.current.isReorderable,
            hasSortControl: hasSortControlRef.current,
            hasReorderGrip: hasReorderGripRef.current,
        });
    }, []);

    const headerContext: TableHeaderContextType = {
        ...props.context,
        registerSort: () => {
            hasSortControlRef.current = true;
        },
        registerReorder: () => {
            hasReorderGripRef.current = true;
        },
    };

    const renderMarker = (columnIndex: number) =>
        props.landingCol === columnIndex ? (
            <div
                className={
                    columnIndex < props.columnCount ? TableStyles.tableMarkerBefore : TableStyles.tableMarkerAfter
                }
            >
                {props.renderMarker?.()}
            </div>
        ) : null;

    return (
        <div
            id={props.cellId}
            className={TableStyles.tableCell}
            role="columnheader"
            aria-colindex={props.columnIndex + FIRST_ARIA_INDEX}
            aria-sort={TableUtils.computeAriaSort(props.column, props.renderProps.sortDirection)}
            aria-disabled={props.isDisabled || undefined}
            aria-describedby={props.isReorderable ? props.hintId : undefined}
            tabIndex={props.isRoving ? 0 : -1}
            onPointerDown={props.onPointerDown}
            onClick={props.onClick}
            onPointerEnter={props.onPointerEnter}
            onPointerLeave={props.onPointerLeave}
        >
            <TableHeaderContextProvider value={headerContext}>
                {props.column.renderHeader(props.renderProps)}
            </TableHeaderContextProvider>

            {props.renderProps.isResizable && props.renderResizer()}

            {renderMarker(props.columnIndex)}

            {props.isLast && renderMarker(props.columnCount)}
        </div>
    );
};

export const Table = <T,>(props: TableProps<T>) => {
    const tableId = useId();
    const hintId = useId();

    const headerRef = useRef<HTMLDivElement | null>(null);
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const resizeStartRef = useRef({ x: 0, width: 0, hasDragged: false });
    const hasCarriedClickRef = useRef(false);

    const [focusedCell, setFocusedCell] = useState<Index2d>({ row: HEADER_ROW_INDEX, col: 0 });
    const [hoveredRow, setHoveredRow] = useState<number>();
    const [hoveredColumn, setHoveredColumn] = useState<number>();
    const [resizingColumnId, setResizingColumnId] = useState(NO_RESIZING);

    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const direction = NavigatorReactUtils.useDirection(headerRef);

    const isDisabled = props.isDisabled ?? false;
    const widths = props.widthsState?.[0] ?? EMPTY_WIDTHS;
    const sort = props.sortState?.[0];
    const selected = props.selectionState?.[0] ?? EMPTY_SELECTION;
    const selectionMode = TableUtils.getSelectionMode(props.selectionMode, props.selectionState !== undefined);
    const isVirtualized = props.computeEstimatedRowHeight !== undefined;
    const resizeStepPx = props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx;

    const columnOrder = useMemo(
        () => TableUtils.getColumnOrder(props.columns, props.orderState?.[0] ?? EMPTY_ORDER),
        [props.columns, props.orderState?.[0]],
    );

    const columns = useMemo(() => TableUtils.getReordered(props.columns, columnOrder), [props.columns, columnOrder]);

    const sortedColumn = sort === undefined ? undefined : columns.find((column) => column.id === sort.columnId);

    const rowOrder = useMemo(
        () => TableUtils.getSortedOrder(props.rows, sortedColumn, sort),
        [props.rows, sortedColumn, sort],
    );

    const rows = useMemo(() => TableUtils.getReordered(props.rows, rowOrder), [props.rows, rowOrder]);

    const selectedRows = useMemo(() => new Set(selected), [selected]);

    const grid = { rowCount: rows.length + 1, colCount: columns.length };
    const rovingCell = TableUtils.clampCell(focusedCell, grid);

    const getDataCol = (layoutCol: number) => columnOrder?.[layoutCol] ?? layoutCol;
    const getDataRow = (layoutRow: number) => rowOrder?.[layoutRow] ?? layoutRow;

    const pinnedRows = useMemo(
        () => (rovingCell.row === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [rovingCell.row - 1]),
        [rovingCell.row],
    );

    const rowWindow = VirtualizerReactUtils.useRowWindow(bodyRef, rows.length, {
        isDisabled: !isVirtualized,
        computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
        pinnedRows,
    });

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

    const getIsRoving = (cell: Index2d) => rovingCell.row === cell.row && rovingCell.col === cell.col;

    const focusCell = (cell: Index2d) => {
        setFocusedCell(cell);

        if (cell.row > HEADER_ROW_INDEX && rowWindow.isLive) rowWindow.scrollToRow(cell.row - 1);

        document.getElementById(getCellId(cell))?.focus();
    };

    const toggleSort = (column: TableColumn<T> | undefined) => {
        if (!column || column.isSortable !== true || isDisabled) return;

        const next = TableUtils.getNextSort(sort, column.id);

        props.sortState?.[1](next);
        props.onSortChange?.(next);
    };

    const selection = SelectionReactUtils.useSelection(isDisabled, {
        mode: selectionMode,
        items: rows,
        selectionState: [
            selected,
            (next) => {
                props.selectionState?.[1](next);
                props.onSelectionChange?.(next);
            },
        ],
    });

    const selectRow = (rowIndex: number, gesture?: SelectionGesture) => {
        const row = rows[rowIndex];

        if (row !== undefined) selection.pick(row, gesture);
    };

    const getCurrentWidth = (column: TableColumn<T>, columnIndex: number) =>
        TableUtils.getColumnWidth(column, widths) ??
        document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
        0;

    const getIsResizable = (column: TableColumn<T>) => (column.isResizable ?? false) && props.widthsState !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || isDisabled) return;

        props.widthsState?.[1]({ ...widths, [column.id]: TableUtils.getResizedWidth(column, width) });
    };

    const handleResizerPointerDown = (e: PointerEvent<HTMLDivElement>, column: TableColumn<T>, columnIndex: number) => {
        if (e.button !== 0 || isDisabled) return;

        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.setPointerCapture(e.pointerId);

        resizeStartRef.current = { x: e.clientX, width: getCurrentWidth(column, columnIndex), hasDragged: false };

        setResizingColumnId(column.id);
    };

    const handleResizerPointerMove = (e: PointerEvent<HTMLDivElement>, column: TableColumn<T>) => {
        if (resizingColumnId !== column.id) return;

        const start = resizeStartRef.current;

        if (e.clientX !== start.x) start.hasDragged = true;

        resizeColumn(column, TableUtils.computeDraggedWidth(start.width, e.clientX - start.x, direction));
    };

    const handleResizerPointerUp = (e: PointerEvent<HTMLDivElement>, column: TableColumn<T>, columnIndex: number) => {
        if (resizingColumnId !== column.id) return;

        e.currentTarget.releasePointerCapture(e.pointerId);

        setResizingColumnId(NO_RESIZING);

        if (resizeStartRef.current.hasDragged) return;

        resizeColumn(
            column,
            TableUtils.computePressedWidth({
                clientX: e.clientX,
                rect: e.currentTarget.getBoundingClientRect(),
                width: getCurrentWidth(column, columnIndex),
                step: resizeStepPx,
                direction,
            }),
        );
    };

    const getIsReorderable = (column: TableColumn<T> | undefined) =>
        column !== undefined && (column.isReorderable ?? false) && props.orderState !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        if (!getIsReorderable(columns[fromIndex]) || isDisabled) return false;
        if (toIndex < 0 || toIndex >= columns.length) return false;

        const next = CarrierUtils.computeMovedOrder(
            columns.map((column) => column.id),
            fromIndex,
            toIndex,
        );

        props.orderState?.[1](next);
        props.onOrderChange?.(next);

        return true;
    };

    const getHeaderRects = () =>
        columns.reduce<DOMRect[]>((acc, _unused, columnIndex) => {
            const element = document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }));

            if (element) acc.push(element.getBoundingClientRect());

            return acc;
        }, []);

    const carryState = CarrierReactUtils.useCarry();

    const zoneRef = useRef<CarrierZone | undefined>(undefined);

    const getSourceColumnIndex = () => {
        const state = CarrierUtils.carry.get();

        return state && state.from === zoneRef.current ? (state.fromPlace as number) : undefined;
    };

    const zone = CarrierReactUtils.useZone({
        getGroupId: () => tableId,
        getLabel: () => props.ariaLabel,
        getRootRef: () => headerRef.current ?? undefined,
        getIsDisabled: () => isDisabled || props.orderState === undefined,
        getKeyHint: () => props.announcements!.keyHint,
        getAnnouncements: () => props.announcements!,
        computeCanAccept: () => !isDisabled && props.orderState !== undefined,
        computePlaceAtPoint: (point) =>
            TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, getSourceColumnIndex() ?? 0, direction),
        computeNudgedPlace: (place, nudge) => TableUtils.computeColumnNudgedPlace(place, nudge, columns.length),
        computeEntryPlace: () => getSourceColumnIndex() ?? 0,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => props.announcements!.computePlaceLabel(place as number, columns.length),
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: (fromPlace: CarryPlace, toPlace: CarryPlace) => moveColumn(fromPlace as number, toPlace as number),
    });

    zoneRef.current = zone;

    const carriedColumnId = carryState?.from === zone ? carryState.carry.key : undefined;

    const sourceColumnIndex = carryState?.from === zone ? (carryState.fromPlace as number) : undefined;

    const landingCol =
        carryState?.to === zone && carryState.toPlace !== undefined
            ? TableUtils.computeLandingCol(carryState.toPlace, sourceColumnIndex ?? 0)
            : undefined;

    const startCarry = (columnIndex: number, mode: "drag" | "tap") => {
        const column = columns[columnIndex];

        CarrierUtils.start(
            zone,
            columnIndex,
            { groupId: tableId, key: column.id, label: column.header, value: column.id },
            mode,
        );
    };

    const handleHeaderPointerDown = (e: PointerEvent<HTMLDivElement>, columnIndex: number) => {
        const column = columns[columnIndex];

        if (e.button !== 0 || isDisabled || !getIsReorderable(column)) return;
        if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
        if (CarrierUtils.getCarry()) return;

        CarrierUtils.dragFromPointer(
            e.currentTarget,
            e.nativeEvent,
            () => startCarry(columnIndex, "drag"),
            () => {
                hasCarriedClickRef.current = true;
            },
        );
    };

    const handleGripClick = (columnIndex: number) => {
        if (!CarrierUtils.getCarry()) {
            if (!getIsReorderable(columns[columnIndex])) return;

            startCarry(columnIndex, "tap");
            focusCell({ row: HEADER_ROW_INDEX, col: columnIndex });

            return;
        }

        if (CarrierUtils.getCarryMode() === "drag") return;

        const rect = document
            .getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))
            ?.getBoundingClientRect();

        if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const from = rovingCell;
        const column = columns[from.col];
        const command = TableUtils.computeKeyCommand(e, from, grid, {
            direction,
            pageRows: props.pageRows ?? TABLE_DEFAULTS.pageRows,
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
            resizeColumn(column, getCurrentWidth(column, from.col) + command.step * resizeStepPx);

            return;
        }

        if (command.kind === "moveColumn") {
            if (!moveColumn(from.col, command.to)) return;

            focusCell({ row: HEADER_ROW_INDEX, col: command.to });

            LiveAnnouncerUtils.announce(
                props.announcements!.computeColumnMoved(column.header, command.to, grid.colCount),
            );

            return;
        }

        if (command.kind === "activateRow") {
            if (!isDisabled) props.onRowActivate?.(rows[command.rowIndex], command.rowIndex);

            return;
        }

        if (command.kind === "pickRow") {
            selectRow(command.rowIndex, command.gesture);

            return;
        }

        focusCell(command.cell);

        if (command.isExtending) selectRow(command.cell.row - 1, { isExtending: true });
    };

    const handleCellClick = (e: MouseEvent<HTMLDivElement>, cell: Index2d) => {
        if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget)) return;

        focusCell(cell);

        if (isDisabled) return;

        selectRow(cell.row - 1, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey });
    };

    const getColumnRenderProps = (layoutCol: number): TableColumnRenderProps => {
        const column = columns[layoutCol];

        return TableUtils.computeColumnRenderProps({
            column,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            sort,
            roving: rovingCell,
            isReorderable: getIsReorderable(column),
            isResizable: getIsResizable(column),
            resizingColumnId,
            carriedColumnId,
            hoveredColumn,
            isDisabled,
        });
    };

    const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps =>
        TableUtils.computeCellRenderProps({
            columnId: columns[layoutCol].id,
            dataCol: getDataCol(layoutCol),
            layoutCol,
            dataRow: getDataRow(layoutRow),
            layoutRow,
            isSelected: selectedRows.has(rows[layoutRow]),
            roving: rovingCell,
            hoveredRow,
            isDisabled,
        });

    const renderResizer = (column: TableColumn<T>, columnIndex: number, renderProps: TableColumnRenderProps) => (
        <div
            className={TableStyles.tableResizer}
            aria-hidden="true"
            onPointerDown={(e) => handleResizerPointerDown(e, column, columnIndex)}
            onPointerMove={(e) => handleResizerPointerMove(e, column)}
            onPointerUp={(e) => handleResizerPointerUp(e, column, columnIndex)}
            onPointerCancel={() => {
                if (resizingColumnId === column.id) setResizingColumnId(NO_RESIZING);
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {props.renderResizer?.(renderProps)}
        </div>
    );

    const renderRow = (row: T, rowIndex: number, virtualRow?: VirtualizerRow) => (
        <div
            key={rowIndex}
            className={
                virtualRow ? [TableStyles.tableRow, TableStyles.tableWindowedRow].join(" ") : TableStyles.tableRow
            }
            role="row"
            aria-rowindex={rowIndex + 1 + FIRST_ARIA_INDEX}
            aria-selected={selectionMode === "none" ? undefined : selectedRows.has(row)}
            aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
            style={virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined}
            ref={virtualRow ? rowWindow.measureRow(virtualRow.index) : undefined}
            onPointerEnter={() => setHoveredRow(rowIndex)}
            onPointerLeave={() => setHoveredRow(undefined)}
        >
            {columns.map((column, columnIndex) => {
                const cell = { row: rowIndex + 1, col: columnIndex };

                return (
                    <div
                        key={columnIndex}
                        id={getCellId(cell)}
                        className={TableStyles.tableCell}
                        role="gridcell"
                        aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                        aria-disabled={isDisabled || undefined}
                        tabIndex={getIsRoving(cell) ? 0 : -1}
                        onClick={(e) => handleCellClick(e, cell)}
                    >
                        {column.renderCell(row, getCellRenderProps(columnIndex, rowIndex))}
                    </div>
                );
            })}
        </div>
    );

    const rootStyle = assignInlineVars({
        [TableStyles.tableTemplateVar]: TableUtils.getColumnTemplate(columns, widths),
        [TableStyles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
    }) as CSSProperties;

    return (
        <div
            className={TableStyles.tableRoot}
            role="grid"
            aria-label={props.ariaLabel}
            aria-rowcount={grid.rowCount}
            aria-colcount={grid.colCount}
            aria-multiselectable={selectionMode === "multiple" || undefined}
            aria-disabled={isDisabled || undefined}
            style={rootStyle}
            onKeyDown={handleKeyDown}
        >
            <div ref={headerRef} className={TableStyles.tableHeader} role="rowgroup">
                <div className={TableStyles.tableRow} role="row" aria-rowindex={FIRST_ARIA_INDEX}>
                    {columns.map((column, columnIndex) => {
                        const cell = { row: HEADER_ROW_INDEX, col: columnIndex };
                        const renderProps = getColumnRenderProps(columnIndex);

                        return (
                            <TableHeaderCell<T>
                                key={columnIndex}
                                column={column}
                                cellId={getCellId(cell)}
                                columnIndex={columnIndex}
                                isLast={columnIndex === columns.length - 1}
                                isRoving={getIsRoving(cell)}
                                isDisabled={isDisabled}
                                isReorderable={getIsReorderable(column)}
                                hintId={props.orderState !== undefined ? hintId : undefined}
                                landingCol={landingCol}
                                columnCount={columns.length}
                                renderProps={renderProps}
                                context={{
                                    getRenderProps: () => renderProps,
                                    sort: () => {
                                        focusCell(cell);

                                        if (isDisabled) return;

                                        toggleSort(column);
                                    },
                                    pickUp: () => {
                                        focusCell(cell);

                                        if (isDisabled) return;

                                        handleGripClick(columnIndex);
                                    },
                                }}
                                renderResizer={() => renderResizer(column, columnIndex, renderProps)}
                                renderMarker={props.renderMarker}
                                onPointerDown={(e) => handleHeaderPointerDown(e, columnIndex)}
                                onClick={() => {
                                    if (hasCarriedClickRef.current) {
                                        hasCarriedClickRef.current = false;

                                        return;
                                    }

                                    focusCell(cell);
                                }}
                                onPointerEnter={() => setHoveredColumn(columnIndex)}
                                onPointerLeave={() => setHoveredColumn(undefined)}
                            />
                        );
                    })}
                </div>
            </div>

            {props.orderState !== undefined && (
                <div id={hintId} className={TableStyles.tableHint}>
                    {props.announcements.restingKeyHint}
                </div>
            )}

            <div
                ref={bodyRef}
                className={TableStyles.tableBody}
                role="rowgroup"
                style={{ height: isVirtualized ? `${rowWindow.totalSize}px` : undefined }}
            >
                {isVirtualized
                    ? rowWindow.rows.map((virtualRow) =>
                          renderRow(rows[virtualRow.index], virtualRow.index, virtualRow),
                      )
                    : rows.map((row, rowIndex) => renderRow(row, rowIndex))}
            </div>
        </div>
    );
};

export const TableHeaderSort = (props: TableHeaderSortProps) => {
    const context = useTableHeaderContext("TableHeaderSort");

    context?.registerSort();

    if (!context?.getRenderProps().isSortable) return null;

    return (
        <button
            type="button"
            className={TableStyles.tableSortControl}
            tabIndex={-1}
            aria-hidden="true"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();

                context.sort();
            }}
        >
            {props.renderContent(context.getRenderProps())}
        </button>
    );
};

export const TableHeaderReorder = (props: TableHeaderReorderProps) => {
    const context = useTableHeaderContext("TableHeaderReorder");

    context?.registerReorder();

    if (!context?.getRenderProps().isReorderable) return null;

    return (
        <button
            type="button"
            className={TableStyles.tableReorderGrip}
            tabIndex={-1}
            aria-hidden="true"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();

                context.pickUp();
            }}
        >
            {props.renderContent(context.getRenderProps())}
        </button>
    );
};
