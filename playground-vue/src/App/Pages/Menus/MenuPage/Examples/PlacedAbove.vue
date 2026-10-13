<script setup lang="ts">
import { Menu } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPageVue.const";
import type { MenuExampleProps } from "../MenuPageVue.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Menu
        :items="ACTIONS"
        ariaLabel="Edit actions"
        :placement="{ x: 'left_in', y: 'top_out' }"
        @activate="props.onActivate"
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
</template>
