<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import type { ScrollerDrivenDocsExampleProps } from "../ScrollerPageVue.types";

type Props = ScrollerDrivenDocsExampleProps;

const props = defineProps<Props>();

const progress = useModel(props, "progress");

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.stripLayout">
        <PageScrollerButton id="drivenBack" :controller="controller" step="previous" />

        <div :class="styles.scrollerCell">
            <Scroller
                v-model:progress="progress"
                :padding="FOCUS_RING_WIDTH"
                @mount="(next: ScrollerController) => (controller = next)"
            >
                <div v-for="label in ITEM_LABELS" :key="label" :class="styles.chip">{{ label }}</div>
            </Scroller>
        </div>

        <PageScrollerButton id="drivenForward" :controller="controller" step="next" />
    </div>
</template>
