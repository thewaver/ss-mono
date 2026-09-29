<script lang="ts">
    import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-svelte";
    import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { CAESAR, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import TypedExample from "./Examples/Typed.svelte";

    const CALENDAR_FIELD_WIDTH = 180;
    const CALENDAR_IDS = DateValueUtils.getCalendarIds();
    const EXAMPLES_ROOT = "/src/App/Pages/DateInputPage/Examples";

    const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

    let calendarId = $state<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    let typedValue = $state.raw<DateValue | undefined>(TODAY);
    let localeValue = $state.raw<DateValue | undefined>(TODAY);
    let eraValue = $state.raw<DateValue | undefined>(CAESAR);

    const examples: ExampleDefs[] = [
        {
            key: "typed",
            name: "Typed only",
            readout: () => `value: ${describe(typedValue)} — a half-typed or impossible date leaves this value alone`,
            component: typedExample,
            path: `${EXAMPLES_ROOT}/Typed.svelte`,
        },
        {
            key: "locale",
            name: "Day first",
            readout: () =>
                `value: ${describe(localeValue)} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
            component: localeExample,
            path: `${EXAMPLES_ROOT}/Typed.svelte`,
        },
        {
            key: "era",
            name: "Before the common era",
            readout: () =>
                `value: ${describe(eraValue)} — the era is a control in the leading slot, offering whatever the calendar reports`,
            component: eraExample,
            path: `${EXAMPLES_ROOT}/Typed.svelte`,
        },
    ];
</script>

{#snippet typedExample()}
    <TypedExample bind:value={typedValue} calendar={calendarId} ariaLabel={"Start date"} />
{/snippet}

{#snippet localeExample()}
    <TypedExample
        bind:value={localeValue}
        calendar={calendarId}
        format={"day-month-year"}
        ariaLabel={"Day-first date"}
    />
{/snippet}

{#snippet eraExample()}
    <TypedExample bind:value={eraValue} calendar={calendarId} ariaLabel={"Historical date"} />
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
            ariaLabel={"Calendar"}
            onChange={(id) => {
                calendarId = id;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
