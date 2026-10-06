<script setup lang="ts">
import { useModel } from "vue";

import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-vue";
import type { CuboidController, CuboidFace } from "@thewaver/ss-components-vue";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

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
        <Cuboid
            v-model:yaw="yaw"
            v-model:pitch="pitch"
            :size="size"
            :transition-duration-ms="transitionDurationMs"
            :is-upright="isUpright"
            :is-draggable="isDraggable"
            ariaLabel="Six faces, kept upright"
            :compute-face-label="computeCuboidFaceLabel"
            @mount="(next: CuboidController) => (controller = next)"
        >
            <template #renderFace="{ face, state }">
                <PageCuboidFace :face="face" :state="state" />
            </template>
        </Cuboid>

        <PageCuboidPad>
            <div />
            <Button id="uprightPitchUp" ariaLabel="Turn the face above towards you" @click="turnPitch(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.up" />
                </template>
            </Button>
            <div />

            <Button
                id="uprightYawLeft"
                ariaLabel="Turn the face on the left towards you"
                @click="turnYaw(-QUARTER_TURN)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.left" />
                </template>
            </Button>
            <div />
            <Button
                id="uprightYawRight"
                ariaLabel="Turn the face on the right towards you"
                @click="turnYaw(QUARTER_TURN)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.right" />
                </template>
            </Button>

            <div />
            <Button id="uprightPitchDown" ariaLabel="Turn the face below towards you" @click="turnPitch(-QUARTER_TURN)">
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
