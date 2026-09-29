<script lang="ts">
    import { TableStyles as styles } from "@thewaver/ss-components";

    import { getTableHeaderContext } from "./Table.context.js";
    import type { TableHeaderSortProps } from "./Table.types.js";

    let props: TableHeaderSortProps = $props();

    const context = getTableHeaderContext("TableHeaderSort");

    context?.registerSort();
</script>

{#if context?.getRenderProps().isSortable}
    <button
        type="button"
        class={styles.tableSortControl}
        tabindex="-1"
        aria-hidden="true"
        onpointerdown={(e) => e.stopPropagation()}
        onclick={(e) => {
            e.stopPropagation();

            context.sort();
        }}
    >
        {@render props.renderContent(context.getRenderProps())}
    </button>
{/if}
