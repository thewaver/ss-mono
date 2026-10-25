<script lang="ts">
    import type { DateValueRange } from "@thewaver/ss-components-svelte";
    import { DateRangePicker } from "@thewaver/ss-components-svelte";
    import {
        CALENDAR_TRIGGER_LABEL,
        DATE_PART_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { LOCALE, PAIR_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import PageDateRangeSeparator from "../DateRangePickerPage.content.svelte";
    import type { DateRangePickerTooltipDocsExampleProps } from "../DateRangePickerPageSvelte.types";

    type Props = DateRangePickerTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValueRange | undefined>();
</script>

<DateRangePicker
    bind:value
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    startLabel={"Start date"}
    endLabel={"End date"}
    calendarLabel={"Choose a date range"}
    partHints={DATE_PART_HINTS}
    locale={LOCALE}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
    triggerId={"tooltipTrigger"}
    triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={PAIR_FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderSeparator()}
        <PageDateRangeSeparator />
    {/snippet}

    {#snippet renderTrigger(flags)}
        <PageDatePickerTrigger {flags} />
    {/snippet}

    {#snippet renderDay(_unused, renderProps)}
        <PageCalendarDay {renderProps} />
    {/snippet}

    {#snippet renderWeekday(name)}
        <PageCalendarWeekday>{name}</PageCalendarWeekday>
    {/snippet}

    {#snippet renderPopup(renderCalendar, month)}
        <PageCalendarFrame>
            <PageCalendarCaption {month} itemKey={"tooltip"} locale={LOCALE} />

            {@render renderCalendar()}
        </PageCalendarFrame>
    {/snippet}
</DateRangePicker>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a date range picker.</PageTooltipContent>
{/snippet}
