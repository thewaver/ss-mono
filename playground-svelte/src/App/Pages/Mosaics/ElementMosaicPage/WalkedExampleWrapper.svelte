<script lang="ts">
    import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import type { WalkedExampleWrapperProps } from "./ElementMosaicPage.types";
    import WalkedExample from "./Examples/Walked.svelte";

    let props: WalkedExampleWrapperProps = $props();

    const items = $derived(TILES.slice(0, props.itemCount));
</script>

<PageMeasureBox
    width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
    height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
>
    <WalkedExample
        {items}
        gap={props.gap}
        sizeAnchor={props.sizeAnchor}
        transitionDurationMs={props.transitionDurationMs}
        pickedNames={props.pickedNames}
        onActivate={(index) => props.onActivate(index)}
    />
</PageMeasureBox>
