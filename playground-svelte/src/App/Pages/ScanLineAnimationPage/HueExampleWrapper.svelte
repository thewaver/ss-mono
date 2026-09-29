<script lang="ts">
    import type { CellAnimationBreakpointOpts, ScanlineHorizontalHueOpts } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DirInput from "./DirInput.svelte";
    import HueExample from "./Examples/Hue.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import SmoothnessInput from "./SmoothnessInput.svelte";

    const IMAGE_CONTAINER_SIZE = 360;

    let { playback = $bindable(), ...props }: ScanlineAnimationExampleProps = $props();

    const keyframeOpts: ScanlineHorizontalHueOpts = {};

    let breakpointOpts = $state.raw<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_HUE_BREAKPOINT_OPTS,
    });
</script>

<PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
    <HueExample {...props} bind:playback {keyframeOpts} {breakpointOpts} />
</PageMeasureBox>

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
