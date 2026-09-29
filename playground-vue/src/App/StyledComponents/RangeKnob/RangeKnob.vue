<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/RangeKnob/RangeKnob.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { RangeKnobProps } from "./RangeKnob.types";

const props = defineProps<RangeKnobProps>();

const layerClass = useLayerClass();

const angle = computed(() => props.startAngle + (props.renderProps.ratios[0] ?? 0) * props.sweepAngle);
</script>

<template>
    <div
        :class="[
            styles.rangeKnob,
            layerClass,
            renderProps.focusVisibleThumb !== undefined && styles.isFocused,
            renderProps.isDisabled && styles.isDisabled,
            renderProps.hasError && styles.hasError,
        ]"
    >
        <div :class="styles.rangeKnobPointer" :style="{ transform: `rotate(${angle}deg)` }" />

        <div :class="styles.rangeKnobReadout" aria-hidden="true">
            {{ renderProps.values[0] }}
        </div>
    </div>
</template>
