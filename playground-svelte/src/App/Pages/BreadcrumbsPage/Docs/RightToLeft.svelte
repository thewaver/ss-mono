<script lang="ts">
    import { Breadcrumbs, Button } from "@thewaver/ss-components-svelte";
    import type { Breadcrumb } from "@thewaver/ss-components-svelte";
    import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
    import {
        BREADCRUMBS_GAP,
        TRAIL,
        labelOf,
    } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageBreadcrumbContent from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbContent.svelte";
    import PageBreadcrumbSeparator from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbSeparator.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";

    let depth = $state(TRAIL.length);

    const crumbs: Breadcrumb<CrumbValue>[] = $derived(TRAIL.slice(0, depth).map((entry) => ({ value: entry.value })));
</script>

<div dir={"rtl"}>
    <Breadcrumbs
        {crumbs}
        gap={BREADCRUMBS_GAP}
        ariaLabel={"Trail"}
        onSelect={(value) => {
            depth = TRAIL.findIndex((entry) => entry.value === value) + 1;
        }}
    >
        {#snippet renderCrumb(crumb, flags)}
            <PageBreadcrumbContent {flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
        {/snippet}

        {#snippet renderSeparator()}
            <PageBreadcrumbSeparator>{">"}</PageBreadcrumbSeparator>
        {/snippet}
    </Breadcrumbs>
</div>

<Button
    id={"rightToLeftReset"}
    isDisabled={depth === TRAIL.length}
    ariaLabel={"Restore the trail"}
    onClick={() => {
        depth = TRAIL.length;
    }}
>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
    {/snippet}
</Button>
