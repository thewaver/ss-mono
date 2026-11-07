<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectOptionContentProps } from "./SelectOptionContentVue.types";

withDefaults(defineProps<SelectOptionContentProps>(), { hasMark: true });

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectOptionContent,
            layerClass,
            hasHoverFloater && styles.hasHoverFloater,
            hasSelectionFloater && styles.hasSelectionFloater,
            (flags.isHovered || flags.isHighlighted) && styles.isHovered,
            flags.isSelected && styles.isSelected,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div :class="styles.selectOptionText">
            <div><slot /></div>

            <div v-if="description" :class="styles.selectOptionDescription">{{ description }}</div>
        </div>

        <div v-if="shortcut" :class="styles.selectOptionShortcut">{{ shortcut }}</div>

        <div v-if="hasMark" :class="styles.selectOptionMark" aria-hidden="true">✓</div>
    </div>
</template>
