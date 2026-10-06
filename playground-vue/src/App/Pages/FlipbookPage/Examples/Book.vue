<script setup lang="ts">
import { useModel } from "vue";

import { Flipbook } from "@thewaver/ss-components-vue";
import {
    computeFlipbookPageLabel,
    computeFlipbookSpreadAnnouncement,
    computeFlipbookStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { FlipbookExampleProps } from "../FlipbookPage.types";

const BOOK_GAP = 10;
const FIRST_PAGE = 0;

type Props = FlipbookExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.book">
            <Flipbook
                v-model:index="index"
                :pages="FLIPBOOK_PAGES"
                :transition-duration-ms="transitionDurationMs"
                :gap="BOOK_GAP"
                ariaLabel="A book of hinges"
                :compute-page-label="computeFlipbookPageLabel"
                :compute-spread-announcement="computeFlipbookSpreadAnnouncement"
                :compute-step-label="computeFlipbookStepLabel"
            >
                <template #renderPage="{ page, state }">
                    <div
                        :class="[
                            styles.page,
                            state.side === 'left' ? styles.pageLeft : styles.pageRight,
                            (state.index === FIRST_PAGE || state.index === state.count - 1) && styles.cover,
                        ]"
                    >
                        <div :class="styles.pageHeading">{{ page.heading }}</div>
                        <div :class="styles.pageText">{{ page.text }}</div>
                        <div :class="styles.pageNumber">{{ state.index + 1 }}</div>
                    </div>
                </template>

                <template #renderStep="{ step, renderProps }">
                    <PageControlButtonContent :flags="renderProps" :glyph="CONTROL_GLYPHS[step]" />
                </template>

                <template #renderControls="controls">
                    <div :class="styles.controls">
                        <component :is="controls.renderStep('previous')" />
                        <component :is="controls.renderStep('next')" />
                    </div>
                </template>
            </Flipbook>
        </div>
    </div>
</template>
