<script setup lang="ts">
import { EXPANDER_MARKERS } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableExpanderProps } from "./TableContentVue.types";

defineProps<TableExpanderProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.tableRowExpander, layerClass]">
        {{ renderProps.isExpanded ? EXPANDER_MARKERS.open : EXPANDER_MARKERS.closed }}
    </div>
</template>
