<script setup lang="ts">
import { type ComponentPublicInstance, shallowRef } from "vue";

import { Button, Menu, toElement } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS, NOTHING_RUN } from "../MenuPageVue.const";
import type { Action } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const isOpen = shallowRef(false);
const anchorRef = shallowRef<HTMLElement>();
const lastRun = shallowRef(NOTHING_RUN);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const setAnchorRef = (target: Element | ComponentPublicInstance | null) => {
    anchorRef.value = toElement(target);
};
</script>

<template>
    <Menu
        v-model:visibility="isOpen"
        :anchor-ref="anchorRef"
        :items="ACTIONS"
        ariaLabel="Edit actions"
        @activate="(action: Action) => (lastRun = action.name)"
    >
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <MenuActionItem :item="item" :flags="flags" />
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>

    <Button id="menuToggle" :ref="setAnchorRef" @click="toggle">
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags">{{ isOpen ? "Close it" : "Open it" }}</PageControlButtonContent>
        </template>
    </Button>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
