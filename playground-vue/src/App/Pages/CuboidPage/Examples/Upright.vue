<script setup lang="ts">
import { useModel } from "vue";

import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-vue";
import type { CuboidController, CuboidFace } from "@thewaver/ss-components-vue";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    SIX_FACES_KEPT_UPRIGHT_LABEL,
    TURN_FACE_ABOVE_TOWARDS_TEXT,
    TURN_FACE_BELOW_TOWARDS_TEXT,
    TURN_FACE_LEFT_TOWARDS_TEXT,
    TURN_FACE_RIGHT_TOWARDS_TEXT,
} from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.vue";
import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.vue";
import PageCuboidRow from "../../../StyledComponents/CuboidContent/PageCuboidRow.vue";
import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.vue";
import type { CuboidUprightExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidUprightExampleProps;

const props = defineProps<Props>();

const yaw = useModel(props, "yaw");
const pitch = useModel(props, "pitch");
const controller = useModel(props, "controller");

const turnYaw = (turn: number) => {
    yaw.value = yaw.value + turn;
};

const turnPitch = (turn: number) => {
    pitch.value = pitch.value + turn;
};

const turnTo = (face: CuboidFace) => {
    controller.value?.turnTo(face);
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
                :is-upright="isUpright"
                :is-draggable="isDraggable"
                :ariaLabel="SIX_FACES_KEPT_UPRIGHT_LABEL"
                :compute-face-label="computeCuboidFaceLabel"
                @mount="(next: CuboidController) => (controller = next)"
            >
                <template #renderFace="{ face, state }">
                    <PageCuboidFace :face="face" :state="state" />
                </template>
            </Cuboid>
        </PageMeasureBox>

        <PageCuboidPad>
            <div />
            <Button id="uprightPitchUp" :ariaLabel="TURN_FACE_ABOVE_TOWARDS_TEXT" @click="turnPitch(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.up" />
                </template>
            </Button>
            <div />

            <Button id="uprightYawLeft" :ariaLabel="TURN_FACE_LEFT_TOWARDS_TEXT" @click="turnYaw(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.left" />
                </template>
            </Button>
            <div />
            <Button id="uprightYawRight" :ariaLabel="TURN_FACE_RIGHT_TOWARDS_TEXT" @click="turnYaw(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.right" />
                </template>
            </Button>

            <div />
            <Button id="uprightPitchDown" :ariaLabel="TURN_FACE_BELOW_TOWARDS_TEXT" @click="turnPitch(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.down" />
                </template>
            </Button>
            <div />
        </PageCuboidPad>

        <PageCuboidRow>
            <Button
                v-for="face in CUBOID_FACES"
                :id="`turnTo${computeCuboidFaceLabel(face)}`"
                :key="face"
                :ariaLabel="`Turn to the ${face}`"
                @click="turnTo(face)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags">{{
                        computeCuboidFaceLabel(face)
                    }}</PageControlButtonContent>
                </template>
            </Button>
        </PageCuboidRow>
    </PageCuboidStack>
</template>
