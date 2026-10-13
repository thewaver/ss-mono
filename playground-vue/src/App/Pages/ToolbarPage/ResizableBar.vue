<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import { NO_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { ResizableBarProps } from "./ToolbarPageVue.types";

const props = defineProps<ResizableBarProps>();

const resizerRef = shallowRef<HTMLDivElement>();

const layerClass = useLayerClass();

const size = ElementObserverVueUtils.useBorderBoxSize(resizerRef);

const measuredWidth = computed(() => Math.round(size.value.width));

watch(measuredWidth, (next) => {
    if (next > NO_WIDTH) props.onResize(next);
});
</script>

<template>
    <div ref="resizerRef" :class="styles.resizer" :style="{ width: `${width}px` }">
        <div :class="[styles.bar, layerClass]"><slot /></div>
    </div>
</template>
