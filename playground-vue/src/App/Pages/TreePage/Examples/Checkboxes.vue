<script setup lang="ts">
import { useModel } from "vue";

import { MultiTree } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import type { TreeCheckboxExampleProps } from "../TreePage.types";
import { FILES } from "../TreePageVue.const";

type Props = TreeCheckboxExampleProps;

const props = defineProps<Props>();

const checked = useModel(props, "checked");
const expanded = useModel(props, "expanded");
</script>

<template>
    <MultiTree v-model:checked="checked" v-model:expanded="expanded" :nodes="FILES" ariaLabel="Files to include">
        <template #renderNode="{ node, renderProps, setExpanderRef }">
            <PageTreeNodeContent
                is-gliding
                has-checkbox
                :render-props="renderProps"
                :set-expander-ref="setExpanderRef"
                >{{ node.value }}</PageTreeNodeContent
            >
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>
    </MultiTree>
</template>
