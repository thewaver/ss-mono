<script setup lang="ts">
import { useModel } from "vue";

import { Button, Cuboid } from "@thewaver/ss-components-vue";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    TURN_BOTTOM_TOWARDS_YOU_TEXT,
    TURN_LEFT_FACE_TOWARDS_TEXT,
    TURN_RIGHT_FACE_TOWARDS_TEXT,
    TURN_TOP_TOWARDS_YOU_TEXT,
} from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.vue";
import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.vue";
import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.vue";
import type { CuboidExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidExampleProps;

const props = defineProps<Props>();

const yaw = useModel(props, "yaw");
const pitch = useModel(props, "pitch");

const turnYaw = (turn: number) => {
    yaw.value = yaw.value + turn;
};

const turnPitch = (turn: number) => {
    pitch.value = pitch.value + turn;
};
</script>

<template>
    <PageCuboidStack>
        <PageMeasureBox>
            <Cuboid
                v-model:yaw="yaw"
                v-model:pitch="pitch"
                :size="size"
                :transition-duration-ms="transitionDurationMs"
                ariaLabel="Six faces"
                :compute-face-label="computeCuboidFaceLabel"
            >
                <template #renderFace="{ face, state }">
                    <PageCuboidFace :face="face" :state="state" />
                </template>
            </Cuboid>
        </PageMeasureBox>

        <PageCuboidPad>
            <div />
            <Button id="pitchUp" :ariaLabel="TURN_TOP_TOWARDS_YOU_TEXT" @click="turnPitch(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.up" />
                </template>
            </Button>
            <div />

            <Button id="yawLeft" :ariaLabel="TURN_LEFT_FACE_TOWARDS_TEXT" @click="turnYaw(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.left" />
                </template>
            </Button>
            <div />
            <Button id="yawRight" :ariaLabel="TURN_RIGHT_FACE_TOWARDS_TEXT" @click="turnYaw(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.right" />
                </template>
            </Button>

            <div />
            <Button id="pitchDown" :ariaLabel="TURN_BOTTOM_TOWARDS_YOU_TEXT" @click="turnPitch(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.down" />
                </template>
            </Button>
            <div />
        </PageCuboidPad>
    </PageCuboidStack>
</template>
