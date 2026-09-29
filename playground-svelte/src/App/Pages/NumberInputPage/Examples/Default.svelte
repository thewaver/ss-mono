<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { NumberInputExampleProps } from "../NumberInputPage.types";

    type Props = NumberInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<NumberInput
    bind:value
    ariaLabel={"How many"}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>How many</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>
