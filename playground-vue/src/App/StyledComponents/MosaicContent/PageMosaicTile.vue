<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MosaicContent/MosaicContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageMosaicTileProps } from "./MosaicContent.types";

defineProps<PageMosaicTileProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.mosaicTile,
            styles.mosaicTileFamily[styles.PAGE_MOSAIC_FAMILIES[state.index % styles.PAGE_MOSAIC_FAMILIES.length]],
            layerClass,
        ]"
        :style="{ width: `${width}px`, height: `${height}px` }"
    >
        <div :class="styles.mosaicTileName"><slot /></div>

        <div :class="styles.mosaicTileReading">
            {{ `reads ${state.readingIndex + 1} of ${state.itemCount}` }}
        </div>
    </div>
</template>
