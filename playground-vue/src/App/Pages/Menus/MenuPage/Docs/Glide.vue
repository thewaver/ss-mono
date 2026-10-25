<script setup lang="ts">
import { shallowRef } from "vue";

import { Menu } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuItemContent from "../../../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import { ACTIONS, NOTHING_RUN } from "../MenuPageVue.const";
import type { Action, MenuGlideDocsExampleProps } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuGlideDocsExampleProps;

defineProps<Props>();

const lastRun = shallowRef(NOTHING_RUN);
</script>

<template>
    <Menu :items="ACTIONS" ariaLabel="Edit actions" @activate="(action: Action) => (lastRun = action.name)">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <PageMenuItemContent
                :is-gliding="isGliding"
                :flags="flags"
                :kind="item.kind"
                :shortcut="item.value.shortcut ?? ''"
                >{{ item.value.name }}</PageMenuItemContent
            >
        </template>

        <template v-if="isGliding" #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last run: ${lastRun}` }}</div>
</template>
