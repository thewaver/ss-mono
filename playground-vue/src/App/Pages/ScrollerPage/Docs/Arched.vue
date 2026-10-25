<script setup lang="ts">
import { shallowRef } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerArcContent from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent.vue";

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.stripLayout">
        <PageScrollerButton id="archedBack" :controller="controller" step="previous" />

        <div :class="styles.scrollerCell">
            <Scroller
                bar-side-x="start"
                :padding="FOCUS_RING_WIDTH"
                :compute-progress-at-point="ScrollerArcContentUtils.computeProgressAtPoint"
                @mount="(next: ScrollerController) => (controller = next)"
            >
                <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                    <PageScrollerArcContent
                        :render-props="renderProps"
                        :set-track-ref="setTrackRef"
                        :set-thumb-ref="setThumbRef"
                    />
                </template>

                <div v-for="label in ITEM_LABELS" :key="label" :class="styles.chip">{{ label }}</div>
            </Scroller>
        </div>

        <PageScrollerButton id="archedForward" :controller="controller" step="next" />
    </div>
</template>
