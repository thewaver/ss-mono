<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import OrbitExample from "./Examples/Orbit.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let { playback = $bindable(), progress = $bindable(), boxWidth, ...props }: RGBAnimationWrapperProps = $props();

    let radiusPercent = $state(RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <OrbitExample {...props} bind:playback bind:progress {radiusPercent} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"orbit"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"radiusPercent"}
        controls={"Sets the example's radius, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Radius (%)"}
        hint={"How far the channels circle from their resting place at the widest point of the pass, as a share of the picture's size."}
    >
        <PageNumberField
            value={radiusPercent}
            min={RGBAnimationKnobs.MIN_ORBIT_RADIUS_PERCENT}
            max={RGBAnimationKnobs.MAX_ORBIT_RADIUS_PERCENT}
            step={RGBAnimationKnobs.ORBIT_RADIUS_STEP_PERCENT}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (radiusPercent = value)}
        />
    </PageProp>
</PageExampleKnobs>
