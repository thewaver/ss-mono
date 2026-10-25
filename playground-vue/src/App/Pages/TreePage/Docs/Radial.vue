<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";
import { RADIAL_DEFS } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";
import { TreePageUtils } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.utils";

import PageTreeConnector from "../../../StyledComponents/TreeNodeContent/PageTreeConnector.vue";
import PageTreeRadialNode from "../../../StyledComponents/TreeNodeContent/PageTreeRadialNode.vue";
import { RANKS, RANK_ROOTS } from "../TreePageVue.const";

const HALF = 0.5;

const ROOT_DEPTH = 0;

const toShownDepths = (nodes: TreeNode<string>[], expanded: string[], depth: number, into: Set<number>) => {
    for (const node of nodes) {
        into.add(depth);

        if (node.children !== undefined && expanded.includes(node.value)) {
            toShownDepths(node.children, expanded, depth + 1, into);
        }
    }

    return into;
};

const expanded = shallowRef<string[]>(RANK_ROOTS);

const rankRadii = computed(() =>
    [...toShownDepths(RANKS, expanded.value, ROOT_DEPTH, new Set())]
        .filter((depth) => depth > ROOT_DEPTH)
        .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth),
);

const stageWidth = computed(() => `${(Math.max(...rankRadii.value, ROOT_DEPTH) + RADIAL_DEFS.itemWidth * HALF) * 2}px`);
</script>

<template>
    <div :class="styles.rankStage">
        <div
            v-for="radius in rankRadii"
            :key="radius"
            :class="styles.rankRing"
            :style="{ width: `${radius * 2}px`, height: `${radius * 2}px` }"
            aria-hidden="true"
        />

        <div :style="{ width: stageWidth }">
            <Tree
                v-model:expanded="expanded"
                :nodes="RANKS"
                ariaLabel="Ranks"
                :compute-layout="TreePageUtils.radialLayout"
            >
                <template #renderConnector="defs">
                    <PageTreeConnector :defs="defs" />
                </template>

                <template #renderNode="{ node, renderProps }">
                    <PageTreeRadialNode :render-props="renderProps">{{ node.value }}</PageTreeRadialNode>
                </template>
            </Tree>
        </div>
    </div>
</template>
