<script lang="ts">
    import { Calendar } from "@thewaver/ss-components-svelte";
    import {
        LOCALE,
        MAX_DATE,
        MIN_DATE,
        TODAY,
    } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import type { CalendarExampleProps } from "../CalendarPage.types";

    type Props = CalendarExampleProps;

    let { value = $bindable(), month = $bindable(), ...props }: Props = $props();
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[() => month, (next) => (month = next)]} itemKey={"bounded"} locale={LOCALE} />

    <Calendar
        bind:value
        bind:month
        today={TODAY}
        locale={LOCALE}
        weekStartsOn={props.weekStartsOn}
        minValue={MIN_DATE}
        maxValue={MAX_DATE}
        ariaLabel={"Choose a date within August"}
    >
        {#snippet renderDay(_unused, renderProps)}
            <PageCalendarDay {renderProps} />
        {/snippet}

        {#snippet renderWeekday(name)}
            <PageCalendarWeekday>{name}</PageCalendarWeekday>
        {/snippet}
    </Calendar>
</PageCalendarFrame>
