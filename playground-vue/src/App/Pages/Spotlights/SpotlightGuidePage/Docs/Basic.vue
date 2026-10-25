<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef } from "vue";

import { Button, SpotlightGuide } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.vue";
import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.vue";
import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightGuideBasicDocsExampleProps } from "../../SpotlightsVue.types";

type Props = SpotlightGuideBasicDocsExampleProps;

defineProps<Props>();

const layerClass = useLayerClass();

const visibility = shallowRef(false);
const step = shallowRef(0);
const status = shallowRef("not started");

const stepRefs = shallowRef<(HTMLElement | undefined)[]>(TOUR_STEPS.map(() => undefined));

const setStepRef = (index: number, element: Element | ComponentPublicInstance | null) => {
    const next = element instanceof HTMLElement ? element : undefined;

    if (stepRefs.value[index] === next) return;

    stepRefs.value = stepRefs.value.map((ref, refIndex) => (refIndex === index ? next : ref));
};

const isLastStep = computed(() => step.value >= TOUR_STEPS.length - 1);

const end = (next: string) => {
    status.value = next;
    visibility.value = false;
};

const start = () => {
    step.value = 0;
    status.value = "running";
    visibility.value = true;
};

const advance = () => {
    if (isLastStep.value) {
        end("finished");

        return;
    }

    step.value += 1;
};

const handleHide = () => {
    if (status.value === "running") status.value = "closed with Escape";
};
</script>

<template>
    <div :class="[styles.root, layerClass]">
        <div :class="styles.tourStrip" data-scroll-box>
            <div
                v-for="(tourStep, index) in TOUR_STEPS"
                :key="tourStep.title"
                :ref="(element) => setStepRef(index, element)"
                :class="styles.tourTarget"
            >
                {{ tourStep.title }}
            </div>
        </div>

        <Button id="guideStart" @click="start">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Take the tour</PageButtonContent>
            </template>
        </Button>

        <SpotlightGuide
            v-model:visibility="visibility"
            :element-ref="stepRefs[step]"
            :padding="padding"
            :transition-duration-ms="transitionDurationMs"
            :popup-placement="popupPlacement"
            :popup-offset="popupOffset"
            ariaLabel="Product tour"
            :announcement="`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`"
            @hide="handleHide"
        >
            <template #renderHighlight="{ visibilityTarget }">
                <SpotlightHighlight :visibility-target="visibilityTarget" />
            </template>

            <template #renderOverlay="{ visibilityTarget, transitionDurationMs: overlayDurationMs, maskStyle }">
                <SpotlightOverlay
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="overlayDurationMs"
                    :mask-style="maskStyle"
                />
            </template>

            <template #renderPopup="{ visibilityTarget, transitionDurationMs: popupDurationMs }">
                <PageSpotlightPopup
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="popupDurationMs"
                    :title="TOUR_STEPS[step].title"
                >
                    <PageSpotlightPopupText>{{ TOUR_STEPS[step].text }}</PageSpotlightPopupText>

                    <PageSpotlightPopupActions>
                        <Button id="guideSkip" @click="() => end('skipped')">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Skip all</PageButtonContent>
                            </template>
                        </Button>

                        <Button id="guideNext" @click="advance">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">{{ isLastStep ? "Done" : "Next" }}</PageButtonContent>
                            </template>
                        </Button>
                    </PageSpotlightPopupActions>
                </PageSpotlightPopup>
            </template>
        </SpotlightGuide>

        <div :class="exampleStyles.exampleReadout" data-readout>{{ `Tour: ${status}` }}</div>
    </div>
</template>
