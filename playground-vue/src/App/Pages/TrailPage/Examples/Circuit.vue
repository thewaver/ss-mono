<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, Trail } from "@thewaver/ss-components-vue";
import type { TrailController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageTrailTrack from "../../../StyledComponents/TrailContent/PageTrailTrack.vue";
import PageTrailVehicle from "../../../StyledComponents/TrailContent/PageTrailVehicle.vue";
import type { TrailExampleProps } from "../TrailPage.types";

const CIRCUIT_SIZE = { width: 320, height: 130 };
const CIRCUIT_PATH = "M 60 35 H 260 A 30 30 0 0 1 260 95 H 60 A 30 30 0 0 1 60 35 Z";
const VEHICLE_LABEL = "▶";
const VEHICLE_ID = "circuitVehicle";

type Props = TrailExampleProps;

const props = defineProps<Props>();

const progress = useModel(props, "progress");
const playback = useModel(props, "playback");

const controller = shallowRef<TrailController>();

const setController = (next: TrailController) => {
    controller.value = next;
};

const play = () => {
    playback.value = true;
};

const pause = () => {
    playback.value = false;
};

const rewind = () => {
    controller.value?.seek(0);
};
</script>

<template>
    <div :class="styles.stack">
        <PageMeasureBox>
            <Trail
                v-model:progress="progress"
                v-model:playback="playback"
                :path="CIRCUIT_PATH"
                :size="CIRCUIT_SIZE"
                :duration-ms="durationMs"
                :is-looping="isLooping"
                :is-turning="isTurning"
                @mount="setController"
            >
                <template #renderTrack="path">
                    <PageTrailTrack :path="path" />
                </template>

                <template #renderTraveler="{ place }">
                    <PageTrailVehicle :id="VEHICLE_ID" :place="place" :label="VEHICLE_LABEL" />
                </template>
            </Trail>
        </PageMeasureBox>

        <div :class="styles.controls">
            <Button id="circuitPlay" ariaLabel="Play" @click="play">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.play" />
                </template>
            </Button>

            <Button id="circuitPause" ariaLabel="Pause" @click="pause">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.pause" />
                </template>
            </Button>

            <Button id="circuitRewind" ariaLabel="Back to start" @click="rewind">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.toStart" />
                </template>
            </Button>
        </div>
    </div>
</template>
