<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
    import { ScanlineAnimationKeyframes } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationBreakpointOpts, _ScanlineHorizontalWaveOpts } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import { ScanlineAnimationKeyframeKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimationKeyframes.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import DirInput from "./DirInput.svelte";
    import WaveExample from "./Examples/_Wave.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import SmoothnessInput from "./SmoothnessInput.svelte";
    import {
        IMAGE_CONTAINER_SIZE,
    } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";

    let {
        isPagePlaying,
        ...props
    }: Omit<ScanlineAnimationExampleProps, "playback"> & { isPagePlaying: boolean } = $props();

    let playback = $state(true);
    let progress = $state(0);

    let keyframeOpts = $state.raw<Record<string, number | boolean>>({});
    let breakpointOpts = $state.raw<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_WAVE_BREAKPOINT_OPTS,
    });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
        <WaveExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress keyframeOpts={keyframeOpts as _ScanlineHorizontalWaveOpts} {breakpointOpts} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"scanlineWave"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageKnobs
        knobs={ScanlineAnimationKeyframeKnobs.WAVE_KNOBS as Record<string, Knob>}
        defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_WAVE_OPTS}
        values={keyframeOpts}
        onInput={(key, value) => {
            keyframeOpts = { ...keyframeOpts, [key]: value };
        }}
    />

    <SmoothnessInput
        value={breakpointOpts.smoothness!}
        setter={(value) => {
            breakpointOpts = { ...breakpointOpts, smoothness: value };
        }}
    />
    <DirInput
        value={breakpointOpts.dir!}
        setter={(value) => {
            breakpointOpts = { ...breakpointOpts, dir: value };
        }}
    />
</PageExampleKnobs>
