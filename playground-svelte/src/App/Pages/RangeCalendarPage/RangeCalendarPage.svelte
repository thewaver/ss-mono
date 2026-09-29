<script lang="ts">
    import type {
        DateValue,
        DateValueCalendarId,
        DateValueRange,
        DateValueWeekStart,
    } from "@thewaver/ss-components-svelte";
    import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
    import {
        MAX_DATE,
        MIN_DATE,
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

    const CALENDAR_FIELD_WIDTH = 180;
    const CALENDAR_IDS = DateValueUtils.getCalendarIds();
    const EXAMPLES_ROOT = "/src/App/Pages/RangeCalendarPage/Examples";

    const describe = (value: DateValueRange | undefined) =>
        value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

    let calendarId = $state<DateValueCalendarId>(RangeCalendarKnobs.STARTING_CALENDAR);
    let weekStartsOn = $state<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

    let defaultValue = $state.raw<DateValueRange | undefined>();
    let boundedValue = $state.raw<DateValueRange | undefined>();

    let defaultMonth = $state.raw<DateValue>(DateValueUtils.getStartOfMonth(TODAY));
    let boundedMonth = $state.raw<DateValue>(DateValueUtils.getStartOfMonth(TODAY));

    const defaultCalendarMonth = $derived(DateValueUtils.withCalendar(defaultMonth, calendarId));
    const boundedCalendarMonth = $derived(DateValueUtils.withCalendar(boundedMonth, calendarId));

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultValue)}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Bounded.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample
        bind:value={defaultValue}
        bind:month={() => defaultCalendarMonth, (next) => (defaultMonth = next)}
        {weekStartsOn}
    />
{/snippet}

{#snippet boundedExample()}
    <BoundedExample
        bind:value={boundedValue}
        bind:month={() => boundedCalendarMonth, (next) => (boundedMonth = next)}
        {weekStartsOn}
    />
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
            values={RangeCalendarKnobs.WEEK_STARTS}
            ariaLabel={"Week starts on"}
            computeLabel={(day) => WEEK_START_LABELS[day]}
            onChange={(day) => {
                weekStartsOn = day;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
