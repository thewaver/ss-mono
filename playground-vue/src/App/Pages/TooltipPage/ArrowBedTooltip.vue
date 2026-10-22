<script setup lang="ts">
import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as tooltipStyles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ArrowBedTooltipProps } from "./TooltipPageVue.types";

const SHARP_RADII = [0];

const ROUNDED_RADII = [BORDER_RADIUS_FULL];

type Props = ArrowBedTooltipProps;

const props = defineProps<Props>();

const computeFillDefs = () => [{ color: themeVars.color.surface.dark }];

const computePoints = (size: Size2d) =>
    ShapeUtils.attachArrow(
        {
            points: computeArrowBedPoints(props.controls.shape.value, size),
            joinRadii: props.controls.shape.value === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
        },
        props.computeAim(size),
        TOOLTIP_ARROW_TEMPLATES[props.controls.arrow.value](
            props.controls.arrowWidth.value,
            props.controls.arrowLength.value,
        ),
    );
</script>

<template>
    <div :class="tooltipStyles.tooltipArrowShadow">
        <Shape :compute-points="computePoints" :compute-fill-defs="computeFillDefs">
            <template #renderChildren>
                <div :class="styles.arrowBedLabel">{{ label }}</div>
            </template>
        </Shape>
    </div>
</template>
