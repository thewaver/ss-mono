<script setup lang="ts">
import type { PartialGlassDefs } from "@thewaver/ss-components-vue";
import { GlassSurface } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { CSSUtils } from "@thewaver/ss-utils";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { TooltipContentProps } from "./TooltipContent.types";

const TINT_GRADIENT_ANGLE = 45;

const BORDER_RADII = CSSUtils.spreadRadius(BORDER_RADIUS_FULL);

const GLASS_DEFS: PartialGlassDefs = {
    tint: {
        opacity: 1,
        gradient: {
            kind: "linear",
            angle: TINT_GRADIENT_ANGLE,
            colors: [{ value: themeVars.color.surface.dark }, { value: themeVars.color.surface.light }],
        },
    },
    sheen: { specularConstant: 0 },
};

defineProps<TooltipContentProps>();
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
        <GlassSurface :border-radii="BORDER_RADII" :glass-defs="GLASS_DEFS">
            <div :class="styles.tooltipBody">
                <PageLayer :level="2"><slot /></PageLayer>
            </div>
        </GlassSurface>
    </div>
</template>
