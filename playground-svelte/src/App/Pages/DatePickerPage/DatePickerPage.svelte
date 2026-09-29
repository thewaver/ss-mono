<script lang="ts">
    import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { MAX_DATE, MIN_DATE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PickedExample from "./Examples/Picked.svelte";

    const CALENDAR_FIELD_WIDTH = 180;
    const CALENDAR_IDS = DateValueUtils.getCalendarIds();
    const WEEK_STARTS_ON_MONDAY = 1;
    const WEEKEND_OFFSET = 5;
    const EXAMPLES_ROOT = "/src/App/Pages/DatePickerPage/Examples";

    const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

    const getIsWeekend = (day: DateValue) =>
        DateValueUtils.getWeekdayOffset(day, WEEK_STARTS_ON_MONDAY) >= WEEKEND_OFFSET;

    let calendarId = $state<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    let pickedValue = $state.raw<DateValue | undefined>();
    let boundedValue = $state.raw<DateValue | undefined>();
    let weekdayValue = $state.raw<DateValue | undefined>();
    let monthValue = $state.raw<DateValue | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "picked",
            name: "With a calendar",
            readout: () => `value: ${describe(pickedValue)} — typing and picking write the same signal`,
            component: pickedExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `value: ${describe(boundedValue)} — ${DateValueUtils.toIso(MIN_DATE)} to ${DateValueUtils.toIso(MAX_DATE)}, typed or picked`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "weekdays",
            name: "Weekdays only",
            readout: () =>
                `value: ${describe(weekdayValue)} — the calendar refuses a weekend, and typing one reports it as an error`,
            component: weekdaysExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "monthPrecision",
            name: "Picking a month",
            readout: () =>
                `value: ${describe(monthValue)} — precision="month" is handed to the calendar, so a pick there sets the first of the month; the field still takes a whole date`,
            component: monthPrecisionExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
    ];
</script>

{#snippet pickedExample()}
    <PickedExample bind:value={pickedValue} calendar={calendarId} itemKey={"picked"} />
{/snippet}

{#snippet boundedExample()}
    <PickedExample
        bind:value={boundedValue}
        calendar={calendarId}
        itemKey={"bounded"}
        minValue={MIN_DATE}
        maxValue={MAX_DATE}
    />
{/snippet}

{#snippet weekdaysExample()}
    <PickedExample
        bind:value={weekdayValue}
        calendar={calendarId}
        itemKey={"weekdays"}
        computeIsDayDisabled={getIsWeekend}
    />
{/snippet}

{#snippet monthPrecisionExample()}
    <PickedExample bind:value={monthValue} calendar={calendarId} itemKey={"monthPrecision"} precision={"month"} />
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
</PagePropsPanel>

<PageExamples items={examples} />
