<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TextAreaBasicDocsExampleProps } from "../TextAreaPageSvelte.types";

    type Props = TextAreaBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state("");
</script>

<TextArea
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    isReadOnly={props.isReadOnly}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    ariaLabel={"Notes"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags} isTopAligned={true}>Notes</PageTextFieldPlaceholder>
    {/snippet}
</TextArea>

<div class={exampleStyles.exampleReadout} data-readout>{`Length: ${value.length}`}</div>
