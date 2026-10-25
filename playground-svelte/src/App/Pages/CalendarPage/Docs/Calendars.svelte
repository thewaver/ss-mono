<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { Calendar, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import type { CalendarCalendarsDocsExampleProps } from "../CalendarPageSvelte.types";

    type Props = CalendarCalendarsDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValue | undefined>(TODAY);
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));

    const getMonth = () => DateValueUtils.withCalendar(month, props.calendar);

    const setMonth = (next: DateValue) => {
        month = next;
    };
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[getMonth, setMonth]} itemKey={"calendars"} locale={LOCALE} />

    <Calendar
        bind:value
        bind:month={getMonth, setMonth}
        today={TODAY}
        locale={LOCALE}
        ariaLabel={"Choose a date"}
    >
        {#snippet renderDay(_unused, renderProps)}
            <PageCalendarDay {renderProps} />
        {/snippet}

        {#snippet renderWeekday(name)}
            <PageCalendarWeekday>{name}</PageCalendarWeekday>
        {/snippet}
    </Calendar>
</PageCalendarFrame>
