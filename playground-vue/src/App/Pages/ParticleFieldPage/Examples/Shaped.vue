<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
import DefaultExample from "./Default.vue";

const NO_EDGE_THICKNESSES = [0];

type Props = ParticleFieldExampleProps & { shapeKind: ShapeConst.DefaultShape; joinRadius: number };

const props = defineProps<Props>();

const playback = useModel(props, "playback");

const rootRef = shallowRef<HTMLDivElement>();

const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

const otherProps = computed(() => ({
    cellCount: props.cellCount,
    spawnChance: props.spawnChance,
    animationIterationDelayMs: props.animationIterationDelayMs,
    animationDurationMs: props.animationDurationMs,
    particleLifetimeMs: props.particleLifetimeMs,
    originType: props.originType,
    weightType: props.weightType,
    animationType: props.animationType,
    holdShare: props.holdShare,
    isScattered: props.isScattered,
}));

const computeShapePoints = computed(
    () => (shapeSize: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, shapeSize),
);

const shapeJoinRadii = computed(() => [props.joinRadius]);

const contourPath = computed(
    () =>
        ShapeUtils.getPaths(computeShapePoints.value(size.value), NO_EDGE_THICKNESSES, shapeJoinRadii.value).outerPath,
);
</script>

<template>
    <div ref="rootRef" :class="styles.shapedRoot">
        <svg :class="styles.shapeContour" aria-hidden="true">
            <path :d="contourPath" />
        </svg>

        <DefaultExample
            v-bind="otherProps"
            v-model:playback="playback"
            :compute-shape-points="computeShapePoints"
            :shape-join-radii="shapeJoinRadii"
        />
    </div>
</template>
