<script lang="ts">
    import type { Snippet } from "svelte";

    import type { DrawerEdge } from "@thewaver/ss-components-svelte";
    import { DRAWER_EDGES } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    const FILLER_NAMES = ["Alder", "Birch", "Cedar", "Elm", "Hazel", "Larch", "Maple", "Rowan", "Willow", "Yew"];
    const FILLER_COUNT = 60;
    const EXAMPLES_ROOT = "/src/App/Pages/DrawerPage/Examples";

    const FILLERS = Array.from(
        { length: FILLER_COUNT },
        (_, index) => `${FILLER_NAMES[index % FILLER_NAMES.length]} ${index + 1}`,
    );

    const EDGE_EXAMPLES: Record<DrawerEdge, Snippet> = {
        left: leftExample,
        right: rightExample,
        top: topExample,
        bottom: bottomExample,
    };

    let visibilityByEdge = $state.raw<Partial<Record<DrawerEdge, boolean>>>({});

    const examples: ExampleDefs[] = DRAWER_EDGES.map((edge) => ({
        key: edge,
        name: `Edge: ${edge}`,
        readout: () => `open: ${visibilityByEdge[edge] ?? false} — the edge is geometry, the slide is paint`,
        component: EDGE_EXAMPLES[edge],
        path: `${EXAMPLES_ROOT}/Default.svelte`,
    }));
</script>

{#snippet edgeExample(edge: DrawerEdge)}
    <DefaultExample
        {edge}
        fillers={FILLERS}
        bind:visibility={
            () => visibilityByEdge[edge] ?? false,
            (value) => {
                visibilityByEdge = { ...visibilityByEdge, [edge]: value };
            }
        }
    />
{/snippet}

{#snippet leftExample()}
    {@render edgeExample("left")}
{/snippet}

{#snippet rightExample()}
    {@render edgeExample("right")}
{/snippet}

{#snippet topExample()}
    {@render edgeExample("top")}
{/snippet}

{#snippet bottomExample()}
    {@render edgeExample("bottom")}
{/snippet}

<PageExamples items={examples} />
