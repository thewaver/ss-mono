<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef } from "vue";

import { Button, SpotlightPrompt, toElement } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsVue.types";

type Props = SpotlightBasicDocsExampleProps;

defineProps<Props>();

const visibility = shallowRef(false);
const bought = shallowRef(0);
const anchorRef = shallowRef<HTMLElement>();

const setAnchorRef = (target: Element | ComponentPublicInstance | null) => {
    anchorRef.value = toElement(target);
};

const buy = () => {
    if (!visibility.value) return;

    bought.value += 1;
    visibility.value = false;
};

const insist = () => {
    visibility.value = true;
};
</script>

<template>
    <div :class="styles.root">
        <Button id="promptBuy" :ref="setAnchorRef" @click="buy">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Buy the potato</PageButtonContent>
            </template>
        </Button>

        <Button id="promptInsist" @click="insist">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Insist</PageButtonContent>
            </template>
        </Button>

        <SpotlightPrompt
            v-model:visibility="visibility"
            :element-ref="anchorRef"
            :padding="padding"
            :transition-duration-ms="transitionDurationMs"
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
        </SpotlightPrompt>

        <div :class="exampleStyles.exampleReadout" data-readout>{{ `Bought: ${bought}` }}</div>
    </div>
</template>
