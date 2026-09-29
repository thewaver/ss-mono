<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionHeaderProps } from "./AccordionContent.types";

defineProps<AccordionHeaderProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.accordionHeader,
            layerClass,
            flags.isExpanded && styles.isExpanded,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div><slot /></div>

        <div :class="styles.accordionMarker" aria-hidden="true">▶</div>
    </div>
</template>
