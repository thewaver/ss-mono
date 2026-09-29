<script lang="ts">
    import { CLOSING_TIME, OPENING_TIME } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import { TimeUtils } from "@thewaver/ss-utils";
    import type { TimeValue } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import TimeExample from "./Examples/Time.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/TimeInputPage/Examples";

    const describeTime = (value: TimeValue | undefined) => (value ? TimeUtils.toIso(value) : "none");

    let time = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30 });
    let twelveHour = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });
    let precise = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
    let shift = $state.raw<TimeValue | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "time",
            name: "A time, typed or stepped",
            readout: () => `value: ${describeTime(time)} — the arrows step whichever segment the caret is in`,
            component: timeExample,
            path: `${EXAMPLES_ROOT}/Time.svelte`,
        },
        {
            key: "twelve",
            name: "Twelve hour",
            readout: () => `value: ${describeTime(twelveHour)} — the value stays 24-hour, the field reads it as 12`,
            component: twelveExample,
            path: `${EXAMPLES_ROOT}/Time.svelte`,
        },
        {
            key: "precise",
            name: "To the second",
            readout: () => `value: ${describeTime(precise)} — three segments instead of two`,
            component: preciseExample,
            path: `${EXAMPLES_ROOT}/Time.svelte`,
        },
        {
            key: "shift",
            name: "Within opening hours",
            readout: () =>
                `value: ${describeTime(shift)} — ${TimeUtils.toIso(OPENING_TIME)} to ${TimeUtils.toIso(CLOSING_TIME)}`,
            component: shiftExample,
            path: `${EXAMPLES_ROOT}/Time.svelte`,
        },
    ];
</script>

{#snippet timeExample()}
    <TimeExample bind:value={time} ariaLabel={"Start time"} />
{/snippet}

{#snippet twelveExample()}
    <TimeExample bind:value={twelveHour} isTwelveHour={true} ariaLabel={"Meeting time"} />
{/snippet}

{#snippet preciseExample()}
    <TimeExample bind:value={precise} hasSeconds={true} ariaLabel={"Exact time"} />
{/snippet}

{#snippet shiftExample()}
    <TimeExample bind:value={shift} minValue={OPENING_TIME} maxValue={CLOSING_TIME} ariaLabel={"Shift start"} />
{/snippet}

<PageExamples items={examples} />
