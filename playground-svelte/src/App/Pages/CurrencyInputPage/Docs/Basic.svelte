<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import { STARTING_PRICE } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { CurrencyInputBasicDocsExampleProps } from "../CurrencyInputPageSvelte.types";

    const FIELD_WIDTH = 200;

    type Props = CurrencyInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(STARTING_PRICE);
</script>

<CurrencyInput
    bind:value
    isReadOnly={props.isReadOnly}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
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
</CurrencyInput>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${value ?? "nothing"}`}</div>
