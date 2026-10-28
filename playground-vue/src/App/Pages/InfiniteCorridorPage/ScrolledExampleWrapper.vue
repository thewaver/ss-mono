<script setup lang="ts">
import { shallowRef } from "vue";

import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ScrolledExample from "./Examples/Scrolled.vue";
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageVue.types";

const props = defineProps<InfiniteCorridorExampleProps>();

const scrollLength = shallowRef(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);
</script>

<template>
    <ScrolledExample v-bind="props" :scroll-length="scrollLength" />

    <PageExampleKnobs>
        <PageProp
            item-key="scrollLength"
            controls="Sets how long the example scroll runway that drives InfiniteCorridorProps.progress is"
            label="Scroll length"
            hint="How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower."
        >
            <PageNumberField
                :value="scrollLength"
                :min="InfiniteCorridorKnobs.MIN_SCROLL_LENGTH"
                :max="InfiniteCorridorKnobs.MAX_SCROLL_LENGTH"
                :step="InfiniteCorridorKnobs.SCROLL_LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Scroll length in box heights"
                @input="(value: number) => (scrollLength = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
