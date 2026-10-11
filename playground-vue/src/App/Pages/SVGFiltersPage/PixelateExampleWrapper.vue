<script setup lang="ts">
import { shallowRef } from "vue";

import { SVGFilterKnobs } from "@thewaver/ss-playground/App/Knobs/SVGFilters.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PixelateExample from "./Examples/Pixelate.vue";
import type { SVGFiltersExampleProps } from "./SVGFiltersPage.types";

const props = defineProps<SVGFiltersExampleProps>();

const size = shallowRef(SVGFilterKnobs.Pixelate.STARTING_SIZE);
</script>

<template>
    <PixelateExample v-bind="props" :size="size" />

    <PageExampleKnobs>
        <PageProp
            item-key="pixelSize"
            label="Square size (px)"
            hint="How wide each square is. Each takes the color at its own middle; 1 leaves the picture alone."
        >
            <PageNumberField
                :value="size"
                :min="SVGFilterKnobs.Pixelate.MIN_SIZE"
                :max="SVGFilterKnobs.Pixelate.MAX_SIZE"
                :step="SVGFilterKnobs.Pixelate.SIZE_STEP"
                ariaLabel="Square size in pixels"
                @input="(value: number) => (size = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
