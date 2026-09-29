<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import DeferredExample from "./Examples/Deferred.svelte";
    import GrowingExample from "./Examples/Growing.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SectionsExample from "./Examples/Sections.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Accordions/AccordionPage/Examples";

    const STARTING_EXTRA_LINES = 0;

    let multiExpanded = $state.raw<string[]>(["Shipping"]);
    let singleExpanded = $state.raw<string[]>([]);
    let requiredExpanded = $state.raw<string[]>(["Shipping"]);
    let growingExpanded = $state.raw<string[]>(["Shipping"]);
    let scrolledExpanded = $state.raw<string[]>([]);
    let deferredExpanded = $state.raw<string[]>([]);

    let extraLines = $state(STARTING_EXTRA_LINES);
    let built = $state.raw<string[]>([]);

    const examples: ExampleDefs[] = [
        {
            key: "multi",
            name: "Many open at once",
            readout: () => `expanded: ${JSON.stringify(multiExpanded)}`,
            component: multiExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "single",
            name: "One at a time",
            readout: () => `expanded: ${JSON.stringify(singleExpanded)} — the component keeps at most one`,
            component: singleExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "required",
            name: "One at a time, and always one",
            readout: () =>
                `expanded: ${JSON.stringify(requiredExpanded)} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: requiredExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "growing",
            name: "Content that grows while open",
            readout: () => `extra lines: ${extraLines} — the panel follows its content without reopening`,
            component: growingExample,
            path: `${EXAMPLES_ROOT}/Growing.svelte`,
        },
        {
            key: "deferred",
            name: "Panels built on first open",
            readout: () =>
                `built: ${JSON.stringify(built)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: deferredExample,
            path: `${EXAMPLES_ROOT}/Deferred.svelte`,
        },
        {
            key: "scrolled",
            name: "Inside a box that scrolls",
            readout: () =>
                `expanded: ${JSON.stringify(scrolledExpanded)} — opening a section below the fold brings it up`,
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
    ];
</script>

{#snippet multiExample()}
    <SectionsExample bind:expanded={multiExpanded} />
{/snippet}

{#snippet unheldExample()}
    <SectionsExample />
{/snippet}

{#snippet singleExample()}
    <SectionsExample bind:expanded={singleExpanded} isSingleExpand={true} />
{/snippet}

{#snippet requiredExample()}
    <SectionsExample bind:expanded={requiredExpanded} isSingleExpand={true} isExpandRequired={true} />
{/snippet}

{#snippet growingExample()}
    <GrowingExample
        bind:expanded={growingExpanded}
        {extraLines}
        onAddLine={() => {
            extraLines += 1;
        }}
    />
{/snippet}

{#snippet deferredExample()}
    <DeferredExample
        bind:expanded={deferredExpanded}
        onBuild={(value) => {
            built = built.includes(value) ? built : [...built, value];
        }}
    />
{/snippet}

{#snippet scrolledExample()}
    <ScrolledExample bind:expanded={scrolledExpanded} />
{/snippet}

<PageExamples items={examples} />
