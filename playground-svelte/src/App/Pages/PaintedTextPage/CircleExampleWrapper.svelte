<script lang="ts">
    import { PAINTED_TEXT_DEFAULTS } from "@thewaver/ss-components-svelte";

    import { PaintedTextKnobs } from "@thewaver/ss-playground/App/Knobs/PaintedTexts.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import CircleExample from "./Examples/Circle.svelte";
    import type { PaintedTextPathExampleWrapperProps } from "./PaintedTextPageSvelte.types";

    let { progress = $bindable(), playback = $bindable(), ...props }: PaintedTextPathExampleWrapperProps = $props();

    let radius = $state(PaintedTextKnobs.STARTING_CIRCLE_RADIUS);
    let lapDurationMs = $state(PAINTED_TEXT_DEFAULTS.lapDurationMs);
    let isFittedToPath = $state(PaintedTextKnobs.STARTING_IS_FITTED_TO_PATH);
</script>

<CircleExample {...props} bind:progress bind:playback {radius} {lapDurationMs} {isFittedToPath} />

<PageExampleKnobs>
    <PageProp
        itemKey={"radius"}
        {...PaintedTextKnobs.RADIUS_TEXT}
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
        {...PaintedTextKnobs.LAP_DURATION_MS_TEXT}
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
        {...PaintedTextKnobs.IS_FITTED_TO_PATH_TEXT}
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
