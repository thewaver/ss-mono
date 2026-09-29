<script lang="ts">
    import type { DateTimeValue } from "@thewaver/ss-components-svelte";
    import { DateTimeValueUtils, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import { TimeUtils } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PairedExample from "./Examples/Paired.svelte";
    import PickedExample from "./Examples/Picked.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/DateTimePickerPage/Examples";
    const NOON = { hour: 12, minute: 0 };

    const describe = (value: DateTimeValue | undefined) =>
        value
            ? `${DateValueUtils.toIso(value.date)} at ${String(value.time.hour).padStart(2, "0")}:${String(value.time.minute).padStart(2, "0")}`
            : "none";

    let emptyValue = $state.raw<DateTimeValue | undefined>();
    let seededValue = $state.raw<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));
    let pickedValue = $state.raw<DateTimeValue | undefined>();
    let twelveHourValue = $state.raw<DateTimeValue | undefined>();

    const examples: ExampleDefs[] = [
        {
            key: "paired",
            name: "Two fields, one value",
            readout: () => `value: ${describe(emptyValue)}`,
            component: pairedExample,
            path: `${EXAMPLES_ROOT}/Paired.svelte`,
        },
        {
            key: "picked",
            name: "One control, both popups",
            readout: () => `value: ${describe(pickedValue)}`,
            component: pickedExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "twelveHour",
            name: "Twelve hour, with seconds",
            readout: () => `value: ${describe(twelveHourValue)}`,
            component: twelveHourExample,
            path: `${EXAMPLES_ROOT}/Picked.svelte`,
        },
        {
            key: "seeded",
            name: "Starting from a value",
            readout: () =>
                `value: ${describe(seededValue)} — seconds of day: ${
                    seededValue ? TimeUtils.getSecondOfDay(seededValue.time) : 0
                }`,
            component: seededExample,
            path: `${EXAMPLES_ROOT}/Paired.svelte`,
        },
    ];
</script>

{#snippet pairedExample()}
    <PairedExample bind:value={emptyValue} />
{/snippet}

{#snippet pickedExample()}
    <PickedExample bind:value={pickedValue} itemKey={"picked"} />
{/snippet}

{#snippet twelveHourExample()}
    <PickedExample bind:value={twelveHourValue} itemKey={"twelveHour"} isTwelveHour={true} hasSeconds={true} />
{/snippet}

{#snippet seededExample()}
    <PairedExample bind:value={seededValue} />
{/snippet}

<PageExamples items={examples} minColumnWidth={520} />
