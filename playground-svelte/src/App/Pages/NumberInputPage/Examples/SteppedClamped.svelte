<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_WIDTH,
        QUANTITY_MAX,
        QUANTITY_MIN,
        QUANTITY_STEP,
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
    min={QUANTITY_MIN}
    max={QUANTITY_MAX}
    step={QUANTITY_STEP}
    ariaLabel={"Quantity"}
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
