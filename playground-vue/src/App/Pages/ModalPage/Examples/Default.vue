<script setup lang="ts">
import { h, useModel } from "vue";

import { Button, Modal } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.css";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { ModalExampleProps } from "../ModalPage.types";

const MODAL_TITLE_ID = "modal-page-title";
const FOCUS_CAPTIONS = ["Focus 1", "Focus 2", "Focus 3"];

type Props = ModalExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const tooltipDefs: InteractionTooltipDefs = {
    placement: { x: "center", y: "top-out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "Click me to open a Modal."),
};

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <Button id="openModal" :tooltip-defs="tooltipDefs" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open Modal</PageButtonContent>
        </template>
    </Button>

    <Modal v-model:visibility="visibility" :ariaLabelledBy="MODAL_TITLE_ID">
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
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
