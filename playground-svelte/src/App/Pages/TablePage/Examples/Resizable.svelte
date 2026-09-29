<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import PageTableResizer from "../../../StyledComponents/TableContent/PageTableResizer.svelte";
    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { TableExampleProps } from "../TablePage.types";

    type Props = TableExampleProps & {
        widths: Record<string, number>;
    };

    let { sort = $bindable(), selection = $bindable(), widths = $bindable() }: Props = $props();

    const columns = createPartColumns({ isResizable: true });
</script>

<div class={styles.tableFrameShort}>
    <Table {columns} rows={PARTS} bind:sort bind:selection bind:widths ariaLabel={"Parts with resizable columns"}>
        {#snippet renderResizer(renderProps)}
            <PageTableResizer {renderProps} />
        {/snippet}
    </Table>
</div>
