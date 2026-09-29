<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormFieldContent/FormFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FormFieldMessageProps } from "./FormFieldContent.types";

defineProps<FormFieldMessageProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.formFieldMessage, layerClass, state.hasError && styles.hasError]">
        <slot />
    </div>
</template>
