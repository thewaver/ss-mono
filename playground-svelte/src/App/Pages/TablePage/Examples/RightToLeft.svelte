<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import { TABLE_ANNOUNCEMENTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableMarker from "../../../StyledComponents/TableContent/PageTableMarker.svelte";
    import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { TableExampleProps } from "../TablePage.types";

    type Props = TableExampleProps & {
        widths: Record<string, number>;
        order: string[];
    };

    let {
        sort = $bindable(),
        selection = $bindable(),
        widths = $bindable(),
        order = $bindable(),
    }: Props = $props();

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
