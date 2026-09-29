<script setup lang="ts">
import { useModel } from "vue";

import { Preview } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { PreviewExampleProps } from "../PreviewPage.types";

type Props = PreviewExampleProps;

const props = defineProps<Props>();

const expanded = useModel(props, "expanded");
</script>

<template>
    <div :class="styles.panel">
        <Preview
            v-model:expanded="expanded"
            :collapsed-height="collapsedHeight"
            :is-scrolled-into-view-on-collapse="isScrolledIntoViewOnCollapse"
        >
            <template #renderContent>
                <div :class="styles.paragraphs">
                    <div v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</div>
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
