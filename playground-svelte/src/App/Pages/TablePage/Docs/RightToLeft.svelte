<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.svelte";
    import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { Part } from "../TablePageSvelte.types";

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);
    let widths = $state.raw<Record<string, number>>({});
    let order = $state.raw<string[]>([]);

    const columns = createPartColumns({ isResizable: true, isReorderable: true });
</script>

<div dir={"rtl"} class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        bind:widths
        bind:order
        ariaLabel={"Parts in a right-to-left box"}
        announcements={TABLE_ANNOUNCEMENTS}
    >
        {#snippet renderResizer(renderProps)}
            <PageTableResizer {renderProps} />
        {/snippet}

        {#snippet renderMarker()}
            <PageTableMarker />
        {/snippet}
    </Table>
</div>
