<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabFloaterProps } from "./TabContent.types";

defineProps<TabFloaterProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.hexTabFloater, layerClass, visibilityTarget === 1 && styles.isVisible]"
        :style="{ transitionDuration: `${transitionDurationMs}ms` }"
        data-floater=""
    />
</template>
