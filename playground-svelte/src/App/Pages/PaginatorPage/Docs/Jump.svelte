<script lang="ts">
    import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import {
        COUNT_FIELD_WIDTH,
        FIRST_PAGE,
        ITEM_COUNT,
        PAGE_SIZE,
        PAGINATOR_GAP,
    } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.svelte";
    import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.svelte";

    const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

    let page = $state(FIRST_PAGE);
</script>

<PagePaginatorDemo>
    <PaginatorRoot
        {page}
        itemCount={ITEM_COUNT}
        pageSize={PAGE_SIZE}
        ariaLabel={"Results with a page field"}
        onPageChange={(next) => {
            page = next;
        }}
    >
        <div class={styles.jumpRow}>
            <PaginatorSteps gap={PAGINATOR_GAP} computeStepLabel={computePaginatorStepLabel}>
                {#snippet renderStep(_step, renderProps)}
                    <PagePaginatorStep {renderProps} />
                {/snippet}

                <PaginatorPages gap={PAGINATOR_GAP} computePageLabel={computePaginatorPageLabel}>
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
                    id={"goToPage"}
                    value={page}
                    min={FIRST_PAGE}
                    max={PAGE_COUNT}
                    width={COUNT_FIELD_WIDTH}
                    onInput={(next) => {
                        page = next;
                    }}
                />
            </Label>
        </div>
    </PaginatorRoot>

    <PagePaginatorPanel {page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
</PagePaginatorDemo>
