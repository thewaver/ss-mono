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

    const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/LightCatcherPage/Examples";

    const FIELD_WIDTH = 110;
    const BOX_HEIGHT = 200;
    const ROW_SPAN = 2;

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
            name: "One panel",
            readout: () => "brightest with the pointer on it, fading back to resting as the pointer walks out",
            component: panelExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "row",
            name: "A row of them",
            span: ROW_SPAN,
            readout: () =>
                "five of them side by side, each reading the pointer against its own box — drop the resting brightness below 1 and the row becomes a spotlight",
            component: rowExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
        },
        {
            key: "placed",
            name: "A light placed by hand",
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
    <PageMeasureBox isFilling height={BOX_HEIGHT}>
        <PlacedLightExample {...commonProps} />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Stops the surface answering the pointer and leaves it at its resting brightness and lightness. It is what a page honoring a reduced-motion preference passes."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        label={"Smoothing (ms)"}
        hint={"How long the light takes to catch up with the pointer. At 0 it follows exactly; raised, it glows on after the pointer and fades behind it."}
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
        label={"Active range (px)"}
        hint={"How near the pointer has to be before the surface answers it at all, measured from its center. Outside it the surface sits at resting."}
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
        label={"Light range (px)"}
        hint={"How far the light reaches. Full brightness at the surface's own edge, resting out here."}
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
        label={"Max brightness"}
        hint={"How bright the surface is with the pointer on it. 1 is the content exactly as painted."}
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
        label={"Resting brightness"}
        hint={"How bright the surface is with nothing near it. Below 1 it dims, which turns a row into a spotlight."}
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
        label={"Max lightness"}
        hint={"How far the surface fades toward white with the pointer on it. 0 is untouched. Unlike brightness it lifts the dark parts most, and the two stack."}
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
        label={"Resting lightness"}
        hint={"How far the surface fades toward white with nothing near it. 0 is untouched."}
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
