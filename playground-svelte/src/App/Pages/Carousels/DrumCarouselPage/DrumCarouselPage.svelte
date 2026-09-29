<script lang="ts">
    import type { CarouselAxis } from "@thewaver/ss-components-svelte";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import { createCarouselsControls } from "../Carousels.utils.svelte";
    import PageCarouselsPanel from "../CarouselsPanel.svelte";
    import NoControlsExample from "./Examples/NoControls.svelte";
    import RotatingExample from "./Examples/Rotating.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Carousels/DrumCarouselPage/Examples";

    const controls = createCarouselsControls();

    const axis: CarouselAxis = $derived(controls.orientation === "horizontal" ? "row" : "column");

    let steppedIndex = $state(0);
    let rotatingIndex = $state(0);
    let rotatingPlaying = $state(true);
    let barelessIndex = $state(0);

    const examples: ExampleDefs[] = [
        {
            key: "stepped",
            name: "Stepped by hand",
            readout: () =>
                `slide ${steppedIndex + 1} of ${controls.slideCount} — the slides sit on the faces of a drum, turning about the axis the direction names and swiped along it`,
            component: steppedExample,
            path: `${EXAMPLES_ROOT}/Stepped.svelte`,
        },
        {
            key: "rotating",
            name: "Rotating on its own",
            readout: () =>
                `slide ${rotatingIndex + 1} of ${controls.slideCount} | ${rotatingPlaying ? "playing" : "stopped"} — the barrel turns itself, and holds while the pointer is over it, while anything inside it has focus, and while the tab is in the background`,
            component: rotatingExample,
            path: `${EXAMPLES_ROOT}/Rotating.svelte`,
        },
        {
            key: "noControls",
            name: "No controls at all",
            readout: () =>
                `slide ${barelessIndex + 1} of ${controls.slideCount} — nothing is drawn beside the drum, so the surrounding page owns the buttons through the signal it shares`,
            component: noControlsExample,
            path: `${EXAMPLES_ROOT}/NoControls.svelte`,
        },
    ];
</script>

{#snippet steppedExample()}
    <PageCarouselBox>
        <SteppedExample {...controls.sharedProps} bind:index={steppedIndex} {axis} />
    </PageCarouselBox>
{/snippet}

{#snippet rotatingExample()}
    <PageCarouselBox>
        <RotatingExample
            {...controls.sharedProps}
            bind:index={rotatingIndex}
            bind:playback={rotatingPlaying}
            autoplayDelayMs={controls.delay}
            {axis}
        />
    </PageCarouselBox>
{/snippet}

{#snippet noControlsExample()}
    <PageCarouselBox>
        <NoControlsExample {...controls.sharedProps} bind:index={barelessIndex} {axis} />
    </PageCarouselBox>
{/snippet}

<PageCarouselsPanel {controls} hasDelay={true} />

<PageExamples items={examples} />
