<script setup lang="ts">
import { Preview } from "@thewaver/ss-components-vue";
import { COLLAPSED_HEIGHT, SHORT_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
</script>

<template>
    <div :class="styles.panel">
        <Preview :collapsed-height="COLLAPSED_HEIGHT">
            <template #renderContent>
                <div :class="styles.paragraphs">
                    <div v-for="paragraph in SHORT_PARAGRAPHS" :key="paragraph">{{ paragraph }}</div>
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
