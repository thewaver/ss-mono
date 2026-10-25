<script lang="ts">
    import { Paginator } from "@thewaver/ss-components-svelte";
    import type { PaginatorStep } from "@thewaver/ss-components-svelte";
    import { computePaginatorPageLabel, computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { DIAL_LAYOUT, FIRST_PAGE, ITEM_COUNT, PAGE_SIZE } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorDialGap from "../../../StyledComponents/PaginatorContent/PagePaginatorDialGap.svelte";
    import PagePaginatorDialPage from "../../../StyledComponents/PaginatorContent/PagePaginatorDialPage.svelte";
    import PagePaginatorDialStep from "../../../StyledComponents/PaginatorContent/PagePaginatorDialStep.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";

    const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

    let page = $state(FIRST_PAGE);
</script>

<PagePaginatorDemo>
    <div class={styles.halfDial}>
        <div class={styles.halfDialRing}>
            <Paginator
                {page}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                steps={DIAL_STEPS}
                computeLayout={DIAL_LAYOUT}
                ariaLabel={"Results round a dial"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                onPageChange={(next) => {
                    page = next;
                }}
            >
                {#snippet renderPage(_entry, renderProps)}
                    <PagePaginatorDialPage {renderProps} />
                {/snippet}

                {#snippet renderGap(entry, placement)}
                    <PagePaginatorDialGap {entry} {placement} />
                {/snippet}

                {#snippet renderStep(_step, renderProps)}
                    <PagePaginatorDialStep {renderProps} />
                {/snippet}
            </Paginator>
        </div>

        <div class={styles.halfDialPanel}>
            <PagePaginatorPanel {page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </div>
    </div>
</PagePaginatorDemo>
