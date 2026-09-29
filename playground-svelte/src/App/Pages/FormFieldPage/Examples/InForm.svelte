<script lang="ts">
    import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { FormFieldExampleProps } from "../FormFieldPage.types";

    type Props = FormFieldExampleProps;

    const CONTROL_WIDTH = 240;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<Form ariaLabel={"Display name"}>
    {#snippet renderContent(state)}
        <div class={styles.formStack}>
            <FormField
                orientation={props.orientation}
                gap={props.gap}
                hasError={props.hasError}
                message={props.message}
            >
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Display name</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>{props.message}</PageFormFieldMessage>
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
                            <PageTextFieldContent {flags} width={CONTROL_WIDTH} />
                        {/snippet}
                    </TextInput>
                {/snippet}
            </FormField>

            <Button isDisabled={!state.isValid} type={"submit"}>
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Save</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    {/snippet}
</Form>
