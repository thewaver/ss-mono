<script setup lang="ts">
import { useModel, watch } from "vue";

import type { CuboidFace } from "@thewaver/ss-components-vue";
import { Cuboid, CuboidUtils } from "@thewaver/ss-components-vue";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { ObjectUtils } from "@thewaver/ss-utils";

import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.vue";
import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.vue";
import type { CuboidWanderingExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

const TURNS: [number, number][] = [
    [QUARTER_TURN, 0],
    [-QUARTER_TURN, 0],
    [0, QUARTER_TURN],
    [0, -QUARTER_TURN],
];

type Props = CuboidWanderingExampleProps;

const props = defineProps<Props>();

const yaw = useModel(props, "yaw");
const pitch = useModel(props, "pitch");

let previousFacing: CuboidFace | undefined;

const turnToNeighbor = () => {
    const facing = CuboidUtils.getFacingFromTurns(yaw.value, pitch.value);
    const neighbors = TURNS.map(
        ([yawTurn, pitchTurn]) =>
            [
                CuboidUtils.getFacingFromTurns(yaw.value + yawTurn, pitch.value + pitchTurn),
                yawTurn,
                pitchTurn,
            ] as const,
    ).filter(([turned]) => turned !== facing);
    const unvisited = neighbors.filter(([turned]) => turned !== previousFacing);
    const [[, yawTurn, pitchTurn]] = ObjectUtils.getRandomArrayValues(unvisited.length > 0 ? unvisited : neighbors);

    previousFacing = facing;

    yaw.value = yaw.value + yawTurn;
    pitch.value = pitch.value + pitchTurn;
};

watch(
    () => props.turnIntervalMs,
    (turnIntervalMs, _previous, onCleanup) => {
        if (turnIntervalMs === undefined || turnIntervalMs <= 0) return;

        const timer = setInterval(turnToNeighbor, turnIntervalMs);

        onCleanup(() => {
            clearInterval(timer);
        });
    },
    { immediate: true },
);
</script>

<template>
    <PageCuboidStack>
        <Cuboid
            v-model:yaw="yaw"
            v-model:pitch="pitch"
            :size="size"
            :transition-duration-ms="transitionDurationMs"
            ariaLabel="Six faces, turning by themselves"
            :compute-face-label="computeCuboidFaceLabel"
        >
            <template #renderFace="{ face, state }">
                <PageCuboidFace :face="face" :state="state" />
            </template>
        </Cuboid>
    </PageCuboidStack>
</template>
