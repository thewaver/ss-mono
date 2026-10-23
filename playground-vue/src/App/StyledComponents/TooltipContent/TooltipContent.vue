<script setup lang="ts">
import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import type { Size2d } from "@thewaver/ss-utils";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { TooltipContentProps } from "./TooltipContent.types";

const props = defineProps<TooltipContentProps>();

const computeFillDefs = () => [{ color: themeVars.color.surface.dark }];

const computePoints = (size: Size2d) => computeTooltipGeometry(size, props);
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
        <div :class="styles.tooltipShadow">
            <Shape :compute-points="computePoints" :compute-fill-defs="computeFillDefs">
                <template #renderChildren>
                    <div :class="[styles.tooltipBody, isWide && styles.tooltipBodyWide]">
                        <PageLayer :level="2"><slot /></PageLayer>
                    </div>
                </template>
            </Shape>
        </div>
    </div>
</template>
