<script lang="ts">
    import { Calendar, DateValueUtils } from "@thewaver/ss-components-svelte";
    import {
        LOCALE,
        MAX_YEAR,
        MIN_YEAR,
        TODAY,
    } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.svelte";
    import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

    const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

    type Props = CalendarPrecisionExampleProps;

    let { value = $bindable(), month = $bindable() }: Props = $props();
</script>

<PageCalendarFrame>
    <PageCalendarPagedCaption
        itemKey={"yearPicker"}
        locale={LOCALE}
        precision={"year"}
        previousLabel={"Previous twelve years"}
        nextLabel={"Next twelve years"}
        month={[() => month, (next) => (month = next)]}
    />

    <Calendar
        precision={"year"}
        bind:value
        bind:month
        today={TODAY}
        minValue={MIN_YEAR}
        maxValue={MAX_YEAR}
        locale={LOCALE}
        ariaLabel={"Choose a year"}
    >
        {#snippet renderDay(day, renderProps)}
            <PageCalendarCell {renderProps}>
                {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
            </PageCalendarCell>
        {/snippet}
    </Calendar>
</PageCalendarFrame>
