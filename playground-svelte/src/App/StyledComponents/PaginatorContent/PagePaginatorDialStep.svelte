<script lang="ts">
    import { STEP_GLYPHS } from "./PagePaginatorStep.svelte";
    import PagePaginatorWedge from "./PagePaginatorWedge.svelte";
    import type { PaginatorStepContentProps } from "./PaginatorContent.types";

    let props: PaginatorStepContentProps = $props();
</script>

{#if props.renderProps.placement}
    <PagePaginatorWedge
        placement={props.renderProps.placement}
        isHovered={props.renderProps.isHovered ?? false}
        isActive={props.renderProps.isActive ?? false}
        isDisabled={props.renderProps.isDisabled ?? false}
    >
        {STEP_GLYPHS[props.renderProps.step]}
    </PagePaginatorWedge>
{/if}
