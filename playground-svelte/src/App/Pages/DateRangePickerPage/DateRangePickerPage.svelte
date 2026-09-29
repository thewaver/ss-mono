<script lang="ts">
    import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-svelte";
    import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { MAX_DATE, MIN_DATE } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PickedExample from "./Examples/Picked.svelte";

    const CALENDAR_FIELD_WIDTH = 180;
    const EXAMPLES_ROOT = "/src/App/Pages/DateRangePickerPage/Examples";

    const describe = (value: DateValueRange | undefined) =>
        value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

    let calendarId = $state<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    let defaultValue = $state.raw<DateValueRange | undefined>();
    let boundedValue = $state.raw<DateValueRange | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "picked",
            name: "Two fields, one value",
            readout: () => `value: ${describe(defaultValue)}`,
            component: pickedExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
    ];
</script>

{#snippet pickedExample()}
    <PickedExample bind:value={defaultValue} calendar={calendarId} itemKey={"picked"} />
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

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"calendarId"}
        label={"Calendar"}
        hint={"Which calendar system the dates are read and written in, such as Gregorian or Islamic."}
    >
        <PageSelectField
            value={calendarId}
            values={DateValueUtils.getCalendarIds()}
            width={CALENDAR_FIELD_WIDTH}
            ariaLabel={"Calendar system"}
            onChange={(id) => {
                calendarId = id;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={520} />
