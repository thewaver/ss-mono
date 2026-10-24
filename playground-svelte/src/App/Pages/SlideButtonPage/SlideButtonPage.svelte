<script lang="ts">
    import {
        EXAMPLES_ROOT,
        EXAMPLE_NAMES,
        LOCK_COUNT,
    } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import ArmingExample from "./Examples/Arming.svelte";

    let armedCount = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "arming",
            name: EXAMPLE_NAMES.arming,
            readout: () => `armed: ${armedCount} of ${LOCK_COUNT}`,
            component: armingExample,
            path: `${EXAMPLES_ROOT}/Arming.svelte`,
        },
    ];
</script>

{#snippet armingExample()}
    <ArmingExample
        onArmedCountChange={(count) => {
            armedCount = count;
        }}
    />
{/snippet}

<PageExamples items={examples} />
