<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideFloaterProps } from "./GlideFloater.types";

defineProps<GlideFloaterProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            kind === 'selection' ? styles.selectionGlideFloater : styles.highlightGlideFloater,
            layerClass,
            visibilityTarget === 1 && styles.isVisible,
        ]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
        :data-floater="kind"
    />
</template>
