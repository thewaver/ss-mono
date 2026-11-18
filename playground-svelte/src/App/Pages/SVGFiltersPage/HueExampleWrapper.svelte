<script lang="ts">
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import HueExample from "./Examples/Hue.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let deg = $state(SVGFilterKnobs.Hue.STARTING_DEG);
    let saturation = $state(SVGFilterKnobs.Hue.STARTING_SATURATION);
    let red = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    let green = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
    let blue = $state(SVGFilterKnobs.Hue.STARTING_CHANNEL);
</script>

<HueExample {...props} {deg} {saturation} r={red} g={green} b={blue} />

<PageExampleKnobs>
    <PageProp
        itemKey={"deg"}
        {...SVGFilterKnobs.DEG_TEXT}
    >
        <PageNumberField
            value={deg}
            min={SVGFilterKnobs.Hue.MIN_DEG}
            max={SVGFilterKnobs.Hue.MAX_DEG}
            step={SVGFilterKnobs.Hue.DEG_STEP}
            ariaLabel={"Hue rotation"}
            onInput={(value) => (deg = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"saturation"}
        {...SVGFilterKnobs.SATURATION_TEXT}
    >
        <PageNumberField
            value={saturation}
            min={SVGFilterKnobs.Hue.MIN_AMOUNT}
            max={SVGFilterKnobs.Hue.MAX_AMOUNT}
            step={SVGFilterKnobs.Hue.AMOUNT_STEP}
            ariaLabel={"Saturation"}
            onInput={(value) => (saturation = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"red"}
        {...SVGFilterKnobs.RED_TEXT}
    >
        <PageNumberField
            value={red}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Red"}
            onInput={(value) => (red = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"green"}
        {...SVGFilterKnobs.GREEN_TEXT}
    >
        <PageNumberField
            value={green}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Green"}
            onInput={(value) => (green = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"blue"}
        {...SVGFilterKnobs.BLUE_TEXT}
    >
        <PageNumberField
            value={blue}
            min={SVGFilterKnobs.Hue.MIN_CHANNEL}
            max={SVGFilterKnobs.Hue.MAX_CHANNEL}
            step={SVGFilterKnobs.Hue.CHANNEL_STEP}
            ariaLabel={"Blue"}
            onInput={(value) => (blue = value)}
        />
    </PageProp>
</PageExampleKnobs>
