<script setup lang="ts">
import { Scroller } from "@thewaver/ss-components-vue";
import { SHORT_TRACK_LENGTH } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.vue";
import type { ScrollerExampleProps } from "../ScrollerPageVue.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.demo">
        <Scroller :gap="SCROLLER_GAP" :padding="FOCUS_RING_WIDTH" :overlap-count="overlapCount">
            <template #renderButton="{ step, stepper, axis }">
                <PageScrollerButton :step="step" :stepper="stepper" :axis="axis" />
            </template>

            <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                <PageScrollerBarContent
                    :render-props="renderProps"
                    :set-track-ref="setTrackRef"
                    :set-thumb-ref="setThumbRef"
                    :track-length="SHORT_TRACK_LENGTH"
                />
            </template>

            <div v-for="label in labels" :key="label" :class="styles.chip">{{ label }}</div>
        </Scroller>
    </div>
</template>
