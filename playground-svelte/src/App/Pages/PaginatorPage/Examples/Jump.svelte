<script lang="ts">
    import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { COUNT_FIELD_WIDTH, FIRST_PAGE } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.svelte";
    import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";
    import type { PaginatorExampleProps } from "../PaginatorPageSvelte.types";

    const PAGINATOR_GAP = 5;

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
        ariaLabel={"Results with a page field"}
        onPageChange={props.onPageChange}
    >
        <div class={styles.jumpRow}>
            <PaginatorSteps gap={PAGINATOR_GAP} computeStepLabel={computePaginatorStepLabel}>
                {#snippet renderStep(_step, renderProps)}
                    <PagePaginatorStep {renderProps} />
                {/snippet}

                <PaginatorPages
                    siblingCount={props.siblingCount}
                    boundaryCount={props.boundaryCount}
                    gap={PAGINATOR_GAP}
                    computePageLabel={computePaginatorPageLabel}
                >
                    {#snippet renderPage(_entry, renderProps)}
                        <PagePaginatorPage {renderProps} />
                    {/snippet}

                    {#snippet renderGap(entry)}
                        <PagePaginatorGap {entry} />
                    {/snippet}
                </PaginatorPages>
            </PaginatorSteps>

            <Label>
                <PageLabelCaption>Go to page</PageLabelCaption>

                <PageNumberField
                    value={props.page}
                    min={FIRST_PAGE}
                    max={Math.max(pageCount, FIRST_PAGE)}
                    width={COUNT_FIELD_WIDTH}
                    isDisabled={props.isDisabled || pageCount < FIRST_PAGE}
                    onInput={props.onPageChange}
                />
            </Label>
        </div>
    </PaginatorRoot>

    <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
</PagePaginatorDemo>
