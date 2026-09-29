<script setup lang="ts">
import { useModel } from "vue";

import { Tree } from "@thewaver/ss-components-vue";

import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { DOCS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";
import PageTreeLink from "./PageTreeLink.vue";

type Props = TreeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");
</script>

<template>
    <Tree
        v-model:value="value"
        v-model:expanded="expanded"
        :nodes="DOCS"
        ariaLabel="Routed documentation"
        :link-component="PageTreeLink"
    >
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>
    </Tree>
</template>
