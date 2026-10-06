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

const CONVOY_SIZE = { width: 320, height: 150 };
const CONVOY_PATH = "M 30 120 C 80 120, 90 30, 160 30 S 240 120, 290 120";
const CONVOY_OFFSETS = [0, 0.12, 0.24, 0.36];
const LEAD_LABEL = "▶";

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
                :path="CONVOY_PATH"
                :size="CONVOY_SIZE"
                :duration-ms="durationMs"
                :is-looping="isLooping"
                :is-turning="isTurning"
                :follower-offsets="CONVOY_OFFSETS"
                @mount="setController"
            >
                <template #renderTrack="path">
                    <PageTrailTrack :path="path" />
                </template>

                <template #renderTraveler="{ place, index }">
                    <PageTrailVehicle
                        :id="`convoyVehicle${index}`"
                        :place="place"
                        :label="index === 0 ? LEAD_LABEL : `${index}`"
                    />
                </template>
            </Trail>
        </PageMeasureBox>

        <div :class="styles.controls">
            <Button id="convoyPlay" ariaLabel="Play" @click="play">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.play" />
                </template>
            </Button>

            <Button id="convoyPause" ariaLabel="Pause" @click="pause">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.pause" />
                </template>
            </Button>

            <Button id="convoyRewind" ariaLabel="Back to start" @click="rewind">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.toStart" />
                </template>
            </Button>
        </div>
    </div>
</template>
