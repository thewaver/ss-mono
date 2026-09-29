<script setup lang="ts">
import { useModel } from "vue";

import { Button, Drawer } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.vue";
import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.vue";
import type { DrawerExampleProps } from "../DrawerPage.types";

type Props = DrawerExampleProps;

const props = defineProps<Props>();

const visibility = useModel(props, "visibility");

const open = () => {
    visibility.value = true;
};

const close = () => {
    visibility.value = false;
};
</script>

<template>
    <Button @click="open">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Open {{ edge }}</PageButtonContent>
        </template>
    </Button>

    <Drawer v-model:visibility="visibility" :edge="edge" :ariaLabel="`${edge} drawer`">
        <template #renderOverlay="{ visibilityTarget, transitionDurationMs }">
            <PageModalOverlay :visibility-target="visibilityTarget" :transition-duration-ms="transitionDurationMs" />
        </template>

        <template #renderContent="{ visibilityTarget, transitionDurationMs }">
            <PageDrawerPanel
                :edge="edge"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
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

                <div v-for="caption in fillers" :key="caption">{{ caption }}</div>
            </PageDrawerPanel>
        </template>
    </Drawer>
</template>
