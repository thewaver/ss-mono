<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TextInputExampleProps } from "../TextInputPage.types";

    type Props = TextInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Disabled but reachable field"}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}
</TextInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but typing must leave the value alone.
    </PageTooltipContent>
{/snippet}
