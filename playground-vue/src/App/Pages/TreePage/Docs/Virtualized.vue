<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { createStressFiles } from "../TreePageVue.const";
import type { TreeVirtualizedDocsExampleProps } from "../TreePageVue.types";

const NODE_HEIGHT = 28;

type Props = TreeVirtualizedDocsExampleProps;

const props = defineProps<Props>();

const expanded = shallowRef<string[]>(["package-1", "package-2", "package-3"]);

const nodes = computed(() => createStressFiles(props.count));

const computeEstimatedNodeHeight = () => NODE_HEIGHT;
</script>

<template>
    <div :class="styles.treeScroller">
        <Tree
            v-model:expanded="expanded"
            :nodes="nodes"
            ariaLabel="Generated repository"
            :compute-estimated-node-height="computeEstimatedNodeHeight"
        >
            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>

            <template #renderNode="{ node, renderProps }">
                <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
            </template>
        </Tree>
    </div>
</template>
