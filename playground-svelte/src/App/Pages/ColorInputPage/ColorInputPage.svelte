<script lang="ts">
    import { PALETTE } from "@thewaver/ss-playground/App/Pages/ColorInputPage/ColorInputPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import CompactExample from "./Examples/Compact.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import LabeledExample from "./Examples/Labeled.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import SnappingExample from "./Examples/Snapping.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ColorInputPage/Examples";

    let defaultValue = $state("#3366ff");
    let compactValue = $state("#3366ff");
    let snappingValue = $state(PALETTE[0]);
    let disabledValue = $state("#888888");
    let reachableValue = $state("#888888");
    let erroredValue = $state("#000000");
    let labeledValue = $state("#ff0055");

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultValue} — the swatch is the painter's, not the browser's`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "compact",
            name: "Compact",
            readout: () => `value: ${compactValue} — swatch only, no hex readout`,
            component: compactExample,
            path: `${EXAMPLES_ROOT}/Compact.svelte`,
        },
        {
            key: "snapping",
            name: "Snapping setter",
            readout: () => `value: ${snappingValue} — snapped to the nearest of four`,
            component: snappingExample,
            path: `${EXAMPLES_ROOT}/Snapping.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledValue}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableValue}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredValue} — black is not a brand color`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeledValue} — the caption opens the picker`,
            component: labelExample,
            path: `${EXAMPLES_ROOT}/Labeled.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} />
{/snippet}

{#snippet compactExample()}
    <CompactExample bind:value={compactValue} />
{/snippet}

{#snippet snappingExample()}
    <SnappingExample bind:value={snappingValue} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:value={disabledValue} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:value={reachableValue} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:value={erroredValue} />
{/snippet}

{#snippet labelExample()}
    <LabeledExample bind:value={labeledValue} />
{/snippet}

<PageExamples items={examples} />
