<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import { BUDGET_MAX } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { CurrencyInputExampleProps } from "../CurrencyInputPage.types";

    const FIELD_WIDTH = 200;

    type Props = CurrencyInputExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<CurrencyInput
    bind:value
    max={BUDGET_MAX}
    ariaLabel={"Budget"}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    locale={props.locale}
    decimals={props.decimals}
    groupSizes={props.groupSizes}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}
</CurrencyInput>
