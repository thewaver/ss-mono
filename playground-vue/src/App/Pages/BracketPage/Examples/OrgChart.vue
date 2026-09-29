<script setup lang="ts">
import { Bracket } from "@thewaver/ss-components-vue";
import type { BracketNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { branch, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 88, height: 40 };

const COMPANY: BracketNode<string> = branch(
    "Founder",
    branch("Product", seed("Design"), seed("Research"), seed("Content")),
    branch("Engineering", branch("Platform", seed("Data"), seed("Infra")), seed("Clients")),
    seed("Finance"),
);

type Props = BracketExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.board">
        <Bracket
            :root="COMPANY"
            :node-size="NODE_SIZE"
            :layer-gap="layerGap"
            :cross-gap="crossGap"
            :orientation="orientation"
            :root-side="rootSide"
            ariaLabel="Who reports to whom"
            @activate="props.onActivate"
        >
            <template #renderConnector="defs">
                <component :is="() => renderConnector(defs)" />
            </template>

            <template #renderNode="{ node, state }">
                <PageBracketNode :node="node" :state="state" />
            </template>
        </Bracket>
    </div>
</template>
