<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
    import type { CellAnimationBreakpointOpts, ScanlineHorizontalGrayscaleOpts } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import DirInput from "./DirInput.svelte";
    import GrayscaleExample from "./Examples/Grayscale.svelte";
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

    const keyframeOpts: ScanlineHorizontalGrayscaleOpts = {};

    let breakpointOpts = $state.raw<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_GRAYSCALE_BREAKPOINT_OPTS,
    });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
        <GrayscaleExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {keyframeOpts} {breakpointOpts} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"scanlineGrayscale"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
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
