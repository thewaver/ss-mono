<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PromptExample from "./Examples/Prompt.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Spotlights/SpotlightPromptPage/Examples";

    let bought = $state(0);
    let visibility = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "prompt",
            name: "Prompt",
            readout: () => `bought: ${bought} — nothing else on the page answers until you do`,
            component: promptExample,
            path: `${EXAMPLES_ROOT}/Prompt.svelte`,
        },
    ];
</script>

{#snippet promptExample()}
    <PromptExample
        bind:visibility
        onBuy={() => {
            bought += 1;
        }}
    />
{/snippet}

<PageExamples items={examples} />
