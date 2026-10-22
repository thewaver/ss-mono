<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { Button, Flipbook } from "@thewaver/ss-components-vue";
import type { FlipbookControls, FlipbookStep } from "@thewaver/ss-components-vue";
import {
    computeFlipbookPageLabel,
    computeFlipbookSpreadAnnouncement,
    computeFlipbookStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { FlipbookExampleProps } from "../FlipbookPage.types";

const FIRST_PAGE = 0;

const STEPS: FlipbookStep[] = ["previous", "next"];

type Props = FlipbookExampleProps;

const props = defineProps<Props>();

const index = useModel(props, "index");

const controls = shallowRef<FlipbookControls>();

const turn = (step: FlipbookStep) => {
    controls.value?.turn(step);
};
</script>

<template>
    <div :class="styles.stage">
        <div :class="styles.book">
            <PageMeasureBox is-filling :height="styles.BOOK_HEIGHT">
                <Flipbook
                    v-model:index="index"
                    :pages="FLIPBOOK_PAGES"
                    :transition-duration-ms="transitionDurationMs"
                    ariaLabel="A book of hinges"
                    :compute-page-label="computeFlipbookPageLabel"
                    :compute-spread-announcement="computeFlipbookSpreadAnnouncement"
                    @mount="(next: FlipbookControls) => (controls = next)"
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
                </Flipbook>
            </PageMeasureBox>
        </div>

        <div v-if="controls" :class="styles.controls">
            <Button
                v-for="step in STEPS"
                :key="step"
                :ariaLabel="computeFlipbookStepLabel(step)"
                :is-disabled="!controls.getCanTurn(step)"
                @click="turn(step)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="CONTROL_GLYPHS[step]" />
                </template>
            </Button>
        </div>
    </div>
</template>
