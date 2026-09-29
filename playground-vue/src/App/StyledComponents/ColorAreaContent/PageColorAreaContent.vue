<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { ColorAreaContentProps } from "./ColorAreaContent.types";

const PERCENT = 100;

defineProps<ColorAreaContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.colorAreaSquare,
            layerClass,
            renderProps.isDragging && styles.isDragging,
            renderProps.focusVisibleAxis !== undefined && styles.isFocused,
            renderProps.isDisabled && styles.isDisabled,
        ]"
        :style="[
            assignInlineVars({
                [styles.hueVar]: `${renderProps.hsv.h}deg`,
                [styles.thumbXVar]: `${renderProps.hsv.s}%`,
                [styles.thumbYVar]: `${PERCENT - renderProps.hsv.v}%`,
            }),
            { height: `${size}px` },
        ]"
    >
        <div :class="styles.colorAreaThumb" />
    </div>
</template>
