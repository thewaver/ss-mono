<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import { createWheelsControls } from "../Wheels.utils.svelte";
    import PageWheelsPanel from "../WheelsPanel.svelte";
    import OverheadExampleWrapper from "./OverheadExampleWrapper.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/Wheels/OverheadWheelPage/OverheadWheelPage.const";

    const controls = createWheelsControls();

    let targetIndex = $state(0);

    let markedIndex = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "overhead",
            name: EXAMPLE_NAMES.overhead,
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
