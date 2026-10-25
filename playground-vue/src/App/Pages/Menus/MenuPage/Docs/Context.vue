<script setup lang="ts">
import { shallowRef } from "vue";

import { ContextMenu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS, NOTHING_RUN } from "../MenuPageVue.const";
import type { Action } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <ContextMenu
        :items="ACTIONS"
        ariaLabel="Edit actions"
        regionAriaLabel="Editing area"
        @activate="(action: Action) => (lastRun = action.name)"
    >
        <template #renderRegion>
            <div :class="styles.contextRegion">Right-click anywhere in this box</div>
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
    </ContextMenu>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
