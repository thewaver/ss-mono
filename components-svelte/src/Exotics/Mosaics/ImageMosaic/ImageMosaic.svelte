<script lang="ts">
    import { untrack } from "svelte";

    import {
        IMAGE_MOSAIC_DEFAULTS,
        ImageMosaicUtils,
        type MosaicItemState,
        type MosaicPackDefs,
        MosaicUtils,
        ImageMosaicStyles as styles,
    } from "@thewaver/ss-components";

    import Mosaic from "../../../Primitives/Mosaic/Mosaic.svelte";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ImageMosaicProps } from "./ImageMosaic.types.js";

    let props: ImageMosaicProps = $props();

    const loader = ImageMosaicUtils.createSizeLoader();

    const getSizeBySrc = readStore(loader.store);

    $effect(() => loader.stop);

    $effect(() => {
        const sources = props.sources;

        untrack(() => loader.request(sources));
    });

    const sizes = $derived(ImageMosaicUtils.computeSizes(props.sources, getSizeBySrc()));

    const keys = $derived(props.sources.map((source) => source.src));

    const target = $derived(
        ImageMosaicUtils.computeTargetAspectRatio(
            props.targetAspectRatio ?? IMAGE_MOSAIC_DEFAULTS.targetAspectRatio,
            props.sizeAnchor,
        ),
    );

    const targetWidth = $derived(target.width);
    const targetHeight = $derived(target.height);

    const computePlacements = $derived((defs: MosaicPackDefs) =>
        MosaicUtils.packScaled(defs, { width: targetWidth, height: targetHeight }),
    );
</script>

<Mosaic
    sizeAnchor={props.sizeAnchor}
    gap={props.gap}
    transitionDurationMs={props.transitionDurationMs}
    {sizes}
    {keys}
    isItemSized={true}
    {computePlacements}
    ariaLabel={props.ariaLabel}
    onActivate={props.onActivate}
>
    {#snippet renderItem(index: number, state: MosaicItemState)}
        {#snippet renderImage()}
            <img
                class={styles.imageMosaicImage}
                src={props.sources[index]?.src}
                alt={props.sources[index]?.alt}
                decoding="async"
            />
        {/snippet}

        {#if props.renderItem}
            {@render props.renderItem(renderImage, state)}
        {:else}
            {@render renderImage()}
        {/if}
    {/snippet}
</Mosaic>
