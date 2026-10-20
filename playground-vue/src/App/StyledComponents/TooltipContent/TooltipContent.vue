<script setup lang="ts">
import { computed } from "vue";

import { GlassSurface, Shape } from "@thewaver/ss-components-vue";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    BORDER_RADII,
    GLASS_DEFS,
    JOIN_RADII,
    TOOLTIP_ARROW_TEMPLATES,
    type TooltipArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { TooltipContentProps } from "./TooltipContent.types";

type ArrowKind = Exclude<TooltipArrow, "none">;

const props = defineProps<TooltipContentProps>();

const arrowKind = computed(() => {
    const arrow = props.arrow ?? "none";

    return arrow === "none" ? undefined : arrow;
});

const computeFillDefs = () => [{ color: themeVars.color.surface.dark }];

const computeArrowedPoints = (kind: ArrowKind) => (size: Size2d) =>
    ShapeUtils.attachArrow(
        { points: ShapeConst.getDefaultShapePoints("square", size), joinRadii: JOIN_RADII },
        props.arrowAim,
        TOOLTIP_ARROW_TEMPLATES[kind](
            props.arrowWidth ?? TooltipKnobs.STARTING_ARROW_WIDTH,
            props.arrowLength ?? TooltipKnobs.STARTING_ARROW_LENGTH,
        ),
    );
</script>

<template>
    <div
        :class="[
            styles.tooltipVisibility,
            styles.tooltipRevealVariants[reveal ?? 'fade'],
            visibilityTarget === 1 && styles.isVisible,
            arrowKind && styles.tooltipArrowed,
        ]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
    >
        <div v-if="arrowKind" :class="styles.tooltipArrowShadow">
            <Shape :compute-points="computeArrowedPoints(arrowKind)" :compute-fill-defs="computeFillDefs">
                <template #renderChildren>
                    <div :class="[styles.tooltipBody, isWide && styles.tooltipBodyWide]">
                        <PageLayer :level="2"><slot /></PageLayer>
                    </div>
                </template>
            </Shape>
        </div>

        <GlassSurface v-else :border-radii="BORDER_RADII" :glass-defs="GLASS_DEFS">
            <div :class="[styles.tooltipBody, isWide && styles.tooltipBodyWide]">
                <PageLayer :level="2"><slot /></PageLayer>
            </div>
        </GlassSurface>
    </div>
</template>
