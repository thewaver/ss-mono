<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { STRESS_ITEM_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import AnaglyphExample from "./Examples/Anaglyph.svelte";
    import EchoExample from "./Examples/Echo.svelte";
    import FocusPullExample from "./Examples/FocusPull.svelte";
    import GlitchExample from "./Examples/Glitch.svelte";
    import HueSwapExample from "./Examples/HueSwap.svelte";
    import OrbitExample from "./Examples/Orbit.svelte";
    import SwellExample from "./Examples/Swell.svelte";
    import TiltExample from "./Examples/Tilt.svelte";
    import TwistExample from "./Examples/Twist.svelte";

    const STRESS_EXAMPLE_COUNT = 9;

    type Props = BaseRGBAnimationExampleProps & { modalPlayback: boolean };

    let { modalPlayback = $bindable(), ...props }: Props = $props();

    let progress = $state(0);

    const exampleIndex = Math.floor(Math.random() * STRESS_EXAMPLE_COUNT);
</script>

<PageMeasureBox width={STRESS_ITEM_WIDTH}>
    {#if exampleIndex === 0}
        <GlitchExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            glitchOpts={RGBAnimationKnobs.STARTING_GLITCH_OPTS}
        />
    {:else if exampleIndex === 1}
        <SwellExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            scalePercent={RGBAnimationKnobs.STARTING_SCALE_PERCENT}
        />
    {:else if exampleIndex === 2}
        <OrbitExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            radiusPercent={RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT}
        />
    {:else if exampleIndex === 3}
        <FocusPullExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            maxBlurPx={RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX}
        />
    {:else if exampleIndex === 4}
        <TwistExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            maxDegrees={RGBAnimationKnobs.STARTING_TWIST_DEGREES}
        />
    {:else if exampleIndex === 5}
        <HueSwapExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            turns={RGBAnimationKnobs.STARTING_HUE_TURNS}
        />
    {:else if exampleIndex === 6}
        <TiltExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            maxDegrees={RGBAnimationKnobs.STARTING_TILT_DEGREES}
        />
    {:else if exampleIndex === 7}
        <AnaglyphExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            separationPercent={RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT}
        />
    {:else}
        <EchoExample
            {...props}
            bind:playback={modalPlayback}
            bind:progress
            distancePercent={RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT}
        />
    {/if}
</PageMeasureBox>
