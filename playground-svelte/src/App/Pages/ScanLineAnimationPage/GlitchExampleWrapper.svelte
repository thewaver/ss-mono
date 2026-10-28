<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import GlitchExample from "./Examples/Glitch.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";
    import {
        IMAGE_CONTAINER_SIZE,
    } from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";

    let {
        isPagePlaying,
        ...props
    }: Omit<ScanlineAnimationExampleProps, "playback"> & { isPagePlaying: boolean } = $props();

    let playback = $state(true);
    let progress = $state(0);

    let keyframeOpts = $state.raw({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });
</script>

<div class={styles.stack}>
    <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
        <GlitchExample {...props} bind:playback={() => isPagePlaying && playback, (next) => (playback = next)} bind:progress {keyframeOpts} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"scanlineGlitch"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp itemKey={"count"} controls={"Sets the number of glitch bursts in the example's ScanlineAnimationProps.computeScanlineAnimation"} label={"Count"} hint={"How many glitch bursts happen over one pass."}>
        <PageNumberField
            value={keyframeOpts.count}
            min={ScanlineAnimationKnobs.MIN_GLITCH_COUNT}
            max={ScanlineAnimationKnobs.MAX_GLITCH_COUNT}
            step={ScanlineAnimationKnobs.GLITCH_COUNT_STEP}
            ariaLabel={"Count"}
            onInput={(value) => {
                keyframeOpts = { ...keyframeOpts, count: value };
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"maxShift"}
        controls={"Sets how far rows slide in the example's ScanlineAnimationProps.computeScanlineAnimation"}
        label={"Max shift (%)"}
        hint={"How far a line can be thrown sideways at the worst of a burst, as a share of its own width."}
    >
        <PageNumberField
            value={keyframeOpts.shiftPercent}
            min={ScanlineAnimationKnobs.MIN_SHIFT_PERCENT}
            max={ScanlineAnimationKnobs.MAX_SHIFT_PERCENT}
            step={ScanlineAnimationKnobs.SHIFT_PERCENT_STEP}
            ariaLabel={"Shift percent"}
            onInput={(value) => {
                keyframeOpts = { ...keyframeOpts, shiftPercent: value };
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"chunkyness01"}
        controls={"Sets how many neighboring rows slide together in the example's ScanlineAnimationProps.computeScanlineAnimation"}
        label={"Chunkyness (0-1)"}
        hint={"How blocky the glitch is: low values throw single lines about, high values throw thick slabs."}
    >
        <PageNumberField
            value={keyframeOpts.chunkyness}
            min={ScanlineAnimationKnobs.MIN_CHUNKYNESS}
            max={ScanlineAnimationKnobs.MAX_CHUNKYNESS}
            step={ScanlineAnimationKnobs.CHUNKYNESS_STEP}
            ariaLabel={"Chunkyness"}
            onInput={(value) => {
                keyframeOpts = { ...keyframeOpts, chunkyness: value };
            }}
        />
    </PageProp>
</PageExampleKnobs>
