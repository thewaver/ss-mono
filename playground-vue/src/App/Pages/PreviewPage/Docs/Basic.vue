<script setup lang="ts">
import { Preview } from "@thewaver/ss-components-vue";
import { LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { PreviewBasicDocsExampleProps } from "../PreviewPageVue.types";

type Props = PreviewBasicDocsExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.panel">
        <Preview :collapsed-height="collapsedHeight">
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
                <PageButtonContent :flags="flags">{{ flags.isExpanded ? "Show less" : "Read more" }}</PageButtonContent>
            </template>
        </Preview>
    </div>
</template>
