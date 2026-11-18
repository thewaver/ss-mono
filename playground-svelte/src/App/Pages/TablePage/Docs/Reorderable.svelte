<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { Part } from "../TablePageSvelte.types";
    import { PARTS_REORDERABLE_COLUMNS_LABEL } from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);
    let order = $state.raw<string[]>([]);

    const columns = createPartColumns({ isReorderable: true });
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        bind:order
        ariaLabel={PARTS_REORDERABLE_COLUMNS_LABEL}
        announcements={TABLE_ANNOUNCEMENTS}
    >
        {#snippet renderMarker()}
            <PageTableMarker />
        {/snippet}
    </Table>
</div>
