<script setup lang="ts">
import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionHeaderProps } from "./AccordionContentVue.types";

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
            flags.isExpanded && styles.headerJoins[side ?? COLLAPSIBLE_DEFAULTS.side],
        ]"
    >
        <div><slot /></div>

        <div :class="styles.accordionMarker" :data-side="side" aria-hidden="true">▶</div>
    </div>
</template>
