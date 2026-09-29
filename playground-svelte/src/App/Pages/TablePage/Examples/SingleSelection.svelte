<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { TableExampleProps } from "../TablePage.types";

    type Props = TableExampleProps;

    let { sort = $bindable(), selection = $bindable() }: Props = $props();

    const columns = createPartColumns({ isResizable: false });
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        selectionMode={"single"}
        ariaLabel={"Parts, one at a time"}
    />
</div>
