<script lang="ts">
    import { FormField, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    const MESSAGE = "Shown to everyone who can see your posts";

    let value = $state("");
</script>

<div dir={"rtl"}>
    <FormField message={MESSAGE}>
        {#snippet renderCaption()}
            <PageFormFieldCaption>Display name</PageFormFieldCaption>
        {/snippet}

        {#snippet renderMessage(state)}
            <PageFormFieldMessage {state}>{MESSAGE}</PageFormFieldMessage>
        {/snippet}

        {#snippet renderControl(state)}
            <TextInput
                bind:value
                hasError={state.hasError}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
            >
                {#snippet renderContent(flags)}
                    <PageTextFieldContent {flags} />
                {/snippet}
            </TextInput>
        {/snippet}
    </FormField>
</div>
