<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import { createWheelsControls } from "../Wheels.utils.svelte";
    import PageWheelsPanel from "../WheelsPanel.svelte";
    import OverheadExampleWrapper from "./OverheadExampleWrapper.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Wheels/OverheadWheelPage/Examples";

    const controls = createWheelsControls();

    let targetIndex = $state(0);

    let markedIndex = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "overhead",
            name: "Overhead",
            component: overheadExample,
            readout: () =>
                `under the marker: ${controls.wedges[markedIndex] ?? "nothing"} — heading for: ${controls.wedges[targetIndex] ?? "nothing"}`,
            path: `${EXAMPLES_ROOT}/Overhead.svelte`,
        },
    ];
</script>

{#snippet overheadExample()}
    <OverheadExampleWrapper
        {...controls.sharedProps}
        bind:targetIndex
        onSelectedWedgeChange={(index) => {
            markedIndex = index;
        }}
    />
{/snippet}

<PageWheelsPanel {controls} />

<PageExamples items={examples} layout={"flow"} />
