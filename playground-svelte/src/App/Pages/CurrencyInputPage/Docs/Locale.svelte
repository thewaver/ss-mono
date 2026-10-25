<script lang="ts">
    import { CurrencyInput } from "@thewaver/ss-components-svelte";
    import { STARTING_BIG } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { CurrencyInputLocaleDocsExampleProps } from "../CurrencyInputPageSvelte.types";

    const FIELD_WIDTH = 200;

    type Props = CurrencyInputLocaleDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(STARTING_BIG);
</script>

<CurrencyInput
    bind:value
    locale={props.locale}
    decimals={props.decimals}
    groupSizes={props.groupSizes}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Large amount"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}
</CurrencyInput>
