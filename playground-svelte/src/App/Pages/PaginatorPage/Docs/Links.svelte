<script lang="ts">
    import { Paginator } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        FIRST_PAGE,
        ITEM_COUNT,
        PAGE_SIZE,
        PAGINATOR_GAP,
    } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.svelte";
    import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";
    import type { PaginatorLinksDocsExampleProps } from "../PaginatorPageSvelte.types";
    import CustomPaginatorLink from "./CustomPaginatorLink.svelte";

    type Props = PaginatorLinksDocsExampleProps;

    let props: Props = $props();

    let page = $state(FIRST_PAGE);
</script>

<PagePaginatorDemo>
    <Paginator
        {page}
        itemCount={ITEM_COUNT}
        pageSize={PAGE_SIZE}
        gap={PAGINATOR_GAP}
        ariaLabel={"Linked results"}
        computePageLabel={computePaginatorPageLabel}
        computeStepLabel={computePaginatorStepLabel}
        computeHref={(target) => `#paginator-page-${target}`}
        linkComponent={props.hasLinkComponent ? CustomPaginatorLink : undefined}
        onPageChange={(next) => {
            page = next;
        }}
    >
        {#snippet renderPage(_entry, renderProps)}
            <PagePaginatorPage {renderProps} />
        {/snippet}

        {#snippet renderGap(entry)}
            <PagePaginatorGap {entry} />
        {/snippet}

        {#snippet renderStep(_step, renderProps)}
            <PagePaginatorStep {renderProps} />
        {/snippet}
    </Paginator>

    <PagePaginatorPanel {page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
</PagePaginatorDemo>
