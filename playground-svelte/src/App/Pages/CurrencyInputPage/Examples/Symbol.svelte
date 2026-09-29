<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.svelte";
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
    ariaLabel={"Price with a symbol"}
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

    {#snippet renderLeading(flags)}
        <PageTextFieldAdornment {flags}>£</PageTextFieldAdornment>
    {/snippet}
</CurrencyInput>
