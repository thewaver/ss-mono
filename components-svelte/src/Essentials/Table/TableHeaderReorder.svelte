<script lang="ts">
    import { TableStyles as styles } from "@thewaver/ss-components";

    import { getTableHeaderContext } from "./Table.context.js";
    import type { TableHeaderReorderProps } from "./Table.types.js";

    let props: TableHeaderReorderProps = $props();

    const context = getTableHeaderContext("TableHeaderReorder");

    context?.registerReorder();
</script>

{#if context?.getRenderProps().isReorderable}
    <button
        type="button"
        class={styles.tableReorderGrip}
        tabindex="-1"
        aria-hidden="true"
        onpointerdown={(e) => e.stopPropagation()}
        onclick={(e) => {
            e.stopPropagation();

            context.pickUp();
        }}
    >
        {@render props.renderContent(context.getRenderProps())}
    </button>
{/if}
