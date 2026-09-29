<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectClear/SelectClear.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectClearProps } from "./SelectClear.types";

defineProps<SelectClearProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.selectClear,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        ×
    </div>
</template>
