<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import type { TooltipBodyStyle } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.types";
import {
    computeTooltipGeometry,
    getTooltipHasArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import type { Size2d } from "@thewaver/ss-utils";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { TooltipContentProps } from "./TooltipContent.types";
import TooltipSurface from "./TooltipSurface.vue";

const props = defineProps<TooltipContentProps>();

const computeGeometry = (size: Size2d, bodyStyle: TooltipBodyStyle | undefined) =>
    computeTooltipGeometry(size, props, bodyStyle);
</script>

<template>
    <div
        :class="[
            styles.tooltipVisibility,
            styles.tooltipRevealVariants[reveal ?? 'fade'],
            visibilityTarget === 1 && styles.isVisible,
        ]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
    >
        <TooltipSurface :has-arrow="getTooltipHasArrow(arrow)" :compute-geometry="computeGeometry">
            <div :class="[styles.tooltipBody, isWide && styles.tooltipBodyWide]">
                <PageLayer><slot /></PageLayer>
            </div>
        </TooltipSurface>
    </div>
</template>
