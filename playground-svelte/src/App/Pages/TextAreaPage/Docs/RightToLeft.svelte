<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    const STARTING_TEXT = "One line\nTwo lines\nThree lines, and the third one wraps onto a fourth";

    let value = $state(STARTING_TEXT);
</script>

<div dir={"rtl"}>
    <TextArea
        bind:value
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
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
</div>
