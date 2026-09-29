<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { DateRangePicker } from "@thewaver/ss-components-svelte";
    import {
        CALENDAR_TRIGGER_LABEL,
        DATE_PART_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
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
    import PageDateRangeSeparator from "../DateRangePickerPage.content.svelte";
    import type { DateRangeExampleProps } from "../DateRangePickerPage.types";

    type Props = DateRangeExampleProps & {
        itemKey: string;
        minValue?: DateValue;
        maxValue?: DateValue;
    };

    let { value = $bindable(), ...props }: Props = $props();
</script>

<DateRangePicker
    bind:value
    calendar={props.calendar}
    minValue={props.minValue}
    maxValue={props.maxValue}
    startLabel={"Start date"}
    endLabel={"End date"}
    calendarLabel={"Choose a date range"}
    partHints={DATE_PART_HINTS}
    locale={LOCALE}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    triggerId={`${props.itemKey}Trigger`}
    triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
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
            <PageCalendarCaption {month} itemKey={props.itemKey} locale={LOCALE} />

            {@render renderCalendar()}
        </PageCalendarFrame>
    {/snippet}
</DateRangePicker>
