<script setup lang="ts">
import { useModel } from "vue";

import { Button, Cuboid } from "@thewaver/ss-components-vue";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

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

        <PageCuboidPad>
            <div />
            <Button id="pitchUp" ariaLabel="Turn the top towards you" @click="turnPitch(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.up" />
                </template>
            </Button>
            <div />

            <Button id="yawLeft" ariaLabel="Turn the left face towards you" @click="turnYaw(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.left" />
                </template>
            </Button>
            <div />
            <Button id="yawRight" ariaLabel="Turn the right face towards you" @click="turnYaw(QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.right" />
                </template>
            </Button>

            <div />
            <Button id="pitchDown" ariaLabel="Turn the bottom towards you" @click="turnPitch(-QUARTER_TURN)">
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS.down" />
                </template>
            </Button>
            <div />
        </PageCuboidPad>
    </PageCuboidStack>
</template>
