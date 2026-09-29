<script setup lang="ts">
import { useModel } from "vue";

import { Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerButtonPlacement } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps & {
    "buttonPlacement"?: ScrollerButtonPlacement;
    "progress"?: number;
    "onUpdate:progress"?: (ratio: number) => void;
};

const props = defineProps<Props>();

const progress = useModel(props, "progress");
</script>

<template>
    <div :class="styles.demo">
        <Scroller
            v-model:progress="progress"
            :gap="SCROLLER_GAP"
            :padding="FOCUS_RING_WIDTH"
            :button-placement="buttonPlacement"
        >
            <template #renderButton="{ step, stepper }">
                <PageScrollerButton :step="step" :stepper="stepper" />
            </template>

            <div v-for="label in labels" :key="label" :class="styles.chip">{{ label }}</div>
        </Scroller>
    </div>
</template>
