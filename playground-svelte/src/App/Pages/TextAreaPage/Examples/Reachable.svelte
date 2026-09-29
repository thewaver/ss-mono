<script lang="ts">
    import { TextArea } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TextAreaExampleProps } from "../TextAreaPage.types";

    type Props = TextAreaExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextArea
    bind:value
    isDisabled={true}
    isReachableWhenDisabled={true}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Disabled but reachable notes"}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
    {/snippet}
</TextArea>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but typing must leave the value alone.
    </PageTooltipContent>
{/snippet}
