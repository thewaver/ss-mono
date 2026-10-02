<script setup lang="ts">
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import SharedPaintExample from "./Examples/SharedPaint.vue";
import ShapeGeometryKnobs, { useShapeGeometry } from "./ShapeGeometryKnobs.vue";
import type { ShapeExampleProps } from "./ShapePage.types";

const props = defineProps<ShapeExampleProps>();

const geometry = useShapeGeometry();
</script>

<template>
    <SharedPaintExample v-bind="{ ...props, ...geometry.geometryProps.value }" />

    <PageExampleKnobs><ShapeGeometryKnobs :geometry="geometry" /></PageExampleKnobs>
</template>
