<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableDetailContent from "../../../StyledComponents/TableContent/PageTableDetailContent.svelte";
    import { PARTS, createPartColumns, formatPrice } from "../TablePage.const.svelte";
    import type { Part } from "../TablePageSvelte.types";

    const ESTIMATED_ROW_HEIGHT = 33;

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);
    let expanded = $state.raw<Part[]>([]);

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
