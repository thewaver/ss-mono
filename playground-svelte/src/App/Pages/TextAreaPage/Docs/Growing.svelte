<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, LONG_TEXT, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TextAreaGrowingDocsExampleProps } from "../TextAreaPageSvelte.types";

    type Props = TextAreaGrowingDocsExampleProps;

    let props: Props = $props();

    let value = $state(LONG_TEXT);
</script>

<TextArea
    bind:value
    isAutoSizing={true}
    minRows={MIN_ROWS}
    maxRows={props.maxRows}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Message"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} isStretched={true} />
    {/snippet}
</TextArea>

<div class={exampleStyles.exampleReadout} data-readout>{`Length: ${value.length}`}</div>
