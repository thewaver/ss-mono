<script lang="ts">
    import type { DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
    import { OTHER_CALENDAR, WEEK_START_LABELS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
    import { DOCS_SECTIONS,
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
            {...RangeCalendarKnobs.WEEK_STARTS_ON_TEXT}
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
            {...RangeCalendarKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.earliestLatestDay}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.twoMonths}
/>

<PageDocsExample path={`${DOCS_ROOT}/TwoMonths.svelte`}>
    <TwoMonthsDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.otherCalendarSystems}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            {...RangeCalendarKnobs.CALENDAR_TEXT}
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
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
