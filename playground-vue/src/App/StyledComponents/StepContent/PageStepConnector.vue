<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/StepContent/StepContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { StepConnectorProps } from "./StepContent.types";

const props = defineProps<StepConnectorProps>();

const layerClass = useLayerClass();

const columnClass = computed(() => (props.isRail === true ? styles.columnRailConnector : styles.columnConnector));
</script>

<template>
    <span :class="[orientation === 'horizontal' ? styles.rowConnector : columnClass, layerClass]" />
</template>
