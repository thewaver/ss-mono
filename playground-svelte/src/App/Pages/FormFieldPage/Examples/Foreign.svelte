<script lang="ts">
    import { FormField } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import type { FormFieldExampleProps } from "../FormFieldPage.types";
    import ForeignInput from "./ForeignInput.svelte";

    type Props = FormFieldExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.fieldBox}>
    <FormField orientation={props.orientation} gap={props.gap} hasError={props.hasError} message={props.message}>
        {#snippet renderCaption()}
            <PageFormFieldCaption>Display name</PageFormFieldCaption>
        {/snippet}

        {#snippet renderMessage(state)}
            <PageFormFieldMessage {state}>{props.message}</PageFormFieldMessage>
        {/snippet}

        {#snippet renderControl()}
            <ForeignInput bind:value />
        {/snippet}
    </FormField>
</div>
