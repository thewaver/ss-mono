<script setup lang="ts">
import { Bracket } from "@thewaver/ss-components-vue";
import type { BracketNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { branch, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";
import PageBracketLayerHeader from "../PageBracketLayerHeader.vue";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch(
        "Semi 2",
        branch("Quarter 3", seed("Eli"), seed("Fay")),
        branch("Quarter 4", seed("Gus"), { value: "Withdrawn", isDisabled: true }),
    ),
);

type Props = BracketExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.board">
        <Bracket
            :root="DRAW"
            :node-size="NODE_SIZE"
            :layer-gap="layerGap"
            :cross-gap="crossGap"
            :orientation="orientation"
            :root-side="rootSide"
            :layer-header-size="orientation === 'horizontal' ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE"
            ariaLabel="Knockout draw"
            @activate="props.onActivate"
        >
            <template #renderConnector="defs">
                <component :is="() => renderConnector(defs)" />
            </template>

            <template #renderNode="{ node, state }">
                <PageBracketNode :node="node" :state="state" />
            </template>

            <template #renderLayerHeader="layer">
                <PageBracketLayerHeader :names="ROUND_NAMES" :layer="layer" />
            </template>
        </Bracket>
    </div>
</template>
