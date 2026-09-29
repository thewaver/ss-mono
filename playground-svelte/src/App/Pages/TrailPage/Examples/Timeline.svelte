<script lang="ts">
    import { Range, Trail } from "@thewaver/ss-components-svelte";
    import type { TrailController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import PageTrailMarker from "../../../StyledComponents/TrailContent/PageTrailMarker.svelte";
    import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.svelte";
    import type { TrailExampleProps } from "../TrailPage.types";

    const TIMELINE_SIZE = { width: 320, height: 140 };
    const TIMELINE_PATH = "M 24 108 C 92 12, 168 154, 232 74 S 296 26, 304 58";
    const PERCENT = 100;
    const SLIDER_STEP = 1;
    const MARKER_ID = "timelineMarker";

    type Props = TrailExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<TrailController>();
</script>

<div class={styles.stack}>
    <PageMeasureBox>
        <Trail
            path={TIMELINE_PATH}
            size={TIMELINE_SIZE}
            durationMs={props.durationMs}
            isLooping={props.isLooping}
            isTurning={props.isTurning}
            bind:progress
            bind:playback
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderTrack(path)}
                <PageTrailTrack {path} />
            {/snippet}

            {#snippet renderTraveler()}
                <PageTrailMarker id={MARKER_ID} />
            {/snippet}
        </Trail>
    </PageMeasureBox>

    <div class={styles.slider}>
        <Range
            id={"timelineScrubber"}
            sizing={"fill"}
            ariaLabel={"Position along the path"}
            min={0}
            max={PERCENT}
            step={SLIDER_STEP}
            bind:value={() => Math.round(progress * PERCENT), (value: number) => controller?.seek(value / PERCENT)}
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={TIMELINE_SIZE.width} />
            {/snippet}
        </Range>
    </div>
</div>
