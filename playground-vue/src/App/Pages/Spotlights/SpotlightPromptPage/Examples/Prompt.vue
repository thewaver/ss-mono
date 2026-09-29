<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, useModel } from "vue";

import { Button, SpotlightPrompt, toElement } from "@thewaver/ss-components-vue";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import SpotlightHighlight from "../../SpotlightHighlight.vue";
import SpotlightOverlay from "../../SpotlightOverlay.vue";
import type { SpotlightPromptExampleProps } from "../../Spotlights.types";

type Props = SpotlightPromptExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const anchorRef = shallowRef<HTMLElement>();

const setAnchorRef = (target: Element | ComponentPublicInstance | null) => {
    anchorRef.value = toElement(target);
};

const buy = async () => {
    if (!visibility.value) return;

    props.onBuy();
    visibility.value = false;
};

const insist = async () => {
    visibility.value = true;
};
</script>

<template>
    <div :class="styles.root">
        <Button :ref="setAnchorRef" @click="buy">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Buy the potato</PageButtonContent>
            </template>
        </Button>

        <Button @click="insist">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">Insist</PageButtonContent>
            </template>
        </Button>

        <SpotlightPrompt v-model:visibility="visibility" :element-ref="anchorRef" :padding="PADDING">
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
