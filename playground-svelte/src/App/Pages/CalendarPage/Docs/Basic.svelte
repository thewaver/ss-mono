<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { Calendar, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import type { CalendarBasicDocsExampleProps } from "../CalendarPageSvelte.types";

    type Props = CalendarBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValue | undefined>(TODAY);
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[() => month, (next) => (month = next)]} itemKey={"basic"} locale={LOCALE} />

    <Calendar
        bind:value
        bind:month
        today={TODAY}
        locale={LOCALE}
        weekStartsOn={props.weekStartsOn}
        isDisabled={props.isDisabled}
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
