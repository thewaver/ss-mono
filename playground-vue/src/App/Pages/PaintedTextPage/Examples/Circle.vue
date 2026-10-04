<script setup lang="ts">
import { computed, useId, useModel } from "vue";

import { Button, PaintedText, PaintedTextUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import type { Size2d } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextCircleExampleProps } from "../PaintedTextPage.types";

const RING_TEXT = "PAINTED TEXT • ROUND A CIRCLE • ";

type Props = PaintedTextCircleExampleProps;

const props = defineProps<Props>();

const id = useId();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const path = computed(() => PaintedTextUtils.computeCirclePath({ x: props.radius, y: props.radius }, props.radius));

const togglePlayback = () => {
    playback.value = !playback.value;
};

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "fill", id, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeSampleDefs(props, "stroke", id, size, element);
</script>

<template>
    <div :class="styles.stack">
        <div :class="styles.ringText">
            <PaintedText
                v-model:progress="progress"
                v-model:playback="playback"
                :path="path"
                :is-fitted-to-path="isFittedToPath"
                :lap-duration-ms="lapDurationMs"
                :compute-fill-defs="computeFillDefs"
                :compute-stroke-defs="computeStrokeDefs"
                :stroke-width="strokeWidth"
                :stroke-alignment="strokeAlignment"
            >
                {{ RING_TEXT }}
            </PaintedText>
        </div>

        <div :class="styles.buttonRow">
            <Button id="circlePlayback" @click="togglePlayback">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">{{ playback ? "Pause" : "Play" }}</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
