<script lang="ts">
    import type {
        CalendarPrecision,
        DateInputEra,
        DateValue,
        InteractionFlags,
        TextFieldFlags,
    } from "@thewaver/ss-components-svelte";
    import { DatePicker, DateValueUtils } from "@thewaver/ss-components-svelte";
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
    import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.svelte";
    import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.svelte";
    import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { DateExampleProps } from "../DatePickerPage.types";

    const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

    type Props = DateExampleProps & {
        itemKey: string;
        precision?: CalendarPrecision;
        minValue?: DateValue;
        maxValue?: DateValue;
        computeIsDayDisabled?: (day: DateValue) => boolean;
    };

    let { value = $bindable(), ...props }: Props = $props();

    const isMonthPrecision = $derived(props.precision === "month");
</script>

<DatePicker
    bind:value
    calendar={props.calendar}
    minValue={props.minValue}
    maxValue={props.maxValue}
    computeIsDayDisabled={props.computeIsDayDisabled}
    precision={props.precision}
    ariaLabel={"Date"}
    calendarLabel={"Choose a date"}
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

    {#snippet renderLeading(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra)}
        <PageEraCycle era={era.value} options={era.options} isDisabled={flags.isDisabled ?? false} onChange={era.set} />
    {/snippet}

    {#snippet renderTrigger(flags)}
        <PageDatePickerTrigger {flags} />
    {/snippet}

    {#snippet renderDay(day, renderProps)}
        {#if isMonthPrecision}
            <PageCalendarCell {renderProps}>
                {DateValueUtils.format(day, MONTH_CELL_OPTIONS, LOCALE)}
            </PageCalendarCell>
        {:else}
            <PageCalendarDay {renderProps} />
        {/if}
    {/snippet}

    {#snippet renderWeekday(name)}
        <PageCalendarWeekday>{name}</PageCalendarWeekday>
    {/snippet}

    {#snippet renderPopup(renderCalendar, month)}
        <PageCalendarFrame>
            {#if isMonthPrecision}
                <PageCalendarPagedCaption
                    itemKey={props.itemKey}
                    locale={LOCALE}
                    precision={"month"}
                    previousLabel={"Previous year"}
                    nextLabel={"Next year"}
                    {month}
                />
            {:else}
                <PageCalendarCaption {month} itemKey={props.itemKey} locale={LOCALE} />
            {/if}

            {@render renderCalendar()}
        </PageCalendarFrame>
    {/snippet}
</DatePicker>
