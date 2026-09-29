<script setup lang="ts">
import { useModel } from "vue";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import type { WheelExampleProps } from "../Wheels.types";
import OverheadExample from "./Examples/Overhead.vue";

const FLAT_WHEEL_SIZE = 340;

const props = defineProps<WheelExampleProps>();

const targetIndex = useModel(props, "targetIndex");
</script>

<template>
    <PageMeasureBox :width="FLAT_WHEEL_SIZE">
        <OverheadExample
            v-model:target-index="targetIndex"
            :wedges="wedges"
            :is-disabled="isDisabled"
            :spin-duration-ms="spinDurationMs"
            :settle-duration-ms="settleDurationMs"
            :rest-duration-ms="restDurationMs"
            :idle-delay-ms="idleDelayMs"
            :compute-spin-defs="computeSpinDefs"
            @selected-wedge-change="props.onSelectedWedgeChange"
        />
    </PageMeasureBox>
</template>
