<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/RadioStarContent/RadioStarContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.starCell, layerClass]"><slot /></div>
</template>
