<script setup lang="ts">
import { shallowRef } from "vue";

import { ShapeKnobs } from "@thewaver/ss-playground/App/Knobs/Shapes.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import DefaultExample from "./Examples/Default.vue";
import ShapeGeometryKnobs, { useShapeGeometry } from "./ShapeGeometryKnobs.vue";
import type { ShapeExampleProps } from "./ShapePage.types";

const props = defineProps<ShapeExampleProps>();

const geometry = useShapeGeometry();

const shouldClipChildren = shallowRef(ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN);
const shouldPadChildren = shallowRef(ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN);
</script>

<template>
    <DefaultExample
        v-bind="{ ...props, ...geometry.geometryProps.value }"
        :should-clip-children="shouldClipChildren"
        :should-pad-children="shouldPadChildren"
    />

    <PageExampleKnobs>
        <ShapeGeometryKnobs :geometry="geometry" />

        <PageProp item-key="shouldClipChildren" v-bind="ShapeKnobs.SHOULD_CLIP_CHILDREN_TEXT">
            <PageCheckField
                :value="shouldClipChildren"
                ariaLabel="Clip children"
                @change="(value: boolean) => (shouldClipChildren = value)"
            />
        </PageProp>

        <PageProp item-key="shouldPadChildren" v-bind="ShapeKnobs.SHOULD_PAD_CHILDREN_TEXT">
            <PageCheckField
                :value="shouldPadChildren"
                ariaLabel="Pad children"
                @change="(value: boolean) => (shouldPadChildren = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
