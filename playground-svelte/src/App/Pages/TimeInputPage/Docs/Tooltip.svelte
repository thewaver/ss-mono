<script lang="ts">
    import { TimeInput } from "@thewaver/ss-components-svelte";
    import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TimeInputTooltipDocsExampleProps } from "../TimeInputPageSvelte.types";

    type Props = TimeInputTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
</script>

<TimeInput
    bind:value
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Time with a tooltip"}
    segmentHints={TIME_SEGMENT_HINTS}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}
</TimeInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a time field.</PageTooltipContent>
{/snippet}
