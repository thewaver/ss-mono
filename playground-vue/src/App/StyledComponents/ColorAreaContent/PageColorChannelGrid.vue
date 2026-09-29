<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.colorChannels, layerClass]"><slot /></div>
</template>
