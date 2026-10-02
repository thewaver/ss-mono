<script lang="ts">
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import HeadingExample from "./Examples/Heading.svelte";
    import type { PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

    let { width, ...props }: PaintedTextExampleWrapperProps = $props();

    let fontSize = $state(PaintedTextKnobs.STARTING_FONT_SIZE);
    let lineHeight = $state(PaintedTextKnobs.STARTING_LINE_HEIGHT);
    let fontWeight = $state(PaintedTextKnobs.STARTING_FONT_WEIGHT);
</script>

<PageMeasureBox {width} padding={MEASURE_BOX_PADDING}>
    <HeadingExample {...props} {fontSize} {lineHeight} {fontWeight} />
</PageMeasureBox>

<PageExampleKnobs>
    <PageProp itemKey={"fontSize"} label={"Font size (px)"} hint={"How large the letters are."}>
        <PageNumberField
            value={fontSize}
            min={PaintedTextKnobs.MIN_FONT_SIZE}
            max={PaintedTextKnobs.MAX_FONT_SIZE}
            step={PaintedTextKnobs.FONT_SIZE_STEP}
            ariaLabel={"Font size in pixels"}
            onInput={(value) => {
                fontSize = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"lineHeight"}
        label={"Line height"}
        hint={"How tall each line is, as a multiple of the font size, which decides how far apart the lines sit."}
    >
        <PageNumberField
            value={lineHeight}
            min={PaintedTextKnobs.MIN_LINE_HEIGHT}
            max={PaintedTextKnobs.MAX_LINE_HEIGHT}
            step={PaintedTextKnobs.LINE_HEIGHT_STEP}
            ariaLabel={"Line height"}
            onInput={(value) => {
                lineHeight = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"fontWeight"} label={"Font weight"} hint={"How heavy the letters are, from 100 to 900."}>
        <PageNumberField
            value={fontWeight}
            min={PaintedTextKnobs.MIN_FONT_WEIGHT}
            max={PaintedTextKnobs.MAX_FONT_WEIGHT}
            step={PaintedTextKnobs.FONT_WEIGHT_STEP}
            ariaLabel={"Font weight"}
            onInput={(value) => {
                fontWeight = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
