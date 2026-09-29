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
    import ClockedExample from "./Examples/Clocked.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/TimePickerPage/Examples";

    const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

    let clocked = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
    let clockedTwelve = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });
    let booking = $state.raw<TimeValue | undefined>({ hour: 10, minute: 15 });

    const examples: ExampleDefs[] = [
        {
            key: "clocked",
            name: "With a clock",
            readout: () =>
                `value: ${describeTime(clocked)} — one column per unit, so typing and picking cover the same times`,
            component: clockedExample,
            path: `${EXAMPLES_ROOT}/Clocked.svelte`,
        },
        {
            key: "clockedTwelve",
            name: "Twelve hour, with a clock",
            readout: () =>
                `value: ${describeTime(clockedTwelve)} — the am/pm control and the clock trigger share the trailing slot`,
            component: clockedTwelveExample,
            path: `${EXAMPLES_ROOT}/Clocked.svelte`,
        },
        {
            key: "booking",
            name: "Every fifteen minutes",
            readout: () =>
                `value: ${describeTime(booking)} — a coarser minute column, still inside ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: bookingExample,
            path: `${EXAMPLES_ROOT}/Clocked.svelte`,
        },
    ];
</script>

{#snippet clockedExample()}
    <ClockedExample bind:value={clocked} itemKey={"clocked"} ariaLabel={"Appointment time"} />
{/snippet}

{#snippet clockedTwelveExample()}
    <ClockedExample bind:value={clockedTwelve} itemKey={"clockedTwelve"} isTwelveHour={true} ariaLabel={"Call time"} />
{/snippet}

{#snippet bookingExample()}
    <ClockedExample
        bind:value={booking}
        itemKey={"booking"}
        clockSteps={BOOKING_STEPS}
        minValue={OPENING_TIME}
        maxValue={CLOSING_TIME}
        ariaLabel={"Booking time"}
    />
{/snippet}

<PageExamples items={examples} />
