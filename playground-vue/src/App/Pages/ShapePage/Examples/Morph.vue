<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, useId } from "vue";

import { Button, MediaQueryMonitorVueUtils, Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { EasingUtils, MathUtils, Point2dUtils } from "@thewaver/ss-utils";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const MORPH_SIZE = 240;
const MORPH_DURATION_MS = 900;
const MORPH_STEPS = 64;
const STAR_INNER_RATIO = 0.38;
const START_ANGLE = -Math.PI * 0.5;

const computeList = (pointCount: number, computeValue: (index: number) => number) =>
    Array.from({ length: pointCount }, (_, index) => computeValue(index));

const computeRing = (size: Size2d, pointCount: number, computeRadiusRatio: (index: number) => number): Point2d[] => {
    const center = { x: size.width * 0.5, y: size.height * 0.5 };
    const radius = Math.min(size.width, size.height) * 0.5;

    return Array.from({ length: pointCount }, (_, index) => {
        const angle = START_ANGLE + (index * Math.PI * 2) / pointCount;
        const distance = radius * computeRadiusRatio(index);

        return { x: center.x + Math.cos(angle) * distance, y: center.y + Math.sin(angle) * distance };
    });
};

const computeCirclePoints = (size: Size2d, pointCount: number) => computeRing(size, pointCount, () => 1);

const computeStarPoints = (size: Size2d, pointCount: number) =>
    computeRing(size, pointCount, (index) => (index % 2 ? STAR_INNER_RATIO : 1));

const blendList = (from: number[], to: number[], ratio: number) =>
    from.map((value, index) => MathUtils.lerp(value, to[index], ratio));

type Props = ShapeExampleProps & {
    starPoints: number;
};

const props = defineProps<Props>();

const id = useId();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const morph = shallowRef(0);
const target = shallowRef(0);

let frame: number | undefined;

const stopTween = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);

    frame = undefined;
};

onBeforeUnmount(stopTween);

const morphTo = (nextTarget: number) => {
    stopTween();
    target.value = nextTarget;

    if (prefersReducedMotion.value) {
        morph.value = nextTarget;

        return;
    }

    const from = morph.value;
    const startedAt = performance.now();
    const durationMs = MORPH_DURATION_MS * Math.abs(nextTarget - from);

    const step = (now: number) => {
        const ratio = durationMs === 0 ? 1 : MathUtils.clamp01((now - startedAt) / durationMs);

        const nextMorph = MathUtils.lerp(from, nextTarget, EasingUtils.easeInOutCubic(ratio));

        morph.value = Math.round(nextMorph * MORPH_STEPS) / MORPH_STEPS;

        frame = ratio < 1 ? requestAnimationFrame(step) : undefined;
    };

    frame = requestAnimationFrame(step);
};

const pointCount = computed(() => props.starPoints * 2);

const joinRadii = computed(() =>
    blendList(
        computeList(pointCount.value, () => 60),
        computeList(pointCount.value, (index) => (index % 2 ? 16 : 6)),
        morph.value,
    ),
);

const lameExponents = computed(() =>
    blendList(
        computeList(pointCount.value, () => 2),
        computeList(pointCount.value, (index) => (index % 2 ? 2 : 1)),
        morph.value,
    ),
);

const computePoints = (size: Size2d) => {
    const circle = computeCirclePoints(size, pointCount.value);
    const star = computeStarPoints(size, pointCount.value);

    return circle.map((point, index) => Point2dUtils.lerp(point, star[index], morph.value));
};

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeShapeFillDefs(id, props, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeShapeStrokeDefs(id, props, size, element);
</script>

<template>
    <div :class="styles.morphHost">
        <Shape
            :join-radii="joinRadii"
            :lame-exponents="lameExponents"
            :stroke-geom="[{ thicknesses: edgeThicknesses }]"
            :compute-points="computePoints"
            :compute-fill-defs="computeFillDefs"
            :compute-stroke-defs="computeStrokeDefs"
        >
            <template #renderChildren>
                <div :style="{ width: `${MORPH_SIZE}px`, height: `${MORPH_SIZE}px` }" />
            </template>
        </Shape>

        <Button
            id="morphToggle"
            :ariaLabel="target === 0 ? 'Turn into a star' : 'Turn into a circle'"
            @click="morphTo(target === 0 ? 1 : 0)"
        >
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{
                    target === 0 ? "Turn into a star" : "Turn into a circle"
                }}</PageButtonContent>
            </template>
        </Button>
    </div>
</template>
