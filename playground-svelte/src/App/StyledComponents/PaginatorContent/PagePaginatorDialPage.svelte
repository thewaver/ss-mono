<script lang="ts">
    import PagePaginatorWedge from "./PagePaginatorWedge.svelte";
    import type { PaginatorPageContentProps } from "./PaginatorContent.types";

    let props: PaginatorPageContentProps = $props();
</script>

{#if props.renderProps.placement}
    <PagePaginatorWedge
        placement={props.renderProps.placement}
        isCurrent={props.renderProps.isCurrent}
        isHovered={props.renderProps.isHovered ?? false}
        isActive={props.renderProps.isActive ?? false}
        isDisabled={props.renderProps.isDisabled ?? false}
    >
        {props.renderProps.page}
    </PagePaginatorWedge>
{/if}
