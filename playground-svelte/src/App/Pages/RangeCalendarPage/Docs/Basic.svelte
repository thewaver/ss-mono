<script lang="ts">
    import type { DateValueRange } from "@thewaver/ss-components-svelte";
    import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageCalendarCaption from "../../../PageComponents/CalendarCaption/CalendarCaption.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";
    import type { RangeCalendarBasicDocsExampleProps } from "../RangeCalendarPageSvelte.types";

    type Props = RangeCalendarBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValueRange | undefined>();
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));

    const valueText = $derived(
        value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "nothing",
    );
</script>

<PageCalendarFrame>
    <PageCalendarCaption month={[() => month, (next) => (month = next)]} itemKey={"basic"} locale={LOCALE} />

    <RangeCalendar
        bind:value
        bind:month
        today={TODAY}
        locale={LOCALE}
        weekStartsOn={props.weekStartsOn}
        isDisabled={props.isDisabled}
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

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>
