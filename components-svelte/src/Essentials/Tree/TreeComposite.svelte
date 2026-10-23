<script lang="ts" generics="T">
    import { type Snippet, untrack } from "svelte";
    import { on } from "svelte/events";
    import { SvelteMap } from "svelte/reactivity";

    import {
        FlattenerUtils,
        FloaterStyles as floaterStyles,
        InteractionTrackerUtils,
        SelectionUtils,
        TREE_DEFAULTS,
        TreeUtils,
        TypeaheadUtils,
        TreeStyles as styles,
    } from "@thewaver/ss-components";

    import { FloaterSvelteUtils } from "../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { TypeaheadSvelteUtils } from "../../Abstracts/Typeahead/TypeaheadSvelte.utils.svelte.js";
    import { VirtualizerSvelteUtils } from "../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { TooltipSvelteUtils } from "../Overlays/Tooltip/TooltipSvelte.utils.svelte.js";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TreeCompositeProps, TreeRow } from "./Tree.types.js";
    import TreeNodeItem from "./TreeNodeItem.svelte";

    const EMPTY_PINNED_ROWS: number[] = [];

    let {
        value = $bindable(),
        checked = $bindable([]),
        expanded = $bindable([]),
        ...props
    }: TreeCompositeProps<T> = $props();

    const hasLayout = $derived(props.computeLayout !== undefined);
    const hasConnector = $derived(props.renderConnector !== undefined);

    $effect(() => TreeUtils.warnIfConnectorIgnored(hasLayout, hasConnector));

    const treeId = $props.id();

    const [getValue, setValue] = createHeldValue([
        () => value,
        (next) => {
            value = next;
        },
    ]);

    const [getChecked, setChecked] = createHeldValue([
        () => checked,
        (next) => {
            checked = next;
        },
    ]);

    const [getExpanded, setExpanded] = createHeldValue([
        () => expanded,
        (next) => {
            expanded = next;
        },
    ]);

    let root = $state<HTMLDivElement>();
    let sizer = $state<HTMLDivElement>();
    let focusedValue = $state.raw<T>();

    let lastFocusedValue: T | undefined;
    let lastExpanded: T[] = [];
    let pendingFocusId: string | undefined;

    const direction = NavigatorSvelteUtils.createDirection(() => root ?? undefined);
    const typeahead = TypeaheadSvelteUtils.createBuffer();

    watchChange(
        getValue,
        () => {
            focusedValue = undefined;
        },
        { isBeforeRender: true },
    );

    const expandedSet = $derived(new Set(getExpanded()));
    const rows = $derived(TreeUtils.getVisibleRows(props.nodes, (entry) => expandedSet.has(entry)));
    const flatRows = $derived(FlattenerUtils.getFlatRows(rows));
    const navigableRows = $derived(flatRows.filter(TreeUtils.computeIsNavigable));

    const isVirtualized = $derived(props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined);

    const branchDefs = $derived(TreeUtils.createBranchDefs(props.nodes));

    const getCheckedState = (nodeValue: T) =>
        props.isMultiple
            ? SelectionUtils.getBranchState(nodeValue, getChecked() ?? [], branchDefs)
            : nodeValue === getValue();

    const getFirstCheckedValue = () =>
        navigableRows.find((row) => getCheckedState(row.node.value) === true)?.node.value;

    const rovingRow = $derived(
        TreeUtils.computeRovingRow(
            navigableRows,
            focusedValue,
            props.isMultiple ? getFirstCheckedValue() : getValue(),
        ),
    );

    const rowWindow = VirtualizerSvelteUtils.createRowWindow(
        () => sizer ?? undefined,
        () => flatRows.length,
        {
            getIsDisabled: () => !isVirtualized,
            computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
            getPinnedRows: () => (rovingRow === undefined ? EMPTY_PINNED_ROWS : [rovingRow.index]),
        },
    );

    const layout = $derived(
        props.computeLayout?.({ itemCount: flatRows.length, itemParents: flatRows.map((row) => row.parentIndex) }),
    );

    const getRowId = (row: TreeRow<T>) => TreeUtils.computeRowId(treeId, row);

    const findRowById = (id: string | undefined) => navigableRows.find((row) => getRowId(row) === id);

    const computeRowText = (row: TreeRow<T>) => {
        const custom = props.computeCustomText?.(row.node);

        if (custom !== undefined) return custom;

        const painted = TypeaheadUtils.getElementText(document.getElementById(getRowId(row)));

        return painted.length > 0 ? painted : String(row.node.value);
    };

    const focusRow = (row: TreeRow<T>) => {
        const id = getRowId(row);

        focusedValue = row.node.value;

        if (rowWindow.getIsLive()) rowWindow.scrollToRow(row.index);

        const element = document.getElementById(id);

        if (element) {
            element.focus();

            return;
        }

        pendingFocusId = id;
    };

    $effect(() => {
        rowWindow.getRows();
        flatRows;
        focusedValue;

        untrack(() => {
            const element = pendingFocusId === undefined ? undefined : document.getElementById(pendingFocusId);

            if (!element) return;

            pendingFocusId = undefined;
            element.focus();
        });
    });

    $effect(() => {
        const current = getExpanded() ?? [];
        const currentRows = flatRows;

        untrack(() => {
            const branch = TreeUtils.findCollapsedFocusTarget(lastExpanded, current, currentRows, lastFocusedValue);

            lastExpanded = current;

            if (branch && document.activeElement === document.body) focusRow(branch);
        });
    });

    const writeExpanded = (next: T[]) => {
        if (next !== getExpanded()) setExpanded(next);
    };

    const expand = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        writeExpanded(TreeUtils.expand(getExpanded() ?? [], row.node));
    };

    const collapse = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        writeExpanded(TreeUtils.collapse(getExpanded() ?? [], row.node));
    };

    const toggle = (row: TreeRow<T>) => {
        if (row.isExpanded) {
            collapse(row);

            return;
        }

        expand(row);
    };

    const expandSiblings = (row: TreeRow<T>) => {
        setExpanded(TreeUtils.expandSiblings(getExpanded() ?? [], TreeUtils.computeSiblings(rows, flatRows, row)));
    };

    const select = (next: T) => {
        if (next === getValue()) return;

        setValue(next);

        props.onSelectionChange?.(next);
    };

    let checkAnchor: T | undefined;

    const writeChecked = (next: T[]) => {
        setChecked(next);

        props.onCheckedChange?.(next);
    };

    const check = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        checkAnchor = row.node.value;

        writeChecked(SelectionUtils.getBranchSelection(row.node.value, getChecked() ?? [], branchDefs));
    };

    const checkRows = (rowsToCheck: TreeRow<T>[]) =>
        writeChecked(
            SelectionUtils.getMerged(
                getChecked() ?? [],
                rowsToCheck
                    .filter((row) => !row.node.isDisabled)
                    .flatMap((row) => SelectionUtils.getBranchItems(row.node.value, branchDefs)),
            ),
        );

    const checkAll = () => {
        const all = TreeUtils.getCheckableValues(props.nodes);
        const current = getChecked() ?? [];
        const isAllChecked = all.every((entry) => current.includes(entry));

        writeChecked(isAllChecked ? [] : all);
    };

    const activate = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        const isBranch = TreeUtils.getIsBranch(row.node);

        if (props.isMultiple) {
            if (isBranch) toggle(row);
            else check(row);

            return;
        }

        select(row.node.value);

        if (isBranch) toggle(row);
    };

    const press = (row: TreeRow<T>, expander: HTMLElement | undefined, e: MouseEvent) => {
        if (row.node.isDisabled) return;

        const isBranch = TreeUtils.getIsBranch(row.node);

        if (expander !== undefined && e.target instanceof Node && expander.contains(e.target)) {
            if (isBranch) toggle(row);

            return;
        }

        if (props.isMultiple) check(row);
        else select(row.node.value);

        if (expander === undefined && isBranch) toggle(row);
    };

    const createExpanderHold = () => {
        let expander: HTMLElement | undefined;

        return {
            get: () => expander,
            set: (element: HTMLElement) => {
                expander = element;
            },
        };
    };

    const handleMultiKeyDown = (e: KeyboardEvent, current: TreeRow<T>, navigable: TreeRow<T>[]) => {
        const action = TreeUtils.computeMultiKeyAction(
            e.key,
            { isShiftHeld: e.shiftKey, isControlHeld: e.ctrlKey || e.metaKey },
            current,
            { navigable, anchor: navigable.find((row) => row.node.value === checkAnchor) },
        );

        if (action === undefined) return false;

        e.preventDefault();

        if (action.kind === "check") check(action.row);
        if (action.kind === "check_all") checkAll();
        if (action.kind === "check_range") checkRows(action.rows);
        if (action.kind === "check_range" && action.focus) focusRow(action.focus);

        if (action.kind === "focus_check") {
            focusRow(action.row);
            check(action.row);
        }

        return true;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (navigableRows.length < 1) return;

        const current = findRowById(document.activeElement?.id) ?? rovingRow;

        if (!current) return;

        if (props.isMultiple && handleMultiKeyDown(e, current, navigableRows)) return;

        const action = TreeUtils.computeKeyAction(e.key, current, {
            flatRows,
            navigable: navigableRows,
            direction: direction(),
            pushQuery: () => typeahead.push(e),
            computeRowText,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "expand_siblings") expandSiblings(action.row);
        if (action.kind === "focus") focusRow(action.row);
        if (action.kind === "expand") expand(action.row);
        if (action.kind === "collapse") collapse(action.row);
        if (action.kind === "activate") activate(action.row);
        if (action.kind === "click") document.getElementById(getRowId(action.row))?.click();
    };

    const nodeRefs = new SvelteMap<T, HTMLElement>();

    let hoveredValue = $state.raw<T>();
    let focusVisibleValue = $state.raw<T>();

    const recordNodeRef = (nodeValue: T, element: HTMLElement) => {
        untrack(() => nodeRefs.set(nodeValue, element));

        return () => {
            if (untrack(() => nodeRefs.get(nodeValue)) === element) nodeRefs.delete(nodeValue);
        };
    };

    const floaterTransitionDurationMs = $derived(
        props.floaterTransitionDurationMs ?? TREE_DEFAULTS.floaterTransitionDurationMs,
    );

    const createFloater = (getIsEnabled: () => boolean, getFloaterValue: () => T | undefined) => {
        const getRow = () => {
            const floaterValue = getFloaterValue();

            return floaterValue === undefined ? undefined : flatRows.find((row) => row.node.value === floaterValue);
        };

        return FloaterSvelteUtils.create({
            getIsEnabled,
            getContainer: () => (isVirtualized ? (sizer ?? undefined) : (root ?? undefined)),
            getTarget: () => {
                const row = getRow();

                return row === undefined ? undefined : nodeRefs.get(row.node.value);
            },
            getLayout: () => layout,
            getPlacement: () => {
                const row = getRow();

                return row === undefined ? undefined : layout?.placements[row.index];
            },
            getTransitionDurationMs: () => floaterTransitionDurationMs,
        });
    };

    const selectionFloater = createFloater(
        () => props.renderSelectionFloater !== undefined && !props.isMultiple,
        () => getValue(),
    );

    const handlePointerLeave = TooltipSvelteUtils.createHoverHold(
        () => (hoveredValue === undefined ? undefined : nodeRefs.get(hoveredValue)),
        () => {
            hoveredValue = undefined;
        },
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => hoveredValue ?? focusVisibleValue,
    );

    const findRowByTarget = (target: EventTarget | null) =>
        target instanceof Element ? findRowById(target.closest('[role="treeitem"]')?.id) : undefined;

    const readFocusVisibleValue = (target: EventTarget | null) =>
        target instanceof HTMLElement && InteractionTrackerUtils.computeIsFocusVisible(target)
            ? findRowByTarget(target)?.node.value
            : undefined;

    const handleFocusIn = (e: FocusEvent) => {
        lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;
        focusVisibleValue = readFocusVisibleValue(e.target);
    };

    const getConnectorDefs = (row: TreeRow<T>) =>
        props.renderConnector === undefined || layout === undefined
            ? undefined
            : TreeUtils.computeConnectorDefs(flatRows, row, layout);

    const hasPendingPaint = (row: TreeRow<T>) =>
        TreeUtils.computeIsPending(row) && props.renderPendingChildren !== undefined;
</script>

{#snippet renderRow(row: TreeRow<T>)}
    {@const placement = layout?.placements[row.index]}
    {@const expander = createExpanderHold()}
    {#snippet element()}
        <InteractionWrapper
            sizing="fill"
            isDisabled={row.node.isDisabled ?? false}
            isReachableWhenDisabled={row.node.isReachableWhenDisabled ?? false}
            isTabbable={row.node.value === rovingRow?.node.value}
            tooltipDefs={row.node.tooltipDefs}
            extraFlags={{
                value: row.node.value,
                isBranch: TreeUtils.getIsBranch(row.node),
                isExpanded: row.isExpanded,
                isPending: TreeUtils.computeIsPending(row),
                isSelected: getCheckedState(row.node.value) === true,
                checkedState: getCheckedState(row.node.value),
                depth: row.depth,
            }}
        >
            {#snippet renderControl(attachElement, renderProps)}
                {#snippet nodeContent()}
                    {@render props.renderNode(row.node, renderProps, expander.set)}
                {/snippet}

                <TreeNodeItem
                    attachElement={(element) => {
                        const detach = attachElement(element);
                        const forget = recordNodeRef(row.node.value, element);

                        return () => {
                            detach?.();
                            forget();
                        };
                    }}
                    id={getRowId(row)}
                    href={row.node.href}
                    level={row.depth + 1}
                    position={row.position + 1}
                    setSize={row.setSize}
                    flags={renderProps}
                    linkComponent={props.linkComponent}
                    isMultiple={props.isMultiple}
                    renderContent={nodeContent}
                    onActivate={(e) => press(row, expander.get(), e)}
                />
            {/snippet}
        </InteractionWrapper>
    {/snippet}

    {#if placement}
        <PlacementItem {placement}>{@render element()}</PlacementItem>
    {:else}
        {@render element()}
    {/if}
{/snippet}

{#snippet renderRows(levelRows: TreeRow<T>[])}
    {#each levelRows as row, index (index)}
        {@const connectorDefs = getConnectorDefs(row)}
        {#if connectorDefs}
            <span class={styles.treeConnector} aria-hidden="true">
                {@render props.renderConnector?.(connectorDefs)}
            </span>
        {/if}

        {@render renderRow(row)}

        {#if row.rows.length > 0 || hasPendingPaint(row)}
            <div role="group">
                {#if TreeUtils.computeIsPending(row)}
                    {@render props.renderPendingChildren?.(row.node, row.depth + 1)}
                {:else}
                    {@render renderRows(row.rows)}
                {/if}
            </div>
        {/if}
    {/each}
{/snippet}

{#snippet floaterView(
    floater: ReturnType<typeof createFloater>,
    renderContent: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]> | undefined,
)}
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${floaterTransitionDurationMs}ms` })}
        >
            {@render renderContent?.(floater.getVisibilityTarget(), floaterTransitionDurationMs)}
        </div>
    {/if}
{/snippet}

{#snippet floaters()}
    {@render floaterView(highlightFloater, props.renderHighlightFloater)}
    {@render floaterView(selectionFloater, props.renderSelectionFloater)}
{/snippet}

{#snippet tiers()}
    {#if isVirtualized}
        <div
            bind:this={sizer}
            class={rowWindow.getHasNoScroller() ? undefined : styles.treeSizer}
            style:height={rowWindow.getHasNoScroller() ? undefined : `${rowWindow.getTotalSize()}px`}
        >
            {@render floaters()}

            {#if rowWindow.getHasNoScroller()}
                {@render renderRows(rows)}
            {:else}
                {#each rowWindow.getRows() as windowRow (windowRow.index)}
                    {@const row = flatRows[windowRow.index]}
                    {#if row}
                        <div
                            {@attach rowWindow.measureRow(windowRow.index)}
                            class={styles.treeSizerRow}
                            style:transform={`translateY(${rowWindow.getRowStart(windowRow)}px)`}
                        >
                            {@render renderRow(row)}

                            {#if hasPendingPaint(row)}
                                {@render props.renderPendingChildren?.(row.node, row.depth + 1)}
                            {/if}
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>
    {:else}
        {#if !layout}
            {@render floaters()}
        {/if}

        {@render renderRows(rows)}
    {/if}
{/snippet}

<div
    bind:this={root}
    {@attach (element) =>
        on(element, "keydown", (e) => {
            handleKeyDown(e);
            focusVisibleValue = readFocusVisibleValue(document.activeElement);
        })}
    {@attach (element) =>
        on(element, "pointerover", (e) => {
            hoveredValue = findRowByTarget(e.target)?.node.value;
        })}
    {@attach (element) => on(element, "pointerleave", handlePointerLeave)}
    class={styles.treeRoot}
    role="tree"
    aria-label={props.ariaLabel}
    aria-multiselectable={props.isMultiple || undefined}
    onfocusin={handleFocusIn}
    onfocusout={() => {
        focusVisibleValue = undefined;
    }}
>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render tiers()}
        </PlacementBox>
    {:else}
        {@render tiers()}
    {/if}
</div>
