<script lang="ts">
    import { Button, SpotlightHint } from "@thewaver/ss-components-svelte";
    import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightHintExampleProps } from "../../Spotlights.types";

    const ANCHOR_COUNT = 2;
    const ANCHOR_INDICES = Array.from({ length: ANCHOR_COUNT }, (_unused, index) => index);

    type Props = SpotlightHintExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    let anchorRefs = $state<(HTMLElement | undefined)[]>(ANCHOR_INDICES.map(() => undefined));
</script>

<div class={styles.root}>
    <PageMeasureBox width={styles.HINT_BOX_WIDTH} height={styles.HINT_BOX_HEIGHT}>
        {#each ANCHOR_INDICES as index (index)}
            {#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
                <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
                    {index === 0 ? "Slides across" : "Slides down"}
                </PageTooltipContent>
            {/snippet}

            <div bind:this={anchorRefs[index]} class={index === 0 ? styles.anchorSlidingH : styles.anchorSlidingV}>
                <Button
                    tooltipDefs={{
                        placement: { x: "center", y: "top-out" },
                        offset: { x: 0, y: 10 },
                        renderContent: tooltip,
                    }}
                    onClick={async () => {
                        props.onIndexChange(index);
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
        elementRef={anchorRefs[props.index] ?? undefined}
        padding={PADDING}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
    />
</div>
