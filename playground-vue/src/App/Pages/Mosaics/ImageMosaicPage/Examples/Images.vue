<script setup lang="ts">
import { ImageMosaic } from "@thewaver/ss-components-vue";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";

import PageMosaicLink from "../../../../StyledComponents/MosaicContent/PageMosaicLink.vue";
import type { ImagesExampleProps } from "../ImageMosaicPage.types";

type Props = ImagesExampleProps;

const MOSAIC_ROUTE = "/image-mosaic";

defineProps<Props>();
</script>

<template>
    <ImageMosaic
        :sources="sources"
        :gap="gap"
        :size-anchor="sizeAnchor"
        :transition-duration-ms="transitionDurationMs"
        :target-aspect-ratio="MosaicImages.SAMPLE_SHAPES[shapeKey]"
    >
        <template #renderItem="{ renderImage, state }">
            <PageMosaicLink
                v-if="isDecorated"
                :href="MOSAIC_ROUTE"
                :caption="`${state.readingIndex + 1} of ${state.itemCount}`"
            >
                <component :is="renderImage" />
            </PageMosaicLink>

            <component :is="renderImage" v-else />
        </template>
    </ImageMosaic>
</template>
