<script lang="ts">
    import type { DateValue, DateValueRange } from "@thewaver/ss-components-svelte";
    import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import type { RangeCalendarCalendarsDocsExampleProps } from "../RangeCalendarPageSvelte.types";

    type Props = RangeCalendarCalendarsDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValueRange | undefined>();
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));

    const getMonth = () => DateValueUtils.withCalendar(month, props.calendar);

    const setMonth = (next: DateValue) => {
        month = next;
    };
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[getMonth, setMonth]} itemKey={"calendars"} locale={LOCALE} />

    <RangeCalendar
        bind:value
        bind:month={getMonth, setMonth}
        today={TODAY}
        locale={LOCALE}
        ariaLabel={"Choose a date range"}
    >
        {#snippet renderDay(_unused, renderProps)}
            <PageCalendarDay {renderProps} />
        {/snippet}

        {#snippet renderWeekday(name)}
            <PageCalendarWeekday>{name}</PageCalendarWeekday>
        {/snippet}
    </RangeCalendar>
</PageCalendarFrame>
