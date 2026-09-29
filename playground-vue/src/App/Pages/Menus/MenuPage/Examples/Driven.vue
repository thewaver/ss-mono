<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef, useModel } from "vue";

import { Button, Menu, toElement } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPage.const";
import type { MenuDrivenExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuDrivenExampleProps;

const props = defineProps<Props>();

const anchorRef = shallowRef<HTMLElement>();

const isOpen = useModel(props, "visibility");

const setAnchorRef = (target: Element | ComponentPublicInstance | null) => {
    anchorRef.value = toElement(target);
};

const toggle = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <Menu
        v-model:visibility="isOpen"
        :anchor-ref="anchorRef"
        :items="ACTIONS"
        ariaLabel="Edit actions"
        @activate="props.onActivate"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>

    <Button id="menuToggle" :ref="setAnchorRef" ariaLabel="Toggle the menu from outside" @click="toggle">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">{{ isOpen ? "Close it" : "Open it" }}</PageButtonContent>
        </template>
    </Button>
</template>
