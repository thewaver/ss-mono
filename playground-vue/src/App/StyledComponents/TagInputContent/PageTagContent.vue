<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TagInputContent/TagInputContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TagContentProps } from "./TagInputContent.types";

defineProps<TagContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.tagContent,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isFocusVisible && styles.isFocused,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />

        <span :class="styles.tagRemove" aria-hidden="true">✕</span>
    </div>
</template>
