<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";

import { useLayerClass } from "./Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.layerScope, layerClass]"><slot /></div>
</template>
