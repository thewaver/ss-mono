<script lang="ts">
    import { NumberInput, SignalMirrorSvelteUtils } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageNumberInputStepper from "../NumberInputStepper/NumberInputStepper.svelte";
    import { useFieldReset } from "./Field.context";
    import type { PageNumberFieldProps } from "./Field.types";

    const DEFAULT_NUMBER_FIELD_WIDTH = 100;

    let props: PageNumberFieldProps = $props();

    useFieldReset(
        () => props.value,
        (value) => props.onInput(value),
    );

    const [getValue, setValue] = SignalMirrorSvelteUtils.createValueMirror<number | undefined>(
        () => props.value,
        (value) => {
            if (value === undefined) return;

            props.onInput(value);
        },
    );
</script>

<NumberInput
    bind:value={getValue, setValue}
    id={props.id}
    min={props.min}
    max={props.max}
    step={props.step}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={props.width ?? DEFAULT_NUMBER_FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>
