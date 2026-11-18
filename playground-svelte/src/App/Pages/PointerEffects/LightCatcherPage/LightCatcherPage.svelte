<script lang="ts">
    import { LIGHT_CATCHER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { LightCatcherKnobs } from "@thewaver/ss-playground/App/Knobs/LightCatchers.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PanelExample from "./Examples/Panel.svelte";
    import PlacedLightExample from "./Examples/PlacedLight.svelte";
    import RowExample from "./Examples/Row.svelte";
    import type { LightCatcherExampleProps } from "./LightCatcherPageSvelte.types";
    import {
    BOX_HEIGHT,
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
    ROW_SPAN,
} from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.const";

    let isDisabled = $state(LightCatcherKnobs.STARTING_IS_DISABLED);
    let smoothingMs = $state(LIGHT_CATCHER_DEFAULTS.smoothingMs);
    let activeRangePx = $state(LightCatcherKnobs.STARTING_ACTIVE_RANGE_PX);
    let lightRangePx = $state(LIGHT_CATCHER_DEFAULTS.lightRangePx);
    let maxBrightness = $state(LIGHT_CATCHER_DEFAULTS.maxBrightness);
    let restingBrightness = $state(LIGHT_CATCHER_DEFAULTS.restingBrightness);
    let maxLightness = $state(LIGHT_CATCHER_DEFAULTS.maxLightness);
    let restingLightness = $state(LIGHT_CATCHER_DEFAULTS.restingLightness);

    const commonProps: LightCatcherExampleProps = $derived({
        isDisabled,
        activeRangePx,
        smoothingMs,
        lightRangePx,
        maxBrightness,
        restingBrightness,
        maxLightness,
        restingLightness,
    });

    const examples: ExampleDefs[] = [
        {
            key: "panel",
            name: EXAMPLE_NAMES.panel,
            readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
            component: panelExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: ROW_SPAN,
            readout: () =>
                "five of them side by side, each reading the pointer against its own box — drop the resting brightness below 1 and the row becomes a spotlight",
            component: rowExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
        },
        {
            key: "placed",
            name: EXAMPLE_NAMES.placed,
            span: ROW_SPAN,
            readout: () =>
                "the slider puts one light across the whole row and every lamp answers to that same spot — the pointer is ignored, since a supplied point replaces it",
            component: placedExample,
            path: `${EXAMPLES_ROOT}/PlacedLight.svelte`,
        },
    ];
</script>

{#snippet panelExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <PanelExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet rowExample()}
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <RowExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

{#snippet placedExample()}
    <PlacedLightExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        {...LightCatcherKnobs.IS_DISABLED_TEXT}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        {...LightCatcherKnobs.SMOOTHING_MS_TEXT}
    >
        <PageNumberField
            value={smoothingMs}
            min={LightCatcherKnobs.MIN_SMOOTHING_MS}
            max={LightCatcherKnobs.MAX_SMOOTHING_MS}
            step={LightCatcherKnobs.SMOOTHING_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Smoothing in milliseconds"}
            onInput={(value) => (smoothingMs = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"activeRangePx"}
        {...LightCatcherKnobs.ACTIVE_RANGE_PX_TEXT}
    >
        <PageNumberField
            value={activeRangePx}
            min={LightCatcherKnobs.MIN_ACTIVE_RANGE_PX}
            max={LightCatcherKnobs.MAX_ACTIVE_RANGE_PX}
            step={LightCatcherKnobs.ACTIVE_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Active range in pixels"}
            onInput={(value) => (activeRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"lightRangePx"}
        {...LightCatcherKnobs.LIGHT_RANGE_PX_TEXT}
    >
        <PageNumberField
            value={lightRangePx}
            min={LightCatcherKnobs.MIN_LIGHT_RANGE_PX}
            max={LightCatcherKnobs.MAX_LIGHT_RANGE_PX}
            step={LightCatcherKnobs.LIGHT_RANGE_STEP_PX}
            width={FIELD_WIDTH}
            ariaLabel={"Light range in pixels"}
            onInput={(value) => (lightRangePx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"maxBrightness"}
        {...LightCatcherKnobs.MAX_BRIGHTNESS_TEXT}
    >
        <PageNumberField
            value={maxBrightness}
            min={LightCatcherKnobs.MIN_BRIGHTNESS}
            max={LightCatcherKnobs.MAX_BRIGHTNESS}
            step={LightCatcherKnobs.BRIGHTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Maximum brightness"}
            onInput={(value) => (maxBrightness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"restingBrightness"}
        {...LightCatcherKnobs.RESTING_BRIGHTNESS_TEXT}
    >
        <PageNumberField
            value={restingBrightness}
            min={LightCatcherKnobs.MIN_BRIGHTNESS}
            max={LightCatcherKnobs.MAX_BRIGHTNESS}
            step={LightCatcherKnobs.BRIGHTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Resting brightness"}
            onInput={(value) => (restingBrightness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"maxLightness"}
        {...LightCatcherKnobs.MAX_LIGHTNESS_TEXT}
    >
        <PageNumberField
            value={maxLightness}
            min={LightCatcherKnobs.MIN_LIGHTNESS}
            max={LightCatcherKnobs.MAX_LIGHTNESS}
            step={LightCatcherKnobs.LIGHTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Maximum lightness"}
            onInput={(value) => (maxLightness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"restingLightness"}
        {...LightCatcherKnobs.RESTING_LIGHTNESS_TEXT}
    >
        <PageNumberField
            value={restingLightness}
            min={LightCatcherKnobs.MIN_LIGHTNESS}
            max={LightCatcherKnobs.MAX_LIGHTNESS}
            step={LightCatcherKnobs.LIGHTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Resting lightness"}
            onInput={(value) => (restingLightness = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
