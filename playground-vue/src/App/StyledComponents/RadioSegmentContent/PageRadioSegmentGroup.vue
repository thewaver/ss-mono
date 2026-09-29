<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioSegmentContent/RadioSegmentContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.segmentGroup, layerClass]"><slot /></div>
</template>
