<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TagInputContent/TagInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <span :class="[styles.tagInputPlaceholder, layerClass]"><slot /></span>
</template>
