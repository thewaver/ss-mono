<script lang="ts">
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCarouselBox from "../../../StyledComponents/CarouselContent/PageCarouselBox.svelte";
    import { createCarouselsControls } from "../Carousels.utils.svelte";
    import PageCarouselsPanel from "../CarouselsPanel.svelte";
    import NoControlsExample from "./Examples/NoControls.svelte";
    import RingExample from "./Examples/Ring.svelte";
    import RotatingExample from "./Examples/Rotating.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import SteppedExample from "./Examples/Stepped.svelte";
    import WordDrumExample from "./Examples/WordDrum.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/Carousels/CarouselPage/Examples";

    const controls = createCarouselsControls();

    let manualIndex = $state(0);
    let rotatingIndex = $state(0);
    let rotatingPlaying = $state(true);
    let barelessIndex = $state(0);
    let scrolledIndex = $state(0);
    let ringIndex = $state(0);
    let wordDrumIndex = $state(0);

    const isLooping = $derived(controls.isLooping);

    const examples: ExampleDefs[] = [
        {
            key: "manual",
            name: "Stepped by hand",
            readout: () =>
                `slide ${manualIndex + 1} of ${controls.slideCount} — ${isLooping ? "stepping past either end comes round the short way, so the first slide sits beside the last" : "looping is off, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back"}; pressing a slide drawn beside the one showing brings it up`,
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
        {
            key: "scrolled",
            name: "Driven by a scroll",
            readout: () =>
                `slide ${scrolledIndex + 1} of ${controls.slideCount} — scrolling the box writes the carousel's progress, so the slides move with the scroll and the slide showing follows the nearest one`,
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
        {
            key: "ring",
            name: "A ring at the edge",
            readout: () =>
                `slide ${ringIndex + 1} of ${controls.slideCount} — the paddle wheel rule, the slides standing round an upright spine with each painting only the half away from it, the spine set flush with the box's right edge so only the half turning outward shows, with its progress written on a clock for a continuous turn; Stop is the way to halt it that a turn running on its own owes the reader`,
            component: ringExample,
            path: `${EXAMPLES_ROOT}/Ring.svelte`,
        },
        {
            key: "wordDrum",
            name: "A drum of words turned by scrolling",
            readout: () =>
                `word ${wordDrumIndex + 1} of ${CarouselKnobs.WORD_DRUM_WORDS.length} — a drum of a fixed number of faces, each a quarter of the box, with a word on each face near the front, its progress written by the box's scroll; scrolling rolls the next word up, and the faces past the first and last word stay empty`,
            component: wordDrumExample,
            path: `${EXAMPLES_ROOT}/WordDrum.svelte`,
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

{#snippet ringExample()}
    <RingExample
        slides={controls.slides}
        bind:index={ringIndex}
        isDisabled={controls.isDisabled}
        orientation={controls.orientation}
    />
{/snippet}

{#snippet wordDrumExample()}
    <WordDrumExample bind:index={wordDrumIndex} isDisabled={controls.isDisabled} />
{/snippet}

<PageCarouselsPanel {controls} hasPlacement={true} hasDelay={true} hasLooping={true} />

<PageExamples items={examples} />
