<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import { STARTING_PRICE } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    const FIELD_WIDTH = 200;

    let value = $state<number | undefined>(STARTING_PRICE);
</script>

<CurrencyInput
    bind:value
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Price"}
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
