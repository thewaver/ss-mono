<script setup lang="ts">
import { shallowRef } from "vue";

import { Bracket, Button } from "@thewaver/ss-components-vue";
import type { BracketNode } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import PageBeam from "../../../StyledComponents/Beam/Beam.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { BEAM_PATHS, branch, seed } from "../BracketPage.const";
import type { BracketBeamsExampleProps } from "../BracketPage.types";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 96, height: 34 };

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

type Props = BracketBeamsExampleProps;

const props = defineProps<Props>();

const isPlaying = shallowRef(true);

const togglePlaying = () => {
    isPlaying.value = !isPlaying.value;
};
</script>

<template>
    <div :class="styles.beamStage">
        <div :class="styles.board">
            <Bracket
                :root="DRAW"
                :node-size="NODE_SIZE"
                :layer-gap="layerGap"
                :cross-gap="crossGap"
                :orientation="orientation"
                :root-side="rootSide"
                ariaLabel="Draw with a beam to the final"
                @activate="props.onActivate"
            >
                <template #renderConnector="defs">
                    <component :is="() => renderConnector(defs)" />

                    <PageBeam
                        v-if="defs.isOnFocusedRoute"
                        :d="BEAM_PATHS[connector](defs, connectorRadius)"
                        direction="backward"
                        :is-playing="isPlaying"
                    />
                </template>

                <template #renderNode="{ node, state }">
                    <PageBracketNode :node="node" :state="state" />
                </template>
            </Bracket>
        </div>

        <Button id="bracketBeamsPlayback" @click="togglePlaying">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{ isPlaying ? "Pause" : "Play" }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
