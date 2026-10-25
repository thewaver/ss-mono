<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Modal } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import type { ModalBasicDocsExampleProps } from "../ModalPageVue.types";

const MODAL_TITLE_ID = "modal-page-title";
const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

type Props = ModalBasicDocsExampleProps;

defineProps<Props>();

const visibility = shallowRef(false);

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <Button id="openModal" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open Modal</PageButtonContent>
        </template>
    </Button>

    <Modal
        v-model:visibility="visibility"
        :alignment="alignment"
        :transition-duration-ms="transitionDurationMs"
        :ariaLabelledBy="MODAL_TITLE_ID"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs: overlayTransitionDurationMs }">
            <PageModalOverlay
                :visibility-target="visibilityTarget"
                :transition-duration-ms="overlayTransitionDurationMs"
            />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs: panelTransitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="panelTransitionDurationMs">
                <div :id="MODAL_TITLE_ID">I am a Modal.</div>
                <div>And I focus trap!</div>

                <div :class="styles.buttons">
                    <Button v-for="caption in FOCUS_CAPTIONS" :key="caption">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">{{ caption }}</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </PageModalPanel>
        </template>
    </Modal>
</template>
