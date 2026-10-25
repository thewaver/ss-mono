<script setup lang="ts">
import { shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ZOOM_ACTIONS, ZOOM_RESET_PERCENT, ZOOM_STEPS, ZOOM_STEP_PERCENT } from "../MenuPageVue.const";
import type { Action } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const zoomPercent = shallowRef(ZOOM_RESET_PERCENT);

const zoom = (action: Action) => {
    const step = ZOOM_STEPS[action.name];

    zoomPercent.value = step === undefined ? ZOOM_RESET_PERCENT : Math.max(zoomPercent.value + step, ZOOM_STEP_PERCENT);
};
</script>

<template>
    <Menu :items="ZOOM_ACTIONS" ariaLabel="Zoom actions" @activate="zoom">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Zoom</PageMenuTriggerContent>
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Zoom: ${zoomPercent}%` }}</div>
</template>
