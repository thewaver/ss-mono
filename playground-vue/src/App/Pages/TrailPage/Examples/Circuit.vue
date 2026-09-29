<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, Trail } from "@thewaver/ss-components-vue";
import type { TrailController } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/TrailPage/TrailPage.css";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
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
            <Button id="circuitPlay" @click="play">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Play</PageButtonContent>
                </template>
            </Button>

            <Button id="circuitPause" @click="pause">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Pause</PageButtonContent>
                </template>
            </Button>

            <Button id="circuitRewind" @click="rewind">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Back to start</PageButtonContent>
                </template>
            </Button>
        </div>
    </div>
</template>
