<script setup lang="ts">
import { useModel } from "vue";

import { Tree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import type { TreeRecordExampleProps } from "../TreePage.types";
import { ASSETS } from "../TreePageVue.const";

type Props = TreeRecordExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");
</script>

<template>
    <Tree v-model:value="value" v-model:expanded="expanded" :nodes="ASSETS" ariaLabel="Assets">
        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps" :detail="node.value.kind">{{
                node.value.name
            }}</PageTreeNodeContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </Tree>
</template>
