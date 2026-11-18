<script lang="ts">
    import { TILTER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TilterKnobs } from "@thewaver/ss-playground/App/Knobs/Tilters.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import CardExample from "./Examples/Card.svelte";
    import PhotoExample from "./Examples/Photo.svelte";
    import type { TilterExampleProps } from "./TilterPageSvelte.types";
    import {
    BOX_HEIGHT,
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.const";

    let isDisabled = $state(TilterKnobs.STARTING_IS_DISABLED);
    let smoothingMs = $state(TILTER_DEFAULTS.smoothingMs);
    let activeRangePx = $state(TilterKnobs.STARTING_ACTIVE_RANGE_PX);
    let tiltRangePx = $state(TILTER_DEFAULTS.tiltRangePx);
    let maxTiltDegrees = $state(TILTER_DEFAULTS.maxTiltDegrees);
    let perspectivePx = $state(TILTER_DEFAULTS.perspectivePx);
    let sheenOpacity = $state(TilterKnobs.STARTING_SHEEN_OPACITY);
    let sheenSpreadPercent = $state(TilterKnobs.STARTING_SHEEN_SPREAD);

    const commonProps: TilterExampleProps = $derived({
        isDisabled,
        activeRangePx,
        smoothingMs,
        tiltRangePx,
        maxTiltDegrees,
        perspectivePx,
        sheenOpacity,
        sheenSpreadPercent,
    });

    const examples: ExampleDefs[] = [
        {
            key: "card",
            name: EXAMPLE_NAMES.card,
            readout: () =>
                "the surface leans away from the pointer and the highlight runs the other way, which is what reads as a reflection",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
        {
            key: "photo",
            name: EXAMPLE_NAMES.photo,
            readout: () => "the same wrapper with the sheen slot left out — nothing is painted over the content",
            component: photoExample,
            path: `${EXAMPLES_ROOT}/Photo.svelte`,
        },
    ];
</script>

{#snippet cardExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <CardExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet photoExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <PhotoExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        {...TilterKnobs.IS_DISABLED_TEXT}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        {...TilterKnobs.SMOOTHING_MS_TEXT}
    >
        <PageNumberField
            value={smoothingMs}
            min={TilterKnobs.MIN_SMOOTHING_MS}
            max={TilterKnobs.MAX_SMOOTHING_MS}
            step={TilterKnobs.SMOOTHING_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Smoothing in milliseconds"}
            onInput={(value) => (smoothingMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"activeRangePx"}
        {...TilterKnobs.ACTIVE_RANGE_PX_TEXT}
    >
        <PageNumberField
            value={activeRangePx}
            min={TilterKnobs.MIN_ACTIVE_RANGE_PX}
            max={TilterKnobs.MAX_ACTIVE_RANGE_PX}
            step={TilterKnobs.ACTIVE_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Active range in pixels"}
            onInput={(value) => (activeRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"tiltRangePx"}
        {...TilterKnobs.TILT_RANGE_PX_TEXT}
    >
        <PageNumberField
            value={tiltRangePx}
            min={TilterKnobs.MIN_TILT_RANGE_PX}
            max={TilterKnobs.MAX_TILT_RANGE_PX}
            step={TilterKnobs.TILT_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Tilt range in pixels"}
            onInput={(value) => (tiltRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"maxTiltDegrees"}
        {...TilterKnobs.MAX_TILT_DEGREES_TEXT}
    >
        <PageNumberField
            value={maxTiltDegrees}
            min={TilterKnobs.MIN_TILT_DEGREES}
            max={TilterKnobs.MAX_TILT_DEGREES}
            step={TilterKnobs.TILT_STEP_DEGREES}
            width={FIELD_WIDTH}
            ariaLabel={"Maximum tilt in degrees"}
            onInput={(value) => (maxTiltDegrees = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"perspectivePx"}
        {...TilterKnobs.PERSPECTIVE_PX_TEXT}
    >
        <PageNumberField
            value={perspectivePx}
            min={TilterKnobs.MIN_PERSPECTIVE_PX}
            max={TilterKnobs.MAX_PERSPECTIVE_PX}
            step={TilterKnobs.PERSPECTIVE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Perspective in pixels"}
            onInput={(value) => (perspectivePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"sheenOpacity"}
        {...TilterKnobs.SHEEN_OPACITY_TEXT}
    >
        <PageNumberField
            value={sheenOpacity}
            min={TilterKnobs.MIN_SHEEN_OPACITY}
            max={TilterKnobs.MAX_SHEEN_OPACITY}
            step={TilterKnobs.SHEEN_OPACITY_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Sheen opacity"}
            onInput={(value) => (sheenOpacity = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"sheenSpreadPercent"}
        {...TilterKnobs.SHEEN_SPREAD_PERCENT_TEXT}
    >
        <PageNumberField
            value={sheenSpreadPercent}
            min={TilterKnobs.MIN_SHEEN_SPREAD}
            max={TilterKnobs.MAX_SHEEN_SPREAD}
            step={TilterKnobs.SHEEN_SPREAD_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Sheen spread in percent"}
            onInput={(value) => (sheenSpreadPercent = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
