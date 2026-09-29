<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CuboidContent/CuboidContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.cuboidRow, layerClass]"><slot /></div>
</template>
