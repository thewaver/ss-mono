<script setup lang="ts">
import { computed, useId } from "vue";

import { SunburstUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSunburstArcProps } from "./SunburstContent.types";

const PAD_LENGTH = 1;
const RING_GAP = 1;
const MIN_LABEL_ANGLE = 0.03;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

const props = defineProps<PageSunburstArcProps>();

const layerClass = useLayerClass();

const gradientId = useId();

const isLabelShown = computed(() => props.state.endAngle - props.state.startAngle > MIN_LABEL_ANGLE);
</script>

<template>
    <defs>
        <linearGradient :id="gradientId" :x1="1" :y1="0" :x2="0" :y2="1">
            <stop :offset="0" :class="styles.sunburstStopLight[family]" />
            <stop :offset="1" :class="styles.sunburstStopDark[family]" />
        </linearGradient>
    </defs>

    <path
        :class="[styles.sunburstArc, layerClass, state.isBranch && styles.sunburstArcBranch]"
        :style="{ fill: `url(#${gradientId})` }"
        :d="SunburstUtils.computeArcPath(state, { padLength: PAD_LENGTH, ringGap: RING_GAP })"
    >
        <title>{{ title }}</title>
    </path>

    <text
        :class="`${styles.sunburstText} ${styles.sunburstLabel[family]}`"
        :style="{ fillOpacity: isLabelShown ? LABEL_SHOWN : LABEL_HIDDEN }"
        :transform="SunburstUtils.computeLabelTransform(state)"
        text-anchor="middle"
        dy="0.35em"
    >
        {{ name }}
    </text>
</template>
