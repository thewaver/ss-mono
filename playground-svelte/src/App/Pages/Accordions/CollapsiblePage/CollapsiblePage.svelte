<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import FilledExample from "./Examples/Filled.svelte";
    import PanelExample from "./Examples/Panel.svelte";
    import SidewaysExample from "./Examples/Sideways.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Accordions/CollapsiblePage/Examples";

    let panelExpanded = $state(false);
    let filledExpanded = $state(false);
    let sidewaysExpanded = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "panel",
            name: "A single panel, no heading",
            readout: () =>
                `expanded: ${panelExpanded} — one trigger and one panel, with none of the group behavior an accordion adds`,
            component: panelExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signal passed — the collapsible keeps whether it is open itself, so the page has nothing to show here",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Panel.svelte`,
        },
        {
            key: "filled",
            name: "Filling its container, built on first open",
            readout: () =>
                `expanded: ${filledExpanded} — the panel's contents are not built until it is opened, and are kept once they are`,
            component: filledExample,
            path: `${EXAMPLES_ROOT}/Filled.svelte`,
        },
        {
            key: "sideways",
            name: "Opening to the side",
            readout: () =>
                `expanded: ${sidewaysExpanded} — the panel grows its width instead of its height, and its contents keep theirs`,
            component: sidewaysExample,
            path: `${EXAMPLES_ROOT}/Sideways.svelte`,
        },
    ];
</script>

{#snippet panelExample()}
    <PanelExample bind:expanded={panelExpanded} />
{/snippet}

{#snippet unheldExample()}
    <PanelExample />
{/snippet}

{#snippet filledExample()}
    <FilledExample bind:expanded={filledExpanded} />
{/snippet}

{#snippet sidewaysExample()}
    <SidewaysExample bind:expanded={sidewaysExpanded} />
{/snippet}

<PageExamples items={examples} />
