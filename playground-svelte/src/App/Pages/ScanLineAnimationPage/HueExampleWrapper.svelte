<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
    import type { CellAnimationBreakpointOpts, ScanlineHorizontalHueOpts } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import DirInput from "./DirInput.svelte";
    import HueExample from "./Examples/Hue.svelte";
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

    const keyframeOpts: ScanlineHorizontalHueOpts = {};

    let breakpointOpts = $state.raw<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_HUE_BREAKPOINT_OPTS,
    });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
        <HueExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {keyframeOpts} {breakpointOpts} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"scanlineHue"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
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
