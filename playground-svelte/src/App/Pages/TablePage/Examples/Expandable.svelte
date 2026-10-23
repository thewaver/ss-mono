<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableDetailContent from "../../../StyledComponents/TableContent/PageTableDetailContent.svelte";
    import { PARTS, createPartColumns, formatPrice } from "../TablePage.const.svelte";
    import type { Part, TableExampleProps } from "../TablePage.types";

    const ESTIMATED_ROW_HEIGHT = 33;

    type Props = TableExampleProps & { expanded: Part[] };

    let { sort = $bindable(), selection = $bindable(), expanded = $bindable() }: Props = $props();

    const columns = createPartColumns({ isExpandable: true });
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        bind:expanded
        ariaLabel={"Parts with details"}
        computeIsExpandable={(part) => part.stock > 0}
        computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
    >
        {#snippet renderDetail(part, renderProps)}
            <PageTableDetailContent {renderProps}>
                {`${part.name}, filed under ${part.category}: ${part.stock.toLocaleString("en-GB")} on the shelf at ${formatPrice(part.pricePence)} each, ${formatPrice(part.stock * part.pricePence)} held in all.`}
            </PageTableDetailContent>
        {/snippet}
    </Table>
</div>
