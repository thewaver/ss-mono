import {
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    onMounted,
    onUpdated,
    shallowRef,
    useId,
} from "vue";

import type {
    CarrierZone,
    CarryPlace,
    SelectionGesture,
    TableCellRenderProps,
    TableColumnPin,
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

import { CarrierVueUtils } from "../../Abstracts/Carrier/CarrierVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { SelectionVueUtils } from "../../Abstracts/Selection/SelectionVue.utils";
import { VirtualizerVueUtils } from "../../Abstracts/Virtualizer/VirtualizerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import {
    provideTableCellContext,
    provideTableHeaderContext,
    useTableCellContext,
    useTableHeaderContext,
} from "./Table.context";
import type {
    TableColumn,
    TableHeaderReorderSlots,
    TableHeaderSortSlots,
    TableProps,
    TableRowExpanderSlots,
    TableSlots,
} from "./Table.types";

const getPinClass = (pin: TableColumnPin | undefined) => ({
    [TableStyles.tablePinnedStart]: pin === "start",
    [TableStyles.tablePinnedEnd]: pin === "end",
});

const getPinStyle = (offset: number | undefined) =>
    offset === undefined ? undefined : assignInlineVars({ [TableStyles.tablePinOffsetVar]: `${offset}px` });

type TableHeaderCellProps<T> = {
    column: TableColumn<T>;
    cellId: string;
    columnIndex: number;
    isLast: boolean;
    isRoving: boolean;
    isDisabled: boolean;
    isReorderable: boolean;
    hintId: string | undefined;
    pinOffset: number | undefined;
    landingCol: number | undefined;
    columnCount: number;
    renderProps: TableColumnRenderProps;
    context: Omit<TableHeaderContextType, "registerSort" | "registerReorder">;
    renderResizer: () => VNodeChild;
    renderMarker: (() => VNodeChild) | undefined;
    onPointerDown: (e: PointerEvent) => void;
    onClick: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
};

const TableHeaderCell = defineComponent(
    <T,>(props: TableHeaderCellProps<T>) => {
        let hasSortControl = false;
        let hasReorderGrip = false;

        watchAfterRender([], () => {
            TableUtils.warnIfHeaderControlsMissing(props.column, {
                isReorderable: props.isReorderable,
                hasSortControl,
                hasReorderGrip,
            });
        });

        provideTableHeaderContext({
            getRenderProps: () => props.context.getRenderProps(),
            sort: () => props.context.sort(),
            pickUp: () => props.context.pickUp(),
            registerSort: () => {
                hasSortControl = true;
            },
            registerReorder: () => {
                hasReorderGrip = true;
            },
        });

        const renderMarker = (columnIndex: number) =>
            props.landingCol === columnIndex ? (
                <div
                    class={
                        columnIndex < props.columnCount ? TableStyles.tableMarkerBefore : TableStyles.tableMarkerAfter
                    }
                >
                    {props.renderMarker?.()}
                </div>
            ) : null;

        return () => (
            <div
                id={props.cellId}
                class={[TableStyles.tableCell, getPinClass(props.renderProps.pin)]}
                style={getPinStyle(props.pinOffset)}
                role="columnheader"
                aria-colindex={props.columnIndex + TableConst.FIRST_ARIA_INDEX}
                aria-sort={TableUtils.computeAriaSort(props.column, props.renderProps.sortDirection)}
                aria-disabled={props.isDisabled || undefined}
                aria-describedby={props.isReorderable ? props.hintId : undefined}
                tabindex={props.isRoving ? 0 : -1}
                onPointerdown={props.onPointerDown}
                onClick={props.onClick}
                onPointerenter={props.onPointerEnter}
                onPointerleave={props.onPointerLeave}
            >
                {props.column.renderHeader(props.renderProps)}

                {props.renderProps.isResizable && props.renderResizer()}

                {renderMarker(props.columnIndex)}

                {props.isLast && renderMarker(props.columnCount)}
            </div>
        );
    },
    {
        name: "TableHeaderCell",
        props: declareProps<TableHeaderCellProps<unknown>>({
            column: null,
            cellId: null,
            columnIndex: null,
            isLast: Boolean,
            isRoving: Boolean,
            isDisabled: Boolean,
            isReorderable: Boolean,
            hintId: null,
            pinOffset: null,
            landingCol: null,
            columnCount: null,
            renderProps: null,
            context: null,
            renderResizer: null,
            renderMarker: null,
            onPointerDown: null,
            onClick: null,
            onPointerEnter: null,
            onPointerLeave: null,
        }),
    },
);

type TableBodyCellProps = {
    cellId: string;
    columnIndex: number;
    isRoving: boolean;
    isDisabled: boolean;
    pinOffset: number | undefined;
    renderProps: TableCellRenderProps;
    renderContent: () => VNodeChild;
    onClick: (e: MouseEvent) => void;
    onToggle: () => void;
    onRegisterExpander: () => void;
};

const TableBodyCell = defineComponent(
    (props: TableBodyCellProps) => {
        provideTableCellContext({
            getRenderProps: () => props.renderProps,
            toggle: () => props.onToggle(),
            registerExpander: () => props.onRegisterExpander(),
        });

        return () => (
            <div
                id={props.cellId}
                class={[TableStyles.tableCell, getPinClass(props.renderProps.pin)]}
                style={getPinStyle(props.pinOffset)}
                role="gridcell"
                aria-colindex={props.columnIndex + TableConst.FIRST_ARIA_INDEX}
                aria-disabled={props.isDisabled || undefined}
                tabindex={props.isRoving ? 0 : -1}
                onClick={props.onClick}
            >
                {props.renderContent()}
            </div>
        );
    },
    {
        name: "TableBodyCell",
        props: declareProps<TableBodyCellProps>({
            cellId: null,
            columnIndex: null,
            isRoving: Boolean,
            isDisabled: Boolean,
            pinOffset: null,
            renderProps: null,
            renderContent: null,
            onClick: null,
            onToggle: null,
            onRegisterExpander: null,
        }),
    },
);

export const Table = defineComponent(
    <T,>(props: TableProps<T>, { slots }: SlotsContext<TableSlots<T>>) => {
        const tableId = useId();
        const hintId = useId();

        const headerRef = shallowRef<HTMLDivElement>();
        const bodyRef = shallowRef<HTMLDivElement>();

        let pendingFocusId: string | undefined;

        let resizeStart = { x: 0, width: 0, hasDragged: false };
        let hasCarriedClick = false;

        const focus = shallowRef<TableFocus>({ cell: { row: TableConst.HEADER_ROW_INDEX, col: 0 }, isDetail: false });
        const hoveredRow = shallowRef<number>();
        const hoveredColumn = shallowRef<number>();
        const resizingColumnId = shallowRef(TableConst.NO_RESIZING);

        const storedSort = useTwoWay(props, "sort", undefined, { keepsOwnValue: false });
        const storedWidths = useTwoWay(props, "widths", undefined, { keepsOwnValue: false });
        const storedOrder = useTwoWay(props, "order", undefined, { keepsOwnValue: false });
        const storedSelection = useTwoWay(props, "selection", undefined, { keepsOwnValue: false });
        const storedExpanded = useTwoWay(props, "expanded", []);

        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const direction = NavigatorVueUtils.useDirection(headerRef);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsVirtualized = () => props.computeEstimatedRowHeight !== undefined;
        const getResizeStepPx = () => props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx;
        const getIsOrdered = () => props.order !== undefined;

        const widths = computed(() => storedWidths.value ?? TableConst.EMPTY_WIDTHS);
        const selected = computed<T[]>(() => storedSelection.value ?? TableConst.EMPTY_SELECTION);

        const selectionMode = computed(() =>
            TableUtils.getSelectionMode(props.selectionMode, props.selection !== undefined),
        );

        const columnOrder = computed(() =>
            TableUtils.getPinnedOrder(
                props.columns,
                TableUtils.getColumnOrder(props.columns, storedOrder.value ?? TableConst.EMPTY_ORDER),
            ),
        );

        const columns = computed(() => TableUtils.getReordered(props.columns, columnOrder.value));

        const pinOffsets = computed(() => TableUtils.computePinOffsets(columns.value, widths.value));

        const sortedColumn = computed(() => {
            const sort = storedSort.value;

            return sort === undefined ? undefined : columns.value.find((column) => column.id === sort.columnId);
        });

        const rowOrder = computed(() => TableUtils.getSortedOrder(props.rows, sortedColumn.value, storedSort.value));

        const rows = computed(() => TableUtils.getReordered(props.rows, rowOrder.value));

        const selectedRows = computed(() => new Set(selected.value));

        const getIsExpandable = () => slots.renderDetail !== undefined;

        const getIsRowExpandable = (row: T | undefined) =>
            row !== undefined && getIsExpandable() && (props.computeIsExpandable?.(row) ?? true);

        const expandedRows = computed(() =>
            getIsExpandable()
                ? TableUtils.getExpandedRows(rows.value, storedExpanded.value, props.computeIsExpandable)
                : TableConst.EMPTY_EXPANDED_ROWS,
        );

        const expandedRowSet = computed(() => new Set(expandedRows.value));

        const getWalkRow = (layoutRow: number) => TableUtils.getEntryIndex(layoutRow, expandedRows.value) + 1;

        const entryCount = computed(() => TableUtils.getEntryCount(rows.value.length, expandedRows.value));

        const grid = computed(() => ({ rowCount: entryCount.value + 1, colCount: columns.value.length }));

        const rovingCell = computed(() =>
            TableUtils.clampCell(TableUtils.computeWalkCell(focus.value, expandedRows.value), grid.value),
        );

        const rovingFocus = computed(() => TableUtils.computeFocus(rovingCell.value, expandedRows.value));

        const rovingRow = computed(() => rovingCell.value.row);

        const getDataCol = (layoutCol: number) => columnOrder.value?.[layoutCol] ?? layoutCol;
        const getDataRow = (layoutRow: number) => rowOrder.value?.[layoutRow] ?? layoutRow;

        const pinnedRows = computed(() =>
            rovingRow.value === TableConst.HEADER_ROW_INDEX ? TableConst.EMPTY_PINNED_ROWS : [rovingRow.value - 1],
        );

        const rowWindow = VirtualizerVueUtils.useRowWindow(bodyRef, entryCount, {
            isDisabled: () => !getIsVirtualized(),
            computeEstimatedSize: (index) =>
                props.computeEstimatedRowHeight?.(TableUtils.getEntry(index, expandedRows.value).layoutRow) ?? 0,
            pinnedRows,
        });

        const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

        const getDetailId = (layoutRow: number) => TableUtils.getDetailId(tableId, layoutRow);

        const getIsRoving = (cell: Index2d) => {
            const roving = rovingFocus.value;

            return !roving.isDetail && roving.cell.row === cell.row && roving.cell.col === cell.col;
        };

        const getIsDetailRoving = (layoutRow: number) => {
            const roving = rovingFocus.value;

            return roving.isDetail && roving.cell.row === layoutRow + 1;
        };

        const focusAt = (next: TableFocus) => {
            focus.value = next;

            const walkCell = TableUtils.computeWalkCell(next, expandedRows.value);

            if (walkCell.row > TableConst.HEADER_ROW_INDEX && rowWindow.isLive.value) {
                rowWindow.scrollToRow(walkCell.row - 1);
            }

            const id = next.isDetail ? getDetailId(next.cell.row - 1) : getCellId(next.cell);
            const element = document.getElementById(id);

            if (element) {
                element.focus();

                return;
            }

            pendingFocusId = id;
        };

        const focusPending = () => {
            const element = pendingFocusId === undefined ? undefined : document.getElementById(pendingFocusId);

            if (!element) return;

            pendingFocusId = undefined;
            element.focus();
        };

        const focusCell = (cell: Index2d) => focusAt({ cell, isDetail: false });

        let hasExpander = false;
        let hasWarnedExpander = false;
        let hasRenderedExpandableRow = false;

        const warnIfExpanderMissing = () => {
            if (hasExpander || hasWarnedExpander || !hasRenderedExpandableRow) return;

            hasWarnedExpander = true;

            TableUtils.warnIfExpanderMissing();
        };

        onMounted(() => {
            focusPending();
            warnIfExpanderMissing();
        });

        onUpdated(() => {
            focusPending();
            warnIfExpanderMissing();
        });

        const toggleExpanded = (layoutRow: number) => {
            const row = rows.value[layoutRow];

            if (getIsDisabled() || !getIsRowExpandable(row)) return;

            const next = TableUtils.getToggledExpanded(storedExpanded.value, row);

            storedExpanded.value = next;
            props.onExpandedChange?.(next);
        };

        watchAfterRender([focus, expandedRowSet], ([current, openRows]) => {
            if (!current.isDetail || openRows.has(current.cell.row - 1)) return;

            focus.value = { cell: current.cell, isDetail: false };

            if (document.activeElement === document.body) document.getElementById(getCellId(current.cell))?.focus();
        });

        const toggleSort = (column: TableColumn<T> | undefined) => {
            if (!column || column.isSortable !== true || getIsDisabled()) return;

            const next = TableUtils.getNextSort(storedSort.value, column.id);

            storedSort.value = next;
            props.onSortChange?.(next);
        };

        const selection = SelectionVueUtils.useSelection(getIsDisabled, {
            mode: selectionMode,
            items: rows,
            selection: computed({
                get: () => selected.value,
                set: (next) => {
                    storedSelection.value = next;
                    props.onSelectionChange?.(next);
                },
            }),
        });

        const selectRow = (rowIndex: number, gesture?: SelectionGesture) => {
            const row = rows.value[rowIndex];

            if (row !== undefined) selection.pick(row, gesture);
        };

        const getCurrentWidth = (column: TableColumn<T>, columnIndex: number) =>
            TableUtils.getColumnWidth(column, widths.value) ??
            document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
            0;

        const getIsResizable = (column: TableColumn<T>) => (column.isResizable ?? false) && props.widths !== undefined;

        const resizeColumn = (column: TableColumn<T>, width: number) => {
            if (!getIsResizable(column) || getIsDisabled()) return;

            storedWidths.value = { ...widths.value, [column.id]: TableUtils.getResizedWidth(column, width) };
        };

        const handleResizerPointerDown = (e: PointerEvent, column: TableColumn<T>, columnIndex: number) => {
            if (e.button !== 0 || getIsDisabled()) return;

            e.preventDefault();
            e.stopPropagation();

            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

            resizeStart = { x: e.clientX, width: getCurrentWidth(column, columnIndex), hasDragged: false };

            resizingColumnId.value = column.id;
        };

        const handleResizerPointerMove = (e: PointerEvent, column: TableColumn<T>) => {
            if (resizingColumnId.value !== column.id) return;

            if (e.clientX !== resizeStart.x) resizeStart.hasDragged = true;

            resizeColumn(
                column,
                TableUtils.computeDraggedWidth(resizeStart.width, e.clientX - resizeStart.x, direction.value),
            );
        };

        const handleResizerPointerUp = (e: PointerEvent, column: TableColumn<T>, columnIndex: number) => {
            if (resizingColumnId.value !== column.id) return;

            const resizer = e.currentTarget as HTMLElement;

            resizer.releasePointerCapture(e.pointerId);

            resizingColumnId.value = TableConst.NO_RESIZING;

            if (resizeStart.hasDragged) return;

            resizeColumn(
                column,
                TableUtils.computePressedWidth({
                    clientX: e.clientX,
                    rect: resizer.getBoundingClientRect(),
                    width: getCurrentWidth(column, columnIndex),
                    step: getResizeStepPx(),
                    direction: direction.value,
                }),
            );
        };

        const getIsReorderable = (column: TableColumn<T> | undefined) =>
            column !== undefined && (column.isReorderable ?? false) && getIsOrdered();

        const moveColumn = (fromIndex: number, toIndex: number) => {
            if (!getIsReorderable(columns.value[fromIndex]) || getIsDisabled()) return false;
            if (toIndex < 0 || toIndex >= columns.value.length) return false;
            if (TableUtils.clampToPinGroup(columns.value, fromIndex, toIndex) !== toIndex) return false;

            const next = ObjectUtils.moveArrayElement(
                columns.value.map((column) => column.id),
                fromIndex,
                toIndex,
            );

            storedOrder.value = next;
            props.onOrderChange?.(next);

            return true;
        };

        const getHeaderRects = () =>
            columns.value.reduce<DOMRect[]>((acc, _unused, columnIndex) => {
                const element = document.getElementById(
                    getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }),
                );

                if (element) acc.push(element.getBoundingClientRect());

                return acc;
            }, []);

        const carryState = CarrierVueUtils.useCarry();

        const getSourceColumnIndex = () => {
            const state = CarrierUtils.carry.get();

            return state && state.from === zone ? (state.fromPlace as number) : undefined;
        };

        const zone: CarrierZone = CarrierVueUtils.useZone({
            getGroupId: () => tableId,
            getLabel: () => props.ariaLabel,
            getRootRef: () => headerRef.value,
            getIsDisabled: () => getIsDisabled() || !getIsOrdered(),
            getKeyHint: () => props.announcements!.keyHint,
            getAnnouncements: () => props.announcements!,
            computeCanAccept: () => !getIsDisabled() && getIsOrdered(),
            computePlaceAtPoint: (point) => {
                const source = getSourceColumnIndex() ?? 0;

                return TableUtils.clampToPinGroup(
                    columns.value,
                    source,
                    TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, source, direction.value),
                );
            },
            computeNudgedPlace: (place, nudge) => {
                const nudged = TableUtils.computeColumnNudgedPlace(place, nudge, columns.value.length);

                return nudged === undefined
                    ? undefined
                    : TableUtils.clampToPinGroup(columns.value, getSourceColumnIndex() ?? 0, nudged);
            },
            computeEntryPlace: () => getSourceColumnIndex() ?? 0,
            computeIsSamePlace: (a, b) => a === b,
            computeIsPlaceAllowed: () => true,
            computePlaceLabel: (place) => props.announcements!.computePlaceLabel(place as number, columns.value.length),
            takeAt: () => undefined,
            putAt: () => undefined,
            moveAt: (fromPlace: CarryPlace, toPlace: CarryPlace) => moveColumn(fromPlace as number, toPlace as number),
        });

        const isSource = computed(() => carryState.value?.from === zone);

        watchAfterRender([isSource], ([isCarrying]) => (isCarrying ? TableUtils.observeCarryCancel(zone) : undefined));

        const carriedColumnId = computed(() =>
            carryState.value?.from === zone ? carryState.value.carry.key : undefined,
        );

        const landingCol = computed(() => {
            const state = carryState.value;

            if (state?.to !== zone || state.toPlace === undefined) return undefined;

            const sourceColumnIndex = state.from === zone ? (state.fromPlace as number) : undefined;

            return TableUtils.computeLandingCol(state.toPlace, sourceColumnIndex ?? 0);
        });

        const startCarry = (columnIndex: number, mode: "drag" | "tap") => {
            const column = columns.value[columnIndex];

            CarrierUtils.start(
                zone,
                columnIndex,
                { groupId: tableId, key: column.id, label: column.header, value: column.id },
                mode,
            );
        };

        const handleHeaderPointerDown = (e: PointerEvent, columnIndex: number) => {
            const column = columns.value[columnIndex];

            if (e.button !== 0 || getIsDisabled() || !getIsReorderable(column)) return;
            if ((e.target as HTMLElement).closest(CarrierUtils.INTERACTIVE_SELECTOR)) return;
            if (CarrierUtils.getCarry()) return;

            CarrierUtils.dragFromPointer(
                e.currentTarget as HTMLElement,
                e,
                () => startCarry(columnIndex, "drag"),
                () => {
                    hasCarriedClick = true;
                },
            );
        };

        const handleGripClick = (columnIndex: number) => {
            if (!CarrierUtils.getCarry()) {
                if (!getIsReorderable(columns.value[columnIndex])) return;

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

        const handleKeyDown = (e: KeyboardEvent) => {
            if (TableUtils.getIsInsideDetail(e.target, e.currentTarget as HTMLElement)) return;

            const from = rovingCell.value;
            const column = columns.value[from.col];
            const command = TableUtils.computeKeyCommand(e, from, grid.value, {
                direction: direction.value,
                pageRows: props.pageRows ?? TABLE_DEFAULTS.pageRows,
                expandedRows: expandedRows.value,
                computeIsExpandable: getIsExpandable()
                    ? (layoutRow) => getIsRowExpandable(rows.value[layoutRow])
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
                resizeColumn(column, getCurrentWidth(column, from.col) + command.step * getResizeStepPx());

                return;
            }

            if (command.kind === "move_column") {
                if (!moveColumn(from.col, command.to)) return;

                focusCell({ row: TableConst.HEADER_ROW_INDEX, col: command.to });

                LiveAnnouncerUtils.announce(
                    props.announcements!.computeColumnMoved(column.header, command.to, grid.value.colCount),
                );

                return;
            }

            if (command.kind === "toggle_row") {
                toggleExpanded(command.rowIndex);

                return;
            }

            if (command.kind === "activate_row") {
                if (!getIsDisabled()) props.onRowActivate?.(rows.value[command.rowIndex], command.rowIndex);

                return;
            }

            if (command.kind === "pick_row") {
                selectRow(command.rowIndex, command.gesture);

                return;
            }

            const next = TableUtils.computeFocus(command.cell, expandedRows.value);

            focusAt(next);

            if (command.isExtending) selectRow(next.cell.row - 1, { isExtending: true });
        };

        const handleCellClick = (e: MouseEvent, cell: Index2d) => {
            if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget as HTMLElement)) return;

            focusCell(cell);

            if (getIsDisabled()) return;

            selectRow(cell.row - 1, { isToggling: e.ctrlKey || e.metaKey, isExtending: e.shiftKey });
        };

        const getColumnRenderProps = (layoutCol: number): TableColumnRenderProps => {
            const column = columns.value[layoutCol];

            return TableUtils.computeColumnRenderProps({
                column,
                dataCol: getDataCol(layoutCol),
                layoutCol,
                sort: storedSort.value,
                roving: rovingCell.value,
                isReorderable: getIsReorderable(column),
                isResizable: getIsResizable(column),
                resizingColumnId: resizingColumnId.value,
                carriedColumnId: carriedColumnId.value,
                hoveredColumn: hoveredColumn.value,
                isDisabled: getIsDisabled(),
            });
        };

        const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps => {
            const roving = rovingFocus.value;

            return TableUtils.computeCellRenderProps({
                columnId: columns.value[layoutCol].id,
                dataCol: getDataCol(layoutCol),
                layoutCol,
                dataRow: getDataRow(layoutRow),
                layoutRow,
                isSelected: selectedRows.value.has(rows.value[layoutRow]),
                roving: roving.isDetail ? TableConst.NO_CELL : roving.cell,
                hoveredRow: hoveredRow.value,
                isDisabled: getIsDisabled(),
                pin: columns.value[layoutCol].pin,
                isExpandable: getIsRowExpandable(rows.value[layoutRow]),
                isExpanded: expandedRowSet.value.has(layoutRow),
            });
        };

        const getDetailRenderProps = (layoutRow: number): TableDetailRenderProps => ({
            dataRow: getDataRow(layoutRow),
            layoutRow,
            isSelected: selectedRows.value.has(rows.value[layoutRow]),
            isFocused: getIsDetailRoving(layoutRow),
            isDisabled: getIsDisabled(),
        });

        const renderResizer = (column: TableColumn<T>, columnIndex: number, renderProps: TableColumnRenderProps) => (
            <div
                class={TableStyles.tableResizer}
                aria-hidden="true"
                onPointerdown={(e) => handleResizerPointerDown(e, column, columnIndex)}
                onPointermove={(e) => handleResizerPointerMove(e, column)}
                onPointerup={(e) => handleResizerPointerUp(e, column, columnIndex)}
                onPointercancel={() => {
                    if (resizingColumnId.value === column.id) resizingColumnId.value = TableConst.NO_RESIZING;
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {callSlot(slots.renderResizer, renderProps)}
            </div>
        );

        const getRowClass = (virtualRow: VirtualizerRow | undefined) =>
            virtualRow ? [TableStyles.tableRow, TableStyles.tableWindowedRow] : TableStyles.tableRow;

        const getRowStyle = (virtualRow: VirtualizerRow | undefined) =>
            virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined;

        const renderRow = (row: T, rowIndex: number, virtualRow?: VirtualizerRow) => {
            const isRowExpandable = getIsRowExpandable(row);

            if (isRowExpandable) hasRenderedExpandableRow = true;

            return (
                <div
                    key={`row-${rowIndex}`}
                    class={getRowClass(virtualRow)}
                    role="row"
                    aria-rowindex={getWalkRow(rowIndex) + TableConst.FIRST_ARIA_INDEX}
                    aria-level={getIsExpandable() ? TableConst.ROW_LEVEL : undefined}
                    aria-expanded={isRowExpandable ? expandedRowSet.value.has(rowIndex) : undefined}
                    aria-selected={selectionMode.value === "none" ? undefined : selectedRows.value.has(row)}
                    aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
                    style={getRowStyle(virtualRow)}
                    ref={virtualRow ? rowWindow.measureRow(virtualRow.index) : undefined}
                    onPointerenter={() => {
                        hoveredRow.value = rowIndex;
                    }}
                    onPointerleave={() => {
                        hoveredRow.value = undefined;
                    }}
                >
                    {columns.value.map((column, columnIndex) => {
                        const cell = { row: rowIndex + 1, col: columnIndex };
                        const renderProps = getCellRenderProps(columnIndex, rowIndex);

                        return (
                            <TableBodyCell
                                key={columnIndex}
                                cellId={getCellId(cell)}
                                columnIndex={columnIndex}
                                isRoving={getIsRoving(cell)}
                                isDisabled={getIsDisabled()}
                                pinOffset={pinOffsets.value[columnIndex]}
                                renderProps={renderProps}
                                renderContent={() => column.renderCell({ row, renderProps })}
                                onClick={(e) => handleCellClick(e, cell)}
                                onToggle={() => {
                                    focusCell(cell);
                                    toggleExpanded(rowIndex);
                                }}
                                onRegisterExpander={() => {
                                    hasExpander = true;
                                }}
                            />
                        );
                    })}
                </div>
            );
        };

        const handleDetailClick = (e: MouseEvent, layoutRow: number) => {
            if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget as HTMLElement)) return;

            focusAt({ cell: { row: layoutRow + 1, col: rovingCell.value.col }, isDetail: true });
        };

        const renderDetailRow = (row: T, layoutRow: number, virtualRow?: VirtualizerRow) => (
            <div
                key={`detail-${layoutRow}`}
                class={getRowClass(virtualRow)}
                role="row"
                aria-rowindex={getWalkRow(layoutRow) + 1 + TableConst.FIRST_ARIA_INDEX}
                aria-level={TableConst.DETAIL_LEVEL}
                style={getRowStyle(virtualRow)}
                ref={virtualRow ? rowWindow.measureRow(virtualRow.index) : undefined}
            >
                <div
                    {...{ [TableUtils.DETAIL_ATTRIBUTE]: "true" }}
                    id={getDetailId(layoutRow)}
                    class={TableStyles.tableDetailCell}
                    role="gridcell"
                    aria-colindex={TableConst.FIRST_ARIA_INDEX}
                    aria-colspan={columns.value.length}
                    aria-disabled={getIsDisabled() || undefined}
                    tabindex={getIsDetailRoving(layoutRow) ? 0 : -1}
                    onClick={(e) => handleDetailClick(e, layoutRow)}
                >
                    {callSlot(slots.renderDetail, { row, renderProps: getDetailRenderProps(layoutRow) })}
                </div>
            </div>
        );

        const renderEntries = (row: T, rowIndex: number) =>
            expandedRowSet.value.has(rowIndex)
                ? [renderRow(row, rowIndex), renderDetailRow(row, rowIndex)]
                : [renderRow(row, rowIndex)];

        const renderWindowedEntry = (virtualRow: VirtualizerRow) => {
            const entry = TableUtils.getEntry(virtualRow.index, expandedRows.value);
            const row = rows.value[entry.layoutRow];

            return entry.kind === "detail"
                ? renderDetailRow(row, entry.layoutRow, virtualRow)
                : renderRow(row, entry.layoutRow, virtualRow);
        };

        const renderHeaderCell = (column: TableColumn<T>, columnIndex: number) => {
            const cell = { row: TableConst.HEADER_ROW_INDEX, col: columnIndex };
            const renderProps = getColumnRenderProps(columnIndex);
            const columnCount = columns.value.length;

            return (
                <TableHeaderCell
                    key={columnIndex}
                    column={column}
                    cellId={getCellId(cell)}
                    columnIndex={columnIndex}
                    isLast={columnIndex === columnCount - 1}
                    isRoving={getIsRoving(cell)}
                    isDisabled={getIsDisabled()}
                    isReorderable={getIsReorderable(column)}
                    hintId={getIsOrdered() ? hintId : undefined}
                    pinOffset={pinOffsets.value[columnIndex]}
                    landingCol={landingCol.value}
                    columnCount={columnCount}
                    renderProps={renderProps}
                    context={{
                        getRenderProps: () => renderProps,
                        sort: () => {
                            focusCell(cell);

                            if (getIsDisabled()) return;

                            toggleSort(column);
                        },
                        pickUp: () => {
                            focusCell(cell);

                            if (getIsDisabled()) return;

                            handleGripClick(columnIndex);
                        },
                    }}
                    renderResizer={() => renderResizer(column, columnIndex, renderProps)}
                    renderMarker={slots.renderMarker && (() => callSlot(slots.renderMarker, undefined))}
                    onPointerDown={(e) => handleHeaderPointerDown(e, columnIndex)}
                    onClick={() => {
                        if (hasCarriedClick) {
                            hasCarriedClick = false;

                            return;
                        }

                        focusCell(cell);
                    }}
                    onPointerEnter={() => {
                        hoveredColumn.value = columnIndex;
                    }}
                    onPointerLeave={() => {
                        hoveredColumn.value = undefined;
                    }}
                />
            );
        };

        return () => {
            hasRenderedExpandableRow = false;

            const isDisabled = getIsDisabled();
            const isWindowed = getIsVirtualized() && !rowWindow.hasNoScroller.value;

            const rootStyle = assignInlineVars({
                [TableStyles.tableTemplateVar]: TableUtils.getColumnTemplate(columns.value, widths.value),
                [TableStyles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
                [TableStyles.tableMinWidthVar]: `${TableUtils.computeMinTableWidth(columns.value, widths.value)}px`,
            });

            return (
                <div
                    class={TableStyles.tableRoot}
                    role={getIsExpandable() ? "treegrid" : "grid"}
                    aria-label={props.ariaLabel}
                    aria-rowcount={grid.value.rowCount}
                    aria-colcount={grid.value.colCount}
                    aria-multiselectable={selectionMode.value === "multiple" || undefined}
                    aria-disabled={isDisabled || undefined}
                    style={rootStyle}
                    onKeydown={handleKeyDown}
                >
                    <div ref={headerRef} class={TableStyles.tableHeader} role="rowgroup">
                        <div class={TableStyles.tableRow} role="row" aria-rowindex={TableConst.FIRST_ARIA_INDEX}>
                            {columns.value.map(renderHeaderCell)}
                        </div>
                    </div>

                    {props.order !== undefined && (
                        <div id={hintId} class={TableStyles.tableHint}>
                            {props.announcements.restingKeyHint}
                        </div>
                    )}

                    <div
                        ref={bodyRef}
                        class={TableStyles.tableBody}
                        role="rowgroup"
                        style={{ height: isWindowed ? `${rowWindow.totalSize.value}px` : undefined }}
                    >
                        {isWindowed ? rowWindow.rows.value.map(renderWindowedEntry) : rows.value.flatMap(renderEntries)}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Table",
        slots: Object as SlotsType<TableSlots<any>>,
        props: declareProps<TableProps<unknown>>({
            "announcements": null,
            "order": null,
            "onUpdate:order": null,
            "ariaLabel": null,
            "selectionMode": null,
            "resizeStepPx": null,
            "pageRows": null,
            "resizerWidthPx": null,
            "isDisabled": Boolean,
            "sort": null,
            "onUpdate:sort": null,
            "widths": null,
            "onUpdate:widths": null,
            "computeEstimatedRowHeight": null,
            "onSortChange": null,
            "onOrderChange": null,
            "columns": null,
            "rows": null,
            "selection": null,
            "onUpdate:selection": null,
            "computeRowAriaLabel": null,
            "onRowActivate": null,
            "onSelectionChange": null,
            "expanded": null,
            "onUpdate:expanded": null,
            "computeIsExpandable": null,
            "onExpandedChange": null,
        }),
    },
);

export const TableHeaderSort = defineComponent(
    (_props: object, { slots }: SlotsContext<TableHeaderSortSlots>) => {
        const context = useTableHeaderContext("TableHeaderSort");

        return () => {
            context?.registerSort();

            if (!context?.getRenderProps().isSortable) return null;

            return (
                <button
                    type="button"
                    class={TableStyles.tableSortControl}
                    tabindex={-1}
                    aria-hidden="true"
                    onPointerdown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();

                        context.sort();
                    }}
                >
                    {callSlot(slots.renderContent, context.getRenderProps())}
                </button>
            );
        };
    },
    { name: "TableHeaderSort", slots: Object as SlotsType<TableHeaderSortSlots> },
);

export const TableHeaderReorder = defineComponent(
    (_props: object, { slots }: SlotsContext<TableHeaderReorderSlots>) => {
        const context = useTableHeaderContext("TableHeaderReorder");

        return () => {
            context?.registerReorder();

            if (!context?.getRenderProps().isReorderable) return null;

            return (
                <button
                    type="button"
                    class={TableStyles.tableReorderGrip}
                    tabindex={-1}
                    aria-hidden="true"
                    onPointerdown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();

                        context.pickUp();
                    }}
                >
                    {callSlot(slots.renderContent, context.getRenderProps())}
                </button>
            );
        };
    },
    { name: "TableHeaderReorder", slots: Object as SlotsType<TableHeaderReorderSlots> },
);

export const TableRowExpander = defineComponent(
    (_props: object, { slots }: SlotsContext<TableRowExpanderSlots>) => {
        const context = useTableCellContext("TableRowExpander");

        return () => {
            context?.registerExpander();

            if (!context?.getRenderProps().isExpandable) return null;

            return (
                <button
                    type="button"
                    class={TableStyles.tableRowExpander}
                    tabindex={-1}
                    aria-hidden="true"
                    onClick={(e) => {
                        e.stopPropagation();

                        context.toggle();
                    }}
                >
                    {callSlot(slots.renderContent, context.getRenderProps())}
                </button>
            );
        };
    },
    { name: "TableRowExpander", slots: Object as SlotsType<TableRowExpanderSlots> },
);
