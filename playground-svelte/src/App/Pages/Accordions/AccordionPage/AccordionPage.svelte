<script lang="ts">
    import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DeferredExample from "./Examples/Deferred.svelte";
    import GrowingExample from "./Examples/Growing.svelte";
    import RowExample from "./Examples/Row.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SectionsExample from "./Examples/Sections.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    FIELD_WIDTH,
    STARTING_EXTRA_LINES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

    let gap = $state(AccordionKnobs.STARTING_GAP);
    let transitionDurationMs = $state(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

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
    <SectionsExample {gap} {transitionDurationMs} bind:expanded={multiExpanded} />
{/snippet}

{#snippet unheldExample()}
    <SectionsExample {gap} {transitionDurationMs} />
{/snippet}

{#snippet singleExample()}
    <SectionsExample {gap} {transitionDurationMs} bind:expanded={singleExpanded} isSingleExpand={true} />
{/snippet}

{#snippet requiredExample()}
    <SectionsExample {gap} {transitionDurationMs} bind:expanded={requiredExpanded} isSingleExpand={true} isExpandRequired={true} />
{/snippet}

{#snippet growingExample()}
    <GrowingExample {gap} {transitionDurationMs}
        bind:expanded={growingExpanded}
        {extraLines}
        onAddLine={() => {
            extraLines += 1;
        }}
        onClearLines={() => {
            extraLines = STARTING_EXTRA_LINES;
        }}
    />
{/snippet}

{#snippet deferredExample()}
    <DeferredExample {gap} {transitionDurationMs}
        bind:expanded={deferredExpanded}
        onBuild={(value) => {
            built = built.includes(value) ? built : [...built, value];
        }}
    />
{/snippet}

{#snippet scrolledExample()}
    <ScrolledExample {gap} {transitionDurationMs} bind:expanded={scrolledExpanded} />
{/snippet}

{#snippet rowExample()}
    <RowExample {gap} {transitionDurationMs} bind:expanded={rowExpanded} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"gap"} label={"Gap (px)"} hint={"The space between sections."}>
        <PageNumberField
            value={gap}
            min={AccordionKnobs.MIN_GAP}
            max={AccordionKnobs.MAX_GAP}
            step={AccordionKnobs.GAP_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Gap in pixels"}
            onInput={(value) => {
                gap = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Transition duration (ms)"}
        hint={"How long a section takes to open and close. At 0 it opens and closes at once."}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={AccordionKnobs.MIN_TRANSITION_MS}
            max={AccordionKnobs.MAX_TRANSITION_MS}
            step={AccordionKnobs.TRANSITION_STEP_MS}
            width={FIELD_WIDTH}
            ariaLabel={"Transition duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
