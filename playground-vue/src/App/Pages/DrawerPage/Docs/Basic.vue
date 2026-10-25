<script setup lang="ts">
import { shallowRef } from "vue";

import { Button, Drawer } from "@thewaver/ss-components-vue";
import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import type { DrawerBasicDocsExampleProps } from "../DrawerPageVue.types";

type Props = DrawerBasicDocsExampleProps;

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
    <Button id="openDrawer" @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open drawer</PageButtonContent>
        </template>
    </Button>

    <Drawer
        v-model:visibility="visibility"
        :edge="edge"
        :transition-duration-ms="transitionDurationMs"
        ariaLabel="Trees"
    >
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs: overlayTransitionDurationMs }">
            <PageModalOverlay
                :visibility-target="visibilityTarget"
                :transition-duration-ms="overlayTransitionDurationMs"
            />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs: panelTransitionDurationMs }">
            <PageDrawerPanel
                :edge="edge"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="panelTransitionDurationMs"
            >
                <div>Attached to the {{ edge }} edge.</div>

                <Button v-for="caption in ['First', 'Second']" :key="caption">
                    <template #renderContent="flags">
                        <PageButtonContent :flags="flags">{{ caption }}</PageButtonContent>
                    </template>
                </Button>

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
