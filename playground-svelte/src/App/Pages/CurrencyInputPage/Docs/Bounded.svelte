<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import { STARTING_BUDGET } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { CurrencyInputBoundedDocsExampleProps } from "../CurrencyInputPageSvelte.types";

    const FIELD_WIDTH = 200;

    type Props = CurrencyInputBoundedDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(STARTING_BUDGET);
</script>

<CurrencyInput
    bind:value
    max={props.max}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Budget"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}
</CurrencyInput>
