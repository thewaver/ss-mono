<script lang="ts">
    import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import type { MosaicSharedProps } from "../Mosaics.types";
    import ElementsExample from "./Examples/Elements.svelte";

    let props: MosaicSharedProps = $props();

    const items = $derived(TILES.slice(0, props.itemCount));
</script>

<PageMeasureBox
    width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
    height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
>
    <ElementsExample
        {items}
        gap={props.gap}
        sizeAnchor={props.sizeAnchor}
        transitionDurationMs={props.transitionDurationMs}
    />
</PageMeasureBox>
