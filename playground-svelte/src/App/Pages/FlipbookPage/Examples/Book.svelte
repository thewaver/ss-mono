<script lang="ts">
    import { Button, Flipbook } from "@thewaver/ss-components-svelte";
    import type { FlipbookControls, FlipbookStep } from "@thewaver/ss-components-svelte";
    import {
        computeFlipbookPageLabel,
        computeFlipbookSpreadAnnouncement,
        computeFlipbookStepLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { FlipbookExampleProps } from "../FlipbookPage.types";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";

    const FIRST_PAGE = 0;

    const STEPS: FlipbookStep[] = ["previous", "next"];

    type Props = FlipbookExampleProps;

    let { index = $bindable(), ...props }: Props = $props();

    let controls = $state.raw<FlipbookControls>();
</script>

<div class={styles.stage}>
    <div class={styles.book}>
        <PageMeasureBox isFilling height={styles.BOOK_HEIGHT}>
            <Flipbook
                pages={FLIPBOOK_PAGES}
                bind:index
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"A book of hinges"}
                computePageLabel={computeFlipbookPageLabel}
                computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
                onMount={(next) => {
                    controls = next;
                }}
            >
                {#snippet renderPage(page, state)}
                    <div
                        class={[
                            styles.page,
                            state.side === "left" ? styles.pageLeft : styles.pageRight,
                            (state.index === FIRST_PAGE || state.index === state.count - 1) && styles.cover,
                        ]}
                    >
                        <div class={styles.pageHeading}>{page.heading}</div>
                        <div class={styles.pageText}>{page.text}</div>
                        <div class={styles.pageNumber}>{state.index + 1}</div>
                    </div>
                {/snippet}
            </Flipbook>
        </PageMeasureBox>
    </div>

    {#if controls}
        {@const bookControls = controls}
        <div class={styles.controls}>
            {#each STEPS as step (step)}
                <Button
                    ariaLabel={computeFlipbookStepLabel(step)}
                    isDisabled={!bookControls.getCanTurn(step)}
                    onClick={() => {
                        bookControls.turn(step);
                    }}
                >
                    {#snippet renderContent(flags)}
                        <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS[step]} />
                    {/snippet}
                </Button>
            {/each}
        </div>
    {/if}
</div>
