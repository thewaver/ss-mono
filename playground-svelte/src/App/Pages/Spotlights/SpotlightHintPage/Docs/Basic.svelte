<script lang="ts">
    import { Button, SpotlightHint } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsSvelte.types";

    const ANCHORS = [
        { id: "hintAcross", tooltip: "Slides across" },
        { id: "hintDown", tooltip: "Slides down" },
    ];

    type Props = SpotlightBasicDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
    let index = $state(0);

    let anchorRefs = $state<(HTMLElement | undefined)[]>(ANCHORS.map(() => undefined));
</script>

<div class={styles.root}>
    <PageMeasureBox width={styles.HINT_BOX_WIDTH} height={styles.HINT_BOX_HEIGHT}>
        {#each ANCHORS as anchor, anchorIndex (anchor.id)}
            {#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
                <PageTooltipContent {visibilityTarget} {transitionDurationMs}>{anchor.tooltip}</PageTooltipContent>
            {/snippet}

            <div
                bind:this={anchorRefs[anchorIndex]}
                class={anchorIndex === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}
            >
                <Button
                    id={anchor.id}
                    tooltipDefs={{
                        placement: { x: "center", y: "top_out" },
                        offset: { x: 0, y: 10 },
                        renderContent: tooltip,
                    }}
                    onClick={() => {
                        index = anchorIndex;
                        visibility = !visibility;
                    }}
                >
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Highlight Me</PageButtonContent>
                    {/snippet}
                </Button>
            </div>
        {/each}
    </PageMeasureBox>

    <SpotlightHint
        elementRef={anchorRefs[index] ?? undefined}
        padding={props.padding}
        transitionDurationMs={props.transitionDurationMs}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
    />
</div>
