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
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT } from "@thewaver/ss-playground/App/Pages/ClockPage/ClockPage.const";

    const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

    let defaultValue = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
    let twelveHourValue = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });
    let boundedValue = $state.raw<TimeValue | undefined>({ hour: 10, minute: 15 });
    let rightToLeftValue = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `value: ${describeTime(defaultValue)} — picking an hour and picking a minute are two independent choices, so no column has to list every time of day`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "twelve",
            name: EXAMPLE_NAMES.twelve,
            readout: () =>
                `value: ${describeTime(twelveHourValue)} — am and pm become a column of their own, and the value stays 24-hour`,
            component: twelveExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "bounded",
            name: EXAMPLE_NAMES.bounded,
            readout: () =>
                `value: ${describeTime(boundedValue)} — quarter hours only, inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: boundedExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${describeTime(rightToLeftValue)} — the box around the clock sets dir="rtl", so the hour column sits on the right and the left arrow moves on to the minutes`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
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

{#snippet rightToLeftExample()}
    <RightToLeftExample bind:value={rightToLeftValue} />
{/snippet}

<PageExamples items={examples} />
