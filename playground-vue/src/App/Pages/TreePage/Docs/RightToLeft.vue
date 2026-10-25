<script setup lang="ts">
import { Tree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES } from "../TreePageVue.const";
</script>

<template>
    <div dir="rtl">
        <Tree :nodes="FILES" ariaLabel="Repository">
            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>

            <template #renderNode="{ node, renderProps }">
                <PageTreeNodeContent is-gliding :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
            </template>
        </Tree>
    </div>
</template>
