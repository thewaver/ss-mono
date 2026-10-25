<script setup lang="ts">
import { MultiTree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES } from "../TreePageVue.const";
</script>

<template>
    <MultiTree :nodes="FILES" ariaLabel="Files to include">
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps, setExpanderRef }">
            <PageTreeNodeContent
                is-gliding
                has-checkbox
                :render-props="renderProps"
                :set-expander-ref="setExpanderRef"
                >{{ node.value }}</PageTreeNodeContent
            >
        </template>
    </MultiTree>
</template>
