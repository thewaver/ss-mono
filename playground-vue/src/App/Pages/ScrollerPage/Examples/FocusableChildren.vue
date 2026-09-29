<script setup lang="ts">
import { Button, Scroller } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.demo">
        <Scroller :gap="SCROLLER_GAP" :padding="FOCUS_RING_WIDTH">
            <template #renderButton="{ step, stepper }">
                <PageScrollerButton :step="step" :stepper="stepper" />
            </template>

            <div v-for="label in labels" :key="label" :class="styles.item">
                <Button>
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">{{ label }}</PageButtonContent>
                    </template>
                </Button>
            </div>
        </Scroller>
    </div>
</template>
