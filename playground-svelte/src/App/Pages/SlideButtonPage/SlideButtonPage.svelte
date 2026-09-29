<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DescribedExample from "./Examples/Described.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import HeldExample from "./Examples/Held.svelte";
    import HoldOnlyExample from "./Examples/HoldOnly.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import SlideOnlyExample from "./Examples/SlideOnly.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/SlideButtonPage/Examples";
    const PERCENT = 100;

    let sends = $state(0);
    let progress = $state(0);
    let isArmed = $state(false);
    let describedSends = $state(0);
    let disabledSends = $state(0);
    let reachableSends = $state(0);
    let hasError = $state(true);
    let slideOnlySends = $state(0);
    let holdOnlySends = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `activations: ${sends} — progress ${Math.round(progress * PERCENT)}%, which the owner reads while the gesture is still running`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "described",
            name: "Described by its field",
            readout: () =>
                `activations: ${describedSends} — the hint under the control is what a screen reader reads after its name, so the gesture is stated before anyone has to guess it`,
            component: describedExample,
            path: `${EXAMPLES_ROOT}/Described.svelte`,
        },
        {
            key: "slideOnly",
            name: "Slide only",
            readout: () =>
                `activations: ${slideOnlySends} — a held press does nothing here, so carrying the thumb is the only pointer route, and a held Enter still confirms`,
            component: slideOnlyExample,
            path: `${EXAMPLES_ROOT}/SlideOnly.svelte`,
        },
        {
            key: "holdOnly",
            name: "Hold only",
            readout: () =>
                `activations: ${holdOnlySends} — dragging the thumb does nothing here, so a stray drag cannot reach the action, and a held press or a held Enter both can`,
            component: holdOnlyExample,
            path: `${EXAMPLES_ROOT}/HoldOnly.svelte`,
        },
        {
            key: "held",
            name: "Held at the end by the owner",
            readout: () => `armed: ${isArmed}`,
            component: heldExample,
            path: `${EXAMPLES_ROOT}/Held.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `activations: ${disabledSends}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `activations: ${reachableSends}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `hasError: ${hasError}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample
        bind:progress
        onActivate={() => {
            sends += 1;
        }}
    />
{/snippet}

{#snippet describedExample()}
    <DescribedExample
        onActivate={() => {
            describedSends += 1;
        }}
    />
{/snippet}

{#snippet slideOnlyExample()}
    <SlideOnlyExample
        onActivate={() => {
            slideOnlySends += 1;
        }}
    />
{/snippet}

{#snippet holdOnlyExample()}
    <HoldOnlyExample
        onActivate={() => {
            holdOnlySends += 1;
        }}
    />
{/snippet}

{#snippet heldExample()}
    <HeldExample
        {isArmed}
        onActivate={() => {
            isArmed = true;
        }}
        onReset={() => {
            isArmed = false;
        }}
    />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample
        onActivate={() => {
            disabledSends += 1;
        }}
    />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample
        onActivate={() => {
            reachableSends += 1;
        }}
    />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample
        {hasError}
        onActivate={() => {
            hasError = !hasError;
        }}
    />
{/snippet}

<PageExamples items={examples} />
