<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Preview } from "@thewaver/ss-components-vue";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";

const isExpanded = shallowRef(false);
</script>

<template>
    <div :class="styles.panel">
        <Preview v-model:expanded="isExpanded" :collapsed-height="COLLAPSED_HEIGHT">
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

    <Button id="toggleFromHere" @click="() => void (isExpanded = !isExpanded)">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Toggle from here</PageButtonContent>
        </template>
    </Button>
</template>
