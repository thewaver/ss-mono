<script lang="ts">
    import { Button, ElementObserverSvelteUtils, Range } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

    const PERCENT = 100;
    const SLIDER_STEP = 1;
    const PLAY_ICON_PATH = "M7 4 L20 12 L7 20 Z";
    const PAUSE_ICON_PATH = "M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z";

    let { playback = $bindable(), progress = $bindable(), ...props }: PagePlaybackScrubberProps = $props();

    let sliderSlotRef = $state<HTMLDivElement>();

    const getSliderSlotSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => sliderSlotRef);
</script>

<div class={styles.playbackRow}>
    <Button
        id={`${props.id}Playback`}
        ariaLabel={playback ? "Pause" : "Play"}
        onClick={() => {
            playback = !playback;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>
                <svg class={styles.playbackIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d={playback ? PAUSE_ICON_PATH : PLAY_ICON_PATH} />
                </svg>
            </PageButtonContent>
        {/snippet}
    </Button>

    <div bind:this={sliderSlotRef} class={styles.sliderSlot}>
        <Range
            id={`${props.id}Progress`}
            sizing={"fill"}
            ariaLabel={props.ariaLabel}
            min={0}
            max={PERCENT}
            step={SLIDER_STEP}
            bind:value={() => Math.round(progress * PERCENT), (value: number) => (progress = value / PERCENT)}
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={getSliderSlotSize().width} />
            {/snippet}
        </Range>
    </div>
</div>
