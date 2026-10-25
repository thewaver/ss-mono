<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { Part } from "../TablePageSvelte.types";

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);
    let widths = $state.raw<Record<string, number>>({});

    const columns = createPartColumns({ isResizable: true });
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        bind:widths
        ariaLabel={"Parts with resizable columns"}
    >
        {#snippet renderResizer(renderProps)}
            <PageTableResizer {renderProps} />
        {/snippet}
    </Table>
</div>
