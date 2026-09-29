<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/BreadcrumbContent/BreadcrumbContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <span :class="[styles.breadcrumbSeparator, layerClass]">/</span>
</template>
