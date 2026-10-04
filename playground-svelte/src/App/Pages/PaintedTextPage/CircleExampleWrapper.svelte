<script lang="ts">
    import { PAINTED_TEXT_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import CircleExample from "./Examples/Circle.svelte";
    import type { PaintedTextPathExampleWrapperProps } from "./PaintedTextPage.types";

    let {
        width: _width,
        progress = $bindable(),
        playback = $bindable(),
        ...props
    }: PaintedTextPathExampleWrapperProps = $props();

    let radius = $state(PaintedTextKnobs.STARTING_CIRCLE_RADIUS);
    let lapDurationMs = $state(PAINTED_TEXT_DEFAULTS.lapDurationMs);
    let isFittedToPath = $state(PaintedTextKnobs.STARTING_IS_FITTED_TO_PATH);
</script>

<PageMeasureBox padding={MEASURE_BOX_PADDING}>
    <CircleExample {...props} bind:progress bind:playback {radius} {lapDurationMs} {isFittedToPath} />
</PageMeasureBox>

<PageExampleKnobs>
    <PageProp
        itemKey={"radius"}
        label={"Radius (px)"}
        hint={"How far the circle the text runs round is from its center."}
    >
        <PageNumberField
            value={radius}
            min={PaintedTextKnobs.MIN_CIRCLE_RADIUS}
            max={PaintedTextKnobs.MAX_CIRCLE_RADIUS}
            step={PaintedTextKnobs.CIRCLE_RADIUS_STEP}
            ariaLabel={"Radius in pixels"}
            onInput={(value) => {
                radius = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"lapDurationMs"}
        label={"Lap duration (ms)"}
        hint={"How long the text takes to slide once round the whole length of its path."}
    >
        <PageNumberField
            value={lapDurationMs}
            min={PaintedTextKnobs.MIN_LAP_DURATION_MS}
            max={PaintedTextKnobs.MAX_LAP_DURATION_MS}
            step={PaintedTextKnobs.LAP_DURATION_STEP_MS}
            ariaLabel={"Lap duration in milliseconds"}
            onInput={(value) => {
                lapDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isFittedToPath"}
        label={"Fit to the circle"}
        hint={"Stretches or squeezes the spacing between the letters so the text goes round the circle exactly once, meeting its own start."}
    >
        <PageCheckField
            value={isFittedToPath}
            ariaLabel={"Fit to the circle"}
            onChange={(value) => {
                isFittedToPath = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
