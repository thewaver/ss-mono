<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContent.types";

defineProps<ScrollerButtonContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.scrollerButton,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        {{ step === "previous" ? "‹" : "›" }}
    </div>
</template>
