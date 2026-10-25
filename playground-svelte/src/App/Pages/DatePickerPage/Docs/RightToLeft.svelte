<script lang="ts">
    import type { DateInputEra, DateValue, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";
    import { DatePicker } from "@thewaver/ss-components-svelte";
    import {
        CALENDAR_TRIGGER_LABEL,
        DATE_PART_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import PageDatePickerTrigger from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    let value = $state.raw<DateValue | undefined>(TODAY);
</script>

<div dir={"rtl"}>
    <DatePicker
        bind:value
        ariaLabel={"Date in a right-to-left box"}
        calendarLabel={"Choose a date"}
        partHints={DATE_PART_HINTS}
        locale={LOCALE}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        triggerId={"rightToLeftTrigger"}
        triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}

        {#snippet renderLeading(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra)}
            <PageEraCycle
                era={era.value}
                options={era.options}
                isDisabled={flags.isDisabled ?? false}
                onChange={era.set}
            />
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
                <PageCalendarCaption {month} itemKey={"rightToLeft"} locale={LOCALE} />

                {@render renderCalendar()}
            </PageCalendarFrame>
        {/snippet}
    </DatePicker>
</div>
