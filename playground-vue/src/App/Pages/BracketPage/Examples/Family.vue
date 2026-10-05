<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-vue";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { branch, computeFamilySteps, describeFamily, seed } from "../BracketPage.const";
import type { BracketFamilyExampleProps } from "../BracketPage.types";
import PageBracketLayerHeader from "../PageBracketLayerHeader.vue";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

type Props = BracketFamilyExampleProps;

const props = defineProps<Props>();

const family = shallowRef<BracketNode<string>>();

const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family.value, step);

const showStep = (step: BracketStep) => {
    family.value = computeStep(step);
};

watch(family, (next) => props.onFamilyChange(describeFamily(DRAW.value, next?.value)), { immediate: true });
</script>

<template>
    <div :class="styles.familyStage">
        <PageMeasureBox>
            <div :class="styles.board">
                <Bracket
                    v-model:family="family"
                    :root="DRAW"
                    :node-size="NODE_SIZE"
                    view="family"
                    :transition-duration-ms="transitionDurationMs"
                    :layer-gap="layerGap"
                    :cross-gap="crossGap"
                    :orientation="orientation"
                    :root-side="rootSide"
                    :layer-header-size="orientation === 'horizontal' ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE"
                    ariaLabel="Knockout draw, one family at a time"
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
        </PageMeasureBox>

        <div :class="styles.familyControls">
            <Button
                v-for="entry in computeFamilySteps(orientation)"
                :id="`familyStep-${entry.step}`"
                :key="entry.step"
                :is-disabled="computeStep(entry.step) === family"
                @click="showStep(entry.step)"
            >
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ entry.label }}</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
