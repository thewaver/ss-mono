<script setup lang="ts">
import { useId } from "vue";

import { Shape } from "@thewaver/ss-components-vue";
import { WRAPPED_TEXT } from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "../ShapePage.types";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePageVue.const";

const FLOAT_SIZE = 256;

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
