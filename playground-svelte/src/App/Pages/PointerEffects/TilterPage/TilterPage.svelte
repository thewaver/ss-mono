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

    const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/TilterPage/Examples";

    const FIELD_WIDTH = 110;
    const BOX_HEIGHT = 240;

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
            name: "Card with a sheen",
            readout: () =>
                "the surface leans away from the pointer and the highlight runs the other way, which is what reads as a reflection",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
        {
            key: "photo",
            name: "Picture, no sheen",
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
        label={"Disabled"}
        hint={"Stops the surface following the pointer and leaves it flat. It is what a page honoring a reduced-motion preference passes."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>

    <PageProp
        itemKey={"smoothingMs"}
        label={"Smoothing (ms)"}
        hint={"How long the surface takes to catch up with the pointer. At 0 it follows exactly; raised, it lags a quick movement and glides back flat when the pointer leaves."}
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
        label={"Active range (px)"}
        hint={"How near the pointer has to be before the surface answers it at all, measured from the area's center. Outside it the surface lies flat."}
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
        label={"Tilt range (px)"}
        hint={"How far from the center the pointer starts to tip the surface. The turn is strongest at the surface's own edge and fades to nothing out at this distance."}
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
        label={"Max tilt (deg)"}
        hint={"How far the surface turns when the pointer is at the very edge of the tilted area."}
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
        label={"Perspective (px)"}
        hint={"How near the viewer sits. Smaller is a more violent perspective; larger flattens the turn."}
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
        label={"Sheen opacity"}
        hint={"How strong the highlight is. It belongs to the page rather than to the component."}
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
        label={"Sheen spread (%)"}
        hint={"How wide the band of highlight is across the surface."}
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
