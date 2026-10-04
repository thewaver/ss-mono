<script setup lang="ts">
import { ImageMosaic, Wraparound } from "@thewaver/ss-components-vue";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
import { MOSAIC_GAP } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import type { WraparoundExampleProps } from "../WraparoundPage.types";

type Props = WraparoundExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.stage">
        <Wraparound ariaLabel="Pictures, repeating in every direction">
            <template #renderContent>
                <div :class="styles.mosaicTile">
                    <ImageMosaic
                        :sources="MosaicImages.SAMPLE_SOURCES"
                        :gap="MOSAIC_GAP"
                        size-anchor="width"
                        :target-aspect-ratio="MosaicImages.SAMPLE_SHAPES.landscape"
                        ariaLabel="Pictures"
                        @activate="(index: number) => props.onPress(`picture ${index + 1}`)"
                    >
                        <template #renderItem="{ renderImage }">
                            <component :is="renderImage" />
                        </template>
                    </ImageMosaic>
                </div>
            </template>
        </Wraparound>
    </div>
</template>
