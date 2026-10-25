<script setup lang="ts">
import { Preview } from "@thewaver/ss-components-vue";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { PreviewScrolledDocsExampleProps } from "../PreviewPageVue.types";

const AFTERWARDS = [
    "The rest of the page carries on below, which is the whole of the problem.",
    "Open the preview, read to the end of it, and close it again: everything under it jumps up by the height that just disappeared, and the control you pressed goes with it.",
    "With the scroll asked for, the box comes back to where you were standing.",
];

type Props = PreviewScrolledDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.scrollBox" data-scroll-box>
        <div :class="styles.panel">
            <Preview
                :collapsed-height="COLLAPSED_HEIGHT"
                :is-scrolled-into-view-on-collapse="isScrolledIntoViewOnCollapse"
            >
                <template #renderContent>
                    <div :class="styles.paragraphs">
                        <div v-for="paragraph in LONG_PARAGRAPHS" :key="paragraph">{{ paragraph }}</div>
                    </div>
                </template>

                <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
                    <div
                        :class="styles.fade"
                        :style="{
                            opacity: visibilityTarget,
                            transition: `opacity ${transitionDurationMs}ms`,
                        }"
                    />
                </template>

                <template #renderTrigger="flags">
                    <PageButtonContent :flags="flags">{{
                        flags.isExpanded ? "Show less" : "Read more"
                    }}</PageButtonContent>
                </template>
            </Preview>
        </div>

        <div :class="styles.afterwards">
            <div v-for="paragraph in AFTERWARDS" :key="paragraph">{{ paragraph }}</div>
        </div>
    </div>
</template>
