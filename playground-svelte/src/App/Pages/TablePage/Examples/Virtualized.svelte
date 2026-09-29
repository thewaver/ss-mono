<script lang="ts">
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import { createPartColumns } from "../TablePage.const.svelte";
    import type { Part, TableExampleProps } from "../TablePage.types";

    const ESTIMATED_ROW_HEIGHT = 29;

    type Props = TableExampleProps & { rows: Part[] };

    let { sort = $bindable(), selection = $bindable(), ...props }: Props = $props();

    const columns = createPartColumns({ isResizable: false });
</script>

<div class={styles.tableFrameTall}>
    <Table
        {columns}
        rows={props.rows}
        bind:sort
        bind:selection
        ariaLabel={"Every part"}
        computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
    />
</div>
