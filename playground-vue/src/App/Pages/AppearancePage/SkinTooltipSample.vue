<script setup lang="ts">
import {
    SKIN_SAMPLE_TOOLTIP_TEXT,
    computeSkinSampleTooltipAim,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.css";
import * as tooltipStyles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import type { TooltipBodyStyle } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.types";
import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import type { Size2d } from "@thewaver/ss-utils";

import TooltipSurface from "../../StyledComponents/TooltipContent/TooltipSurface.vue";

const computeGeometry = (size: Size2d, bodyStyle: TooltipBodyStyle | undefined) =>
    computeTooltipGeometry(size, { arrow: "even", arrowAim: computeSkinSampleTooltipAim(size) }, bodyStyle);
</script>

<template>
    <div :class="styles.skinTooltipSample">
        <TooltipSurface :has-arrow="true" :compute-geometry="computeGeometry">
            <div :class="tooltipStyles.tooltipBody">{{ SKIN_SAMPLE_TOOLTIP_TEXT }}</div>
        </TooltipSurface>
    </div>
</template>
