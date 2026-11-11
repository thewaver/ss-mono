<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import type { TooltipBodyStyle } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.types";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import TooltipSurface from "../../StyledComponents/TooltipContent/TooltipSurface.vue";
import type { ArrowBedTooltipProps } from "./TooltipPageVue.types";

const SHARP_RADII = [0];

const ROUNDED_RADII = [BORDER_RADIUS_FULL];

type Props = ArrowBedTooltipProps;

const props = defineProps<Props>();

const computeGeometry = (size: Size2d, bodyStyle: TooltipBodyStyle | undefined) =>
    ShapeUtils.attachArrow(
        {
            points: computeArrowBedPoints(props.shape, size),
            joinRadii: props.shape === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
            lameExponents: bodyStyle?.lameExponents,
            strokeThicknesses: bodyStyle?.strokeThicknesses,
        },
        props.computeAim(size),
        TOOLTIP_ARROW_TEMPLATES[props.arrow](props.arrowWidth, props.arrowLength),
    );
</script>

<template>
    <TooltipSurface :has-arrow="true" :compute-geometry="computeGeometry">
        <div :class="styles.arrowBedLabel">{{ label }}</div>
    </TooltipSurface>
</template>
