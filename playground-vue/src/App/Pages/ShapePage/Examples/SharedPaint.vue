<script setup lang="ts">
import { useId } from "vue";

import { Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { PagePaintAreaGroupCell } from "../../../PageComponents/PaintAreaGroup/PaintAreaGroup.types";
import PagePaintAreaGroup from "../../../PageComponents/PaintAreaGroup/PaintAreaGroup.vue";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "../ShapePage.const";
import type { ShapeExampleProps } from "../ShapePage.types";

const CELL_COUNT = 4;

const props = defineProps<ShapeExampleProps>();

const id = useId();

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind, size);

const computeStrokeDefs = (cell: PagePaintAreaGroupCell) => () =>
    computeShapeStrokeDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement);

const computeFillDefs = (cell: PagePaintAreaGroupCell) => () =>
    computeShapeFillDefs(`${id}-${cell.index}`, props, cell.groupSize, cell.groupElement);
</script>

<template>
    <PagePaintAreaGroup :group-class="styles.sharedGrid" :cell-count="CELL_COUNT">
        <template #cell="cell">
            <Shape
                :join-radii="joinRadii"
                :lame-exponents="lameExponents"
                :compute-points="computePoints"
                :compute-stroke-defs="computeStrokeDefs(cell)"
                :stroke-geom="[{ thicknesses: edgeThicknesses }]"
                :compute-fill-defs="computeFillDefs(cell)"
            >
                <template #renderChildren>
                    <div :class="styles.sharedCell" />
                </template>
            </Shape>
        </template>
    </PagePaintAreaGroup>
</template>
