<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableDetailContentProps } from "./TableContentVue.types";

defineProps<TableDetailContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.tableDetailContent,
            layerClass,
            renderProps.isSelected && styles.isSelected,
            renderProps.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
