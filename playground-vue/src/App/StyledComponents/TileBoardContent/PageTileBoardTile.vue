<script setup lang="ts">
import { computed } from "vue";

import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TileBoardContent/TileBoardContent.css";
import { FOCUS_RING_WIDTH, themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTileBoardTileProps } from "./TileBoardContent.types";

const EDGE_THICKNESSES = [1];
const FOCUS_THICKNESSES = [FOCUS_RING_WIDTH];
const EDGE_STROKE_GEOM = [{ thicknesses: EDGE_THICKNESSES }];
const FOCUS_STROKE_GEOM = [{ thicknesses: FOCUS_THICKNESSES }];

const props = defineProps<PageTileBoardTileProps>();

const layerClass = useLayerClass();

const strokeColor = computed(() =>
    props.renderProps.isFocusVisible ? themeVars.color.outline.main : themeVars.color.primary.main,
);
</script>

<template>
    <div :class="[styles.tileBoardTile, layerClass, isMarked && styles.isMarked]">
        <Shape
            :compute-points="() => renderProps.points"
            :compute-stroke-defs="() => [{ color: strokeColor }]"
            :stroke-geom="renderProps.isFocusVisible ? FOCUS_STROKE_GEOM : EDGE_STROKE_GEOM"
        >
            <template #renderChildren="{ clipPath }">
                <div
                    :class="[
                        styles.tileBoardTileContent,
                        isMarked && styles.isMarked,
                        renderProps.isHovered && styles.isHovered,
                        renderProps.isDisabled && styles.isDisabled,
                    ]"
                    :style="{ clipPath: `path('${clipPath}')` }"
                    aria-hidden="true"
                >
                    {{ `${renderProps.tile.row}:${renderProps.tile.col}` }}
                </div>
            </template>
        </Shape>
    </div>
</template>
