<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import AnaglyphExample from "./Examples/Anaglyph.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let {
        playback = $bindable(),
        progress = $bindable(),
        boxWidth,
        isPagePlaying,
        ...props
    }: RGBAnimationWrapperProps = $props();

    let separationPercent = $state(RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <AnaglyphExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {separationPercent} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"anaglyph"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"separationPercent"}
        controls={"Sets the example's separation, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Separation (%)"}
        hint={"How far red moves left and blue moves right at the middle of the pass, as a share of the picture's width. Green stays put."}
    >
        <PageNumberField
            value={separationPercent}
            min={RGBAnimationKnobs.MIN_ANAGLYPH_SEPARATION_PERCENT}
            max={RGBAnimationKnobs.MAX_ANAGLYPH_SEPARATION_PERCENT}
            step={RGBAnimationKnobs.ANAGLYPH_SEPARATION_STEP_PERCENT}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (separationPercent = value)}
        />
    </PageProp>
</PageExampleKnobs>
