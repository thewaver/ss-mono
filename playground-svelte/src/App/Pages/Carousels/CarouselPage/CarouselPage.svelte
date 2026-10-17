<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import { createCarouselsControls } from "../Carousels.utils.svelte";
    import PageCarouselsPanel from "../CarouselsPanel.svelte";
    import NoControlsExample from "./Examples/NoControls.svelte";
    import RotatingExample from "./Examples/Rotating.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";

    const controls = createCarouselsControls();

    let manualIndex = $state(0);
    let rotatingIndex = $state(0);
    let rotatingPlaying = $state(true);
    let barelessIndex = $state(0);
    let scrolledIndex = $state(0);

    const isLooping = $derived(controls.isLooping);

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

{#snippet scrolledExample()}
    <ScrolledExample {...controls.sharedProps} bind:index={scrolledIndex} />
{/snippet}

<PageCarouselsPanel {controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

<PageExamples items={examples} />
