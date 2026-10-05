<script lang="ts">
    import { LightCatcher, Range } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

    import PageMeasureBox from "../../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageRangeContent from "../../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { LightCatcherExampleProps } from "../LightCatcherPageSvelte.types";

    const LAMPS = [1, 2, 3, 4, 5];
    const PERCENT = 100;
    const SLIDER_STEP = 1;
    const SLIDER_LENGTH = 360;
    const STARTING_PERCENT = 20;
    const MIDDLE = 0.5;

    type Props = LightCatcherExampleProps;

    let props: Props = $props();

    let row = $state<HTMLDivElement>();
    let percent = $state(STARTING_PERCENT);

    const pointSource = $derived({ ratio: { x: percent / PERCENT, y: MIDDLE }, element: row ?? undefined });
</script>

<div class={styles.placedStage}>
    <PageMeasureBox isFilling>
        <div bind:this={row} class={styles.placedRow}>
            {#each LAMPS as lamp (lamp)}
                <div class={styles.lampSlot}>
                    <LightCatcher
                        isDisabled={props.isDisabled}
                        activeRangePx={props.activeRangePx}
                        smoothingMs={props.smoothingMs}
                        lightRangePx={props.lightRangePx}
                        maxBrightness={props.maxBrightness}
                        restingBrightness={props.restingBrightness}
                        maxLightness={props.maxLightness}
                        restingLightness={props.restingLightness}
                        {pointSource}
                    >
                        <div class={styles.lamp}>{lamp}</div>
                    </LightCatcher>
                </div>
            {/each}
        </div>
    </PageMeasureBox>

    <div class={styles.slider}>
        <Range
            id={"placedLightSlider"}
            sizing={"fill"}
            ariaLabel={"Where the light is across the row"}
            min={0}
            max={PERCENT}
            step={SLIDER_STEP}
            bind:value={percent}
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={SLIDER_LENGTH} />
            {/snippet}
        </Range>
    </div>
</div>
