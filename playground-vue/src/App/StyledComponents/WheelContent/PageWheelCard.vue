<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageWheelCardProps } from "./WheelContent.types";

defineProps<PageWheelCardProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.wheelCard,
            layerClass,
            state.face === 'back' && styles.wheelCardBack,
            state.isSelected && styles.isSelected,
        ]"
    >
        <template v-if="state.face === 'front'">
            <div :class="styles.wheelCardRank">{{ rank ?? state.index + 1 }}</div>

            <slot />
        </template>
    </div>
</template>
