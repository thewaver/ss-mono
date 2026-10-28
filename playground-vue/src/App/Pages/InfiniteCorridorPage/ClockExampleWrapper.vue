<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ClockExample from "./Examples/Clock.vue";
import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageVue.types";

const props = defineProps<InfiniteCorridorExampleProps & { startingLapMs: number }>();

const lapMs = shallowRef(props.startingLapMs);

watch(
    () => props.startingLapMs,
    (next) => {
        lapMs.value = next;
    },
);

const exampleProps = computed(() => ({
    items: props.items,
    glideDurationMs: props.glideDurationMs,
    spinDegreesPerSecond: props.spinDegreesPerSecond,
    toLayout: props.toLayout,
}));
</script>

<template>
    <ClockExample v-bind="exampleProps" :lap-ms="lapMs" />

    <PageExampleKnobs>
        <PageProp
            item-key="lapMs"
            controls="Sets how fast the example clock advances InfiniteCorridorProps.progress"
            label="Lap (ms)"
            hint="How long the clock takes to walk the whole corridor once, past every room and back to the first."
        >
            <PageNumberField
                :value="lapMs"
                :reset-value="startingLapMs"
                :min="InfiniteCorridorKnobs.MIN_LAP_MS"
                :max="InfiniteCorridorKnobs.MAX_LAP_MS"
                :step="InfiniteCorridorKnobs.LAP_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Lap duration in milliseconds"
                @input="(value: number) => (lapMs = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
