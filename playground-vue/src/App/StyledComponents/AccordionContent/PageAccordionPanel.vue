<script setup lang="ts">
import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionPanelProps } from "./AccordionContentVue.types";

defineProps<AccordionPanelProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.accordionPanel,
            layerClass,
            visibilityTarget === 1 && styles.panelJoins[side ?? COLLAPSIBLE_DEFAULTS.side],
        ]"
        :style="{
            opacity: visibilityTarget,
            transition: `opacity ${transitionDurationMs}ms`,
        }"
    >
        <slot />
    </div>
</template>
