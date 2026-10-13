<script setup lang="ts">
import {
    INDENT_PER_DEPTH,
    LEAF_MARKER,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodePendingProps } from "./TreeNodeContentVue.types";

defineProps<TreeNodePendingProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.treeNodePending, layerClass]"
        :style="{
            paddingLeft: `calc(${themeVars.spacing.half} + ${depth * INDENT_PER_DEPTH}px)`,
        }"
    >
        <div :class="styles.treeNodeMarker" aria-hidden="true">
            {{ LEAF_MARKER }}
        </div>

        <div><slot /></div>
    </div>
</template>
