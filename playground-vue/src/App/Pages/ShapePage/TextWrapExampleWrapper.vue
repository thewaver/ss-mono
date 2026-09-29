<script setup lang="ts">
import { ShapeKnobs } from "../../Knobs/Shapes.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import TextWrapExample from "./Examples/TextWrap.vue";
import ShapeGeometryKnobs, { useShapeGeometry } from "./ShapeGeometryKnobs.vue";
import type { ShapeExampleProps } from "./ShapePage.types";

const props = defineProps<ShapeExampleProps>();

const geometry = useShapeGeometry(ShapeKnobs.STARTING_TEXT_WRAP_SHAPE_KIND);
</script>

<template>
    <TextWrapExample v-bind="{ ...props, ...geometry.geometryProps.value }" />

    <PageExampleKnobs><ShapeGeometryKnobs :geometry="geometry" /></PageExampleKnobs>
</template>
