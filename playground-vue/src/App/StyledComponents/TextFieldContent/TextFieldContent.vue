<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContentVue.types";

defineProps<TextFieldContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.textFieldContent,
            layerClass,
            isStretched && styles.isStretched,
            flags.isHovered && styles.isHovered,
            flags.isReadOnly && styles.isReadOnly,
            flags.isDisabled && styles.isDisabled,
            flags.hasError && styles.hasError,
        ]"
        :style="{
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
        }"
    />
</template>
