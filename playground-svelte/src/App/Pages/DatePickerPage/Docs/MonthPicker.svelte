<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { DatePicker, DateValueUtils } from "@thewaver/ss-components-svelte";
    import {
        CALENDAR_TRIGGER_LABEL,
        DATE_PART_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.svelte";
    import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

    let value = $state.raw<DateValue | undefined>();

    const valueText = $derived(value ? DateValueUtils.toIso(value) : "nothing");
</script>

<DatePicker
    bind:value
    precision={"month"}
    ariaLabel={"Month"}
    calendarLabel={"Choose a month"}
    partHints={DATE_PART_HINTS}
    locale={LOCALE}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    triggerId={"monthPickerTrigger"}
    triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderTrigger(flags)}
        <PageDatePickerTrigger {flags} />
    {/snippet}

    {#snippet renderDay(day, renderProps)}
        <PageCalendarCell {renderProps}>
            {DateValueUtils.format(day, MONTH_CELL_OPTIONS, LOCALE)}
        </PageCalendarCell>
    {/snippet}

    {#snippet renderPopup(renderCalendar, month)}
        <PageCalendarFrame>
            <PageCalendarPagedCaption
                itemKey={"monthPicker"}
                locale={LOCALE}
                precision={"month"}
                previousLabel={"Previous year"}
                nextLabel={"Next year"}
                {month}
            />

            {@render renderCalendar()}
        </PageCalendarFrame>
    {/snippet}
</DatePicker>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>
