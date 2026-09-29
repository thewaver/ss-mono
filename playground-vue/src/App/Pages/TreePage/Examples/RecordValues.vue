<script setup lang="ts">
import { useModel } from "vue";

import { Tree } from "@thewaver/ss-components-vue";

import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { ASSETS } from "../TreePage.const";
import type { TreeRecordExampleProps } from "../TreePage.types";

type Props = TreeRecordExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");
</script>

<template>
    <Tree v-model:value="value" v-model:expanded="expanded" :nodes="ASSETS" ariaLabel="Assets">
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent :render-props="renderProps" :detail="node.value.kind">{{
                node.value.name
            }}</PageTreeNodeContent>
        </template>
    </Tree>
</template>
