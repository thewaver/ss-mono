<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import TwistExample from "./Examples/Twist.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let { playback = $bindable(), progress = $bindable(), boxWidth, ...props }: RGBAnimationWrapperProps = $props();

    let maxDegrees = $state(RGBAnimationKnobs.STARTING_TWIST_DEGREES);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <TwistExample {...props} bind:playback bind:progress {maxDegrees} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"twist"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"maxDegrees"}
        controls={"Sets the example's angle, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Angle (°)"}
        hint={"How far red and blue turn, in opposite directions, at the middle of the pass. Green stays put."}
    >
        <PageNumberField
            value={maxDegrees}
            min={RGBAnimationKnobs.MIN_TWIST_DEGREES}
            max={RGBAnimationKnobs.MAX_TWIST_DEGREES}
            step={RGBAnimationKnobs.TWIST_STEP_DEGREES}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (maxDegrees = value)}
        />
    </PageProp>
</PageExampleKnobs>
