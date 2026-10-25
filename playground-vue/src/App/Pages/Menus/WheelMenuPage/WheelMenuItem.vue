<script setup lang="ts">
import { PlacementUtils } from "@thewaver/ss-components-vue";
import type { PlacementRect } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { SUBMENU_MARK } from "./WheelMenuPageVue.const";
import type { WheelMenuItemProps } from "./WheelMenuPageVue.types";

const HALF = 0.5;

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

defineProps<WheelMenuItemProps>();
</script>

<template>
    <template v-if="placement?.sector">
        <svg :class="styles.canvas" :viewBox="toViewBox(placement)" aria-hidden="true">
            <path
                :class="[styles.wedge, flags.isDisabled && styles.wedgeDisabled]"
                :style="{ fill: flags.isHighlighted ? `url(#${gradientId})` : undefined }"
                :d="PlacementUtils.getSectorPath(placement.sector)"
            />
        </svg>

        <div :class="[styles.label, flags.isHighlighted && styles.labelHighlighted]">
            <span>{{ item.value.name }}</span>

            <span v-if="item.value.shortcut" :class="styles.shortcut">{{ item.value.shortcut }}</span>

            <span v-if="flags.hasSubmenu" aria-hidden="true">{{ SUBMENU_MARK }}</span>
        </div>
    </template>
</template>
