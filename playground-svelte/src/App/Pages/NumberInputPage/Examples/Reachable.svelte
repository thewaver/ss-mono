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
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { NumberInputExampleProps } from "../NumberInputPage.types";

    type Props = NumberInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<NumberInput
    bind:value
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Disabled but reachable amount"}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <PageNumberInputStepper {flags} {stepper} />
    {/snippet}
</NumberInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the value.
    </PageTooltipContent>
{/snippet}
