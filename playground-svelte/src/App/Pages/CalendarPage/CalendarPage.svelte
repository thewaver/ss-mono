<script lang="ts">
    import type { DateValue, DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
    import {
        MAX_DATE,
        MAX_YEAR,
        MIN_DATE,
        MIN_YEAR,
        TODAY,
        WEEK_START_LABELS,
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
    import WeekdaysExample from "./Examples/Weekdays.svelte";
    import YearPickerExample from "./Examples/YearPicker.svelte";

    const CALENDAR_FIELD_WIDTH = 180;
    const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";
    const CALENDAR_IDS = DateValueUtils.getCalendarIds();
    const WEEK_STARTS: DateValueWeekStart[] = [...CalendarKnobs.WEEK_STARTS];

    const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

    let calendarId = $state<DateValueCalendarId>(CalendarKnobs.STARTING_CALENDAR);
    let weekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

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

    const defaultMonth = createMonthState();
    const rangedMonth = createMonthState();
    const weekdaysMonth = createMonthState();
    const rightToLeftMonth = createMonthState();

    let monthPickerValue = $state.raw<DateValue | undefined>();
    let yearPickerValue = $state.raw<DateValue | undefined>();
    const monthPickerPage = createMonthState();
    const yearPickerPage = createMonthState();

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultValue)} — month: ${describe(defaultMonth.get())}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () => `min ${describe(MIN_DATE)}, max ${describe(MAX_DATE)} — value: ${describe(rangedValue)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Bounded.svelte`,
        },
        {
            key: "weekdays",
            name: "Weekdays only",
            readout: () => `week starts on ${WEEK_START_LABELS[weekStartsOn]} — value: ${describe(weekdaysValue)}`,
            component: weekdaysExample,
            path: `${EXAMPLES_ROOT}/Weekdays.svelte`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${describe(rightToLeftValue)} — the box around the calendar sets dir="rtl", so each week runs from the right and the right arrow moves to the day before`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "monthPicker",
            name: "Month picker",
            readout: () =>
                `value: ${describe(monthPickerValue)} — precision="month": the grid holds the year's months, a pick sets the first of the month, and the page keys step a year`,
            component: monthPickerExample,
            path: `${EXAMPLES_ROOT}/MonthPicker.svelte`,
        },
        {
            key: "yearPicker",
            name: "Year picker",
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
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={400} />
