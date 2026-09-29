<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import {
        CarrierUtils,
        type CarrierZone,
        type CarryPlace,
        LiveAnnouncerUtils,
        type SelectionGesture,
        TABLE_DEFAULTS,
        type TableCellRenderProps,
        type TableColumnRenderProps,
        TableUtils,
        type VirtualizerRow,
        TableStyles as styles,
    } from "@thewaver/ss-components";
    import type { Index2d } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { CarrierSvelteUtils } from "../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { SelectionSvelteUtils } from "../../Abstracts/Selection/SelectionSvelte.utils.js";
    import { VirtualizerSvelteUtils } from "../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TableColumn, TableProps } from "./Table.types.js";
    import TableHeaderCell from "./TableHeaderCell.svelte";

    type TablePointerEvent = PointerEvent & { currentTarget: HTMLElement };

    const HEADER_ROW_INDEX = TableUtils.HEADER_ROW_INDEX;
    const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;

    const NO_RESIZING = "";

    const EMPTY_PINNED_ROWS: number[] = [];
    const EMPTY_WIDTHS: Record<string, number> = {};
    const EMPTY_ORDER: string[] = [];
    const EMPTY_SELECTION: never[] = [];

    let {
        sort = $bindable(),
        widths: storedWidths = $bindable(),
        selection: storedSelection = $bindable(),
        order = $bindable(),
        ...props
    }: TableProps<T> = $props();

    const tableId = $props.id();
    const hintId = `${tableId}-hint`;

    let header = $state<HTMLDivElement>();
    let body = $state<HTMLDivElement>();
    let focusedCell = $state.raw<Index2d>({ row: HEADER_ROW_INDEX, col: 0 });
    let hoveredRow = $state<number>();
    let hoveredColumn = $state<number>();
    let resizingColumnId = $state(NO_RESIZING);

    let resizeStart = { x: 0, width: 0, hasDragged: false };
    let hasCarriedClick = false;

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    const getDirection = NavigatorSvelteUtils.createDirection(() => header);

    const [getHeldSelection, setHeldSelection] = createHeldValue([
        () => storedSelection,
        (next) => {
            storedSelection = next;
        },
    ]);

    const isDisabled = $derived(props.isDisabled ?? false);
    const widths = $derived(storedWidths ?? EMPTY_WIDTHS);
    const selected = $derived(getHeldSelection() ?? EMPTY_SELECTION);
    const selectionMode = $derived(TableUtils.getSelectionMode(props.selectionMode, storedSelection !== undefined));
    const isVirtualized = $derived(props.computeEstimatedRowHeight !== undefined);
    const resizeStepPx = $derived(props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx);

    const columnOrder = $derived(TableUtils.getColumnOrder(props.columns, order ?? EMPTY_ORDER));
    const columns = $derived(TableUtils.getReordered(props.columns, columnOrder));

    const sortedColumn = $derived(
        sort === undefined ? undefined : columns.find((column) => column.id === sort?.columnId),
    );

    const rowOrder = $derived(TableUtils.getSortedOrder(props.rows, sortedColumn, sort));
    const rows = $derived(TableUtils.getReordered(props.rows, rowOrder));

    const selectedRows = $derived(new Set(selected));

    const grid = $derived({ rowCount: rows.length + 1, colCount: columns.length });
    const rovingCell = $derived(TableUtils.clampCell(focusedCell, grid));

    const getDataCol = (layoutCol: number) => columnOrder?.[layoutCol] ?? layoutCol;
    const getDataRow = (layoutRow: number) => rowOrder?.[layoutRow] ?? layoutRow;

    const rovingRow = $derived(rovingCell.row);
    const pinnedRows = $derived(rovingRow === HEADER_ROW_INDEX ? EMPTY_PINNED_ROWS : [rovingRow - 1]);

    const rowWindow = VirtualizerSvelteUtils.createRowWindow(
        () => body,
        () => rows.length,
        {
            getIsDisabled: () => !isVirtualized,
            computeEstimatedSize: (index) => props.computeEstimatedRowHeight?.(index) ?? 0,
            getPinnedRows: () => pinnedRows,
        },
    );

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

    const getIsRoving = (cell: Index2d) => rovingCell.row === cell.row && rovingCell.col === cell.col;

    const focusCell = (cell: Index2d) => {
        focusedCell = cell;

        if (cell.row > HEADER_ROW_INDEX && rowWindow.getIsLive()) rowWindow.scrollToRow(cell.row - 1);

        document.getElementById(getCellId(cell))?.focus();
    };

    const toggleSort = (column: TableColumn<T> | undefined) => {
        if (!column || column.isSortable !== true || isDisabled) return;

        const next = TableUtils.getNextSort(sort, column.id);

        sort = next;
        props.onSortChange?.(next);
    };

    const selection = SelectionSvelteUtils.create(() => isDisabled, {
        getMode: () => selectionMode,
        getItems: () => rows,
        selection: [
            () => selected,
            (next) => {
                setHeldSelection(next);
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

    const getIsResizable = (column: TableColumn<T>) => (column.isResizable ?? false) && storedWidths !== undefined;

    const resizeColumn = (column: TableColumn<T>, width: number) => {
        if (!getIsResizable(column) || isDisabled) return;

        storedWidths = { ...widths, [column.id]: TableUtils.getResizedWidth(column, width) };
    };

    const handleResizerPointerDown = (e: TablePointerEvent, column: TableColumn<T>, columnIndex: number) => {
        if (e.button !== 0 || isDisabled) return;

        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.setPointerCapture(e.pointerId);

        resizeStart = { x: e.clientX, width: getCurrentWidth(column, columnIndex), hasDragged: false };

        resizingColumnId = column.id;
    };

    const handleResizerPointerMove = (e: TablePointerEvent, column: TableColumn<T>) => {
        if (resizingColumnId !== column.id) return;

        const start = resizeStart;

        if (e.clientX !== start.x) start.hasDragged = true;

        resizeColumn(column, TableUtils.computeDraggedWidth(start.width, e.clientX - start.x, getDirection()));
    };

    const handleResizerPointerUp = (e: TablePointerEvent, column: TableColumn<T>, columnIndex: number) => {
        if (resizingColumnId !== column.id) return;

        e.currentTarget.releasePointerCapture(e.pointerId);

        resizingColumnId = NO_RESIZING;

        if (resizeStart.hasDragged) return;

        resizeColumn(
            column,
            TableUtils.computePressedWidth({
                clientX: e.clientX,
                rect: e.currentTarget.getBoundingClientRect(),
                width: getCurrentWidth(column, columnIndex),
                step: resizeStepPx,
                direction: getDirection(),
            }),
        );
    };

    const getIsReorderable = (column: TableColumn<T> | undefined) =>
        column !== undefined && (column.isReorderable ?? false) && order !== undefined;

    const moveColumn = (fromIndex: number, toIndex: number) => {
        if (!getIsReorderable(columns[fromIndex]) || isDisabled) return false;
        if (toIndex < 0 || toIndex >= columns.length) return false;

        const next = CarrierUtils.computeMovedOrder(
            columns.map((column) => column.id),
            fromIndex,
            toIndex,
        );

        order = next;
        props.onOrderChange?.(next);

        return true;
    };

    const getHeaderRects = () =>
        columns.reduce<DOMRect[]>((acc, _unused, columnIndex) => {
            const element = document.getElementById(getCellId({ row: HEADER_ROW_INDEX, col: columnIndex }));

            if (element) acc.push(element.getBoundingClientRect());

            return acc;
        }, []);

    const getSourceColumnIndex = () => {
        const carryState = CarrierUtils.carry.get();

        return carryState && carryState.from === zone ? (carryState.fromPlace as number) : undefined;
    };

    const zone: CarrierZone = {
        getGroupId: () => tableId,
        getLabel: () => props.ariaLabel,
        getRootRef: () => header ?? undefined,
        getIsDisabled: () => isDisabled || order === undefined,
        getKeyHint: () => props.announcements!.keyHint,
        getAnnouncements: () => props.announcements!,
        computeCanAccept: () => !isDisabled && order !== undefined,
        computePlaceAtPoint: (point) =>
            TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, getSourceColumnIndex() ?? 0, getDirection()),
        computeNudgedPlace: (place, nudge) => TableUtils.computeColumnNudgedPlace(place, nudge, columns.length),
        computeEntryPlace: () => getSourceColumnIndex() ?? 0,
        computeIsSamePlace: (a, b) => a === b,
        computeIsPlaceAllowed: () => true,
        computePlaceLabel: (place) => props.announcements!.computePlaceLabel(place as number, columns.length),
        takeAt: () => undefined,
        putAt: () => undefined,
        moveAt: (fromPlace: CarryPlace, toPlace: CarryPlace) => moveColumn(fromPlace as number, toPlace as number),
    };

    CarrierSvelteUtils.registerZone(zone);

    const isCarrySource = $derived(CarrierSvelteUtils.getSourceZone() === zone);
    const carriedColumnId = $derived(isCarrySource ? CarrierSvelteUtils.getCarry()?.key : undefined);
    const sourceColumnIndex = $derived(isCarrySource ? (CarrierSvelteUtils.getSourcePlace() as number) : undefined);

    $effect(() => {
        if (!isCarrySource) return;

        return TableUtils.observeCarryCancel(zone);
    });

    const landingCol = $derived.by(() => {
        const toPlace = CarrierSvelteUtils.getTargetPlace();

        return CarrierSvelteUtils.getTargetZone() === zone && toPlace !== undefined
            ? TableUtils.computeLandingCol(toPlace, sourceColumnIndex ?? 0)
            : undefined;
    });

    const startCarry = (columnIndex: number, mode: "drag" | "tap") => {
        const column = columns[columnIndex];

        CarrierUtils.start(
            zone,
            columnIndex,
            { groupId: tableId, key: column.id, label: column.header, value: column.id },
            mode,
        );
    };

    const handleHeaderPointerDown = (e: PointerEvent, columnIndex: number) => {
        const column = columns[columnIndex];

        if (e.button !== 0 || isDisabled || !getIsReorderable(column)) return;
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

    const handleKeyDown = (e: KeyboardEvent) => {
        const from = rovingCell;
        const column = columns[from.col];
        const command = TableUtils.computeKeyCommand(e, from, grid, {
            direction: getDirection(),
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

    const handleCellClick = (e: MouseEvent & { currentTarget: HTMLElement }, cell: Index2d) => {
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

    const rootStyle = $derived(
        toStyle(
            assignInlineVars({
                [styles.tableTemplateVar]: TableUtils.getColumnTemplate(columns, widths),
                [styles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
            }),
        ),
    );
</script>

{#snippet resizer(column: TableColumn<T>, columnIndex: number, renderProps: TableColumnRenderProps)}
    <div
        class={styles.tableResizer}
        aria-hidden="true"
        onpointerdown={(e) => handleResizerPointerDown(e, column, columnIndex)}
        onpointermove={(e) => handleResizerPointerMove(e, column)}
        onpointerup={(e) => handleResizerPointerUp(e, column, columnIndex)}
        onpointercancel={() => {
            if (resizingColumnId === column.id) resizingColumnId = NO_RESIZING;
        }}
        onclick={(e) => e.stopPropagation()}
    >
        {@render props.renderResizer?.(renderProps)}
    </div>
{/snippet}

{#snippet tableRow(row: T, rowIndex: number, virtualRow: VirtualizerRow | undefined)}
    <div
        {@attach virtualRow && rowWindow.measureRow(virtualRow.index)}
        {@attach (element) =>
            on(element, "pointerenter", () => {
                hoveredRow = rowIndex;
            })}
        {@attach (element) =>
            on(element, "pointerleave", () => {
                hoveredRow = undefined;
            })}
        class={[styles.tableRow, virtualRow && styles.tableWindowedRow]}
        role="row"
        aria-rowindex={rowIndex + 1 + FIRST_ARIA_INDEX}
        aria-selected={selectionMode === "none" ? undefined : selectedRows.has(row)}
        aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
        style:transform={virtualRow ? `translateY(${rowWindow.getRowStart(virtualRow)}px)` : undefined}
    >
        {#each columns as column, columnIndex}
            {@const cell = { row: rowIndex + 1, col: columnIndex }}
            <div
                {@attach (element) => on(element, "click", (e) => handleCellClick(e, cell))}
                id={getCellId(cell)}
                class={styles.tableCell}
                role="gridcell"
                aria-colindex={columnIndex + FIRST_ARIA_INDEX}
                aria-disabled={isDisabled || undefined}
                tabindex={getIsRoving(cell) ? 0 : -1}
            >
                {@render column.renderCell(row, getCellRenderProps(columnIndex, rowIndex))}
            </div>
        {/each}
    </div>
{/snippet}

<div
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.tableRoot}
    role="grid"
    aria-label={props.ariaLabel}
    aria-rowcount={grid.rowCount}
    aria-colcount={grid.colCount}
    aria-multiselectable={selectionMode === "multiple" || undefined}
    aria-disabled={isDisabled || undefined}
    style={rootStyle}
>
    <div bind:this={header} class={styles.tableHeader} role="rowgroup">
        <div class={styles.tableRow} role="row" aria-rowindex={FIRST_ARIA_INDEX}>
            {#each columns as column, columnIndex}
                {@const cell = { row: HEADER_ROW_INDEX, col: columnIndex }}
                {@const renderProps = getColumnRenderProps(columnIndex)}
                <TableHeaderCell
                    {column}
                    cellId={getCellId(cell)}
                    {columnIndex}
                    isLast={columnIndex === columns.length - 1}
                    isRoving={getIsRoving(cell)}
                    {isDisabled}
                    isReorderable={getIsReorderable(column)}
                    hintId={order !== undefined ? hintId : undefined}
                    {landingCol}
                    columnCount={columns.length}
                    {renderProps}
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
                    renderResizer={resizer}
                    renderMarker={props.renderMarker}
                    onPointerDown={(e) => handleHeaderPointerDown(e, columnIndex)}
                    onClick={() => {
                        if (hasCarriedClick) {
                            hasCarriedClick = false;

                            return;
                        }

                        focusCell(cell);
                    }}
                    onPointerEnter={() => {
                        hoveredColumn = columnIndex;
                    }}
                    onPointerLeave={() => {
                        hoveredColumn = undefined;
                    }}
                />
            {/each}
        </div>
    </div>

    {#if order !== undefined}
        <div id={hintId} class={styles.tableHint}>
            {props.announcements?.restingKeyHint}
        </div>
    {/if}

    <div
        bind:this={body}
        class={styles.tableBody}
        role="rowgroup"
        style:height={isVirtualized ? `${rowWindow.getTotalSize()}px` : undefined}
    >
        {#if isVirtualized}
            {#each rowWindow.getRows() as virtualRow (virtualRow.index)}
                {@render tableRow(rows[virtualRow.index], virtualRow.index, virtualRow)}
            {/each}
        {:else}
            {#each rows as row, rowIndex}
                {@render tableRow(row, rowIndex, undefined)}
            {/each}
        {/if}
    </div>
</div>
