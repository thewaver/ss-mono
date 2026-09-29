<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTileBoardMeepleProps } from "./TileBoardContent.types";

const MEEPLE_WIDTH_RATIO = 0.56;

defineProps<PageTileBoardMeepleProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.tileBoardMeeple, layerClass]"
        :style="{
            left: `${center.x}px`,
            top: `${center.y}px`,
            width: `${tileSize.width * MEEPLE_WIDTH_RATIO * scale}px`,
        }"
        data-meeple=""
        aria-hidden="true"
    />
</template>
