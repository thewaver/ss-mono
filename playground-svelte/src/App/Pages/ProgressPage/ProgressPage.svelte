<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DeterminateExample from "./Examples/Determinate.svelte";
    import DiskMeterExample from "./Examples/DiskMeter.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import FillingContainerExample from "./Examples/FillingContainer.svelte";
    import IndeterminateExample from "./Examples/Indeterminate.svelte";
    import LiveRangeExample from "./Examples/LiveRange.svelte";
    import OutOfRangeExample from "./Examples/OutOfRange.svelte";
    import RingExample from "./Examples/Ring.svelte";
    import type { ProgressExampleProps } from "./ProgressPage.types";

    const UPLOAD_TOTAL_BYTES = 2_400_000;
    const UPLOAD_TICK_MS = 50;
    const UPLOAD_TICK_BYTES = 24_000;
    const EXAMPLES_ROOT = "/src/App/Pages/ProgressPage/Examples";

    let uploadedBytes = $state(0);

    $effect(() => {
        const timer = setInterval(() => {
            uploadedBytes = uploadedBytes >= UPLOAD_TOTAL_BYTES ? 0 : uploadedBytes + UPLOAD_TICK_BYTES;
        }, UPLOAD_TICK_MS);

        return () => {
            clearInterval(timer);
        };
    });

    const commonProps: ProgressExampleProps = $derived({
        uploadedBytes,
        uploadTotalBytes: UPLOAD_TOTAL_BYTES,
    });

    const examples: ExampleDefs[] = [
        {
            key: "determinate",
            name: "Determinate",
            readout: () => "ratio: 0.4 — a plain 0..1 value, which is what the painter is handed",
            component: determinateExample,
            path: `${EXAMPLES_ROOT}/Determinate.svelte`,
        },
        {
            key: "indeterminate",
            name: "Indeterminate",
            readout: () => "no value at all, so aria-valuenow is absent and the painter animates instead",
            component: indeterminateExample,
            path: `${EXAMPLES_ROOT}/Indeterminate.svelte`,
        },
        {
            key: "liveRange",
            name: "Live range",
            readout: () => `${uploadedBytes} of ${UPLOAD_TOTAL_BYTES} bytes — min and max are the real units`,
            component: liveRangeExample,
            path: `${EXAMPLES_ROOT}/LiveRange.svelte`,
        },
        {
            key: "outOfRange",
            name: "Out of range",
            readout: () => "value: 5 against a 0..1 range — clamped rather than drawn past the end",
            component: outOfRangeExample,
            path: `${EXAMPLES_ROOT}/OutOfRange.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => "value: 0.62 — the transfer stalled, and hasError is the owner's to say",
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
        {
            key: "diskMeter",
            name: "Disk usage, as a meter",
            readout: () =>
                'role="meter" — a reading of how full the disk is rather than work that will finish, so it is announced as a gauge and has no indeterminate state',
            component: diskMeterExample,
            path: `${EXAMPLES_ROOT}/DiskMeter.svelte`,
        },
        {
            key: "ring",
            name: "Drawn as a ring",
            readout: () =>
                `${uploadedBytes} of ${UPLOAD_TOTAL_BYTES} bytes — the same upload as the live range, painted round a circle; the component is unchanged`,
            component: ringExample,
            path: `${EXAMPLES_ROOT}/Ring.svelte`,
        },
        {
            key: "fillingContainer",
            name: "Filling its container",
            readout: () => "sizing: fill — the default, since a track's natural width is its container's",
            component: fillingContainerExample,
            path: `${EXAMPLES_ROOT}/FillingContainer.svelte`,
        },
    ];
</script>

{#snippet determinateExample()}
    <DeterminateExample />
{/snippet}

{#snippet indeterminateExample()}
    <IndeterminateExample />
{/snippet}

{#snippet liveRangeExample()}
    <LiveRangeExample {...commonProps} />
{/snippet}

{#snippet outOfRangeExample()}
    <OutOfRangeExample />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample />
{/snippet}

{#snippet diskMeterExample()}
    <DiskMeterExample />
{/snippet}

{#snippet ringExample()}
    <RingExample {...commonProps} />
{/snippet}

{#snippet fillingContainerExample()}
    <FillingContainerExample />
{/snippet}

<PageExamples items={examples} />
