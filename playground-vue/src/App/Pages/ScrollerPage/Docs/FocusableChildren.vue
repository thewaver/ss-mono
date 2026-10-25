<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Scroller } from "@thewaver/ss-components-vue";
import type { ScrollerController } from "@thewaver/ss-components-vue";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import PageScrollerButton from "../../../PageComponents/ScrollerButton/ScrollerButton.vue";
import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";

const controller = shallowRef<ScrollerController>();
</script>

<template>
    <div :class="styles.stripLayout">
        <PageScrollerButton id="focusableChildrenBack" :controller="controller" step="previous" />

        <div :class="styles.scrollerCell">
            <Scroller :padding="FOCUS_RING_WIDTH" @mount="(next: ScrollerController) => (controller = next)">
                <div v-for="label in ITEM_LABELS" :key="label" :class="styles.item">
                    <Button>
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ label }}</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </Scroller>
        </div>

        <PageScrollerButton id="focusableChildrenForward" :controller="controller" step="next" />
    </div>
</template>
