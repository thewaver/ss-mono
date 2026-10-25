<script lang="ts">
    import type { DateTimeValue } from "@thewaver/ss-components-svelte";
    import { DateTimePicker } from "@thewaver/ss-components-svelte";
    import {
        CALENDAR_TRIGGER_LABEL,
        CLOCK_TRIGGER_LABEL,
        DATE_PART_HINTS,
        TIME_SEGMENT_HINTS,
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
    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import PageDateTimeSeparator from "../DateTimePickerPage.content.svelte";
    import type { DateTimePickerTooltipDocsExampleProps } from "../DateTimePickerPageSvelte.types";

    type Props = DateTimePickerTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateTimeValue | undefined>();
</script>

<DateTimePicker
    bind:value
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    dateLabel={"Date"}
    timeLabel={"Time"}
    calendarLabel={"Choose a date"}
    clockLabel={"Choose a time"}
    partHints={DATE_PART_HINTS}
    segmentHints={TIME_SEGMENT_HINTS}
    locale={LOCALE}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
    triggerId={"tooltipDateTrigger"}
    triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
    timeTriggerId={"tooltipTimeTrigger"}
    timeTriggerAriaLabel={CLOCK_TRIGGER_LABEL}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={PAIR_FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderSeparator()}
        <PageDateTimeSeparator />
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

    {#snippet renderTimeTrigger(flags)}
        <PageTimePickerTrigger {flags} />
    {/snippet}

    {#snippet renderOption(_unused, renderProps)}
        <PageClockOption {renderProps} />
    {/snippet}

    {#snippet renderUnit(name)}
        <PageClockUnit>{name}</PageClockUnit>
    {/snippet}

    {#snippet renderColumn(renderOptions)}
        <PageClockColumn>{@render renderOptions()}</PageClockColumn>
    {/snippet}

    {#snippet renderTimePopup(renderClock)}
        <PageClockFrame>{@render renderClock()}</PageClockFrame>
    {/snippet}
</DateTimePicker>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a date and time picker.</PageTooltipContent>
{/snippet}
