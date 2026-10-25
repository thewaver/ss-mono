<script setup lang="ts">
import { shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS, NOTHING_RUN } from "../MenuPageVue.const";
import type { Action, MenuBasicDocsExampleProps } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuBasicDocsExampleProps;

defineProps<Props>();

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <Menu
        :items="ACTIONS"
        :is-disabled="isDisabled"
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

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
