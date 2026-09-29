<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { HueSliderProps } from "./ColorAreaContent.types";

const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

defineProps<HueSliderProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.hueSlider, layerClass]">
        <div :class="styles.hueTrack" />

        <div
            :class="[styles.hueThumb, renderProps.focusVisibleThumb === 0 && styles.isFocused]"
            :style="[
                assignInlineVars({
                    [styles.swatchVar]: `hsl(${renderProps.values[0] % HUE_MAX} 100% 50%)`,
                }),
                { left: `calc(${renderProps.ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))` },
            ]"
        />
    </div>
</template>
