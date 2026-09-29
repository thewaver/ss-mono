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
    import type { FormSectionNestedExampleProps, FormSectionTextState } from "../FormSectionPage.types";

    const FIELD_WIDTH = 240;
    const CARD_DIGITS = 4;

    type Props = FormSectionNestedExampleProps;

    let { street = $bindable(), card = $bindable(), ...props }: Props = $props();

    const streetMessage = $derived(street.trim().length > 0 ? "" : "We need somewhere to send it.");

    const cardMessage = $derived(/^\d{4}$/.test(card) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`);
</script>

{#snippet renderTextField(state: FormSectionTextState, hasError: boolean)}
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

<Form ariaLabel={"Delivery"} onSubmit={props.onSubmit}>
    {#snippet renderContent(state)}
        <PageFormStack>
            <FormSection ariaLabel={"Delivery"}>
                {#snippet renderCaption()}
                    <PageFormSectionCaption>Delivery</PageFormSectionCaption>
                {/snippet}

                {#snippet renderContent()}
                    <PageFormSectionBody>
                        <FormField hasError={streetMessage.length > 0} message={streetMessage}>
                            {#snippet renderCaption()}
                                <PageFormFieldCaption>Street</PageFormFieldCaption>
                            {/snippet}

                            {#snippet renderMessage(fieldState)}
                                <PageFormFieldMessage state={fieldState}>{streetMessage}</PageFormFieldMessage>
                            {/snippet}

                            {#snippet renderControl(fieldState)}
                                {@render renderTextField(
                                    [() => street, (next) => (street = next)],
                                    fieldState.hasError,
                                )}
                            {/snippet}
                        </FormField>

                        <FormSection ariaLabel={"Payment"}>
                            {#snippet renderCaption()}
                                <PageFormSectionCaption>Payment</PageFormSectionCaption>
                            {/snippet}

                            {#snippet renderContent()}
                                <PageFormSectionBody>
                                    <FormField hasError={cardMessage.length > 0} message={cardMessage}>
                                        {#snippet renderCaption()}
                                            <PageFormFieldCaption>Card ending</PageFormFieldCaption>
                                        {/snippet}

                                        {#snippet renderMessage(fieldState)}
                                            <PageFormFieldMessage state={fieldState}>
                                                {cardMessage}
                                            </PageFormFieldMessage>
                                        {/snippet}

                                        {#snippet renderControl(fieldState)}
                                            {@render renderTextField(
                                                [() => card, (next) => (card = next)],
                                                fieldState.hasError,
                                            )}
                                        {/snippet}
                                    </FormField>
                                </PageFormSectionBody>
                            {/snippet}
                        </FormSection>
                    </PageFormSectionBody>
                {/snippet}
            </FormSection>

            <PageFormButtons>
                <Button isDisabled={!state.isValid} type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Order</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>
        </PageFormStack>
    {/snippet}
</Form>
