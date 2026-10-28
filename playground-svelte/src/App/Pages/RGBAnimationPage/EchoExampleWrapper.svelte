<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import EchoExample from "./Examples/Echo.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let { playback = $bindable(), progress = $bindable(), boxWidth, ...props }: RGBAnimationWrapperProps = $props();

    let distancePercent = $state(RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <EchoExample {...props} bind:playback bind:progress {distancePercent} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"echo"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"distancePercent"}
        controls={"Sets the example's distance, read by its RGBAnimationProps.computeRootAnimation and computeChannelAnimation"}
        label={"Distance (%)"}
        hint={"How far the picture drifts along its figure-eight, as a share of its size. Green and blue follow a little later than red."}
    >
        <PageNumberField
            value={distancePercent}
            min={RGBAnimationKnobs.MIN_ECHO_DISTANCE_PERCENT}
            max={RGBAnimationKnobs.MAX_ECHO_DISTANCE_PERCENT}
            step={RGBAnimationKnobs.ECHO_DISTANCE_STEP_PERCENT}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (distancePercent = value)}
        />
    </PageProp>
</PageExampleKnobs>
