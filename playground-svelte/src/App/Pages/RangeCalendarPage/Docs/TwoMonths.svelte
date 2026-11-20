<script lang="ts">
    import type { DateValueRange } from "@thewaver/ss-components-svelte";
    import { Button, DateValueUtils, RangeCalendar } from "@thewaver/ss-components-svelte";
    import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageCalendarDay from "../../../StyledComponents/CalendarContent/PageCalendarDay.svelte";
    import PageCalendarFrame from "../../../StyledComponents/CalendarContent/PageCalendarFrame.svelte";
    import PageCalendarHeader from "../../../StyledComponents/CalendarContent/PageCalendarHeader.svelte";
    import PageCalendarTitle from "../../../StyledComponents/CalendarContent/PageCalendarTitle.svelte";
    import PageCalendarWeekday from "../../../StyledComponents/CalendarContent/PageCalendarWeekday.svelte";

    const MONTH_COUNT = 2;
    const MONTH_STEP = 1;

    let value = $state.raw<DateValueRange | undefined>();
    let month = $state.raw(DateValueUtils.getStartOfMonth(TODAY));

    const page = (direction: 1 | -1) => {
        month = DateValueUtils.addMonths(month, direction * MONTH_STEP);
    };
</script>

<PageCalendarFrame>
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

        {#snippet renderMonthHeader(headerMonth, index)}
            <PageCalendarHeader>
                {#if index === 0}
                    <Button id={"twoMonthsPreviousMonth"} ariaLabel={"Previous month"} onClick={() => page(-1)}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>◀</PageButtonContent>
                        {/snippet}
                    </Button>
                {/if}

                <PageCalendarTitle flags={{}}>
                    {DateValueUtils.format(headerMonth, MONTH_HEADER_OPTIONS, LOCALE)}
                </PageCalendarTitle>

                {#if index === MONTH_COUNT - 1}
                    <Button id={"twoMonthsNextMonth"} ariaLabel={"Next month"} onClick={() => page(1)}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>▶</PageButtonContent>
                        {/snippet}
                    </Button>
                {/if}
            </PageCalendarHeader>
        {/snippet}
    </RangeCalendar>
</PageCalendarFrame>
