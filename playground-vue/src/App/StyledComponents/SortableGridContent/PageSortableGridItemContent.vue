<script setup lang="ts">
import { computed } from "vue";

import type { SortableGridGeometry } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableGridContent/SortableGridContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableGridItemContentProps } from "./SortableGridContent.types";

const NAMED_WIDTH = 2;

const getBox = (geometry: SortableGridGeometry) => ({
    width: Math.max(...geometry.contour.map((point) => point.x)),
    height: Math.max(...geometry.contour.map((point) => point.y)),
});

const getPoints = (geometry: SortableGridGeometry) =>
    geometry.contour.map((point) => `${point.x},${point.y}`).join(" ");

const getViewBox = (geometry: SortableGridGeometry) => {
    const box = getBox(geometry);

    return `0 0 ${box.width} ${box.height}`;
};

const props = defineProps<SortableGridItemContentProps>();

const layerClass = useLayerClass();

const glyphRect = computed(() => props.geometry.block);

const isNamed = computed(() => glyphRect.value.width >= props.geometry.cells[0].width * NAMED_WIDTH);
</script>

<template>
    <div
        :class="[
            styles.sortableGridItemContent,
            layerClass,
            flags.isCarried && styles.isCarried,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <svg
            v-if="(paint ?? 'contour') === 'contour'"
            :class="styles.sortableGridItemShape"
            :viewBox="getViewBox(geometry)"
            aria-hidden="true"
        >
            <polygon :class="styles.sortableGridItemContour" :points="getPoints(geometry)" />
        </svg>

        <template v-else>
            <div
                v-for="(cell, index) in geometry.cells"
                :key="index"
                :class="styles.sortableGridItemTile"
                :style="[
                    assignInlineVars({ [styles.tileHue]: `${hue ?? 0}` }),
                    {
                        left: `${cell.left}px`,
                        top: `${cell.top}px`,
                        width: `${cell.width}px`,
                        height: `${cell.height}px`,
                    },
                ]"
                aria-hidden="true"
            />
        </template>

        <div
            :class="styles.sortableGridItemGlyph"
            :style="{
                left: `${glyphRect.left}px`,
                top: `${glyphRect.top}px`,
                width: `${glyphRect.width}px`,
                height: `${glyphRect.height}px`,
            }"
            aria-hidden="true"
        >
            <div>{{ glyph }}</div>

            <div v-if="isNamed" :class="styles.sortableGridItemName">{{ name }}</div>
        </div>
    </div>
</template>
