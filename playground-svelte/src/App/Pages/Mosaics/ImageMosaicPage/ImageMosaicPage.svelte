<script lang="ts">
    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import { createMosaicsControls } from "../Mosaics.utils.svelte";
    import PageMosaicsPanel from "../MosaicsPanel.svelte";
    import ImagesExampleWrapper from "./ImagesExampleWrapper.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.const";

    const controls = createMosaicsControls();

    const examples: ExampleDefs[] = [
        {
            key: "images",
            name: EXAMPLE_NAMES.images,
            readout: () =>
                "each row is scaled to fill the fixed side exactly, so the only size asked for is the shape the finished mosaic should come out closest to",
            component: imagesExample,
            path: `${EXAMPLES_ROOT}/Images.svelte`,
        },
    ];
</script>

{#snippet imagesExample()}
    <ImagesExampleWrapper {...controls.getSharedProps()} />
{/snippet}

<PageMosaicsPanel {controls} />

<PageExamples items={examples} layout={"flow"} />
