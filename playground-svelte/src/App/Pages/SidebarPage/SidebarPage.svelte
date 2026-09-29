<script lang="ts">
    import type { Snippet } from "svelte";

    import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";

    type SidebarVariant = {
        key: string;
        name: string;
        edge: SidebarEdge;
        layout: SidebarLayout;
        isExpandedOnHover: boolean;
        note: string;
    };

    const EXAMPLES_ROOT = "/src/App/Pages/SidebarPage/Examples";

    const PUSH: SidebarVariant = {
        key: "push",
        name: "Pushing its neighbor",
        edge: "left",
        layout: "push",
        isExpandedOnHover: false,
        note: "the content beside it narrows as it grows",
    };
    const OVERLAY: SidebarVariant = {
        key: "overlay",
        name: "Over its neighbor, from the right",
        edge: "right",
        layout: "overlay",
        isExpandedOnHover: false,
        note: "it only ever takes its collapsed width, and grows over the content",
    };
    const HOVER: SidebarVariant = {
        key: "hover",
        name: "Expanding on hover",
        edge: "left",
        layout: "overlay",
        isExpandedOnHover: true,
        note: "resting on it expands it without touching the state; the button still pins it open",
    };

    const VARIANTS: [SidebarVariant, Snippet][] = [
        [PUSH, pushExample],
        [OVERLAY, overlayExample],
        [HOVER, hoverExample],
    ];

    let expandedByKey = $state<Record<string, boolean>>(
        Object.fromEntries(VARIANTS.map(([variant]) => [variant.key, false])),
    );

    const examples: ExampleDefs[] = VARIANTS.map(([variant, component]) => ({
        key: variant.key,
        name: variant.name,
        readout: () => `expanded: ${expandedByKey[variant.key]} — ${variant.note}`,
        component,
        path: `${EXAMPLES_ROOT}/Default.svelte`,
    }));
</script>

{#snippet variantExample(variant: SidebarVariant)}
    <DefaultExample
        edge={variant.edge}
        layout={variant.layout}
        isExpandedOnHover={variant.isExpandedOnHover}
        bind:expanded={
            () => expandedByKey[variant.key],
            (value) => {
                expandedByKey[variant.key] = value;
            }
        }
    />
{/snippet}

{#snippet pushExample()}
    {@render variantExample(PUSH)}
{/snippet}

{#snippet overlayExample()}
    {@render variantExample(OVERLAY)}
{/snippet}

{#snippet hoverExample()}
    {@render variantExample(HOVER)}
{/snippet}

<PageExamples items={examples} />
