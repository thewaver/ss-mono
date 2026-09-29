<script lang="ts">
    import { Label, TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, MAX_ROWS, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TextAreaExampleProps } from "../TextAreaPage.types";

    const LABEL_GAP = 5;

    type Props = TextAreaExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Bio</PageLabelCaption>

    <TextArea
        bind:value
        isAutoSizing={true}
        minRows={MIN_ROWS}
        maxRows={MAX_ROWS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} isStretched={true} />
        {/snippet}
    </TextArea>
</Label>
