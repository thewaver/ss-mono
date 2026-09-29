<script setup lang="ts">
import { useModel } from "vue";

import { Button, Modal } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.vue";
import type { ModalExampleProps } from "../ModalPage.types";

const TEXT_ONLY_TITLE_ID = "modal-page-text-only-title";

type Props = ModalExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const open = () => {
    visibility.value = true;
};
</script>

<template>
    <Button @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open notice</PageButtonContent>
        </template>
    </Button>

    <Modal v-model:visibility="visibility" :ariaLabelledBy="TEXT_ONLY_TITLE_ID">
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageModalPanel :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs">
                <div :id="TEXT_ONLY_TITLE_ID">Nothing in here can be clicked.</div>
                <div>So I hold focus myself. Press Escape to close me.</div>
            </PageModalPanel>
        </template>
    </Modal>
</template>
