<script lang="ts">
import { computed, shallowRef } from "vue";

import { ShapeConst } from "@thewaver/ss-utils";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import type { ShapeGeometry } from "./ShapePage.types";

const computeShapePointCount = (shapeKind: ShapeConst.DefaultShape) =>
    ShapeConst.getDefaultShapePoints(shapeKind, { width: 0, height: 0 }).length;

export const useShapeGeometry = (
    startingShapeKind: ShapeConst.DefaultShape = ShapeKnobs.STARTING_SHAPE_KIND,
): ShapeGeometry => {
    const hasIndividualCorners = shallowRef(ShapeKnobs.STARTING_HAS_INDIVIDUAL_CORNERS);
    const shapeKind = shallowRef<ShapeConst.DefaultShape>(startingShapeKind);
    const joinRadii = shallowRef<number[]>(ShapeKnobs.STARTING_JOIN_RADII);
    const lameExponents = shallowRef<number[]>(ShapeKnobs.STARTING_LAME_EXPONENTS);

    const geometryProps = computed(() => {
        const shapePointCount = computeShapePointCount(shapeKind.value);

        return {
            shapeKind: shapeKind.value,
            joinRadii: joinRadii.value.slice(0, shapePointCount),
            lameExponents: lameExponents.value.slice(0, shapePointCount),
        };
    });

    return { hasIndividualCorners, shapeKind, joinRadii, lameExponents, geometryProps };
};
</script>

<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { ShapeGeometryKnobsProps } from "./ShapePage.types";

const CORNER_FIELD_WIDTH = 80;
const MAX_CORNER_COLUMNS = 6;

const spreadCornerValue = (previous: number[], index: number, value: number, hasIndividualCorners: boolean) => {
    if (!hasIndividualCorners) return previous.map(() => value);

    const next = [...previous];

    next[index] = value;

    return next;
};

const props = defineProps<ShapeGeometryKnobsProps>();

const shapePointCount = computed(() => computeShapePointCount(props.geometry.shapeKind.value));

const pointIterator = computed(() =>
    Array.from({ length: props.geometry.hasIndividualCorners.value ? shapePointCount.value : 1 }, (_, idx) => idx),
);

const columns = computed(() =>
    props.geometry.hasIndividualCorners.value ? Math.min(shapePointCount.value * 0.5, MAX_CORNER_COLUMNS) : 1,
);

const templateColumns = computed(() => `repeat(${columns.value}, 1fr)`);

const setJoinRadius = (index: number, value: number) => {
    const { joinRadii, hasIndividualCorners } = props.geometry;

    joinRadii.value = spreadCornerValue(joinRadii.value, index, value, hasIndividualCorners.value);
};

const setLameExponent = (index: number, value: number) => {
    const { lameExponents, hasIndividualCorners } = props.geometry;

    lameExponents.value = spreadCornerValue(lameExponents.value, index, value, hasIndividualCorners.value);
};
</script>

<template>
    <PageProp
        item-key="shapeKind"
        label="Shape"
        hint="The outline the shape is cut to, which also decides how many corners the corner fields offer."
    >
        <PageSelectField
            :value="geometry.shapeKind.value"
            :values="ShapeConst.DEFAULT_SHAPES"
            ariaLabel="Shape"
            @change="(value: ShapeConst.DefaultShape) => (geometry.shapeKind.value = value)"
        />
    </PageProp>

    <PageProp
        item-key="hasIndividualCorners"
        label="Individual corner settings"
        hint="Opens one field per corner instead of one field driving all of them together."
    >
        <PageCheckField
            :value="geometry.hasIndividualCorners.value"
            ariaLabel="Individual corner settings"
            @change="(value: boolean) => (geometry.hasIndividualCorners.value = value)"
        />
    </PageProp>

    <PageProp
        item-key="jointRadiiPx"
        label="Joint Radii (px)"
        hint="How far each corner is rounded. With individual corners off, the first field drives them all."
    >
        <div :class="styles.valueList" :style="{ gridTemplateColumns: templateColumns }">
            <PageNumberField
                v-for="index in pointIterator"
                :id="`jointRadius${index + 1}`"
                :key="index"
                :value="geometry.joinRadii.value[index]"
                :min="ShapeKnobs.MIN_JOIN_RADIUS"
                :max="ShapeKnobs.MAX_JOIN_RADIUS"
                :step="ShapeKnobs.JOIN_RADIUS_STEP"
                :width="CORNER_FIELD_WIDTH"
                :ariaLabel="`Joint radius ${index + 1}`"
                @input="(value: number) => setJoinRadius(index, value)"
            />
        </div>
    </PageProp>

    <PageProp
        item-key="lameExponent"
        label="Lamé Exponent"
        hint="How square or how pinched each rounded corner is: 2 is a circular round, higher is squarer, lower is pinched inward."
    >
        <div :class="styles.valueList" :style="{ gridTemplateColumns: templateColumns }">
            <PageNumberField
                v-for="index in pointIterator"
                :key="index"
                :value="geometry.lameExponents.value[index]"
                :min="ShapeKnobs.MIN_LAME_EXPONENT"
                :max="ShapeKnobs.MAX_LAME_EXPONENT"
                :step="ShapeKnobs.LAME_EXPONENT_STEP"
                :width="CORNER_FIELD_WIDTH"
                :ariaLabel="`Lamé exponent ${index + 1}`"
                @input="(value: number) => setLameExponent(index, value)"
            />
        </div>
    </PageProp>
</template>
