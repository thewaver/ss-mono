<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldPlaceholderProps } from "./TextFieldPlaceholder.types";

defineProps<TextFieldPlaceholderProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.textFieldPlaceholder,
            layerClass,
            isTopAligned && styles.isTopAligned,
            flags.isEmpty && styles.isEmpty,
        ]"
        aria-hidden="true"
    >
        <slot />
    </div>
</template>
