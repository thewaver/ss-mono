<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, useModel } from "vue";

import { Button, Modal, toElement } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalHint from "../../../StyledComponents/ModalPanel/PageModalHint.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import type { ModalDestructiveExampleProps } from "../ModalPage.types";

const ALERT_TITLE_ID = "modal-page-alert-title";
const ALERT_BODY_ID = "modal-page-alert-body";

type Props = ModalDestructiveExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const cancelRef = shallowRef<HTMLElement>();

const setCancelRef = (target: Element | ComponentPublicInstance | null) => {
    cancelRef.value = toElement(target);
};

const decide = (outcome: string) => {
    props.onDecide(outcome);
    visibility.value = false;
};

const open = () => {
    props.onDecide("nothing decided yet");
    visibility.value = true;
};
</script>

<template>
    <Button @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Delete the project</PageButtonContent>
        </template>
    </Button>

    <Modal
        v-model:visibility="visibility"
        role="alertdialog"
        :initial-focus-ref="cancelRef"
        :is-dismissable-on-overlay-click="false"
        :is-dismissable-on-escape="false"
        :ariaLabelledBy="ALERT_TITLE_ID"
        :ariaDescribedBy="ALERT_BODY_ID"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :id="ALERT_TITLE_ID">Delete this project?</div>

                <PageModalHint :id="ALERT_BODY_ID">
                    Clicking the overlay and pressing Escape both do nothing here — an alert has to be answered.
                </PageModalHint>

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
</template>
