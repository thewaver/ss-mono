<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodeContentProps } from "./TreeNodeContent.types";

const ROOT_RANK_DEPTH = 0;
const INNER_RANK_DEPTH = 1;

defineProps<TreeNodeContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.treeRadialNode,
            layerClass,
            renderProps.depth === ROOT_RANK_DEPTH && styles.isRootRank,
            renderProps.depth > INNER_RANK_DEPTH && styles.isOuterRank,
            renderProps.isHovered && styles.isHovered,
            renderProps.isSelected && styles.isSelected,
            renderProps.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
