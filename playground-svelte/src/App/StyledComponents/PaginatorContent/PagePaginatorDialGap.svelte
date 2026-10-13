<script lang="ts">
    import PagePaginatorWedge from "./PagePaginatorWedge.svelte";
    import type { PaginatorDialGapContentProps } from "./PaginatorContentSvelte.types";
    import { GAP_MARK } from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";

    let props: PaginatorDialGapContentProps = $props();
</script>

{#if props.placement}
    <PagePaginatorWedge placement={props.placement} isDisabled={true}>
        <span title={`Pages ${props.entry.from} to ${props.entry.to}`}>{GAP_MARK}</span>
    </PagePaginatorWedge>
{/if}
