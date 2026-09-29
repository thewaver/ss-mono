<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.circlePackingFrame, layerClass]"><slot /></div>
</template>
