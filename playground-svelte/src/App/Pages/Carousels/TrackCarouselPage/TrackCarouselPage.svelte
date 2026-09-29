<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import { createCarouselsControls } from "../Carousels.utils.svelte";
    import PageCarouselsPanel from "../CarouselsPanel.svelte";
    import NoControlsExample from "./Examples/NoControls.svelte";
    import RotatingExample from "./Examples/Rotating.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Carousels/TrackCarouselPage/Examples";

    const controls = createCarouselsControls();

    let manualIndex = $state(0);
    let rotatingIndex = $state(0);
    let rotatingPlaying = $state(true);
    let barelessIndex = $state(0);

    const isLooping = $derived(controls.isLooping);

    const examples: ExampleDefs[] = [
        {
            key: "manual",
            name: "Stepped by hand",
            readout: () =>
                `slide ${manualIndex + 1} of ${controls.slideCount} — ${isLooping ? "stepping past either end wraps round, which is what separates this from the scroller" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; a column takes its height from the box the page puts round it`,
            component: manualExample,
            path: `${EXAMPLES_ROOT}/Stepped.svelte`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndex + 1} of ${controls.slideCount} | ${rotatingPlaying ? "playing" : "stopped"} — it holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background${isLooping ? "" : "; with looping off it stops for good on the last slide"}`,
            component: rotatingExample,
            path: `${EXAMPLES_ROOT}/Rotating.svelte`,
        },
        {
            key: "noControls",
            name: "No controls at all",
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

<PageCarouselsPanel {controls} hasDelay={true} hasLooping={true} />

<PageExamples items={examples} />
