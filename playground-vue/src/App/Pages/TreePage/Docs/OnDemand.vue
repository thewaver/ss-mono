<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import PageTreeNodePending from "../../../StyledComponents/TreeNodeContent/PageTreeNodePending.vue";
import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePageVue.const";

const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
    nodes.map((node) => {
        if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

        if (!node.children) return node;

        return { ...node, children: fillBranch(node.children, value) };
    });

const expanded = shallowRef<string[]>([]);
const nodes = shallowRef<TreeNode<string>[]>(REMOTE_ROOT);

const asked = new Set<string>();
const timers = new Set<ReturnType<typeof setTimeout>>();

onBeforeUnmount(() => timers.forEach(clearTimeout));

watch(
    expanded,
    (list) => {
        const pending = list.filter((value) => !asked.has(value));

        for (const value of pending) {
            asked.add(value);

            const timer = setTimeout(() => {
                timers.delete(timer);
                nodes.value = fillBranch(nodes.value, value);
            }, REMOTE_LOAD_DELAY_MS);

            timers.add(timer);
        }
    },
    { immediate: true },
);
</script>

<template>
    <Tree v-model:expanded="expanded" :nodes="nodes" ariaLabel="Remote repository">
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>

        <template #renderPendingChildren="{ depth }">
            <PageTreeNodePending :depth="depth">Fetching…</PageTreeNodePending>
        </template>
    </Tree>
</template>
