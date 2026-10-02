<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import CustomInputExample from "./Examples/CustomInput.svelte";
    import type { PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

    let { width, ...props }: PaintedTextExampleWrapperProps = $props();

    let text = $state(PaintedTextKnobs.STARTING_CUSTOM_TEXT);
</script>

<TextArea
    bind:value={text}
    isAutoSizing={true}
    minRows={PaintedTextKnobs.CUSTOM_TEXT_MIN_ROWS}
    maxRows={PaintedTextKnobs.CUSTOM_TEXT_MAX_ROWS}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Custom text"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={PaintedTextKnobs.CUSTOM_TEXT_WIDTH} isStretched={true} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags} isTopAligned={true}>Put custom text inside me</PageTextFieldPlaceholder>
    {/snippet}
</TextArea>

<PageMeasureBox {width} padding={MEASURE_BOX_PADDING}>
    <CustomInputExample {...props} {text} />
</PageMeasureBox>
