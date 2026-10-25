<script lang="ts">
    import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-svelte";
    import type { PaginatorStep } from "@thewaver/ss-components-svelte";
    import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        FIRST_PAGE,
        ITEM_COUNT,
        PAGE_SIZE,
        PAGINATOR_GAP,
    } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

    import PagePaginatorCount from "../../../StyledComponents/PaginatorContent/PagePaginatorCount.svelte";
    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";

    const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

    const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

    let page = $state(FIRST_PAGE);
</script>

<PagePaginatorDemo>
    <PaginatorRoot
        {page}
        itemCount={ITEM_COUNT}
        pageSize={PAGE_SIZE}
        ariaLabel={"Results, counted"}
        onPageChange={(next) => {
            page = next;
        }}
    >
        <PaginatorSteps steps={COUNT_STEPS} gap={PAGINATOR_GAP} computeStepLabel={computePaginatorStepLabel}>
            {#snippet renderStep(_step, renderProps)}
                <PagePaginatorStep {renderProps} />
            {/snippet}

            <PagePaginatorCount {page} pageCount={PAGE_COUNT} />
        </PaginatorSteps>
    </PaginatorRoot>

    <PagePaginatorPanel {page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
</PagePaginatorDemo>
