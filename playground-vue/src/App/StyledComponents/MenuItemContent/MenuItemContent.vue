<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { MenuItemContentProps } from "./MenuItemContent.types";

const SUBMENU_MARK = "›";
const CHECKED_MARK = "✓";
const PICKED_MARK = "●";

defineProps<MenuItemContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.menuItemContent,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isHighlighted && styles.isHighlighted,
            flags.isOpen && styles.isOpen,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div v-if="kind !== undefined && kind !== 'command'" :class="styles.menuItemMark" aria-hidden="true">
            {{ flags.isChecked ? (kind === "radio" ? PICKED_MARK : CHECKED_MARK) : "" }}
        </div>

        <div><slot /></div>

        <div v-if="shortcut" :class="styles.menuItemShortcut">{{ shortcut }}</div>

        <div v-if="flags.hasSubmenu" :class="styles.menuItemSubmenuMark" aria-hidden="true">
            {{ SUBMENU_MARK }}
        </div>
    </div>
</template>
