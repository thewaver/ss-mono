<script lang="ts">
    import type { DateValueRange } from "@thewaver/ss-components-svelte";
    import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarTitle from "../../../StyledComponents/CalendarContent/PageCalendarTitle.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";

    const MONTH_COUNT = 2;

    let value = $state.raw<DateValueRange | undefined>();
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[() => month, (next) => (month = next)]} itemKey={"twoMonths"} locale={LOCALE} />

    <RangeCalendar
        bind:value
        bind:month
        today={TODAY}
        locale={LOCALE}
        monthCount={MONTH_COUNT}
        ariaLabel={"Choose a date range"}
    >
        {#snippet renderDay(_unused, renderProps)}
            <PageCalendarDay {renderProps} />
        {/snippet}

        {#snippet renderWeekday(name)}
            <PageCalendarWeekday>{name}</PageCalendarWeekday>
        {/snippet}

        {#snippet renderMonthHeader(headerMonth)}
            <PageCalendarTitle flags={{}}>
                {DateValueUtils.format(headerMonth, MONTH_HEADER_OPTIONS, LOCALE)}
            </PageCalendarTitle>
        {/snippet}
    </RangeCalendar>
</PageCalendarFrame>
