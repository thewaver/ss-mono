<script lang="ts">
    import { Flipbook } from "@thewaver/ss-components-svelte";
    import type { FlipbookControls } from "@thewaver/ss-components-svelte";
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

    const BOOK_GAP = 10;
    const FIRST_PAGE = 0;

    type Props = FlipbookExampleProps;

    let { index = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.stage}>
    <div class={styles.book}>
        <Flipbook
            pages={FLIPBOOK_PAGES}
            bind:index
            transitionDurationMs={props.transitionDurationMs}
            gap={BOOK_GAP}
            ariaLabel={"A book of hinges"}
            computePageLabel={computeFlipbookPageLabel}
            computeSpreadAnnouncement={computeFlipbookSpreadAnnouncement}
            computeStepLabel={computeFlipbookStepLabel}
            renderControls={renderBar}
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

            {#snippet renderStep(step, renderProps)}
                <PageControlButtonContent flags={renderProps} glyph={CONTROL_GLYPHS[step]} />
            {/snippet}
        </Flipbook>
    </div>
</div>

{#snippet renderBar(controls: FlipbookControls)}
    <div class={styles.controls}>
        {@render controls.renderStep("previous")}
        {@render controls.renderStep("next")}
    </div>
{/snippet}
