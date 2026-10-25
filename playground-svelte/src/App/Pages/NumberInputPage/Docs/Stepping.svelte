<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { NumberInputSteppingDocsExampleProps } from "../NumberInputPageSvelte.types";

    type Props = NumberInputSteppingDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(13);
</script>

<NumberInput
    bind:value
    min={props.min}
    max={props.max}
    step={props.step}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Quantity"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${value ?? "nothing"}`}</div>
