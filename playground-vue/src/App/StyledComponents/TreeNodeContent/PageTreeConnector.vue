<script setup lang="ts">
import { computed } from "vue";

import { PlacementUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeConnectorProps } from "./TreeNodeContentVue.types";

const props = defineProps<TreeConnectorProps>();

const layerClass = useLayerClass();

const line = computed(() => {
    const defs = props.defs;

    return defs.from === undefined || defs.to === undefined
        ? undefined
        : PlacementUtils.getLinkPath(defs.from, defs.to);
});
</script>

<template>
    <svg v-if="line" :class="[styles.treeConnector, layerClass]" viewBox="0 0 1 1" aria-hidden="true">
        <path :class="styles.treeConnectorPath" :d="line" />
    </svg>
</template>
