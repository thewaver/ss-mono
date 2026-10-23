import {
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    type ReactNode,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type {
    CarrierZone,
    CarryPlace,
    SelectionGesture,
    TableCellContextType,
    TableCellRenderProps,
    TableColumnRenderProps,
    TableDetailRenderProps,
    TableFocus,
    TableHeaderContextType,
    VirtualizerRow,
} from "@thewaver/ss-components";
import { CarrierUtils, LiveAnnouncerUtils, TABLE_DEFAULTS, TableStyles, TableUtils } from "@thewaver/ss-components";
import { TableConst } from "@thewaver/ss-components/internal";
import { type Index2d, ObjectUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { CarrierReactUtils } from "../../Abstracts/Carrier/CarrierReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { SelectionReactUtils } from "../../Abstracts/Selection/SelectionReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { VirtualizerReactUtils } from "../../Abstracts/Virtualizer/VirtualizerReact.utils";
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
} from "./Table.types";

type TableHeaderCellProps<T> = {
    column: TableColumn<T>;
    cellId: string;
    className: string;
    style: CSSProperties | undefined;
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
            className={props.className}
            style={props.style}
            role="columnheader"
            aria-colindex={props.columnIndex + TableConst.FIRST_ARIA_INDEX}
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
    const pendingFocusIdRef = useRef<string | undefined>(undefined);

    const [focus, setFocus] = useState<TableFocus>({
        cell: { row: TableConst.HEADER_ROW_INDEX, col: 0 },
        isDetail: false,
    });
    const [hoveredRow, setHoveredRow] = useState<number>();
    const [hoveredColumn, setHoveredColumn] = useState<number>();
    const [resizingColumnId, setResizingColumnId] = useState(TableConst.NO_RESIZING);

    useEffect(() => LiveAnnouncerUtils.reserve("polite"), []);

    const direction = NavigatorReactUtils.useDirection(headerRef);

    const isDisabled = props.isDisabled ?? false;
    const widths = props.widths?.[0] ?? TableConst.EMPTY_WIDTHS;
    const sort = props.sort?.[0];
    const selected = props.selection?.[0] ?? TableConst.EMPTY_SELECTION;
    const selectionMode = TableUtils.getSelectionMode(props.selectionMode, props.selection !== undefined);
    const isVirtualized = props.computeEstimatedRowHeight !== undefined;
    const resizeStepPx = props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx;

    const columnOrder = useMemo(
        () =>
            TableUtils.getPinnedOrder(
                props.columns,
                TableUtils.getColumnOrder(props.columns, props.order?.[0] ?? TableConst.EMPTY_ORDER),
            ),
        [props.columns, props.order?.[0]],
    );

    const columns = useMemo(() => TableUtils.getReordered(props.columns, columnOrder), [props.columns, columnOrder]);

    const pinOffsets = useMemo(() => TableUtils.computePinOffsets(columns, widths), [columns, widths]);

    const sortedColumn = sort === undefined ? undefined : columns.find((column) => column.id === sort.columnId);

    const rowOrder = useMemo(
        () => TableUtils.getSortedOrder(props.rows, sortedColumn, sort),
        [props.rows, sortedColumn, sort],
    );

    const rows = useMemo(() => TableUtils.getReordered(props.rows, rowOrder), [props.rows, rowOrder]);

    const selectedRows = useMemo(() => new Set(selected), [selected]);

    const isExpandable = props.renderDetail !== undefined;

    const [expanded, setExpanded] = SignalMirrorReactUtils.useOptionalState<T[]>(props.expanded, []);

    const getIsRowExpandable = (row: T | undefined) =>
        row !== undefined && isExpandable && (props.computeIsExpandable?.(row) ?? true);

    const expandedRows = useMemo(
        () =>
            isExpandable
                ? TableUtils.getExpandedRows(rows, expanded, props.computeIsExpandable)
                : TableConst.EMPTY_EXPANDED_ROWS,
        [isExpandable, rows, expanded, props.computeIsExpandable],
    );

    const expandedRowSet = useMemo(() => new Set(expandedRows), [expandedRows]);

    const getWalkRow = (layoutRow: number) => TableUtils.getEntryIndex(layoutRow, expandedRows) + 1;

    const grid = {
        rowCount: TableUtils.getEntryCount(rows.length, expandedRows) + 1,
        colCount: columns.length,
    };
    const rovingCell = TableUtils.clampCell(TableUtils.computeWalkCell(focus, expandedRows), grid);
    const rovingFocus = TableUtils.computeFocus(rovingCell, expandedRows);

    const getDataCol = (layoutCol: number) => columnOrder?.[layoutCol] ?? layoutCol;
    const getDataRow = (layoutRow: number) => rowOrder?.[layoutRow] ?? layoutRow;

    const pinnedRows = useMemo(
        () => (rovingCell.row === TableConst.HEADER_ROW_INDEX ? TableConst.EMPTY_PINNED_ROWS : [rovingCell.row - 1]),
        [rovingCell.row],
    );

    const rowWindow = VirtualizerReactUtils.useRowWindow(bodyRef, TableUtils.getEntryCount(rows.length, expandedRows), {
        isDisabled: !isVirtualized,
        computeEstimatedSize: (index) =>
            props.computeEstimatedRowHeight?.(TableUtils.getEntry(index, expandedRows).layoutRow) ?? 0,
        pinnedRows,
    });

    const isWindowed = isVirtualized && !rowWindow.hasNoScroller;

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

    const getDetailId = (layoutRow: number) => TableUtils.getDetailId(tableId, layoutRow);

    const getIsRoving = (cell: Index2d) =>
        !rovingFocus.isDetail && rovingFocus.cell.row === cell.row && rovingFocus.cell.col === cell.col;

    const getIsDetailRoving = (layoutRow: number) => rovingFocus.isDetail && rovingFocus.cell.row === layoutRow + 1;

    const focusAt = (next: TableFocus) => {
        setFocus(next);

        const walkCell = TableUtils.computeWalkCell(next, expandedRows);

        if (walkCell.row > TableConst.HEADER_ROW_INDEX && rowWindow.isLive) rowWindow.scrollToRow(walkCell.row - 1);

        const id = next.isDetail ? getDetailId(next.cell.row - 1) : getCellId(next.cell);
        const element = document.getElementById(id);

        if (element) {
            element.focus();

            return;
        }

        pendingFocusIdRef.current = id;
    };

    useLayoutEffect(() => {
        const id = pendingFocusIdRef.current;
        const element = id === undefined ? undefined : document.getElementById(id);

        if (!element) return;

        pendingFocusIdRef.current = undefined;
        element.focus();
    });

    const focusCell = (cell: Index2d) => focusAt({ cell, isDetail: false });

    const toggleExpanded = (layoutRow: number) => {
        const row = rows[layoutRow];

        if (isDisabled || !getIsRowExpandable(row)) return;

        const next = TableUtils.getToggledExpanded(expanded, row);

        setExpanded(next);

        props.onExpandedChange?.(next);
    };

    useLayoutEffect(() => {
        if (!focus.isDetail || expandedRowSet.has(focus.cell.row - 1)) return;

        setFocus({ cell: focus.cell, isDetail: false });

        if (document.activeElement === document.body) document.getElementById(getCellId(focus.cell))?.focus();
    }, [focus, expandedRowSet]);

    const toggleSort = (column: TableColumn<T> | undefined) => {
        if (!column || column.isSortable !== true || isDisabled) return;

        const next = TableUtils.getNextSort(sort, column.id);

        props.sort?.[1](next);
        props.onSortChange?.(next);
    };

    const selection = SelectionReactUtils.useSelection(isDisabled, {
        mode: selectionMode,
        items: rows,
        selection: [
            selected,
            (next) => {
                props.selection?.[1](next);
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
        document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
        0;

    const getIsResizable = (column: TableColumn<T>) => (column.isResizable ?? false) && props.widths !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || isDisabled) return;

        props.widths?.[1]({ ...widths, [column.id]: TableUtils.getResizedWidth(column, width) });
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

        setResizingColumnId(TableConst.NO_RESIZING);

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
        column !== undefined && (column.isReorderable ?? false) && props.order !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        if (!getIsReorderable(columns[fromIndex]) || isDisabled) return false;
        if (toIndex < 0 || toIndex >= columns.length) return false;
        if (TableUtils.clampToPinGroup(columns, fromIndex, toIndex) !== toIndex) return false;

        const next = ObjectUtils.moveArrayElement(
            columns.map((column) => column.id),
            fromIndex,
            toIndex,
        );

        props.order?.[1](next);
        props.onOrderChange?.(next);

        return true;
    };

    const getHeaderRects = () =>
        columns.reduce<DOMRect[]>((acc, _unused, columnIndex) => {
            const element = document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }));

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
        getIsDisabled: () => isDisabled || props.order === undefined,
        getKeyHint: () => props.announcements!.keyHint,
        getAnnouncements: () => props.announcements!,
        computeCanAccept: () => !isDisabled && props.order !== undefined,
        computePlaceAtPoint: (point) => {
            const source = getSourceColumnIndex() ?? 0;

            return TableUtils.clampToPinGroup(
                columns,
                source,
                TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, source, direction),
            );
        },
        computeNudgedPlace: (place, nudge) => {
            const nudged = TableUtils.computeColumnNudgedPlace(place, nudge, columns.length);

            return nudged === undefined
                ? undefined
                : TableUtils.clampToPinGroup(columns, getSourceColumnIndex() ?? 0, nudged);
        },
        computeEntryPlace: () => getSourceColumnIndex() ?? 0,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => props.announcements!.computePlaceLabel(place as number, columns.length),
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: (fromPlace: CarryPlace, toPlace: CarryPlace) => moveColumn(fromPlace as number, toPlace as number),
    });

    zoneRef.current = zone;

    const isSource = carryState?.from === zone;

    useEffect(() => (isSource ? TableUtils.observeCarryCancel(zone) : undefined), [isSource, zone]);

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
            focusCell({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex });

            return;
        }

        if (CarrierUtils.getCarryMode() === "drag") return;

        const rect = document
            .getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))
            ?.getBoundingClientRect();

        if (rect) CarrierUtils.aimAtPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);

        CarrierUtils.end("drop");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (TableUtils.getIsInsideDetail(e.target, e.currentTarget)) return;

        const from = rovingCell;
        const column = columns[from.col];
        const command = TableUtils.computeKeyCommand(e, from, grid, {
            direction,
            pageRows: props.pageRows ?? TABLE_DEFAULTS.pageRows,
            expandedRows,
            computeIsExpandable: isExpandable ? (layoutRow) => getIsRowExpandable(rows[layoutRow]) : undefined,
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
            resizeColumn(column, getCurrentWidth(column, from.col) + command.step * resizeStepPx);

            return;
        }

        if (command.kind === "move_column") {
            if (!moveColumn(from.col, command.to)) return;

            focusCell({ row: TableConst.HEADER_ROW_INDEX, col: command.to });

            LiveAnnouncerUtils.announce(
                props.announcements!.computeColumnMoved(column.header, command.to, grid.colCount),
            );

            return;
        }

        if (command.kind === "toggle_row") {
            toggleExpanded(command.rowIndex);

            return;
        }

        if (command.kind === "activate_row") {
            if (!isDisabled) props.onRowActivate?.(rows[command.rowIndex], command.rowIndex);

            return;
        }

        if (command.kind === "pick_row") {
            selectRow(command.rowIndex, command.gesture);

            return;
        }

        const next = TableUtils.computeFocus(command.cell, expandedRows);

        focusAt(next);

        if (command.isExtending) selectRow(next.cell.row - 1, { isExtending: true });
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
            roving: rovingFocus.isDetail ? TableConst.NO_CELL : rovingFocus.cell,
            hoveredRow,
            isDisabled,
            pin: columns[layoutCol].pin,
            isExpandable: getIsRowExpandable(rows[layoutRow]),
            isExpanded: expandedRowSet.has(layoutRow),
        });

    const getDetailRenderProps = (layoutRow: number): TableDetailRenderProps => ({
        dataRow: getDataRow(layoutRow),
        layoutRow,
        isSelected: selectedRows.has(rows[layoutRow]),
        isFocused: getIsDetailRoving(layoutRow),
        isDisabled,
    });

    const getPinClassName = (layoutCol: number) => {
        const pin = columns[layoutCol]?.pin;

        return [
            TableStyles.tableCell,
            pin === "start" && TableStyles.tablePinnedStart,
            pin === "end" && TableStyles.tablePinnedEnd,
        ]
            .filter(Boolean)
            .join(" ");
    };

    const getPinStyle = (layoutCol: number) => {
        const offset = pinOffsets[layoutCol];

        return offset === undefined
            ? undefined
            : (assignInlineVars({ [TableStyles.tablePinOffsetVar]: `${offset}px` }) as CSSProperties);
    };

    const renderResizer = (column: TableColumn<T>, columnIndex: number, renderProps: TableColumnRenderProps) => (
        <div
            className={TableStyles.tableResizer}
            aria-hidden="true"
            onPointerDown={(e) => handleResizerPointerDown(e, column, columnIndex)}
            onPointerMove={(e) => handleResizerPointerMove(e, column)}
            onPointerUp={(e) => handleResizerPointerUp(e, column, columnIndex)}
            onPointerCancel={() => {
                if (resizingColumnId === column.id) setResizingColumnId(TableConst.NO_RESIZING);
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {props.renderResizer?.(renderProps)}
        </div>
    );

    const hasExpanderRef = useRef(false);
    const hasWarnedExpanderRef = useRef(false);

    let hasExpandableRow = false;

    useEffect(() => {
        if (hasExpanderRef.current || hasWarnedExpanderRef.current || !hasExpandableRow) return;

        hasWarnedExpanderRef.current = true;

        TableUtils.warnIfExpanderMissing();
    });

    const getRowClassName = (virtualRow: VirtualizerRow | undefined) =>
        virtualRow ? [TableStyles.tableRow, TableStyles.tableWindowedRow].join(" ") : TableStyles.tableRow;

    const getRowStyle = (virtualRow: VirtualizerRow | undefined) =>
        virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined;

    const renderCell = (column: TableColumn<T>, row: T, columnIndex: number, rowIndex: number) => {
        const cell = { row: rowIndex + 1, col: columnIndex };
        const renderProps = getCellRenderProps(columnIndex, rowIndex);

        const cellContext: TableCellContextType = {
            getRenderProps: () => renderProps,
            toggle: () => {
                focusCell(cell);
                toggleExpanded(rowIndex);
            },
            registerExpander: () => {
                hasExpanderRef.current = true;
            },
        };

        return (
            <div
                key={columnIndex}
                id={getCellId(cell)}
                className={getPinClassName(columnIndex)}
                style={getPinStyle(columnIndex)}
                role="gridcell"
                aria-colindex={columnIndex + TableConst.FIRST_ARIA_INDEX}
                aria-disabled={isDisabled || undefined}
                tabIndex={getIsRoving(cell) ? 0 : -1}
                onClick={(e) => handleCellClick(e, cell)}
            >
                <TableCellContextProvider value={cellContext}>
                    {column.renderCell(row, renderProps)}
                </TableCellContextProvider>
            </div>
        );
    };

    const renderRow = (row: T, rowIndex: number, virtualRow?: VirtualizerRow) => {
        const isRowExpandable = getIsRowExpandable(row);

        if (isRowExpandable) hasExpandableRow = true;

        return (
            <div
                key={`row-${rowIndex}`}
                className={getRowClassName(virtualRow)}
                role="row"
                aria-rowindex={getWalkRow(rowIndex) + TableConst.FIRST_ARIA_INDEX}
                aria-level={isExpandable ? TableConst.ROW_LEVEL : undefined}
                aria-expanded={isRowExpandable ? expandedRowSet.has(rowIndex) : undefined}
                aria-selected={selectionMode === "none" ? undefined : selectedRows.has(row)}
                aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
                style={getRowStyle(virtualRow)}
                ref={virtualRow ? rowWindow.measureRow(virtualRow.index) : undefined}
                onPointerEnter={() => setHoveredRow(rowIndex)}
                onPointerLeave={() => setHoveredRow(undefined)}
            >
                {columns.map((column, columnIndex) => renderCell(column, row, columnIndex, rowIndex))}
            </div>
        );
    };

    const handleDetailClick = (e: MouseEvent<HTMLDivElement>, layoutRow: number) => {
        if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget)) return;

        focusAt({ cell: { row: layoutRow + 1, col: rovingCell.col }, isDetail: true });
    };

    const renderDetailRow = (row: T, layoutRow: number, virtualRow?: VirtualizerRow) => (
        <div
            key={`detail-${layoutRow}`}
            className={getRowClassName(virtualRow)}
            role="row"
            aria-rowindex={getWalkRow(layoutRow) + 1 + TableConst.FIRST_ARIA_INDEX}
            aria-level={TableConst.DETAIL_LEVEL}
            style={getRowStyle(virtualRow)}
            ref={virtualRow ? rowWindow.measureRow(virtualRow.index) : undefined}
        >
            <div
                {...{ [TableUtils.DETAIL_ATTRIBUTE]: "true" }}
                id={getDetailId(layoutRow)}
                className={TableStyles.tableDetailCell}
                role="gridcell"
                aria-colindex={TableConst.FIRST_ARIA_INDEX}
                aria-colspan={columns.length}
                aria-disabled={isDisabled || undefined}
                tabIndex={getIsDetailRoving(layoutRow) ? 0 : -1}
                onClick={(e) => handleDetailClick(e, layoutRow)}
            >
                {props.renderDetail?.(row, getDetailRenderProps(layoutRow))}
            </div>
        </div>
    );

    const renderRows = () =>
        rows.flatMap((row, rowIndex) =>
            expandedRowSet.has(rowIndex)
                ? [renderRow(row, rowIndex), renderDetailRow(row, rowIndex)]
                : [renderRow(row, rowIndex)],
        );

    const renderWindowedRows = () =>
        rowWindow.rows.map((virtualRow) => {
            const entry = TableUtils.getEntry(virtualRow.index, expandedRows);

            return entry.kind === "detail"
                ? renderDetailRow(rows[entry.layoutRow], entry.layoutRow, virtualRow)
                : renderRow(rows[entry.layoutRow], entry.layoutRow, virtualRow);
        });

    const rootStyle = assignInlineVars({
        [TableStyles.tableTemplateVar]: TableUtils.getColumnTemplate(columns, widths),
        [TableStyles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
        [TableStyles.tableMinWidthVar]: `${TableUtils.computeMinTableWidth(columns, widths)}px`,
    }) as CSSProperties;

    return (
        <div
            className={TableStyles.tableRoot}
            role={isExpandable ? "treegrid" : "grid"}
            aria-label={props.ariaLabel}
            aria-rowcount={grid.rowCount}
            aria-colcount={grid.colCount}
            aria-multiselectable={selectionMode === "multiple" || undefined}
            aria-disabled={isDisabled || undefined}
            style={rootStyle}
            onKeyDown={handleKeyDown}
        >
            <div ref={headerRef} className={TableStyles.tableHeader} role="rowgroup">
                <div className={TableStyles.tableRow} role="row" aria-rowindex={TableConst.FIRST_ARIA_INDEX}>
                    {columns.map((column, columnIndex) => {
                        const cell = { row: TableConst.HEADER_ROW_INDEX, col: columnIndex };
                        const renderProps = getColumnRenderProps(columnIndex);

                        return (
                            <TableHeaderCell<T>
                                key={columnIndex}
                                column={column}
                                cellId={getCellId(cell)}
                                className={getPinClassName(columnIndex)}
                                style={getPinStyle(columnIndex)}
                                columnIndex={columnIndex}
                                isLast={columnIndex === columns.length - 1}
                                isRoving={getIsRoving(cell)}
                                isDisabled={isDisabled}
                                isReorderable={getIsReorderable(column)}
                                hintId={props.order !== undefined ? hintId : undefined}
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

            {props.order !== undefined && (
                <div id={hintId} className={TableStyles.tableHint}>
                    {props.announcements.restingKeyHint}
                </div>
            )}

            <div
                ref={bodyRef}
                className={TableStyles.tableBody}
                role="rowgroup"
                style={{ height: isWindowed ? `${rowWindow.totalSize}px` : undefined }}
            >
                {isWindowed ? renderWindowedRows() : renderRows()}
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

export const TableRowExpander = (props: TableRowExpanderProps) => {
    const context = useTableCellContext("TableRowExpander");

    context?.registerExpander();

    if (!context?.getRenderProps().isExpandable) return null;

    return (
        <button
            type="button"
            className={TableStyles.tableRowExpander}
            tabIndex={-1}
            aria-hidden="true"
            onClick={(e) => {
                e.stopPropagation();

                context.toggle();
            }}
        >
            {props.renderContent(context.getRenderProps())}
        </button>
    );
};
