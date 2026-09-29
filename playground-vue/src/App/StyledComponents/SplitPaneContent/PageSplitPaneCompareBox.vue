<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SplitPaneCompareProps } from "./SplitPaneContent.types";

defineProps<SplitPaneCompareProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.compareBox, layerClass]">
        <img :class="side === 'start' ? styles.compareStartImage : styles.compareEndImage" :src="src" :alt="alt" />
    </div>
</template>
