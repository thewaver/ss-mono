<script lang="ts">
    import { Breadcrumbs } from "@thewaver/ss-components-svelte";
    import { BREADCRUMBS_GAP, labelOf } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

    import PageBreadcrumbContent from "../../../StyledComponents/BreadcrumbContent/PageBreadcrumbContent.svelte";
    import type { BreadcrumbsExampleProps } from "../BreadcrumbsPage.types";

    type Props = BreadcrumbsExampleProps;

    let props: Props = $props();
</script>

<Breadcrumbs crumbs={props.crumbs} gap={BREADCRUMBS_GAP} ariaLabel={"Trail without separators"}>
    {#snippet renderCrumb(crumb, flags)}
        <PageBreadcrumbContent {flags}>{labelOf(crumb.value)}</PageBreadcrumbContent>
    {/snippet}
</Breadcrumbs>
