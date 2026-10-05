<script setup lang="ts">
import { Bracket } from "@thewaver/ss-components-vue";
import type { BracketNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { branch, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";
import PageBracketLayerHeader from "../PageBracketLayerHeader.vue";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 80, height: 36 };
const TIER_NAMES = ["Tier 4", "Tier 3", "Tier 2", "Tier 1"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 56;

const SKILLS: BracketNode<string> = branch(
    "Adept",
    branch("Fire", branch("Ember", seed("Spark"))),
    branch("Frost", seed("Chill"), { value: "Blizzard", isDisabled: true }),
);

type Props = BracketExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.board">
        <Bracket
            :root="SKILLS"
            :node-size="NODE_SIZE"
            :layer-gap="layerGap"
            :cross-gap="crossGap"
            :orientation="orientation"
            :root-side="rootSide"
            :layer-header-size="orientation === 'horizontal' ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE"
            ariaLabel="Skills and what they unlock"
            @activate="props.onActivate"
        >
            <template #renderConnector="defs">
                <component :is="() => renderConnector(defs)" />
            </template>

            <template #renderNode="{ node, state }">
                <PageBracketNode :node="node" :state="state" />
            </template>

            <template #renderLayerHeader="{ layer }">
                <PageBracketLayerHeader :names="TIER_NAMES" :layer="layer" />
            </template>
        </Bracket>
    </div>
</template>
