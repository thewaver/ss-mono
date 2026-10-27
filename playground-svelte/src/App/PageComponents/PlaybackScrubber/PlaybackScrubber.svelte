<script lang="ts">
    import { Button, Range } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";
    import {
        PERCENT,
        SLIDER_STEP,
    } from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.const";

    let { playback = $bindable(), progress = $bindable(), ...props }: PagePlaybackScrubberProps = $props();
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
            <PageControlButtonContent {flags} glyph={playback ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
        {/snippet}
    </Button>

    <div class={styles.sliderSlot}>
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
                <PageRangeContent {renderProps} />
            {/snippet}
        </Range>
    </div>
</div>
