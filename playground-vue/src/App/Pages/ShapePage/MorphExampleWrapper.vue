<script setup lang="ts">
import { shallowRef } from "vue";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import MorphExample from "./Examples/Morph.vue";
import type { ShapeExampleProps } from "./ShapePage.types";

const props = defineProps<ShapeExampleProps>();

const starPoints = shallowRef(ShapeKnobs.STARTING_STAR_POINTS);
</script>

<template>
    <MorphExample v-bind="props" :star-points="starPoints" />

    <PageExampleKnobs>
        <PageProp
            item-key="starPoints"
            label="Star points"
            hint="How many tips the star has. The contour carries twice as many points: one per tip, one per notch between tips."
        >
            <PageNumberField
                :value="starPoints"
                :min="ShapeKnobs.MIN_STAR_POINTS"
                :max="ShapeKnobs.MAX_STAR_POINTS"
                :step="ShapeKnobs.STAR_POINTS_STEP"
                ariaLabel="Star points"
                @input="(value: number) => (starPoints = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
