<script lang="ts">
    import type { ValuePair } from "@thewaver/ss-components-svelte";
    import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    const FIELD_WIDTH = 240;
    const MIN_PASSWORD_LENGTH = 8;

    let email = $state("");
    let password = $state("");
    let terms = $state(false);
    let outcome = $state("Not sent yet.");

    const hasEmailError = $derived(!email.includes("@"));

    const computeEmailMessage = () => {
        if (email.length < 1) return "Enter your email.";

        return hasEmailError ? "That does not look like an email address." : "We only use it to sign you in.";
    };

    const emailMessage = $derived(computeEmailMessage());

    const passwordMessage = $derived(
        password.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`,
    );

    const isComplete = $derived(!hasEmailError && !passwordMessage && terms);
</script>

{#snippet renderTextField(state: ValuePair<string>, hasError: boolean)}
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

<Form
    ariaLabel={"Sign up"}
    onSubmit={() => {
        if (!isComplete) return;

        outcome = `Sent as ${email}.`;
    }}
    onReset={() => {
        email = "";
        password = "";
        terms = false;
        outcome = "Not sent yet.";
    }}
>
    {#snippet renderContent(state)}
        <PageFormStack>
            <FormField hasError={hasEmailError} message={emailMessage}>
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

            <FormField hasError={passwordMessage.length > 0} message={passwordMessage}>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Password</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>{passwordMessage}</PageFormFieldMessage>
                {/snippet}

                {#snippet renderControl(fieldState)}
                    {@render renderTextField([() => password, (next) => (password = next)], fieldState.hasError)}
                {/snippet}
            </FormField>

            <FormField orientation={"horizontal"} hasError={!terms} message={terms ? "" : "Required."}>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Accept the terms</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>Required.</PageFormFieldMessage>
                {/snippet}

                {#snippet renderControl(fieldState)}
                    <Checkbox bind:checked={terms} hasError={fieldState.hasError}>
                        {#snippet renderContent(flags)}
                            <PageCheckboxContent {flags} />
                        {/snippet}
                    </Checkbox>
                {/snippet}
            </FormField>

            <PageFormButtons>
                <Button type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Sign up</PageButtonContent>
                    {/snippet}
                </Button>

                <Button type={"reset"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Reset</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`${state.isValid ? "Ready to send." : "Some fields need attention."} ${outcome}`}
            </div>
        </PageFormStack>
    {/snippet}
</Form>
