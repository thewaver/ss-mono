<script setup lang="ts">
import { useModel } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import type { TreeExampleProps } from "../TreePage.types";

const STRESS_NODE_HEIGHT = 28;

type Props = TreeExampleProps & { nodes: TreeNode<string>[] };

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const computeEstimatedNodeHeight = () => STRESS_NODE_HEIGHT;
</script>

<template>
    <div :class="styles.treeScroller">
        <Tree
            v-model:value="value"
            v-model:expanded="expanded"
            :nodes="nodes"
            ariaLabel="Generated repository"
            :compute-estimated-node-height="computeEstimatedNodeHeight"
        >
            <template #renderNode="{ node, renderProps }">
                <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Tree>
    </div>
</template>
