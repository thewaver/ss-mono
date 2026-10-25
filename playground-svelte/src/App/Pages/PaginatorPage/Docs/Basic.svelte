<script lang="ts">
    import { Paginator } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIRST_PAGE, PAGINATOR_GAP } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.svelte";
    import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";
    import type { PaginatorBasicDocsExampleProps } from "../PaginatorPageSvelte.types";

    type Props = PaginatorBasicDocsExampleProps;

    let props: Props = $props();

    let page = $state(FIRST_PAGE);
</script>

<PagePaginatorDemo>
    <Paginator
        {page}
        itemCount={props.itemCount}
        pageSize={props.pageSize}
        siblingCount={props.siblingCount}
        boundaryCount={props.boundaryCount}
        isDisabled={props.isDisabled}
        gap={PAGINATOR_GAP}
        ariaLabel={"Results"}
        computePageLabel={computePaginatorPageLabel}
        computeStepLabel={computePaginatorStepLabel}
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

    <PagePaginatorPanel {page} itemCount={props.itemCount} pageSize={props.pageSize} />
</PagePaginatorDemo>
