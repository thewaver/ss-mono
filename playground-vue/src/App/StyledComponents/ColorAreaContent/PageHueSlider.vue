<script setup lang="ts">
import {
    HUE_MAX,
    HUE_THUMB_SIZE,
} from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { HueSliderProps } from "./ColorAreaContentVue.types";

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
