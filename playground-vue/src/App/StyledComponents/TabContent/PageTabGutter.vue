<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabDecorationProps } from "./TabContent.types";

defineProps<TabDecorationProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[orientation === 'horizontal' ? styles.rowTabGutter : undefined, layerClass]" data-gutter="" />
</template>
