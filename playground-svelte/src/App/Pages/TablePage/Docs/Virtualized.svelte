<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import { createPartColumns, createStressParts } from "../TablePage.const.svelte";
    import type { Part, TableVirtualizedDocsExampleProps } from "../TablePageSvelte.types";

    const ESTIMATED_ROW_HEIGHT = 29;

    type Props = TableVirtualizedDocsExampleProps;

    let props: Props = $props();

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);

    const columns = createPartColumns({});

    const rows = $derived(createStressParts(props.count));
</script>

<div class={styles.tableFrameTall}>
    <Table
        {columns}
        {rows}
        bind:sort
        bind:selection
        ariaLabel={"Every part"}
        computeEstimatedRowHeight={() => ESTIMATED_ROW_HEIGHT}
    />
</div>
