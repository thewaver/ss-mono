<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Drawer } from "@thewaver/ss-components-vue";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import type { DrawerSwipeDocsExampleProps } from "../DrawerPageVue.types";

type Props = DrawerSwipeDocsExampleProps;

defineProps<Props>();

const visibility = shallowRef(false);

const open = () => {
    visibility.value = true;
};

const close = () => {
    visibility.value = false;
};
</script>

<template>
    <Button id="openSheet" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open sheet</PageButtonContent>
        </template>
    </Button>

    <Drawer
        v-model:visibility="visibility"
        edge="bottom"
        :is-dismissable-on-overlay-click="isDismissableOnOverlayClick"
        ariaLabel="Trees"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageDrawerPanel
                edge="bottom"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
            >
                <div>Attached to the bottom edge.</div>

                <Button @click="close">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">Close</PageButtonContent>
                    </template>
                </Button>

                <div v-for="caption in FILLERS" :key="caption">{{ caption }}</div>
            </PageDrawerPanel>
        </template>
    </Drawer>
</template>
