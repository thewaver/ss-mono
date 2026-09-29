<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import { TableUtils, TableStyles as styles } from "@thewaver/ss-components";

    import { setTableHeaderContext } from "./Table.context.js";
    import type { TableHeaderCellProps } from "./Table.types.js";

    const FIRST_ARIA_INDEX = TableUtils.FIRST_ARIA_INDEX;

    let props: TableHeaderCellProps<T> = $props();

    let hasSortControl = false;
    let hasReorderGrip = false;

    setTableHeaderContext({
        getRenderProps: () => props.renderProps,
        sort: () => props.context.sort(),
        pickUp: () => props.context.pickUp(),
        registerSort: () => {
            hasSortControl = true;
        },
        registerReorder: () => {
            hasReorderGrip = true;
        },
    });

    $effect(() =>
        untrack(() =>
            TableUtils.warnIfHeaderControlsMissing(props.column, {
                isReorderable: props.isReorderable,
                hasSortControl,
                hasReorderGrip,
            }),
        ),
    );
</script>

{#snippet marker(columnIndex: number)}
    {#if props.landingCol === columnIndex}
        <div class={columnIndex < props.columnCount ? styles.tableMarkerBefore : styles.tableMarkerAfter}>
            {@render props.renderMarker?.()}
        </div>
    {/if}
{/snippet}

<div
    {@attach (element) => on(element, "click", props.onClick)}
    id={props.cellId}
    class={styles.tableCell}
    role="columnheader"
    aria-colindex={props.columnIndex + FIRST_ARIA_INDEX}
    aria-sort={TableUtils.computeAriaSort(props.column, props.renderProps.sortDirection)}
    aria-disabled={props.isDisabled || undefined}
    aria-describedby={props.isReorderable ? props.hintId : undefined}
    tabindex={props.isRoving ? 0 : -1}
    onpointerdown={props.onPointerDown}
    onpointerenter={props.onPointerEnter}
    onpointerleave={props.onPointerLeave}
>
    {@render props.column.renderHeader(props.renderProps)}

    {#if props.renderProps.isResizable}
        {@render props.renderResizer(props.column, props.columnIndex, props.renderProps)}
    {/if}

    {@render marker(props.columnIndex)}

    {#if props.isLast}
        {@render marker(props.columnCount)}
    {/if}
</div>
