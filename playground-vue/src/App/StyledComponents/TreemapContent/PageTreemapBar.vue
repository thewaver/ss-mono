<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreemapContent/TreemapContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTreemapBarProps } from "./TreemapContent.types";

defineProps<PageTreemapBarProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.treemapBar,
            layerClass,
            flags.isHovered && styles.treemapBarHovered,
            flags.isDisabled && styles.treemapBarAtRoot,
        ]"
    >
        <span :class="styles.treemapBarPath">{{ path }}</span>

        <span :class="styles.treemapTileWeight">{{ weight }}</span>
    </div>
</template>
