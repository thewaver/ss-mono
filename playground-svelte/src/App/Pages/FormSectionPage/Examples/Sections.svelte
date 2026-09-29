<script lang="ts">
    import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageFormSectionBody from "../../../StyledComponents/FormFieldContent/PageFormSectionBody.svelte";
    import PageFormSectionCaption from "../../../StyledComponents/FormFieldContent/PageFormSectionCaption.svelte";
    import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { FormSectionTextState, FormSectionsExampleProps } from "../FormSectionPage.types";

    const FIELD_WIDTH = 240;
    const MIN_PASSWORD_LENGTH = 8;
    const MISMATCH_MESSAGE = "The two passwords do not match.";

    type Props = FormSectionsExampleProps;

    let { email = $bindable(), password = $bindable(), confirm = $bindable(), ...props }: Props = $props();

    const emailMessage = $derived(email.includes("@") ? "" : "That does not look like an email address.");

    const passwordMessage = $derived(
        password.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`,
    );

    const hasMismatch = $derived(confirm !== password);
</script>

{#snippet renderTextField(state: FormSectionTextState, hasError?: boolean)}
    <TextInput
        bind:value={state[0], state[1]}
        {hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}
    </TextInput>
{/snippet}

<Form ariaLabel={"Create an account"} onSubmit={props.onSubmit} onReset={props.onReset}>
    {#snippet renderContent(state)}
        <PageFormStack>
            <FormSection>
                {#snippet renderCaption()}
                    <PageFormSectionCaption>Who you are</PageFormSectionCaption>
                {/snippet}

                {#snippet renderContent()}
                    <PageFormSectionBody>
                        <FormField hasError={emailMessage.length > 0} message={emailMessage}>
                            {#snippet renderCaption()}
                                <PageFormFieldCaption>Email</PageFormFieldCaption>
                            {/snippet}

                            {#snippet renderMessage(fieldState)}
                                <PageFormFieldMessage state={fieldState}>{emailMessage}</PageFormFieldMessage>
                            {/snippet}

                            {#snippet renderControl(fieldState)}
                                {@render renderTextField([() => email, (next) => (email = next)], fieldState.hasError)}
                            {/snippet}
                        </FormField>
                    </PageFormSectionBody>
                {/snippet}
            </FormSection>

            <FormSection hasError={hasMismatch} message={hasMismatch ? MISMATCH_MESSAGE : ""}>
                {#snippet renderCaption()}
                    <PageFormSectionCaption>Pick a password</PageFormSectionCaption>
                {/snippet}

                {#snippet renderMessage(sectionState)}
                    <PageFormFieldMessage state={sectionState}>{MISMATCH_MESSAGE}</PageFormFieldMessage>
                {/snippet}

                {#snippet renderContent()}
                    <PageFormSectionBody>
                        <FormField hasError={passwordMessage.length > 0} message={passwordMessage}>
                            {#snippet renderCaption()}
                                <PageFormFieldCaption>Password</PageFormFieldCaption>
                            {/snippet}

                            {#snippet renderMessage(fieldState)}
                                <PageFormFieldMessage state={fieldState}>
                                    {passwordMessage}
                                </PageFormFieldMessage>
                            {/snippet}

                            {#snippet renderControl(fieldState)}
                                {@render renderTextField(
                                    [() => password, (next) => (password = next)],
                                    fieldState.hasError,
                                )}
                            {/snippet}
                        </FormField>

                        <FormField>
                            {#snippet renderCaption()}
                                <PageFormFieldCaption>Repeat it</PageFormFieldCaption>
                            {/snippet}

                            {#snippet renderControl()}
                                {@render renderTextField([() => confirm, (next) => (confirm = next)])}
                            {/snippet}
                        </FormField>
                    </PageFormSectionBody>
                {/snippet}
            </FormSection>

            <PageFormButtons>
                <Button id={"sectionsSubmit"} isDisabled={!state.isValid} type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Create</PageButtonContent>
                    {/snippet}
                </Button>

                <Button type={"reset"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Reset</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>
        </PageFormStack>
    {/snippet}
</Form>
