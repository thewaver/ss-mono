<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodeContentProps } from "./TreeNodeContent.types";

const INDENT_PER_DEPTH = 20;
const BRANCH_MARKER = "▶";
const LEAF_MARKER = "•";
const DESCRIPTION_ONLY_MARKER = "·";

withDefaults(defineProps<TreeNodeContentProps>(), { hasExamples: true });

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.treeNodeContent,
            layerClass,
            renderProps.isBranch && styles.isBranch,
            renderProps.isExpanded && styles.isExpanded,
            !isGliding && renderProps.isHovered && styles.isHovered,
            renderProps.isSelected && styles.isSelected,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.depth === 0 && styles.isCategory,
        ]"
        :style="{
            paddingLeft: `calc(${themeVars.spacing.half} + ${renderProps.depth * INDENT_PER_DEPTH}px)`,
        }"
    >
        <div :class="styles.treeNodeMarker" aria-hidden="true">
            {{ renderProps.isBranch ? BRANCH_MARKER : hasExamples ? LEAF_MARKER : DESCRIPTION_ONLY_MARKER }}
        </div>

        <div><slot /></div>

        <div v-if="detail" :class="styles.treeNodeDetail">{{ detail }}</div>
    </div>
</template>
