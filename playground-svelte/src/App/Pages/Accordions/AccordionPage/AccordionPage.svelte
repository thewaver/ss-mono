<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import DeferredExample from "./Examples/Deferred.svelte";
    import GrowingExample from "./Examples/Growing.svelte";
    import RowExample from "./Examples/Row.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SectionsExample from "./Examples/Sections.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    STARTING_EXTRA_LINES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

    let multiExpanded = $state.raw<string[]>(["Shipping"]);
    let singleExpanded = $state.raw<string[]>([]);
    let requiredExpanded = $state.raw<string[]>(["Shipping"]);
    let growingExpanded = $state.raw<string[]>(["Shipping"]);
    let scrolledExpanded = $state.raw<string[]>([]);
    let deferredExpanded = $state.raw<string[]>([]);
    let rowExpanded = $state.raw<string[]>(["Mountains"]);

    let extraLines = $state(STARTING_EXTRA_LINES);
    let built = $state.raw<string[]>([]);

    const examples: ExampleDefs[] = [
        {
            key: "multi",
            name: EXAMPLE_NAMES.multi,
            readout: () => `expanded: ${JSON.stringify(multiExpanded)}`,
            component: multiExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "single",
            name: EXAMPLE_NAMES.single,
            readout: () => `expanded: ${JSON.stringify(singleExpanded)} — the component keeps at most one`,
            component: singleExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "required",
            name: EXAMPLE_NAMES.required,
            readout: () =>
                `expanded: ${JSON.stringify(requiredExpanded)} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: requiredExample,
            path: `${EXAMPLES_ROOT}/Sections.svelte`,
        },
        {
            key: "growing",
            name: EXAMPLE_NAMES.growing,
            readout: () => `extra lines: ${extraLines} — the panel follows its content without reopening`,
            component: growingExample,
            path: `${EXAMPLES_ROOT}/Growing.svelte`,
        },
        {
            key: "deferred",
            name: EXAMPLE_NAMES.deferred,
            readout: () =>
                `built: ${JSON.stringify(built)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: deferredExample,
            path: `${EXAMPLES_ROOT}/Deferred.svelte`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `expanded: ${JSON.stringify(scrolledExpanded)} — opening a section below the fold brings it up`,
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowExpanded)} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: rowExample,
            path: `${EXAMPLES_ROOT}/Row.svelte`,
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

{#snippet rowExample()}
    <RowExample bind:expanded={rowExpanded} />
{/snippet}

<PageExamples items={examples} />
