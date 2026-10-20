<script lang="ts">
    import type { Span } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import DisabledPairExample from "./Examples/DisabledPair.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import KnobExample from "./Examples/Knob.svelte";
    import PairExample from "./Examples/Pair.svelte";
    import PriceExample from "./Examples/Price.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";
    import VerticalExample from "./Examples/Vertical.svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT, STEP_COUNT } from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";

    let volume = $state(40);
    let steps = $state(3);
    let vertical = $state(60);
    let disabled = $state(25);
    let reachable = $state(75);
    let errored = $state(90);
    let knob = $state(30);

    let price = $state.raw<Span>({ start: 20, end: 80 });
    let budget = $state.raw<Span>({ start: 100, end: 350 });
    let settledBudget = $state("not yet");
    let verticalPair = $state.raw<Span>({ start: 30, end: 70 });
    let disabledPair = $state.raw<Span>({ start: 35, end: 65 });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${volume}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "stepped",
            name: EXAMPLE_NAMES.stepped,
            readout: () => `value: ${steps} of ${STEP_COUNT}`,
            component: steppedExample,
            path: `${EXAMPLES_ROOT}/Stepped.svelte`,
        },
        {
            key: "pair",
            name: EXAMPLE_NAMES.pair,
            readout: () => `start: ${price.start} | end: ${price.end}`,
            component: pairExample,
            path: `${EXAMPLES_ROOT}/Pair.svelte`,
        },
        {
            key: "priceRange",
            name: EXAMPLE_NAMES.priceRange,
            readout: () =>
                `start: ${budget.start} | end: ${budget.end} | settled: ${settledBudget} — each thumb reads its value as a price, and "settled" changes only when a drag lets go or a key is pressed`,
            component: priceExample,
            path: `${EXAMPLES_ROOT}/Price.svelte`,
        },
        {
            key: "vertical",
            name: EXAMPLE_NAMES.vertical,
            readout: () => `single: ${vertical} | pair: ${verticalPair.start}–${verticalPair.end}`,
            component: verticalExample,
            path: `${EXAMPLES_ROOT}/Vertical.svelte`,
        },
        {
            key: "knob",
            name: EXAMPLE_NAMES.knob,
            readout: () =>
                `value: ${knob} — computeValueAtPoint reads the pointer by its angle round the center, so dragging turns it; the arrow keys still step it`,
            component: knobExample,
            path: `${EXAMPLES_ROOT}/Knob.svelte`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `value: ${disabled}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "disabledPair",
            name: EXAMPLE_NAMES.disabledPair,
            readout: () =>
                `start: ${disabledPair.start} | end: ${disabledPair.end} — both thumbs must be out of the tab order`,
            component: disabledPairExample,
            path: `${EXAMPLES_ROOT}/DisabledPair.svelte`,
        },
        {
            key: "reachable",
            name: EXAMPLE_NAMES.reachable,
            readout: () => `value: ${reachable}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: EXAMPLE_NAMES.errored,
            readout: () => `value: ${errored}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={volume} />
{/snippet}

{#snippet steppedExample()}
    <SteppedExample bind:value={steps} />
{/snippet}

{#snippet pairExample()}
    <PairExample bind:range={price} />
{/snippet}

{#snippet priceExample()}
    <PriceExample
        bind:range={budget}
        onChangeEnd={(values) => {
            settledBudget = values.join("–");
        }}
    />
{/snippet}

{#snippet verticalExample()}
    <VerticalExample bind:value={vertical} bind:range={verticalPair} />
{/snippet}

{#snippet knobExample()}
    <KnobExample bind:value={knob} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:value={disabled} />
{/snippet}

{#snippet disabledPairExample()}
    <DisabledPairExample bind:range={disabledPair} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:value={reachable} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:value={errored} />
{/snippet}

<PageExamples items={examples} />
