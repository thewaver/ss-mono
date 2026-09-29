<script lang="ts">
    import { Calendar, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarPagedCaption from "../../../PageComponents/CalendarCaption/CalendarPagedCaption.svelte";
    import PageCalendarCell from "../../../StyledComponents/CalendarContent/PageCalendarCell.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

    const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

    type Props = CalendarPrecisionExampleProps;

    let { value = $bindable(), month = $bindable() }: Props = $props();
</script>

<PageCalendarFrame>
    <PageCalendarPagedCaption
        itemKey={"monthPicker"}
        locale={LOCALE}
        precision={"month"}
        previousLabel={"Previous year"}
        nextLabel={"Next year"}
        month={[() => month, (next) => (month = next)]}
    />

    <Calendar precision={"month"} bind:value bind:month today={TODAY} locale={LOCALE} ariaLabel={"Choose a month"}>
        {#snippet renderDay(day, renderProps)}
            <PageCalendarCell {renderProps}>
                {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
            </PageCalendarCell>
        {/snippet}
    </Calendar>
</PageCalendarFrame>
