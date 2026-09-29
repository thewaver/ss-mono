<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Modal } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { CSSUtils } from "@thewaver/ss-utils";

import PageModalOverlay from "../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../StyledComponents/ModalPanel/PageModalPanel.vue";
import PageSourceView from "../SourceView/SourceView.vue";
import type { ExamplesProps, ExamplesSlots } from "./Examples.types";
import PageExample from "./PageExample.vue";

const DEFAULT_LAYOUT = "grid" as const;
const DEFAULT_MIN_COLUMN_WIDTH = 320;
const SINGLE_SPAN = 1;
const PERCENT = 100;

const props = defineProps<ExamplesProps>();

defineSlots<ExamplesSlots>();

const activeIndex = shallowRef(0);
const isModalOpen = shallowRef(false);

const widestSpan = computed(() =>
    props.items.reduce((widest, example) => Math.max(widest, example.span ?? SINGLE_SPAN), SINGLE_SPAN),
);

const layout = computed(() => props.layout ?? DEFAULT_LAYOUT);

const columns = computed(() =>
    layout.value === "grid"
        ? `repeat(auto-fill, minmax(min(${PERCENT / widestSpan.value}%, ${props.minColumnWidth ?? DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`
        : undefined,
);

const viewSource = (exampleIndex: number) => {
    activeIndex.value = exampleIndex;
    isModalOpen.value = true;
};
</script>

<template>
    <div :class="styles.examplesRootVariants[layout]" :style="{ gridTemplateColumns: columns }">
        <PageExample
            v-for="(example, exampleIndex) in items"
            :key="example.key"
            :example="example"
            @view-source="viewSource(exampleIndex)"
        >
            <slot :name="example.key" />
        </PageExample>
    </div>

    <Modal
        v-model:visibility="isModalOpen"
        :margins="CSSUtils.spreadMargin(40)"
        :ariaLabel="`${items[activeIndex].name} source code`"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                padding="0"
            >
                <PageSourceView :path="items[activeIndex].path!" />
            </PageModalPanel>
        </template>
    </Modal>
</template>
