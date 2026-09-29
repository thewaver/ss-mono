<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ListboxSurface/ListboxSurface.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ListboxSurfaceProps } from "./ListboxSurface.types";

defineProps<ListboxSurfaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.listboxSurface, layerClass, isWide === true && styles.listboxSurfaceWide]">
        <slot />
    </div>
</template>
