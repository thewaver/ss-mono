<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionWrapperProps } from "./AccordionContentVue.types";

defineProps<AccordionWrapperProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.accordionWrapper,
            layerClass,
            flags.isExpanded && styles.isExpanded,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <slot />
    </div>
</template>
