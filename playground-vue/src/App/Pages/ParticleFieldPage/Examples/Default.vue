<script setup lang="ts">
import { computed, useModel } from "vue";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationWeights,
    ParticleField,
    type ParticleFieldCellDefs,
    type ParticleFieldProps,
} from "@thewaver/ss-components-vue";
import {
    computeParticlePos,
    computeParticleTimeline,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import type { Index2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

const NO_PROGRESS = 0;

type Props = ParticleFieldExampleProps &
    Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress" | "onUpdate:progress">;

const props = withDefaults(defineProps<Props>(), { progress: NO_PROGRESS });

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const computeCellWeights = computed(
    () => (count: Index2d) =>
        CellAnimationWeights.computeCellWeights(
            props.weightType,
            count,
            CellAnimationOrigins.computeOrigin(props.originType, count),
        ),
);

const computeFieldParticlePos = (defs: ParticleFieldCellDefs) => computeParticlePos(defs.rect, props.isScattered);

const computeParticleAnimation = (defs: ParticleFieldCellDefs, t: number) =>
    CellAnimationKeyframes.SAMPLE_ANIMATIONS[props.animationType](computeParticleTimeline(t, props.holdShare), {
        ...defs,
        origin: CellAnimationOrigins.computeOrigin(props.originType, defs.count),
    });
</script>

<template>
    <ParticleField
        v-model:playback="playback"
        v-model:progress="progress"
        :cell-count="cellCount"
        :spawn-chance="spawnChance"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :animation-duration-ms="animationDurationMs"
        :particle-lifetime-ms="particleLifetimeMs"
        :compute-shape-points="computeShapePoints"
        :shape-join-radii="shapeJoinRadii"
        :compute-cell-weights="computeCellWeights"
        :compute-particle-pos="computeFieldParticlePos"
        :compute-particle-animation="computeParticleAnimation"
    >
        <template #renderParticle>
            <div :class="styles.particle" />
        </template>
    </ParticleField>
</template>
