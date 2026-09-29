<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SplitPaneContent/SplitPaneContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.splitPaneFrame, layerClass]"><slot /></div>
</template>
