<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";

import type { ScrollerArcContentProps } from "./ScrollerArcContentVue.types";

const props = defineProps<ScrollerArcContentProps>();

const thumbCenter = computed(() => ScrollerArcContentUtils.computeThumbCenter(props.renderProps.ratio));
</script>

<template>
    <div :class="[styles.scrollerArc, !renderProps.isShown && styles.isHidden]">
        <div
            :ref="setTrackRef"
            :class="styles.scrollerArcTrack"
            :style="{ width: `${ScrollerArcContentUtils.WIDTH}px`, height: `${ScrollerArcContentUtils.HEIGHT}px` }"
        >
            <svg :class="styles.scrollerArcSvg" aria-hidden="true">
                <path :class="styles.scrollerArcPath" :d="ScrollerArcContentUtils.PATH" />
            </svg>

            <div
                :ref="setThumbRef"
                :class="[styles.scrollerArcThumb, renderProps.isDragging && styles.isDragging]"
                :style="{ left: `${thumbCenter.x}px`, top: `${thumbCenter.y}px` }"
            />
        </div>
    </div>
</template>
