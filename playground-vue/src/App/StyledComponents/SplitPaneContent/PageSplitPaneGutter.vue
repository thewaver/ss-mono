<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SplitPaneGutterProps } from "./SplitPaneContent.types";

defineProps<SplitPaneGutterProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            orientation === 'horizontal' ? styles.rowGutter : styles.columnGutter,
            layerClass,
            flags.isDragging && styles.isDragging,
            flags.isDisabled && styles.isDisabled,
        ]"
        data-gutter=""
    >
        <div :class="orientation === 'horizontal' ? styles.rowGrip : styles.columnGrip" />
    </div>
</template>
