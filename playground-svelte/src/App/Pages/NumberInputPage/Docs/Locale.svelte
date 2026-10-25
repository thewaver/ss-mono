<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import { AMOUNT_STEP, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { NumberInputLocaleDocsExampleProps } from "../NumberInputPageSvelte.types";

    type Props = NumberInputLocaleDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(1234.5);
</script>

<NumberInput
    bind:value
    locale={props.locale}
    step={AMOUNT_STEP}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Amount"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>
