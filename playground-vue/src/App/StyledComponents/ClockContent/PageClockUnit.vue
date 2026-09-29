<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ClockContent/ClockContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.clockUnit, layerClass]"><slot /></div>
</template>
