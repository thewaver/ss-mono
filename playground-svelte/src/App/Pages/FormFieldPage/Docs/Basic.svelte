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
    import type { FormFieldBasicDocsExampleProps } from "../FormFieldPageSvelte.types";

    type Props = FormFieldBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state("");
</script>

<FormField
    orientation={props.orientation}
    gap={props.gap}
    hasError={props.hasError}
    isRequired={props.isRequired}
    message={props.message}
>
    {#snippet renderCaption(state)}
        <PageFormFieldCaption>Display name{state.isRequired ? " *" : ""}</PageFormFieldCaption>
    {/snippet}

    {#snippet renderMessage(state)}
        <PageFormFieldMessage {state}>{props.message}</PageFormFieldMessage>
    {/snippet}

    {#snippet renderControl(state)}
        <TextInput
            bind:value
            hasError={state.hasError}
            isRequired={state.isRequired}
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
