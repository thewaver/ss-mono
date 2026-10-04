<script setup lang="ts">
import { Menu } from "@thewaver/ss-components-vue";
import type { MenuItem } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPage.const";
import type { Action, MenuExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps & { items?: MenuItem<Action>[]; caption?: string };

const props = defineProps<Props>();
</script>

<template>
    <Menu :items="items ?? ACTIONS" ariaLabel="Edit actions" @activate="props.onActivate">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">{{ caption ?? "Edit" }}</PageMenuTriggerContent>
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
