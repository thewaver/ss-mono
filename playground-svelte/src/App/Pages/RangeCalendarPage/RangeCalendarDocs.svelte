<script lang="ts">
    import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
    import { OTHER_CALENDAR, WEEK_START_LABELS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import {
        CALENDAR_FIELD_WIDTH,
        DOCS_ROOT,
    } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import CalendarsDocsExample from "./Docs/Calendars.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import TwoMonthsDocsExample from "./Docs/TwoMonths.svelte";

    let weekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    let isDisabled = $state(false);
    let calendarId = $state<DateValueCalendarId>(OTHER_CALENDAR);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {weekStartsOn} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"weekStartsOn"}
            label={"Week starts on"}
            hint={"Which day begins a week, which decides the order of the column headings."}
            controls={"Sets RangeCalendarProps.weekStartsOn"}
        >
            <PageSelectField
                value={weekStartsOn}
                values={RangeCalendarKnobs.WEEK_STARTS}
                ariaLabel={"Week starts on"}
                computeLabel={(day) => WEEK_START_LABELS[day]}
                onChange={(day) => {
                    weekStartsOn = day;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            label={"Disabled"}
            hint={"Turns the calendar off: no day can be picked, and the Tab key skips it."}
            controls={"Sets RangeCalendarProps.isDisabled"}
        >
            <PageCheckField
                value={isDisabled}
                ariaLabel={"Disabled"}
                onChange={(value) => {
                    isDisabled = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Earliest and latest day"}
    content={"A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep both ends of the range between them: the days outside are disabled, and the arrow and page keys stop at the edge."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Two months"}
    content={"Set [prop]monthCount[/prop] to show several months side by side, so a range can start in one and end in the next. The arrow keys walk from one month into the other, the page keys step them all, and [prop]renderMonthHeader[/prop] draws the title over each."}
/>

<PageDocsExample path={`${DOCS_ROOT}/TwoMonths.svelte`}>
    <TwoMonthsDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Other calendar systems"}
    content={"The grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in. Here the month is converted to the chosen calendar, and a range picked in one calendar covers the same days in any other."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            label={"Calendar"}
            hint={"Which calendar system the month is drawn in."}
            controls={"Converts RangeCalendarProps.month to the chosen calendar"}
        >
            <PageSelectField
                value={calendarId}
                values={DateValueUtils.getCalendarIds()}
                width={CALENDAR_FIELD_WIDTH}
                ariaLabel={"Calendar"}
                onChange={(id) => {
                    calendarId = id;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, each week runs from the right, and the left arrow moves on to the next day, which is where it is drawn. Up, down and the page keys keep their meaning."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
