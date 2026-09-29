<script lang="ts">
    import { FormField, TextInput } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

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

<div class={styles.fieldBox}>
    <FormField
        orientation={props.orientation}
        gap={props.gap}
        hasError={props.hasError}
        isRequired={true}
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
                    <PageTextFieldContent {flags} width={CONTROL_WIDTH} />
                {/snippet}
            </TextInput>
        {/snippet}
    </FormField>
</div>
