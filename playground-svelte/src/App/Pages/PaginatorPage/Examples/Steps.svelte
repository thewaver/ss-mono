<script lang="ts">
    import { Paginator } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.svelte";
    import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";
    import type { PaginatorExampleProps } from "../PaginatorPage.types";

    const PAGINATOR_GAP = 5;

    type Props = PaginatorExampleProps;

    let props: Props = $props();
</script>

<PagePaginatorDemo>
    <Paginator
        page={props.page}
        pageCount={props.pageCount}
        siblingCount={props.siblingCount}
        boundaryCount={props.boundaryCount}
        isDisabled={props.isDisabled}
        gap={PAGINATOR_GAP}
        ariaLabel={"Results"}
        computePageLabel={computePaginatorPageLabel}
        computeStepLabel={computePaginatorStepLabel}
        onPageChange={props.onPageChange}
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

    <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
</PagePaginatorDemo>
