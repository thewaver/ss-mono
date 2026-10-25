<script lang="ts">
    import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { FormFieldInFormDocsExampleProps } from "../FormFieldPageSvelte.types";

    const HINT = "Shown to everyone who can see your posts.";
    const ERROR = "That name is already taken.";

    type Props = FormFieldInFormDocsExampleProps;

    let props: Props = $props();

    let value = $state("");
    let outcome = $state("Not saved yet.");

    const message = $derived(props.hasError ? ERROR : HINT);
</script>

<Form
    ariaLabel={"Profile"}
    onSubmit={() => {
        if (props.hasError) return;

        outcome = `Saved as ${value || "nothing"}.`;
    }}
>
    {#snippet renderContent(state)}
        <PageFormStack>
            <FormField hasError={props.hasError} {message}>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Display name</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>{message}</PageFormFieldMessage>
                {/snippet}

                {#snippet renderControl(fieldState)}
                    <TextInput
                        bind:value
                        hasError={fieldState.hasError}
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

            <PageFormButtons>
                <Button type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Save</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`${state.isValid ? "Ready to send." : "Some fields need attention."} ${outcome}`}
            </div>
        </PageFormStack>
    {/snippet}
</Form>
