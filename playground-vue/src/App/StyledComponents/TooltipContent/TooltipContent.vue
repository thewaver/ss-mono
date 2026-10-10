<script setup lang="ts">
import { computed } from "vue";

import type { PartialGlassDefs } from "@thewaver/ss-components-vue";
import { GlassSurface, Shape } from "@thewaver/ss-components-vue";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    TOOLTIP_ARROW_TEMPLATES,
    type TooltipArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { CSSUtils, ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { TooltipContentProps } from "./TooltipContent.types";

type ArrowKind = Exclude<TooltipArrow, "none">;

const BORDER_RADII = CSSUtils.spreadRadius(BORDER_RADIUS_FULL);

const JOIN_RADII = [BORDER_RADIUS_FULL];

const GLASS_DEFS: PartialGlassDefs = {
    tint: { color: themeVars.color.surface.dark, opacity: 1 },
    sheen: { specularConstant: 0 },
};

const props = defineProps<TooltipContentProps>();

const arrowKind = computed(() => {
    const arrow = props.arrow ?? "none";

    return arrow === "none" ? undefined : arrow;
});

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
            <Shape
                :compute-points="computeArrowedPoints(arrowKind)"
                :compute-fill-defs="() => [{ color: themeVars.color.surface.dark }]"
            >
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
