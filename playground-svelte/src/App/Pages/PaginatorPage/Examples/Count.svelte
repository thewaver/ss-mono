<script lang="ts">
    import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-svelte";
    import type { PaginatorStep } from "@thewaver/ss-components-svelte";
    import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PagePaginatorCount from "../../../StyledComponents/PaginatorContent/PagePaginatorCount.svelte";
    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";
    import type { PaginatorExampleProps } from "../PaginatorPageSvelte.types";

    const PAGINATOR_GAP = 5;

    const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

    type Props = PaginatorExampleProps;

    let props: Props = $props();

    const pageCount = $derived(PaginatorUtils.computePageCount(props.itemCount, props.pageSize));
</script>

<PagePaginatorDemo>
    <PaginatorRoot
        page={props.page}
        itemCount={props.itemCount}
        pageSize={props.pageSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Results, counted"}
        onPageChange={props.onPageChange}
    >
        <PaginatorSteps steps={COUNT_STEPS} gap={PAGINATOR_GAP} computeStepLabel={computePaginatorStepLabel}>
            {#snippet renderStep(_step, renderProps)}
                <PagePaginatorStep {renderProps} />
            {/snippet}

            <PagePaginatorCount page={props.page} {pageCount} />
        </PaginatorSteps>
    </PaginatorRoot>

    <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
</PagePaginatorDemo>
