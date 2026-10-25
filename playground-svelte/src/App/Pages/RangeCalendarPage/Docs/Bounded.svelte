<script lang="ts">
    import type { DateValueRange } from "@thewaver/ss-components-svelte";
    import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-svelte";
    import { LOCALE, MAX_DATE, MIN_DATE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";

    let value = $state.raw<DateValueRange | undefined>();
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[() => month, (next) => (month = next)]} itemKey={"bounded"} locale={LOCALE} />

    <RangeCalendar
        bind:value
        bind:month
        today={TODAY}
        locale={LOCALE}
        minValue={MIN_DATE}
        maxValue={MAX_DATE}
        ariaLabel={"Choose a date range within the bounds"}
    >
        {#snippet renderDay(_unused, renderProps)}
            <PageCalendarDay {renderProps} />
        {/snippet}

        {#snippet renderWeekday(name)}
            <PageCalendarWeekday>{name}</PageCalendarWeekday>
        {/snippet}
    </RangeCalendar>
</PageCalendarFrame>
