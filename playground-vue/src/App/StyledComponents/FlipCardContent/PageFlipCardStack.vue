<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlipCardContent/FlipCardContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.flipCardStack, layerClass]"><slot /></div>
</template>
