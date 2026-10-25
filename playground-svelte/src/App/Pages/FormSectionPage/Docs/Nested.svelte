<script lang="ts">
    import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
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

    type TextState = [() => string, (next: string) => void];

    const FIELD_WIDTH = 240;
    const CARD_DIGITS = 4;

    let street = $state("");
    let card = $state("");
    let outcome = $state("Not ordered yet.");

    const streetMessage = $derived(street.trim().length > 0 ? "" : "We need somewhere to send it.");

    const cardMessage = $derived(/^\d{4}$/.test(card) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`);
</script>

{#snippet renderTextField(state: TextState, hasError: boolean)}
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
    ariaLabel={"Delivery"}
    onSubmit={() => {
        if (streetMessage || cardMessage) return;

        outcome = `Ordered to ${street.trim()}.`;
    }}
>
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
                <Button type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Order</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>

            <div class={exampleStyles.exampleReadout} data-readout>
                {`${state.isValid ? "Ready to send." : "Some fields need attention."} ${outcome}`}
            </div>
        </PageFormStack>
    {/snippet}
</Form>
