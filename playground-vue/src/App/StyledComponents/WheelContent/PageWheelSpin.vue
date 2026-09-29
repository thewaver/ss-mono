<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageWheelSpinProps } from "./WheelContent.types";

defineProps<PageWheelSpinProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.wheelSpin,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ phase === "spinning" || phase === "settling" ? "…" : "Spin" }}
    </div>
</template>
