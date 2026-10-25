<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { NumberInputBasicDocsExampleProps } from "../NumberInputPageSvelte.types";

    type Props = NumberInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state<number | undefined>(undefined);
</script>

<NumberInput
    bind:value
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    isReadOnly={props.isReadOnly}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"How many"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>How many</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>
