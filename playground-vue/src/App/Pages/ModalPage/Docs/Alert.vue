<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef } from "vue";

import { Button, Modal, toElement } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { NOTHING_DECIDED } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalHint from "../../../StyledComponents/ModalPanel/PageModalHint.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import type { ModalAlertDocsExampleProps } from "../ModalPageVue.types";

const ALERT_TITLE_ID = "modal-page-alert-title";
const ALERT_BODY_ID = "modal-page-alert-body";

type Props = ModalAlertDocsExampleProps;

defineProps<Props>();

const visibility = shallowRef(false);
const outcome = shallowRef(NOTHING_DECIDED);
const cancelRef = shallowRef<HTMLElement>();

const setCancelRef = (target: Element | ComponentPublicInstance | null) => {
    cancelRef.value = toElement(target);
};

const decide = (next: string) => {
    outcome.value = next;
    visibility.value = false;
};

const open = () => {
    outcome.value = NOTHING_DECIDED;
    visibility.value = true;
};
</script>

<template>
    <Button id="openAlert" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Delete the project</PageButtonContent>
        </template>
    </Button>

    <Modal
        v-model:visibility="visibility"
        role="alertdialog"
        :initial-focus-ref="cancelRef"
        :is-dismissable-on-overlay-click="isDismissableOnOverlayClick"
        :is-dismissable-on-escape="isDismissableOnEscape"
        :ariaLabelledBy="ALERT_TITLE_ID"
        :ariaDescribedBy="ALERT_BODY_ID"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :id="ALERT_TITLE_ID">Delete this project?</div>

                <PageModalHint :id="ALERT_BODY_ID">Everything in it goes, and it cannot be undone.</PageModalHint>

                <div :class="styles.buttons">
                    <Button @click="decide('deleted')">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Delete</PageButtonContent>
                        </template>
                    </Button>

                    <Button :ref="setCancelRef" @click="decide('canceled')">
                        <template #renderContent="flags">
                            <PageButtonContent :flags="flags">Cancel</PageButtonContent>
                        </template>
                    </Button>
                </div>
            </PageModalPanel>
        </template>
    </Modal>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Outcome: ${outcome}` }}</div>
</template>
