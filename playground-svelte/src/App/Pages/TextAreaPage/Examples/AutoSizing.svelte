<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TextAreaExampleProps } from "../TextAreaPage.types";

    type Props = TextAreaExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextArea
    bind:value
    isAutoSizing={true}
    minRows={MIN_ROWS}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Message"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} isStretched={true} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags} isTopAligned={true}>Type across several lines</PageTextFieldPlaceholder>
    {/snippet}
</TextArea>
