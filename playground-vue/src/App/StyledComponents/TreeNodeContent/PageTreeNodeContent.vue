<script setup lang="ts">
import {
    BRANCH_MARKER,
    DESCRIPTION_ONLY_MARKER,
    INDENT_PER_DEPTH,
    LEAF_MARKER,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodeContentProps } from "./TreeNodeContentVue.types";

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
