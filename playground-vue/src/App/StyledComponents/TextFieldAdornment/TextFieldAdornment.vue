<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldAdornment/TextFieldAdornment.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldAdornmentProps } from "./TextFieldAdornment.types";

defineProps<TextFieldAdornmentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.textFieldAdornment,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
