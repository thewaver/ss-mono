<script setup lang="ts">
import { shallowRef } from "vue";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
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

        <PageProp
            item-key="shouldClipChildren"
            label="Clip children"
            hint="Cuts whatever is inside the shape to the shape's own contour, instead of letting it spill past."
        >
            <PageCheckField
                :value="shouldClipChildren"
                ariaLabel="Clip children"
                @change="(value: boolean) => (shouldClipChildren = value)"
            />
        </PageProp>

        <PageProp
            item-key="shouldPadChildren"
            label="Pad children"
            hint="Insets whatever is inside far enough to clear the rounded corners, so text does not run under them."
        >
            <PageCheckField
                :value="shouldPadChildren"
                ariaLabel="Pad children"
                @change="(value: boolean) => (shouldPadChildren = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
