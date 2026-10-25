<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { NavigatorVueUtils } from "@thewaver/ss-components-vue";
import { EXPANDER_MARKERS } from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TableContent/TableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TableExpanderProps } from "./TableContentVue.types";

const props = defineProps<TableExpanderProps>();

const layerClass = useLayerClass();

const root = shallowRef<HTMLElement>();
const direction = NavigatorVueUtils.useDirection(root);

const marker = computed(() => {
    if (props.renderProps.isExpanded) return EXPANDER_MARKERS.open;

    return direction.value === "rtl" ? EXPANDER_MARKERS.closedRightToLeft : EXPANDER_MARKERS.closed;
});
</script>

<template>
    <div ref="root" :class="[styles.tableRowExpander, layerClass]">
        {{ marker }}
    </div>
</template>
