<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { TableExampleProps } from "../TablePage.types";

    type Props = TableExampleProps & { order: string[] };

    let { sort = $bindable(), selection = $bindable(), order = $bindable() }: Props = $props();

    const columns = createPartColumns({ isReorderable: true });
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        bind:order
        ariaLabel={"Parts with reorderable columns"}
        announcements={TABLE_ANNOUNCEMENTS}
    >
        {#snippet renderMarker()}
            <PageTableMarker />
        {/snippet}
    </Table>
</div>
