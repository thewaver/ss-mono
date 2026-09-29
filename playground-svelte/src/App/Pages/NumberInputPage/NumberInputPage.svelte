<script lang="ts">
    import {
        AMOUNT_STEP,
        GERMAN_LOCALE,
        QUANTITY_MIN,
        QUANTITY_STEP,
        RATING_STEP,
    } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import FractionalStepExample from "./Examples/FractionalStep.svelte";
    import GermanExample from "./Examples/German.svelte";
    import LabeledExample from "./Examples/Labeled.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import ReadOnlyExample from "./Examples/ReadOnly.svelte";
    import SteppedClampedExample from "./Examples/SteppedClamped.svelte";
    import UnitExample from "./Examples/Unit.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/NumberInputPage/Examples";

    let defaultValue = $state<number | undefined>(undefined);
    let quantity = $state<number | undefined>(13);
    let rating = $state<number | undefined>(3.7);
    let unit = $state<number | undefined>(72);
    let german = $state<number | undefined>(1234.5);
    let readOnly = $state<number | undefined>(1024);
    let disabled = $state<number | undefined>(7);
    let reachable = $state<number | undefined>(7);
    let errored = $state<number | undefined>(0);
    let labeled = $state<number | undefined>(undefined);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultValue} — an empty field has no value at all`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "steppedClamped",
            name: "Stepped and clamped",
            readout: () =>
                `value: ${quantity} — steps of ${QUANTITY_STEP} counted from ${QUANTITY_MIN}; an out-of-range value is held back until the field is left`,
            component: steppedClampedExample,
            path: `${EXAMPLES_ROOT}/SteppedClamped.svelte`,
        },
        {
            key: "fractionalStep",
            name: "Fractional step",
            readout: () => `value: ${rating} — a step of ${RATING_STEP} must not drift`,
            component: fractionalStepExample,
            path: `${EXAMPLES_ROOT}/FractionalStep.svelte`,
        },
        {
            key: "german",
            name: "German conventions",
            readout: () =>
                `value: ${german} — under ${GERMAN_LOCALE} "1.000" is one thousand and "1,5" is one and a half; PageUp and PageDown move ${AMOUNT_STEP * 10}, ten steps`,
            component: germanExample,
            path: `${EXAMPLES_ROOT}/German.svelte`,
        },
        {
            key: "unit",
            name: "With a unit",
            readout: () => `value: ${unit} — one slot holds both the unit and the stepper`,
            component: unitExample,
            path: `${EXAMPLES_ROOT}/Unit.svelte`,
        },
        {
            key: "readOnly",
            name: "Read-only",
            readout: () => `value: ${readOnly} — the stepper is refused along with the keyboard`,
            component: readOnlyExample,
            path: `${EXAMPLES_ROOT}/ReadOnly.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabled}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachable}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${errored} — anything but a positive count is an error`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
        {
            key: "label",
            name: "In a Label",
            readout: () => `value: ${labeled}`,
            component: labeledExample,
            path: `${EXAMPLES_ROOT}/Labeled.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} />
{/snippet}

{#snippet steppedClampedExample()}
    <SteppedClampedExample bind:value={quantity} />
{/snippet}

{#snippet fractionalStepExample()}
    <FractionalStepExample bind:value={rating} />
{/snippet}

{#snippet germanExample()}
    <GermanExample bind:value={german} />
{/snippet}

{#snippet unitExample()}
    <UnitExample bind:value={unit} />
{/snippet}

{#snippet readOnlyExample()}
    <ReadOnlyExample bind:value={readOnly} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:value={disabled} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:value={reachable} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:value={errored} />
{/snippet}

{#snippet labeledExample()}
    <LabeledExample bind:value={labeled} />
{/snippet}

<PageExamples items={examples} />
