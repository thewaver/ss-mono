<script setup lang="ts">
import { shallowRef, useModel, watch } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import PageTreeNodePending from "../../../StyledComponents/TreeNodeContent/PageTreeNodePending.vue";
import { REMOTE_CHILDREN, REMOTE_LOAD_DELAY_MS, REMOTE_ROOT } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
    nodes.map((node) => {
        if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

        if (!node.children) return node;

        return { ...node, children: fillBranch(node.children, value) };
    });

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const nodes = shallowRef<TreeNode<string>[]>(REMOTE_ROOT);

const loaded = new Set<string>();

watch(
    expanded,
    (list, _, onCleanup) => {
        const timers = list
            .filter((entry) => !loaded.has(entry))
            .map((entry) =>
                setTimeout(() => {
                    loaded.add(entry);
                    nodes.value = fillBranch(nodes.value, entry);
                }, REMOTE_LOAD_DELAY_MS),
            );

        onCleanup(() => timers.forEach((timer) => clearTimeout(timer)));
    },
    { immediate: true },
);
</script>

<template>
    <Tree v-model:value="value" v-model:expanded="expanded" :nodes="nodes" ariaLabel="Remote repository">
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPendingChildren="{ depth }">
            <PageTreeNodePending :depth="depth">Fetching…</PageTreeNodePending>
        </template>
    </Tree>
</template>
