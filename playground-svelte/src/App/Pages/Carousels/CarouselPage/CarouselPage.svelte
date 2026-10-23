<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import { createCarouselsControls } from "../Carousels.utils.svelte";
    import PageCarouselsPanel from "../CarouselsPanel.svelte";
    import NoControlsExample from "./Examples/NoControls.svelte";
    import PairsExample from "./Examples/Pairs.svelte";
    import RotatingExample from "./Examples/Rotating.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";
    import WindowedExample from "./Examples/Windowed.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    WINDOWED_SLIDE_COUNT,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
    import {
        computePairs,
        toPairableSlides,
    } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.utils";

    const controls = createCarouselsControls();

    let manualIndex = $state(0);
    let rotatingIndex = $state(0);
    let rotatingPlaying = $state(true);
    let barelessIndex = $state(0);
    let scrolledIndex = $state(0);
    let windowedIndex = $state(0);
    let builtCount = $state(0);
    let pairsIndex = $state(0);

    let builtTally = 0;

    const changeBuiltCount = (change: number) => {
        builtTally += change;
        builtCount = builtTally;
    };

    const isLooping = $derived(controls.isLooping);

    const pairCount = $derived(computePairs(toPairableSlides(controls.sharedProps.slides).length).length);

    const examples: ExampleDefs[] = [
        {
            key: "manual",
            name: EXAMPLE_NAMES.manual,
            readout: () =>
                `slide ${manualIndex + 1} of ${controls.slideCount} — ${isLooping ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
            component: manualExample,
            path: `${EXAMPLES_ROOT}/Stepped.svelte`,
        },
        {
            key: "rotating",
            name: EXAMPLE_NAMES.rotating,
            readout: () =>
                `slide ${rotatingIndex + 1} of ${controls.slideCount} | ${rotatingPlaying ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping ? "" : "; with looping off it stops for good on the last slide"}`,
            component: rotatingExample,
            path: `${EXAMPLES_ROOT}/Rotating.svelte`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `slide ${scrolledIndex + 1} of ${controls.slideCount} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
        {
            key: "noControls",
            name: EXAMPLE_NAMES.noControls,
            readout: () =>
                `slide ${barelessIndex + 1} of ${controls.slideCount} — nothing is drawn beside the slides, so the surrounding page owns the buttons through the signal it shares`,
            component: noControlsExample,
            path: `${EXAMPLES_ROOT}/NoControls.svelte`,
        },
        {
            key: "windowed",
            name: EXAMPLE_NAMES.windowed,
            readout: () =>
                `slide ${windowedIndex + 1} of ${WINDOWED_SLIDE_COUNT} | ${builtCount} built — only the slides the placement can draw exist, so the rest cost nothing, and a slide that comes back is built afresh`,
            component: windowedExample,
            path: `${EXAMPLES_ROOT}/Windowed.svelte`,
        },
        {
            key: "pairs",
            name: EXAMPLE_NAMES.pairs,
            readout: () =>
                `pair ${pairsIndex + 1} of ${pairCount} — the slides two at a time, 1 and 2, then 3 and 4, each pair resting side by side in the room of one slide wherever the placement rests a slide; an odd number of slides is doubled so every pair is whole`,
            component: pairsExample,
            path: `${EXAMPLES_ROOT}/Pairs.svelte`,
        },
    ];
</script>

{#snippet manualExample()}
    <PageCarouselBox>
        <SteppedExample {...controls.sharedProps} {isLooping} bind:index={manualIndex} />
    </PageCarouselBox>
{/snippet}

{#snippet rotatingExample()}
    <PageCarouselBox>
        <RotatingExample
            {...controls.sharedProps}
            {isLooping}
            bind:index={rotatingIndex}
            bind:playback={rotatingPlaying}
            autoplayDelayMs={controls.delay}
        />
    </PageCarouselBox>
{/snippet}

{#snippet noControlsExample()}
    <PageCarouselBox>
        <NoControlsExample {...controls.sharedProps} bind:index={barelessIndex} />
    </PageCarouselBox>
{/snippet}

{#snippet windowedExample()}
    {@const { slides: _slides, ...sharedProps } = controls.sharedProps}
    <PageCarouselBox>
        <WindowedExample
            {...sharedProps}
            {isLooping}
            bind:index={windowedIndex}
            onBuiltChange={changeBuiltCount}
        />
    </PageCarouselBox>
{/snippet}

{#snippet pairsExample()}
    <PageCarouselBox>
        <PairsExample {...controls.sharedProps} {isLooping} bind:index={pairsIndex} />
    </PageCarouselBox>
{/snippet}

{#snippet scrolledExample()}
    <ScrolledExample {...controls.sharedProps} bind:index={scrolledIndex} />
{/snippet}

<PageCarouselsPanel {controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

<PageExamples items={examples} />
