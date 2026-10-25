<script setup lang="ts">
import { shallowRef } from "vue";

import { NavigatorVueUtils } from "@thewaver/ss-components-vue";
import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.const";
import * as markStyles from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";
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

const root = shallowRef<HTMLElement>();
const direction = NavigatorVueUtils.useDirection(root);
</script>

<template>
    <div
        ref="root"
        :class="[
            styles.treeNodeContent,
            layerClass,
            renderProps.isBranch && styles.isBranch,
            renderProps.isExpanded && styles.isExpanded,
            !isGliding && renderProps.isHovered && styles.isHovered,
            renderProps.isSelected && styles.isSelected,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.depth === 0 && styles.isCategory,
            direction === 'rtl' && styles.isRightToLeft,
        ]"
        :style="{
            paddingInlineStart: `calc(${themeVars.spacing.half} + ${renderProps.depth * INDENT_PER_DEPTH}px)`,
        }"
    >
        <div :ref="setExpanderRef" :class="styles.treeNodeMarker" aria-hidden="true">
            {{ renderProps.isBranch ? BRANCH_MARKER : hasExamples ? LEAF_MARKER : DESCRIPTION_ONLY_MARKER }}
        </div>

        <div
            v-if="hasCheckbox"
            :class="[
                markStyles.selectGroupMark,
                renderProps.checkedState === true && markStyles.isChecked,
                renderProps.checkedState === 'mixed' && markStyles.isMixed,
            ]"
            aria-hidden="true"
        >
            {{ renderProps.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK }}
        </div>

        <div><slot /></div>

        <div v-if="detail" :class="styles.treeNodeDetail">{{ detail }}</div>
    </div>
</template>
