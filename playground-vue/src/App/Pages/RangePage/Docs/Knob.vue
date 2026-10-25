<script setup lang="ts">
import { shallowRef } from "vue";

import { Range, RangeUtils } from "@thewaver/ss-components-vue";
import type { Point2d } from "@thewaver/ss-utils";

import PageRangeKnob from "../../../StyledComponents/RangeKnob/RangeKnob.vue";

const MIN = 0;
const MAX = 100;
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const KNOB_TRAVEL = { min: MIN, max: MAX, startAngle: START_ANGLE, sweepAngle: SWEEP_ANGLE };

const value = shallowRef(30);

const computeValueAtPoint = (point: Point2d, rect: DOMRect) => RangeUtils.computeAngularValue(point, rect, KNOB_TRAVEL);
</script>

<template>
    <Range
        id="gain"
        v-model:value="value"
        :min="MIN"
        :max="MAX"
        ariaLabel="Gain"
        :compute-value-at-point="computeValueAtPoint"
    >
        <template #renderContent="renderProps">
            <PageRangeKnob :render-props="renderProps" :start-angle="START_ANGLE" :sweep-angle="SWEEP_ANGLE" />
        </template>
    </Range>
</template>
