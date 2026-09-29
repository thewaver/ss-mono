<script lang="ts">
    import { Button, CalendarUtils, DateValueUtils } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageCalendarHeader from "../../StyledComponents/CalendarContent/PageCalendarHeader.svelte";
    import PageCalendarTitle from "../../StyledComponents/CalendarContent/PageCalendarTitle.svelte";
    import type { PageCalendarPagedCaptionProps } from "./CalendarPagedCaption.types";

    const PAGE_STEP = 1;
    const WEEK_STARTS_ON = 1;
    const YEAR_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };
    const MONTH_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

    let props: PageCalendarPagedCaptionProps = $props();

    const month = $derived(props.month[0]());

    const getTitle = () => {
        if (props.precision === "day") return DateValueUtils.format(month, MONTH_TITLE_OPTIONS, props.locale);
        if (props.precision === "month") return DateValueUtils.format(month, YEAR_OPTIONS, props.locale);

        const cells = CalendarUtils.getCells(month, props.precision, WEEK_STARTS_ON);

        return CalendarUtils.formatSpan(cells[0], cells[cells.length - 1], YEAR_OPTIONS, props.locale);
    };

    const page = (direction: 1 | -1) => {
        props.month[1](CalendarUtils.stepPage(month, props.precision, direction * PAGE_STEP));
    };
</script>

<PageCalendarHeader>
    <Button id={`${props.itemKey}PreviousPage`} ariaLabel={props.previousLabel} onClick={() => page(-1)}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>◀</PageButtonContent>
        {/snippet}
    </Button>

    <PageCalendarTitle flags={{}}>{getTitle()}</PageCalendarTitle>

    <Button id={`${props.itemKey}NextPage`} ariaLabel={props.nextLabel} onClick={() => page(1)}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>▶</PageButtonContent>
        {/snippet}
    </Button>
</PageCalendarHeader>
