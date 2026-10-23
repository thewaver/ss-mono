<script lang="ts">
    import { TableStyles as styles } from "@thewaver/ss-components";

    import { getTableCellContext } from "./Table.context.js";
    import type { TableRowExpanderProps } from "./Table.types.js";

    let props: TableRowExpanderProps = $props();

    const context = getTableCellContext("TableRowExpander");

    context?.registerExpander();
</script>

{#if context?.getRenderProps().isExpandable}
    <button
        type="button"
        class={styles.tableRowExpander}
        tabindex="-1"
        aria-hidden="true"
        onclick={(e) => {
            e.stopPropagation();

            context.toggle();
        }}
    >
        {@render props.renderContent(context.getRenderProps())}
    </button>
{/if}
