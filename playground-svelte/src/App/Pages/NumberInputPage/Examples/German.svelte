<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import {
        AMOUNT_STEP,
        FIELD_WIDTH,
        GERMAN_LOCALE,
    } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { NumberInputExampleProps } from "../NumberInputPage.types";

    type Props = NumberInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<NumberInput
    bind:value
    locale={GERMAN_LOCALE}
    step={AMOUNT_STEP}
    ariaLabel={"Amount"}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>
