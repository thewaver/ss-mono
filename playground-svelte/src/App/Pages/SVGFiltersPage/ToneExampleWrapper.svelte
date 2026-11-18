<script lang="ts">
    import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ToneExample from "./Examples/Tone.svelte";
    import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

    let props: SVGFiltersExampleProps = $props();

    let brightness = $state(SVGFilterKnobs.Tone.STARTING_BRIGHTNESS);
    let contrast = $state(SVGFilterKnobs.Tone.STARTING_CONTRAST);
    let inversion = $state(SVGFilterKnobs.Tone.STARTING_INVERSION);
</script>

<ToneExample {...props} {brightness} {contrast} {inversion} />

<PageExampleKnobs>
    <PageProp
        itemKey={"brightness"}
        {...SVGFilterKnobs.BRIGHTNESS_TEXT}
    >
        <PageNumberField
            value={brightness}
            min={SVGFilterKnobs.Tone.MIN_AMOUNT}
            max={SVGFilterKnobs.Tone.MAX_AMOUNT}
            step={SVGFilterKnobs.Tone.AMOUNT_STEP}
            ariaLabel={"Brightness"}
            onInput={(value) => (brightness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"contrast"}
        {...SVGFilterKnobs.CONTRAST_TEXT}
    >
        <PageNumberField
            value={contrast}
            min={SVGFilterKnobs.Tone.MIN_AMOUNT}
            max={SVGFilterKnobs.Tone.MAX_AMOUNT}
            step={SVGFilterKnobs.Tone.AMOUNT_STEP}
            ariaLabel={"Contrast"}
            onInput={(value) => (contrast = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"inversion"}
        {...SVGFilterKnobs.INVERSION_TEXT}
    >
        <PageNumberField
            value={inversion}
            min={SVGFilterKnobs.Tone.MIN_INVERSION}
            max={SVGFilterKnobs.Tone.MAX_INVERSION}
            step={SVGFilterKnobs.Tone.INVERSION_STEP}
            ariaLabel={"Inversion"}
            onInput={(value) => (inversion = value)}
        />
    </PageProp>
</PageExampleKnobs>
