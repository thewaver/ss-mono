<script setup lang="ts">
import { shallowRef } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { toItemLabels } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import type { ScrollerBasicDocsExampleProps } from "../ScrollerPageVue.types";

type Props = ScrollerBasicDocsExampleProps;

defineProps<Props>();

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.stripLayout">
        <PageScrollerButton id="basicBack" :controller="controller" step="previous" />

        <div :class="styles.scrollerCell">
            <Scroller
                :padding="FOCUS_RING_WIDTH"
                :overlap-count="overlapCount"
                @mount="(next: ScrollerController) => (controller = next)"
            >
                <div v-for="label in toItemLabels(itemCount)" :key="label" :class="styles.chip">{{ label }}</div>
            </Scroller>
        </div>

        <PageScrollerButton id="basicForward" :controller="controller" step="next" />
    </div>
</template>
