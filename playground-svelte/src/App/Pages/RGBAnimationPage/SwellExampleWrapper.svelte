<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import SwellExample from "./Examples/Swell.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let {
        playback = $bindable(),
        progress = $bindable(),
        boxWidth,
        isPagePlaying,
        ...props
    }: RGBAnimationWrapperProps = $props();

    let scalePercent = $state(RGBAnimationKnobs.STARTING_SCALE_PERCENT);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <SwellExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {scalePercent} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"swell"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"scalePercent"}
        controls={"Sets the example's scale, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Scale (%)"}
        hint={"How far red grows and blue shrinks at the top of the swell. Green stays put."}
    >
        <PageNumberField
            value={scalePercent}
            min={RGBAnimationKnobs.MIN_SCALE_PERCENT}
            max={RGBAnimationKnobs.MAX_SCALE_PERCENT}
            step={RGBAnimationKnobs.SCALE_PERCENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Scale in percent"}
            onInput={(value) => (scalePercent = value)}
        />
    </PageProp>
</PageExampleKnobs>
