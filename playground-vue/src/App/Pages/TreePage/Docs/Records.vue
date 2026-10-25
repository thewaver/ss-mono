<script setup lang="ts">
import { shallowRef } from "vue";

import { Tree } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Asset } from "@thewaver/ss-playground/App/Pages/TreePage/TreeRecords.types";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.vue";
import { ASSETS } from "../TreePageVue.const";

const value = shallowRef<Asset | undefined>();
</script>

<template>
    <Tree v-model:value="value" :nodes="ASSETS" ariaLabel="Assets">
        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderNode="{ node, renderProps }">
            <PageTreeNodeContent is-gliding :render-props="renderProps" :detail="node.value.kind">{{
                node.value.name
            }}</PageTreeNodeContent>
        </template>
    </Tree>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${JSON.stringify(value) ?? "none"}` }}</div>
</template>
