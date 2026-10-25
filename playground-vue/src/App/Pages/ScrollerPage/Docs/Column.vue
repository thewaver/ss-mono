<script setup lang="ts">
import { shallowRef } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.vue";

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.columnLayout">
        <PageScrollerButton id="columnUp" :controller="controller" step="previous" axis="y" />

        <div :class="styles.scrollerCell">
            <Scroller
                :padding="FOCUS_RING_WIDTH"
                overflow-x="hidden"
                overflow-y="auto"
                @mount="(next: ScrollerController) => (controller = next)"
            >
                <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                    <PageScrollerBarContent
                        :render-props="renderProps"
                        :set-track-ref="setTrackRef"
                        :set-thumb-ref="setThumbRef"
                    />
                </template>

                <div v-for="label in ITEM_LABELS" :key="label" :class="styles.row">{{ label }}</div>
            </Scroller>
        </div>

        <PageScrollerButton id="columnDown" :controller="controller" step="next" axis="y" />
    </div>
</template>
