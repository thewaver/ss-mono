<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import GlitchExample from "./Examples/Glitch.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let {
        playback = $bindable(),
        progress = $bindable(),
        boxWidth,
        isPagePlaying,
        ...props
    }: RGBAnimationWrapperProps = $props();

    let glitchOpts = $state({ ...RGBAnimationKnobs.STARTING_GLITCH_OPTS });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <GlitchExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress glitchOpts={{ ...glitchOpts }} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"glitch"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"glitchCount"}
        controls={"Sets the example's glitch count, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Glitches per pass"}
        hint={"How many tears follow each other in the middle of a pass. Each one shifts every channel its own way."}
    >
        <PageNumberField
            value={glitchOpts.count}
            min={RGBAnimationKnobs.MIN_GLITCH_COUNT}
            max={RGBAnimationKnobs.MAX_GLITCH_COUNT}
            step={RGBAnimationKnobs.GLITCH_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Glitches per pass"}
            onInput={(value) => (glitchOpts.count = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"shiftPercent"}
        controls={"Sets the example's shift, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Shift (%)"}
        hint={"The furthest a channel moves in a tear, as a share of the picture's size."}
    >
        <PageNumberField
            value={glitchOpts.shiftPercent}
            min={RGBAnimationKnobs.MIN_SHIFT_PERCENT}
            max={RGBAnimationKnobs.MAX_SHIFT_PERCENT}
            step={RGBAnimationKnobs.SHIFT_PERCENT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Shift in percent"}
            onInput={(value) => (glitchOpts.shiftPercent = value)}
        />
    </PageProp>
</PageExampleKnobs>
