<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

import { BACK_MARK, SUBMENU_MARK } from "./FanMenuPageVue.const";
import type { FanMenuItemProps } from "./FanMenuPageVue.types";

defineProps<FanMenuItemProps>();
</script>

<template>
    <div
        :class="[
            styles.item,
            flags.isBack && styles.itemBack,
            flags.isHighlighted && styles.itemHighlighted,
            flags.isDisabled && styles.itemDisabled,
        ]"
    >
        <span v-if="flags.isBack" aria-hidden="true">{{ BACK_MARK }}</span>

        <span>{{ item.value.name }}</span>

        <span v-if="!flags.isBack && item.value.shortcut" :class="styles.shortcut">{{ item.value.shortcut }}</span>

        <span v-if="flags.hasSubmenu" aria-hidden="true">{{ SUBMENU_MARK }}</span>
    </div>
</template>
