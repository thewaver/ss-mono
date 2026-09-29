<script lang="ts">
    import PagePaginatorWedge from "./PagePaginatorWedge.svelte";
    import type { PaginatorDialGapContentProps } from "./PaginatorContent.types";

    const GAP_MARK = "…";

    let props: PaginatorDialGapContentProps = $props();
</script>

{#if props.placement}
    <PagePaginatorWedge placement={props.placement} isDisabled={true}>
        <span title={`Pages ${props.entry.from} to ${props.entry.to}`}>{GAP_MARK}</span>
    </PagePaginatorWedge>
{/if}
