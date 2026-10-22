<script lang="ts">
    import { ElementObserverSvelteUtils, Range } from "@thewaver/ss-components-svelte";
    import {
        CIRCLING_MAX_DEGREES,
        CIRCLING_MIN_DEGREES,
        CIRCLING_STEP_DEGREES,
    } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
    import { computeCirclingAim } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import { createArrowBed } from "../ArrowBed.utils.svelte";
    import ArrowBedKnobs from "../ArrowBedKnobs.svelte";
    import ArrowBedTooltip from "../ArrowBedTooltip.svelte";

    type Props = {
        degrees: number;
    };

    let { degrees = $bindable() }: Props = $props();

    const arrowBed = createArrowBed();

    let sliderRef = $state<HTMLDivElement>();

    const getSliderSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => sliderRef);
</script>

<div class={styles.circlingStage}>
    <ArrowBedTooltip {arrowBed} computeAim={(size) => computeCirclingAim(degrees, size)} label={`${degrees}°`} />

    <div bind:this={sliderRef} class={styles.circlingSlider}>
        <Range
            bind:value={degrees}
            min={CIRCLING_MIN_DEGREES}
            max={CIRCLING_MAX_DEGREES}
            step={CIRCLING_STEP_DEGREES}
            sizing={"fill"}
            thumbSize={RANGE_THUMB_SIZE}
            ariaLabel={"Where the arrow sits round the tooltip"}
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={getSliderSize().width} />
            {/snippet}
        </Range>
    </div>
</div>

<ArrowBedKnobs {arrowBed} />
