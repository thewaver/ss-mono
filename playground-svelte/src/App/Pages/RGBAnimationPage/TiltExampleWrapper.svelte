<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import TiltExample from "./Examples/Tilt.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let { playback = $bindable(), progress = $bindable(), boxWidth, ...props }: RGBAnimationWrapperProps = $props();

    let maxDegrees = $state(RGBAnimationKnobs.STARTING_TILT_DEGREES);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <TiltExample {...props} bind:playback bind:progress {maxDegrees} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"tilt"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"maxDegrees"}
        controls={"Sets the example's angle, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Angle (°)"}
        hint={"How far red and blue swing in depth, in opposite directions. Green stays put."}
    >
        <PageNumberField
            value={maxDegrees}
            min={RGBAnimationKnobs.MIN_TILT_DEGREES}
            max={RGBAnimationKnobs.MAX_TILT_DEGREES}
            step={RGBAnimationKnobs.TILT_STEP_DEGREES}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (maxDegrees = value)}
        />
    </PageProp>
</PageExampleKnobs>
