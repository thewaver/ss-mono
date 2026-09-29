<script setup lang="ts">
import { computed, useId } from "vue";

import type { PlacementRect } from "@thewaver/ss-components-vue";
import { PlacementUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PaginatorWedgeProps } from "./PaginatorContent.types";

const HALF = 0.5;

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

const props = defineProps<PaginatorWedgeProps>();

const layerClass = useLayerClass();

const gradientId = useId();

const sectorPath = computed(() => PlacementUtils.getSectorPath(props.placement.sector!));
</script>

<template>
    <div
        :class="[
            styles.paginatorWedge,
            layerClass,
            isCurrent && styles.isCurrent,
            isHovered && styles.isHovered,
            isActive && styles.isActive,
            isDisabled && styles.isDisabled,
        ]"
    >
        <svg :class="styles.paginatorWedgeCanvas" :viewBox="toViewBox(placement)" aria-hidden="true">
            <defs>
                <linearGradient :id="gradientId" x1="0" y1="1" x2="1" y2="0">
                    <stop :class="styles.paginatorWedgeGradientFrom" offset="0%" />
                    <stop :class="styles.paginatorWedgeGradientTo" offset="100%" />
                </linearGradient>
            </defs>

            <path :class="styles.paginatorWedgeShape" :d="sectorPath" />

            <path :class="styles.paginatorWedgeFill" :style="{ fill: `url(#${gradientId})` }" :d="sectorPath" />
        </svg>

        <div :class="styles.paginatorWedgeLabel" aria-hidden="true">
            <slot />
        </div>
    </div>
</template>
