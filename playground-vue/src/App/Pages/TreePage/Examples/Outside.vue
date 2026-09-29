<script setup lang="ts">
import { useModel } from "vue";

import { Button, Tree } from "@thewaver/ss-components-vue";

import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { FILES, OUTSIDE_COLLAPSE_DELAY_MS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Props = TreeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const expanded = useModel(props, "expanded");

const collapseLibLater = async () => {
    setTimeout(() => {
        expanded.value = expanded.value.filter((entry) => entry !== "Lib");
    }, OUTSIDE_COLLAPSE_DELAY_MS);
};
</script>

<template>
    <PageControlColumn>
        <Tree
            v-model:value="value"
            v-model:expanded="expanded"
            :nodes="FILES"
            ariaLabel="Repository, collapsed from outside"
        >
            <template #renderNode="{ node, renderProps }">
                <PageTreeNodeContent :render-props="renderProps">{{ node.value }}</PageTreeNodeContent>
            </template>
        </Tree>

        <Button @click="collapseLibLater">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{
                    `Collapse Lib in ${OUTSIDE_COLLAPSE_DELAY_MS}ms`
                }}</PageButtonContent>
            </template>
        </Button>
    </PageControlColumn>
</template>
