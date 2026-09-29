<script lang="ts">
    import { ImageMosaic } from "@thewaver/ss-components-svelte";
    import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

    import PageMosaicLink from "../../../../StyledComponents/MosaicContent/PageMosaicLink.svelte";
    import type { ImagesExampleProps } from "../ImageMosaicPage.types";

    type Props = ImagesExampleProps;

    const MOSAIC_ROUTE = "/image-mosaic";

    let { shapeKey, isDecorated, ...otherProps }: Props = $props();
</script>

<ImageMosaic {...otherProps} targetAspectRatio={MosaicImages.SAMPLE_SHAPES[shapeKey]}>
    {#snippet renderItem(renderImage, state)}
        {#if isDecorated}
            <PageMosaicLink href={MOSAIC_ROUTE} caption={`${state.readingIndex + 1} of ${state.itemCount}`}>
                {@render renderImage()}
            </PageMosaicLink>
        {:else}
            {@render renderImage()}
        {/if}
    {/snippet}
</ImageMosaic>
