<script setup lang="ts">
import { useModel } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import type { TreeNode } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = Partial<TreeExampleProps> & { nodes?: TreeNode<string>[] };

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");
</script>

<template>
    <Tree v-model:value="value" v-model:expanded="expanded" :nodes="nodes ?? FILES" ariaLabel="Repository">
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </Tree>
</template>
