<script setup lang="ts">
import { computed, useModel } from "vue";

import {
    CellAnimationKeyframes,
    CellAnimationOrigins,
    ParticleField,
    type ParticleFieldCellDefs,
    type ParticleFieldProps,
    SliceAnimationWeights,
} from "@thewaver/ss-components-vue";
import { ParticlePictureUtils } from "@thewaver/ss-playground/App/PageComponents/ParticlePicture/ParticlePicture.utils";
import {
    computeParticlePos,
    createEnvelope,
} from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import type { Index2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

const NO_PROGRESS = 0;

type Props = ParticleFieldExampleProps &
    Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress" | "onUpdate:progress" | "renderer">;

const props = withDefaults(defineProps<Props>(), { progress: NO_PROGRESS });

const playback = useModel(props, "playback");
const progress = useModel(props, "progress");

const src = computed(() =>
    ParticlePictureUtils.createDotSrc(themeVars.color.success.light, themeVars.color.success.dark),
);

const origin = computed(() => CellAnimationOrigins.computeOrigin(props.originType, props.cellCount));

const animation = computed(() =>
    createEnvelope(CellAnimationKeyframes.SAMPLE_ANIMATIONS[props.animationType], props.holdShare),
);

const computeCellWeights = computed(
    () => (count: Index2d) =>
        SliceAnimationWeights.computeSliceWeights(
            props.weightType,
            count,
            CellAnimationOrigins.computeOrigin(props.originType, count),
        ),
);

const computeFieldParticlePos = (defs: ParticleFieldCellDefs) => computeParticlePos(defs.rect, props.isScattered);
</script>

<template>
    <ParticleField
        v-model:playback="playback"
        v-model:progress="progress"
        :src="src"
        :origin="origin"
        :renderer="renderer"
        :cell-count="cellCount"
        :spawn-chance="spawnChance"
        :animation-iteration-delay-ms="animationIterationDelayMs"
        :animation-duration-ms="animationDurationMs"
        :particle-lifetime-ms="particleLifetimeMs"
        :compute-shape-points="computeShapePoints"
        :shape-join-radii="shapeJoinRadii"
        :compute-cell-weights="computeCellWeights"
        :compute-particle-pos="computeFieldParticlePos"
        :compute-particle-animation="animation"
    />
</template>
