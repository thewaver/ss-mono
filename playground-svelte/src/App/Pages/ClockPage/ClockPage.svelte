<script lang="ts">
    import {
        BOOKING_STEPS,
        CLOSING_TIME,
        OPENING_TIME,
    } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import { TimeUtils } from "@thewaver/ss-utils";
    import type { TimeValue } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ClockPage/Examples";

    const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

    let defaultValue = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
    let twelveHourValue = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });
    let boundedValue = $state.raw<TimeValue | undefined>({ hour: 10, minute: 15 });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "One column per unit",
            readout: () =>
                `value: ${describeTime(defaultValue)} — picking an hour and picking a minute are two independent choices, so no column has to list every time of day`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "twelve",
            name: "Twelve hour",
            readout: () =>
                `value: ${describeTime(twelveHourValue)} — am and pm become a column of their own, and the value stays 24-hour`,
            component: twelveExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "bounded",
            name: "Coarser, and bounded",
            readout: () =>
                `value: ${describeTime(boundedValue)} — quarter hours only, inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} ariaLabel={"Appointment time"} />
{/snippet}

{#snippet twelveExample()}
    <DefaultExample bind:value={twelveHourValue} isTwelveHour={true} ariaLabel={"Call time"} />
{/snippet}

{#snippet boundedExample()}
    <DefaultExample
        bind:value={boundedValue}
        steps={BOOKING_STEPS}
        minValue={OPENING_TIME}
        maxValue={CLOSING_TIME}
        ariaLabel={"Booking time"}
    />
{/snippet}

<PageExamples items={examples} />
