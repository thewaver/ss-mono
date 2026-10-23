<script lang="ts">
    import type {
        DateValue,
        DateValueCalendarId,
        DateValueMinDaysInFirstWeek,
        DateValueWeekStart,
    } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
    import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    MAX_DATE,
    MAX_YEAR,
    MIN_DATE,
    MIN_YEAR,
    TODAY,
    WEEK_START_LABELS,
    WEEK_STARTS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BoundedExample from "./Examples/Bounded.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import MonthPickerExample from "./Examples/MonthPicker.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import WeekNumbersExample from "./Examples/WeekNumbers.svelte";
    import WeekdaysExample from "./Examples/Weekdays.svelte";
    import YearPickerExample from "./Examples/YearPicker.svelte";

    const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

    let calendarId = $state<DateValueCalendarId>(CalendarKnobs.STARTING_CALENDAR);
    let weekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);
    let minDaysInFirstWeek = $state<DateValueMinDaysInFirstWeek>(CALENDAR_DEFAULTS.minDaysInFirstWeek);

    const createMonthState = () => {
        let month = $state.raw<DateValue>(DateValueUtils.getStartOfMonth(TODAY));

        return {
            get: () => DateValueUtils.withCalendar(month, calendarId),
            set: (next: DateValue) => {
                month = next;
            },
        };
    };

    let defaultValue = $state.raw<DateValue | undefined>(TODAY);
    let rangedValue = $state.raw<DateValue | undefined>();
    let weekdaysValue = $state.raw<DateValue | undefined>();
    let rightToLeftValue = $state.raw<DateValue | undefined>(TODAY);
    let weekNumbersValue = $state.raw<DateValue | undefined>(TODAY);

    const defaultMonth = createMonthState();
    const rangedMonth = createMonthState();
    const weekdaysMonth = createMonthState();
    const rightToLeftMonth = createMonthState();
    const weekNumbersMonth = createMonthState();

    let monthPickerValue = $state.raw<DateValue | undefined>();
    let yearPickerValue = $state.raw<DateValue | undefined>();
    const monthPickerPage = createMonthState();
    const yearPickerPage = createMonthState();

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${describe(defaultValue)} — month: ${describe(defaultMonth.get())}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "bounded",
            name: EXAMPLE_NAMES.bounded,
            readout: () => `min ${describe(MIN_DATE)}, max ${describe(MAX_DATE)} — value: ${describe(rangedValue)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Bounded.svelte`,
        },
        {
            key: "weekdays",
            name: EXAMPLE_NAMES.weekdays,
            readout: () => `week starts on ${WEEK_START_LABELS[weekStartsOn]} — value: ${describe(weekdaysValue)}`,
            component: weekdaysExample,
            path: `${EXAMPLES_ROOT}/Weekdays.svelte`,
        },
        {
            key: "weekNumbers",
            name: EXAMPLE_NAMES.weekNumbers,
            readout: () =>
                `week starts on ${WEEK_START_LABELS[weekStartsOn]}, week one holds at least ${minDaysInFirstWeek} days of the new year — value: ${describe(weekNumbersValue)}`,
            component: weekNumbersExample,
            path: `${EXAMPLES_ROOT}/WeekNumbers.svelte`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${describe(rightToLeftValue)} — the box around the calendar sets dir="rtl", so each week runs from the right and the right arrow moves to the day before`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "monthPicker",
            name: EXAMPLE_NAMES.monthPicker,
            readout: () =>
                `value: ${describe(monthPickerValue)} — precision="month": the grid holds the year's months, a pick sets the first of the month, and the page keys step a year`,
            component: monthPickerExample,
            path: `${EXAMPLES_ROOT}/MonthPicker.svelte`,
        },
        {
            key: "yearPicker",
            name: EXAMPLE_NAMES.yearPicker,
            readout: () =>
                `value: ${describe(yearPickerValue)} — precision="year": twelve years to a page, bounded to ${MIN_YEAR.year}–${MAX_YEAR.year}, and a pick sets the first day of the year`,
            component: yearPickerExample,
            path: `${EXAMPLES_ROOT}/YearPicker.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} bind:month={defaultMonth.get, defaultMonth.set} {weekStartsOn} />
{/snippet}

{#snippet boundedExample()}
    <BoundedExample bind:value={rangedValue} bind:month={rangedMonth.get, rangedMonth.set} {weekStartsOn} />
{/snippet}

{#snippet weekdaysExample()}
    <WeekdaysExample bind:value={weekdaysValue} bind:month={weekdaysMonth.get, weekdaysMonth.set} {weekStartsOn} />
{/snippet}

{#snippet weekNumbersExample()}
    <WeekNumbersExample
        bind:value={weekNumbersValue}
        bind:month={weekNumbersMonth.get, weekNumbersMonth.set}
        {weekStartsOn}
        {minDaysInFirstWeek}
    />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample
        bind:value={rightToLeftValue}
        bind:month={rightToLeftMonth.get, rightToLeftMonth.set}
        {weekStartsOn}
    />
{/snippet}

{#snippet monthPickerExample()}
    <MonthPickerExample bind:value={monthPickerValue} bind:month={monthPickerPage.get, monthPickerPage.set} />
{/snippet}

{#snippet yearPickerExample()}
    <YearPickerExample bind:value={yearPickerValue} bind:month={yearPickerPage.get, yearPickerPage.set} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"calendarId"}
        controls={"Picks the calendar the example puts on the dates sent to CalendarProps.value"}
        label={"Calendar"}
        hint={"Which calendar system the dates are read and written in, such as Gregorian or Islamic."}
    >
        <PageSelectField
            value={calendarId}
            values={CALENDAR_IDS}
            width={CALENDAR_FIELD_WIDTH}
            ariaLabel={"Calendar system"}
            onChange={(id) => {
                calendarId = id;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"weekStartsOn"}
        controls={"Sets CalendarProps.weekStartsOn"}
        label={"Week starts on"}
        hint={"Which day begins a week, which decides the order of the column headings."}
    >
        <PageSelectField
            value={weekStartsOn}
            values={WEEK_STARTS}
            ariaLabel={"Week starts on"}
            computeLabel={(day) => WEEK_START_LABELS[day]}
            onChange={(day) => {
                weekStartsOn = day;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"minDaysInFirstWeek"}
        controls={"Sets CalendarProps.minDaysInFirstWeek"}
        label={"First week holds"}
        hint={"How many days of the new year the first week must hold, which decides the week numbers. 4 is ISO 8601, used across most of Europe; 1 is the United States' count."}
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
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={400} />
