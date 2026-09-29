<script setup lang="ts">
import { computed } from "vue";

import { PlacementUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { StepArcConnectorProps } from "./StepContent.types";

const props = defineProps<StepArcConnectorProps>();

const layerClass = useLayerClass();

const run = computed(() => {
    const defs = props.defs;

    return defs.from === undefined || defs.to === undefined
        ? undefined
        : PlacementUtils.getLinkPath(defs.from, defs.to, defs.origin, defs.radii);
});
</script>

<template>
    <svg v-if="run" :class="[styles.arcConnector, layerClass]" viewBox="0 0 1 1" aria-hidden="true">
        <path :class="styles.arcConnectorPath" :d="run" />
    </svg>
</template>
