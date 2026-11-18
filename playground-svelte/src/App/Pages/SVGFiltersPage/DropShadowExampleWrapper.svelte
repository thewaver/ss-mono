<script lang="ts">
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import DropShadowExample from "./Examples/DropShadow.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let dx = $state(SVGFilterKnobs.DropShadow.STARTING_DX);
    let dy = $state(SVGFilterKnobs.DropShadow.STARTING_DY);
    let stdDeviation = $state(SVGFilterKnobs.DropShadow.STARTING_DEVIATION);
    let floodColor = $state(SVGFilterKnobs.DropShadow.STARTING_COLOR);
    let floodOpacity = $state(SVGFilterKnobs.DropShadow.STARTING_OPACITY);
</script>

<DropShadowExample {...props} {dx} {dy} {stdDeviation} {floodColor} {floodOpacity} />

<PageExampleKnobs>
    <PageProp
        itemKey={"dx"}
        {...SVGFilterKnobs.DX_TEXT}
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
        {...SVGFilterKnobs.DY_TEXT}
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
        {...SVGFilterKnobs.SHADOW_STD_DEVIATION_TEXT}
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

    <PageProp itemKey={"floodColor"} {...SVGFilterKnobs.FLOOD_COLOR_TEXT}>
        <PageColorField value={floodColor} ariaLabel={"Flood color"} onInput={(value) => (floodColor = value)} />
    </PageProp>

    <PageProp
        itemKey={"floodOpacity"}
        {...SVGFilterKnobs.FLOOD_OPACITY_TEXT}
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
