<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldButtonContent/TextFieldButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldButtonContentProps } from "./TextFieldButtonContentVue.types";

defineProps<TextFieldButtonContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.textFieldButtonContent,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
