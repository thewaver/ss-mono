<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePageVue.const";

const toBranchValues = (nodes: TreeNode<string>[]): string[] =>
    nodes.flatMap((node) => (node.children ? [node.value, ...toBranchValues(node.children)] : []));

const expanded = shallowRef<string[]>(["src", "Lib"]);

const expandAll = () => {
    expanded.value = toBranchValues(FILES);
};

const collapseAll = () => {
    expanded.value = [];
};

const collapseLibLater = () => {
    setTimeout(() => {
        expanded.value = expanded.value.filter((value) => value !== "Lib");
    }, OUTSIDE_COLLAPSE_DELAY_MS);
};
</script>

<template>
    <Tree v-model:expanded="expanded" :nodes="FILES" ariaLabel="Repository">
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>
    </Tree>

    <PageControlRow>
        <Button id="controlledExpandAll" @click="expandAll">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Expand all</PageButtonContent>
            </template>
        </Button>

        <Button id="controlledCollapseAll" @click="collapseAll">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Collapse all</PageButtonContent>
            </template>
        </Button>

        <Button id="controlledCollapseLibLater" @click="collapseLibLater">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{
                    `Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`
                }}</PageButtonContent>
            </template>
        </Button>
    </PageControlRow>
</template>
