<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        FlattenerUtils,
        type InteractionFlags,
        type TreeNodeRenderProps,
        TreeUtils,
        TypeaheadUtils,
        TreeStyles as styles,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { TypeaheadSvelteUtils } from "../../Abstracts/Typeahead/TypeaheadSvelte.utils.svelte.js";
    import { VirtualizerSvelteUtils } from "../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { createHeldValue } from "../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { TreeProps, TreeRow } from "./Tree.types.js";
    import TreeNodeItem from "./TreeNodeItem.svelte";

    const EMPTY_PINNED_ROWS: number[] = [];

    let { value = $bindable(), expanded = $bindable([]), ...props }: TreeProps<T> = $props();

    const treeId = $props.id();

    const [getValue, setValue] = createHeldValue([
        () => value,
        (next) => {
            value = next;
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

    const rows = $derived(TreeUtils.getVisibleRows(props.nodes, (entry) => getExpanded()?.includes(entry) ?? false));
    const flatRows = $derived(FlattenerUtils.getFlatRows(rows));
    const navigableRows = $derived(flatRows.filter(TreeUtils.computeIsNavigable));

    const isVirtualized = $derived(props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined);
    const rovingRow = $derived(TreeUtils.computeRovingRow(navigableRows, focusedValue, getValue()));

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

    const expand = (row: TreeRow<T>) => writeExpanded(TreeUtils.expand(getExpanded() ?? [], row.node));

    const collapse = (row: TreeRow<T>) => writeExpanded(TreeUtils.collapse(getExpanded() ?? [], row.node));

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

    const activate = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        select(row.node.value);

        if (TreeUtils.getIsBranch(row.node)) toggle(row);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (navigableRows.length < 1) return;

        const current = findRowById(document.activeElement?.id) ?? rovingRow;

        if (!current) return;

        const action = TreeUtils.computeKeyAction(e.key, current, {
            flatRows,
            navigable: navigableRows,
            direction: direction(),
            pushQuery: () => typeahead.push(e),
            computeRowText,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "expandSiblings") expandSiblings(action.row);
        if (action.kind === "focus") focusRow(action.row);
        if (action.kind === "expand") expand(action.row);
        if (action.kind === "collapse") collapse(action.row);
        if (action.kind === "activate") activate(action.row);
        if (action.kind === "click") document.getElementById(getRowId(action.row))?.click();
    };

    const handleFocusIn = (e: FocusEvent) => {
        lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;
    };

    const hasPendingPaint = (row: TreeRow<T>) =>
        TreeUtils.computeIsPending(row) && props.renderPendingChildren !== undefined;
</script>

{#snippet renderRow(row: TreeRow<T>)}
    {@const placement = layout?.placements[row.index]}
    {#snippet element()}
        <InteractionWrapper
            sizing="fill"
            isDisabled={row.node.isDisabled ?? false}
            isReachableWhenDisabled={row.node.isReachableWhenDisabled ?? false}
            isTabbable={row.node.value === rovingRow?.node.value}
            tooltipDefs={row.node.tooltipDefs}
            extraFlags={{
                isBranch: TreeUtils.getIsBranch(row.node),
                isExpanded: row.isExpanded,
                isPending: TreeUtils.computeIsPending(row),
                isSelected: row.node.value === getValue(),
                depth: row.depth,
            }}
        >
            {#snippet renderControl(attachElement, renderProps)}
                {#snippet nodeContent(nodeFlags: InteractionFlags<TreeNodeRenderProps>)}
                    {@render props.renderNode(row.node, nodeFlags)}
                {/snippet}

                <TreeNodeItem
                    {attachElement}
                    id={getRowId(row)}
                    href={row.node.href}
                    level={row.depth + 1}
                    position={row.position + 1}
                    setSize={row.setSize}
                    flags={renderProps}
                    linkComponent={props.linkComponent}
                    renderContent={nodeContent}
                    onActivate={() => activate(row)}
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

{#snippet tiers()}
    {#if isVirtualized}
        <div bind:this={sizer} class={styles.treeSizer} style:height={`${rowWindow.getTotalSize()}px`}>
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
        </div>
    {:else}
        {@render renderRows(rows)}
    {/if}
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    role="tree"
    aria-label={props.ariaLabel}
    onfocusin={handleFocusIn}
>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render tiers()}
        </PlacementBox>
    {:else}
        {@render tiers()}
    {/if}
</div>
