<script lang="ts">
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import HueSwapExample from "./Examples/HueSwap.svelte";
    import type { RGBAnimationWrapperProps } from "./RGBAnimationPageSvelte.types";

    let {
        playback = $bindable(),
        progress = $bindable(),
        boxWidth,
        isPagePlaying,
        ...props
    }: RGBAnimationWrapperProps = $props();

    let turns = $state(RGBAnimationKnobs.STARTING_HUE_TURNS);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={boxWidth}>
        <HueSwapExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {turns} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"hueSwap"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"turns"}
        controls={"Sets the example's turns, read by its RGBAnimationProps.computeChannelAnimation"}
        label={"Turns"}
        hint={"How many times the two turning channels go round the color wheel, in opposite directions, over one pass. The third stays put, a different one each pass."}
    >
        <PageNumberField
            value={turns}
            min={RGBAnimationKnobs.MIN_HUE_TURNS}
            max={RGBAnimationKnobs.MAX_HUE_TURNS}
            step={RGBAnimationKnobs.HUE_TURNS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Position in the pass"}
            onInput={(value) => (turns = value)}
        />
    </PageProp>
</PageExampleKnobs>
