<script setup lang="ts">
import { ContextMenu } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import MenuActionItem from "../MenuActionItem.vue";
import { ACTIONS } from "../MenuPage.const";
import type { MenuExampleProps } from "../MenuPage.types";
import MenuPopup from "../MenuPopup.vue";

type Props = MenuExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <ContextMenu :items="ACTIONS" ariaLabel="Edit actions" regionAriaLabel="Editing area" @activate="props.onActivate">
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
</template>
