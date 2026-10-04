<script lang="ts">
    import { NOTHING_PRESSED } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import GridExample from "./Examples/Grid.svelte";
    import MosaicExample from "./Examples/Mosaic.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/WraparoundPage/Examples";

    let mosaicPressed = $state(NOTHING_PRESSED);
    let gridPressed = $state(NOTHING_PRESSED);

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

<PageExamples items={examples} />
