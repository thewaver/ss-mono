<script lang="ts">
    import { TableHeaderReorder, TableHeaderSort } from "@thewaver/ss-components-svelte";

    import PageTableHeaderContent from "../../StyledComponents/TableContent/PageTableHeaderContent.svelte";
    import PageTableHeaderText from "../../StyledComponents/TableContent/PageTableHeaderText.svelte";
    import PageTableReorderGrip from "../../StyledComponents/TableContent/PageTableReorderGrip.svelte";
    import PageTableSortControl from "../../StyledComponents/TableContent/PageTableSortControl.svelte";
    import type { PageTableHeaderProps } from "./TableHeader.types";

    let props: PageTableHeaderProps = $props();
</script>

<PageTableHeaderContent renderProps={props.renderProps} align={props.align}>
    <TableHeaderReorder>
        {#snippet renderContent()}
            <PageTableReorderGrip />
        {/snippet}
    </TableHeaderReorder>

    <PageTableHeaderText>{@render props.children?.()}</PageTableHeaderText>

    <TableHeaderSort>
        {#snippet renderContent(renderProps)}
            <PageTableSortControl {renderProps} />
        {/snippet}
    </TableHeaderSort>
</PageTableHeaderContent>
