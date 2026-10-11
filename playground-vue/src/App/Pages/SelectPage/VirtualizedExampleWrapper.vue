<script setup lang="ts">
import { useModel } from "vue";

import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import VirtualizedExample from "./Examples/Virtualized.vue";
import type { SelectVirtualizedExampleProps } from "./SelectPage.types";

const STRESS_COUNT_FIELD_WIDTH = 120;

type Props = SelectVirtualizedExampleProps & {
    count: number;
    onCountChange: (count: number) => void;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
const visibility = useModel(props, "visibility");
</script>

<template>
    <VirtualizedExample v-model:value="value" v-model:visibility="visibility" :options="options" />

    <PageExampleKnobs>
        <PageProp
            item-key="stressCount"
            label="Option count"
            hint="How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
        >
            <PageNumberField
                :value="count"
                :min="SelectKnobs.MIN_STRESS_COUNT"
                :max="SelectKnobs.MAX_STRESS_COUNT"
                :step="SelectKnobs.STRESS_COUNT_STEP"
                :width="STRESS_COUNT_FIELD_WIDTH"
                ariaLabel="Option count"
                @input="props.onCountChange"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
