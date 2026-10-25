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
    import type { TextAreaTooltipDocsExampleProps } from "../TextAreaPageSvelte.types";

    type Props = TextAreaTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state("Hover or focus me");
</script>

<TextArea
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Notes with a tooltip"}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
    {/snippet}
</TextArea>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a text area.</PageTooltipContent>
{/snippet}
