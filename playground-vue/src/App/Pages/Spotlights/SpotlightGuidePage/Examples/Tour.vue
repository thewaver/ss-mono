<script setup lang="ts">
import { type ComponentPublicInstance, computed, shallowRef, useModel } from "vue";

import { Button, SpotlightGuide, SpotlightPrompt, toElement } from "@thewaver/ss-components-vue";
import { RICH_TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageControlRow from "../../../../PageComponents/ControlRow/PageControlRow.vue";
import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.vue";
import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.vue";
import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightTourExampleProps } from "../SpotlightGuidePage.types";

type Props = SpotlightTourExampleProps;

const props = defineProps<Props>();

const guide = useModel(props, "guide");
const prompt = useModel(props, "prompt");

const layerClass = useLayerClass();

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

const current = computed(() => RICH_TOUR_STEPS[props.step]);

const isFirstStep = computed(() => props.step === 0);

const isLastStep = computed(() => props.step >= RICH_TOUR_STEPS.length - 1);

const handOverToUser = () => {
    guide.value = false;
    prompt.value = true;
};

const next = () => {
    if (isLastStep.value) {
        props.onEnd("finished");

        return;
    }

    props.onStepChange(props.step + 1);
};

const add = () => {
    props.onAdd();

    if (!prompt.value) return;

    prompt.value = false;
    props.onStepChange(props.step + 1);
    guide.value = true;
};

const start = () => {
    props.onStart();
    guide.value = true;
};
</script>

<template>
    <div :class="[styles.root, layerClass]">
        <PageControlRow>
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
        </PageControlRow>

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
                        <Button @click="props.onEnd('skipped')">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Skip</PageButtonContent>
                            </template>
                        </Button>

                        <Button :is-disabled="isFirstStep" @click="props.onStepChange(step - 1)">
                            <template #renderContent="flags">
                                <PageButtonContent :flags="flags">Back</PageButtonContent>
                            </template>
                        </Button>

                        <Button @click="current.isWaitingForUser ? handOverToUser() : next()">
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
    </div>
</template>
