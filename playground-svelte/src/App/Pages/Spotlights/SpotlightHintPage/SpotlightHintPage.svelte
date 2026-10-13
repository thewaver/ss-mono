<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import HintExample from "./Examples/Hint.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";

    let index = $state(0);
    let visibility = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "hint",
            name: EXAMPLE_NAMES.hint,
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
