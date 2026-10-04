<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectOptionContentProps } from "./SelectOptionContent.types";

defineProps<SelectOptionContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectOptionContent,
            layerClass,
            !isGliding && flags.isHovered && styles.isHovered,
            !isGliding && flags.isHighlighted && styles.isHighlighted,
            flags.isSelected && styles.isSelected,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div :class="styles.selectOptionText">
            <div><slot /></div>

            <div v-if="description" :class="styles.selectOptionDescription">{{ description }}</div>
        </div>

        <div :class="styles.selectOptionMark" aria-hidden="true">✓</div>
    </div>
</template>
