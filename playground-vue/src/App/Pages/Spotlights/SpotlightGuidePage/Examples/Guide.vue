<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useModel } from "vue";

import { Button, SpotlightGuide } from "@thewaver/ss-components-vue";
import { PADDING, TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.vue";
import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.vue";
import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightGuideExampleProps } from "../../Spotlights.types";

type Props = SpotlightGuideExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const layerClass = useLayerClass();

const stepRefs = shallowRef<(HTMLElement | undefined)[]>(TOUR_STEPS.map(() => undefined));

const setStepRef = (index: number, element: Element | ComponentPublicInstance | null) => {
    const next = element instanceof HTMLElement ? element : undefined;

    if (stepRefs.value[index] === next) return;

    stepRefs.value = stepRefs.value.map((ref, refIndex) => (refIndex === index ? next : ref));
};

const isLastStep = computed(() => props.step >= TOUR_STEPS.length - 1);

const start = async () => {
    props.onStart();
    visibility.value = true;
};

const next = async () => {
    if (!isLastStep.value) {
        props.onStepChange(props.step + 1);

        return;
    }

    props.onEnd("finished");
};
</script>

<template>
    <div :class="[styles.root, layerClass]">
        <div :class="styles.tourStrip" data-scroll-box="">
            <div
                v-for="(tourStep, index) in TOUR_STEPS"
                :key="tourStep.title"
                :ref="(element) => setStepRef(index, element)"
                :class="styles.tourTarget"
            >
                {{ tourStep.title }}
            </div>
        </div>

        <Button @click="start">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Take the tour</PageButtonContent>
            </template>
        </Button>

        <SpotlightGuide
            v-model:visibility="visibility"
            :element-ref="stepRefs[step]"
            :padding="PADDING"
            ariaLabel="Product tour"
            :announcement="`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`"
        >
            <template #renderHighlight="{ visibilityTarget }">
                <SpotlightHighlight :visibility-target="visibilityTarget" />
            </template>

            <template #renderOverlay="{ visibilityTarget, transitionDurationMs, maskStyle }">
                <SpotlightOverlay
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :mask-style="maskStyle"
                />
            </template>

            <template #renderPopup="{ visibilityTarget, transitionDurationMs }">
                <PageSpotlightPopup
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                    :title="TOUR_STEPS[step].title"
                >
                    <PageSpotlightPopupText>{{ TOUR_STEPS[step].text }}</PageSpotlightPopupText>

                    <PageSpotlightPopupActions>
                        <Button @click="async () => props.onEnd('skipped')">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Skip all</PageButtonContent>
                            </template>
                        </Button>

                        <Button @click="next">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">{{ isLastStep ? "Done" : "Next" }}</PageButtonContent>
                            </template>
                        </Button>
                    </PageSpotlightPopupActions>
                </PageSpotlightPopup>
            </template>
        </SpotlightGuide>
    </div>
</template>
