<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import HintExample from "./Examples/Hint.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightHintPage/Examples";

    let index = $state(0);
    let visibility = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "hint",
            name: "Hint",
            readout: () => `open: ${visibility} — a click anywhere or any real key puts it away`,
            component: hintExample,
            path: `${EXAMPLES_ROOT}/Hint.svelte`,
        },
    ];
</script>

{#snippet hintExample()}
    <HintExample
        bind:visibility
        {index}
        onIndexChange={(next) => {
            index = next;
        }}
    />
{/snippet}

<PageExamples items={examples} />
