<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, WRAPAROUND_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { WraparoundKnobs } from "@thewaver/ss-playground/App/Knobs/Wraparounds.const";
    import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import GridExample from "./Examples/Grid.svelte";
    import MarqueeExample from "./Examples/Marquee.svelte";
    import MosaicExample from "./Examples/Mosaic.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

    const NO_DRIFT_PX_PER_SECOND = 0;

    let mosaicPressed = $state(NOTHING_PRESSED);
    let gridPressed = $state(NOTHING_PRESSED);
    let driftPxPerSecond = $state(WraparoundKnobs.STARTING_DRIFT_PX_PER_SECOND);
    let driftDegrees = $state(WRAPAROUND_DEFAULTS.driftDegrees);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    let marqueePlaying = $state(true);

    const examples: ExampleDefs[] = [
        {
            key: "mosaic",
            span: 2,
            name: "A mosaic that never ends",
            readout: () =>
                `opened: ${mosaicPressed} — drag and let go to send it coasting, or use the wheel; with the window focused the arrows and page keys move it and Home brings it back, and tabbing into the pictures brings the one focused into view`,
            component: mosaicExample,
            path: `${EXAMPLES_ROOT}/Mosaic.svelte`,
        },
        {
            key: "grid",
            span: 2,
            name: "Content smaller than the window",
            readout: () =>
                `pressed: ${gridPressed} — six buttons, copied until the window is full; only one set can be tabbed to or read out, and pressing any copy presses the real button`,
            component: gridExample,
            path: `${EXAMPLES_ROOT}/Grid.svelte`,
        },
        {
            key: "marquee",
            span: 2,
            name: "Marquee",
            readout: () =>
                getPrefersReducedMotion()
                    ? "reduced motion is on, so the strip stays still"
                    : `${marqueePlaying ? "drifting" : "paused"} — the strip moves by itself and holds while the pointer is over it; Pause stops it, and since it cannot be moved by hand, the wheel over it scrolls the page`,
            component: marqueeExample,
            path: `${EXAMPLES_ROOT}/Marquee.svelte`,
        },
    ];
</script>

{#snippet mosaicExample()}
    <MosaicExample
        onPress={(name) => {
            mosaicPressed = name;
        }}
    />
{/snippet}

{#snippet gridExample()}
    <GridExample
        onPress={(name) => {
            gridPressed = name;
        }}
    />
{/snippet}

{#snippet marqueeExample()}
    <MarqueeExample
        driftPxPerSecond={getPrefersReducedMotion() ? NO_DRIFT_PX_PER_SECOND : driftPxPerSecond}
        {driftDegrees}
        bind:playback={marqueePlaying}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"driftPxPerSecond"}
        label={"Marquee speed (px/s)"}
        hint={"How far the marquee's strip drifts in a second. It is off while the visitor has asked for reduced motion."}
    >
        <PageNumberField
            value={driftPxPerSecond}
            min={WraparoundKnobs.MIN_DRIFT_PX_PER_SECOND}
            max={WraparoundKnobs.MAX_DRIFT_PX_PER_SECOND}
            step={WraparoundKnobs.DRIFT_STEP_PX_PER_SECOND}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Marquee speed in pixels per second"}
            onInput={(value) => {
                driftPxPerSecond = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"driftDegrees"}
        label={"Marquee direction (°)"}
        hint={"Which way the marquee's strip drifts: 0 is to the right, 90 down, 180 to the left and 270 up."}
    >
        <PageNumberField
            value={driftDegrees}
            min={WraparoundKnobs.MIN_DRIFT_DEGREES}
            max={WraparoundKnobs.MAX_DRIFT_DEGREES}
            step={WraparoundKnobs.DRIFT_STEP_DEGREES}
            ariaLabel={"Marquee direction in degrees"}
            onInput={(value) => {
                driftDegrees = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
