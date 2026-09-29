<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { ColorSwatchProps } from "./ColorAreaContent.types";

defineProps<ColorSwatchProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.colorSwatchChecker, layerClass]">
        <div :class="styles.colorSwatch" :style="assignInlineVars({ [styles.swatchVar]: value })" />
    </div>
</template>
