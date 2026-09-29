<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import { createWheelsControls } from "../Wheels.utils.svelte";
    import PageWheelsPanel from "../WheelsPanel.svelte";
    import OverExample from "./Examples/Over.svelte";
    import SidewaysExample from "./Examples/Sideways.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Wheels/DrumWheelPage/Examples";

    const controls = createWheelsControls();

    let sidewaysIndex = $state(0);
    let reelIndex = $state(0);

    let sidewaysMarkedIndex = $state(0);
    let reelMarkedIndex = $state(0);

    const getReadout = (getMarkedIndex: () => number, getSettledIndex: () => number) => () =>
        `under the marker: ${controls.wedges[getMarkedIndex()] ?? "nothing"} — settled on: ${controls.wedges[getSettledIndex()] ?? "nothing"}`;

    const examples: ExampleDefs[] = [
        {
            key: "sideways",
            name: "Turning sideways",
            component: sidewaysExample,
            readout: getReadout(
                () => sidewaysMarkedIndex,
                () => sidewaysIndex,
            ),
            path: `${EXAMPLES_ROOT}/Sideways.svelte`,
        },
        {
            key: "reel",
            name: "Turning over",
            component: overExample,
            readout: getReadout(
                () => reelMarkedIndex,
                () => reelIndex,
            ),
            path: `${EXAMPLES_ROOT}/Over.svelte`,
        },
    ];
</script>

{#snippet sidewaysExample()}
    <SidewaysExample
        {...controls.sharedProps}
        bind:targetIndex={sidewaysIndex}
        onSelectedWedgeChange={(index) => {
            sidewaysMarkedIndex = index;
        }}
    />
{/snippet}

{#snippet overExample()}
    <OverExample
        {...controls.sharedProps}
        bind:targetIndex={reelIndex}
        onSelectedWedgeChange={(index) => {
            reelMarkedIndex = index;
        }}
    />
{/snippet}

<PageWheelsPanel {controls} />

<PageExamples items={examples} layout={"flow"} />
