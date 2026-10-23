<script setup lang="ts">
import { Scroller } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerArcContent from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent.vue";
import type { ScrollerExampleProps } from "../ScrollerPageVue.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.demo">
        <Scroller
            :gap="SCROLLER_GAP"
            bar-side-x="start"
            :padding="FOCUS_RING_WIDTH"
            :overlap-count="overlapCount"
            :compute-progress-at-point="ScrollerArcContentUtils.computeProgressAtPoint"
        >
            <template #renderButton="{ step, stepper, axis }">
                <PageScrollerButton :step="step" :stepper="stepper" :axis="axis" />
            </template>

            <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                <PageScrollerArcContent
                    :render-props="renderProps"
                    :set-track-ref="setTrackRef"
                    :set-thumb-ref="setThumbRef"
                />
            </template>

            <div v-for="label in labels" :key="label" :class="styles.chip">{{ label }}</div>
        </Scroller>
    </div>
</template>
