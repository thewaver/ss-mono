<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import ArcExample from "./Examples/Arc.svelte";
    import DecoratedExample from "./Examples/Decorated.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import DisabledExample from "./Examples/Disabled.svelte";
    import ErroredExample from "./Examples/Errored.svelte";
    import RatingExample from "./Examples/Rating.svelte";
    import ReachableExample from "./Examples/Reachable.svelte";
    import RightToLeftExample from "./Examples/RightToLeft.svelte";
    import SegmentedExample from "./Examples/Segmented.svelte";
    import type { SizeValue } from "./RadioPage.types";

    const STARTING_RATING = 3;
    const EXAMPLES_ROOT = "/src/App/Pages/RadioPage/Examples";

    let defaultValue = $state<SizeValue | undefined>(undefined);
    let rightToLeftValue = $state<SizeValue | undefined>(undefined);
    let segmentedValue = $state<SizeValue>("medium");
    let ratingValue = $state(STARTING_RATING);
    let hoveredRating = $state<number | undefined>(undefined);
    let arcValue = $state(STARTING_RATING);
    let hoveredArc = $state<number | undefined>(undefined);
    let decoratedValue = $state<SizeValue>("medium");
    let disabledValue = $state<SizeValue>("small");
    let reachableValue = $state<SizeValue>("small");
    let erroredValue = $state<SizeValue | undefined>(undefined);

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${defaultValue}`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Default.svelte`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${rightToLeftValue} — the box around the radios sets dir="rtl", so they run from the right and the left arrow moves on to the next one, while up and down keep their meaning`,
            component: rightToLeftExample,
            path: `${EXAMPLES_ROOT}/RightToLeft.svelte`,
        },
        {
            key: "segmented",
            name: "Segmented",
            readout: () => `value: ${segmentedValue}`,
            component: segmentedExample,
            path: `${EXAMPLES_ROOT}/Segmented.svelte`,
        },
        {
            key: "rating",
            name: "Rating",
            readout: () => `value: ${ratingValue}`,
            component: ratingExample,
            path: `${EXAMPLES_ROOT}/Rating.svelte`,
        },
        {
            key: "arc",
            name: "Rating, bent into an arc",
            readout: () => `value: ${arcValue} — the same radios, placed by a layout instead of laid in a row`,
            component: arcExample,
            path: `${EXAMPLES_ROOT}/Arc.svelte`,
        },
        {
            key: "decorated",
            name: "Decorated",
            readout: () => `value: ${decoratedValue}`,
            component: decoratedExample,
            path: `${EXAMPLES_ROOT}/Decorated.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => `value: ${disabledValue}`,
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Disabled.svelte`,
        },
        {
            key: "reachable",
            name: "Disabled + reachable",
            readout: () => `value: ${reachableValue}`,
            component: reachableExample,
            path: `${EXAMPLES_ROOT}/Reachable.svelte`,
        },
        {
            key: "errored",
            name: "Error",
            readout: () => `value: ${erroredValue}`,
            component: erroredExample,
            path: `${EXAMPLES_ROOT}/Errored.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExample bind:value={defaultValue} />
{/snippet}

{#snippet rightToLeftExample()}
    <RightToLeftExample bind:value={rightToLeftValue} />
{/snippet}

{#snippet segmentedExample()}
    <SegmentedExample bind:value={segmentedValue} />
{/snippet}

{#snippet ratingExample()}
    <RatingExample bind:value={ratingValue} bind:hovered={hoveredRating} />
{/snippet}

{#snippet arcExample()}
    <ArcExample bind:value={arcValue} bind:hovered={hoveredArc} />
{/snippet}

{#snippet decoratedExample()}
    <DecoratedExample bind:value={decoratedValue} />
{/snippet}

{#snippet disabledExample()}
    <DisabledExample bind:value={disabledValue} />
{/snippet}

{#snippet reachableExample()}
    <ReachableExample bind:value={reachableValue} />
{/snippet}

{#snippet erroredExample()}
    <ErroredExample bind:value={erroredValue} />
{/snippet}

<PageExamples items={examples} />
