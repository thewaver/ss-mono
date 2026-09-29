<script lang="ts">
    import { SVGFilterDefsFactory } from "@thewaver/ss-components-svelte";
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageColorField from "../../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PageFilterStage from "../../../StyledComponents/SVGFiltersContent/SVGFiltersContent.svelte";
    import type { SVGFiltersExampleProps } from "../SVGFiltersPage.types";

    const FILTER_ID = "svgFiltersDropShadow";

    type Props = SVGFiltersExampleProps;

    let props: Props = $props();

    let dx = $state(SVGFilterKnobs.DropShadow.STARTING_DX);
    let dy = $state(SVGFilterKnobs.DropShadow.STARTING_DY);
    let stdDeviation = $state(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    let floodColor = $state(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    let floodOpacity = $state(SVGFilterKnobs.DropShadow.STARTING_OPACITY);
</script>

<PageFilterStage
    filterId={FILTER_ID}
    label={"shadow"}
    renderDefs={() =>
        new SVGFilterDefsFactory(FILTER_ID)
            .addDropShadowFilter({
                dx,
                dy,
                stdDeviation,
                floodColor,
                floodOpacity,
            })
            .computeFilterPrimitives({
                method: props.method,
                elementSize: props.elementSize,
            })
    }
/>

<PageExampleKnobs>
    <PageProp
        itemKey={"dx"}
        label={"Offset x"}
        hint={"How far the shadow is thrown sideways from the shape casting it."}
    >
        <PageNumberField
            value={dx}
            min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
            max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
            ariaLabel={"Offset x"}
            onInput={(value) => (dx = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"dy"}
        label={"Offset y"}
        hint={"How far the shadow is thrown up or down from the shape casting it."}
    >
        <PageNumberField
            value={dy}
            min={SVGFilterKnobs.DropShadow.MIN_OFFSET}
            max={SVGFilterKnobs.DropShadow.MAX_OFFSET}
            ariaLabel={"Offset y"}
            onInput={(value) => (dy = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"shadowStdDeviation"}
        label={"Std deviation"}
        hint={"How soft the shadow's edge is. 0 gives a hard copy of the shape."}
    >
        <PageNumberField
            value={stdDeviation}
            min={SVGFilterKnobs.DropShadow.MIN_DEVIATION}
            max={SVGFilterKnobs.DropShadow.MAX_DEVIATION}
            step={SVGFilterKnobs.DropShadow.DEVIATION_STEP}
            ariaLabel={"Shadow standard deviation"}
            onInput={(value) => (stdDeviation = value)}
        />
    </PageProp>

    <PageProp itemKey={"floodColor"} label={"Flood color"} hint={"The color the shadow is painted in."}>
        <PageColorField value={floodColor} ariaLabel={"Flood color"} onInput={(value) => (floodColor = value)} />
    </PageProp>

    <PageProp
        itemKey={"floodOpacity"}
        label={"Flood opacity"}
        hint={"How solid the shadow is. 0 hides it entirely."}
    >
        <PageNumberField
            value={floodOpacity}
            min={SVGFilterKnobs.DropShadow.MIN_OPACITY}
            max={SVGFilterKnobs.DropShadow.MAX_OPACITY}
            step={SVGFilterKnobs.DropShadow.OPACITY_STEP}
            ariaLabel={"Flood opacity"}
            onInput={(value) => (floodOpacity = value)}
        />
    </PageProp>
</PageExampleKnobs>
