<script lang="ts">
    import type {
        DateValueCalendarId,
        DateValueMinDaysInFirstWeek,
        DateValueWeekStart,
    } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
    import {
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
            label={"Week starts on"}
            hint={"Which day begins a week, which decides the order of the column headings."}
            controls={"Sets CalendarProps.weekStartsOn"}
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
            label={"Disabled"}
            hint={"Turns the calendar off: no day can be picked, and the Tab key skips it."}
            controls={"Sets CalendarProps.isDisabled"}
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
    content={"A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the pick between them: the days outside are disabled, and the arrow and page keys stop at the edge."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Bounded.svelte`}>
    <BoundedDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Days that cannot be picked"}
    content={"List the days to refuse in [prop]disabledDays[/prop]: a date, a span from one date to another, everything before or after a date, or days of the week, here Saturday and Sunday. A rule none of those can describe goes in [prop]computeIsDayDisabled[/prop], which is asked about every day shown, so keep it quick."}
/>

<PageDocsExample path={`${DOCS_ROOT}/DisabledDays.svelte`}>
    <DisabledDaysDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Week numbers"}
    content={"Draw [prop]renderWeekNumber[/prop] and each week is headed by its number. Countries count weeks differently, so two settings decide it: [prop]weekStartsOn[/prop], the day a week begins, and [prop]minDaysInFirstWeek[/prop], how many days of the new year the first week must hold. Monday and 4 is ISO 8601, used across most of Europe; Sunday and 1 is the count used in the United States."}
/>

<PageDocsExample path={`${DOCS_ROOT}/WeekNumbers.svelte`}>
    <WeekNumbersDocsExample weekStartsOn={numberedWeekStartsOn} {minDaysInFirstWeek} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"numberedWeekStartsOn"}
            label={"Week starts on"}
            hint={"Which day begins a week, which decides the order of the column headings."}
            controls={"Sets CalendarProps.weekStartsOn"}
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
            label={"First week holds"}
            hint={"How many days of the new year the first week must hold, which decides the week numbers."}
            controls={"Sets CalendarProps.minDaysInFirstWeek"}
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
    title={"Picking a month"}
    content={"Set [prop]precision[/prop] to month and the grid holds the year's months, three to a row. A pick sets the first day of that month, and the page keys step a year."}
/>

<PageDocsExample path={`${DOCS_ROOT}/MonthPicker.svelte`}>
    <MonthPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Picking a year"}
    content={"Set [prop]precision[/prop] to year and the grid holds twelve years, three to a row, and a pick sets the first day of that year. The limits still apply: here only the years from 2019 to 2031 can be picked."}
/>

<PageDocsExample path={`${DOCS_ROOT}/YearPicker.svelte`}>
    <YearPickerDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Other calendar systems"}
    content={"A date carries its own calendar system, and the grid draws the month of whichever calendar the [prop]month[/prop] it is handed is in: its length, its name and its year. Here the month is converted to the chosen calendar, and the picked day stays the same day in any of them."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Calendars.svelte`}>
    <CalendarsDocsExample calendar={calendarId} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"calendar"}
            label={"Calendar"}
            hint={"Which calendar system the month is drawn in."}
            controls={"Converts CalendarProps.month to the chosen calendar"}
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
    content={"Inside a box whose text runs right to left, each week runs from the right, and the right arrow moves to the day before, which is where it is drawn. Up, down and the page keys keep their meaning."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>
