import { type SlotsType, type VNodeChild, computed, defineComponent, shallowRef, useId } from "vue";

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

import { CarrierVueUtils } from "../../Abstracts/Carrier/CarrierVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { SelectionVueUtils } from "../../Abstracts/Selection/SelectionVue.utils";
import { VirtualizerVueUtils } from "../../Abstracts/Virtualizer/VirtualizerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { provideTableHeaderContext, useTableHeaderContext } from "./Table.context";
import type {
    TableColumn,
    TableHeaderReorderSlots,
    TableHeaderSortSlots,
    TableProps,
    TableSlots,
} from "./Table.types";

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
                class={TableStyles.tableCell}
                role="columnheader"
                aria-colindex={props.columnIndex + FIRST_ARIA_INDEX}
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

export const Table = defineComponent(
    <T,>(props: TableProps<T>, { slots }: SlotsContext<TableSlots>) => {
        const tableId = useId();
        const hintId = useId();

        const headerRef = shallowRef<HTMLDivElement>();
        const bodyRef = shallowRef<HTMLDivElement>();

        let resizeStart = { x: 0, width: 0, hasDragged: false };
        let hasCarriedClick = false;

        const focusedCell = shallowRef<Index2d>({ row: HEADER_ROW_INDEX, col: 0 });
        const hoveredRow = shallowRef<number>();
        const hoveredColumn = shallowRef<number>();
        const resizingColumnId = shallowRef(NO_RESIZING);

        const storedSort = useTwoWay(props, "sort", undefined, { keepsOwnValue: false });
        const storedWidths = useTwoWay(props, "widths", undefined, { keepsOwnValue: false });
        const storedOrder = useTwoWay(props, "order", undefined, { keepsOwnValue: false });
        const storedSelection = useTwoWay(props, "selection", undefined, { keepsOwnValue: false });

        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        const direction = NavigatorVueUtils.useDirection(headerRef);

        const getIsDisabled = () => props.isDisabled ?? false;
        const getIsVirtualized = () => props.computeEstimatedRowHeight !== undefined;
        const getResizeStepPx = () => props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx;
        const getIsOrdered = () => props.order !== undefined;

        const widths = computed(() => storedWidths.value ?? EMPTY_WIDTHS);
        const selected = computed<T[]>(() => storedSelection.value ?? EMPTY_SELECTION);

        const selectionMode = computed(() =>
            TableUtils.getSelectionMode(props.selectionMode, props.selection !== undefined),
        );

        const columnOrder = computed(() => TableUtils.getColumnOrder(props.columns, storedOrder.value ?? EMPTY_ORDER));

        const columns = computed(() => TableUtils.getReordered(props.columns, columnOrder.value));

        const sortedColumn = computed(() => {
            const sort = storedSort.value;

            return sort === undefined ? undefined : columns.value.find((column) => column.id === sort.columnId);
        });

        const rowOrder = computed(() => TableUtils.getSortedOrder(props.rows, sortedColumn.value, storedSort.value));

        const rows = computed(() => TableUtils.getReordered(props.rows, rowOrder.value));

        const selectedRows = computed(() => new Set(selected.value));

        const grid = computed(() => ({ rowCount: rows.value.length + 1, colCount: columns.value.length }));

        const rovingCell = computed(() => TableUtils.clampCell(focusedCell.value, grid.value));

        const rovingRow = computed(() => rovingCell.value.row);

        const getDataCol = (layoutCol: number) => columnOrder.value?.[layoutCol] ?? layoutCol;
        const getDataRow = (layoutRow: number) => rowOrder.value?.[layoutRow] ?? layoutRow;

        const pinnedRows = computed(() =>
            rovingRow.value === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [rovingRow.value - 1],
        );

        const rowWindow = VirtualizerVueUtils.useRowWindow(bodyRef, () => rows.value.length, {
            isDisabled: () => !getIsVirtualized(),
            computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
            pinnedRows,
        });

        const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

        const getIsRoving = (cell: Index2d) => rovingCell.value.row === cell.row && rovingCell.value.col === cell.col;

        const focusCell = (cell: Index2d) => {
            focusedCell.value = cell;

            if (cell.row > HEADER_ROW_INDEX && rowWindow.isLive.value) rowWindow.scrollToRow(cell.row - 1);

            document.getElementById(getCellId(cell))?.focus();
        };

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
            document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
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

            resizingColumnId.value = NO_RESIZING;

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

            const next = CarrierUtils.computeMovedOrder(
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
                const element = document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }));

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
            computePlaceAtPoint: (point) =>
                TableUtils.computeColumnPlaceAtPoint(
                    getHeaderRects(),
                    point,
                    getSourceColumnIndex() ?? 0,
                    direction.value,
                ),
            computeNudgedPlace: (place, nudge) =>
                TableUtils.computeColumnNudgedPlace(place, nudge, columns.value.length),
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

        const handleKeyDown = (e: KeyboardEvent) => {
            const from = rovingCell.value;
            const column = columns.value[from.col];
            const command = TableUtils.computeKeyCommand(e, from, grid.value, {
                direction: direction.value,
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
                resizeColumn(column, getCurrentWidth(column, from.col) + command.step * getResizeStepPx());

                return;
            }

            if (command.kind === "moveColumn") {
                if (!moveColumn(from.col, command.to)) return;

                focusCell({ row: HEADER_ROW_INDEX, col: command.to });

                LiveAnnouncerUtils.announce(
                    props.announcements!.computeColumnMoved(column.header, command.to, grid.value.colCount),
                );

                return;
            }

            if (command.kind === "activateRow") {
                if (!getIsDisabled()) props.onRowActivate?.(rows.value[command.rowIndex], command.rowIndex);

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

        const getCellRenderProps = (layoutCol: number, layoutRow: number): TableCellRenderProps =>
            TableUtils.computeCellRenderProps({
                columnId: columns.value[layoutCol].id,
                dataCol: getDataCol(layoutCol),
                layoutCol,
                dataRow: getDataRow(layoutRow),
                layoutRow,
                isSelected: selectedRows.value.has(rows.value[layoutRow]),
                roving: rovingCell.value,
                hoveredRow: hoveredRow.value,
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
                    if (resizingColumnId.value === column.id) resizingColumnId.value = NO_RESIZING;
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {callSlot(slots.renderResizer, renderProps)}
            </div>
        );

        const renderRow = (row: T, rowIndex: number, virtualRow?: VirtualizerRow) => (
            <div
                key={rowIndex}
                class={virtualRow ? [TableStyles.tableRow, TableStyles.tableWindowedRow] : TableStyles.tableRow}
                role="row"
                aria-rowindex={rowIndex + 1 + FIRST_ARIA_INDEX}
                aria-selected={selectionMode.value === "none" ? undefined : selectedRows.value.has(row)}
                aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
                style={virtualRow ? { transform: `translateY(${rowWindow.getRowStart(virtualRow)}px)` } : undefined}
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

                    return (
                        <div
                            key={columnIndex}
                            id={getCellId(cell)}
                            class={TableStyles.tableCell}
                            role="gridcell"
                            aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                            aria-disabled={getIsDisabled() || undefined}
                            tabindex={getIsRoving(cell) ? 0 : -1}
                            onClick={(e) => handleCellClick(e, cell)}
                        >
                            {column.renderCell({ row, renderProps: getCellRenderProps(columnIndex, rowIndex) })}
                        </div>
                    );
                })}
            </div>
        );

        const renderHeaderCell = (column: TableColumn<T>, columnIndex: number) => {
            const cell = { row: HEADER_ROW_INDEX, col: columnIndex };
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
            const isDisabled = getIsDisabled();
            const isVirtualized = getIsVirtualized();

            const rootStyle = assignInlineVars({
                [TableStyles.tableTemplateVar]: TableUtils.getColumnTemplate(columns.value, widths.value),
                [TableStyles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
            });

            return (
                <div
                    class={TableStyles.tableRoot}
                    role="grid"
                    aria-label={props.ariaLabel}
                    aria-rowcount={grid.value.rowCount}
                    aria-colcount={grid.value.colCount}
                    aria-multiselectable={selectionMode.value === "multiple" || undefined}
                    aria-disabled={isDisabled || undefined}
                    style={rootStyle}
                    onKeydown={handleKeyDown}
                >
                    <div ref={headerRef} class={TableStyles.tableHeader} role="rowgroup">
                        <div class={TableStyles.tableRow} role="row" aria-rowindex={FIRST_ARIA_INDEX}>
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
                        style={{ height: isVirtualized ? `${rowWindow.totalSize.value}px` : undefined }}
                    >
                        {isVirtualized
                            ? rowWindow.rows.value.map((virtualRow) =>
                                  renderRow(rows.value[virtualRow.index], virtualRow.index, virtualRow),
                              )
                            : rows.value.map((row, rowIndex) => renderRow(row, rowIndex))}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Table",
        slots: Object as SlotsType<TableSlots>,
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
