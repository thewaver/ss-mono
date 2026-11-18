<script lang="ts">
    import { FormField, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageTextFieldContent from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

    let value = $state("");
</script>

<div dir={"rtl"}>
    <FormField message={RIGHT_TO_LEFT_MESSAGE}>
        {#snippet renderCaption()}
            <PageFormFieldCaption>Display name</PageFormFieldCaption>
        {/snippet}

        {#snippet renderMessage(state)}
            <PageFormFieldMessage {state}>{RIGHT_TO_LEFT_MESSAGE}</PageFormFieldMessage>
        {/snippet}

        {#snippet renderControl(state)}
            <TextInput
                bind:value
                hasError={state.hasError}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
            >
                {#snippet renderContent(flags)}
                    <PageTextFieldContent {flags} />
                {/snippet}
            </TextInput>
        {/snippet}
    </FormField>
</div>
