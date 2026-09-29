<script lang="ts">
    import { ScanlineAnimationKeyframes } from "@thewaver/ss-components-svelte";
    import type { CellAnimationBreakpointOpts, ScanlineHorizontalStretchOpts } from "@thewaver/ss-components-svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import { ScanlineAnimationKeyframeKnobs } from "../../Knobs/ScanlineAnimationKeyframes.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageKnobs from "../../PageComponents/Knobs/Knobs.svelte";
    import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DirInput from "./DirInput.svelte";
    import SurgeExample from "./Examples/Surge.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import SmoothnessInput from "./SmoothnessInput.svelte";

    const IMAGE_CONTAINER_SIZE = 360;

    let { playback = $bindable(), ...props }: ScanlineAnimationExampleProps = $props();

    let keyframeOpts = $state.raw<Record<string, number | boolean>>({});
    let breakpointOpts = $state.raw<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SURGE_BREAKPOINT_OPTS,
    });
</script>

<PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
    <SurgeExample
        {...props}
        bind:playback
        keyframeOpts={keyframeOpts as ScanlineHorizontalStretchOpts}
        {breakpointOpts}
    />
</PageMeasureBox>

<PageExampleKnobs>
    <PageKnobs
        knobs={ScanlineAnimationKeyframeKnobs.STRETCH_KNOBS as Record<string, Knob>}
        defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_STRETCH_OPTS}
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
