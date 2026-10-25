<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef } from "vue";

import { Button, SpotlightGuide, SpotlightPrompt, toElement } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    RICH_TOUR_STEPS,
    TOUR_STORAGE_KEY,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.vue";
import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.vue";
import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";

const readStoredStep = () => {
    try {
        const stored = sessionStorage.getItem(TOUR_STORAGE_KEY);
        const step = stored === null ? Number.NaN : Number(stored);

        return Number.isInteger(step) && step >= 0 && step < RICH_TOUR_STEPS.length ? step : undefined;
    } catch {
        return undefined;
    }
};

const writeStoredStep = (step: number | undefined) => {
    try {
        if (step === undefined) sessionStorage.removeItem(TOUR_STORAGE_KEY);
        else sessionStorage.setItem(TOUR_STORAGE_KEY, `${step}`);
    } catch {
        return;
    }
};

const layerClass = useLayerClass();

const guide = shallowRef(false);
const prompt = shallowRef(false);

const step = shallowRef(0);
const resumeStep = shallowRef(readStoredStep());
const status = shallowRef(resumeStep.value === undefined ? "not started" : "paused");
const basketCount = shallowRef(0);

const shelfRef = shallowRef<HTMLElement>();
const addRef = shallowRef<HTMLElement>();
const basketRef = shallowRef<HTMLElement>();
const checkoutRef = shallowRef<HTMLElement>();

const setAddRef = (target: Element | ComponentPublicInstance | null) => {
    addRef.value = toElement(target);
};

const setCheckoutRef = (target: Element | ComponentPublicInstance | null) => {
    checkoutRef.value = toElement(target);
};

const targets = computed(() => [shelfRef.value, addRef.value, basketRef.value, checkoutRef.value]);

const current = computed(() => RICH_TOUR_STEPS[step.value]);

const isFirstStep = computed(() => step.value === 0);

const isLastStep = computed(() => step.value >= RICH_TOUR_STEPS.length - 1);

const changeStep = (next: number) => {
    step.value = next;
    resumeStep.value = next;
    writeStoredStep(next);
};

const start = () => {
    changeStep(resumeStep.value ?? 0);
    status.value = "running";
    guide.value = true;
};

const end = (next: string) => {
    status.value = next;
    guide.value = false;
    prompt.value = false;
    resumeStep.value = undefined;
    writeStoredStep(undefined);
};

const pause = () => {
    if (status.value === "running") status.value = "paused";
};

const handOverToReader = () => {
    prompt.value = true;
};

const next = () => {
    if (isLastStep.value) {
        end("finished");

        return;
    }

    changeStep(step.value + 1);
};

const add = () => {
    basketCount.value += 1;

    if (!prompt.value) return;

    prompt.value = false;
    changeStep(step.value + 1);
};
</script>

<template>
    <div :class="[styles.root, layerClass]">
        <div :class="styles.tourRow">
            <div ref="shelfRef" :class="styles.tourTarget">Potatoes</div>

            <Button id="tourAdd" :ref="setAddRef" @click="add">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Add to basket</PageButtonContent>
                </template>
            </Button>

            <div ref="basketRef" :class="styles.tourTarget">{{ `Basket: ${basketCount}` }}</div>

            <Button id="tourCheckout" :ref="setCheckoutRef">
                <template #renderContent="flags">
                    <PageButtonContent :flags="flags">Checkout</PageButtonContent>
                </template>
            </Button>
        </div>

        <Button id="tourStart" @click="start">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">{{
                    resumeStep === undefined ? "Start the shop tour" : `Resume the shop tour at step ${resumeStep + 1}`
                }}</PageButtonContent>
            </template>
        </Button>

        <SpotlightGuide
            v-model:visibility="guide"
            :element-ref="targets[step]"
            :padding="PADDING"
            ariaLabel="Shop tour"
            :announcement="`Step ${step + 1} of ${RICH_TOUR_STEPS.length}. ${current.title}.`"
            @hide="pause"
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
                    :title="current.title"
                >
                    <PageSpotlightPopupText>{{ current.text }}</PageSpotlightPopupText>

                    <PageSpotlightPopupText>{{
                        `Step ${step + 1} of ${RICH_TOUR_STEPS.length}`
                    }}</PageSpotlightPopupText>

                    <PageSpotlightPopupActions>
                        <Button id="tourSkip" @click="() => end('skipped')">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Skip</PageButtonContent>
                            </template>
                        </Button>

                        <Button id="tourBack" :is-disabled="isFirstStep" @click="() => changeStep(step - 1)">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Back</PageButtonContent>
                            </template>
                        </Button>

                        <Button
                            id="tourForward"
                            @click="() => (current.isWaitingForUser ? handOverToReader() : next())"
                        >
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">{{
                                    current.isWaitingForUser ? "Try" : isLastStep ? "Done" : "Next"
                                }}</PageButtonContent>
                            </template>
                        </Button>
                    </PageSpotlightPopupActions>
                </PageSpotlightPopup>
            </template>
        </SpotlightGuide>

        <SpotlightPrompt v-model:visibility="prompt" :element-ref="addRef" :padding="PADDING">
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
        </SpotlightPrompt>

        <div :class="exampleStyles.exampleReadout" data-readout>
            {{ `Step: ${step + 1} of ${RICH_TOUR_STEPS.length}, ${status}` }}
        </div>
    </div>
</template>
