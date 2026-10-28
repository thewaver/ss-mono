<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import FocusPullExample from "./Examples/FocusPull.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let { playback = $bindable(), progress = $bindable(), boxWidth, ...props }: RGBAnimationWrapperProps = $props();

    let maxBlurPx = $state(RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <FocusPullExample {...props} bind:playback bind:progress {maxBlurPx} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"focusPull"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"maxBlurPx"}
        controls={"Sets the example's blur, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Blur (px)"}
        hint={"How soft each channel goes at the worst of its turn out of focus."}
    >
        <PageNumberField
            value={maxBlurPx}
            min={RGBAnimationKnobs.MIN_FOCUS_BLUR_PX}
            max={RGBAnimationKnobs.MAX_FOCUS_BLUR_PX}
            step={RGBAnimationKnobs.FOCUS_BLUR_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (maxBlurPx = value)}
        />
    </PageProp>
</PageExampleKnobs>
