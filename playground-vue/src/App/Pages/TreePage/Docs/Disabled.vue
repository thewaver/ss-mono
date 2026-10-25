<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Tree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { createFilesWithDisabled } from "../TreePageVue.const";
import type { TreeDisabledDocsExampleProps } from "../TreePageVue.types";

type Props = TreeDisabledDocsExampleProps;

const props = defineProps<Props>();

const expanded = shallowRef<string[]>(["src", "Lib"]);

const nodes = computed(() => createFilesWithDisabled(props.isReachable));
</script>

<template>
    <Tree v-model:expanded="expanded" :nodes="nodes" ariaLabel="Repository">
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
        </template>
    </Tree>
</template>
