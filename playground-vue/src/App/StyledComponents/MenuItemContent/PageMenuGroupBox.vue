<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.css";

import { useLayerClass } from "../Layer/Layer.context";

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.menuGroupBox, layerClass]">
        <slot />
    </div>
</template>
