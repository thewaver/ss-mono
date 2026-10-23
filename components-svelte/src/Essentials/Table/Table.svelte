<script lang="ts" generics="T">
    import { untrack } from "svelte";
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
        type TableDetailRenderProps,
        type TableFocus,
        TableUtils,
        type VirtualizerRow,
        TableStyles as styles,
    } from "@thewaver/ss-components";
    import { TableConst } from "@thewaver/ss-components/internal";
    import { type Index2d, ObjectUtils } from "@thewaver/ss-utils";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { CarrierSvelteUtils } from "../../Abstracts/Carrier/CarrierSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { SelectionSvelteUtils } from "../../Abstracts/Selection/SelectionSvelte.utils.js";
    import { VirtualizerSvelteUtils } from "../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TableColumn, TableProps } from "./Table.types.js";
    import TableCell from "./TableCell.svelte";
    import TableHeaderCell from "./TableHeaderCell.svelte";

    type TablePointerEvent = PointerEvent & { currentTarget: HTMLElement };

    let {
        sort = $bindable(),
        widths: storedWidths = $bindable(),
        selection: storedSelection = $bindable(),
        expanded: storedExpanded = $bindable(),
        order = $bindable(),
        ...props
    }: TableProps<T> = $props();

    const tableId = $props.id();
    const hintId = `${tableId}-hint`;

    let header = $state<HTMLDivElement>();
    let body = $state<HTMLDivElement>();
    let focus = $state.raw<TableFocus>({ cell: { row: TableConst.HEADER_ROW_INDEX, col: 0 }, isDetail: false });
    let hoveredRow = $state<number>();
    let hoveredColumn = $state<number>();
    let resizingColumnId = $state(TableConst.NO_RESIZING);

    let resizeStart = { x: 0, width: 0, hasDragged: false };
    let hasCarriedClick = false;
    let pendingFocusId: string | undefined;

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

    const [getHeldExpanded, setHeldExpanded] = createHeldValue([
        () => storedExpanded,
        (next) => {
            storedExpanded = next;
        },
    ]);

    const isDisabled = $derived(props.isDisabled ?? false);
    const widths = $derived(storedWidths ?? TableConst.EMPTY_WIDTHS);
    const selected = $derived(getHeldSelection() ?? TableConst.EMPTY_SELECTION);
    const selectionMode = $derived(TableUtils.getSelectionMode(props.selectionMode, storedSelection !== undefined));
    const isVirtualized = $derived(props.computeEstimatedRowHeight !== undefined);
    const resizeStepPx = $derived(props.resizeStepPx ?? TABLE_DEFAULTS.resizeStepPx);

    const columnOrder = $derived(
        TableUtils.getPinnedOrder(
            props.columns,
            TableUtils.getColumnOrder(props.columns, order ?? TableConst.EMPTY_ORDER),
        ),
    );
    const columns = $derived(TableUtils.getReordered(props.columns, columnOrder));
    const pinOffsets = $derived(TableUtils.computePinOffsets(columns, widths));

    const sortedColumn = $derived(
        sort === undefined ? undefined : columns.find((column) => column.id === sort?.columnId),
    );

    const rowOrder = $derived(TableUtils.getSortedOrder(props.rows, sortedColumn, sort));
    const rows = $derived(TableUtils.getReordered(props.rows, rowOrder));

    const selectedRows = $derived(new Set(selected));

    const isExpandable = $derived(props.renderDetail !== undefined);

    const getIsRowExpandable = (row: T | undefined) =>
        row !== undefined && isExpandable && (props.computeIsExpandable?.(row) ?? true);

    const expandedRows = $derived(
        isExpandable
            ? TableUtils.getExpandedRows(rows, getHeldExpanded() ?? [], props.computeIsExpandable)
            : TableConst.EMPTY_EXPANDED_ROWS,
    );

    const expandedRowSet = $derived(new Set(expandedRows));

    const getWalkRow = (layoutRow: number) => TableUtils.getEntryIndex(layoutRow, expandedRows) + 1;

    const grid = $derived({
        rowCount: TableUtils.getEntryCount(rows.length, expandedRows) + 1,
        colCount: columns.length,
    });
    const rovingCell = $derived(TableUtils.clampCell(TableUtils.computeWalkCell(focus, expandedRows), grid));
    const rovingFocus = $derived(TableUtils.computeFocus(rovingCell, expandedRows));

    const getDataCol = (layoutCol: number) => columnOrder?.[layoutCol] ?? layoutCol;
    const getDataRow = (layoutRow: number) => rowOrder?.[layoutRow] ?? layoutRow;

    const rovingRow = $derived(rovingCell.row);
    const pinnedRows = $derived(
        rovingRow === TableConst.HEADER_ROW_INDEX ? TableConst.EMPTY_PINNED_ROWS : [rovingRow - 1],
    );

    const rowWindow = VirtualizerSvelteUtils.createRowWindow(
        () => body,
        () => TableUtils.getEntryCount(rows.length, expandedRows),
        {
            getIsDisabled: () => !isVirtualized,
            computeEstimatedSize: (index) =>
                props.computeEstimatedRowHeight?.(TableUtils.getEntry(index, expandedRows).layoutRow) ?? 0,
            getPinnedRows: () => pinnedRows,
        },
    );

    const isWindowed = $derived(isVirtualized && !rowWindow.getHasNoScroller());

    const getCellId = (cell: Index2d) => TableUtils.getCellId(tableId, cell);

    const getDetailId = (layoutRow: number) => TableUtils.getDetailId(tableId, layoutRow);

    const getIsRoving = (cell: Index2d) =>
        !rovingFocus.isDetail && rovingFocus.cell.row === cell.row && rovingFocus.cell.col === cell.col;

    const getIsDetailRoving = (layoutRow: number) => rovingFocus.isDetail && rovingFocus.cell.row === layoutRow + 1;

    const focusAt = (next: TableFocus) => {
        focus = next;

        const walkCell = TableUtils.computeWalkCell(next, expandedRows);

        if (walkCell.row > TableConst.HEADER_ROW_INDEX && rowWindow.getIsLive()) rowWindow.scrollToRow(walkCell.row - 1);

        const id = next.isDetail ? getDetailId(next.cell.row - 1) : getCellId(next.cell);
        const element = document.getElementById(id);

        if (element) {
            element.focus();

            return;
        }

        pendingFocusId = id;
    };

    const focusCell = (cell: Index2d) => focusAt({ cell, isDetail: false });

    const toggleExpanded = (layoutRow: number) => {
        const row = rows[layoutRow];

        if (isDisabled || !getIsRowExpandable(row)) return;

        const next = TableUtils.getToggledExpanded(getHeldExpanded() ?? [], row);

        setHeldExpanded(next);
        props.onExpandedChange?.(next);
    };

    $effect(() => {
        const current = focus;
        const openRows = expandedRowSet;

        if (!current.isDetail || openRows.has(current.cell.row - 1)) return;

        untrack(() => {
            focus = { cell: current.cell, isDetail: false };

            if (document.activeElement === document.body) document.getElementById(getCellId(current.cell))?.focus();
        });
    });

    $effect(() => {
        rowWindow.getRows();
        rows;
        focus;

        untrack(() => {
            const element = pendingFocusId === undefined ? undefined : document.getElementById(pendingFocusId);

            if (!element) return;

            pendingFocusId = undefined;
            element.focus();
        });
    });

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
        document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }))?.offsetWidth ??
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

        resizingColumnId = TableConst.NO_RESIZING;

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
        if (TableUtils.clampToPinGroup(columns, fromIndex, toIndex) !== toIndex) return false;

        const next = ObjectUtils.moveArrayElement(
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
            const element = document.getElementById(getCellId({ row: TableConst.HEADER_ROW_INDEX, col: columnIndex }));

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
        computePlaceAtPoint: (point) => {
            const source = getSourceColumnIndex() ?? 0;

            return TableUtils.clampToPinGroup(
                columns,
                source,
                TableUtils.computeColumnPlaceAtPoint(getHeaderRects(), point, source, getDirection()),
            );
        },
        computeNudgedPlace: (place, nudge) => {
            const nudged = TableUtils.computeColumnNudgedPlace(place, nudge, columns.length);

            return nudged === undefined ? undefined : TableUtils.clampToPinGroup(columns, getSourceColumnIndex() ?? 0, nudged);
        },
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

        const from = rovingCell;
        const column = columns[from.col];
        const command = TableUtils.computeKeyCommand(e, from, grid, {
            direction: getDirection(),
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

    const getPinClass = (layoutCol: number) => {
        const pin = columns[layoutCol]?.pin;

        return pin === "start" ? styles.tablePinnedStart : pin === "end" ? styles.tablePinnedEnd : undefined;
    };

    const getPinStyle = (layoutCol: number) => {
        const offset = pinOffsets[layoutCol];

        return offset === undefined ? undefined : toStyle(assignInlineVars({ [styles.tablePinOffsetVar]: `${offset}px` }));
    };

    let hasExpander = false;
    let hasWarnedExpander = false;

    const warnIfExpanderMissing = (row: T) => {
        if (hasExpander || hasWarnedExpander || !getIsRowExpandable(row)) return;

        hasWarnedExpander = true;

        TableUtils.warnIfExpanderMissing();
    };

    const handleDetailClick = (e: MouseEvent & { currentTarget: HTMLElement }, layoutRow: number) => {
        if (TableUtils.getIsInteractiveInCell(e.target, e.currentTarget)) return;

        focusAt({ cell: { row: layoutRow + 1, col: rovingCell.col }, isDetail: true });
    };

    const rootStyle = $derived(
        toStyle(
            assignInlineVars({
                [styles.tableTemplateVar]: TableUtils.getColumnTemplate(columns, widths),
                [styles.tableResizerWidthVar]: `${props.resizerWidthPx ?? TABLE_DEFAULTS.resizerWidthPx}px`,
                [styles.tableMinWidthVar]: `${TableUtils.computeMinTableWidth(columns, widths)}px`,
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
            if (resizingColumnId === column.id) resizingColumnId = TableConst.NO_RESIZING;
        }}
        onclick={(e) => e.stopPropagation()}
    >
        {@render props.renderResizer?.(renderProps)}
    </div>
{/snippet}

{#snippet tableRow(row: T, rowIndex: number, virtualRow: VirtualizerRow | undefined)}
    <div
        {@attach virtualRow && rowWindow.measureRow(virtualRow.index)}
        {@attach () => untrack(() => warnIfExpanderMissing(row))}
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
        aria-rowindex={getWalkRow(rowIndex) + TableConst.FIRST_ARIA_INDEX}
        aria-level={isExpandable ? TableConst.ROW_LEVEL : undefined}
        aria-expanded={getIsRowExpandable(row) ? expandedRowSet.has(rowIndex) : undefined}
        aria-selected={selectionMode === "none" ? undefined : selectedRows.has(row)}
        aria-label={props.computeRowAriaLabel?.(row, rowIndex)}
        style:transform={virtualRow ? `translateY(${rowWindow.getRowStart(virtualRow)}px)` : undefined}
    >
        {#each columns as column, columnIndex}
            {@const cell = { row: rowIndex + 1, col: columnIndex }}
            <TableCell
                {column}
                {row}
                cellId={getCellId(cell)}
                {columnIndex}
                isRoving={getIsRoving(cell)}
                {isDisabled}
                pinClass={getPinClass(columnIndex)}
                pinStyle={getPinStyle(columnIndex)}
                renderProps={getCellRenderProps(columnIndex, rowIndex)}
                context={{
                    toggle: () => {
                        focusCell(cell);
                        toggleExpanded(rowIndex);
                    },
                    registerExpander: () => {
                        hasExpander = true;
                    },
                }}
                onClick={(e) => handleCellClick(e, cell)}
            />
        {/each}
    </div>
{/snippet}

{#snippet detailRow(row: T, layoutRow: number, virtualRow: VirtualizerRow | undefined)}
    <div
        {@attach virtualRow && rowWindow.measureRow(virtualRow.index)}
        class={[styles.tableRow, virtualRow && styles.tableWindowedRow]}
        role="row"
        aria-rowindex={getWalkRow(layoutRow) + 1 + TableConst.FIRST_ARIA_INDEX}
        aria-level={TableConst.DETAIL_LEVEL}
        style:transform={virtualRow ? `translateY(${rowWindow.getRowStart(virtualRow)}px)` : undefined}
    >
        <div
            {@attach (element) => on(element, "click", (e) => handleDetailClick(e, layoutRow))}
            {...{ [TableUtils.DETAIL_ATTRIBUTE]: "true" }}
            id={getDetailId(layoutRow)}
            class={styles.tableDetailCell}
            role="gridcell"
            aria-colindex={TableConst.FIRST_ARIA_INDEX}
            aria-colspan={columns.length}
            aria-disabled={isDisabled || undefined}
            tabindex={getIsDetailRoving(layoutRow) ? 0 : -1}
        >
            {@render props.renderDetail?.(row, getDetailRenderProps(layoutRow))}
        </div>
    </div>
{/snippet}

<div
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={styles.tableRoot}
    role={isExpandable ? "treegrid" : "grid"}
    aria-label={props.ariaLabel}
    aria-rowcount={grid.rowCount}
    aria-colcount={grid.colCount}
    aria-multiselectable={selectionMode === "multiple" || undefined}
    aria-disabled={isDisabled || undefined}
    style={rootStyle}
>
    <div bind:this={header} class={styles.tableHeader} role="rowgroup">
        <div class={styles.tableRow} role="row" aria-rowindex={TableConst.FIRST_ARIA_INDEX}>
            {#each columns as column, columnIndex}
                {@const cell = { row: TableConst.HEADER_ROW_INDEX, col: columnIndex }}
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
                    pinClass={getPinClass(columnIndex)}
                    pinStyle={getPinStyle(columnIndex)}
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
        style:height={isWindowed ? `${rowWindow.getTotalSize()}px` : undefined}
    >
        {#if isWindowed}
            {#each rowWindow.getRows() as virtualRow (virtualRow.index)}
                {@const entry = TableUtils.getEntry(virtualRow.index, expandedRows)}
                {#key `${entry.kind}-${entry.layoutRow}`}
                    {#if entry.kind === "detail"}
                        {@render detailRow(rows[entry.layoutRow], entry.layoutRow, virtualRow)}
                    {:else}
                        {@render tableRow(rows[entry.layoutRow], entry.layoutRow, virtualRow)}
                    {/if}
                {/key}
            {/each}
        {:else}
            {#each rows as row, rowIndex}
                {@render tableRow(row, rowIndex, undefined)}

                {#if expandedRowSet.has(rowIndex)}
                    {@render detailRow(row, rowIndex, undefined)}
                {/if}
            {/each}
        {/if}
    </div>
</div>
