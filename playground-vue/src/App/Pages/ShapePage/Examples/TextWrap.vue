<script setup lang="ts">
import { useId } from "vue";

import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const FLOAT_SIZE = 256;

const WRAPPED_TEXT = [
    "A floated Shape carries its own contour as its float area, so the lines of this paragraph run up to the",
    "edge that is painted rather than to the square box around it. Pick another shape, or round its corners,",
    "and the text follows, because the contour it wraps against is the same one the fill and the stroke are",
    "drawn from. Nothing here measures the shape or writes a polygon by hand: the page floats the element and",
    "sets how far the text keeps clear of it, and that is all. The rest of this paragraph is only here to be",
    "long enough to wrap all the way around, down past the bottom of the shape and back to the full width of",
    "the column, which is where you can see that the float ends where the contour does.",
].join(" ");

type Props = ShapeExampleProps;

const props = defineProps<Props>();

const id = useId();

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);

const computeFillDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeShapeFillDefs(id, props, size, element);

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) =>
    computeShapeStrokeDefs(id, props, size, element);
</script>

<template>
    <div :class="styles.wrapText">
        <Shape
            :join-radii="joinRadii"
            :lame-exponents="lameExponents"
            :compute-points="computePoints"
            :stroke-geom="[{ thicknesses: edgeThicknesses }]"
            :compute-fill-defs="computeFillDefs"
            :compute-stroke-defs="computeStrokeDefs"
        >
            <template #renderChildren>
                <div :style="{ width: `${FLOAT_SIZE}px`, height: `${FLOAT_SIZE}px` }" />
            </template> </Shape
        >{{ WRAPPED_TEXT }}
    </div>
</template>
