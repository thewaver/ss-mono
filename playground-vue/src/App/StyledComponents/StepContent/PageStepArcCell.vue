<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.arcCell, layerClass]"><slot /></div>
</template>
