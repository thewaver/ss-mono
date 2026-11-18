<script lang="ts">
    import type {
        DateValueCalendarId,
        DateValueMinDaysInFirstWeek,
        DateValueWeekStart,
    } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
    import { DOCS_SECTIONS,
        CALENDAR_FIELD_WIDTH,
        DOCS_ROOT,
        OTHER_CALENDAR,
        WEEK_START_LABELS,
    } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import BoundedDocsExample from "./Docs/Bounded.svelte";
    import CalendarsDocsExample from "./Docs/Calendars.svelte";
    import DisabledDaysDocsExample from "./Docs/DisabledDays.svelte";
    import MonthPickerDocsExample from "./Docs/MonthPicker.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import WeekNumbersDocsExample from "./Docs/WeekNumbers.svelte";
    import YearPickerDocsExample from "./Docs/YearPicker.svelte";

    let weekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    let isDisabled = $state(false);
    let numberedWeekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    let minDaysInFirstWeek = $state<DateValueMinDaysInFirstWeek>(CALENDAR_DEFAULTS.minDaysInFirstWeek);
    let calendarId = $state<DateValueCalendarId>(OTHER_CALENDAR);
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {weekStartsOn} {isDisabled} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"weekStartsOn"}
            {...CalendarKnobs.WEEK_STARTS_ON_TEXT}
        >
            <PageSelectField
                value={weekStartsOn}
                values={CalendarKnobs.WEEK_STARTS}
                ariaLabel={"Week starts on"}
                computeLabel={(day) => WEEK_START_LABELS[day]}
                onChange={(day) => {
                    weekStartsOn = day;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"isDisabled"}
            {...CalendarKnobs.IS_DISABLED_TEXT}
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
    {...DOCS_SECTIONS.unpickableDays}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledDays.svelte`}>
    <DisabledDaysDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.weekNumbers}
/>

<PageDocsExample path={`${DOCS_ROOT}/WeekNumbers.svelte`}>
    <WeekNumbersDocsExample weekStartsOn={numberedWeekStartsOn} {minDaysInFirstWeek} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"numberedWeekStartsOn"}
            {...CalendarKnobs.WEEK_STARTS_ON_TEXT}
        >
            <PageSelectField
                value={numberedWeekStartsOn}
                values={CalendarKnobs.WEEK_STARTS}
                ariaLabel={"Week starts on"}
                computeLabel={(day) => WEEK_START_LABELS[day]}
                onChange={(day) => {
                    numberedWeekStartsOn = day;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"minDaysInFirstWeek"}
            {...CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK_TEXT}
        >
            <PageSelectField
                value={minDaysInFirstWeek}
                values={CalendarKnobs.MIN_DAYS_IN_FIRST_WEEK}
                ariaLabel={"First week holds"}
                computeLabel={(days) => `${days} ${days === 1 ? "day" : "days"}`}
                onChange={(days) => {
                    minDaysInFirstWeek = days;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pickingMonth}
/>

<PageDocsExample path={`${DOCS_ROOT}/MonthPicker.svelte`}>
    <MonthPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.pickingYear}
/>

<PageDocsExample path={`${DOCS_ROOT}/YearPicker.svelte`}>
    <YearPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.otherCalendarSystems}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            {...CalendarKnobs.CALENDAR_TEXT}
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
