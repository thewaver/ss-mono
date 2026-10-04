<script setup lang="ts">
import { Menu } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageMenuItemContent from "../../../../StyledComponents/MenuItemContent/MenuItemContent.vue";
import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.vue";
import { ACTIONS } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <Menu :items="ACTIONS" ariaLabel="Edit actions, gliding" @activate="props.onActivate">
        <template #renderContent="flags">
            <PageMenuTriggerContent :flags="flags">Edit</PageMenuTriggerContent>
        </template>

        <template #renderItem="{ item, flags }">
            <PageMenuItemContent
                :flags="{ ...flags, isHovered: false, isHighlighted: false }"
                :kind="item.kind"
                :shortcut="item.value.shortcut ?? ''"
                >{{ item.value.name }}</PageMenuItemContent
            >
        </template>

        <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
            <PageGlideFloater
                kind="highlight"
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
            />
        </template>

        <template #renderPopup="popup">
            <MenuPopup v-bind="popup" />
        </template>
    </Menu>
</template>
