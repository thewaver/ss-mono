<script setup lang="ts">
import { computed, shallowRef, useId } from "vue";

import { InteractionTrackerVueUtils, Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { type Point2d, ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

type Props = ShapeExampleProps;

const props = defineProps<Props>();

const id = useId();

const rootRef = shallowRef<HTMLDivElement>();

const flags = InteractionTrackerVueUtils.useElementFlags(rootRef, false, { applyButtonSemantics: true });

const strokeGeom = computed(() => {
    const geom = [{ thicknesses: props.edgeThicknesses }];

    if (flags.value.isFocusVisible) {
        geom.push({ thicknesses: [2] });
    }

    return geom;
});

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    const strokes = computeShapeStrokeDefs(id, props, size, element, flags.value);

    if (flags.value.isFocusVisible) {
        strokes.push({ color: "#FF00FF" });
    }

    return strokes;
};

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeShapeFillDefs(id, props, size, element);

const computeChildStyle = (size: Size2d, clipPath: string, clipPoints: Point2d[]) => {
    const clipStyle = props.shouldClipChildren ? { clipPath: `path("${clipPath}")` } : {};

    const paddingStyle = !props.shouldPadChildren
        ? {}
        : props.shapeKind === "square"
          ? ShapeUtils.getRectPadding(props.edgeThicknesses, props.joinRadii, props.lameExponents)
          : ShapeUtils.getPolygonPadding(size, clipPoints);

    return { ...clipStyle, ...paddingStyle };
};
</script>

<template>
    <div :class="styles.exampleHost">
        <Shape
            :join-radii="joinRadii"
            :lame-exponents="lameExponents"
            :compute-points="computePoints"
            :compute-stroke-defs="computeStrokeDefs"
            :stroke-geom="strokeGeom"
            :compute-fill-defs="computeFillDefs"
        >
            <template #renderChildren="{ size, clipPath, clipPoints }">
                <div ref="rootRef" :class="styles.example">
                    <div :class="styles.exampleSurface" :style="computeChildStyle(size, clipPath, clipPoints)">
                        <div :class="styles.exampleInner">I have a border</div>
                    </div>
                </div>
            </template>
        </Shape>
    </div>
</template>
