<script lang="ts">
    import type { TableSort } from "@thewaver/ss-components-svelte";
    import { Table } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.css";

    import { PARTS, createPartColumns } from "../TablePage.const.svelte";
    import type { Part, TableBasicDocsExampleProps } from "../TablePageSvelte.types";

    type Props = TableBasicDocsExampleProps;

    let props: Props = $props();

    let sort = $state<TableSort>();
    let selection = $state.raw<Part[]>([]);

    const columns = createPartColumns({});
</script>

<div class={styles.tableFrameShort}>
    <Table
        {columns}
        rows={PARTS}
        bind:sort
        bind:selection
        selectionMode={props.selectionMode}
        isDisabled={props.isDisabled}
        ariaLabel={"Parts"}
    />
</div>
