<script lang="ts">
    import { Paginator, PlacementLayoutUtils } from "@thewaver/ss-components-svelte";
    import type { BandDefs, PaginatorStep } from "@thewaver/ss-components-svelte";
    import {
        computePaginatorPageLabel,
        computePaginatorStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

    import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.svelte";
    import PagePaginatorDialGap from "../../../StyledComponents/PaginatorContent/PagePaginatorDialGap.svelte";
    import PagePaginatorDialPage from "../../../StyledComponents/PaginatorContent/PagePaginatorDialPage.svelte";
    import PagePaginatorDialStep from "../../../StyledComponents/PaginatorContent/PagePaginatorDialStep.svelte";
    import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.svelte";
    import type { PaginatorExampleProps } from "../PaginatorPage.types";

    const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

    const DIAL_DEFS: BandDefs = { spreadDegrees: 180, facingDegrees: 0, holeRatio: 0.5, wedgeGapDegrees: 2 };

    const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

    type Props = PaginatorExampleProps;

    let props: Props = $props();
</script>

<PagePaginatorDemo>
    <div class={styles.halfDial}>
        <div class={styles.halfDialRing}>
            <Paginator
                page={props.page}
                pageCount={props.pageCount}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                ariaLabel={"Results round a dial"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                steps={DIAL_STEPS}
                computeLayout={DIAL_LAYOUT}
                onPageChange={props.onPageChange}
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
            <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
        </div>
    </div>
</PagePaginatorDemo>
