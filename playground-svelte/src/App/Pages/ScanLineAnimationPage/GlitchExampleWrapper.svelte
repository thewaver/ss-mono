<script lang="ts">
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import GlitchExample from "./Examples/Glitch.svelte";
    import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

    const IMAGE_CONTAINER_SIZE = 360;

    let { playback = $bindable(), ...props }: ScanlineAnimationExampleProps = $props();

    let keyframeOpts = $state.raw({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });
</script>

<PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
    <GlitchExample {...props} bind:playback {keyframeOpts} />
</PageMeasureBox>

<PageExampleKnobs>
    <PageProp itemKey={"count"} label={"Count"} hint={"How many glitch bursts happen over one pass."}>
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
