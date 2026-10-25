<script setup lang="ts">
import { shallowRef } from "vue";

import { Tree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { DOCS } from "../TreePageVue.const";
import type { TreeLinksDocsExampleProps } from "../TreePageVue.types";
import CustomTreeLink from "./CustomTreeLink.vue";

type Props = TreeLinksDocsExampleProps;

defineProps<Props>();

const expanded = shallowRef<string[]>(["Guides"]);
</script>

<template>
    <Tree
        v-model:expanded="expanded"
        :nodes="DOCS"
        ariaLabel="Documentation"
        :link-component="hasLinkComponent ? CustomTreeLink : undefined"
    >
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>
    </Tree>
</template>
