<script setup lang="ts">
import { shallowRef } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageScrollerBarContent from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent.vue";
import type { ScrollerBothWaysDocsExampleProps } from "../ScrollerPageVue.types";

const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerBothWaysDocsExampleProps;

defineProps<Props>();

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.bothWaysLayout">
        <div :class="styles.bothWaysCell.up">
            <PageScrollerButton id="bothWaysUp" :controller="controller" step="previous" axis="y" />
        </div>

        <div :class="styles.bothWaysCell.back">
            <PageScrollerButton id="bothWaysBack" :controller="controller" step="previous" axis="x" />
        </div>

        <div :class="styles.bothWaysCell.box">
            <Scroller
                :padding="FOCUS_RING_WIDTH"
                :overflow-x="overflowX"
                :overflow-y="overflowY"
                @mount="(next: ScrollerController) => (controller = next)"
            >
                <template #renderBar="{ renderProps, setTrackRef, setThumbRef }">
                    <PageScrollerBarContent
                        :render-props="renderProps"
                        :set-track-ref="setTrackRef"
                        :set-thumb-ref="setThumbRef"
                    />
                </template>

                <div :class="styles.cellGrid">
                    <template v-for="row in INDICES" :key="row">
                        <div v-for="column in INDICES" :key="column" :class="styles.chip">
                            {{ getGridCellLabel(row, column) }}
                        </div>
                    </template>
                </div>
            </Scroller>
        </div>

        <div :class="styles.bothWaysCell.next">
            <PageScrollerButton id="bothWaysForward" :controller="controller" step="next" axis="x" />
        </div>

        <div :class="styles.bothWaysCell.down">
            <PageScrollerButton id="bothWaysDown" :controller="controller" step="next" axis="y" />
        </div>
    </div>
</template>
